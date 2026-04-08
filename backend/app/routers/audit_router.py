from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AuditLog
from app.dependencies import require_roles

router = APIRouter(prefix="/api/audit-logs", tags=["Audit Logs"])


@router.get("/")
def list_logs(db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin"]))):
    return db.query(AuditLog).order_by(AuditLog.id.desc()).limit(500).all()
