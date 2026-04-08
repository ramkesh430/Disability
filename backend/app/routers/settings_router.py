from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import SystemSetting
from app.schemas import SettingSchema
from app.dependencies import get_current_user, require_roles
from app.utils import create_audit_log

router = APIRouter(prefix="/api/settings", tags=["Settings"])


@router.get("/")
def get_settings(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    row = db.query(SystemSetting).filter(SystemSetting.id == 1).first()
    if not row:
        row = SystemSetting(
            id=1,
            municipality_name="अपाङ्गता परिचय-पत्र व्यवस्थापन प्रणाली",
            office_address="Municipality Office",
            contact_phone="9800000000",
            card_header_np="अपाङ्गता परिचय-पत्र",
            card_header_en="Disability Identity Card",
        )
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.put("/")
def update_settings(payload: SettingSchema, db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin"]))):
    row = db.query(SystemSetting).filter(SystemSetting.id == 1).first()
    if not row:
        row = SystemSetting(id=1)
        db.add(row)
    row.municipality_name = payload.municipality_name
    row.office_address = payload.office_address
    row.contact_phone = payload.contact_phone
    row.card_header_np = payload.card_header_np
    row.card_header_en = payload.card_header_en
    db.commit()
    db.refresh(row)
    create_audit_log(db, "Settings", "Update", "System settings updated", current_user.id)
    return row
