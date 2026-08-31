/**
 * Campaign plans — only online campaigns of type 'campaign' (multi-post series)
 * carry a plan. Keyed by campaign id. A campaign with no entry here has no plan
 * yet, and the planner offers to generate one with AI.
 *
 * phase.status: 'done' | 'active' | 'upcoming'
 *
 * Each deliverable spells out exactly how many pieces of content it needs via
 * `assets`, and carries a `done` flag that drives the completion checklist:
 *
 *   { id, label, assets: { text, image, video, audio }, done }
 *
 * Phase progress is DERIVED from how many of its deliverables are ticked off,
 * so checking items in the UI advances the phase progression.
 */

/** Asset type metadata — labels are pluralised when count !== 1. */
export const ASSET_TYPES = {
  text: { one: 'text', many: 'text', cls: 'tp' },
  image: { one: 'poster', many: 'posters', cls: 'tk' },
  video: { one: 'video', many: 'videos', cls: 'ta' },
  audio: { one: 'audio', many: 'audio', cls: 'tg' },
};

export const ASSET_ORDER = ['text', 'image', 'video', 'audio'];

export const CAMPAIGN_PLANS = {
  0: {
    objective: 'Drive 5,000 Smart Watch Series 5 units in the launch window while establishing APEX as the precision-fitness wearable brand.',
    audience: 'Fitness professionals and serious amateurs, 28–40, urban, iOS-leaning, already tracking workouts.',
    duration: 'Aug 20 – Sep 15, 2026 · 26 days',
    kpiTargets: [
      { l: 'Impressions', v: '4.0M' },
      { l: 'ROAS', v: '3.5x' },
      { l: 'Conversions', v: '5,000' },
    ],
    budgetSplit: [
      { ch: 'Instagram', pct: 40, amt: '$52.0K', cls: 'tp' },
      { ch: 'TikTok', pct: 30, amt: '$39.0K', cls: 'tk' },
      { ch: 'Google', pct: 20, amt: '$26.0K', cls: 'ta' },
      { ch: 'Email', pct: 10, amt: '$13.0K', cls: 'tg' },
    ],
    phases: [
      {
        name: 'Teaser', dates: 'Aug 20 – Aug 26', status: 'done',
        goal: 'Build anticipation without revealing the full product.',
        deliverables: [
          { id: 'p0-t1', label: 'Silhouette teaser posts', assets: { text: 3, image: 3 }, done: true },
          { id: 'p0-t2', label: 'Creator seeding kit', assets: { text: 1, image: 1 }, done: true },
          { id: 'p0-t3', label: 'Email waitlist capture', assets: { text: 1 }, done: true },
        ],
      },
      {
        name: 'Launch', dates: 'Aug 27 – Sep 2', status: 'active',
        goal: 'Full reveal with paid amplification across all channels.',
        deliverables: [
          { id: 'p0-l1', label: 'Hero launch film (15s + 30s)', assets: { video: 2 }, done: true },
          { id: 'p0-l2', label: 'Paid social burst creatives', assets: { text: 4, image: 4 }, done: true },
          { id: 'p0-l3', label: 'Google Search + Shopping ads', assets: { text: 6, image: 2 }, done: false },
          { id: 'p0-l4', label: 'Launch-day email blast', assets: { text: 1, image: 1 }, done: false },
        ],
      },
      {
        name: 'Amplify', dates: 'Sep 3 – Sep 9', status: 'upcoming',
        goal: 'Sustain momentum with social proof and UGC.',
        deliverables: [
          { id: 'p0-a1', label: 'UGC creator videos', assets: { video: 8 }, done: false },
          { id: 'p0-a2', label: 'Review round-up carousel', assets: { text: 1, image: 5 }, done: false },
          { id: 'p0-a3', label: 'TikTok Spark Ads on top organic', assets: { text: 3, video: 3 }, done: false },
        ],
      },
      {
        name: 'Convert', dates: 'Sep 10 – Sep 15', status: 'upcoming',
        goal: 'Close warm audiences before the launch offer expires.',
        deliverables: [
          { id: 'p0-c1', label: 'Retargeting creative set', assets: { text: 3, image: 3 }, done: false },
          { id: 'p0-c2', label: 'Last-chance offer email', assets: { text: 1, image: 1 }, done: false },
          { id: 'p0-c3', label: 'Cart-abandon sequence', assets: { text: 3 }, done: false },
        ],
      },
    ],
    milestones: [
      { date: 'Aug 20', title: 'Teaser phase live', detail: 'First silhouette post published to Instagram', status: 'done', assets: { text: 3, image: 3 } },
      { date: 'Aug 24', title: 'Creator seeding complete', detail: '12 of 12 creators received units', status: 'done', assets: { text: 1, image: 1 } },
      { date: 'Aug 26', title: 'Waitlist target hit', detail: '8,400 emails captured vs 6,000 goal', status: 'done', assets: { text: 1 } },
      { date: 'Aug 27', title: 'Launch day', detail: 'Hero film and paid burst go live across all channels', status: 'active', assets: { text: 4, image: 4, video: 2 } },
      { date: 'Sep 2', title: 'Launch review gate', detail: 'Assess first-week ROAS, rebalance budget', status: 'upcoming', assets: { text: 7, image: 3 } },
      { date: 'Sep 3', title: 'UGC wave begins', detail: '8 creator videos scheduled', status: 'upcoming', assets: { text: 4, image: 5, video: 11 } },
      { date: 'Sep 10', title: 'Retargeting activation', detail: 'Warm audiences enter conversion sequence', status: 'upcoming', assets: { text: 4, image: 4 } },
      { date: 'Sep 15', title: 'Campaign close', detail: 'Offer expires, final performance report', status: 'upcoming', assets: { text: 3 } },
    ],
  },

  1: {
    objective: 'Position Air Earbuds Pro as the soundtrack to summer, driving 1.8M reach and 2,000 units through audio-first channels.',
    audience: 'Music-led 18–30s on Spotify and YouTube — commuters and gym-goers.',
    duration: 'Sep 1 – Sep 30, 2026 · 30 days',
    kpiTargets: [
      { l: 'Reach', v: '1.8M' },
      { l: 'ROAS', v: '3.0x' },
      { l: 'Units', v: '2,000' },
    ],
    budgetSplit: [
      { ch: 'Spotify', pct: 55, amt: '$23.1K', cls: 'tp' },
      { ch: 'YouTube', pct: 45, amt: '$18.9K', cls: 'tk' },
    ],
    phases: [
      {
        name: 'Pre-launch', dates: 'Sep 1 – Sep 7', status: 'upcoming',
        goal: 'Warm the audience with branded playlist placements.',
        deliverables: [
          { id: 'p1-p1', label: 'Branded summer playlist art', assets: { text: 1, image: 1 }, done: true },
          { id: 'p1-p2', label: 'Audio teasers (15s)', assets: { audio: 2 }, done: false },
        ],
      },
      {
        name: 'Audio Drop', dates: 'Sep 8 – Sep 16', status: 'upcoming',
        goal: 'Launch the full audio campaign across both platforms.',
        deliverables: [
          { id: 'p1-a1', label: 'Hero audio spot (30s)', assets: { audio: 1 }, done: false },
          { id: 'p1-a2', label: 'YouTube pre-roll cutdowns', assets: { video: 3 }, done: false },
          { id: 'p1-a3', label: 'Podcast host-read scripts', assets: { text: 4 }, done: false },
        ],
      },
      {
        name: 'Playlist Push', dates: 'Sep 17 – Sep 24', status: 'upcoming',
        goal: 'Scale spend into the best-performing placements.',
        deliverables: [
          { id: 'p1-l1', label: 'Playlist takeover creative', assets: { text: 2, image: 2 }, done: false },
          { id: 'p1-l2', label: 'Sequential retargeting audio', assets: { audio: 3 }, done: false },
        ],
      },
      {
        name: 'Wrap', dates: 'Sep 25 – Sep 30', status: 'upcoming',
        goal: 'Convert engaged listeners before season end.',
        deliverables: [
          { id: 'p1-w1', label: 'End-of-summer offer spot', assets: { audio: 1, video: 1 }, done: false },
          { id: 'p1-w2', label: 'Performance wrap report', assets: { text: 1 }, done: false },
        ],
      },
    ],
    milestones: [
      { date: 'Sep 1', title: 'Playlist goes live', detail: 'Branded summer playlist published', status: 'upcoming', assets: { text: 1, image: 1 } },
      { date: 'Sep 8', title: 'Hero audio drop', detail: '30s spot live on Spotify and YouTube', status: 'upcoming', assets: { text: 4, video: 3, audio: 3 } },
      { date: 'Sep 16', title: 'Mid-flight review', detail: 'Assess completion rate, reallocate spend', status: 'upcoming', assets: {} },
      { date: 'Sep 17', title: 'Playlist takeover', detail: 'Scale into top-performing placements', status: 'upcoming', assets: { text: 2, image: 2, audio: 3 } },
      { date: 'Sep 30', title: 'Campaign close', detail: 'Final wrap report', status: 'upcoming', assets: { text: 1, video: 1, audio: 1 } },
    ],
  },
};

