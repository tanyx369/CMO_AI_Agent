/**
 * Strategy layer — one level above campaigns.
 *
 * A campaign is a single execution. A strategy is the intent that several
 * campaigns serve together, usually mixing physical and online activity, and it
 * carries the things a campaign cannot hold on its own: the reputation goal, the
 * brand voice everything must sound like, and the product positioning.
 *
 * `campaignIds` point at entries in data.js — every strategy view uses them to
 * link back into campaign management.
 */

/** The three things a strategy can be built to achieve. */
export const PILLARS = [
  {
    id: 'reputation',
    label: 'Reputation & Popularity',
    short: 'Reputation',
    icon: 'star',
    cls: 'pl-rep',
    blurb: 'Grow how widely and how well the company is regarded.',
  },
  {
    id: 'brand',
    label: 'Brand Voice & Positioning',
    short: 'Brand voice',
    icon: 'voice',
    cls: 'pl-brand',
    blurb: 'Keep every channel sounding like the same company.',
  },
  {
    id: 'product',
    label: 'Product Promotion',
    short: 'Product',
    icon: 'box',
    cls: 'pl-prod',
    blurb: 'Drive demand for a specific product or line.',
  },
]

export const PILLAR_LABEL = Object.fromEntries(PILLARS.map((p) => [p.id, p.label]))

export const STRATEGY_STATUSES = ['Draft', 'Active', 'Paused', 'Completed']

