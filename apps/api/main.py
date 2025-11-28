# apps/api/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings

# IMPORTANT: import the async engine (created in your app.database)
from app.database import async_engine  # <- using async engine
from app.routes import (
    attestations, evidence, auth, verification,
    users, roles, metadata as metadata_routes
)

import os
import subprocess
import logging
from alembic.config import Config as AlembicConfig
from alembic.script import ScriptDirectory
from sqlalchemy import text

logger = logging.getLogger(__name__)

# Ensure SQLAlchemy models load so Alembic / metadata are registered
import app.models.user  # noqa: F401

settings = get_settings()

app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router)
app.include_router(attestations.router)
app.include_router(evidence.router)
app.include_router(verification.router)
app.include_router(metadata_routes.router)
app.include_router(users.router)
app.include_router(roles.router)


@app.on_event("startup")
async def startup_event():
    """Async startup checks: ensure alembic head == db revision, cache git commit."""

    # Resolve alembic head (file-based)
    try:
        alembic_ini = os.path.join(os.path.dirname(__file__), "alembic.ini")
        alembic_cfg = AlembicConfig(alembic_ini)
        script = ScriptDirectory.from_config(alembic_cfg)
        heads = script.get_heads()
        head = heads[0] if heads else None
    except Exception:
        head = None

    # Read DB revision using the async engine
    db_rev = None
    try:
        # Ensure the DATABASE_URL uses async driver, e.g. postgresql+asyncpg://user:pass@host:port/db
        async with async_engine.connect() as conn:
            try:
                result = await conn.execute(text("SELECT version_num FROM alembic_version"))
                # Async Result -> scalar() will return the first column of the first row (or None)
                db_rev = result.scalar()
            except Exception:
                db_rev = None
    except Exception as e:
        logger.error("Database connection failed during startup check: %s", e)
        # Provide extra hint for the common misconfiguration (sync vs async driver)
        raise RuntimeError(
            "Unable to connect to database during startup. "
            "Ensure DATABASE_URL uses the async driver (e.g. postgresql+asyncpg://...) and "
            "that asyncpg is installed in the environment."
        ) from e

    # Enforce migration parity
    if head is None:
        logger.warning("Could not determine alembic head; please check alembic config.")
    else:
        if db_rev != head:
            msg = f"Database migrations not up-to-date: DB={db_rev} HEAD={head}"
            logger.error(msg)
            raise RuntimeError(msg)

    # store revision & commit for middleware/endpoints
    app.state.migration_revision = db_rev or "unknown"

    commit = None
    try:
        candidates = [
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..")),
            os.getcwd()
        ]
        for c in candidates:
            try:
                commit = subprocess.check_output(["git", "rev-parse", "--short", "HEAD"], cwd=c, stderr=subprocess.DEVNULL).decode().strip()
                if commit:
                    break
            except Exception:
                continue
    except Exception:
        commit = None

    app.state.commit = commit or os.getenv("COMMIT_HASH", "unknown")


@app.middleware("http")
async def add_version_headers(request: Request, call_next):
    try:
        resp = await call_next(request)
        # Add headers
        resp.headers["X-App-Version"] = settings.API_VERSION
        resp.headers["X-DB-Revision"] = getattr(app.state, "migration_revision", "unknown")
        return resp
    finally:
        logger.info("%s %s - app=%s db_rev=%s", request.method, request.url.path, settings.API_VERSION, getattr(app.state, "migration_revision", "unknown"))


@app.get("/health")
async def health_check(request: Request):
    return {
        "status": "ok",
        "database": "connected",
        "migration_revision": getattr(request.app.state, "migration_revision", None),
    }


@app.get("/")
async def root():
    return {
        "title": settings.API_TITLE,
        "version": settings.API_VERSION,
        "docs": "/api/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
