"""Database configuration and session management."""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.config import get_settings

settings = get_settings()

# Declarative Base for models
Base = declarative_base()

# Async engine (used by FastAPI)
ASYNC_ENGINE = create_async_engine(
    settings.ASYNC_DATABASE_URL,
    echo=False,
    future=True,
)

# Async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=ASYNC_ENGINE,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_async_session():
    """Dependency for injecting async DB session into FastAPI routes."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
