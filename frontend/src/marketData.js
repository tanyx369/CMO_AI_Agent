/**
 * Demographic Analysis — market intelligence data
 * ------------------------------------------------
 * Mock/demo data for the prototype, in the same spirit as data.js and
 * planData.js. Competitors are fictional on purpose: inventing intelligence
 * about real companies would read as fact when it is not.
 *
 * Everything here is scoped to one industry the brand competes in.
 */

export const INDUSTRY = {
  name: 'Consumer Wearables & Audio',
  brand: 'APEX',
  sources: '48 sources · 6 platforms',
  updated: '12 min ago',
}

/* ---------------------------------------------------------------- */
/* Headline KPIs                                                     */
/* ---------------------------------------------------------------- */

export const PULSE_KPIS = [
  {
    cls: 'kb', l: 'Industry Sentiment', v: '71', unit: '/100',
    ch: '+4 pts vs last month', up: true, note: 'Aggregate of 1.2M mentions',
  },
  {
    cls: 'kp', l: 'APEX Share of Voice', v: '18.4%',
    ch: '+2.1 pts vs last month', up: true, note: 'Rank 2 of 5 tracked brands',
  },
  {
    id: 'topics', cls: 'ka', l: 'Viral Topics', v: '12',
    ch: '3 breaking this week', up: true, note: 'Tracked across all platforms',
  },
  {
    id: 'moves', cls: 'kg', l: 'Competitor Moves', v: '27',
    ch: '+9 vs last week', up: true, note: 'Launches, ads, partnerships',
  },
]

/* ---------------------------------------------------------------- */
/* Sentiment trend — industry vs APEX, by timeframe                  */
/* ---------------------------------------------------------------- */

export const TIMEFRAMES = [
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: '12m', label: 'Last 12 months' },
]

export const SENTIMENT_TREND = {
  '30d': {
    labels: ['Jul 29', 'Aug 3', 'Aug 8', 'Aug 13', 'Aug 18', 'Aug 23', 'Aug 28'],
    industry: [66, 65, 68, 67, 69, 70, 71],
    brand: [70, 69, 72, 74, 73, 77, 79],
    volume: [128, 134, 141, 139, 158, 172, 186],
  },
  '90d': {
    labels: ['Jun', 'Mid Jun', 'Jul', 'Mid Jul', 'Aug', 'Mid Aug', 'Late Aug'],
    industry: [61, 63, 62, 66, 67, 69, 71],
    brand: [64, 66, 68, 70, 72, 76, 79],
    volume: [96, 104, 118, 126, 141, 165, 186],
  },
  '12m': {
    labels: ['Sep', 'Nov', 'Jan', 'Mar', 'May', 'Jul', 'Aug'],
    industry: [58, 57, 60, 62, 64, 67, 71],
    brand: [55, 58, 61, 66, 69, 73, 79],
    volume: [74, 81, 88, 97, 112, 148, 186],
  },
}

/* ---------------------------------------------------------------- */
/* Platform-level sentiment                                          */
/* ---------------------------------------------------------------- */

export const PLATFORMS = [
  {
    id: 'tiktok', name: 'TikTok', color: 'var(--pink)', cls: 'tk',
    mentions: '412K', share: 34, pos: 68, neu: 21, neg: 11, ch: '+24.1%', up: true,
    note: 'Fastest-growing surface; short-form reviews dominate.',
  },
  {
    id: 'instagram', name: 'Instagram', color: 'var(--accent)', cls: 'tp',
    mentions: '318K', share: 26, pos: 74, neu: 19, neg: 7, ch: '+11.4%', up: true,
    note: 'Highest positive skew — aesthetic and lifestyle framing.',
  },
  {
    id: 'youtube', name: 'YouTube', color: 'var(--red)', cls: 'tr',
    mentions: '186K', share: 15, pos: 62, neu: 27, neg: 11, ch: '+6.8%', up: true,
    note: 'Long-form teardowns drive purchase decisions.',
  },
  {
    id: 'reddit', name: 'Reddit', color: 'var(--amber)', cls: 'ta',
    mentions: '148K', share: 12, pos: 44, neu: 31, neg: 25, ch: '−3.2%', up: false,
    note: 'Most critical audience; battery and repairability complaints.',
  },
  {
    id: 'x', name: 'X', color: 'var(--t2)', cls: 'tg',
    mentions: '92K', share: 8, pos: 51, neu: 28, neg: 21, ch: '−8.4%', up: false,
    note: 'Volume declining industry-wide; reactive news cycles.',
  },
  {
    id: 'threads', name: 'Threads', color: 'var(--green)', cls: 'tg',
    mentions: '61K', share: 5, pos: 70, neu: 22, neg: 8, ch: '+38.6%', up: true,
    note: 'Small but the highest growth rate of any platform.',
  },
]

