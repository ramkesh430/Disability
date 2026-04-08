from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import LoginSchema, UserCreate, TokenSchema
from app.auth import hash_password, verify_password, create_access_token
from app.utils import create_audit_log

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register")
def register(payload: UserCreate, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.username == payload.username).first()
    if exists:
        raise HTTPException(status_code=400, detail="Username already exists")

    user = User(
        full_name=payload.full_name,
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    create_audit_log(db, "Auth", "Register", f"User created: {user.username}", user.id)
    return {"message": "User created successfully"}


@router.post("/login", response_model=TokenSchema)
def login(payload: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"sub": user.username, "role": user.role})
    create_audit_log(db, "Auth", "Login", f"Login success: {user.username}", user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "full_name": user.full_name,
        "username": user.username,
        "role": user.role,
    }
