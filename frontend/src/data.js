/**
 * Campaign taxonomy
 * -----------------
 * category    : 'physical' | 'online'
 * physicalType: for physical campaigns — roadshows, event collaborations, etc.
 * onlineType  : for online campaigns — 'single' (one post) | 'campaign' (multi-post series)
 */
export const PHYSICAL_TYPES = [
  'Roadshow',
  'Event Collaboration',
  'Pop-up Booth',
  'Sponsorship',
  'Product Demo',
  'Conference / Expo',
];

export const ONLINE_TYPES = [
  { id: 'single', label: 'Single Post', desc: 'One standalone post on a single platform.' },
  { id: 'campaign', label: 'Campaign', desc: 'A multi-post series running across platforms.' },
];

export const CAMPAIGNS = [
  {
    id: 0, title: 'Q3 Product Launch', emoji: '🚀', product: 'Smart Watch Series 5',
    category: 'online', onlineType: 'campaign',
    cardMeta: 'Smart Watch · Aug 20 – Sep 15',
    tags: [{ t: 'Instagram', cls: 'tp' }, { t: 'TikTok', cls: 'tk' }, { t: 'Google', cls: 'ta' }],
    progress: 62, footL: 'Day 6 of 26', footR: '62% budget used',
    meta: 'Smart Watch · Aug 20 – Sep 15 · Live',
    bg: 'linear-gradient(135deg,#4c2f8f,#7a3fb0)', status: 'Live', statusCls: 'tg',
    kpis: [
      { l: 'Impressions', v: '2.4M', ch: '+18%', up: true },
      { l: 'Clicks', v: '164K', ch: '+22%', up: true },
      { l: 'ROAS', v: '4.2x', ch: '+0.7x', up: true },
      { l: 'Conversions', v: '4,820', ch: '+31%', up: true },
    ],
    sent: { pos: 74, neu: 18, neg: 8 },
    eng: { likes: '48.2K', comments: '3,140', shares: '8,920', reach: '2.4M', saves: '12.1K', ctr: '6.8%', engRate: '3.4%', avgWatch: '00:24' },
    keywords: ['love it', 'must have', 'worth it', 'game changer', 'obsessed', 'sleek', 'where to buy'],
    kwColors: ['tp', 'tg', 'tp', 'ta', 'tk', 'tg', 'ta'],
    comments: [
      { user: '@fitlifejess', text: 'This watch literally changed my morning routine. The sleep tracking is insane! 😍', sent: 'pos', av: 'FJ', avColor: '#6D5EF5' },
      { user: '@techreviewpro', text: 'Solid build quality and the AMOLED display is gorgeous in sunlight.', sent: 'pos', av: 'TR', avColor: '#E85BAA' },
      { user: '@runnermark99', text: 'Battery lasts way longer than advertised. On day 9 still going strong.', sent: 'pos', av: 'RM', avColor: '#12B76A' },
      { user: '@skeptical_sam', text: 'The GPS took a while to connect on my first run but works fine now.', sent: 'neu', av: 'SS', avColor: '#E8940C' },
    ],
    reviewItems: [
      { type: 'Text', typeIcon: 'text', platform: 'Instagram', content: "Elevate every rep. The APEX Smart Watch Series 5 tracks your performance so you don't have to think — just move. Available now. #APEXWatch #FitTech", status: 'pending' },
      { type: 'Image', typeIcon: 'image', platform: 'TikTok', content: 'img', status: 'pending' },
      { type: 'Video', typeIcon: 'video', platform: 'Instagram', content: 'video', status: 'approved' },
      { type: 'Text', typeIcon: 'text', platform: 'Google', content: 'APEX Smart Watch 5 — 7-Day Battery, GPS, 50+ Workout Modes. Free shipping. Shop now.', status: 'pending' },
    ],
  },
  {
    id: 1, title: 'Summer Vibes Audio', emoji: '🎵', product: 'Earbuds Pro',
    category: 'online', onlineType: 'campaign',
    cardMeta: 'Earbuds Pro · Sep 1 – Sep 30',
    tags: [{ t: 'Spotify', cls: 'tp' }, { t: 'YouTube', cls: 'tk' }],
    progress: 0, footL: 'Starts in 6 days', footR: '$0 spent',
    meta: 'Earbuds Pro · Sep 1 – Sep 30 · Scheduled',
    bg: 'linear-gradient(135deg,#1f6a8f,#3f9fc0)', status: 'Scheduled', statusCls: 'tp',
    kpis: [
      { l: 'Projected Reach', v: '1.8M', ch: 'Estimated', up: true },
      { l: 'Budget', v: '$42K', ch: 'Not started', up: true },
      { l: 'Content Ready', v: '60%', ch: '2 of 4 types', up: true },
      { l: 'Start Date', v: 'Sep 1', ch: '6 days away', up: true },
    ],
    sent: { pos: 0, neu: 0, neg: 0 },
    eng: { likes: '—', comments: '—', shares: '—', reach: '—', saves: '—', ctr: '—', engRate: '—', avgWatch: '—' },
    keywords: [], kwColors: [], comments: [],
    reviewItems: [
      { type: 'Text', typeIcon: 'text', platform: 'Spotify', content: "Summer doesn't stop when you do. APEX Air Earbuds Pro — 30 hours, zero interruptions. Built for the season.", status: 'pending' },
      { type: 'Audio', typeIcon: 'audio', platform: 'Spotify', content: 'audio', status: 'pending' },
    ],
  },
  {
    id: 2, title: 'Fitness Re-engage', emoji: '🎯', product: 'Fitness Tracker Lite',
    category: 'online', onlineType: 'campaign',
    cardMeta: 'Fitness Tracker · TBD',
    tags: [{ t: 'Email', cls: 'tg' }, { t: 'Instagram', cls: 'tp' }],
    progress: 0, footL: 'Not scheduled', footR: 'Budget TBD',
    meta: 'Fitness Tracker · Draft · Not scheduled',
    bg: 'linear-gradient(135deg,#3f7a2f,#6aae3f)', status: 'Draft', statusCls: 'ta',
    kpis: [
      { l: 'Target Audience', v: '28K', ch: 'Lapsed users', up: true },
      { l: 'Budget', v: 'TBD', ch: 'Not set', up: false },
      { l: 'Content Ready', v: '0%', ch: 'Generate first', up: false },
      { l: 'Est. ROAS', v: '3.2x', ch: 'Projected', up: true },
    ],
    sent: { pos: 0, neu: 0, neg: 0 },
    eng: { likes: '—', comments: '—', shares: '—', reach: '—', saves: '—', ctr: '—', engRate: '—', avgWatch: '—' },
    keywords: [], kwColors: [], comments: [],
    reviewItems: [],
  },

  /* ---------------------------- PHYSICAL ---------------------------- */
  {
    id: 3, title: 'KLCC Launch Roadshow', emoji: '🎪', product: 'Smart Watch Series 5',
    category: 'physical', physicalType: 'Roadshow',
    cardMeta: 'Suria KLCC · Sep 5 – Sep 8',
    tags: [{ t: 'Roadshow', cls: 'ta' }, { t: 'Kuala Lumpur', cls: 'tp' }],
    progress: 45, footL: 'Day 2 of 4', footR: '45% budget used',
    meta: 'Suria KLCC, Kuala Lumpur · Sep 5 – Sep 8 · Live',
    bg: 'linear-gradient(135deg,#8f5a2f,#c08a3f)', status: 'Live', statusCls: 'tg',
    venue: 'Suria KLCC, Concourse Level',
    kpis: [
      { l: 'Footfall', v: '8,420', ch: '+12% vs day 1', up: true },
      { l: 'Demos Given', v: '1,260', ch: '+18%', up: true },
      { l: 'Leads Captured', v: '940', ch: '+22%', up: true },
      { l: 'On-site Sales', v: '312', ch: '+9%', up: true },
    ],
    sent: { pos: 68, neu: 24, neg: 8 },
    eng: { likes: '—', comments: '—', shares: '—', reach: '8.4K', saves: '—', ctr: '—', engRate: '—', avgWatch: '—' },
    keywords: ['great demo', 'friendly staff', 'long queue', 'worth visiting'],
    kwColors: ['tg', 'tp', 'ta', 'tg'],
    comments: [
      { user: 'Visitor survey #128', text: 'Staff explained the sleep tracking really well. Bought one on the spot.', sent: 'pos', av: 'V1', avColor: '#12B76A' },
      { user: 'Visitor survey #204', text: 'Queue for the demo booth was about 25 minutes on Saturday.', sent: 'neu', av: 'V2', avColor: '#E8940C' },
    ],
    reviewItems: [
      { type: 'Text', typeIcon: 'text', platform: 'On-site Banner', content: 'Experience the APEX Smart Watch Series 5 — live demos all weekend at Suria KLCC, Concourse Level.', status: 'pending' },
      { type: 'Image', typeIcon: 'image', platform: 'Booth Poster', content: 'img', status: 'approved' },
    ],
  },
  {
    id: 4, title: 'FitFest Event Collab', emoji: '🤝', product: 'Fitness Tracker Lite',
    category: 'physical', physicalType: 'Event Collaboration',
    cardMeta: 'FitFest Asia · Oct 12 – Oct 14',
    tags: [{ t: 'Collaboration', cls: 'tk' }, { t: 'Singapore', cls: 'tp' }],
    progress: 0, footL: 'Starts in 47 days', footR: '$0 spent',
    meta: 'FitFest Asia, Singapore · Oct 12 – Oct 14 · Scheduled',
    bg: 'linear-gradient(135deg,#2f6a8f,#3fa0a0)', status: 'Scheduled', statusCls: 'tp',
    venue: 'Marina Bay Sands Expo, Hall 3',
    partner: 'FitFest Asia',
    kpis: [
      { l: 'Expected Footfall', v: '25K', ch: 'Organiser est.', up: true },
      { l: 'Budget', v: '$68K', ch: 'Not started', up: true },
      { l: 'Booth Ready', v: '40%', ch: 'Design approved', up: true },
      { l: 'Start Date', v: 'Oct 12', ch: '47 days away', up: true },
    ],
    sent: { pos: 0, neu: 0, neg: 0 },
    eng: { likes: '—', comments: '—', shares: '—', reach: '—', saves: '—', ctr: '—', engRate: '—', avgWatch: '—' },
    keywords: [], kwColors: [], comments: [],
    reviewItems: [
      { type: 'Text', typeIcon: 'text', platform: 'Event Programme', content: 'APEX is a proud partner of FitFest Asia 2026. Visit Hall 3 to try the Fitness Tracker Lite.', status: 'pending' },
    ],
  },

  /* -------------------- ONLINE — SINGLE POSTS ----------------------- */
  {
    id: 5, title: 'Watch Teaser Post', emoji: '📸', product: 'Smart Watch Series 5',
    category: 'online', onlineType: 'single',
    cardMeta: 'Instagram · Posted Aug 24',
    tags: [{ t: 'Instagram', cls: 'tp' }, { t: 'Single Post', cls: 'tk' }],
    progress: 100, footL: 'Published', footR: '2 days ago',
    meta: 'Instagram · Single post · Published Aug 24',
    bg: 'linear-gradient(135deg,#6d3f8f,#a04fb0)', status: 'Live', statusCls: 'tg',
    kpis: [
      { l: 'Impressions', v: '182K', ch: '+34%', up: true },
      { l: 'Likes', v: '14.2K', ch: '+41%', up: true },
      { l: 'Saves', v: '3,180', ch: '+28%', up: true },
      { l: 'Eng. Rate', v: '7.8%', ch: '+2.1pp', up: true },
    ],
    sent: { pos: 81, neu: 14, neg: 5 },
    eng: { likes: '14.2K', comments: '862', shares: '2,140', reach: '182K', saves: '3,180', ctr: '4.2%', engRate: '7.8%', avgWatch: '00:11' },
    keywords: ['need this', 'so clean', 'price?', 'launch date'],
    kwColors: ['tg', 'tp', 'ta', 'tp'],
    comments: [
      { user: '@gadgetgail', text: "That silhouette is so clean. Can't wait for the full reveal!", sent: 'pos', av: 'GG', avColor: '#6D5EF5' },
      { user: '@budgetbuyer', text: 'Looks great but what is the actual price going to be?', sent: 'neu', av: 'BB', avColor: '#E8940C' },
    ],
    reviewItems: [],
  },
  {
    id: 6, title: 'Earbuds Unboxing Reel', emoji: '🎬', product: 'Earbuds Pro',
    category: 'online', onlineType: 'single',
    cardMeta: 'TikTok · Not scheduled',
    tags: [{ t: 'TikTok', cls: 'tk' }, { t: 'Single Post', cls: 'tp' }],
    progress: 0, footL: 'Not scheduled', footR: 'Draft',
    meta: 'TikTok · Single post · Draft',
    bg: 'linear-gradient(135deg,#8f2f5a,#c03f7a)', status: 'Draft', statusCls: 'ta',
    kpis: [
      { l: 'Est. Reach', v: '95K', ch: 'Projected', up: true },
      { l: 'Budget', v: '$2.5K', ch: 'Boost budget', up: true },
      { l: 'Content Ready', v: '50%', ch: 'Video pending', up: false },
      { l: 'Publish Date', v: 'TBD', ch: 'Not set', up: false },
    ],
    sent: { pos: 0, neu: 0, neg: 0 },
    eng: { likes: '—', comments: '—', shares: '—', reach: '—', saves: '—', ctr: '—', engRate: '—', avgWatch: '—' },
    keywords: [], kwColors: [], comments: [],
    reviewItems: [
      { type: 'Text', typeIcon: 'text', platform: 'TikTok', content: '30 hours of play. Zero interruptions. Unboxing the APEX Air Earbuds Pro 🎧 #APEXAudio', status: 'pending' },
    ],
  },
];

