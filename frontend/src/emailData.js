/**
 * Email generator — mock templates
 * ---------------------------------
 * Stand-in content for the Email tab of the Content Generator. No backend yet:
 * `GENERATION_ENDPOINTS.email` is null, so requests fall through to the mock in
 * contentApi.js, which builds its result from the templates below.
 *
 * To go live, point that endpoint at a real route and map its response in
 * `adaptGenerationResponse()`. The shape the UI reads is documented there.
 */

export const EMAIL_TYPES = [
  {
    id: 'newsletter',
    label: 'Newsletter',
    blurb: 'Regular round-up for subscribers — news, tips and highlights.',
  },
  {
    id: 'promotion',
    label: 'Promotion',
    blurb: 'A time-boxed discount or offer with a clear deadline.',
  },
  {
    id: 'launch',
    label: 'New Product Launch',
    blurb: 'Announce a new product and drive first-day orders.',
  },
  {
    id: 'reengagement',
    label: 'Re-engagement',
    blurb: 'Win back subscribers who have gone quiet.',
  },
  {
    id: 'event',
    label: 'Event Invitation',
    blurb: 'Invite subscribers to a launch, webinar or in-person event.',
  },
  {
    id: 'announcement',
    label: 'Product Update',
    blurb: 'Ship notes — new features, improvements and fixes.',
  },
]

export const DEFAULT_EMAIL_TYPE = EMAIL_TYPES[0].id

/** Short label shown on the generated preview. */
export const EMAIL_TYPE_LABEL = Object.fromEntries(
  EMAIL_TYPES.map((t) => [t.id, t.label]),
)

/**
 * One template per type.
 *
 * Each returns the pieces of an email: two subject lines to A/B test, the
 * preheader (the grey text a client shows after the subject), a markdown body
 * and a call to action.
 */
