from __future__ import annotations

import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Campaign, Image, Organization, Product, User, Video
from app.schemas import (
    CampaignCreate,
    CampaignOut,
    ImageOut,
    MediaGenerateRequest,
    VideoOut,
)

from agents.manager.sub_agents.image_generator.agent import generate_image as _generate_image

router = APIRouter(prefix="/ai_agent", tags=["ai_agent"])

@router.post("/chat")
async def chat(prompt:str):
    pass