"""Database configuration for the APEX CMO Intelligence Platform.

Sets up the SQLAlchemy engine, session factory, declarative base, and a
FastAPI-friendly `get_db` dependency. PostgreSQL is the target database.
"""

from __future__ import annotations

import os
from collections.abc import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# Load environment variables. The .env lives under backend/utils/; fall back to
# backend/.env if a future reorganization moves it.
_BACKEND_DIR = os.path.dirname(os.path.dirname(__file__))
for _candidate in (
    os.path.join(_BACKEND_DIR, "utils", ".env"),
    os.path.join(_BACKEND_DIR, ".env"),
):
    if os.path.exists(_candidate):
        load_dotenv(_candidate)
        break

# ---------------------------------------------------------------------------
# Connection URL
# ---------------------------------------------------------------------------
# Format: postgresql+psycopg://<user>:<password>@<host>:<port>/<database>
# The default targets a local PostgreSQL instance; override with DATABASE_URL.
# DATABASE_URL: str = os.getenv(
#     "DATABASE_URL",
#     "postgresql+psycopg://cmo_ai_agent:cmo12345@localhost:5432/apex_cmo",
# )

DATABASE_URL: str = "postgresql+psycopg://cmo_ai_agent:cmo12345@localhost:8888/apex_cmo"

# `echo` toggles SQL statement logging — handy in development.
SQL_ECHO: bool = os.getenv("SQL_ECHO", "false").lower() in {"1", "true", "yes"}

# ---------------------------------------------------------------------------
# Engine & session factory
# ---------------------------------------------------------------------------
# engine = create_engine(
#     DATABASE_URL,
#     echo=SQL_ECHO,
#     pool_pre_ping=True,  # transparently recycle stale connections
#     future=True,
# )

engine = create_async_engine(
    DATABASE_URL,
)

# SessionLocal = sessionmaker(
#     bind=engine,
#     autocommit=False,
#     autoflush=False,
#     expire_on_commit=False,
#     class_=Session,
# )

SessionLocal = async_sessionmaker(engine, class_= AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    """Declarative base class shared by all ORM models."""


# def get_db() -> Generator[Session, None, None]:
#     """Yield a database session and ensure it is closed after use.

#     Intended for use as a FastAPI dependency:

#         @router.get("/items")
#         def list_items(db: Session = Depends(get_db)):
#             ...
#     """
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

async def get_db():
    """Yield a database session and ensure it is closed after use.

    Intended for use as a FastAPI dependency:

        @router.get("/items")
        def list_items(db: Session = Depends(get_db)):
            ...
    """
    async with SessionLocal() as session:
        yield session


def init_db() -> None:
    """Create all tables. Convenience helper for local development.

    In production, prefer Alembic migrations over `create_all`.
    """
    # Import models so they are registered on `Base.metadata` before create_all.
    from . import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