export const STRATEGIES = [
  {
    id: 0,
    name: 'Own the Accuracy Conversation',
    emoji: '🎯',
    pillar: 'reputation',
    secondaryPillars: ['brand'],
    status: 'Active',
    timeframe: 'Aug 2026 – Jan 2027',
    progress: 42,
    owner: 'Sarah Chen',
    objective:
      'Become the wearable brand people cite when they argue about measurement accuracy — not the loudest brand, the one that publishes its numbers.',
    why:
      'Sleep-tracking accuracy is the fastest-growing conversation in the category and no competitor has claimed it with evidence. We already score well in third-party tests and have never said so publicly.',
    targetOutcome:
      'Move unaided brand recall from 12% to 20% and become the most-cited brand in accuracy discussions within two quarters.',
    kpis: [
      { l: 'Unaided recall', now: '12%', target: '20%', progress: 38 },
      { l: 'Share of voice', now: '18.4%', target: '25%', progress: 46 },
      { l: 'Positive sentiment', now: '71', target: '78', progress: 51 },
      { l: 'Earned coverage', now: '14', target: '40', progress: 35 },
    ],
    campaignIds: [0, 3, 5],
    voice: {
      pillars: [
        { t: 'Measured, not loud', d: 'State the number and the method. Let the figure carry the excitement.' },
        { t: 'Proof over promise', d: 'Every claim ships with the test behind it, including the unflattering ones.' },
        { t: 'On the athlete’s side', d: 'We are equipment, not a lifestyle. Speak to the training, not the aesthetic.' },
      ],
      tone: {
        does: [
          'Publish the methodology alongside the result',
          'Use exact figures — "8.2 days", not "over a week"',
          'Admit what we measure worst, before someone else does',
        ],
        donts: [
          'Superlatives without a number attached',
          'Comparing directly against a named competitor',
          'Wellness language that promises outcomes we cannot measure',
        ],
      },
      positioning: [
        { product: 'Smart Watch Series 5', line: 'The wearable that publishes its own test data.' },
        { product: 'Earbuds Pro', line: 'Studio-grade sound that survives a session in the rain.' },
        { product: 'Fitness Tracker Lite', line: 'The measurements that matter, nothing you will not use.' },
      ],
    },
    phases: [
      {
        name: 'Establish the claim', dates: 'Aug – Sep', status: 'done',
        goal: 'Publish the battery and sleep test data, and get it in front of the review community.',
        campaignIds: [5, 0],
      },
      {
        name: 'Prove it in person', dates: 'Sep – Oct', status: 'active',
        goal: 'Let people test the claim on real hardware at roadshows and events.',
        campaignIds: [3],
      },
      {
        name: 'Let others repeat it', dates: 'Nov – Jan', status: 'upcoming',
        goal: 'Convert published data into third-party citations and creator explainers.',
        campaignIds: [],
      },
    ],
    advice: [
      { t: 'Publish before you are asked', p: 'high', d: 'Battery anxiety is up 428% and majority negative. Our real-world result beats our own claim — releasing it now converts the category’s worst thread into our proof point.' },
      { t: 'Send the roadshow team the same numbers', p: 'medium', d: 'The in-person demo is where the claim becomes believable. Brief booth staff on the methodology, not just the headline.' },
      { t: 'Do not name competitors', p: 'medium', d: 'The position only works if it reads as confidence rather than attack. Let the comparison be made by others.' },
    ],
  },
  {
    id: 1,
    name: 'One APEX Voice',
    emoji: '🗣️',
    pillar: 'brand',
    secondaryPillars: ['reputation'],
    status: 'Active',
    timeframe: 'Jul 2026 – Dec 2026',
    progress: 64,
    owner: 'Sarah Chen',
    objective:
      'Make APEX recognisable from a single sentence of copy, whether it appears on TikTok, in an email, or on a booth banner.',
    why:
      'Audits found four different descriptions of the same product across three channels in one week. Inconsistency is costing recall and making creator briefs slower to write.',
    targetOutcome:
      'Every published asset traceable to one of three voice pillars, with brand-consistency scoring above 85% in quarterly audit.',
    kpis: [
      { l: 'Voice audit score', now: '71%', target: '85%', progress: 64 },
      { l: 'Assets on-brief', now: '78%', target: '95%', progress: 58 },
      { l: 'Brief-to-draft time', now: '3.4 days', target: '1.5 days', progress: 47 },
      { l: 'Creator adherence', now: '62%', target: '80%', progress: 55 },
    ],
    campaignIds: [0, 1, 6],
    voice: {
      pillars: [
        { t: 'Plain over clever', d: 'If a sentence needs re-reading, rewrite it. Clarity is the brand.' },
        { t: 'Specific over sweeping', d: 'One concrete detail beats three adjectives, every time.' },
        { t: 'Useful over urgent', d: 'We do not manufacture scarcity. The product earns the purchase.' },
      ],
      tone: {
        does: [
          'Lead with the thing the reader gets',
          'Write the way a knowledgeable colleague would explain it',
          'Keep sentences short enough to read on a phone in daylight',
        ],
        donts: [
          'Exclamation marks in body copy',
          'Countdown urgency outside a genuine deadline',
          'Borrowed hype language — "insane", "game-changer", "obsessed"',
        ],
      },
      positioning: [
        { product: 'Smart Watch Series 5', line: 'Training data you can act on, on a watch you charge weekly.' },
        { product: 'Earbuds Pro', line: 'Forty hours of sound that stays out of your way.' },
        { product: 'Fitness Tracker Lite', line: 'The starting point — everything essential, nothing extra.' },
      ],
    },
    phases: [
      {
        name: 'Audit and define', dates: 'Jul', status: 'done',
        goal: 'Score every live asset, agree the three pillars, publish the one-page guide.',
        campaignIds: [],
      },
      {
        name: 'Apply to live work', dates: 'Aug – Oct', status: 'active',
        goal: 'Every new campaign briefed against the pillars; retire assets that fail the audit.',
        campaignIds: [0, 1, 6],
      },
      {
        name: 'Extend to creators', dates: 'Nov – Dec', status: 'upcoming',
        goal: 'Roll the guide into creator briefs and measure adherence.',
        campaignIds: [],
      },
    ],
    advice: [
      { t: 'Put the guide inside the generator', p: 'high', d: 'Voice rules that live in a slide deck get ignored. Wire the three pillars into the content generator prompt so drafts start on-brief.' },
      { t: 'Score assets before they publish, not after', p: 'high', d: 'The audit currently runs quarterly, which is far too late to fix anything.' },
      { t: 'Give creators the don’t list, not the do list', p: 'low', d: 'Creators follow constraints better than instructions. Three prohibitions beat a style guide.' },
    ],
  },
  {
    id: 2,
    name: 'Series 5 Sell-Through',
    emoji: '⌚',
    pillar: 'product',
    secondaryPillars: ['reputation'],
    status: 'Active',
    timeframe: 'Aug 2026 – Nov 2026',
    progress: 55,
    owner: 'Sarah Chen',
    objective:
      'Clear launch inventory of the Smart Watch Series 5 and establish it as the default recommendation in its price band.',
    why:
      'The Series 5 is our highest-margin product and the first where our own testing beats our marketing claim. Launch demand is strong but concentrated in one channel.',
    targetOutcome:
      '18,000 units sold through by end of November with blended ROAS above 3.5x and no single channel above 40% of revenue.',
    kpis: [
      { l: 'Units sold', now: '9,840', target: '18,000', progress: 55 },
      { l: 'Blended ROAS', now: '4.2x', target: '3.5x', progress: 100 },
      { l: 'Channel concentration', now: '48%', target: '<40%', progress: 42 },
      { l: 'Repeat purchase', now: '11%', target: '18%', progress: 34 },
    ],
    campaignIds: [0, 3, 5],
    voice: {
      pillars: [
        { t: 'Lead with the measured claim', d: '8.2 days of battery, tested. That single number outperforms every feature list we have run.' },
        { t: 'Show it in use', d: 'On a wrist, mid-session. Never a floating product render.' },
        { t: 'No subscription, ever', d: 'State it plainly. It is the clearest gap between us and the category leader.' },
      ],
      tone: {
        does: [
          'Open on the battery figure',
          'Name the workout, not "fitness"',
          'Say the price without softening it',
        ],
        donts: [
          'Discount language before November',
          'Spec tables as the lead creative',
          'Claiming medical or diagnostic benefit',
        ],
      },
      positioning: [
        { product: 'Smart Watch Series 5', line: 'Eight days of battery. One less charger. Every metric that matters.' },
      ],
    },
    phases: [
      {
        name: 'Launch burst', dates: 'Aug', status: 'done',
        goal: 'Maximise first-week volume through paid social and creator seeding.',
        campaignIds: [0, 5],
      },
      {
        name: 'Hands-on proof', dates: 'Sep – Oct', status: 'active',
        goal: 'Put the watch on wrists at roadshows and convert in-person trials.',
        campaignIds: [3],
      },
      {
        name: 'Broaden the base', dates: 'Oct – Nov', status: 'upcoming',
        goal: 'Move demand off Instagram into email and search before the holiday period.',
        campaignIds: [],
      },
    ],
    advice: [
      { t: 'Set a hard ceiling on Instagram share', p: 'high', d: 'At 48% of revenue the launch is one algorithm change from a bad quarter. Cap it and fund email.' },
      { t: 'Bring the roadshow demo forward', p: 'medium', d: 'In-person trials convert far better than paid clicks and the current schedule wastes the launch window.' },
      { t: 'Hold discounting until November', p: 'medium', d: 'Demand is holding at full price. Discounting now would cost margin for volume we are already getting.' },
    ],
  },
  {
    id: 3,
    name: 'Reactivate the Quiet Third',
    emoji: '🔁',
    pillar: 'product',
    secondaryPillars: ['reputation'],
    status: 'Draft',
    timeframe: 'Oct 2026 – Feb 2027',
    progress: 8,
    owner: 'Sarah Chen',
    objective:
      'Bring back the third of our owner base that has not opened the app in six months, using the features they asked for.',
    why:
      'Nine thousand lapsed owners is cheaper to reactivate than to replace, and the two complaints they left — onboarding complexity and paywalled recovery — have both been fixed.',
    targetOutcome:
      '25% of lapsed owners active again within four months, and a measurable lift in accessory attach rate from that group.',
    kpis: [
      { l: 'Lapsed reactivated', now: '0%', target: '25%', progress: 4 },
      { l: 'App sessions / week', now: '1.2', target: '3.5', progress: 8 },
      { l: 'Accessory attach', now: '6%', target: '14%', progress: 5 },
      { l: 'Unsubscribe rate', now: '—', target: '<1.5%', progress: 0 },
    ],
    campaignIds: [2, 4],
    voice: {
      pillars: [
        { t: 'Acknowledge the gap', d: 'They left for a reason. Name it before asking for anything.' },
        { t: 'Lead with what changed', d: 'Recovery scores are free again. Onboarding is four steps. Say so first.' },
        { t: 'Make leaving easy', d: 'A visible unsubscribe earns more trust than it costs in list size.' },
      ],
      tone: {
        does: [
          'Open with the fix, not the offer',
          'Reference their actual training history',
          'Keep the email under 120 words',
        ],
        donts: [
          'Guilt or "we miss you" framing',
          'Discounts as the opening move',
          'Re-marketing features they already rejected',
        ],
      },
      positioning: [
        { product: 'Fitness Tracker Lite', line: 'Everything you liked, without the parts you told us to remove.' },
      ],
    },
    phases: [
      {
        name: 'Segment and listen', dates: 'Oct', status: 'upcoming',
        goal: 'Split the lapsed base by why they left before writing a single asset.',
        campaignIds: [],
      },
      {
        name: 'Win-back sequence', dates: 'Nov – Dec', status: 'upcoming',
        goal: 'Email-led reactivation leading with the fixes, no discount.',
        campaignIds: [2],
      },
      {
        name: 'Bring them somewhere', dates: 'Jan – Feb', status: 'upcoming',
        goal: 'Convert re-engaged owners into event attendance and accessory purchase.',
        campaignIds: [4],
      },
    ],
    advice: [
      { t: 'Do not open with a discount', p: 'high', d: 'This group left over product friction, not price. A discount teaches them to wait for the next one.' },
      { t: 'Write the segments before the copy', p: 'high', d: 'Onboarding-frustrated and paywall-frustrated owners need different first sentences.' },
      { t: 'Set an unsubscribe ceiling upfront', p: 'medium', d: 'Agree the rate at which you stop the sequence before it runs, not while it is running.' },
    ],
  },
]

export const findStrategy = (id) => STRATEGIES.find((s) => s.id === id) || STRATEGIES[0]

/** Roll a strategy's campaign mix into counts for the summary chips. */
export function campaignMix(strategy, campaigns) {
  const linked = strategy.campaignIds
    .map((id) => campaigns.find((c) => c.id === id))
    .filter(Boolean)
  return {
    linked,
    total: linked.length,
    physical: linked.filter((c) => c.category === 'physical').length,
    online: linked.filter((c) => c.category === 'online').length,
  }
}