/* ---------------------------------------------------------------- */
/* Share of voice                                                    */
/* ---------------------------------------------------------------- */

export const SHARE_OF_VOICE = [
  { name: 'Vantix', pct: 27.2, ch: '−1.4', up: false, self: false },
  { name: 'APEX', pct: 18.4, ch: '+2.1', up: true, self: true },
  { name: 'Pulsewear', pct: 16.8, ch: '+3.6', up: true, self: false },
  { name: 'Nomad Audio', pct: 14.1, ch: '−0.8', up: false, self: false },
  { name: 'Kinetic Labs', pct: 9.3, ch: '+1.2', up: true, self: false },
  { name: 'Others', pct: 14.2, ch: '−4.7', up: false, self: false },
]

/* ---------------------------------------------------------------- */
/* Audience demographics                                             */
/* ---------------------------------------------------------------- */

export const AGE_SEGMENTS = [
  {
    id: '18-24', label: '18–24', share: 31, sentiment: 76, ch: '+6.2', up: true,
    volume: '374K', gender: { f: 54, m: 43, x: 3 },
    platforms: ['TikTok', 'Instagram'],
    topics: ['Sleep-tracking accuracy', 'Silent walking', 'Dupe culture'],
    insight: 'Largest and most positive segment. Discovers through creators, not ads — 71% of their mentions cite a named creator.',
  },
  {
    id: '25-34', label: '25–34', share: 28, sentiment: 73, ch: '+3.8', up: true,
    volume: '338K', gender: { f: 49, m: 48, x: 3 },
    platforms: ['Instagram', 'YouTube'],
    topics: ['Battery anxiety', 'Recovery scores', 'Work-commute audio'],
    insight: 'Highest purchase intent and highest average order value. Responds to spec detail and long-form review content.',
  },
  {
    id: '35-44', label: '35–44', share: 21, sentiment: 68, ch: '+1.1', up: true,
    volume: '253K', gender: { f: 46, m: 51, x: 3 },
    platforms: ['YouTube', 'Reddit'],
    topics: ['Repairability', 'Family health sharing', 'Subscription fatigue'],
    insight: 'Most price-sensitive and most vocal about subscription add-ons. Softening sentiment risk if paywalled features expand.',
  },
  {
    id: '45-54', label: '45–54', share: 13, sentiment: 64, ch: '−2.4', up: false,
    volume: '157K', gender: { f: 52, m: 46, x: 2 },
    platforms: ['YouTube', 'Instagram'],
    topics: ['Health monitoring', 'Ease of setup', 'Screen legibility'],
    insight: 'Only declining segment. Complaints cluster on onboarding complexity rather than the hardware itself.',
  },
  {
    id: '55+', label: '55+', share: 7, sentiment: 61, ch: '+0.6', up: true,
    volume: '84K', gender: { f: 55, m: 44, x: 1 },
    platforms: ['YouTube'],
    topics: ['Fall detection', 'Battery life', 'Customer support'],
    insight: 'Small but underserved. Almost no competitor targets this group directly — an open positioning gap.',
  },
]

export const GENDER_SPLIT = [
  { label: 'Female', pct: 50, color: 'var(--pink)' },
  { label: 'Male', pct: 47, color: 'var(--accent)' },
  { label: 'Non-binary / undisclosed', pct: 3, color: 'var(--amber)' },
]

export const REGIONS = [
  { name: 'North America', pct: 38, sentiment: 72, ch: '+3.1', up: true },
  { name: 'Southeast Asia', pct: 24, sentiment: 79, ch: '+8.4', up: true },
  { name: 'Western Europe', pct: 19, sentiment: 69, ch: '+1.2', up: true },
  { name: 'East Asia', pct: 12, sentiment: 66, ch: '−1.8', up: false },
  { name: 'Rest of world', pct: 7, sentiment: 64, ch: '+0.4', up: true },
]

/* ---------------------------------------------------------------- */
/* Viral topics                                                      */
/* ---------------------------------------------------------------- */

export const TOPIC_STAGES = [
  { id: 'all', label: 'All topics' },
  { id: 'emerging', label: 'Emerging' },
  { id: 'peaking', label: 'Peaking' },
  { id: 'cooling', label: 'Cooling' },
]

