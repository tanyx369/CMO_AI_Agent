"""Application entrypoint for the APEX CMO Intelligence Platform API.

Creates the FastAPI application, configures CORS for the React frontend, and
provides a place to register versioned routers.

The campaigns router is wired up below; the remaining domain routers are stubbed
and can be enabled as each domain's endpoints are implemented.

Run locally with:

    uvicorn app.app:app --reload --app-dir backend
"""

from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from routers import campaigns
from contextlib import asynccontextmanager
from app.database import Base, engine

from . import __version__

API_V1_PREFIX = "/api/v1"

# Origins allowed to call the API (the Vite dev server by default).
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")

@asynccontextmanager
async def lifespan(_app:FastAPI):
    yield
    
    # shutdown
    await engine.dispose()

app = FastAPI(
    title="APEX CMO Intelligence Platform API",
    version=__version__,
    description="Backend API powering the APEX CMO marketing intelligence platform.",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in CORS_ORIGINS if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/media", StaticFiles(directory="data"))

@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    """Lightweight liveness probe."""
    return {"status": "ok", "version": __version__}


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(campaigns.router, prefix=API_V1_PREFIX)

# As each remaining domain's endpoints are built, create an APIRouter in
# `routers/<domain>.py` and register it here, e.g.:
#
#     from routers import products, ai, revenue, notifications
#
#     app.include_router(products.router, prefix=API_V1_PREFIX)
#     app.include_router(ai.router, prefix=API_V1_PREFIX)
#     app.include_router(revenue.router, prefix=API_V1_PREFIX)
#     app.include_router(notifications.router, prefix=API_V1_PREFIX)
