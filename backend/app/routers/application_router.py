from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Application, ApplicationDocument
from app.dependencies import get_current_user
from app.utils import generate_application_no, save_upload_file, create_audit_log

router = APIRouter(prefix="/api/applications", tags=["Applications"])


@router.get("/")
def get_applications(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Application).order_by(Application.id.desc()).all()


@router.get("/{application_id}")
def get_application(application_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    row = db.query(Application).filter(Application.id == application_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Application not found")
    return row


@router.post("/")
def create_application(
    full_name: str = Form(...),
    gender: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    citizenship_no: Optional[str] = Form(None),
    district: Optional[str] = Form(None),
    local_level: Optional[str] = Form(None),
    ward_no: Optional[str] = Form(None),
    disability_type: Optional[str] = Form(None),
    disability_severity: Optional[str] = Form(None),
    remarks: Optional[str] = Form(None),
    photo: UploadFile = File(None),
    documents: List[UploadFile] = File([]),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    app_no = generate_application_no((db.query(Application).count() or 0) + 1)
    photo_path = save_upload_file(photo, "photos") if photo else None

    row = Application(
        application_no=app_no,
        full_name=full_name,
        gender=gender,
        phone=phone,
        citizenship_no=citizenship_no,
        district=district,
        local_level=local_level,
        ward_no=ward_no,
        disability_type=disability_type,
        disability_severity=disability_severity,
        remarks=remarks,
        photo_path=photo_path,
        created_by=current_user.id,
        status="Ward Review Pending",
    )
    db.add(row)
    db.commit()
    db.refresh(row)

    for doc in documents:
        if doc and doc.filename:
            file_path = save_upload_file(doc, "documents")
            db.add(ApplicationDocument(application_id=row.id, document_name=doc.filename, file_path=file_path))
    db.commit()

    create_audit_log(db, "Applications", "Create", f"Application created: {row.application_no}", current_user.id)
    return row


@router.put("/{application_id}")
def update_application(
    application_id: int,
    full_name: str = Form(...),
    gender: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    citizenship_no: Optional[str] = Form(None),
    district: Optional[str] = Form(None),
    local_level: Optional[str] = Form(None),
    ward_no: Optional[str] = Form(None),
    disability_type: Optional[str] = Form(None),
    disability_severity: Optional[str] = Form(None),
    remarks: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    row = db.query(Application).filter(Application.id == application_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Application not found")
    row.full_name = full_name
    row.gender = gender
    row.phone = phone
    row.citizenship_no = citizenship_no
    row.district = district
    row.local_level = local_level
    row.ward_no = ward_no
    row.disability_type = disability_type
    row.disability_severity = disability_severity
    row.remarks = remarks
    db.commit()
    create_audit_log(db, "Applications", "Update", f"Application updated: {row.application_no}", current_user.id)
    return row


@router.delete("/{application_id}")
def delete_application(application_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    try:
        row = db.query(Application).filter(Application.id == application_id).first()
        if not row:
            raise HTTPException(status_code=404, detail="Application not found")
        
        app_no = row.application_no
        db.delete(row)
        db.commit()
        create_audit_log(db, "Applications", "Delete", f"Application deleted: {app_no}", current_user.id)
        return {"message": "Application deleted"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting application {application_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
