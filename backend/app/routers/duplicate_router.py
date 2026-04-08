from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import DuplicateRequest, IDCard
from app.schemas import DuplicateRequestSchema
from app.dependencies import get_current_user, require_roles
from app.utils import create_audit_log

router = APIRouter(prefix="/api/duplicate-requests", tags=["Duplicate Requests"])


@router.get("/")
def list_requests(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(DuplicateRequest).order_by(DuplicateRequest.id.desc()).all()


@router.post("/")
def create_request(payload: DuplicateRequestSchema, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    try:
        # Validate required fields
        if not payload.id_card_id:
            raise HTTPException(status_code=422, detail="ID Card ID is required")
        
        if not payload.reason or not payload.reason.strip():
            raise HTTPException(status_code=422, detail="Reason is required and cannot be empty")
        
        card = db.query(IDCard).filter(IDCard.id == payload.id_card_id).first()
        if not card:
            raise HTTPException(status_code=404, detail="ID card not found")
        
        row = DuplicateRequest(id_card_id=payload.id_card_id, reason=payload.reason, remarks=payload.remarks, status="Pending")
        db.add(row)
        db.commit()
        db.refresh(row)
        create_audit_log(db, "Duplicate Request", "Create", f"Duplicate request for card {payload.id_card_id}", current_user.id)
        return row
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=f"Failed to create duplicate request: {str(e)}")


@router.post("/{request_id}/approve")
def approve_request(request_id: int, db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin"]))):
    try:
        row = db.query(DuplicateRequest).filter(DuplicateRequest.id == request_id).first()
        if not row:
            raise HTTPException(status_code=404, detail="Request not found")
        row.status = "Approved"
        db.commit()
        create_audit_log(db, "Duplicate Request", "Approve", f"Approved duplicate request {request_id}", current_user.id)
        return {"message": "Duplicate request approved"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to approve request: {str(e)}")


@router.post("/{request_id}/reject")
def reject_request(request_id: int, db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin"]))):
    try:
        row = db.query(DuplicateRequest).filter(DuplicateRequest.id == request_id).first()
        if not row:
            raise HTTPException(status_code=404, detail="Request not found")
        row.status = "Rejected"
        db.commit()
        create_audit_log(db, "Duplicate Request", "Reject", f"Rejected duplicate request {request_id}", current_user.id)
        return {"message": "Duplicate request rejected"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to reject request: {str(e)}")
