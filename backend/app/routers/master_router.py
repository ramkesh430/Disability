from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import MasterDisabilityType, MasterSeverity
from app.schemas import MasterTypeSchema, MasterSeveritySchema
from app.dependencies import get_current_user, require_roles
from app.utils import create_audit_log

router = APIRouter(prefix="/api/masters", tags=["Masters"])


@router.get("/types")
def get_types(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(MasterDisabilityType).order_by(MasterDisabilityType.name.asc()).all()


@router.post("/types")
def create_type(payload: MasterTypeSchema, db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin"]))):
    row = MasterDisabilityType(name=payload.name)
    db.add(row)
    db.commit()
    db.refresh(row)
    create_audit_log(db, "Masters", "Create Type", payload.name, current_user.id)
    return row


@router.get("/severities")
def get_severities(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(MasterSeverity).order_by(MasterSeverity.id.asc()).all()


@router.post("/severities")
def create_severity(payload: MasterSeveritySchema, db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin"]))):
    row = MasterSeverity(code=payload.code, label=payload.label)
    db.add(row)
    db.commit()
    db.refresh(row)
    create_audit_log(db, "Masters", "Create Severity", f"{payload.code} - {payload.label}", current_user.id)
    return row
