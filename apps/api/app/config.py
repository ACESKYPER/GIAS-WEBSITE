"""Configuration management for GIAS API."""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment or .env file."""
    
    # API Configuration
    API_TITLE: str = "GIAS Institutional Website & Trust Portal"
    API_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Database (Async URL for FastAPI)
    ASYNC_DATABASE_URL: str = "postgresql+asyncpg://gias:giasdev123@localhost:5432/giasdb"
    
    # Database (Sync URL for Alembic migrations)
    DATABASE_URL: str = "postgresql://gias:giasdev123@localhost:5432/giasdb"
    
    # Security
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"]
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
