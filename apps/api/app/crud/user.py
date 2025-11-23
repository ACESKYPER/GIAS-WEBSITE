from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.security import get_password_hash, verify_password
from app.schemas.auth import UserCreate



def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, email: str, password: str, full_name: Optional[str] = None, role_id: Optional[str] = None) -> User:
    hashed = get_password_hash(password)
    user = User(email=email, hashed_password=hashed, full_name=full_name, role_id=role_id)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def get_users(db: Session) -> list[User]:
    return db.query(User).all()


def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def create_user_from_schema(db: Session, payload: UserCreate) -> User:
    hashed = get_password_hash(payload.password)
    user = User(email=payload.email, hashed_password=hashed, full_name=payload.full_name, role_id=payload.role_id)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user_id: str, payload: UserCreate) -> Optional[User]:
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    # Only update provided fields
    if payload.email:
        user.email = payload.email
    if payload.full_name is not None:
        user.full_name = payload.full_name
    if payload.role_id is not None:
        user.role_id = payload.role_id
    if payload.password:
        user.hashed_password = get_password_hash(payload.password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: str) -> None:
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    db.delete(user)
    db.commit()