export const TEXT_OUTPUTS = [
  `<strong>Option 1 — Punchy</strong><br>Every rep. Every mile. Every goal.<br>The APEX Smart Watch Series 5 tracks it all so you can focus on what matters — crushing it. 💪<br>#APEXWatch #FitTech #SmartWatch<br><br><strong>Option 2 — Aspirational</strong><br>Your health deserves precision. Meet the watch that works as hard as you do. 7-day battery. 50+ workout modes. Zero excuses.<br><br><strong>Option 3 — Minimal</strong><br>Train smarter. Recover faster. APEX Watch Series 5. ⌚`,
  `<strong>Ad Headline:</strong><br>APEX Smart Watch 5 — Built for Athletes Who Mean Business<br><br><strong>Body:</strong><br>Track sleep, heart rate, GPS routes, and 50+ workout modes — all on a display that stays bright in direct sunlight. 7-day battery. Free shipping.<br><br><strong>CTA:</strong><br>Shop Now → Limited launch pricing ends Sunday.`,
  `<strong>Email Subject Lines (A/B test):</strong><br>A: "Your next personal best starts on your wrist"<br>B: "7 days. Zero charging. Here's the watch that lasts."<br>C: "We tracked 1,240 workouts this month — here's what we learned"<br><br><strong>Preview text:</strong><br>The APEX Smart Watch Series 5 is here — and the launch offer won't last.`,
];

