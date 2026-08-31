# APEX — CMO Intelligence Platform (Frontend)

A React frontend for a Chief Marketing Officer AI agent platform, rebuilt from the
original single-file HTML prototype into a component-based React app with a **light theme**.

This is **frontend only** — all data is mock/static and all "AI" actions are simulated
in the browser. No backend calls are made.

## Tech stack

- **React 18** + **Vite** (fast dev server & build)
- **Chart.js** via **react-chartjs-2** (dashboard & analytics charts)
- **react-icons** (Font Awesome 6 icon set)
- Google Fonts: Inter + DM Serif Display

## Getting started

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173

Build for production:

```bash
npm run build
npm run preview
```

## Features / pages

- **Dashboard** — greeting, "pick up where you left off", KPI cards, revenue & channel-mix charts, quick actions
- **Campaigns** — filterable campaign grid + a September calendar view
- **Campaign detail** — hero, KPI strip, and three tabs:
  - **Content Generator** — simulated Text / Image / Audio / Video generation
  - **Engagement & Reactions** — engagement stats, sentiment bar, keywords, comments
  - **Review Queue** — approve / reject / edit generated content
- **Analytics** — revenue KPIs, daily trend, revenue by channel, conversion funnel, exposure by product
- **Strategist AI** — chat interface with history, quick prompts, and simulated AI replies
- **Products** — product catalog with inline editing and "AI improve" for descriptions
- **Modals** — New Campaign and Add Product

## Project structure

```
src/
  App.jsx            # top-level page routing + modal state
  index.css          # full light-theme stylesheet
  chartSetup.js      # Chart.js registration + shared axis colors
  data.js            # all mock data (campaigns, products, chat, etc.)
  components/
    Sidebar.jsx
    Topbar.jsx       # search + notifications panel
    Modals.jsx       # CampaignModal + ProductModal
  pages/
    Home.jsx
    Campaigns.jsx
    CampaignDetail.jsx
    Analytics.jsx
    StrategistAI.jsx
    Products.jsx
```

## Notes

- Navigation is handled with simple React state (no router dependency).
- The original dark palette was converted to a light theme via CSS custom properties in `index.css`.
