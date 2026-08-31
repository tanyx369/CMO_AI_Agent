"""SQLAlchemy ORM models for the APEX CMO Intelligence Platform.

Domain map:

    Organization
      ├── User
      ├── Product
      ├── Campaign
      │     ├── CampaignContent
      │     │     ├── ReviewAction
      │     │     └── Comment
      │     ├── EngagementMetric
      │     ├── Post
      │     │     └── TextContent
      │     ├── TextContent
      │     ├── Image
      │     ├── Video
      │     └── RevenueMetric
      └── RevenueMetric

    User
      ├── AIConversation
      │     └── AIMessage
      └── Notification
"""

from __future__ import annotations

import enum
import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum as SAEnum,
    Float,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base

# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------
# All enums subclass `str` so the same objects serialize cleanly in both
# SQLAlchemy (stored as their `.value`) and Pydantic (JSON strings).


class PlanType(str, enum.Enum):
    starter = "starter"
    pro = "pro"
    enterprise = "enterprise"


class UserRole(str, enum.Enum):
    cmo = "cmo"
    marketer = "marketer"
    analyst = "analyst"
    viewer = "viewer"


class CampaignCategory(str, enum.Enum):
    """Top-level campaign kind — mirrors the taxonomy used by the frontend."""

    physical = "physical"
    online = "online"


class OnlineType(str, enum.Enum):
    """Sub-kind for online campaigns."""

    single = "single"  # one standalone post on one platform
    campaign = "campaign"  # a multi-post series across platforms


class PhysicalType(str, enum.Enum):
    """Sub-kind for physical (on-ground) campaigns."""

    roadshow = "roadshow"
    event_collaboration = "event_collaboration"
    pop_up_booth = "pop_up_booth"
    sponsorship = "sponsorship"
    product_demo = "product_demo"
    conference_expo = "conference_expo"


class CampaignStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    paused = "paused"
    completed = "completed"
    archived = "archived"


class Platform(str, enum.Enum):
    instagram = "instagram"
    tiktok = "tiktok"
    facebook = "facebook"
    youtube = "youtube"
    linkedin = "linkedin"
    twitter = "twitter"
    all = "all"


class CampaignGoal(str, enum.Enum):
    awareness = "awareness"
    engagement = "engagement"
    conversion = "conversion"
    retention = "retention"


class ContentType(str, enum.Enum):
    text = "text"
    image = "image"
    audio = "audio"
    video = "video"


class ContentStatus(str, enum.Enum):
    draft = "draft"
    pending_review = "pending_review"
    approved = "approved"
    rejected = "rejected"
    scheduled = "scheduled"


class PostStatus(str, enum.Enum):
    """Lifecycle of a single post — mirrors the Post Tracker in the frontend."""

    review = "review"  # waiting on approval
    pending = "pending"  # approved and scheduled
    posted = "posted"  # live on the platform
    deleted = "deleted"  # removed, restorable


class ReviewActionType(str, enum.Enum):
    approved = "approved"
    rejected = "rejected"
    scheduled = "scheduled"


