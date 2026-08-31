# APEX — CMO Intelligence Platform

An AI-assisted marketing workspace for a consumer electronics brand. It covers the
full path from **strategy** (what the company is trying to become) down to
**campaigns**, **generated content**, and **post-campaign analysis**.

The repository holds two applications:

| | Stack | Purpose |
|---|---|---|
| `frontend/` | React 18 + Vite 8 | The full product UI |
| `backend/` | FastAPI + SQLAlchemy + PostgreSQL | API, database, and AI generation agents |

> **Project status — read this first.** The frontend is a working, fully
> navigable prototype: most screens run on local mock data. Two features are
> wired to the real backend today — **image generation** and **text/post-content
> generation**. See [Project status](#project-status) for the exact split.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Connecting the frontend to the backend](#connecting-the-frontend-to-the-backend)
- [Project status](#project-status)
- [Deployment](#deployment)
- [Known gaps](#known-gaps)

---

## Features

### Strategy
The layer above campaigns. A strategy is the intent that several campaigns —
often mixing physical and online activity — serve together. Built around three
goals: **Reputation & Popularity**, **Brand Voice & Positioning**, and **Product
Promotion**.

Each strategy has an Overview (objective, why now, KPIs), a Brand Voice tab
(voice pillars, do/don't tone rules, per-product positioning), a Campaign Mix,
and a phased Roadmap. Every section links through to campaign management. A
five-step wizard creates new strategies.

### Campaign management
Create physical (roadshow, pop-up, sponsorship…) or online (single post or
multi-post series) campaigns. Each campaign detail page carries:

- **Campaign Plan** — phases, deliverables checklist with per-item asset counts, budget split, timeline
- **AI Planner** — a chat that drafts and refines the plan, sharing state with the plan tab
- **Content Generator** — text, image, audio, video and email generation
- **Engagement & Reactions** — sentiment, keywords, comments
- **Post Tracker** (online) — every post with colour-coded status: *in review · pending to post · posted · deleted*, inline editing, platform and schedule pickers
- **AI Summary** — appears once the campaign status is set to *Ended*; grades the campaign and gives forward-looking advice

### Content generator
One reusable component used across campaign pages. Generates **text**,
**image**, **audio**, **video**, and **email** (newsletter, promotion, product
launch, re-engagement, event invite, product update). Markdown in model output
is rendered rather than shown raw.

### Analytics
Revenue and funnel reporting with a custom two-month date-range picker, a social
media profile section (followers, engagement, reach per platform), and an **AI
Summary** that reviews the selected period and recommends next steps.

### Demographic analysis
Industry sentiment trends, audience demographics by age/gender/region, viral
topic tracking with virality scores, and competitor monitoring.

### Profile & settings
Account details plus **per-content-type AI model selection** — choose which
model handles text/email, image, audio and video. The choice persists to
`localStorage` and is sent with every generation request.

---

## Tech stack

**Frontend**
- React 18, Vite 8
- Chart.js via `react-chartjs-2`
- `react-icons`
- No CSS framework — a single hand-written `index.css` with CSS custom properties

**Backend**
- FastAPI, Uvicorn
- SQLAlchemy 2 (async) with `psycopg` 3
- PostgreSQL, migrations via Alembic
- Pydantic v2 schemas
- Hugging Face Inference (`black-forest-labs/FLUX.1-dev` via fal.ai) for images
- Google ADK + LiteLLM + Ollama (`gemma`) for text generation

---

## Repository layout

```
CMO_AI_Agent/
├── frontend/
│   ├── src/
│   │   ├── api/contentApi.js      # single integration point for the backend
│   │   ├── components/            # ContentGenerator, PostTracker, DateRangePicker…
│   │   ├── hooks/                 # useContentGenerator
│   │   ├── pages/                 # one file per screen
│   │   ├── *Data.js               # mock data modules (campaigns, strategy, analytics…)
│   │   ├── settingsStore.js       # profile + AI model preferences
│   │   └── index.css              # all styling
│   └── package.json
│
└── backend/
    ├── app/
    │   ├── app.py                 # FastAPI app, CORS, /media mount, router includes
    │   ├── database.py            # async engine, session, get_db
    │   ├── models.py              # SQLAlchemy ORM models
    │   └── schemas.py             # Pydantic schemas
    ├── routers/
    │   ├── campaigns.py           # generation endpoints
    │   └── ai_agent.py            # chat endpoint (not yet registered)
    ├── agents/manager/sub_agents/ # image, post-content, video, img2img generators
    ├── alembic/                   # migrations
    ├── data/{image,video}/        # generated media, served at /media
    ├── main.py                    # uvicorn entrypoint
    └── requirements.txt
```

### Database models

`Organization → User · Product · Campaign`, with `Campaign` owning
`CampaignContent`, `EngagementMetric`, `Comment`, `Post`, `TextContent`,
`Image` and `Video`. Plus `AIConversation`/`AIMessage`, `Notification`,
`RevenueMetric` and `ReviewAction`.

---

## Getting started

### Prerequisites

- **Node.js** ≥ 22.12
- **Python** 3.11+
- **PostgreSQL** running locally
- A **Hugging Face** API token (image generation)
- **Ollama** with a `gemma` model pulled (text generation)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at <http://localhost:5173>. The UI works without the backend — anything not
yet wired falls back to built-in mock data.

```bash
npm run build     # production build to dist/
npm run preview   # serve the build locally
```

### Backend

```bash
cd backend
python -m venv .venv
```

Activate it — **Windows (PowerShell):**

```powershell
.venv\Scripts\activate
```

**macOS / Linux:**

```bash
source .venv/bin/activate
```

Then install the dependencies:

```bash
pip install -r requirements.txt
```

> `post_content_generator` also imports `google-adk` and `litellm`, which are not
> yet listed in `requirements.txt`. Until they are, install them separately:
>
> ```bash
> pip install google-adk litellm
> ```

Create the database, then apply the migrations:

```bash
alembic upgrade head
```

Start the API **from the `backend/` directory** (the `/media` static mount
resolves `data/` relative to the working directory):

```bash
python main.py
```

The API runs at <http://localhost:8001>, with interactive docs at
<http://localhost:8001/docs>.

---

## Environment variables

### Backend — `backend/.env`

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | yes | e.g. `postgresql+psycopg://user:password@localhost:5432/apex_cmo` |
| `HUGGINGFACE_API` | image generation | Hugging Face API token |
| `HF_IMAGE_MODEL` | no | Defaults to `black-forest-labs/FLUX.1-dev` |
| `HF_VIDEO_MODEL` | no | Defaults to `Wan-AI/Wan2.1-T2V-14B` |
| `HF_PROVIDER` | no | Defaults to `fal-ai` |
| `OLLAMA_API_KEY` | text generation | For a hosted Ollama endpoint |
| `CORS_ORIGINS` | no | Comma-separated; defaults to the Vite dev server |
| `SQL_ECHO` | no | `true` to log SQL |
| `INSTAGRAM_USERNAME` / `INSTAGRAM_PASSWORD` | optional | Only for the scripts in `utils/` |

> ⚠️ **`DATABASE_URL` is currently hardcoded** in `backend/app/database.py`,
> including the password. Before making this repository public, move it back to
> `os.getenv("DATABASE_URL", …)` and rotate that password. The commented-out
> `os.getenv` call is still in the file directly above it.

### Frontend — `frontend/.env`

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8001/api/v1` | Backend API root |
| `VITE_MEDIA_BASE_URL` | `http://localhost:8001/media` | Where generated media is served |

---

## API reference

| Method | Path | Body | Returns |
|---|---|---|---|
| `GET` | `/health` | — | Liveness probe (not under `/api/v1`) |
| `POST` | `/api/v1/campaigns/generate-image` | `{ prompt, platform }` | `{ prompt, file_path }` |
| `POST` | `/api/v1/campaigns/generate-post-content` | `{ prompt, platform }` | `{ prompt, text_content }` |

`platform` must be one of the `Platform` enum values: `instagram`, `tiktok`,
`facebook`, `youtube`, `linkedin`, `twitter`, `all`.

Generated files are written to `backend/data/{image,video}/` and served from
`/media/…`.

---

## Connecting the frontend to the backend

All backend calls go through a single file — **`frontend/src/api/contentApi.js`**.
Nothing else in the UI calls `fetch`.

To bring a content type online:

1. Add its path to `GENERATION_ENDPOINTS` (a `null` entry keeps that type on mock data)
2. Map the response shape in `adaptGenerationResponse()`
3. That's it — every content generator in the app picks it up

```js
export const GENERATION_ENDPOINTS = {
  text:  () => '/campaigns/generate-post-content',
  image: () => '/campaigns/generate-image',
  audio: null,   // still mocked
  video: null,   // still mocked
}
```

Set `FORCE_MOCK = true` in the same file to run the whole UI offline.

---

## Project status

| Area | Status |
|---|---|
| Frontend UI — all pages | ✅ Complete and navigable |
| Text / post-content generation | ✅ Live against the backend |
| Image generation | ✅ Live — file saved to disk and rendered from `/media` |
| Audio & video generation | ⚠️ UI complete, mock output — no endpoint yet |
| Email generation | ⚠️ UI complete, mock content by design |
| Database models & migrations | ✅ Defined, Alembic migrations applied |
| Campaign / strategy / analytics APIs | ❌ Not built — the UI uses mock data modules |
| Authentication | ❌ Not implemented |

State is held in memory, so edits (checklists, post statuses, created
strategies) reset on reload. Profile and AI model preferences are the exception —
they persist to `localStorage`.

---

## Deployment

The **frontend** deploys to Vercel:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_BASE_URL` and `VITE_MEDIA_BASE_URL` to your deployed API

`package.json` pins `engines.node` to `>=22.12.0`, which is required by
`@vitejs/plugin-react` 6.

The **backend** is not yet deployed. It needs a PostgreSQL instance, the
environment variables above, and a reachable Ollama endpoint for text
generation.

---

## Known gaps

These are known and intentional at this stage:

- `DATABASE_URL` is hardcoded in `app/database.py` (see the warning above)
- `requirements.txt` is missing `google-adk` and `litellm`, which
  `post_content_generator` imports — install them separately for now
- `agents/.../image_generator/agent.py` calls `load_dotenv()` with an absolute
  Windows path; change it to a relative one before running elsewhere
- `routers/ai_agent.py` defines a `/chat` endpoint that is not registered in `app.py`
- `video_generator` and `img2img_generator` agents are stubs
- `__pycache__/` and `.pyc` files are tracked in git and should be removed
  (`git rm -r --cached '**/__pycache__'`) with `__pycache__/` added to `.gitignore`
- `agents/manager/.adk/session.db` is a local agent database that is also tracked
  and does not belong in version control
- The frontend bundle is ~600 kB; code-splitting the heavier pages would help

---

## License

Not currently licensed. Add a `LICENSE` file before making the repository public
if you intend others to use it.