export const AI_RESPONSES = [
  "Great question. Based on your data, I'd recommend shifting 20% of TikTok budget to Instagram Reels — they're converting at 3x the rate. Want me to draft the revised allocation?",
  'Your Email channel has the highest ROAS at 5.8x but only 17% of total spend. Scaling it up is the fastest lever you have right now.',
  'Your top-performing creatives are videos under 15 seconds with a product close-up in the first 2 seconds. Want me to brief your creative team?',
  'Your customer acquisition cost dropped 12% this month. The biggest driver was improved landing page copy on the Smart Watch campaign.',
  "I've identified 3 audience segments with high intent signals not yet targeted. Should I create a targeting brief for each?",
];

export const AI_DESCRIPTIONS = [
  "Experience next-level health intelligence with APEX Smart Watch Series 5. Featuring a stunning AMOLED display, 7-day battery, precision GPS, and 50+ workout modes — it's the only companion your health deserves. Loved by fitness enthusiasts and professionals who refuse to compromise.",
  'Hear the difference that Grammy-winning engineers make. APEX Air Earbuds Pro deliver studio-quality sound, active noise cancellation, and 30 total hours of play. IPX5 rated, with seamless switching between 3 devices.',
  'Your health journey starts here. APEX Fitness Tracker Lite gives you clear, actionable insights into steps, calories, sleep, and stress — in an ultra-light 18g design that lasts 10 days. No complexity, just clarity.',
];