class Sentiment(str, enum.Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"


class MessageRole(str, enum.Enum):
    user = "user"
    assistant = "assistant"


class NotificationType(str, enum.Enum):
    review_pending = "review_pending"
    campaign_ended = "campaign_ended"
    budget_alert = "budget_alert"
    ai_ready = "ai_ready"
    engagement_spike = "engagement_spike"


# ---------------------------------------------------------------------------
# Reusable column helpers
# ---------------------------------------------------------------------------

def _pk() -> Mapped[uuid.UUID]:
    """UUID primary key with a Python-side default."""
    return mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


def _created_at() -> Mapped[datetime]:
    return mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


def _updated_at() -> Mapped[datetime]:
    return mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


def _enum(python_enum: type[enum.Enum], name: str) -> SAEnum:
    """Build a Postgres ENUM that stores the enum's string *values*."""
    return SAEnum(python_enum, name=name, values_callable=lambda e: [m.value for m in e])


# ---------------------------------------------------------------------------
# 1. Organization & User
# ---------------------------------------------------------------------------


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[uuid.UUID] = _pk()
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    plan: Mapped[PlanType] = mapped_column(
        _enum(PlanType, "plan_type"), default=PlanType.starter, nullable=False
    )
    created_at: Mapped[datetime] = _created_at()

    # Relationships
    users: Mapped[list["User"]] = relationship(
        back_populates="organization", cascade="all, delete-orphan"
    )
    products: Mapped[list["Product"]] = relationship(
        back_populates="organization", cascade="all, delete-orphan"
    )
    campaigns: Mapped[list["Campaign"]] = relationship(
        back_populates="organization", cascade="all, delete-orphan"
    )
    conversations: Mapped[list["AIConversation"]] = relationship(
        back_populates="organization", cascade="all, delete-orphan"
    )
    revenue_metrics: Mapped[list["RevenueMetric"]] = relationship(
        back_populates="organization", cascade="all, delete-orphan"
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = _pk()
    org_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        _enum(UserRole, "user_role"), default=UserRole.viewer, nullable=False
    )
    avatar_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    created_at: Mapped[datetime] = _created_at()
    updated_at: Mapped[datetime] = _updated_at()

    # Relationships
    organization: Mapped["Organization"] = relationship(back_populates="users")
    campaigns_created: Mapped[list["Campaign"]] = relationship(back_populates="creator")
    conversations: Mapped[list["AIConversation"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    notifications: Mapped[list["Notification"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


# ---------------------------------------------------------------------------
# 2. Product
# ---------------------------------------------------------------------------


class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = _pk()
    org_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    ai_improved_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    category: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    tags: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = _created_at()
    updated_at: Mapped[datetime] = _updated_at()

    # Relationships
    organization: Mapped["Organization"] = relationship(back_populates="products")
    campaigns: Mapped[list["Campaign"]] = relationship(back_populates="product")
    revenue_metrics: Mapped[list["RevenueMetric"]] = relationship(back_populates="product")


# ---------------------------------------------------------------------------
# 3. Campaign
# ---------------------------------------------------------------------------


class Campaign(Base):
    __tablename__ = "campaigns"

    id: Mapped[uuid.UUID] = _pk()
    org_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Campaign kind. Exactly one of `online_type` / `physical_type` is set,
    # matching `category`; the API layer enforces that pairing on write.
    category: Mapped[CampaignCategory] = mapped_column(
        _enum(CampaignCategory, "campaign_category"),
        default=CampaignCategory.online,
        nullable=False,
        index=True,
    )
    online_type: Mapped[OnlineType | None] = mapped_column(
        _enum(OnlineType, "online_type"), nullable=True
    )
    physical_type: Mapped[PhysicalType | None] = mapped_column(
        _enum(PhysicalType, "physical_type"), nullable=True
    )
    status: Mapped[CampaignStatus] = mapped_column(
        _enum(CampaignStatus, "campaign_status"), default=CampaignStatus.draft, nullable=False
    )
    platform: Mapped[Platform] = mapped_column(
        _enum(Platform, "platform"), default=Platform.all, nullable=False
    )
    goal: Mapped[CampaignGoal] = mapped_column(
        _enum(CampaignGoal, "campaign_goal"), default=CampaignGoal.awareness, nullable=False
    )
    budget: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0"), nullable=False)
    spent: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0"), nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    progress: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = _created_at()
    updated_at: Mapped[datetime] = _updated_at()

    # Relationships
    organization: Mapped["Organization"] = relationship(back_populates="campaigns")
    product: Mapped["Product | None"] = relationship(back_populates="campaigns")
    creator: Mapped["User | None"] = relationship(back_populates="campaigns_created")
    contents: Mapped[list["CampaignContent"]] = relationship(
        back_populates="campaign", cascade="all, delete-orphan"
    )
    engagement_metrics: Mapped[list["EngagementMetric"]] = relationship(
        back_populates="campaign", cascade="all, delete-orphan"
    )
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="campaign", cascade="all, delete-orphan"
    )
    # images: Mapped[list["Image"]] = relationship(
    #     back_populates="campaign", cascade="all, delete-orphan"
    # )
    videos: Mapped[list["Video"]] = relationship(
        back_populates="campaign", cascade="all, delete-orphan"
    )
    posts: Mapped[list["Post"]] = relationship(
        back_populates="campaign", cascade="all, delete-orphan"
    )
    # texts: Mapped[list["TextContent"]] = relationship(
    #     back_populates="campaign", cascade="all, delete-orphan"
    # )
    revenue_metrics: Mapped[list["RevenueMetric"]] = relationship(back_populates="campaign")


# ---------------------------------------------------------------------------
# 4. CampaignContent
# ---------------------------------------------------------------------------


class CampaignContent(Base):
    __tablename__ = "campaign_contents"

    id: Mapped[uuid.UUID] = _pk()
    campaign_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, index=True
    )
    content_type: Mapped[ContentType] = mapped_column(
        _enum(ContentType, "content_type"), nullable=False
    )
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    generated_output: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[ContentStatus] = mapped_column(
        _enum(ContentStatus, "content_status"), default=ContentStatus.draft, nullable=False
    )
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = _created_at()

    # Relationships
    campaign: Mapped["Campaign"] = relationship(back_populates="contents")
    reviewer: Mapped["User | None"] = relationship()
    review_actions: Mapped[list["ReviewAction"]] = relationship(
        back_populates="content", cascade="all, delete-orphan"
    )
    engagement_metrics: Mapped[list["EngagementMetric"]] = relationship(back_populates="content")
    comments: Mapped[list["Comment"]] = relationship(back_populates="content")


# ---------------------------------------------------------------------------
# 5. ReviewAction
# ---------------------------------------------------------------------------


class ReviewAction(Base):
    __tablename__ = "review_actions"

    id: Mapped[uuid.UUID] = _pk()
    content_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("campaign_contents.id", ondelete="CASCADE"), nullable=False, index=True
    )
    action: Mapped[ReviewActionType] = mapped_column(
        _enum(ReviewActionType, "review_action_type"), nullable=False
    )
    performed_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    scheduled_publish_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = _created_at()

    # Relationships
    content: Mapped["CampaignContent"] = relationship(back_populates="review_actions")
    performer: Mapped["User | None"] = relationship()


# ---------------------------------------------------------------------------
# 6. EngagementMetric
# ---------------------------------------------------------------------------


class EngagementMetric(Base):
    __tablename__ = "engagement_metrics"

    id: Mapped[uuid.UUID] = _pk()
    campaign_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, index=True
    )
    content_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("campaign_contents.id", ondelete="SET NULL"), nullable=True, index=True
    )
    platform: Mapped[str] = mapped_column(String(50), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    impressions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reach: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    likes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    comments: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    shares: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    saves: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    video_views: Mapped[int | None] = mapped_column(Integer, nullable=True)
    click_through_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    engagement_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    sentiment_positive: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    sentiment_neutral: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    sentiment_negative: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    # Relationships
    campaign: Mapped["Campaign"] = relationship(back_populates="engagement_metrics")
    content: Mapped["CampaignContent | None"] = relationship(back_populates="engagement_metrics")


# ---------------------------------------------------------------------------
# 7. Comment
# ---------------------------------------------------------------------------


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[uuid.UUID] = _pk()
    campaign_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, index=True
    )
    content_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("campaign_contents.id", ondelete="SET NULL"), nullable=True, index=True
    )
    platform: Mapped[str] = mapped_column(String(50), nullable=False)
    platform_comment_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    author_handle: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    sentiment: Mapped[Sentiment] = mapped_column(
        _enum(Sentiment, "sentiment"), default=Sentiment.neutral, nullable=False
    )
    keywords: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    posted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    fetched_at: Mapped[datetime] = _created_at()

    # Relationships
    campaign: Mapped["Campaign"] = relationship(back_populates="comments")
    content: Mapped["CampaignContent | None"] = relationship(back_populates="comments")


