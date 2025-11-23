from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class RoleSchema(BaseModel):
    """Schema for Role."""
    id: str
    name: str
    description: Optional[str] = None
    permissions: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserBase(BaseModel):
    """Base schema for User data."""
    email: EmailStr
    full_name: Optional[str] = None
    organization_id: Optional[str] = None


class UserCreate(UserBase):
    """Schema for creating a new User."""
    password: str
    role_id: str


class UserUpdate(BaseModel):
    """Schema for updating User data."""
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    role_id: Optional[str] = None
    organization_id: Optional[str] = None


class UserResponse(UserBase):
    """Schema for User response."""
    id: str
    is_active: bool
    is_verified: bool
    role_id: str
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserWithRole(UserResponse):
    """Schema for User response with Role details."""
    role_obj: RoleSchema
    
    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    """Schema for login request."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema for authentication token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class PasswordChangeRequest(BaseModel):
    """Schema for password change request."""
    old_password: str
    new_password: str


class AttestationScore(BaseModel):
    alignment: float
    robustness: float
    data_governance: float
    explainability: float
    operational_risk: float


class EvidenceResponse(BaseModel):
    """Schema for Evidence response."""
    id: str
    attestation_id: str
    name: Optional[str] = None
    type: Optional[str] = None
    url: Optional[str] = None
    metadata_json: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class AttestationResponse(BaseModel):
    id: str
    entity_name: str
    standard: str
    issued_date: datetime
    expiry_date: datetime
    scores: AttestationScore
    overall_score: float
    status: str
    qr_code_url: str
    
    class Config:
        from_attributes = True

