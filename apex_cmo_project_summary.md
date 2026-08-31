# Apex CMO — Project Summary

*Compiled from a walkthrough of the live codebase at `D:\\Kabel Projects\\CMO AI Agent\\CMO\_AI\_Agent` on 30 Aug 2026.*

## The Problem

Startup and SME founders are usually their own marketing department. They don't have the budget for a full marketing team, a media-buying agency, or enterprise martech, but they're still expected to run a coherent strategy, keep several social channels alive, produce content on a near-daily cadence, and know whether any of it is working — all while running the rest of the business. The two failure modes this causes are strategic drift (campaigns get launched without a plan behind them, so effort doesn't compound) and monitoring blindness (nobody has time to watch Instagram, TikTok, competitor activity, and revenue data at once, so problems and opportunities are caught late, if at all).

Apex CMO is built to close both gaps with one AI-driven platform rather than a stack of point tools, so a founder gets CMO-level output without CMO-level headcount or spend.

## Who It's For

A solo founder or a two-to-five-person marketing function at a small company — someone who currently does strategy, content, scheduling, and reporting themselves, in the gaps between everything else. The product's economics only work if it replaces hours, not adds a learning curve, so every feature is built around "tell the AI what you want, review what it produces" rather than manual configuration.

## How the Product Is Organized

Apex CMO has two layers that sit above and below one boundary the codebase treats as central: **Strategy** and **Campaigns**. A strategy is the intent — the reputation goal, the brand voice, the product positioning — and a campaign is one concrete execution of it. This split exists because SME marketing usually fails at the strategy layer, not the execution layer: founders can write an Instagram caption, but they rarely maintain a standing plan for what every caption is supposed to add up to. Making that layer a first-class, always-visible object (rather than a doc that gets written once and forgotten) is the platform's core bet.

### Strategy — the plan every campaign has to serve

**Purpose.** A founder opens the Strategy page and, through a five-step guided wizard (goal → objective → brand voice → linked campaigns → review), defines what the company is trying to become: which of three pillars it's driving (reputation, brand voice \& consistency, or product positioning), what "success" looks like in measurable KPIs, the tone rules every piece of content must follow (explicit "do" and "don't" lists), and how each product should be described. Every campaign created afterward can be attached to a strategy, and the strategy detail page shows its full campaign mix, a roadmap of phases, and AI-generated strategic advice.

**Real impact.** This is what stops a founder's marketing from being a pile of disconnected posts. Without it, a small team's biggest inefficiency isn't a lack of ideas — it's producing content that doesn't reinforce a consistent voice or positioning, so audience trust and recognition never compound. By forcing brand voice and positioning into a structured, reusable artifact that every content-generation tool reads from, Apex CMO gives a one-person marketing function the strategic consistency that used to require a CMO and a brand guidelines document nobody actually opened.

### AI-Powered Campaign Generator (Campaign Plan + AI Planner)

**Purpose.** Inside a multi-post online campaign, the "Campaign Plan" and "AI Planner" tabs let the founder describe a campaign's purpose in a chat interface and get back a complete, structured plan: phases with dates and progress tracking, a campaign brief (objective, target audience, duration), a budget split across channels, a full content-requirements breakdown (how many text/image/audio/video pieces are needed), a deliverables checklist, and a milestone timeline — all editable and regenerable through follow-up chat messages.

**Real impact.** Planning a campaign from scratch — figuring out phases, how much content is needed, how to split a limited budget, and what has to be done by when — is exactly the kind of work an SME founder either skips (and pays for later in disorganized execution) or spends hours on manually. Turning "I want to launch our new fitness tracker to Gen Z on TikTok" into a phased plan with a budget split and a deliverables checklist in minutes replaces the work of a campaign strategist, and because the checklist is tied to real deliverable counts, it also prevents the common SME failure of launching a campaign with only half the promised content ready.

### AI-Powered Content Generator

**Purpose.** A single reusable generator (`ContentGenerator.jsx`, backed by `useContentGenerator` and `api/contentApi.js`) produces five content types — Text, Image, Audio, Video, and Email — from a prompt, with controls for platform, copy format, tone, and (for email) the specific email type (announcement, win-back, newsletter, etc.). On the backend, text generation is already live: a Google ADK agent (`post\_content\_generator`, running on a self-hosted Ollama model) turns a prompt plus target platform into finished copy, and it's wired to a real database table (`TextContent`) so generated copy is persisted. Image generation is also live end-to-end: it calls a Hugging Face inference endpoint (FLUX.1-dev via the fal-ai provider) to generate a real image, saves it to disk, and records it in the database with its prompt. Video generation exists as a stub against the same Hugging Face client (Wan2.1 text-to-video) but isn't wired into the API yet. Generated content flows straight into the Post Tracker (online campaigns) or Review Queue (physical campaigns) with one click.

**Real impact.** Content production is the single biggest recurring time cost for a small marketing team — a founder posting daily across three or four platforms is effectively running a small content studio alone. Replacing a copywriter, a graphic designer, and (eventually) a video editor with prompt-driven generation is the direct labor-cost substitution this product is built around, and doing it inside the same tool that already knows the brand voice and campaign objective (rather than a generic AI chat tool) means the output needs less manual correction to stay on-brand.

### AI-Powered Summary Generator

**Purpose.** Two instances of the same idea exist in the platform. At the campaign level, once a campaign's status is moved to "Ended," a Post-Campaign AI Summary panel becomes available: it grades the campaign, states a verdict, breaks out real metric deltas, lists what worked and what held it back, and gives prioritized advice for the next campaign. At the account level, the Analytics page runs the same kind of AI summary continuously over whatever date range is selected, reading real revenue, ad spend, ROAS, and social profile data to produce wins, concerns, and next actions — and it's wired to the Demographic Analysis page (industry sentiment, viral topics, competitor moves) so it can factor outside market movement in, not just the company's own numbers.

**Real impact.** This is the step SME founders almost never get to: closing the loop after a campaign ends and asking "did that work, and what should change next time." Without dedicated analytics staff, that reflection either doesn't happen or happens as a gut feeling. Automating it means every campaign makes the next one smarter by default, and it turns raw analytics dashboards (which require someone trained to interpret them) into a plain-language verdict and an ordered action list a founder can act on in five minutes.

### Strategist AI

**Purpose.** A persistent conversational assistant (its own chat page, with history and quick prompts) that a founder can ask anything marketing-related and get an answer grounded in the account's own data — the interface explicitly flags "Connected to live data" and "Product catalog synced." It's meant to be the single entry point for verbal/conversational control of the whole platform, not just a Q\&A bot bolted on the side.

**Real impact.** This is the product's answer to the fact that a solo founder doesn't have a CMO to walk into and ask "what should I do about this". Instead of hunting through five different pages to piece together an answer, they ask once and get a synthesized, data-grounded recommendation — the product's stated ambition (per the project's core-values doc) is for this assistant to eventually let a founder run the platform by conversation alone, which matters most for the least technical users the product targets.

