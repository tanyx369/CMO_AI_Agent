/**
 * Analytics — social profile stats and the AI period summary.
 *
 * Mock data, in the same spirit as the other *Data modules. Both sections are
 * derived from the selected date range so the numbers move when the range does,
 * rather than sitting frozen while the filter changes above them.
 */

/* ---------------------------------------------------------------- */
/* Social media profiles                                             */
/* ---------------------------------------------------------------- */

/**
 * Per-profile baselines. Daily rates are multiplied by the length of the
 * selected period; totals like `followers` are absolute.
 */
export const SOCIAL_PROFILES = [
  {
    id: 'instagram', name: 'Instagram', handle: '@apex.official', emoji: '📷',
    color: 'var(--accent)', cls: 'tp',
    followers: 486200, followersPerDay: 412,
    engagementRate: 3.4, engagementChange: 0.6,
    postsPerDay: 0.9, reachPerDay: 78000, visitsPerDay: 3100,
    topPost: 'Hero launch film — 48.2K likes',
  },
  {
    id: 'tiktok', name: 'TikTok', handle: '@apexwearables', emoji: '🎵',
    color: 'var(--pink)', cls: 'tk',
    followers: 312800, followersPerDay: 890,
    engagementRate: 6.1, engagementChange: 1.4,
    postsPerDay: 1.3, reachPerDay: 142000, visitsPerDay: 5400,
    topPost: 'Creator seeding unboxing — 31.8K likes',
  },
  {
    id: 'youtube', name: 'YouTube', handle: '@APEXWearables', emoji: '▶️',
    color: 'var(--red)', cls: 'tr',
    followers: 128400, followersPerDay: 96,
    engagementRate: 2.2, engagementChange: -0.3,
    postsPerDay: 0.2, reachPerDay: 41000, visitsPerDay: 1250,
    topPost: 'Sleep accuracy explainer — 214K views',
  },
  {
    id: 'linkedin', name: 'LinkedIn', handle: 'APEX Wearables', emoji: '💼',
    color: 'var(--t2)', cls: 'tg',
    followers: 64300, followersPerDay: 58,
    engagementRate: 1.8, engagementChange: 0.2,
    postsPerDay: 0.4, reachPerDay: 12400, visitsPerDay: 640,
    topPost: 'Why we published our battery test data — 1.9K reactions',
  },
  {
    id: 'twitter', name: 'X', handle: '@apexwear', emoji: '𝕏',
    color: 'var(--amber)', cls: 'ta',
    followers: 92700, followersPerDay: -34,
    engagementRate: 1.1, engagementChange: -0.4,
    postsPerDay: 2.1, reachPerDay: 18600, visitsPerDay: 410,
    topPost: 'Battery test thread — 840 reposts',
  },
]

const compact = (n) => {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (abs >= 1_000) return (n / 1_000).toFixed(abs >= 10_000 ? 0 : 1).replace(/\.0$/, '') + 'K'
  return String(Math.round(n))
}

/** Scale each profile's rates across `days` and format for display. */
export function profileStatsForPeriod(days) {
  return SOCIAL_PROFILES.map((p) => {
    const gained = Math.round(p.followersPerDay * days)
    const growthPct = (gained / p.followers) * 100
    return {
      ...p,
      followersLabel: compact(p.followers + gained),
      gainedLabel: (gained >= 0 ? '+' : '−') + compact(Math.abs(gained)),
      growthLabel: (growthPct >= 0 ? '+' : '−') + Math.abs(growthPct).toFixed(1) + '%',
      gainedUp: gained >= 0,
      engagementLabel: p.engagementRate.toFixed(1) + '%',
      engagementUp: p.engagementChange >= 0,
      engagementChangeLabel:
        (p.engagementChange >= 0 ? '+' : '−') + Math.abs(p.engagementChange).toFixed(1) + ' pts',
      posts: Math.max(1, Math.round(p.postsPerDay * days)),
      reachLabel: compact(p.reachPerDay * days),
      visitsLabel: compact(p.visitsPerDay * days),
    }
  })
}

/** Totals across every profile, for the section header. */
export function profileTotals(days) {
  const stats = profileStatsForPeriod(days)
  const followers = SOCIAL_PROFILES.reduce((n, p) => n + p.followers + p.followersPerDay * days, 0)
  const gained = SOCIAL_PROFILES.reduce((n, p) => n + p.followersPerDay * days, 0)
  return {
    followersLabel: compact(followers),
    gainedLabel: (gained >= 0 ? '+' : '−') + compact(Math.abs(gained)),
    gainedUp: gained >= 0,
    posts: stats.reduce((n, p) => n + p.posts, 0),
    reachLabel: compact(SOCIAL_PROFILES.reduce((n, p) => n + p.reachPerDay * days, 0)),
  }
}