# ---------------------------------------------------------------------------
# 8. RevenueMetric
# ---------------------------------------------------------------------------


class RevenueMetric(Base):
    __tablename__ = "revenue_metrics"

    id: Mapped[uuid.UUID] = _pk()
    org_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    campaign_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("campaigns.id", ondelete="SET NULL"), nullable=True, index=True
    )
    product_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True
    )
    period_start: Mapped[date] = mapped_column(Date, nullable=False)
    period_end: Mapped[date] = mapped_column(Date, nullable=False)
    revenue: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0"), nullable=False)
    attributed_revenue: Mapped[Decimal] = mapped_column(
        Numeric(14, 2), default=Decimal("0"), nullable=False
    )
    exposure_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    conversions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    cost_per_acquisition: Mapped[Decimal] = mapped_column(
        Numeric(14, 2), default=Decimal("0"), nullable=False
    )
    roas: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    channel: Mapped[str] = mapped_column(String(80), nullable=False)
    recorded_at: Mapped[datetime] = _created_at()

    # Relationships
    organization: Mapped["Organization"] = relationship(back_populates="revenue_metrics")
    campaign: Mapped["Campaign | None"] = relationship(back_populates="revenue_metrics")
    product: Mapped["Product | None"] = relationship(back_populates="revenue_metrics")


