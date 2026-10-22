"""Publish a source news record while preserving newer production records and modules."""
import argparse
import ftplib
import getpass
import hashlib
import html
import io
import json
from pathlib import Path, PurePosixPath
import re
import ssl


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--slug", required=True)
parser.add_argument("--release", required=True)
parser.add_argument("--host", required=True)
parser.add_argument("--user", required=True)
parser.add_argument("--backup", type=Path, required=True)
args = parser.parse_args()
if not all(re.fullmatch(r"[a-z0-9-]+", value) for value in [args.slug, args.release]):
    raise ValueError("Only slug-safe identifiers are allowed")

root = Path(__file__).resolve().parent.parent
source = root / "src/content/cms/news" / (args.slug + ".json")
record = json.loads(source.read_text(encoding="utf-8"))
if record["slug"] != args.slug or not isinstance(record["content"], list):
    raise ValueError("Unexpected source record")
news_key = "/assets/news-CLfDRxhV.js"
route_dirs = {"about", "clusters", "committees", "events", "frolov", "members", "news", "projects", "publications", "videos"}
map_pattern = rb'<script type="importmap">(.*?)</script>'

password = getpass.getpass("FTPS password (not saved): ")


def connect():
    connection = ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=40)
    connection.connect(args.host, 21)
    connection.login(args.user, password)
    connection.prot_p()
    connection.cwd("/")
    return connection


ftp = connect()


def digest(data):
    return hashlib.sha256(data).hexdigest() if data is not None else None


def retrieve(path):
    global ftp
    for attempt in range(3):
        result = io.BytesIO()
        try:
            ftp.retrbinary("RETR " + path, result.write)
            return result.getvalue()
        except ftplib.error_perm as error:
            if str(error).startswith("550"):
                return None
            raise
        except (EOFError, OSError, ftplib.error_temp):
            if attempt == 2:
                raise
            ftp.close()
            ftp = connect()


def upload(path, data):
    global ftp
    for attempt in range(3):
        try:
            ftp.storbinary("STOR " + path, io.BytesIO(data))
            return
        except (EOFError, OSError, ftplib.error_temp):
            if attempt == 2:
                raise
            ftp.close()
            ftp = connect()


def html_files(directory=""):
    files = []
    for name, facts in ftp.mlsd(directory or "."):
        if name in {".", ".."} or "/" in name or "\\" in name:
            continue
        path = str(PurePosixPath(directory) / name)
        if facts.get("type") == "file" and name.endswith(".html"):
            files.append(path)
        elif facts.get("type") == "dir" and ((not directory and name in route_dirs) or (directory and name not in {"files", "images", "uploads"})):
            files.extend(html_files(path))
    return sorted(files)


manifest_file = args.backup / "manifest.json"
if manifest_file.exists():
    manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
