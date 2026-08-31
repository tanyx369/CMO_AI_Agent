/**
 * Post Tracker data — online campaigns only
 * ------------------------------------------
 * Every post that belongs to an online campaign, keyed by campaign id.
 * Physical campaigns (roadshows, event collabs) keep the Review Queue instead.
 *
 * Post shape:
 *   status  : 'review' | 'pending' | 'posted' | 'deleted'
 *   media   : null for a text-only post, otherwise 'image' | 'video' | 'audio'
 *   caption : the editable body — the whole post for text, the caption for media
 *   date    : ISO yyyy-mm-dd, paired with `time` as the scheduled slot
 */

export const POST_STATUSES = [
  {
    id: 'review', label: 'In Review', short: 'In review',
    cls: 'ps-review', hint: 'Waiting on approval before it can be scheduled.',
  },
  {
    id: 'pending', label: 'Pending to Post', short: 'Pending',
    cls: 'ps-pending', hint: 'Approved and scheduled — will publish at the set time.',
  },
  {
    id: 'posted', label: 'Posted', short: 'Posted',
    cls: 'ps-posted', hint: 'Live on the platform.',
  },
  {
    id: 'deleted', label: 'Deleted', short: 'Deleted',
    cls: 'ps-deleted', hint: 'Removed from the campaign. Can be restored.',
  },
]

export const PLATFORMS = [
  'Instagram', 'TikTok', 'YouTube', 'Facebook', 'X', 'Threads', 'LinkedIn', 'Email',
]

/** Media kind -> the label shown on the post row. */
export const MEDIA_LABEL = { image: 'Image', video: 'Video', audio: 'Audio' }

