from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginSchema(BaseModel):
    username: str
    password: str


class UserCreate(BaseModel):
    full_name: str
    username: str
    email: Optional[EmailStr] = None
    password: str
    role: str


class TokenSchema(BaseModel):
    access_token: str
    token_type: str
    full_name: str
    username: str
    role: str


class WardReviewSchema(BaseModel):
    review_status: str
    recommended_category: Optional[str] = None
    remarks: Optional[str] = None


class CommitteeReviewSchema(BaseModel):
    decision: str
    final_category: Optional[str] = None
    remarks: Optional[str] = None


class DuplicateRequestSchema(BaseModel):
    id_card_id: int
    reason: str
    remarks: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "id_card_id": 1,
                "reason": "Lost card",
                "remarks": "Card was lost during travel"
            }
        }


class MasterTypeSchema(BaseModel):
    name: str


class MasterSeveritySchema(BaseModel):
    code: str
    label: str


class SettingSchema(BaseModel):
    municipality_name: str
    office_address: Optional[str] = None
    contact_phone: Optional[str] = None
    card_header_np: str
    card_header_en: str
