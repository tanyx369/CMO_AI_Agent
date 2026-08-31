"""Pydantic (v2) validation schemas for the APEX CMO Intelligence Platform.

Each domain exposes a small family of schemas:

    *Base    — shared, user-editable fields
    *Create  — payload accepted when creating a record
    *Update  — payload accepted when patching a record (all optional)
    *Out     — representation returned to the client (reads from ORM objects)

Enums are shared with the SQLAlchemy models in `models.py`.
"""

from __future__ import annotations

import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

from .models import (
    CampaignCategory,
    CampaignGoal,
    CampaignStatus,
    ContentStatus,
    ContentType,
    MessageRole,
    NotificationType,
    OnlineType,
    PostStatus,
    PhysicalType,
    Platform,
    PlanType,
    ReviewActionType,
    Sentiment,
    UserRole,
)

# ---------------------------------------------------------------------------
# Shared base
# ---------------------------------------------------------------------------


class ORMModel(BaseModel):
    """Base for response schemas that read attributes off ORM instances."""

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# 1. Organization
# ---------------------------------------------------------------------------


class OrganizationBase(BaseModel):
    name: str
    plan: PlanType = PlanType.starter


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: str | None = None
    plan: PlanType | None = None


class OrganizationOut(ORMModel, OrganizationBase):
    id: uuid.UUID
    created_at: datetime


# ---------------------------------------------------------------------------
# 2. User
# ---------------------------------------------------------------------------


class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole = UserRole.viewer
    avatar_url: str | None = None


class UserCreate(UserBase):
    org_id: uuid.UUID


class UserUpdate(BaseModel):
    name: str | None = None
    role: UserRole | None = None
    avatar_url: str | None = None


class UserOut(ORMModel, UserBase):
    id: uuid.UUID
    org_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# 3. Product
# ---------------------------------------------------------------------------


class ProductBase(BaseModel):
    name: str
    description: str
    category: str | None = None
    tags: list[str] = Field(default_factory=list)
    image_url: str | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    ai_improved_description: str | None = None
    category: str | None = None
    tags: list[str] | None = None
    image_url: str | None = None
    is_active: bool | None = None


class ProductOut(ORMModel, ProductBase):
    id: uuid.UUID
    org_id: uuid.UUID
    ai_improved_description: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class ProductAIImproveRequest(BaseModel):
    """Optional steering for the AI description-improvement action."""

    tone: str | None = None
    focus: str | None = None


# ---------------------------------------------------------------------------
# 4. Campaign
# ---------------------------------------------------------------------------


class CampaignBase(BaseModel):
    name: str
    description: str | None = None
    category: CampaignCategory = CampaignCategory.online
    online_type: OnlineType | None = None
    physical_type: PhysicalType | None = None
    status: CampaignStatus = CampaignStatus.draft
    platform: Platform = Platform.all
    goal: CampaignGoal = CampaignGoal.awareness
    budget: Decimal = Decimal("0")
    start_date: date | None = None
    end_date: date | None = None
    product_id: uuid.UUID | None = None


class CampaignCreate(CampaignBase):
    """Payload for creating a campaign of any type.

    `org_id` is required because the API has no authentication yet — once a
    current-user dependency exists it should come from there instead.
    """

    org_id: uuid.UUID
    created_by: uuid.UUID | None = None

    @model_validator(mode="after")
    def _subtype_matches_category(self) -> "CampaignCreate":
        """An online campaign needs an online_type, a physical one a physical_type."""
        if self.category is CampaignCategory.online:
            if self.online_type is None:
                raise ValueError(
                    "online_type is required for online campaigns ('single' or 'campaign')"
                )
            if self.physical_type is not None:
                raise ValueError("physical_type must be omitted for online campaigns")
        else:
            if self.physical_type is None:
                raise ValueError("physical_type is required for physical campaigns")
            if self.online_type is not None:
                raise ValueError("online_type must be omitted for physical campaigns")
        return self

    @model_validator(mode="after")
    def _dates_in_order(self) -> "CampaignCreate":
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError("end_date must not be earlier than start_date")
        return self


class CampaignUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    category: CampaignCategory | None = None
    online_type: OnlineType | None = None
    physical_type: PhysicalType | None = None
    status: CampaignStatus | None = None
    platform: Platform | None = None
    goal: CampaignGoal | None = None
    budget: Decimal | None = None
    spent: Decimal | None = None
    start_date: date | None = None
    end_date: date | None = None
    progress: float | None = Field(default=None, ge=0.0, le=1.0)
    product_id: uuid.UUID | None = None