/** The plan the AI "generates" for a campaign that has none yet. */
export const GENERATED_PLAN = {
  objective: 'Win back 28,000 lapsed Fitness Tracker Lite users with a habit-restart narrative, targeting a 12% reactivation rate.',
  audience: 'Lapsed users inactive 60–180 days who previously logged 3+ workouts per week.',
  duration: 'Proposed: 4 weeks from approval',
  kpiTargets: [
    { l: 'Reactivation', v: '12%' },
    { l: 'Est. ROAS', v: '3.2x' },
    { l: 'Reach', v: '28K' },
  ],
  budgetSplit: [
    { ch: 'Email', pct: 55, amt: 'TBD', cls: 'tg' },
    { ch: 'Instagram', pct: 45, amt: 'TBD', cls: 'tp' },
  ],
  phases: [
    {
      name: 'Re-introduce', dates: 'Week 1', status: 'upcoming',
      goal: 'Remind lapsed users what they achieved before.',
      deliverables: [
        { id: 'g-r1', label: 'Personalised "your year in steps" email', assets: { text: 1, image: 2 }, done: false },
        { id: 'g-r2', label: 'Nostalgia carousel post', assets: { text: 1, image: 5 }, done: false },
      ],
    },
    {
      name: 'Re-engage', dates: 'Week 2', status: 'upcoming',
      goal: 'Give a concrete reason to open the app again.',
      deliverables: [
        { id: 'g-e1', label: '7-day restart challenge', assets: { text: 2, image: 3, video: 1 }, done: false },
        { id: 'g-e2', label: 'Push and email reminder pair', assets: { text: 2 }, done: false },
      ],
    },
    {
      name: 'Reward', dates: 'Week 3', status: 'upcoming',
      goal: 'Reinforce the restarted habit.',
      deliverables: [
        { id: 'g-w1', label: 'Streak badge announcement', assets: { text: 1, image: 2 }, done: false },
        { id: 'g-w2', label: 'Community leaderboard post', assets: { text: 1, image: 1 }, done: false },
      ],
    },
    {
      name: 'Retain', dates: 'Week 4', status: 'upcoming',
      goal: 'Convert restarted users into an upgrade path.',
      deliverables: [
        { id: 'g-t1', label: 'Upgrade offer to Series 5', assets: { text: 2, image: 2, video: 1 }, done: false },
        { id: 'g-t2', label: 'Win-back performance report', assets: { text: 1 }, done: false },
      ],
    },
  ],
  milestones: [
    { date: 'Week 1', title: 'Personalised email wave', detail: 'Segmented by prior activity level', status: 'upcoming', assets: { text: 2, image: 7 } },
    { date: 'Week 2', title: 'Restart challenge opens', detail: '7-day habit challenge launches', status: 'upcoming', assets: { text: 4, image: 3, video: 1 } },
    { date: 'Week 3', title: 'Streak rewards', detail: 'Badges issued, community post live', status: 'upcoming', assets: { text: 2, image: 3 } },
    { date: 'Week 4', title: 'Upgrade offer', detail: 'Cross-sell to Smart Watch Series 5', status: 'upcoming', assets: { text: 3, image: 2, video: 1 } },
  ],
};

