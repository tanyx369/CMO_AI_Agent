"""Campaign routes for the APEX CMO Intelligence Platform API.

    POST   /campaigns                            create a campaign of any type
    DELETE /campaigns/{campaign_id}              delete a campaign of any type
    POST   /campaigns/{campaign_id}/generate-image
    POST   /campaigns/{campaign_id}/generate-video

The two generation routes accept a prompt, call the Hugging Face inference
provider, write the result under ``backend/data/{image,video}/``, and record a
row pointing at that file.
"""

from __future__ import annotations

import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Campaign, Image, Organization, Product, User, Video, TextContent
from app.schemas import (
    CampaignCreate,
    CampaignOut,
    ImageOut,
    MediaGenerateRequest,
    PostContentOut,
    VideoOut,
)

from agents.manager.sub_agents.post_content_generator.agent import generate_post_content as _generate_post_content
from agents.manager.sub_agents.image_generator.agent import generate_image as _generate_image

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

# ---------------------------------------------------------------------------
# Storage layout
# ---------------------------------------------------------------------------
# Files live on disk; the database only stores the path. Paths are persisted
# relative to the backend directory so the rows survive a move between machines.

# _BACKEND_DIR = Path(__file__).resolve().parent.parent
# IMAGE_DIR = _BACKEND_DIR / "data" / "image"
# VIDEO_DIR = _BACKEND_DIR / "data" / "video"

# # Models are overridable so a deployment can swap them without a code change.
# IMAGE_MODEL = os.getenv("HF_IMAGE_MODEL", "black-forest-labs/FLUX.1-dev")
# VIDEO_MODEL = os.getenv("HF_VIDEO_MODEL", "Wan-AI/Wan2.1-T2V-14B")
# HF_PROVIDER = os.getenv("HF_PROVIDER", "fal-ai")


# def _relative_path(absolute: Path) -> str:
#     """Path stored in the database — relative to the backend directory."""
#     return absolute.relative_to(_BACKEND_DIR).as_posix()


# def _hf_client():
#     """Build a Hugging Face inference client.

#     Imported lazily so this module (and the rest of the API) still imports when
#     `huggingface_hub` is absent — only the generation calls need it.
#     """
#     try:
#         from huggingface_hub import InferenceClient
#     except ModuleNotFoundError as exc:  # pragma: no cover - depends on env
#         raise HTTPException(
#             status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
#             detail="huggingface_hub is not installed on the server.",
#         ) from exc

#     api_key = os.getenv("HUGGINGFACE_API")
#     if not api_key:
#         raise HTTPException(
#             status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
#             detail="HUGGINGFACE_API is not configured on the server.",
#         )
#     return InferenceClient(provider=HF_PROVIDER, api_key=api_key)


# def _get_campaign(campaign_id: uuid.UUID, db: Session) -> Campaign:
#     campaign = db.get(Campaign, campaign_id)
#     if campaign is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail=f"Campaign {campaign_id} not found.",
#         )
#     return campaign


# # ---------------------------------------------------------------------------
# # Endpoints
# # ---------------------------------------------------------------------------


# @router.post(
#     "",
#     response_model=CampaignOut,
#     status_code=status.HTTP_201_CREATED,
#     summary="Create a campaign of any type",
# )
# async def add_new(payload: CampaignCreate, db: Session = Depends(get_db)) -> Campaign:
#     """Create a campaign — online (single post or series) or physical.

#     The category/sub-type pairing is validated by `CampaignCreate`; this checks
#     that the referenced organization, product and creator actually exist so a
#     bad id returns 404 rather than a foreign-key error.
#     """
#     # result = await db.execute(
#     #     select(models.User).where(func.lower(models.User.username) == user.username.lower()),
#     # )
#     # existing_user = result.scalars().first()
    
    
#     if db.get(Organization, payload.org_id) is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail=f"Organization {payload.org_id} not found.",
#         )
#     if payload.product_id is not None and db.get(Product, payload.product_id) is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail=f"Product {payload.product_id} not found.",
#         )
#     if payload.created_by is not None and db.get(User, payload.created_by) is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail=f"User {payload.created_by} not found.",
#         )

#     campaign = Campaign(**payload.model_dump())
#     db.add(campaign)
#     db.commit()
#     db.refresh(campaign)
#     return campaign


# @router.delete(
#     "/{campaign_id}",
#     status_code=status.HTTP_204_NO_CONTENT,
#     summary="Delete a campaign of any type",
# )
# def delete_campaign(campaign_id: uuid.UUID, db: Session = Depends(get_db)) -> None:
#     """Delete a campaign and everything that hangs off it.

#     Content, engagement metrics, comments and generated media rows are removed
#     by cascade. The generated image/video *files* are unlinked too — once their
#     rows are gone nothing can reach them, so leaving them would leak disk.
#     """
#     campaign = _get_campaign(campaign_id, db)

#     media_paths = [
#         _BACKEND_DIR / row.file_path
#         for row in (*campaign.images, *campaign.videos)
#     ]

