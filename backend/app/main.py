from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.config import settings
from app.utils import ensure_upload_dirs

from app.routers.auth_router import router as auth_router
from app.routers.dashboard_router import router as dashboard_router
from app.routers.application_router import router as application_router
from app.routers.ward_review_router import router as ward_review_router
from app.routers.committee_review_router import router as committee_review_router
from app.routers.id_card_router import router as id_card_router
from app.routers.duplicate_router import router as duplicate_router
from app.routers.report_router import router as report_router
from app.routers.user_router import router as user_router
from app.routers.master_router import router as master_router
from app.routers.audit_router import router as audit_router
from app.routers.settings_router import router as settings_router

Base.metadata.create_all(bind=engine)
ensure_upload_dirs()

app = FastAPI(title="Disability Identity Card Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(application_router)
app.include_router(ward_review_router)
app.include_router(committee_review_router)
app.include_router(id_card_router)
app.include_router(duplicate_router)
app.include_router(report_router)
app.include_router(user_router)
app.include_router(master_router)
app.include_router(audit_router)
app.include_router(settings_router)


@app.get("/")
def root():
    return {"message": "API running"}
