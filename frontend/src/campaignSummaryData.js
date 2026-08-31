/**
 * Post-campaign AI review.
 *
 * Only reachable once a campaign is marked Ended. The summary is built from the
 * campaign's own KPIs, engagement and sentiment so it reads as a review of that
 * specific campaign rather than generic advice.
 */

export const CAMPAIGN_STATUSES = [
  { id: 'Draft', label: 'Draft', cls: 'ta', blurb: 'Not scheduled yet.' },
  { id: 'Scheduled', label: 'Scheduled', cls: 'tp', blurb: 'Queued to start.' },
  { id: 'Live', label: 'Live', cls: 'tg', blurb: 'Running right now.' },
  { id: 'Paused', label: 'Paused', cls: 'ta', blurb: 'Temporarily stopped.' },
  { id: 'Ended', label: 'Ended', cls: 'tr', blurb: 'Finished — unlocks the AI summary.' },
]

export const ENDED = 'Ended'

/** Curated per-campaign review, keyed by campaign id. */
const REVIEWS = {
  0: {
    grade: 'A−',
    verdict: 'Beat its targets, on a narrower base than intended',
    summary:
      'The launch cleared every headline KPI — 2.4M impressions and 4,820 conversions against a 4.2x ROAS. What the numbers hide is concentration: Instagram produced most of the volume, and the two best-performing assets were both creator-made rather than studio-produced.',
    wins: [
      { t: 'Creator content outperformed studio work', d: 'Seeded creator posts drove 2.1x the engagement rate of the paid burst at roughly a third of the cost per thousand.' },
      { t: 'Sentiment held through the volume spike', d: '74% positive was maintained even as mentions rose sharply — usually the point at which sentiment dips.' },
      { t: 'The battery claim did the heavy lifting', d: 'Posts leading with the 8-day figure carried the highest save rate of anything published.' },
    ],
    issues: [
      { t: 'One channel carried the campaign', d: 'Instagram accounted for the bulk of conversions. A ranking change there would have taken the launch with it.' },
      { t: 'Google assets went out late', d: 'Search and Shopping copy cleared review four days after launch day, missing the peak intent window.' },
      { t: 'Video under-delivered for its cost', d: 'The hero film was the most expensive asset produced and ranked fourth on engagement.' },
    ],
    advice: [
      { t: 'Budget creators over production next time', p: 'high', d: 'On this campaign, creator content returned more engagement per dollar than the hero film. Shift the split before the next launch rather than after it.' },
      { t: 'Gate launch day on search readiness', p: 'high', d: 'Treat Google copy as a launch blocker. The four-day gap cost the highest-intent traffic of the whole flight.' },
      { t: 'Set a second channel target upfront', p: 'medium', d: 'Give TikTok or email an explicit share-of-conversion goal so the campaign is not one platform deep.' },
      { t: 'Reuse the battery proof point', p: 'low', d: 'It was the single most effective message. Build the next campaign brief around measured claims rather than feature lists.' },
    ],
  },
  1: {
    grade: 'B',
    verdict: 'Solid reach, weak conversion follow-through',
    summary:
      'The audio campaign built awareness efficiently but did not convert it. Reach and completion rates were healthy while click-through stayed well below the product average — the creative entertained without asking for anything.',
    wins: [
      { t: 'Audio completion was excellent', d: 'Listeners stayed to the end far more often than the category norm, which says the creative itself worked.' },
      { t: 'Cheap reach', d: 'Cost per thousand reached was the lowest of any campaign this quarter.' },
    ],
    issues: [
      { t: 'No clear call to action', d: 'Most assets ended on a brand line rather than an instruction. Click-through suffered accordingly.' },
      { t: 'Spotify and YouTube were treated identically', d: 'The same cut ran on both despite very different listening contexts.' },
    ],
    advice: [
      { t: 'Put an explicit CTA in the final five seconds', p: 'high', d: 'The audience was still listening at the end. That attention was available and unused.' },
      { t: 'Cut platform-specific versions', p: 'medium', d: 'Even a re-recorded end line per platform would let you test which context converts.' },
      { t: 'Pair audio with a retargeting pool', p: 'medium', d: 'Audio built an audience that was never retargeted. Capture it next time.' },
    ],
  },
}

/** Fallback for campaigns without a curated review. */
const GENERIC = {
  grade: 'B',
  verdict: 'Delivered against plan with room to tighten',
  summary:
    'The campaign met most of what it set out to do. The clearest gains available next time are in sequencing and channel balance rather than in spend.',
  wins: [
    { t: 'Delivery stayed on schedule', d: 'Assets cleared review in time for their slots, with no missed publish windows.' },
    { t: 'Audience response was positive', d: 'Comment sentiment stayed net positive throughout the flight.' },
  ],
  issues: [
    { t: 'Limited channel spread', d: 'Most of the result came from a single platform, which makes the outcome fragile.' },
    { t: 'Little creative variation tested', d: 'Too few variants ran to learn which message actually drove the result.' },
  ],
  advice: [
    { t: 'Run at least three creative variants', p: 'high', d: 'Without variants there is no way to attribute the result to a message rather than to timing.' },
    { t: 'Set a per-channel target before launch', p: 'medium', d: 'Naming the expected contribution per channel makes underperformance visible while there is still time to react.' },
    { t: 'Book a post-campaign review within a week', p: 'low', d: 'Findings are most actionable while the team still remembers the decisions behind them.' },
  ],
}

/**
 * Build the review for a campaign.
 *
 * `variant` increments on regenerate and rotates the emphasis so the button
 * visibly does something; the underlying facts stay the same.
 */
export function buildCampaignReview(campaign, variant = 0) {
  const base = REVIEWS[campaign.id] || GENERIC
  const rotate = (arr) => arr.map((_, i) => arr[(i + variant) % arr.length])

  const s = campaign.sent || {}
  const metrics = [
    ...(campaign.kpis || []).map((k) => ({ label: k.l, value: k.v, change: k.ch, up: k.up })),
    ...(s.pos ? [{ label: 'Positive sentiment', value: s.pos + '%', change: `${s.neg || 0}% negative`, up: true }] : []),
  ].slice(0, 5)

  return {
    grade: base.grade,
    verdict: base.verdict,
    summary: base.summary,
    metrics,
    wins: rotate(base.wins),
    issues: rotate(base.issues),
    advice: rotate(base.advice),
    generatedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  }
}
