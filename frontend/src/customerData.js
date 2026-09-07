/**
 * Customers acquired through marketing campaigns.
 *
 * Mock data in the same spirit as the other *Data modules. Every customer
 * carries the `campaignId` that brought them in, so the list can always be
 * traced back to the campaign that earned it.
 *
 * `campaignId` values point at entries in data.js:
 *   0 Q3 Product Launch · 1 Summer Vibes Audio · 2 Fitness Re-engage
 *   3 KLCC Launch Roadshow · 4 FitFest Event Collab
 *   5 Watch Teaser Post · 6 Earbuds Unboxing Reel
 */

/** Where the customer first came from. Physical campaigns use `in_person`. */
export const CHANNELS = [
  { id: 'instagram', label: 'Instagram', cls: 'tp' },
  { id: 'tiktok', label: 'TikTok', cls: 'tk' },
  { id: 'youtube', label: 'YouTube', cls: 'tr' },
  { id: 'email', label: 'Email', cls: 'tg' },
  { id: 'in_person', label: 'In person', cls: 'ta' },
]

export const CHANNEL_LABEL = Object.fromEntries(CHANNELS.map((c) => [c.id, c.label]))
export const CHANNEL_CLS = Object.fromEntries(CHANNELS.map((c) => [c.id, c.cls]))

/**
 * Lifecycle after acquisition.
 *   new      — acquired, has not ordered again
 *   repeat   — two or more orders
 *   vip      — high lifetime value
 *   churned  — no activity in 90+ days
 */
export const CUSTOMER_STATUSES = [
  { id: 'new', label: 'New', cls: 'cs-new' },
  { id: 'repeat', label: 'Repeat', cls: 'cs-repeat' },
  { id: 'vip', label: 'VIP', cls: 'cs-vip' },
  { id: 'churned', label: 'Churned', cls: 'cs-churned' },
]

export const STATUS_META = Object.fromEntries(CUSTOMER_STATUSES.map((s) => [s.id, s]))

const AV = ['#6D5EF5', '#E85BAA', '#12B76A', '#E8940C', '#F04438', '#5C5F73']

