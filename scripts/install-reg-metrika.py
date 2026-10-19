"""Install analytics without replacing the production site's newer runtime/content."""

import argparse
import ftplib
import getpass
import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import re
import ssl


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("action", choices=["plan", "apply", "rollback"])
parser.add_argument("--host", required=True)
parser.add_argument("--user", required=True)
parser.add_argument("--backup", type=Path, required=True)
args = parser.parse_args()

counter = "113671476"
script_path = "askao-metrika.js"
include = b'\n    <!-- Yandex.Metrika counter 113671476 -->\n    <script defer src="/askao-metrika.js?v=20261019"></script>'
fallback = b'\n    <noscript><div><img src="https://mc.yandex.ru/watch/113671476" style="position:absolute; left:-9999px;" alt="" /></div></noscript>'
route_dirs = {"about", "clusters", "committees", "events", "frolov", "members", "news", "projects", "publications", "videos"}

ftp = ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=40)
ftp.connect(args.host, 21)
ftp.login(args.user, getpass.getpass("FTPS password (not saved): "))
ftp.prot_p()
ftp.cwd("/")


def digest(data):
    return hashlib.sha256(data).hexdigest() if data is not None else None


def retrieve(name):
    result = io.BytesIO()
    try:
        ftp.retrbinary("RETR " + name, result.write)
    except ftplib.error_perm as error:
        if str(error).startswith("550"):
            return None
        raise
    return result.getvalue()


def upload(name, data):
    ftp.storbinary("STOR " + name, io.BytesIO(data))
    if retrieve(name) != data:
        raise RuntimeError("Upload verification failed: " + name)


def html_files(directory=""):
    result = []
    for name, facts in ftp.mlsd(directory or "."):
        if name in {".", ".."} or "/" in name or "\\" in name:
            continue
        path = str(PurePosixPath(directory) / name)
        if facts.get("type") == "file" and name.endswith(".html"):
            result.append(path)
        elif facts.get("type") == "dir":
            if (not directory and name in route_dirs) or (directory and name not in {"files", "images", "uploads"}):
                result.extend(html_files(path))
    return sorted(result)


def patch_html(original, name):
    if script_path.encode() in original:
        if original.count(script_path.encode()) != 1 or original.count(("mc.yandex.ru/watch/" + counter).encode()) != 1:
            raise RuntimeError("Unexpected existing analytics markup: " + name)
        return original
    if b"mc.yandex.ru/metrika/" in original or b"mc.yandex.ru/watch/" in original:
        raise RuntimeError("Existing counter needs manual reconciliation: " + name)
    if len(re.findall(rb"<head\b[^>]*>", original, re.I)) != 1 or len(re.findall(rb"<body\b[^>]*>", original, re.I)) != 1:
        raise RuntimeError("Unexpected HTML structure: " + name)
    updated = re.sub(rb"(<head\b[^>]*>)", lambda match: match[0] + include, original, count=1, flags=re.I)
    updated = re.sub(rb"(<body\b[^>]*>)", lambda match: match[0] + fallback, updated, count=1, flags=re.I)
    # The only changed bytes must be the two analytics additions.
    if updated.replace(include, b"", 1).replace(fallback, b"", 1) != original:
        raise RuntimeError("Content preservation check failed: " + name)
    return updated


manifest_path = args.backup / "manifest.json"
if args.action == "plan":
    if manifest_path.exists():
        raise RuntimeError("Use a fresh backup directory")
    targets = html_files()
    if "index.html" not in targets or "404.html" not in targets or "news/index.html" not in targets:
        raise RuntimeError("Unexpected hosting root; no changes made")
    manifest = []
    local_script = Path(__file__).resolve().parent.parent / "public" / script_path
    candidates = [(script_path, local_script.read_bytes())]
    candidates.extend((name, None) for name in targets)
    for name, desired in candidates:
        original = retrieve(name)
        if desired is None:
            if original is None:
                raise RuntimeError("HTML disappeared: " + name)
            desired = patch_html(original, name)
        if original == desired:
            continue
        if original is not None:
            saved = args.backup / "originals" / name
            saved.parent.mkdir(parents=True, exist_ok=True)
            saved.write_bytes(original)
        planned = args.backup / "planned" / name
        planned.parent.mkdir(parents=True, exist_ok=True)
        planned.write_bytes(desired)
        manifest.append({"path": name, "before": digest(original), "after": digest(desired)})
    args.backup.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print("Plan saved; public HTML files inspected:", len(targets))
    print("Files to update:", len(manifest))
    for entry in manifest:
        print(entry["path"])
elif args.action == "apply":
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    # Check every original before starting; a resumed upload may already match after.
    for entry in manifest:
        if digest(retrieve(entry["path"])) not in {entry["before"], entry["after"]}:
            raise RuntimeError("Production changed since the plan: " + entry["path"])
    for entry in manifest:
        desired = (args.backup / "planned" / entry["path"]).read_bytes()
        if digest(desired) != entry["after"]:
            raise RuntimeError("Planned bytes changed: " + entry["path"])
        current = retrieve(entry["path"])
        if digest(current) == entry["after"]:
            continue
        if digest(current) != entry["before"]:
            raise RuntimeError("Production changed during upload: " + entry["path"])
        upload(entry["path"], desired)
        print("Verified:", entry["path"], flush=True)
    print("Analytics installation verified:", len(manifest), "files")
else:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    for entry in reversed(manifest):
        current = digest(retrieve(entry["path"]))
        if current == entry["before"]:
            continue
        if current != entry["after"]:
            raise RuntimeError("Newer changes prevent rollback: " + entry["path"])
        if entry["before"] is not None:
            upload(entry["path"], (args.backup / "originals" / entry["path"]).read_bytes())
            print("Restored:", entry["path"], flush=True)
    print("Previous HTML restored; any newly added unreferenced analytics script is retained")
ftp.quit()
