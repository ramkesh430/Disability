from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Application, IDCard
from app.dependencies import get_current_user, require_roles
from app.utils import generate_card_no, create_audit_log

router = APIRouter(prefix="/api/id-cards", tags=["ID Cards"])


@router.get("/")
def list_cards(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(IDCard).options(joinedload(IDCard.application)).order_by(IDCard.id.desc()).all()


@router.post("/generate/{application_id}")
def generate_card(application_id: int, db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin"]))):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if app.status != "Committee Approved":
        raise HTTPException(status_code=400, detail="Only committee approved applications can generate card")

    existing = db.query(IDCard).filter(IDCard.application_id == application_id).first()
    if existing:
        return existing

    card_no = generate_card_no((db.query(IDCard).count() or 0) + 1)
    card = IDCard(
        application_id=application_id,
        card_number=card_no,
        card_type=app.disability_severity or "N/A",
        card_status="Generated",
        qr_code=card_no,
    )
    db.add(card)
    app.status = "Card Generated"
    db.commit()
    db.refresh(card)
    create_audit_log(db, "ID Card", "Generate", f"Generated card {card_no}", current_user.id)
    return card


@router.get("/{card_id}")
def get_card(card_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    card = db.query(IDCard).options(joinedload(IDCard.application)).filter(IDCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="ID Card not found")
    return card


@router.post("/{card_id}/mark-printed")
def mark_card_printed(card_id: int, db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin"]))):
    card = db.query(IDCard).filter(IDCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="ID Card not found")
    
    if card.card_status == "Printed":
        return card
    
    card.card_status = "Printed"
    db.commit()
    db.refresh(card)
    create_audit_log(db, "ID Card", "Print", f"Marked card {card.card_number} as printed", current_user.id)
    return card