class CampaignOut(ORMModel, CampaignBase):
    id: uuid.UUID
    org_id: uuid.UUID
    spent: Decimal
    progress: float
    created_by: uuid.UUID | None = None
    created_at: datetime
    updated_at: datetime


class CampaignFilter(BaseModel):
    """Query filters for the campaign list endpoint."""

    product_id: uuid.UUID | None = None
    platform: Platform | None = None
    status: CampaignStatus | None = None
    start_after: date | None = None
    end_before: date | None = None


# ---------------------------------------------------------------------------
# 5. CampaignContent
# ---------------------------------------------------------------------------


class ContentGenerateRequest(BaseModel):
    """Trigger AI content generation for a campaign."""

    content_type: ContentType
    prompt: str = Field(min_length=1)


class CampaignContentUpdate(BaseModel):
    generated_output: str | None = None
    status: ContentStatus | None = None
    scheduled_at: datetime | None = None


class ContentOut(ORMModel):
    id: uuid.UUID
    campaign_id: uuid.UUID
    content_type: ContentType
    prompt: str
    generated_output: str
    status: ContentStatus
    scheduled_at: datetime | None = None
    reviewed_by: uuid.UUID | None = None
    reviewed_at: datetime | None = None
    rejection_reason: str | None = None
    created_at: datetime


# ---------------------------------------------------------------------------
# 6. ReviewAction
# ---------------------------------------------------------------------------


class ReviewActionCreate(BaseModel):
    action: ReviewActionType
    note: str | None = None
    scheduled_publish_at: datetime | None = None


class ReviewApproveRequest(BaseModel):
    note: str | None = None
    scheduled_publish_at: datetime | None = None


class ReviewRejectRequest(BaseModel):
    note: str | None = None


class ReviewScheduleRequest(BaseModel):
    scheduled_publish_at: datetime
    note: str | None = None


class ReviewActionOut(ORMModel):
    id: uuid.UUID
    content_id: uuid.UUID
    action: ReviewActionType
    performed_by: uuid.UUID | None = None
    note: str | None = None
    scheduled_publish_at: datetime | None = None
    created_at: datetime


# ---------------------------------------------------------------------------
# 7. EngagementMetric
# ---------------------------------------------------------------------------


class EngagementMetricBase(BaseModel):
    platform: str
    date: date
    impressions: int = 0
    reach: int = 0
    likes: int = 0
    comments: int = 0
    shares: int = 0
    saves: int = 0
    video_views: int | None = None
    click_through_rate: float = 0.0
    engagement_rate: float = 0.0
    sentiment_positive: float = Field(default=0.0, ge=0.0, le=1.0)
    sentiment_neutral: float = Field(default=0.0, ge=0.0, le=1.0)
    sentiment_negative: float = Field(default=0.0, ge=0.0, le=1.0)


class EngagementMetricCreate(EngagementMetricBase):
    campaign_id: uuid.UUID
    content_id: uuid.UUID | None = None


class EngagementMetricOut(ORMModel, EngagementMetricBase):
    id: uuid.UUID
    campaign_id: uuid.UUID
    content_id: uuid.UUID | None = None


# ---------------------------------------------------------------------------
# 8. Comment
# ---------------------------------------------------------------------------


class CommentBase(BaseModel):
    platform: str
    platform_comment_id: str
    author_handle: str
    body: str
    sentiment: Sentiment = Sentiment.neutral
    keywords: list[str] = Field(default_factory=list)
    posted_at: datetime


class CommentCreate(CommentBase):
    campaign_id: uuid.UUID
    content_id: uuid.UUID | None = None


class CommentOut(ORMModel, CommentBase):
    id: uuid.UUID
    campaign_id: uuid.UUID
    content_id: uuid.UUID | None = None
    fetched_at: datetime


# ---------------------------------------------------------------------------
# 9. RevenueMetric
# ---------------------------------------------------------------------------


class RevenueMetricBase(BaseModel):
    period_start: date
    period_end: date
    revenue: Decimal = Decimal("0")
    attributed_revenue: Decimal = Decimal("0")
    exposure_score: float = 0.0
    conversions: int = 0
    cost_per_acquisition: Decimal = Decimal("0")
    roas: float = 0.0
    channel: str


class RevenueMetricCreate(RevenueMetricBase):
    campaign_id: uuid.UUID | None = None
    product_id: uuid.UUID | None = None