/** Opening message shown when a plan already exists. */
export const PLANNER_GREETING =
  'I have the full plan for this campaign loaded. Ask me to adjust a phase, rebalance budget, or check whether you are on track.';

/** Opening message shown when the campaign has no plan yet. */
export const PLANNER_GREETING_EMPTY =
  'This campaign has no plan yet. Tell me the goal and I will draft the phases, timeline, and budget split — or just press Generate plan and I will propose one from the campaign brief.';

/** Canned planner replies, cycled in order. */
export const PLANNER_REPLIES = [
  'I can restructure that. Moving 15% of the Google budget into Instagram Reels would lift projected ROAS from 3.5x to roughly 3.9x based on this campaign’s channel performance. Want me to apply it to the plan?',
  'Good call. I would insert a UGC phase between Launch and Amplify — 5 days, 8 creators, briefed around the "first week with it" angle. That pushes Convert back by 2 days but should lift mid-funnel engagement.',
  'Launch is tracking at 55% with 4 days to go, which is on pace. The risk is Amplify: none of the 8 UGC videos are in the review queue yet. Brief the creators this week to protect the Sep 3 start.',
  'Across your last three launches the strongest window for a hero film was Thursday 7–9pm — it beat weekend slots by 34% on completion rate. I can move the Launch milestone to match.',
  'I have drafted the phase goals and deliverables above. Tell me which phase to expand and I will break it into individual posts with dates and channels.',
];

/** Suggested prompts shown above the planner chat input. */
export const PLANNER_PROMPTS = [
  'Rebalance the budget for higher ROAS',
  'Add a UGC phase',
  'Is this campaign on track?',
  'Suggest the best launch timing',
];