export const CUSTOMERS = [
  // --- Q3 Product Launch (campaign 0) --------------------------------------
  { id: 'c01', name: 'Jessica Tan', email: 'jess.tan@gmail.com', campaignId: 0, channel: 'instagram',
    acquired: '2026-08-21', product: 'Smart Watch Series 5', orders: 3, ltv: 1284, status: 'vip',
    location: 'Kuala Lumpur, MY', lastActive: '2026-09-05' },
  { id: 'c02', name: 'Marcus Lee', email: 'm.lee@outlook.com', campaignId: 0, channel: 'instagram',
    acquired: '2026-08-22', product: 'Smart Watch Series 5', orders: 1, ltv: 349, status: 'new',
    location: 'Singapore, SG', lastActive: '2026-08-29' },
  { id: 'c03', name: 'Priya Nair', email: 'priya.nair@fastmail.com', campaignId: 0, channel: 'tiktok',
    acquired: '2026-08-23', product: 'Smart Watch Series 5', orders: 2, ltv: 618, status: 'repeat',
    location: 'Penang, MY', lastActive: '2026-09-06' },
  { id: 'c04', name: 'Daniel Wong', email: 'dwong@protonmail.com', campaignId: 0, channel: 'youtube',
    acquired: '2026-08-25', product: 'Smart Watch Series 5', orders: 1, ltv: 349, status: 'new',
    location: 'Johor Bahru, MY', lastActive: '2026-09-01' },
  { id: 'c05', name: 'Aisha Rahman', email: 'aisha.r@gmail.com', campaignId: 0, channel: 'instagram',
    acquired: '2026-08-26', product: 'Smart Watch Series 5', orders: 4, ltv: 1642, status: 'vip',
    location: 'Kuala Lumpur, MY', lastActive: '2026-09-07' },
  { id: 'c06', name: 'Kevin Ooi', email: 'kevin.ooi@yahoo.com', campaignId: 0, channel: 'tiktok',
    acquired: '2026-08-27', product: 'Earbuds Pro', orders: 1, ltv: 199, status: 'new',
    location: 'Ipoh, MY', lastActive: '2026-08-30' },
  { id: 'c07', name: 'Sofia Martinez', email: 's.martinez@gmail.com', campaignId: 0, channel: 'instagram',
    acquired: '2026-08-28', product: 'Smart Watch Series 5', orders: 2, ltv: 548, status: 'repeat',
    location: 'Madrid, ES', lastActive: '2026-09-04' },
  { id: 'c08', name: 'Liam O’Connor', email: 'liam.oc@gmail.com', campaignId: 0, channel: 'youtube',
    acquired: '2026-09-01', product: 'Smart Watch Series 5', orders: 1, ltv: 349, status: 'new',
    location: 'Dublin, IE', lastActive: '2026-09-06' },

  // --- Summer Vibes Audio (campaign 1) -------------------------------------
  { id: 'c09', name: 'Hana Kimura', email: 'hana.k@icloud.com', campaignId: 1, channel: 'youtube',
    acquired: '2026-09-02', product: 'Earbuds Pro', orders: 1, ltv: 199, status: 'new',
    location: 'Tokyo, JP', lastActive: '2026-09-06' },
  { id: 'c10', name: 'Ryan Chandra', email: 'ryan.c@gmail.com', campaignId: 1, channel: 'instagram',
    acquired: '2026-09-03', product: 'Earbuds Pro', orders: 2, ltv: 448, status: 'repeat',
    location: 'Jakarta, ID', lastActive: '2026-09-07' },
  { id: 'c11', name: 'Chloe Baker', email: 'chloe.baker@gmail.com', campaignId: 1, channel: 'tiktok',
    acquired: '2026-09-04', product: 'Earbuds Pro', orders: 1, ltv: 199, status: 'new',
    location: 'Manchester, UK', lastActive: '2026-09-05' },
  { id: 'c12', name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com', campaignId: 1, channel: 'youtube',
    acquired: '2026-09-05', product: 'Earbuds Pro', orders: 3, ltv: 892, status: 'vip',
    location: 'Bengaluru, IN', lastActive: '2026-09-07' },

  // --- Fitness Re-engage (campaign 2) --------------------------------------
  { id: 'c13', name: 'Wei Ling Chua', email: 'weiling.c@gmail.com', campaignId: 2, channel: 'email',
    acquired: '2026-08-15', product: 'Fitness Tracker Lite', orders: 2, ltv: 318, status: 'repeat',
    location: 'Kuala Lumpur, MY', lastActive: '2026-09-02' },
  { id: 'c14', name: 'Tom Fischer', email: 't.fischer@web.de', campaignId: 2, channel: 'email',
    acquired: '2026-08-16', product: 'Fitness Tracker Lite', orders: 1, ltv: 159, status: 'new',
    location: 'Berlin, DE', lastActive: '2026-08-24' },
  { id: 'c15', name: 'Nurul Izzati', email: 'nurul.izzati@gmail.com', campaignId: 2, channel: 'email',
    acquired: '2026-05-11', product: 'Fitness Tracker Lite', orders: 1, ltv: 159, status: 'churned',
    location: 'Shah Alam, MY', lastActive: '2026-05-28' },
  { id: 'c16', name: 'Grace Lim', email: 'grace.lim@hotmail.com', campaignId: 2, channel: 'email',
    acquired: '2026-08-18', product: 'Fitness Tracker Lite', orders: 3, ltv: 706, status: 'repeat',
    location: 'Singapore, SG', lastActive: '2026-09-06' },

  // --- KLCC Launch Roadshow (campaign 3, physical) -------------------------
  { id: 'c17', name: 'Farid Hassan', email: 'farid.h@gmail.com', campaignId: 3, channel: 'in_person',
    acquired: '2026-09-05', product: 'Smart Watch Series 5', orders: 1, ltv: 349, status: 'new',
    location: 'Kuala Lumpur, MY', lastActive: '2026-09-06' },
  { id: 'c18', name: 'Michelle Yeoh', email: 'm.yeoh@gmail.com', campaignId: 3, channel: 'in_person',
    acquired: '2026-09-05', product: 'Smart Watch Series 5', orders: 2, ltv: 548, status: 'repeat',
    location: 'Kuala Lumpur, MY', lastActive: '2026-09-07' },
  { id: 'c19', name: 'Adrian Kok', email: 'adrian.kok@gmail.com', campaignId: 3, channel: 'in_person',
    acquired: '2026-09-06', product: 'Earbuds Pro', orders: 1, ltv: 199, status: 'new',
    location: 'Petaling Jaya, MY', lastActive: '2026-09-06' },
  { id: 'c20', name: 'Siti Aminah', email: 'siti.aminah@gmail.com', campaignId: 3, channel: 'in_person',
    acquired: '2026-09-06', product: 'Smart Watch Series 5', orders: 3, ltv: 1097, status: 'vip',
    location: 'Kuala Lumpur, MY', lastActive: '2026-09-07' },
  { id: 'c21', name: 'James Tan', email: 'james.tan@gmail.com', campaignId: 3, channel: 'in_person',
    acquired: '2026-09-07', product: 'Fitness Tracker Lite', orders: 1, ltv: 159, status: 'new',
    location: 'Klang, MY', lastActive: '2026-09-07' },

  // --- FitFest Event Collab (campaign 4, physical) -------------------------
  { id: 'c22', name: 'Rachel Ng', email: 'rachel.ng@gmail.com', campaignId: 4, channel: 'in_person',
    acquired: '2026-06-14', product: 'Fitness Tracker Lite', orders: 1, ltv: 159, status: 'churned',
    location: 'Singapore, SG', lastActive: '2026-06-20' },
  { id: 'c23', name: 'Deepak Sharma', email: 'deepak.s@gmail.com', campaignId: 4, channel: 'in_person',
    acquired: '2026-08-30', product: 'Fitness Tracker Lite', orders: 2, ltv: 358, status: 'repeat',
    location: 'Singapore, SG', lastActive: '2026-09-05' },
  { id: 'c24', name: 'Emily Zhang', email: 'emily.zhang@gmail.com', campaignId: 4, channel: 'in_person',
    acquired: '2026-08-31', product: 'Smart Watch Series 5', orders: 1, ltv: 349, status: 'new',
    location: 'Shanghai, CN', lastActive: '2026-09-03' },

  // --- Watch Teaser Post (campaign 5) --------------------------------------
  { id: 'c25', name: 'Nadia Ismail', email: 'nadia.i@gmail.com', campaignId: 5, channel: 'instagram',
    acquired: '2026-08-24', product: 'Smart Watch Series 5', orders: 1, ltv: 349, status: 'new',
    location: 'Kuala Lumpur, MY', lastActive: '2026-09-02' },
  { id: 'c26', name: 'Ben Carter', email: 'ben.carter@gmail.com', campaignId: 5, channel: 'instagram',
    acquired: '2026-08-25', product: 'Smart Watch Series 5', orders: 2, ltv: 698, status: 'repeat',
    location: 'Austin, US', lastActive: '2026-09-07' },
  { id: 'c27', name: 'Yuki Tanaka', email: 'yuki.t@gmail.com', campaignId: 5, channel: 'instagram',
    acquired: '2026-08-26', product: 'Earbuds Pro', orders: 1, ltv: 199, status: 'new',
    location: 'Osaka, JP', lastActive: '2026-08-28' },

  // --- Earbuds Unboxing Reel (campaign 6) ----------------------------------
  { id: 'c28', name: 'Zoe Williams', email: 'zoe.w@gmail.com', campaignId: 6, channel: 'tiktok',
    acquired: '2026-09-01', product: 'Earbuds Pro', orders: 1, ltv: 199, status: 'new',
    location: 'Sydney, AU', lastActive: '2026-09-06' },
  { id: 'c29', name: 'Hakim Yusof', email: 'hakim.y@gmail.com', campaignId: 6, channel: 'tiktok',
    acquired: '2026-09-02', product: 'Earbuds Pro', orders: 2, ltv: 448, status: 'repeat',
    location: 'Kuantan, MY', lastActive: '2026-09-07' },
  { id: 'c30', name: 'Laura Costa', email: 'laura.costa@gmail.com', campaignId: 6, channel: 'tiktok',
    acquired: '2026-09-03', product: 'Earbuds Pro', orders: 1, ltv: 199, status: 'new',
    location: 'Lisbon, PT', lastActive: '2026-09-04' },
]