export const PRODUCTS = [
  {
    id: 'p1', name: 'APEX Smart Watch Series 5', sku: 'SKU-001 · Wearables', status: 'Active', statusCls: 'tg',
    desc: 'A premium smartwatch with advanced health monitoring, 7-day battery life, and AMOLED display. Ideal for fitness enthusiasts and professionals who demand precision and style. Featuring GPS, sleep tracking, heart rate monitoring, and 50+ workout modes.',
    stats: [{ v: '$299', l: 'price' }, { v: '1,240', l: 'units sold MTD' }, { v: '4.8★', l: 'rating' }, { v: '3 active', l: 'campaigns' }],
  },
  {
    id: 'p2', name: 'APEX Air Earbuds Pro', sku: 'SKU-002 · Audio', status: 'Active', statusCls: 'tg',
    desc: 'True wireless earbuds with active noise cancellation, 30-hour total playtime, and studio-quality audio tuned by Grammy-winning engineers. Sweat and water resistant (IPX5). Seamless device switching between up to 3 devices.',
    stats: [{ v: '$149', l: 'price' }, { v: '2,104', l: 'units sold MTD' }, { v: '4.6★', l: 'rating' }, { v: '2 active', l: 'campaigns' }],
  },
  {
    id: 'p3', name: 'APEX Fitness Tracker Lite', sku: 'SKU-003 · Fitness', status: 'Draft', statusCls: 'ta',
    desc: 'An entry-level fitness tracker designed for everyday health awareness. Tracks steps, calories, sleep quality, and stress levels. Lightweight 18g design with a 10-day battery. Perfect for first-time wearable users who want insights without complexity.',
    stats: [{ v: '$89', l: 'price' }, { v: '496', l: 'units sold MTD' }, { v: '4.3★', l: 'rating' }, { v: '1 active', l: 'campaigns' }],
  },
];