export const VIRAL_TOPICS = [
  {
    id: 't1', topic: 'Sleep-tracking accuracy wars', emoji: '😴', stage: 'peaking', score: 94,
    volume: '186K', growth: 312, platforms: ['tiktok', 'youtube', 'reddit'],
    sent: { pos: 58, neu: 24, neg: 18 },
    demo: '18–34 · 62% female',
    quote: 'Side-by-side tests against a sleep lab are getting millions of views — accuracy is now the whole conversation.',
    relevance: 'high',
    action: 'APEX scores well in third-party tests but has published nothing. A data-led response post could own this thread.',
  },
  {
    id: 't2', topic: 'Dupe culture vs premium pricing', emoji: '🏷️', stage: 'peaking', score: 88,
    volume: '142K', growth: 244, platforms: ['tiktok', 'instagram'],
    sent: { pos: 41, neu: 27, neg: 32 },
    demo: '18–24 · 58% female',
    quote: 'Creators openly comparing $40 alternatives to $300 flagships; premium brands are being asked to justify price.',
    relevance: 'high',
    action: 'Risky to engage directly. Better countered with durability and warranty proof than with price defence.',
  },
  {
    id: 't3', topic: 'Battery anxiety / 7-day claims', emoji: '🔋', stage: 'emerging', score: 81,
    volume: '97K', growth: 428, platforms: ['reddit', 'youtube', 'x'],
    sent: { pos: 22, neu: 31, neg: 47 },
    demo: '25–44 · 51% male',
    quote: 'Users logging real-world battery drain and calling out gaps between advertised and actual life.',
    relevance: 'critical',
    action: 'Fastest-growing topic and majority negative. APEX real-world testing beats its own claim — publish before being asked.',
  },
  {
    id: 't4', topic: 'Silent walking / no-audio wellness', emoji: '🚶', stage: 'emerging', score: 74,
    volume: '68K', growth: 386, platforms: ['tiktok', 'threads'],
    sent: { pos: 79, neu: 17, neg: 4 },
    demo: '18–24 · 66% female',
    quote: 'A wellness trend rejecting constant audio — awkward for earbuds, a gift for wearables framed around mindfulness.',
    relevance: 'medium',
    action: 'Reframe the watch as the device that lets you leave your phone (and your earbuds) behind.',
  },
  {
    id: 't5', topic: 'Subscription fatigue for health features', emoji: '💳', stage: 'emerging', score: 72,
    volume: '54K', growth: 291, platforms: ['reddit', 'x', 'youtube'],
    sent: { pos: 12, neu: 26, neg: 62 },
    demo: '35–54 · 54% male',
    quote: 'Paywalled recovery scores are the single most resented pattern in the category right now.',
    relevance: 'high',
    action: 'A no-subscription-ever commitment is the clearest available wedge against Vantix and Pulsewear.',
  },
  {
    id: 't6', topic: 'Repairability and right-to-repair', emoji: '🔧', stage: 'peaking', score: 69,
    volume: '61K', growth: 118, platforms: ['reddit', 'youtube'],
    sent: { pos: 34, neu: 29, neg: 37 },
    demo: '25–44 · 63% male',
    quote: 'Teardown channels are scoring every major device; low scores are being screenshotted widely.',
    relevance: 'medium',
    action: 'Not a strength today. Monitor rather than engage until the Series 6 battery module ships.',
  },
  {
    id: 't7', topic: 'AI coaching gimmick backlash', emoji: '🤖', stage: 'emerging', score: 66,
    volume: '43K', growth: 204, platforms: ['reddit', 'x', 'tiktok'],
    sent: { pos: 19, neu: 33, neg: 48 },
    demo: '25–44 · 57% male',
    quote: 'Generic AI advice is being mocked; users want specificity or nothing.',
    relevance: 'high',
    action: 'Directly relevant to the Series 6 AI coach launch. Lead with a concrete example, never the word AI alone.',
  },
  {
    id: 't8', topic: 'Marathon season training logs', emoji: '🏃', stage: 'peaking', score: 63,
    volume: '78K', growth: 96, platforms: ['instagram', 'tiktok', 'threads'],
    sent: { pos: 81, neu: 15, neg: 4 },
    demo: '25–44 · 49% female',
    quote: 'Seasonal, reliable, overwhelmingly positive — peaks through October.',
    relevance: 'medium',
    action: 'Predictable window. Worth a scheduled creator push rather than a reactive one.',
  },
  {
    id: 't9', topic: 'Colour-drop hype cycles', emoji: '🎨', stage: 'cooling', score: 44,
    volume: '31K', growth: -28, platforms: ['instagram', 'tiktok'],
    sent: { pos: 63, neu: 29, neg: 8 },
    demo: '18–24 · 71% female',
    quote: 'Interest fading after three competitor drops in six weeks saturated the format.',
    relevance: 'low',
    action: 'Deprioritise. A fourth colour drop into a cooling trend will underperform.',
  },
  {
    id: 't10', topic: 'Sports-band sizing complaints', emoji: '📏', stage: 'cooling', score: 38,
    volume: '19K', growth: -41, platforms: ['reddit', 'instagram'],
    sent: { pos: 16, neu: 28, neg: 56 },
    demo: '25–54 · 52% female',
    quote: 'Largely resolved after the extended-size restock; residual volume only.',
    relevance: 'low',
    action: 'Closed out. Keep the tracker on in case restock gaps return.',
  },
]

