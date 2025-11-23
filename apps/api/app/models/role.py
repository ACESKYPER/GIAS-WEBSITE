"""Role model shim — re-export Role where it's already defined.

This avoids duplicating the SQLAlchemy class while letting other modules
import `app.models.role.Role` if desired.
"""
from app.models.user import Role as Role  # noqa: F401
