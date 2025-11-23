from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import Base, engine, SessionLocal
from app.routes import attestations, evidence, auth, verification, users, roles
from app.routes import metadata as metadata_routes
import os
import subprocess
from alembic.config import Config as AlembicConfig
from alembic.script import ScriptDirectory
from sqlalchemy import text
import logging

logger = logging.getLogger(__name__)

# Import models to ensure they're registered with SQLAlchemy
import app.models.user as models_user

settings = get_settings()

app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# CORS Middleware
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
    """Pre-start checks: ensure migrations applied and cache git revision.

    This prevents the server from starting against an unexpected schema.
    Seeding is intentionally removed from startup and moved to a separate script.
    """
    # Resolve alembic head
    try:
        alembic_ini = os.path.join(os.path.dirname(__file__), "alembic.ini")
        alembic_cfg = AlembicConfig(alembic_ini)
        script = ScriptDirectory.from_config(alembic_cfg)
        heads = script.get_heads()
        head = heads[0] if heads else None
    except Exception:
        head = None

    # Read DB revision
    db_rev = None
    try:
        with engine.connect() as conn:
            try:
                res = conn.execute(text("SELECT version_num FROM alembic_version"))
                db_rev = res.scalar()
            except Exception:
                db_rev = None
    except Exception as e:
        logger.error("Database connection failed during startup check: %s", e)
        raise

    # Enforce migration parity
    if head is None:
        logger.warning("Could not determine alembic head; please check alembic config.")
    else:
        if db_rev != head:
            msg = f"Database migrations not up-to-date: DB={db_rev} HEAD={head}"
            logger.error(msg)
            raise RuntimeError(msg)

    # Cache revision and commit for use in middleware/endpoints
    app.state.migration_revision = db_rev or "unknown"
    # attempt to get git commit (short)
    commit = None
    try:
        # try multiple likely repo roots
        candidates = [os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")), os.path.abspath(os.path.join(os.path.dirname(__file__), "..")), os.getcwd()]
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
async def add_version_headers(request, call_next):
    """Add app/migration version headers and log each request with revision info."""
    try:
        resp = await call_next(request)
        # Add headers
        resp.headers["X-App-Version"] = settings.API_VERSION
        resp.headers["X-DB-Revision"] = getattr(app.state, "migration_revision", "unknown")
    except Exception as e:
        logger.exception("Error in middleware: %s", e)
        raise
    finally:
        # Log request with revision info
        logger.info("%s %s - app=%s db_rev=%s", request.method, request.url.path, settings.API_VERSION, getattr(app.state, "migration_revision", "unknown"))
    
    return resp


@app.get("/health")
async def health_check(request: Request):
    """Health check endpoint."""
    return {
        "status": "ok",
        "database": "connected",
        "migration_revision": getattr(request.app.state, "migration_revision", None),
    }


@app.get("/")
async def root():
    """API root endpoint."""
    return {
        "title": settings.API_TITLE,
        "version": settings.API_VERSION,
        "docs": "/api/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