export const CAMPAIGN_POSTS = {
  // ---- 0 · Q3 Product Launch (live, multi-post) -------------------
  0: [
    {
      id: 'p0-1', title: 'Silhouette teaser — day 1', media: null,
      caption: 'Something is coming. 8 days.\n\nNo spoilers. Just this. 🖤\n#APEXWatch #ComingSoon',
      platform: 'Instagram', date: '2026-08-20', time: '18:00',
      status: 'posted', postedAt: 'Aug 20, 6:00 PM',
      metrics: { likes: '12.4K', comments: '842', shares: '1.9K' },
    },
    {
      id: 'p0-2', title: 'Creator seeding announcement', media: 'image',
      caption: '12 creators. 12 cities. One watch.\n\nUnboxings drop this week — watch this space.\n#APEXCrew',
      platform: 'TikTok', date: '2026-08-24', time: '12:30',
      status: 'posted', postedAt: 'Aug 24, 12:30 PM',
      metrics: { likes: '31.8K', comments: '2,104', shares: '5.6K' },
    },
    {
      id: 'p0-3', title: 'Hero launch film (30s)', media: 'video',
      caption: 'Elevate every rep. The APEX Smart Watch Series 5 tracks your performance so you don\'t have to think — just move.\n\nAvailable now. #APEXWatch #FitTech',
      platform: 'Instagram', date: '2026-08-27', time: '09:00',
      status: 'posted', postedAt: 'Aug 27, 9:00 AM',
      metrics: { likes: '48.2K', comments: '3,140', shares: '8.9K' },
    },
    {
      id: 'p0-4', title: 'Paid social burst — variant A', media: 'image',
      caption: '7-day battery. 50+ workout modes. One less thing to think about.\n\nShop the Series 5 →',
      platform: 'Instagram', date: '2026-08-29', time: '19:00',
      status: 'pending',
    },
    {
      id: 'p0-5', title: 'Paid social burst — variant B', media: 'image',
      caption: 'Your training, measured properly. APEX Series 5 — free shipping this week.',
      platform: 'Facebook', date: '2026-08-30', time: '11:00',
      status: 'pending',
    },
    {
      id: 'p0-6', title: 'Battery test data post', media: 'image',
      caption: 'We said 7 days. We measured 8.2.\n\nFull methodology and raw logs in the link below — check our numbers yourself.\n#APEXWatch',
      platform: 'X', date: '2026-09-01', time: '10:00',
      status: 'review',
    },
    {
      id: 'p0-7', title: 'Sleep-tracking accuracy explainer', media: 'video',
      caption: 'How we validate sleep staging against a clinical polysomnography baseline. 90 seconds, no marketing speak.',
      platform: 'YouTube', date: '2026-09-03', time: '17:00',
      status: 'review',
    },
    {
      id: 'p0-8', title: 'Review round-up carousel', media: 'image',
      caption: 'What 2,400 owners said in week one. Unedited.\n\n#APEXWatch #RealReviews',
      platform: 'Instagram', date: '2026-09-05', time: '18:30',
      status: 'review',
    },
    {
      id: 'p0-9', title: 'Competitor price comparison', media: 'image',
      caption: 'Why pay more? See how the Series 5 stacks up against the competition.',
      platform: 'X', date: '2026-08-28', time: '15:00',
      status: 'deleted',
      deletedNote: 'Pulled — legal flagged the direct price comparison.',
    },
  ],

  // ---- 1 · Summer Vibes Audio (scheduled, multi-post) -------------
  1: [
    {
      id: 'p1-1', title: 'Playlist teaser', media: 'audio',
      caption: 'Summer has a sound. 30 seconds of it, right here. 🎧\n\nFull drop Sep 1. #EarbudsPro',
      platform: 'Instagram', date: '2026-09-01', time: '08:00',
      status: 'pending',
    },
    {
      id: 'p1-2', title: 'Spotify campaign launch copy', media: null,
      caption: 'Every summer needs a soundtrack. Ours runs 40 hours on a single charge.\n\nEarbuds Pro — out now.',
      platform: 'Threads', date: '2026-09-01', time: '12:00',
      status: 'pending',
    },
    {
      id: 'p1-3', title: 'Creator beach session reel', media: 'video',
      caption: 'Sand, salt water, and zero dropouts. IPX7 tested where it matters.',
      platform: 'TikTok', date: '2026-09-04', time: '17:30',
      status: 'review',
    },
    {
      id: 'p1-4', title: 'Audio quality deep-dive', media: 'video',
      caption: 'A studio engineer breaks down what the drivers are actually doing. For the people who care.',
      platform: 'YouTube', date: '2026-09-08', time: '14:00',
      status: 'review',
    },
    {
      id: 'p1-5', title: 'Festival tie-in announcement', media: 'image',
      caption: 'Catch us at three festivals this September. Demo booths, free tips, and a charging bar.',
      platform: 'Instagram', date: '2026-09-12', time: '10:00',
      status: 'review',
    },
  ],

  // ---- 2 · Fitness Re-engage (no content yet) ---------------------
  2: [],

  // ---- 5 · Watch Teaser Post (single post) ------------------------
  5: [
    {
      id: 'p5-1', title: 'Watch teaser — main post', media: 'image',
      caption: 'Eight days of battery. One less charger in your bag.\n\nSeries 5, available now. #APEXWatch',
      platform: 'Instagram', date: '2026-08-30', time: '18:00',
      status: 'review',
    },
  ],

  // ---- 6 · Earbuds Unboxing Reel (single post) --------------------
  6: [
    {
      id: 'p6-1', title: 'Unboxing reel — final cut', media: 'video',
      caption: 'Unbox with us. 45 seconds, no talking, just the good part. 🎧\n\n#EarbudsPro #Unboxing',
      platform: 'TikTok', date: '2026-08-31', time: '19:00',
      status: 'pending',
    },
    {
      id: 'p6-2', title: 'Unboxing reel — cross-post', media: 'video',
      caption: 'Unbox with us. Full version on our channel. 🎧 #EarbudsPro',
      platform: 'Instagram', date: '2026-08-31', time: '20:00',
      status: 'review',
    },
  ],
}