/* ---------------------------------------------------------------- */
/* Competitors                                                       */
/* ---------------------------------------------------------------- */

export const COMPETITORS = [
  {
    id: 'vantix', name: 'Vantix', emoji: '🛰️', color: '#6D5EF5',
    position: 'Category leader',
    sov: 27.2, sovCh: '−1.4', sovUp: false,
    sentiment: 66, sentCh: '−3.2', sentUp: false,
    spend: '$1.9M/mo', cadence: '4.2 posts/day',
    threat: 'high',
    strategy: 'Spec-led premium positioning with heavy paid search and a broad always-on creator roster. Monetises health features through a $9.99/mo tier — their biggest strength commercially and their biggest sentiment liability.',
    strengths: ['Distribution', 'Brand recall', 'Retail presence'],
    weaknesses: ['Subscription backlash', 'Slow support response'],
    moves: [
      {
        date: 'Aug 27', type: 'Launch', cls: 'tr', title: 'Vantix Pulse 4 announced',
        detail: 'Launch event streamed; pre-orders open Sep 5 at $349 — $50 above the outgoing model.',
        impact: 'high',
      },
      {
        date: 'Aug 24', type: 'Paid', cls: 'ta', title: 'Search spend up an estimated 40%',
        detail: 'Bidding aggressively on "best smart watch 2026" and on APEX brand terms.',
        impact: 'high',
      },
      {
        date: 'Aug 19', type: 'Partnership', cls: 'tp', title: 'Three-year deal with a national gym chain',
        detail: 'In-club placement plus a co-branded onboarding flow for new members.',
        impact: 'medium',
      },
      {
        date: 'Aug 14', type: 'Backlash', cls: 'tr', title: 'Recovery score moved behind paywall',
        detail: 'Feature previously free; the announcement post drew a 6:1 negative reply ratio.',
        impact: 'high',
      },
    ],
  },
  {
    id: 'pulsewear', name: 'Pulsewear', emoji: '⚡', color: '#E85BAA',
    position: 'Fast challenger',
    sov: 16.8, sovCh: '+3.6', sovUp: true,
    sentiment: 78, sentCh: '+6.9', sentUp: true,
    spend: '$620K/mo', cadence: '9.8 posts/day',
    threat: 'high',
    strategy: 'Creator-first and almost entirely organic. Seeds 300+ micro-creators monthly instead of buying reach, which is why their spend is a third of Vantix while their growth is triple. Fastest-rising sentiment in the category.',
    strengths: ['Creator network', 'Price-to-value', 'Speed to trend'],
    weaknesses: ['Thin retail', 'Unproven durability'],
    moves: [
      {
        date: 'Aug 28', type: 'Content', cls: 'tk', title: 'Sleep-lab comparison series',
        detail: 'Six creators posting side-by-side accuracy tests; lead video at 4.1M views in 48 hours.',
        impact: 'high',
      },
      {
        date: 'Aug 25', type: 'Positioning', cls: 'tg', title: 'No-subscription-ever pledge',
        detail: 'Explicit swipe at Vantix paywalling. Overwhelmingly positive reception.',
        impact: 'high',
      },
      {
        date: 'Aug 21', type: 'Pricing', cls: 'ta', title: 'Bundle discount on band multipacks',
        detail: 'Attach-rate play rather than a headline price cut.',
        impact: 'low',
      },
      {
        date: 'Aug 16', type: 'Creator', cls: 'tp', title: 'Seeded 180 new micro-creators',
        detail: 'Concentrated in the 18–24 fitness niche — the segment where APEX is strongest.',
        impact: 'medium',
      },
    ],
  },
  {
    id: 'nomad', name: 'Nomad Audio', emoji: '🎧', color: '#E8940C',
    position: 'Audio specialist',
    sov: 14.1, sovCh: '−0.8', sovUp: false,
    sentiment: 71, sentCh: '+0.4', sentUp: true,
    spend: '$480K/mo', cadence: '2.1 posts/day',
    threat: 'medium',
    strategy: 'Narrow and deep on audio quality, with sound-engineer endorsements over lifestyle creators. Not competing on wearables at all, but takes share in the earbuds line and owns the audiophile conversation.',
    strengths: ['Audio credibility', 'Loyal base'],
    weaknesses: ['No wearables line', 'Ageing audience', 'Low posting volume'],
    moves: [
      {
        date: 'Aug 26', type: 'Product', cls: 'tp', title: 'Firmware update adds spatial audio',
        detail: 'Free to existing owners — well received, framed as a loyalty reward.',
        impact: 'medium',
      },
      {
        date: 'Aug 20', type: 'Content', cls: 'tk', title: 'Studio-engineer review series',
        detail: 'Long-form YouTube; low volume, high credibility with the 25–44 segment.',
        impact: 'medium',
      },
      {
        date: 'Aug 12', type: 'Retail', cls: 'ta', title: 'Exited two regional retail chains',
        detail: 'Shifting to direct-to-consumer; short-term visibility loss.',
        impact: 'low',
      },
    ],
  },
  {
    id: 'kinetic', name: 'Kinetic Labs', emoji: '🧪', color: '#12B76A',
    position: 'Budget disruptor',
    sov: 9.3, sovCh: '+1.2', sovUp: true,
    sentiment: 59, sentCh: '+2.8', sentUp: true,
    spend: '$210K/mo', cadence: '6.4 posts/day',
    threat: 'medium',
    strategy: 'Undercuts the category at roughly a third of flagship pricing and leans directly into dupe culture. Sentiment is the lowest of the tracked set — buyers like the price and complain about build — but their volume is climbing fast among 18–24s.',
    strengths: ['Price', 'Trend agility'],
    weaknesses: ['Build quality complaints', 'High return rate', 'No brand equity'],
    moves: [
      {
        date: 'Aug 27', type: 'Content', cls: 'tk', title: 'Leaning into dupe framing',
        detail: 'Explicitly comparing against flagship models by name in short-form.',
        impact: 'medium',
      },
      {
        date: 'Aug 22', type: 'Pricing', cls: 'ta', title: 'Back-to-school promo at $79',
        detail: 'Aggressive entry price aimed squarely at the 18–24 segment.',
        impact: 'medium',
      },
      {
        date: 'Aug 18', type: 'Backlash', cls: 'tr', title: 'Durability complaints trending',
        detail: 'Strap failure videos gaining traction on TikTok; a credibility opening for APEX.',
        impact: 'low',
      },
    ],
  },
]