### Analytics

**Purpose.** Tracks revenue, ad spend, blended ROAS, new customers, a daily revenue trend, revenue by channel, a full conversion funnel (impressions → clicks → cart → checkout → purchase), and exposure by product — all filterable by a custom date range. Sitting directly beneath it, a "Social Media Profiles" panel tracks follower counts, growth, engagement rate, post volume, reach, and profile visits per platform, so the same page answers both "is this making money" and "is the audience growing."

**Real impact.** This replaces the patchwork most SMEs run today — a Google Analytics tab, native platform insights on three different apps, and a spreadsheet someone updates when they remember to. Consolidating revenue and social performance into one place, with the AI summary layered on top, is what makes "monitor multiple social media platforms at the same time" (the problem statement's second core complaint) actually solvable by one person instead of a team.

### Demographic \& Market Analytics

**Purpose.** A dedicated page with four views: Industry Pulse (brand sentiment trend versus the industry average, share of voice against named competitors, sentiment broken down by platform), Audience Demographics (who's talking, by age segment and gender, with sentiment and topics per segment, plus a regional breakdown), Viral Topics (trending topics filterable by lifecycle stage and platform, each with a recommended action), and Competitors (share of voice, sentiment, estimated spend, posting cadence, stated strategy, strengths/weaknesses, and a timeline of recent competitor moves with impact ratings).

**Real impact.** Competitive and demographic intelligence is normally the first thing an SME cuts because it requires either a paid social-listening tool or a dedicated analyst. This page is the platform's substitute for both: it tells a founder not just how their own content performed but who they're actually competing with for attention, what their audience looks like beyond basic follower counts, and what's about to be culturally relevant before it peaks — the "breaking" flag on fast-growing topics exists specifically so a small team can catch a trend early enough to act on it, not after it's already saturated.

### Supporting features

The **Product Catalog** keeps product descriptions current and "AI improve"-able, and it exists because every content generator in the platform is prompted with product context — sharper source descriptions mean better generated copy everywhere downstream. **Campaign Management** (the campaign list, calendar view, and per-campaign detail with Post Tracker / Review Queue / Engagement \& Reactions tabs) is the execution and approval layer beneath Strategy and the generators: it's where a founder actually schedules, approves, or rejects what the AI produced before it goes out, which matters because unreviewed AI content going straight to a public feed is a real brand risk for a company that can't afford a PR misstep. The **Home dashboard** surfaces "pick up where you left off" items, top-line KPIs, and one-click quick actions, so a founder logging in for five minutes between other tasks can see what actually needs their attention instead of hunting for it.

## Current Build Status (important for planning next steps)

The product is further along on the frontend than the backend, and that gap is worth being explicit about. The **entire frontend UI** described above exists and is fully interactive — every page, panel, and workflow listed is built in React. Two AI capabilities are **live and connected end-to-end** through a FastAPI backend: text-content generation (Google ADK agent on a self-hosted Ollama model, persisted to a real Postgres-oriented schema) and image generation (Hugging Face's FLUX.1-dev via fal-ai, saved to disk and recorded in the database). Video generation exists as a working proof-of-concept against Hugging Face's Wan2.1 model but is not yet wired to an API route. The remaining AI features described above — the Campaign Planner, Post-Campaign Summary, Analytics AI Summary, Strategist AI chat, and Demographic Analysis — are currently **UI-complete but running on realistic mock data in the browser**, with no live model or database call behind them yet; the database schema (organizations, users, campaigns, content, engagement metrics, revenue metrics, AI conversations, notifications) is already designed to support all of them. In short: the product vision and user experience are fully specified and demonstrable end-to-end today, and the remaining engineering work is connecting the already-designed data model to the AI backends for the features that are still frontend-only.

