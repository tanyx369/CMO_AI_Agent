import { useMemo } from 'react'
import {
  FaWandMagicSparkles, FaChartLine, FaArrowRight, FaStore, FaGlobe,
} from 'react-icons/fa6'
import { CAMPAIGNS, AI_SUGGESTIONS, UPCOMING_OCCASIONS } from '../data'

/** Compact stat tile for the top row of the dashboard. */
function StatTile({ label, value, sub, accent }) {
  return (
    <div className="stat-tile">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={accent ? { color: accent } : undefined}>{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  )
}

/** One row in the "Campaign Progression" panel. */
function ProgressRow({ campaign, onOpen }) {
  const isPhysical = campaign.category === 'physical'
  const Icon = isPhysical ? FaStore : FaGlobe
  const barColor = campaign.status === 'Live'
    ? 'linear-gradient(90deg,var(--accent),var(--pink))'
    : 'var(--s3)'

  return (
    <div className="prog-row" onClick={() => onOpen(campaign.id)}>
      <div className="prog-head">
        <span className="prog-name">
          <Icon style={{ fontSize: 10, color: isPhysical ? 'var(--amber)' : 'var(--accent)' }} />
          {campaign.title}
        </span>
        <span className={'tag ' + campaign.statusCls} style={{ fontSize: 10 }}>{campaign.status}</span>
      </div>
      <div className="pbar" style={{ marginTop: 8 }}>
        <div className="pfill" style={{ width: campaign.progress + '%', background: barColor }} />
      </div>
      <div className="prog-foot">
        <span>{campaign.footL}</span>
        <span>{campaign.progress}%</span>
      </div>
    </div>
  )
}

/** One AI suggestion card. */
function SuggestionItem({ s, onAct }) {
  return (
    <div className={'sg-item' + (s.featured ? ' sg-featured' : '')}>
      <div className="sg-emoji">{s.emoji}</div>
      <div className="sg-body">
        <div className="sg-top">
          <span className="sg-title">{s.title}</span>
          <span className={'pri ' + s.priCls}>{s.priority}</span>
        </div>
        <div className="sg-why">{s.why}</div>
        <div className="sg-foot">
          <span className="sg-meta">{s.meta}</span>
          <button className="sg-act" onClick={onAct}>
            {s.action} <FaArrowRight style={{ fontSize: 9 }} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CampaignDashboard({ onOpenCampaign, onNewCampaign }) {
  const stats = useMemo(() => {
    const live = CAMPAIGNS.filter((c) => c.status === 'Live')
    const scheduled = CAMPAIGNS.filter((c) => c.status === 'Scheduled')
    const drafts = CAMPAIGNS.filter((c) => c.status === 'Draft')
    // Average completion across everything currently running
    const avg = live.length
      ? Math.round(live.reduce((sum, c) => sum + c.progress, 0) / live.length)
      : 0
    return { live, scheduled, drafts, avg }
  }, [])

  // Campaigns worth tracking: running first, then upcoming
  const tracked = useMemo(
    () => [...stats.live, ...stats.scheduled].slice(0, 4),
    [stats]
  )

  const nextOccasion = UPCOMING_OCCASIONS[0]

  return (
    <div className="cdash">
      {/* Row 1 — portfolio at a glance */}
      <div className="stat-row">
        <StatTile
          label="Running Now"
          value={stats.live.length}
          sub={stats.avg + '% avg. completion'}
          accent="var(--green)"
        />
        <StatTile
          label="Scheduled"
          value={stats.scheduled.length}
          sub="Awaiting start date"
          accent="var(--accent)"
        />
        <StatTile
          label="Drafts"
          value={stats.drafts.length}
          sub="Need attention"
          accent="var(--amber)"
        />
        <StatTile
          label="Next Occasion"
          value={nextOccasion.emoji + ' ' + nextOccasion.date}
          sub={nextOccasion.name + ' · in ' + nextOccasion.daysAway + ' days'}
        />
      </div>

      {/* Row 2 — progression + AI suggestions */}
      <div className="cdash-grid">
        <div className="dash-card">
          <div className="dash-title">
            <span><FaChartLine /> Campaign Progression</span>
            <span className="dash-title-sub">{tracked.length} in flight</span>
          </div>
          {tracked.map((c) => (
            <ProgressRow key={c.id} campaign={c} onOpen={onOpenCampaign} />
          ))}
        </div>

        <div className="dash-card">
          <div className="dash-title">
            <span><FaWandMagicSparkles /> AI Suggested Actions</span>
            <span className="dash-title-sub">{AI_SUGGESTIONS.length}</span>
          </div>
          <div className="sg-list">
            {AI_SUGGESTIONS.map((s) => (
              <SuggestionItem
                key={s.id}
                s={s}
                onAct={() => {
                  if (s.preset) onNewCampaign(s.preset)
                  else if (s.campaignId !== undefined) onOpenCampaign(s.campaignId)
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
