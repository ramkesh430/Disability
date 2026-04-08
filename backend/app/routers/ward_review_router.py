from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Application, WardReview
from app.schemas import WardReviewSchema
from app.dependencies import require_roles
from app.utils import create_audit_log

router = APIRouter(prefix="/api/ward-reviews", tags=["Ward Reviews"])


@router.get("/")
def list_pending(db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin", "ward_user"]))):
    return db.query(Application).filter(Application.status.in_(["Ward Review Pending", "Returned for Correction"])).order_by(Application.id.desc()).all()


@router.post("/{application_id}")
def submit_review(application_id: int, payload: WardReviewSchema, db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin", "ward_user"]))):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    row = db.query(WardReview).filter(WardReview.application_id == application_id).first()
    if not row:
        row = WardReview(application_id=application_id)
        db.add(row)

    row.review_status = payload.review_status
    row.recommended_category = payload.recommended_category
    row.remarks = payload.remarks
    row.reviewed_by = current_user.id

    if payload.review_status == "Approved":
        app.status = "Committee Pending"
        app.disability_severity = payload.recommended_category or app.disability_severity
    elif payload.review_status == "Rejected":
        app.status = "Ward Rejected"
    else:
        app.status = "Returned for Correction"

    db.commit()
    create_audit_log(db, "Ward Review", payload.review_status, f"Ward review on {app.application_no}", current_user.id)
    return {"message": "Ward review saved"}
