from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    full_name = Column(String(150), nullable=False)
    username = Column(String(100), nullable=False, unique=True, index=True)
    email = Column(String(150), nullable=True, unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="operator")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class MasterDisabilityType(Base):
    __tablename__ = "master_disability_types"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)


class MasterSeverity(Base):
    __tablename__ = "master_severities"

    id = Column(Integer, primary_key=True)
    code = Column(String(10), nullable=False, unique=True)
    label = Column(String(100), nullable=False)


class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True)
    municipality_name = Column(String(255), nullable=False)
    office_address = Column(String(255), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    card_header_np = Column(String(255), nullable=False)
    card_header_en = Column(String(255), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True)
    application_no = Column(String(50), nullable=False, unique=True, index=True)
    full_name = Column(String(150), nullable=False)
    gender = Column(String(20), nullable=True)
    phone = Column(String(20), nullable=True)
    citizenship_no = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    local_level = Column(String(100), nullable=True)
    ward_no = Column(String(20), nullable=True)
    province = Column(String(100), nullable=True)
    disability_type = Column(String(100), nullable=True)
    disability_severity = Column(String(20), nullable=True)
    date_of_birth_ad = Column(String(50), nullable=True)
    date_of_birth_bs = Column(String(50), nullable=True)
    guardian_name = Column(String(150), nullable=True)
    status = Column(String(50), nullable=False, default="Ward Review Pending")
    remarks = Column(Text, nullable=True)
    photo_path = Column(String(255), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    documents = relationship("ApplicationDocument", back_populates="application", cascade="all, delete-orphan")
    ward_review = relationship("WardReview", back_populates="application", uselist=False, cascade="all, delete-orphan")
    committee_review = relationship("CommitteeReview", back_populates="application", uselist=False, cascade="all, delete-orphan")
    id_card = relationship("IDCard", back_populates="application", uselist=False, cascade="all, delete-orphan")


class ApplicationDocument(Base):
    __tablename__ = "application_documents"

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    file_name = Column(String(150), nullable=False)
    file_path = Column(String(255), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    application = relationship("Application", back_populates="documents")


class WardReview(Base):
    __tablename__ = "ward_reviews"

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False, unique=True)
    review_status = Column(String(50), nullable=False)
    recommended_category = Column(String(20), nullable=True)
    remarks = Column(Text, nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), server_default=func.now())

    application = relationship("Application", back_populates="ward_review")


class CommitteeReview(Base):
    __tablename__ = "committee_reviews"

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False, unique=True)
    decision = Column(String(50), nullable=False)
    final_category = Column(String(20), nullable=True)
    remarks = Column(Text, nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), server_default=func.now())

    application = relationship("Application", back_populates="committee_review")


class IDCard(Base):
    __tablename__ = "id_cards"

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False, unique=True)
    card_number = Column(String(50), nullable=False, unique=True)
    card_type = Column(String(20), nullable=False)
    card_status = Column(String(50), nullable=False, default="Generated")
    issue_date = Column(DateTime(timezone=True), server_default=func.now())
    qr_code = Column(String(100), nullable=True)

    application = relationship("Application", back_populates="id_card")
    duplicate_requests = relationship("DuplicateRequest", back_populates="id_card", cascade="all, delete-orphan")


class DuplicateRequest(Base):
    __tablename__ = "duplicate_requests"

    id = Column(Integer, primary_key=True)
    id_card_id = Column(Integer, ForeignKey("id_cards.id"), nullable=False)
    reason = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="Pending")
    remarks = Column(Text, nullable=True)
    requested_at = Column(DateTime(timezone=True), server_default=func.now())

    id_card = relationship("IDCard", back_populates="duplicate_requests")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)
    module = Column(String(100), nullable=False)
    action = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