/* ---------------------------------------------------------------- */
/* AI summary                                                        */
/* ---------------------------------------------------------------- */

/**
 * Three phrasings of the read-out. Regenerating cycles through them so the
 * button visibly does something; a real endpoint would return fresh analysis.
 */
const SUMMARY_ANGLES = [
  {
    verdict: 'Ahead of plan, carried by one channel',
    headline:
      'Revenue is up {revenue} across {campaigns} campaigns in this {days}-day window, but {share} of it came from a single channel. The result is good and the concentration is a risk.',
  },
  {
    verdict: 'Efficient spend, uneven creative',
    headline:
      'Blended ROAS held at 3.8x over {days} days on {spend} of spend. The spread between the best and worst performing creative was wide enough that fixing the bottom half is worth more than raising budgets.',
  },
  {
    verdict: 'Growth is real, retention is the gap',
    headline:
      'New customer acquisition rose over this {days}-day period while repeat purchase stayed flat. The campaigns are working at the top of the funnel and leaking further down.',
  },
]

const WINS = [
  ['Email is the efficiency leader', 'Email returned $207K on the smallest budget of any channel — a 42.1% rise. It is the cheapest incremental revenue available right now.'],
  ['Instagram carried the launch', 'Instagram drove $412K, up 18.4%, and produced the two highest-engagement assets of the period.'],
  ['The battery proof point landed', 'Posts leading with measured battery data outperformed feature-list creative by roughly 2:1 on saves.'],
  ['Creator seeding beat paid on cost', 'Seeded creator content reached more people per dollar than the paid burst in the same week.'],
]

const CONCERNS = [
  ['TikTok spend is no longer paying back', 'TikTok revenue fell 18.0% while spend held flat. Cost per acquisition there is now the highest of any channel.'],
  ['Checkout is the leak', 'Only 59% of checkout starts complete. That single step costs more than any creative underperformance in the period.'],
  ['Reliance on one channel', 'A third of revenue came from Instagram. A ranking or policy change there would be felt immediately.'],
  ['X engagement keeps sliding', 'Follower count fell and engagement dropped 0.4 points, on the highest posting volume of any profile.'],
]

const ACTIONS = [
  ['Move budget from TikTok to Email', 'Shift roughly 15% of TikTok spend into email and lifecycle. On current efficiency that trades the weakest returning channel for the strongest.', 'high'],
  ['Fix the checkout step before buying more traffic', 'A 5-point improvement in checkout completion is worth more than the entire TikTok budget at present conversion rates.', 'high'],
  ['Publish the test data you already have', 'Measured results outperformed claims in every format tested. Lead with numbers in the next round of creative.', 'medium'],
  ['Set a floor for creative testing', 'Retire any asset below half the median CTR after 5,000 impressions instead of letting it run the full flight.', 'medium'],
  ['Plan the next launch around email first', 'Build the list before the launch rather than during it — email converted best but reached the fewest people.', 'low'],
]

/** Deterministic pick so the same inputs give the same summary. */
const pick = (arr, seed, count) => {
  const out = []
  for (let i = 0; i < count; i++) out.push(arr[(seed + i * 3) % arr.length])
  return out
}

/**
 * Build the AI read-out for a period.
 *
 * @param {object} args
 * @param {number} args.days       length of the selected range
 * @param {number} args.variant    increments on each regenerate
 * @param {string} args.rangeLabel human-readable range, shown in the footer
 */
export function buildAiSummary({ days, variant = 0, rangeLabel = '' }) {
  const angle = SUMMARY_ANGLES[variant % SUMMARY_ANGLES.length]
  const campaigns = Math.max(2, Math.min(9, Math.round(days / 9) + 2))
  const revenue = '$' + (1.24 * (days / 30)).toFixed(2) + 'M'
  const spend = '$' + Math.round(327.6 * (days / 30)) + 'K'

  const headline = angle.headline
    .replace('{days}', String(days))
    .replace('{campaigns}', String(campaigns))
    .replace('{revenue}', revenue)
    .replace('{spend}', spend)
    .replace('{share}', '33%')

  return {
    verdict: angle.verdict,
    headline,
    wins: pick(WINS, variant, 2).map(([title, body]) => ({ title, body })),
    concerns: pick(CONCERNS, variant + 1, 2).map(([title, body]) => ({ title, body })),
    actions: pick(ACTIONS, variant, 3).map(([title, body, priority]) => ({ title, body, priority })),
    meta: {
      campaigns,
      days,
      rangeLabel,
      generatedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    },
  }
}