export const CHAT_HISTORY = [
  { t: 'Q3 Growth Strategy', d: 'Today, 9:14am' },
  { t: 'TikTok ROAS Fix', d: 'Yesterday' },
  { t: 'Seasonal Campaign Ideas', d: 'Aug 24' },
  { t: 'Email Drip Sequence', d: 'Aug 22' },
  { t: 'Competitor Analysis', d: 'Aug 19' },
];

export const QUICK_PROMPTS = [
  'Analyse worst-performing campaigns',
  'Draft a TikTok UGC creator brief',
  'Suggest Q4 budget reallocation',
  'Write 5 Instagram caption variants',
  'Create a 90-day growth strategy',
  'Benchmark ROAS vs industry',
  'Identify top customer segments',
];

export const CALENDAR_EVENTS = {
  3: [{ t: 'Q3 Launch', cls: 'tp' }],
  5: [{ t: 'Email Drip', cls: 'tg' }],
  8: [{ t: 'Q3 Launch', cls: 'tp' }, { t: 'TikTok Ads', cls: 'tk' }],
  12: [{ t: 'Summer Audio', cls: 'ta' }],
  15: [{ t: 'Q3 Launch', cls: 'tp' }],
  20: [{ t: 'Email Blast', cls: 'tg' }],
  26: [{ t: 'Q4 Prep', cls: 'tk' }],
};

