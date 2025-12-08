"""
Authentication models and utilities for GIAS API.
"""
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel, EmailStr
from enum import Enum

class UserRole(str, Enum):
    """User roles in GIAS system."""
    ENTERPRISE = "Enterprise"
    AUDITOR = "Auditor"
    REGULATOR = "Regulator"
    ADMIN = "Admin"

class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    name: Optional[str] = None

class UserCreate(UserBase):
    """User creation schema."""
    password: str
    role: UserRole = UserRole.ENTERPRISE

class UserInDB(UserBase):
    """User in database schema."""
    id: str
    role: UserRole
    hashed_password: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserResponse(UserBase):
    """User response schema."""
    id: str
    role: UserRole
    is_active: bool

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    """Login request schema."""
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    """Login response with token."""
    user_id: str
    email: str
    name: Optional[str]
    role: UserRole
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """JWT token payload."""
    sub: str  # user_id
    email: str
    role: UserRole
    exp: Optional[datetime] = None