# ---------------------------------------------------------------------------
# 9. AIConversation & AIMessage
# ---------------------------------------------------------------------------


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id: Mapped[uuid.UUID] = _pk()
    org_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    context_campaign_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("campaigns.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = _created_at()
    updated_at: Mapped[datetime] = _updated_at()

    # Relationships
    organization: Mapped["Organization"] = relationship(back_populates="conversations")
    user: Mapped["User"] = relationship(back_populates="conversations")
    context_campaign: Mapped["Campaign | None"] = relationship()
    messages: Mapped[list["AIMessage"]] = relationship(
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="AIMessage.created_at",
    )


class AIMessage(Base):
    __tablename__ = "ai_messages"

    id: Mapped[uuid.UUID] = _pk()
    conversation_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    role: Mapped[MessageRole] = mapped_column(_enum(MessageRole, "message_role"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    quick_prompt_used: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = _created_at()

    # Relationships
    conversation: Mapped["AIConversation"] = relationship(back_populates="messages")


# ---------------------------------------------------------------------------
# 10. Notification
# ---------------------------------------------------------------------------


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = _pk()
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    type: Mapped[NotificationType] = mapped_column(
        _enum(NotificationType, "notification_type"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    related_campaign_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("campaigns.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = _created_at()

    # Relationships
    user: Mapped["User"] = relationship(back_populates="notifications")


# ---------------------------------------------------------------------------
# 11. Image
# ---------------------------------------------------------------------------


class Image(Base):
    """An AI-generated image belonging to a campaign.

    Only the file *path* is stored — the bytes live on disk under
    ``backend/data/image/``. Paths are kept relative to the backend directory so
    the database stays portable across machines and deployments.
    """

    __tablename__ = "images"

    id: Mapped[uuid.UUID] = _pk()
    # campaign_id: Mapped[uuid.UUID] = mapped_column(
    #     ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, index=True
    # )
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    created_at: Mapped[datetime] = _created_at()

    # Relationships
    # campaign: Mapped["Campaign"] = relationship(back_populates="images")


# ---------------------------------------------------------------------------
# 12. Video
# ---------------------------------------------------------------------------


class Video(Base):
    """An AI-generated video belonging to a campaign.

    Mirrors :class:`Image`; the bytes live under ``backend/data/video/``.
    """

    __tablename__ = "videos"

    id: Mapped[uuid.UUID] = _pk()
    campaign_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, index=True
    )
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    created_at: Mapped[datetime] = _created_at()

    # Relationships
    campaign: Mapped["Campaign"] = relationship(back_populates="videos")


# ---------------------------------------------------------------------------
# 13. Post
# ---------------------------------------------------------------------------


class Post(Base):
    """One publishable post inside a campaign.

    This is the unit the Post Tracker manages: it owns the schedule, the target
    platform and the review status, while the content itself lives in the
    per-type tables (:class:`TextContent`, and eventually Image/Video).

    Added because text content has to belong to *some* post — there was no
    posts table for it to reference.
    """

    __tablename__ = "posts"

    id: Mapped[uuid.UUID] = _pk()
    campaign_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    platform: Mapped[Platform] = mapped_column(
        _enum(Platform, "platform"), default=Platform.instagram, nullable=False
    )
    status: Mapped[PostStatus] = mapped_column(
        _enum(PostStatus, "post_status"), default=PostStatus.review, nullable=False, index=True
    )
    # When the post is meant to go out; `posted_at` records when it actually did.
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    posted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = _created_at()
    updated_at: Mapped[datetime] = _updated_at()

    # Relationships
    campaign: Mapped["Campaign"] = relationship(back_populates="posts")
    # texts: Mapped[list["TextContent"]] = relationship(
    #     back_populates="post", cascade="all, delete-orphan"
    # )


# ---------------------------------------------------------------------------
# 14. TextContent
# ---------------------------------------------------------------------------


class TextContent(Base):
    """A piece of generated text — a caption, ad copy, headline or script.

    Named `TextContent` rather than `Text` so it does not shadow SQLAlchemy's
    `Text` column type, which is imported at the top of this module.

    `campaign_id` is denormalised alongside `post_id` on purpose: text is
    generated before it is attached to a post, so the campaign is known first
    and stays queryable without a join.
    """

    __tablename__ = "text_contents"

    id: Mapped[uuid.UUID] = _pk()
    # campaign_id: Mapped[uuid.UUID] = mapped_column(
    #     ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, index=True
    # )
    # Null until the text is attached to a post in the tracker.
    # post_id: Mapped[uuid.UUID | None] = mapped_column(
    #     ForeignKey("posts.id", ondelete="CASCADE"), nullable=True, index=True
    # )
    # The instruction given to the model, kept for regeneration and audit.
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    # The generated copy itself.
    body: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = _created_at()
    updated_at: Mapped[datetime] = _updated_at()

    # Relationships
    # campaign: Mapped["Campaign"] = relationship(back_populates="texts")
    # post: Mapped["Post | None"] = relationship(back_populates="texts")
