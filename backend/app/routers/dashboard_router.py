from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Application, IDCard
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/")
def get_dashboard(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    total = db.query(func.count(Application.id)).scalar() or 0
    approved = db.query(func.count(Application.id)).filter(Application.status == "Committee Approved").scalar() or 0
    ward_pending = db.query(func.count(Application.id)).filter(Application.status.in_(["Ward Review Pending", "Returned for Correction"])).scalar() or 0
    committee_pending = db.query(func.count(Application.id)).filter(Application.status == "Committee Pending").scalar() or 0
    rejected = db.query(func.count(Application.id)).filter(Application.status.in_(["Ward Rejected", "Committee Rejected"])).scalar() or 0
    cards_generated = db.query(func.count(IDCard.id)).scalar() or 0

    return {
        "total_applications": total,
        "approved": approved,
        "ward_pending": ward_pending,
        "committee_pending": committee_pending,
        "rejected": rejected,
        "cards_generated": cards_generated,
    }