/* ---------------------------------------------------------------- */
/* AI read-out                                                       */
/* ---------------------------------------------------------------- */

export const AI_BRIEF = [
  {
    id: 'b1', emoji: '🔋', tone: 'critical',
    title: 'Battery anxiety is the highest-risk topic in the category',
    body: 'Growing 428% and running 47% negative. APEX measured 8.2 days against a 7-day claim — the only tracked brand whose real-world result beats its own marketing. Publishing the test data now converts the worst thread in the category into a proof point.',
    meta: 'Emerging · 97K mentions · 25–44',
  },
  {
    id: 'b2', emoji: '💳', tone: 'opportunity',
    title: 'Subscription fatigue leaves Vantix exposed',
    body: 'Vantix moved recovery scores behind a paywall on Aug 14 and their sentiment has dropped 3.2 points since. Pulsewear already claimed the no-subscription line on Aug 25 — the position is still winnable, but not for much longer.',
    meta: 'Competitive · 54K mentions · 35–54',
  },
  {
    id: 'b3', emoji: '👥', tone: 'watch',
    title: 'Pulsewear is seeding creators in the 18–24 segment',
    body: '180 micro-creators added in the segment that drives 31% of APEX positive volume. Their sentiment is up 6.9 points on roughly a third of Vantix spend, which makes them the more urgent threat despite the smaller share of voice.',
    meta: 'Competitive · 18–24 · TikTok',
  },
  {
    id: 'b4', emoji: '🚶', tone: 'opportunity',
    title: 'Silent walking is an unclaimed 79%-positive trend',
    body: 'Up 386% with almost no negative sentiment and no competitor engagement yet. It reframes the watch as the device that replaces the phone rather than one more screen — a natural fit for the Series 6 positioning.',
    meta: 'Emerging · 68K mentions · 18–24',
  },
]
