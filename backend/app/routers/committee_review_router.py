from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Application, CommitteeReview
from app.schemas import CommitteeReviewSchema
from app.dependencies import require_roles
from app.utils import create_audit_log

router = APIRouter(prefix="/api/committee-reviews", tags=["Committee Reviews"])


@router.get("/")
def list_pending(db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin", "committee_user"]))):
    return db.query(Application).filter(Application.status == "Committee Pending").order_by(Application.id.desc()).all()


@router.post("/{application_id}")
def submit_review(application_id: int, payload: CommitteeReviewSchema, db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin", "committee_user"]))):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    row = db.query(CommitteeReview).filter(CommitteeReview.application_id == application_id).first()
    if not row:
        row = CommitteeReview(application_id=application_id)
        db.add(row)

    row.decision = payload.decision
    row.final_category = payload.final_category
    row.remarks = payload.remarks
    row.reviewed_by = current_user.id

    if payload.decision == "Approved":
        app.status = "Committee Approved"
        app.disability_severity = payload.final_category or app.disability_severity
    else:
        app.status = "Committee Rejected"

    db.commit()
    create_audit_log(db, "Committee Review", payload.decision, f"Committee review on {app.application_no}", current_user.id)
    return {"message": "Committee review saved"}
