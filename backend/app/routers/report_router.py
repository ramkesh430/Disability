from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Application, IDCard
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("/status-summary")
def status_summary(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    rows = db.query(Application.status, func.count(Application.id)).group_by(Application.status).all()
    return [{"status": status, "count": count} for status, count in rows]


@router.get("/category-summary")
def category_summary(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    rows = db.query(Application.disability_severity, func.count(Application.id)).group_by(Application.disability_severity).all()
    return [{"category": category or "N/A", "count": count} for category, count in rows]


@router.get("/card-summary")
def card_summary(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return {"total_cards": db.query(func.count(IDCard.id)).scalar() or 0}