export const EMAIL_TEMPLATES = {
  newsletter: () => ({
    subjects: [
      'Your APEX month in review 📈',
      'What we shipped, what we learned',
    ],
    preheader: 'Three minutes of product news, training tips and a member story.',
    body: `Hi {{first_name}},

Here is everything worth knowing from the last month — three minutes, no filler.

## What shipped
- **Sleep staging v2** — validated against a clinical baseline
- **Battery saver** — an extra 1.4 days on average
- Twelve new workout modes, including hyrox and rucking

## Member story
Priya took her Series 5 through a first marathon in 3:52. Her pacing chart is
worth a look — she negative-split the back half.

## Tip of the month
*Recovery scores read low all week?* Check your resting heart rate trend before
you change your training. One bad night rarely moves it; a run of them does.

Thanks for reading,
The APEX team`,
    cta: { label: 'Read the full update', note: 'Links to the blog archive' },
    meta: { audience: 'All subscribers · 48,200', send: 'Tuesday 09:00 local' },
  }),

  promotion: () => ({
    subjects: [
      '48 hours: 20% off the Series 5 ⌚',
      'Your training upgrade is 20% off',
    ],
    preheader: 'Ends Sunday at midnight. No code needed — the price is already live.',
    body: `Hi {{first_name}},

For the next **48 hours**, the APEX Smart Watch Series 5 is 20% off.

No code, no minimum — the discount is already on the product page.

### What you get
- 8-day battery, measured not marketed
- 50+ workout modes
- Clinical-grade sleep staging
- Two-year warranty

*Offer ends Sunday 23:59. While stock lasts.*

See you out there,
The APEX team`,
    cta: { label: 'Shop the offer', note: 'Deep-links to the product page' },
    meta: { audience: 'Engaged last 90 days · 21,400', send: 'Friday 18:00 local' },
  }),

  launch: () => ({
    subjects: [
      'Meet the Series 5 🚀',
      'Eight days of battery. One less charger.',
    ],
    preheader: 'Our biggest jump in accuracy yet — and it lasts over a week.',
    body: `Hi {{first_name}},

Today we are launching the **APEX Smart Watch Series 5**.

Two years of work went into one goal: measure the things that actually change
your training, and stop asking you to charge a watch every other night.

### What is new
1. **8.2-day real-world battery** — we published the test data
2. **Sleep staging v2**, validated against clinical polysomnography
3. A recovery score that explains *why* it moved, not just the number

No subscription. Every feature above is included, permanently.

Available now in Graphite, Sand and Midnight.

The APEX team`,
    cta: { label: 'See the Series 5', note: 'Product page with launch pricing' },
    meta: { audience: 'All subscribers · 48,200', send: 'Launch day 09:00 local' },
  }),

  reengagement: () => ({
    subjects: [
      'Still training? Here is what you missed',
      'We saved your training history 👋',
    ],
    preheader: 'A lot has changed in six months — including the things you told us to fix.',
    body: `Hi {{first_name}},

It has been a while, so here is the short version of what changed — including
the things people asked us to fix.

- **Battery life** is up 1.4 days on the same hardware
- Onboarding is four steps instead of eleven
- Recovery scores are **free again**, permanently

Your training history is still here, exactly as you left it.

If APEX is not for you any more, [unsubscribe]({{unsubscribe_url}}) and we will
stop emailing — no hard feelings.

The APEX team`,
    cta: { label: 'Pick up where you left off', note: 'Opens the app dashboard' },
    meta: { audience: 'Inactive 180+ days · 9,860', send: 'Thursday 11:00 local' },
  }),

  event: () => ({
    subjects: [
      'You are invited: Series 5 launch night',
      'Join us Thursday — first look at the Series 5',
    ],
    preheader: 'Limited places. Hands-on demos, a short talk, and food.',
    body: `Hi {{first_name}},

We are hosting a **launch night** for the Series 5 and would like you there.

**Thursday 12 September · 7:00pm**
Suria KLCC, Concourse Level

### On the night
- First hands-on with the Series 5
- A short talk on how we validate sleep accuracy
- Q&A with the product team
- Food, drinks, and a goodie bag

Places are limited to 120 — registration closes when they are gone.

The APEX team`,
    cta: { label: 'Reserve a place', note: 'Registration form' },
    meta: { audience: 'Kuala Lumpur · 3,140', send: 'Monday 12:00 local' },
  }),

  announcement: () => ({
    subjects: [
      'New in APEX: recovery you can actually read',
      'Your watch just got better overnight',
    ],
    preheader: 'Free update, rolling out this week to every Series 4 and 5.',
    body: `Hi {{first_name}},

This week's update is rolling out now — free, on every Series 4 and 5.

### What is new
- **Recovery, explained** — every score now shows the two inputs that moved it
- **Faster GPS lock**, roughly 40% quicker from cold
- Wrist-temperature trend on the sleep screen

### Fixed
- Strap-sizing guidance for extended sizes
- Rare sync stall after a long flight

Update from *Settings → System → Software update*.

The APEX team`,
    cta: { label: 'See the release notes', note: 'Full changelog' },
    meta: { audience: 'Device owners · 32,700', send: 'Wednesday 10:00 local' },
  }),
}

/**
 * Build an email from a prompt.
 *
 * The prompt is echoed into the brief line so the output visibly responds to
 * what was typed — a real endpoint would use it to write the copy.
 */
export function buildMockEmail({ type, prompt, tone }) {
  const template = (EMAIL_TEMPLATES[type] || EMAIL_TEMPLATES.newsletter)()
  return {
    ...template,
    type,
    typeLabel: EMAIL_TYPE_LABEL[type] || 'Email',
    tone,
    brief: prompt,
  }
}

/** Flatten an email into the plain text used for copy and the post tracker. */
export function emailToPlainText(email) {
  return [
    `Subject: ${email.subjects[0]}`,
    `Preview: ${email.preheader}`,
    '',
    email.body,
    '',
    `[${email.cta.label}]`,
  ].join('\n')
}
