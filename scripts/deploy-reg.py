"""Explicit FTPS deployment with a local rollback copy. Credentials are never saved."""
import argparse
import ftplib
import getpass
import hashlib
import io
import json
from pathlib import Path
import ssl

parser = argparse.ArgumentParser()
parser.add_argument("action", choices=["inspect", "deploy", "rollback"])
parser.add_argument("--host", required=True)
parser.add_argument("--user", required=True)
parser.add_argument("--remote-root", default="/")
parser.add_argument("--build", type=Path, default=Path("dist/client"))
parser.add_argument("--backup", type=Path, required=True)
parser.add_argument("--resume", action="store_true")
args = parser.parse_args()
password = getpass.getpass("FTPS password (not saved): ")

def connect():
    connection = ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=40)
    connection.connect(args.host, 21)
    connection.login(args.user, password)
    connection.prot_p()
    connection.cwd(args.remote_root)
    return connection

ftp = connect()
args.backup.mkdir(parents=True, exist_ok=True)

def retrieve(relative):
    global ftp
    for attempt in range(3):
        buffer = io.BytesIO()
        try:
            ftp.retrbinary("RETR " + relative, buffer.write)
            return buffer.getvalue()
        except (EOFError, OSError, ftplib.error_temp):
            if attempt == 2:
                raise
            ftp.close()
            ftp = connect()

def upload(relative, data):
    global ftp
    for attempt in range(3):
        try:
            ftp.storbinary("STOR " + relative, io.BytesIO(data))
            return
        except (EOFError, OSError, ftplib.error_temp):
            if attempt == 2:
                raise
            ftp.close()
            ftp = connect()

def ensure_parent(relative):
    parent = Path(relative).parent.as_posix()
    if parent == ".":
        return
    prefix = ""
    for part in parent.split("/"):
        prefix = prefix + "/" + part if prefix else part
        try:
            ftp.mkd(prefix)
        except ftplib.error_perm:
            # Confirm that it really exists, rather than masking permission errors.
            current = ftp.pwd()
            ftp.cwd(prefix)
            ftp.cwd(current)

if args.action == "inspect":
    print("FTPS connected; root:", ftp.pwd())
    print("Entries:", ftp.nlst())
    for relative in [".htaccess", "index.html", "sitemap.xml"]:
        data = retrieve(relative)
        (args.backup / relative).write_bytes(data)
        print(relative, len(data), hashlib.sha256(data).hexdigest())
elif args.action == "deploy":
    if not (args.build / "index.html").is_file() or not (args.build / "404.html").is_file():
        raise RuntimeError("Expected a complete build including 404.html")
    manifest_file = args.backup / "manifest.json"
    if manifest_file.exists() and not args.resume:
        raise RuntimeError("Use a fresh backup directory; do not overwrite a recovery manifest")
    files = sorted(p for p in args.build.rglob("*") if p.is_file())
    # Assets first; entry documents next; routing is switched only at the end.
    files.sort(key=lambda p: (2 if p.name == ".htaccess" else 1 if p.suffix == ".html" else 0, p.as_posix()))
    manifest = json.loads(manifest_file.read_text(encoding="utf-8")) if args.resume else []
    recorded = {entry["path"]: entry for entry in manifest}
    for local in files:
        relative = local.relative_to(args.build).as_posix()
        data = local.read_bytes()
        try:
            old = retrieve(relative)
        except ftplib.error_perm as error:
            if not str(error).startswith("550"):
                raise
            old = None
        if old == data:
            continue
        if relative in recorded:
            if recorded[relative]["sha256"] != hashlib.sha256(data).hexdigest():
                raise RuntimeError("Cannot resume with a different build: " + relative)
        elif old is not None:
            saved = args.backup / "files" / relative
            saved.parent.mkdir(parents=True, exist_ok=True)
            saved.write_bytes(old)
        entry = {"path": relative, "existed": old is not None,
                 "sha256": hashlib.sha256(data).hexdigest()}
        if relative not in recorded:
            manifest.append(entry)
        manifest_file.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
        ensure_parent(relative)
        upload(relative, data)
        if hashlib.sha256(retrieve(relative)).hexdigest() != entry["sha256"]:
            raise RuntimeError("Uploaded file mismatch: " + relative)
        print("Verified:", relative, flush=True)
    print("Deployment verified; changed files:", len(manifest))
else:
    manifest = json.loads((args.backup / "manifest.json").read_text(encoding="utf-8"))
    # Restore config before page shells; retain added assets for open browser sessions.
    for entry in reversed(manifest):
        if entry["existed"]:
            data = (args.backup / "files" / entry["path"]).read_bytes()
            upload(entry["path"], data)
            if retrieve(entry["path"]) != data:
                raise RuntimeError("Rollback verification failed")
            print("Restored:", entry["path"])
ftp.quit()
