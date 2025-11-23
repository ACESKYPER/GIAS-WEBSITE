from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import text
from app.database import engine, SessionLocal
from app.models.user import Role
from typing import Any, Dict
from app.config import get_settings

settings = get_settings()

router = APIRouter()


@router.get("/health", tags=["health"])
async def health_check(request: Request):
    """Health check endpoint."""
    return {
        "status": "ok",
        "database": "connected",
        "migration_revision": getattr(request.app.state, "migration_revision", None),
    }


@router.get("/version", tags=["version"])
async def version(request: Request) -> Dict[str, str]:
    """Return application version, commit and migration revision."""
    app = request.app
    return {
        "app_version": settings.API_VERSION,
        "commit": getattr(app.state, "commit", "unknown"),
        "migration_revision": getattr(app.state, "migration_revision", "unknown"),
        "env": "debug" if settings.DEBUG else "production",
    }


@router.get("/api/v1/roles", tags=["roles"])
async def list_roles():
    """Return seeded roles (visible in Swagger)."""
    db = SessionLocal()
    try:
        roles = db.query(Role).order_by(Role.name).all()
        return [
            {"id": r.id, "name": r.name, "description": r.description, "permissions": r.permissions}
            for r in roles
        ]
    finally:
        db.close()
