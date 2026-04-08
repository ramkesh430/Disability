import os
import shutil
from uuid import uuid4
from app.config import settings
from app.models import AuditLog


def ensure_upload_dirs():
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(os.path.join(settings.UPLOAD_DIR, "photos"), exist_ok=True)
    os.makedirs(os.path.join(settings.UPLOAD_DIR, "documents"), exist_ok=True)


def save_upload_file(file, subdir: str) -> str:
    ensure_upload_dirs()
    ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "bin"
    filename = f"{uuid4().hex}.{ext}"
    path = os.path.join(settings.UPLOAD_DIR, subdir, filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return path.replace("\\", "/")


def generate_application_no(count: int) -> str:
    return f"APP-2082-{count:05d}"


def generate_card_no(count: int) -> str:
    return f"IDC-2082-{count:05d}"


def create_audit_log(db, module: str, action: str, description: str, user_id=None):
    row = AuditLog(module=module, action=action, description=description, user_id=user_id)
    db.add(row)
    db.commit()
