import { useMemo, useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  FaDownload, FaArrowTrendUp, FaArrowTrendDown, FaUsers, FaWandMagicSparkles,
  FaRotate, FaCircleCheck, FaTriangleExclamation, FaLightbulb, FaClock,
} from 'react-icons/fa6'
import { gridColor, tickColor } from '../chartSetup'
import DateRangePicker, { addDays, daysBetween, formatRange, startOfDay } from '../components/DateRangePicker'
import { buildAiSummary, profileStatsForPeriod, profileTotals } from '../analyticsData'

const KPIS = [
  { cls: 'kb', l: 'Total Revenue', v: '$1,244,820', ch: '+14.2% MoM' },
  { cls: 'kp', l: 'Ad Spend', v: '$327,600', ch: '+8.1% MoM' },
  { cls: 'kg', l: 'Blended ROAS', v: '3.80x', ch: '+0.2x vs target' },
  { cls: 'ka', l: 'New Customers', v: '3,840', ch: '+31.2% MoM' },
]

const CHANNELS = [
  { name: 'Instagram', color: 'var(--accent)', val: '$412K', ch: '+18.4%', up: true },
  { name: 'Google Ads', color: 'var(--pink)', val: '$338K', ch: '+9.2%', up: true },
  { name: 'TikTok', color: 'var(--amber)', val: '$287K', ch: '−18.0%', up: false },
  { name: 'Email', color: 'var(--green)', val: '$207K', ch: '+42.1%', up: true },
]

const FUNNEL = [
  { l: 'Impressions', v: '4.1M', w: 100, bg: 'var(--accent)', color: 'white', note: '' },
  { l: 'Clicks', v: '298K', w: 72, bg: 'rgba(109,94,245,0.7)', color: 'white', note: '7.3% CTR' },
  { l: 'Add to Cart', v: '31.2K', w: 44, bg: 'rgba(232,91,170,0.65)', color: 'white', note: '10.5%' },
  { l: 'Checkout', v: '18.4K', w: 28, bg: 'rgba(232,148,12,0.8)', color: '#3a2600', note: '59.0%' },
  { l: 'Purchase', v: '12.1K', w: 18, bg: 'var(--green)', color: 'white', note: '65.8%' },
]

const revLabels = ['1', '4', '7', '10', '13', '16', '19', '22', '25', '26'].map((x) => x + ' Aug')
const revData = {
  labels: revLabels,
  datasets: [{ data: [28, 32, 31, 35, 38, 29, 42, 40, 45, 48], backgroundColor: 'rgba(109,94,245,0.45)', borderColor: '#6D5EF5', borderWidth: 1, borderRadius: 4 }],
}
const revOpts = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 10 } } },
    y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 10 }, callback: (v) => '$' + v + 'K' } },
  },
}

const expData = {
  labels: ['Smart Watch', 'Earbuds Pro', 'Tracker Lite'],
  datasets: [
    { label: 'Impressions (M)', data: [2.1, 1.4, 0.6], backgroundColor: 'rgba(109,94,245,0.6)', borderRadius: 4 },
    { label: 'Clicks (K)', data: [158, 98, 42], backgroundColor: 'rgba(232,91,170,0.6)', borderRadius: 4 },
  ],
}
const expOpts = {
  responsive: true,
  plugins: { legend: { display: true, labels: { color: tickColor, font: { size: 11 }, boxWidth: 10 } } },
  scales: {
    x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 10 } } },
    y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 10 } } },
  },
}

/* ------------------------------------------------------------------ */
/* Social media profiles                                               */
/* ------------------------------------------------------------------ */