/** Initials and a stable avatar colour, derived rather than stored per row. */
export function customerAvatar(c) {
  const initials = c.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  let hash = 0
  for (let i = 0; i < c.id.length; i++) hash = (hash + c.id.charCodeAt(i)) % AV.length
  return { initials, color: AV[hash] }
}

export const money = (n) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Headline numbers for the cards above the table. */
export function customerTotals(list) {
  const total = list.length
  const revenue = list.reduce((n, c) => n + c.ltv, 0)
  const repeat = list.filter((c) => c.orders > 1).length
  return {
    total,
    revenue,
    avgLtv: total ? Math.round(revenue / total) : 0,
    repeatRate: total ? Math.round((repeat / total) * 100) : 0,
    orders: list.reduce((n, c) => n + c.orders, 0),
  }
}

/** Customers grouped by the campaign that acquired them, best first. */
export function acquisitionByCampaign(list, campaigns) {
  const byId = new Map()
  list.forEach((c) => {
    const entry = byId.get(c.campaignId) || { campaignId: c.campaignId, count: 0, revenue: 0 }
    entry.count += 1
    entry.revenue += c.ltv
    byId.set(c.campaignId, entry)
  })
  return [...byId.values()]
    .map((e) => ({ ...e, campaign: campaigns.find((c) => c.id === e.campaignId) }))
    .filter((e) => e.campaign)
    .sort((a, b) => b.count - a.count)
}