class RevenueMetricOut(ORMModel, RevenueMetricBase):
    id: uuid.UUID
    org_id: uuid.UUID
    campaign_id: uuid.UUID | None = None
    product_id: uuid.UUID | None = None
    recorded_at: datetime


class RevenueFilter(BaseModel):
    """Query filters for the revenue metrics endpoint."""

    campaign_id: uuid.UUID | None = None
    product_id: uuid.UUID | None = None
    period_start: date | None = None
    period_end: date | None = None
    channel: str | None = None


# ---------------------------------------------------------------------------
# 10. AIConversation & AIMessage
# ---------------------------------------------------------------------------


class AIMessageBase(BaseModel):
    role: MessageRole
    content: str
    quick_prompt_used: str | None = None


class AIMessageCreate(BaseModel):
    """Client sends a message; role defaults to `user` server-side."""

    content: str = Field(min_length=1)
    quick_prompt_used: str | None = None


class AIMessageOut(ORMModel, AIMessageBase):
    id: uuid.UUID
    conversation_id: uuid.UUID
    created_at: datetime


class AIConversationCreate(BaseModel):
    title: str | None = None
    context_campaign_id: uuid.UUID | None = None


class AIConversationUpdate(BaseModel):
    title: str | None = None


class AIConversationOut(ORMModel):
    id: uuid.UUID
    org_id: uuid.UUID
    user_id: uuid.UUID
    title: str | None = None
    context_campaign_id: uuid.UUID | None = None
    created_at: datetime
    updated_at: datetime


class AIConversationDetailOut(AIConversationOut):
    """Conversation including its full message thread."""

    messages: list[AIMessageOut] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# 11. Notification
# ---------------------------------------------------------------------------


class NotificationBase(BaseModel):
    type: NotificationType
    title: str
    body: str
    related_campaign_id: uuid.UUID | None = None


class NotificationCreate(NotificationBase):
    user_id: uuid.UUID


class NotificationOut(ORMModel, NotificationBase):
    id: uuid.UUID
    user_id: uuid.UUID
    is_read: bool
    created_at: datetime


# ---------------------------------------------------------------------------
# Generic helpers
# ---------------------------------------------------------------------------


class Message(BaseModel):
    """Simple message envelope for acknowledgement responses."""

    detail: str


# ---------------------------------------------------------------------------
# 11. Image & Video (AI-generated media)
# ---------------------------------------------------------------------------


class MediaGenerateRequest(BaseModel):
    """Payload for the text, image, audio and video generation endpoints."""

    platform: Platform
    prompt: str = Field(min_length=1, max_length=4000)

class ImageOut(ORMModel):
    
    # id: uuid.UUID
    # campaign_id: uuid.UUID
    prompt: str
    file_path: str
    # created_at: datetime
    
class PostContentOut(ORMModel):
    prompt:str = Field(min_length=1, max_length=6000)
    text_content:str


class VideoOut(ORMModel):
    id: uuid.UUID
    campaign_id: uuid.UUID
    prompt: str
    file_path: str
    created_at: datetime


# ---------------------------------------------------------------------------
# 12. Post & TextContent
# ---------------------------------------------------------------------------


class PostBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    platform: Platform = Platform.instagram
    status: PostStatus = PostStatus.review
    scheduled_at: datetime | None = None


class PostCreate(PostBase):
    campaign_id: uuid.UUID


class PostUpdate(BaseModel):
    title: str | None = None
    platform: Platform | None = None
    status: PostStatus | None = None
    scheduled_at: datetime | None = None


class PostOut(ORMModel, PostBase):
    id: uuid.UUID
    campaign_id: uuid.UUID
    posted_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class TextContentBase(BaseModel):
    prompt: str = Field(min_length=1)
    body: str = Field(min_length=1)


class TextContentCreate(TextContentBase):
    """Store a piece of generated text against a campaign, optionally a post."""

    campaign_id: uuid.UUID
    post_id: uuid.UUID | None = None


class TextContentUpdate(BaseModel):
    """Edit the copy, or attach it to a post once one exists."""

    body: str | None = None
    post_id: uuid.UUID | None = None


class TextContentOut(ORMModel, TextContentBase):
    id: uuid.UUID
    campaign_id: uuid.UUID
    post_id: uuid.UUID | None = None
    created_at: datetime
    updated_at: datetime


class TextGenerateRequest(BaseModel):
    """Mirrors MediaGenerateRequest, for a future generate-text endpoint."""

    prompt: str = Field(min_length=1, max_length=4000)
    campaign_id: uuid.UUID | None = None
    post_id: uuid.UUID | None = None