function SocialProfiles({ days }) {
  const profiles = useMemo(() => profileStatsForPeriod(days), [days])
  const totals = useMemo(() => profileTotals(days), [days])

  return (
    <div className="chart-card" style={{ marginBottom: 14 }}>
      <div className="dash-title">
        <span><FaUsers /> Social Media Profiles</span>
        <span className="dash-title-sub">
          {totals.followersLabel} followers · {totals.gainedLabel} this period · {totals.posts} posts · {totals.reachLabel} reach
        </span>
      </div>

      <div className="sp-grid">
        {profiles.map((p) => (
          <div className="sp-card" key={p.id}>
            <div className="sp-head">
              <span className="sp-avatar" style={{ background: p.color }}>{p.emoji}</span>
              <div style={{ minWidth: 0 }}>
                <div className="sp-name">{p.name}</div>
                <div className="sp-handle">{p.handle}</div>
              </div>
            </div>

            <div className="sp-followers">
              <span className="sp-count">{p.followersLabel}</span>
              <span className={'delta ' + (p.gainedUp ? 'up' : 'dn')}>
                {p.gainedUp
                  ? <FaArrowTrendUp style={{ fontSize: 9 }} />
                  : <FaArrowTrendDown style={{ fontSize: 9 }} />}
                {p.gainedLabel} ({p.growthLabel})
              </span>
            </div>
            <div className="sp-count-lbl">Followers</div>

            <div className="sp-stats">
              <div>
                <span className="sp-stat-v">{p.engagementLabel}</span>
                <span className="sp-stat-l">Engagement</span>
                <span className={'delta ' + (p.engagementUp ? 'up' : 'dn')} style={{ fontSize: 10 }}>
                  {p.engagementChangeLabel}
                </span>
              </div>
              <div>
                <span className="sp-stat-v">{p.posts}</span>
                <span className="sp-stat-l">Posts</span>
              </div>
              <div>
                <span className="sp-stat-v">{p.reachLabel}</span>
                <span className="sp-stat-l">Reach</span>
              </div>
              <div>
                <span className="sp-stat-v">{p.visitsLabel}</span>
                <span className="sp-stat-l">Profile visits</span>
              </div>
            </div>

            <div className="sp-top">Top: {p.topPost}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* AI summary                                                          */
/* ------------------------------------------------------------------ */

function AiSummary({ days, rangeLabel, stale, onRegenerated }) {
  const [variant, setVariant] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [summary, setSummary] = useState(() => buildAiSummary({ days, variant: 0, rangeLabel }))
  const timer = useRef(null)

  function regenerate() {
    clearTimeout(timer.current)
    setGenerating(true)
    const next = variant + 1
    timer.current = setTimeout(() => {
      setSummary(buildAiSummary({ days, variant: next, rangeLabel }))
      setVariant(next)
      setGenerating(false)
      onRegenerated()
    }, 1800)
  }

  return (
    <div className="chart-card ai-sum" style={{ marginBottom: 14 }}>
      <div className="dash-title">
        <span><FaWandMagicSparkles /> AI Summary</span>
        <button className="btn btn-g btn-sm" onClick={regenerate} disabled={generating}>
          {generating
            ? <><span className="gen-spinner" style={{ width: 12, height: 12 }} /> Analysing…</>
            : <><FaRotate /> Regenerate</>}
        </button>
      </div>

      {stale && !generating && (
        <div className="ai-stale">
          <FaClock style={{ fontSize: 11, flexShrink: 0 }} />
          The date range changed since this was written — regenerate for an updated read.
        </div>
      )}

      {generating ? (
        <div className="empty-state" style={{ border: 'none', padding: '38px 16px' }}>
          <span className="gen-spinner" /> Reviewing {summary.meta.campaigns} campaigns across {days} days…
        </div>
      ) : (
        <>
          <div className="ai-verdict">{summary.verdict}</div>
          <p className="ai-headline">{summary.headline}</p>

          <div className="ai-cols">
            <div>
              <div className="ai-col-title ai-good"><FaCircleCheck /> What worked</div>
              {summary.wins.map((w) => (
                <div className="ai-item" key={w.title}>
                  <div className="ai-item-title">{w.title}</div>
                  <div className="ai-item-body">{w.body}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="ai-col-title ai-bad"><FaTriangleExclamation /> What held it back</div>
              {summary.concerns.map((c) => (
                <div className="ai-item" key={c.title}>
                  <div className="ai-item-title">{c.title}</div>
                  <div className="ai-item-body">{c.body}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ai-col-title ai-next" style={{ marginTop: 18 }}>
            <FaLightbulb /> What to do next
          </div>
          <div className="ai-actions">
            {summary.actions.map((a, i) => (
              <div className="ai-action" key={a.title}>
                <span className="ai-action-n">{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div className="ai-item-title">
                    {a.title}
                    <span className={'ai-pri pri-' + a.priority}>{a.priority}</span>
                  </div>
                  <div className="ai-item-body">{a.body}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="ai-foot">
            Based on {summary.meta.campaigns} campaigns running {summary.meta.rangeLabel} · generated {summary.meta.generatedAt}
          </div>
        </>
      )}
    </div>
  )
}

export default function Analytics() {
  // The whole page reads from one selected range.
  const today = startOfDay(new Date())
  const [range, setRange] = useState({ start: addDays(today, -29), end: today })
  // Tracks whether the range moved since the AI summary was last written.
  const [summaryStale, setSummaryStale] = useState(false)

  const days = daysBetween(range.start, range.end)
  const rangeLabel = formatRange(range)

  function changeRange(next) {
    setRange(next)
    setSummaryStale(true)
  }

  return (
    <div className="page">
      <div className="ph-row">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 4 }}>Sales &amp; Revenue Analysis</h1>
          <p style={{ color: 'var(--t2)', fontSize: 14 }}>
            Track performance, conversions, and exposure across all channels.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <DateRangePicker value={range} onChange={changeRange} maxDate={today} />
          <button className="btn btn-g btn-sm"><FaDownload /> Export</button>
        </div>
      </div>

      <div className="range-note">
        Showing <strong>{rangeLabel}</strong> · {days} day{days === 1 ? '' : 's'}
      </div>

      <div className="kpig">
        {KPIS.map((k, i) => (
          <div className={'kpi ' + k.cls} key={i}>
            <div className="ml">{k.l}</div>
            <div className="mv">{k.v}</div>
            <div className="mch up"><FaArrowTrendUp style={{ fontSize: 10 }} /> {k.ch}</div>
          </div>
        ))}
      </div>

      <div className="g21" style={{ marginBottom: 14 }}>
        <div className="chart-card">
          <div className="ct-title">Revenue Trend — Daily</div>
          <Bar data={revData} options={revOpts} height={100} />
        </div>
        <div className="chart-card">
          <div className="ct-title">Revenue by Channel</div>
          <ul className="revlist" style={{ marginTop: 6 }}>
            {CHANNELS.map((c, i) => (
              <li key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="cdot" style={{ background: c.color }} />{c.name}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600 }}>{c.val}</div>
                  <div style={{ fontSize: 11, color: c.up ? 'var(--green)' : 'var(--red)' }}>{c.ch}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SocialProfiles days={days} />

      <AiSummary
        days={days}
        rangeLabel={rangeLabel}
        stale={summaryStale}
        onRegenerated={() => setSummaryStale(false)}
      />

      <div className="g2" style={{ marginBottom: 14 }}>
        <div className="chart-card">
          <div className="ct-title">Conversion Funnel</div>
          <div className="funnel" style={{ marginTop: 8 }}>
            {FUNNEL.map((f, i) => (
              <div className="fss" key={i}>
                <div className="fll">{f.l}</div>
                <div className="fbw">
                  <div className="fb" style={{ width: f.w + '%', background: f.bg, color: f.color }}>{f.v}</div>
                </div>
                <div className="fv" style={{ fontSize: 11, color: 'var(--t3)' }}>{f.note}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <div className="ct-title">Exposure by Product</div>
          <Bar data={expData} options={expOpts} height={120} />
        </div>
      </div>
    </div>
  )
}
