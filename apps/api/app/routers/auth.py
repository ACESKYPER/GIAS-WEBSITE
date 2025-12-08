"""
Authentication API routes.
"""
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from jose import JWTError, jwt
import json
import os

from app.models.auth import (
    LoginRequest,
    LoginResponse,
    UserRole,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Demo users for MVP
DEMO_USERS = {
    "enterprise@example.com": {
        "id": "user-001",
        "password": "password123",
        "name": "Enterprise User",
        "role": UserRole.ENTERPRISE,
    },
    "auditor@example.com": {
        "id": "user-002",
        "password": "password123",
        "name": "Auditor User",
        "role": UserRole.AUDITOR,
    },
    "admin@example.com": {
        "id": "user-003",
        "password": "password123",
        "name": "Admin User",
        "role": UserRole.ADMIN,
    },
}

JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-min-32-chars-required")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

def create_access_token(user_id: str, email: str, role: UserRole) -> str:
    """Create JWT access token."""
    expires = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role.value,
        "exp": expires,
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Authenticate user and return JWT token.
    Demo: Use provided demo credentials.
    """
    user = DEMO_USERS.get(request.email)

    if not user or user["password"] != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Create JWT token
    token = create_access_token(user["id"], request.email, user["role"])

    return LoginResponse(
        user_id=user["id"],
        email=request.email,
        name=user["name"],
        role=user["role"],
        access_token=token,
    )

@router.post("/logout")
async def logout():
    """
    Logout endpoint (client should clear token).
    """
    return {"message": "Logged out successfully"}

@router.get("/me")
async def get_current_user(authorization: str = None):
    """
    Get current authenticated user info.
    Requires Bearer token in Authorization header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header",
        )

    token = authorization.replace("Bearer ", "")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        email = payload.get("email")
        role = payload.get("role")

        if not all([user_id, email, role]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )

        return {
            "user_id": user_id,
            "email": email,
            "role": role,
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