else:
    homepage = retrieve("index.html")
    mapping = json.loads(re.search(map_pattern, homepage, re.S)[1])
    previous = mapping["imports"][news_key]
    main_module = re.search(rb'<script type="module"[^>]*src="([^"]+)"', homepage)[1].decode()
    main_bytes = retrieve(main_module.split("?", 1)[0].lstrip("/"))
    if b"r as l" not in main_bytes or not previous.startswith("/assets/"):
        raise RuntimeError("Production exports changed; inspect the news and React dependencies")
    payload = json.dumps(record, ensure_ascii=False, separators=(",", ":"))
    adapter_path = "/assets/news-content-" + args.release + "-" + digest(payload.encode())[:10] + ".js"
    if previous == adapter_path:
        raise RuntimeError("This source record is already deployed")
    # The legacy route supports React nodes in callout text. Build a real React
    # element with the production React instance; source builds render url directly.
    adapter = fr'''// Compatibility adapter for the current production runtime.
import {{ t as currentNews }} from {json.dumps(previous)};
import {{ l as requireReact }} from {json.dumps(main_module)};
const React = requireReact();
const update = {payload};
update.content = update.content.map(block => block && typeof block === "object" && block.type === "callout" && /^https:\/\//.test(block.url || "")
  ? {{ ...block, text: React.createElement(React.Fragment, null, block.text,
      React.createElement("br"), React.createElement("a", {{ href: block.url, target: "_blank", rel: "noopener noreferrer", className: "mt-4 inline-flex text-base font-semibold text-primary hover:underline" }}, block.linkLabel || block.url)) }}
  : block);
const newsItems = currentNews.map(item => item.slug === update.slug ? {{ ...item, ...update }} : item);
export {{ newsItems as t }};
'''.encode("utf-8")

    def patch_document(original, name):
        def change_map(match):
            current = json.loads(match[1])
            if current["imports"].get(news_key) != previous:
                raise RuntimeError("Inconsistent production mapping: " + name)
            current["imports"][news_key] = adapter_path
            return b'<script type="importmap">' + json.dumps(current, separators=(",", ":")).encode() + b'</script>'
        if not re.search(map_pattern, original, re.S):
            raise RuntimeError("Missing production import map: " + name)
        updated = re.sub(map_pattern, change_map, original, flags=re.S)
        if name == f"news/{args.slug}/index.html":
            title = html.escape(record["title"] + " — АСКАО", quote=True).encode()
            description = html.escape(record["excerpt"], quote=True).encode()
            updated = re.sub(rb'<title>.*?</title>', lambda _: b'<title>' + title + b'</title>', updated, flags=re.S)
            for attribute in [b'name="description"', b'property="og:description"', b'name="twitter:description"']:
                pattern = rb'(<meta ' + re.escape(attribute) + rb' content=")[^"]*("\s*/?>)'
                updated = re.sub(pattern, lambda match: match[1] + description + match[2], updated)
            for attribute in [b'property="og:title"', b'name="twitter:title"']:
                pattern = rb'(<meta ' + re.escape(attribute) + rb' content=")[^"]*("\s*/?>)'
                updated = re.sub(pattern, lambda match: match[1] + title + match[2], updated)
            def change_schema(match):
                schema = json.loads(match[1])
                schema["description"] = record["excerpt"]
                if "headline" in schema:
                    schema["headline"] = record["title"]
                return b'<script type="application/ld+json" data-seo-structured-data="true">' + json.dumps(schema, ensure_ascii=False, separators=(",", ":")).encode() + b'</script>'
            updated = re.sub(rb'<script type="application/ld\+json" data-seo-structured-data="true">(.*?)</script>', change_schema, updated, flags=re.S)
        return updated

    candidates = [(adapter_path.lstrip("/"), adapter)]
    targets = html_files()
    if "index.html" not in targets or f"news/{args.slug}/index.html" not in targets:
        raise RuntimeError("Unexpected hosting root")
    candidates.extend((name, None) for name in targets)
    manifest = []
    for name, desired in candidates:
        original = retrieve(name)
        if desired is None:
            desired = patch_document(original, name)
        elif original is not None and desired != original:
            raise RuntimeError("Immutable adapter path already exists with different bytes")
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
    manifest_file.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    (args.backup / "release.json").write_text(json.dumps({"slug": args.slug, "previous": previous, "adapter": adapter_path, "source_sha256": digest(payload.encode()), "main_module": main_module}, indent=2), encoding="utf-8")

for entry in manifest:
    if digest(retrieve(entry["path"])) not in {entry["before"], entry["after"]}:
        raise RuntimeError("Production changed since preflight: " + entry["path"])
for entry in manifest:
    data = (args.backup / "planned" / entry["path"]).read_bytes()
    if digest(data) != entry["after"]:
        raise RuntimeError("Planned bytes changed: " + entry["path"])
    current = digest(retrieve(entry["path"]))
    if current == entry["after"]:
        continue
    if current != entry["before"]:
        raise RuntimeError("Production changed during upload: " + entry["path"])
    upload(entry["path"], data)
    if retrieve(entry["path"]) != data:
        raise RuntimeError("Upload mismatch: " + entry["path"])
    print("Verified:", entry["path"], flush=True)
ftp.quit()
print("News update verified; changed files:", len(manifest))
