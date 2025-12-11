"""
Public auth endpoints to support frontend credential flows at /auth/*
This mirrors the internal `/api/auth` implementation but exposes an endpoint
at `/auth/login` for NextAuth compatibility as requested.
"""
from fastapi import APIRouter, HTTPException, status
from jose import JWTError, jwt
import os
import json
from datetime import datetime, timedelta
from passlib.context import CryptContext

from uuid import uuid4

router = APIRouter(prefix="/auth", tags=["public-auth"])

USERS_FILE = os.path.join(os.path.dirname(__file__), '..', 'users.json')
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-min-32-chars-required")
JWT_ALGORITHM = "HS256"


def load_users():
    try:
        path = os.path.abspath(USERS_FILE)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as fh:
                return json.load(fh)
    except Exception:
        pass
    return {}


def create_token(user_id: str, email: str, role: str, hours: int = 24):
    expires = datetime.utcnow() + timedelta(hours=hours)
    payload = {"sub": user_id, "email": email, "role": role, "exp": expires.timestamp()}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


@router.post("/login")
async def public_login(payload: dict):
    email = payload.get('email', '').lower()
    password = payload.get('password', '')
    users = load_users()
    user = users.get(email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid email or password')
    if not pwd.verify(password, user.get('hashed_password', '')):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid email or password')

    access = create_token(user['id'], email, user['role'])
    refresh = create_token(user['id'], email, user['role'], hours=24*30)

    return {"access_token": access, "refresh_token": refresh, "user": {"id": user['id'], "email": email, "role": user['role'], "name": user.get('name')}}