#     db.delete(campaign)
#     db.commit()

#     for path in media_paths:
#         try:
#             path.unlink(missing_ok=True)
#         except OSError:
#             # The row is already gone; a stuck file should not fail the request.
#             pass


# @router.post(
#     "/{campaign_id}/generate-image",
#     response_model=ImageOut,
#     status_code=status.HTTP_201_CREATED,
#     summary="Generate an image for a campaign from a prompt",
# )
# def generate_image(
#     campaign_id: uuid.UUID,
#     payload: MediaGenerateRequest,
#     db: Session = Depends(get_db),
# ) -> Image:
#     """Generate an image, save it to disk, and record it against the campaign."""
#     _get_campaign(campaign_id, db)
#     client = _hf_client()

#     IMAGE_DIR.mkdir(parents=True, exist_ok=True)
#     destination = IMAGE_DIR / f"{uuid.uuid4()}.png"

#     try:
#         # text_to_image returns a PIL.Image.
#         # image = client.text_to_image(payload.prompt, model=IMAGE_MODEL)
#         # image.save(destination)
        
#         _generate_image(payload.prompt, destination)
#     except HTTPException:
#         raise
#     except Exception as exc:
#         raise HTTPException(
#             status_code=status.HTTP_502_BAD_GATEWAY,
#             detail=f"Image generation failed: {exc}",
#         ) from exc

#     record = Image(
#         campaign_id=campaign_id,
#         prompt=payload.prompt,
#         file_path=_relative_path(destination),
#     )
#     db.add(record)
#     db.commit()
#     db.refresh(record)
#     return record


@router.post(
    "/generate-image",
    response_model=ImageOut,
    status_code=status.HTTP_201_CREATED,
    summary="Generate an image for a campaign from a prompt",
)
async def generate_image(
    payload: MediaGenerateRequest,
    db: Session = Depends(get_db),
) -> Image:
    """Generate an image, save it to disk, and record it against the campaign."""
    # _get_campaign(campaign_id, db)
    # client = _hf_client()

    # IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    # destination = IMAGE_DIR / f"{uuid.uuid4()}.png"

    try:
        # text_to_image returns a PIL.Image.
        # image = client.text_to_image(payload.prompt, model=IMAGE_MODEL)
        # image.save(destination)
        # print('Generated Image')
        image_result = await _generate_image(payload.prompt, "D:\\Kabel Projects\\CMO AI Agent\\CMO_AI_Agent\\backend\\data\\image")
        
        
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Image generation failed: {exc}",
        ) from exc

    record = Image(
        prompt=payload.prompt,
        file_path=image_result['file_path'],
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record



@router.post("/generate-post-content",
    response_model=PostContentOut,
    status_code=status.HTTP_201_CREATED,
    summary="Generate an image for a campaign from a prompt",
)
async def generate_post_content(payload:MediaGenerateRequest, db: Session = Depends(get_db)):
    """_summary_

    Args:
        prompt (str): _description_
    """
    try:
        text_content = await _generate_post_content(payload.prompt, payload.platform)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Text generation failed: {exc}",
        ) from exc
        
        
    text_record = TextContent(
            prompt=payload.prompt,
            body=text_content,
    )
    db.add(text_record)
    await db.commit()
    await db.refresh(text_record)
    return({'prompt':payload.prompt, 'text_content':text_content})

# @router.post(
#     "/{campaign_id}/generate-video",
#     response_model=VideoOut,
#     status_code=status.HTTP_201_CREATED,
#     summary="Generate a video for a campaign from a prompt",
# )
# def generate_video(
#     campaign_id: uuid.UUID,
#     payload: MediaGenerateRequest,
#     db: Session = Depends(get_db),
# ) -> Video:
#     """Generate a video, save it to disk, and record it against the campaign."""
#     _get_campaign(campaign_id, db)
#     client = _hf_client()

#     if not hasattr(client, "text_to_video"):
#         raise HTTPException(
#             status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
#             detail=(
#                 "The installed huggingface_hub has no text_to_video support. "
#                 "Upgrade huggingface_hub to enable video generation."
#             ),
#         )

#     VIDEO_DIR.mkdir(parents=True, exist_ok=True)
#     destination = VIDEO_DIR / f"{uuid.uuid4()}.mp4"

#     try:
#         # text_to_video returns the encoded video as bytes.
#         video_bytes = client.text_to_video(payload.prompt, model=VIDEO_MODEL)
#         destination.write_bytes(video_bytes)
#     except HTTPException:
#         raise
#     except Exception as exc:
#         raise HTTPException(
#             status_code=status.HTTP_502_BAD_GATEWAY,
#             detail=f"Video generation failed: {exc}",
#         ) from exc

#     record = Video(
#         campaign_id=campaign_id,
#         prompt=payload.prompt,
#         file_path=_relative_path(destination),
#     )
#     db.add(record)
#     db.commit()
#     db.refresh(record)
#     return record