export const NOTIFICATIONS = [
  { ico: 'rocket', cls: 'tp', text: 'Summer Campaign went live — 12,400 impressions in the first hour', time: '2 min ago' },
  { ico: 'trend', cls: 'tg', text: 'ROAS on Product X exceeded target — 4.2x vs 3.5x goal', time: '38 min ago' },
  { ico: 'warn', cls: 'ta', text: 'Instagram ad budget 87% consumed — consider top-up', time: '1h ago' },
  { ico: 'file', cls: 'tk', text: 'AI generated 8 ad copy variants for Q3 Product Launch', time: '3h ago' },
];

/**
 * Upcoming calendar moments the AI watches for campaign opportunities.
 * "Today" in this prototype is Aug 26, 2026.
 */
export const UPCOMING_OCCASIONS = [
  { name: 'National Day (Merdeka)', date: 'Aug 31', daysAway: 5, emoji: '🇲🇾' },
  { name: 'Malaysia Day', date: 'Sep 16', daysAway: 21, emoji: '🎊' },
  { name: 'Mid-Autumn Festival', date: 'Sep 25', daysAway: 30, emoji: '🥮' },
];

/**
 * AI-suggested next actions for the campaign portfolio.
 *
 * kind     : 'occasion' | 'optimize' | 'schedule' | 'content'
 * priority : 'Act now' | 'Recommended' | 'Optional'
 */
export const AI_SUGGESTIONS = [
  {
    id: 'sg-merdeka',
    kind: 'occasion',
    featured: true,
    emoji: '🇲🇾',
    title: 'Create a Merdeka celebration post',
    why: "National Day is in 5 days (Aug 31). Your audience engagement spiked 3.2x around last year's Merdeka post — and nothing is scheduled yet.",
    meta: 'Suggested: Instagram + TikTok · Single Post',
    priority: 'Act now',
    priCls: 'pri-h',
    action: 'Create post',
    // Opens the New Campaign form pre-configured for this suggestion
    preset: { category: 'online', onlineType: 'single', name: 'Merdeka Celebration Post' },
  },
  {
    id: 'sg-budget',
    kind: 'optimize',
    emoji: '⚡',
    title: 'Rebalance Q3 Product Launch budget',
    why: 'It has used 62% of budget with 20 days left — pacing 18% ahead of schedule. Shift spend from Google to Instagram, which is converting at 5.2x.',
    meta: 'Q3 Product Launch · Online Campaign',
    priority: 'Recommended',
    priCls: 'pri-m',
    action: 'Review budget',
    campaignId: 0, // jumps to the related campaign
  },
  {
    id: 'sg-schedule',
    kind: 'schedule',
    emoji: '⏰',
    title: 'Schedule the Earbuds Unboxing Reel',
    why: 'This draft has been idle for 8 days. TikTok engagement for your audience peaks Thursday 7–9pm — the next slot is Aug 27.',
    meta: 'Earbuds Unboxing Reel · Single Post',
    priority: 'Recommended',
    priCls: 'pri-m',
    action: 'Schedule',
    campaignId: 6,
  },
  {
    id: 'sg-booth',
    kind: 'content',
    emoji: '🎪',
    title: 'Finish FitFest booth collateral',
    why: 'Booth content is only 40% ready with 47 days to go. Generate the remaining posters and handout copy now to clear print lead times.',
    meta: 'FitFest Event Collab · Physical',
    priority: 'Optional',
    priCls: 'pri-l',
    action: 'Generate content',
    preset: { category: 'physical', name: 'FitFest Booth Collateral' },
  },
];
