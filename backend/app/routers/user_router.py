from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreate
from app.auth import hash_password
from app.dependencies import require_roles
from app.utils import create_audit_log

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/")
def list_users(db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin"]))):
    return db.query(User).order_by(User.id.desc()).all()


@router.post("/")
def create_user(payload: UserCreate, db: Session = Depends(get_db), current_user=Depends(require_roles(["super_admin", "admin"]))):
    exists = db.query(User).filter(User.username == payload.username).first()
    if exists:
        raise HTTPException(status_code=400, detail="Username already exists")
    row = User(
        full_name=payload.full_name,
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    create_audit_log(db, "Users", "Create", f"Created user {row.username}", current_user.id)
    return row
