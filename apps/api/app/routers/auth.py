"""
Authentication API routes.
"""
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status
from jose import JWTError, jwt
import json
import os
from uuid import uuid4
from passlib.context import CryptContext

from app.models.auth import (
    LoginRequest,
    UserRole,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

USERS_FILE = os.path.join(os.path.dirname(__file__), '..', 'users.json')

JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-min-32-chars-required")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))
REFRESH_EXPIRATION_DAYS = int(os.getenv("REFRESH_EXPIRATION_DAYS", "30"))


def load_users():
    """Load users from users.json if present, otherwise return an empty dict."""
    try:
        path = os.path.abspath(USERS_FILE)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as fh:
                return json.load(fh)
    except Exception:
        pass
    return {}


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def create_access_token(user_id: str, email: str, role: str, hours: int = None) -> str:
    if hours is None:
        hours = JWT_EXPIRATION_HOURS
    expires = datetime.utcnow() + timedelta(hours=hours)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": expires.timestamp(),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def create_refresh_token(user_id: str, email: str, role: str) -> str:
    expires = datetime.utcnow() + timedelta(days=REFRESH_EXPIRATION_DAYS)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": expires.timestamp(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


@router.post("/login")
async def login(request: LoginRequest):
    """Authenticate user and return access + refresh tokens and user info."""
    users = load_users()
    user = users.get(request.email.lower())

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(request.password, user.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access = create_access_token(user["id"], request.email, user["role"])
    refresh = create_refresh_token(user["id"], request.email, user["role"])

    return {
        "access_token": access,
        "refresh_token": refresh,
        "user": {
            "id": user["id"],
            "email": request.email,
            "role": user["role"],
            "name": user.get("name"),
        },
    }


@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}


@router.get("/me")
async def get_current_user(authorization: str = None):
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
