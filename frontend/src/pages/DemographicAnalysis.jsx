import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  FaChartPie, FaArrowTrendUp, FaArrowTrendDown, FaDownload, FaFire,
  FaUsers, FaChessKnight, FaWaveSquare, FaRotate, FaCircleInfo,
  FaBolt, FaEye, FaTriangleExclamation, FaLightbulb, FaChevronDown, FaChevronUp,
} from 'react-icons/fa6'
import { gridColor, tickColor } from '../chartSetup'
import {
  INDUSTRY, PULSE_KPIS, TIMEFRAMES, SENTIMENT_TREND, PLATFORMS,
  SHARE_OF_VOICE, AGE_SEGMENTS, GENDER_SPLIT, REGIONS,
  TOPIC_STAGES, VIRAL_TOPICS, COMPETITORS, AI_BRIEF,
} from '../marketData'

const VIEWS = [
  { id: 'pulse', label: 'Industry Pulse', icon: FaWaveSquare },
  { id: 'demographics', label: 'Audience Demographics', icon: FaUsers },
  { id: 'topics', label: 'Viral Topics', icon: FaFire },
  { id: 'competitors', label: 'Competitors', icon: FaChessKnight },
]

const PLATFORM_NAME = Object.fromEntries(PLATFORMS.map((p) => [p.id, p.name]))

/** Growth above this counts as "breaking" and gets a flame badge. */
const BREAKING_GROWTH = 250

const TONE_ICON = { critical: FaTriangleExclamation, opportunity: FaLightbulb, watch: FaEye }

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

function Delta({ up, children }) {
  const Icon = up ? FaArrowTrendUp : FaArrowTrendDown
  return (
    <span className={'delta ' + (up ? 'up' : 'dn')}>
      <Icon style={{ fontSize: 9 }} /> {children}
    </span>
  )
}

/** Stacked positive / neutral / negative bar. */
function SentimentBar({ pos, neu, neg, showLabels }) {
  return (
    <div className="sentiment-bar-wrap" style={{ marginBottom: 0 }}>
      {showLabels && (
        <div className="sentiment-label">
          <span style={{ color: 'var(--green)' }}>{pos}% positive</span>
          <span style={{ color: 'var(--t3)' }}>{neu}% neutral</span>
          <span style={{ color: 'var(--red)' }}>{neg}% negative</span>
        </div>
      )}
      <div className="sentiment-track">
        <div className="sent-pos" style={{ width: pos + '%' }} />
        <div className="sent-neu" style={{ width: neu + '%' }} />
        <div className="sent-neg" style={{ width: neg + '%' }} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* View 1 — Industry Pulse                                             */
/* ------------------------------------------------------------------ */

function IndustryPulse({ timeframe }) {
  const t = SENTIMENT_TREND[timeframe]

  const data = {
    labels: t.labels,
    datasets: [
      {
        label: INDUSTRY.brand,
        data: t.brand,
        borderColor: '#6D5EF5',
        backgroundColor: 'rgba(109,94,245,0.14)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        borderWidth: 2,
      },
      {
        label: 'Industry average',
        data: t.industry,
        borderColor: '#9092A4',
        backgroundColor: 'transparent',
        borderDash: [5, 4],
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 1.5,
      },
    ],
  }

  const opts = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: true, labels: { color: tickColor, font: { size: 11 }, boxWidth: 10, usePointStyle: true } },
      tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + c.parsed.y + '/100' } },
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 10 } } },
      y: {
        min: 45, max: 90,
        grid: { color: gridColor },
        ticks: { color: tickColor, font: { size: 10 }, callback: (v) => v },
      },
    },
  }

  const gap = t.brand[t.brand.length - 1] - t.industry[t.industry.length - 1]

  return (
    <>
      <div className="g21" style={{ marginBottom: 14 }}>
        <div className="chart-card">
          <div className="dash-title">
            <span><FaWaveSquare /> Sentiment Trend</span>
            <span className="dash-title-sub">
              {INDUSTRY.brand} is {gap} pts above the industry average
            </span>
          </div>
          <Line data={data} options={opts} height={110} />
        </div>

        <div className="chart-card">
          <div className="dash-title">
            <span><FaChartPie /> Share of Voice</span>
            <span className="dash-title-sub">of category conversation</span>
          </div>
          {SHARE_OF_VOICE.map((b) => (
            <div className={'sov-row' + (b.self ? ' sov-self' : '')} key={b.name}>
              <div className="sov-top">
                <span className="sov-name">
                  {b.name}
                  {b.self && <span className="sov-you">You</span>}
                </span>
                <span className="sov-pct">{b.pct}%</span>
              </div>
              <div className="sov-track">
                <div className="sov-fill" style={{ width: b.pct + '%' }} />
              </div>
              <div className="sov-foot"><Delta up={b.up}>{b.ch} pts</Delta></div>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: 14 }}>
        <div className="dash-title">
          <span><FaChartPie /> Sentiment by Platform</span>
          <span className="dash-title-sub">1.2M mentions across 6 platforms</span>
        </div>
        <div className="plat-list">
          {PLATFORMS.map((p) => (
            <div className="plat-row" key={p.id}>
              <div className="plat-head">
                <span className="plat-name">
                  <span className="cdot" style={{ background: p.color }} />
                  {p.name}
                </span>
                <span className="plat-mentions">{p.mentions} mentions · {p.share}% of volume</span>
                <Delta up={p.up}>{p.ch}</Delta>
              </div>
              <SentimentBar pos={p.pos} neu={p.neu} neg={p.neg} />
              <div className="plat-note">{p.note}</div>
            </div>
          ))}
        </div>
      </div>

      <AiBrief />
    </>
  )
}

function AiBrief() {
  return (
    <div className="chart-card">
      <div className="dash-title">
        <span><FaBolt /> What This Means</span>
        <span className="dash-title-sub">AI read of the last 30 days</span>
      </div>
      <div className="sg-list">
        {AI_BRIEF.map((b) => {
          const Icon = TONE_ICON[b.tone]
          return (
            <div className={'sg-item brief-' + b.tone} key={b.id}>
              <div className="sg-emoji">{b.emoji}</div>
              <div className="sg-body">
                <div className="sg-top">
                  <div className="sg-title">{b.title}</div>
                  <span className={'tone-pill tone-' + b.tone}>
                    <Icon style={{ fontSize: 9 }} /> {b.tone}
                  </span>
                </div>
                <div className="sg-why">{b.body}</div>
                <div className="sg-foot">
                  <span className="sg-meta">{b.meta}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* View 2 — Audience Demographics                                      */
/* ------------------------------------------------------------------ */

function Demographics() {
  const [openId, setOpenId] = useState(AGE_SEGMENTS[0].id)

  return (
    <>
      <div className="chart-card" style={{ marginBottom: 14 }}>
        <div className="dash-title">
          <span><FaUsers /> Who Is Talking — by Age</span>
          <span className="dash-title-sub">Select a segment for detail</span>
        </div>

        <div className="age-grid">
          {AGE_SEGMENTS.map((s) => (
            <button
              className={'age-card' + (openId === s.id ? ' active' : '')}
              key={s.id}
              onClick={() => setOpenId(s.id)}
            >
              <div className="age-label">{s.label}</div>
              <div className="age-share">{s.share}%</div>
              <div className="age-sub">of conversation</div>
              <div className="age-bar"><div className="age-fill" style={{ width: s.share * 3 + '%' }} /></div>
              <div className="age-sent">
                <span className="age-score">{s.sentiment}</span>
                <Delta up={s.up}>{s.ch}</Delta>
              </div>
            </button>
          ))}
        </div>

        {AGE_SEGMENTS.filter((s) => s.id === openId).map((s) => (
          <div className="seg-detail" key={s.id}>
            <div className="seg-detail-grid">
              <div>
                <div className="seg-label">Mentions</div>
                <div className="seg-value">{s.volume}</div>
              </div>
              <div>
                <div className="seg-label">Sentiment</div>
                <div className="seg-value">{s.sentiment}<span className="seg-of">/100</span></div>
              </div>
              <div>
                <div className="seg-label">Gender split</div>
                <div className="seg-gender">
                  <span style={{ color: 'var(--pink)' }}>{s.gender.f}% F</span>
                  <span style={{ color: 'var(--accent)' }}>{s.gender.m}% M</span>
                  <span style={{ color: 'var(--amber)' }}>{s.gender.x}% other</span>
                </div>
              </div>
              <div>
                <div className="seg-label">Lives on</div>
                <div className="ctags">
                  {s.platforms.map((p) => <span className="tag tp" key={p}>{p}</span>)}
                </div>
              </div>
            </div>

            <div className="seg-label" style={{ marginTop: 16 }}>Topics they drive</div>
            <div className="ctags" style={{ marginTop: 6 }}>
              {s.topics.map((t) => <span className="tag ta" key={t}>{t}</span>)}
            </div>

            <div className="seg-insight">
              <FaCircleInfo style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }} />
              <span>{s.insight}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="g2">
        <div className="chart-card">
          <div className="dash-title"><span><FaChartPie /> Gender Split</span></div>
          <div className="gender-track">
            {GENDER_SPLIT.map((g) => (
              <div key={g.label} style={{ width: g.pct + '%', background: g.color }} title={g.label} />
            ))}
          </div>
          <ul className="revlist" style={{ marginTop: 12 }}>
            {GENDER_SPLIT.map((g) => (
              <li key={g.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="cdot" style={{ background: g.color }} />{g.label}
                </div>
                <strong>{g.pct}%</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="chart-card">
          <div className="dash-title">
            <span><FaChartPie /> Region</span>
            <span className="dash-title-sub">share · sentiment</span>
          </div>
          {REGIONS.map((r) => (
            <div className="region-row" key={r.name}>
              <span className="region-name">{r.name}</span>
              <div className="region-track">
                <div className="region-fill" style={{ width: r.pct * 2.4 + '%' }} />
              </div>
              <span className="region-pct">{r.pct}%</span>
              <span className="region-sent">{r.sentiment}</span>
              <Delta up={r.up}>{r.ch}</Delta>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* View 3 — Viral Topics                                               */
/* ------------------------------------------------------------------ */

function ViralTopics({ platform }) {
  const [stage, setStage] = useState('all')
  const [sort, setSort] = useState('score')

  const topics = useMemo(() => {
    let list = VIRAL_TOPICS
    if (stage !== 'all') list = list.filter((t) => t.stage === stage)
    if (platform !== 'all') list = list.filter((t) => t.platforms.includes(platform))
    const key = sort === 'score' ? 'score' : sort === 'growth' ? 'growth' : null
    return [...list].sort((a, b) => (key ? b[key] - a[key] : 0))
  }, [stage, platform, sort])

  const breaking = topics.filter((t) => t.growth >= BREAKING_GROWTH).length

  return (
    <div className="chart-card">
      <div className="dash-title">
        <span><FaFire /> Trending &amp; Viral Topics</span>
        <span className="dash-title-sub">
          {topics.length} topic{topics.length === 1 ? '' : 's'}
          {breaking > 0 && ' · ' + breaking + ' breaking'}
        </span>
      </div>

      <div className="topic-controls">
        <div className="subtab-row" style={{ margin: 0 }}>
          {TOPIC_STAGES.map((s) => (
            <button
              className={'subtab' + (stage === s.id ? ' active' : '')}
              key={s.id}
              onClick={() => setStage(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <select className="fsel" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="score">Sort: Virality score</option>
          <option value="growth">Sort: Growth rate</option>
        </select>
      </div>

      {topics.length === 0 ? (
        <div className="empty-state" style={{ border: 'none' }}>
          No topics match this filter. Try another stage or platform.
        </div>
      ) : (
        topics.map((t) => (
          <div className="topic-row" key={t.id}>
            <div className="topic-score-col">
              <div className={'topic-score sc-' + t.stage}>{t.score}</div>
              <div className="topic-score-lbl">virality</div>
            </div>

            <div className="topic-main">
              <div className="topic-head">
                <span className="topic-emoji">{t.emoji}</span>
                <span className="topic-name">{t.topic}</span>
                <span className={'stage-pill st-' + t.stage}>{t.stage}</span>
                {t.growth >= BREAKING_GROWTH && (
                  <span className="stage-pill st-breaking"><FaFire style={{ fontSize: 9 }} /> breaking</span>
                )}
                {t.relevance === 'critical' && (
                  <span className="stage-pill st-critical">act now</span>
                )}
              </div>

              <div className="topic-meta">
                <span>{t.volume} mentions</span>
                <span className={t.growth >= 0 ? 'up' : 'dn'}>
                  {t.growth >= 0 ? '+' : ''}{t.growth}% growth
                </span>
                <span>{t.demo}</span>
                <span className="ctags" style={{ display: 'inline-flex' }}>
                  {t.platforms.map((p) => (
                    <span className="tag tp" key={p}>{PLATFORM_NAME[p]}</span>
                  ))}
                </span>
              </div>

              <div style={{ margin: '10px 0 8px', maxWidth: 420 }}>
                <SentimentBar pos={t.sent.pos} neu={t.sent.neu} neg={t.sent.neg} showLabels />
              </div>

              <div className="topic-quote">{t.quote}</div>

              <div className="topic-action">
                <span className="topic-action-lbl">Recommended</span>
                {t.action}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* View 4 — Competitors                                                */
/* ------------------------------------------------------------------ */

function CompetitorCard({ c }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="comp-card">
      <div className="comp-head">
        <div className="comp-logo" style={{ background: c.color + '22', color: c.color }}>{c.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="comp-name">
            {c.name}
            <span className={'threat-pill th-' + c.threat}>{c.threat} threat</span>
          </div>
          <div className="comp-pos">{c.position}</div>
        </div>
      </div>

      <div className="comp-stats">
        <div>
          <div className="comp-stat-lbl">Share of voice</div>
          <div className="comp-stat-val">{c.sov}%</div>
          <Delta up={c.sovUp}>{c.sovCh} pts</Delta>
        </div>
        <div>
          <div className="comp-stat-lbl">Sentiment</div>
          <div className="comp-stat-val">{c.sentiment}</div>
          <Delta up={c.sentUp}>{c.sentCh}</Delta>
        </div>
        <div>
          <div className="comp-stat-lbl">Est. spend</div>
          <div className="comp-stat-val sm">{c.spend}</div>
        </div>
        <div>
          <div className="comp-stat-lbl">Cadence</div>
          <div className="comp-stat-val sm">{c.cadence}</div>
        </div>
      </div>

      <div className="comp-strategy">
        <div className="seg-label">Marketing strategy</div>
        <p>{c.strategy}</p>
        <div className="comp-sw">
          {c.strengths.map((s) => <span className="tag tg" key={s}>+ {s}</span>)}
          {c.weaknesses.map((s) => <span className="tag tr" key={s}>− {s}</span>)}
        </div>
      </div>

      <button className="comp-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? <FaChevronUp style={{ fontSize: 10 }} /> : <FaChevronDown style={{ fontSize: 10 }} />}
        {open ? 'Hide' : 'Show'} recent activity ({c.moves.length})
      </button>

      {open && (
        <div className="tl" style={{ marginTop: 14 }}>
          {c.moves.map((m, i) => (
            <div className={'tl-item tl-' + (m.impact === 'high' ? 'active' : 'upcoming')} key={i}>
              <div className="tl-marker">
                <span className="tl-dot" />
                {i < c.moves.length - 1 && <span className="tl-line" />}
              </div>
              <div className="tl-body">
                <div className="tl-top">
                  <span className="tl-date">{m.date}</span>
                  <span className={'tag ' + m.cls}>{m.type}</span>
                  <span className={'impact-pill im-' + m.impact}>{m.impact} impact</span>
                </div>
                <div className="tl-title">{m.title}</div>
                <div className="tl-detail">{m.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Competitors() {
  return (
    <div className="comp-grid">
      {COMPETITORS.map((c) => <CompetitorCard c={c} key={c.id} />)}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page shell                                                          */
/* ------------------------------------------------------------------ */

export default function DemographicAnalysis() {
  const [view, setView] = useState('pulse')
  const [timeframe, setTimeframe] = useState('30d')
  const [platform, setPlatform] = useState('all')

  // The two count KPIs are derived from the tracked data rather than stored,
  // so they stay true as topics and competitor moves are added.
  const kpis = useMemo(() => {
    const breaking = VIRAL_TOPICS.filter((t) => t.growth >= BREAKING_GROWTH).length
    const moves = COMPETITORS.reduce((n, c) => n + c.moves.length, 0)
    return PULSE_KPIS.map((k) => {
      if (k.id === 'topics') {
        return { ...k, v: String(VIRAL_TOPICS.length), ch: breaking + ' breaking this week' }
      }
      if (k.id === 'moves') {
        return { ...k, v: String(moves), note: 'Across ' + COMPETITORS.length + ' tracked competitors' }
      }
      return k
    })
  }, [])

  return (
    <div className="page">
      <div className="ph-row">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 4 }}>
            Demographic Analysis
          </h1>
          <p style={{ color: 'var(--t2)', fontSize: 14 }}>
            Industry sentiment, viral topics and competitor activity across {INDUSTRY.name.toLowerCase()}.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="sync-note"><FaRotate style={{ fontSize: 10 }} /> Updated {INDUSTRY.updated}</span>
          <select className="fsel" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            {TIMEFRAMES.map((t) => <option value={t.id} key={t.id}>{t.label}</option>)}
          </select>
          <select className="fsel" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="all">All platforms</option>
            {PLATFORMS.map((p) => <option value={p.id} key={p.id}>{p.name}</option>)}
          </select>
          <button className="btn btn-g btn-sm"><FaDownload /> Export</button>
        </div>
      </div>

      <div className="kpig">
        {kpis.map((k) => (
          <div className={'kpi ' + k.cls} key={k.l}>
            <div className="ml">{k.l}</div>
            <div className="mv">
              {k.v}{k.unit && <span className="mv-unit">{k.unit}</span>}
            </div>
            <div className={'mch ' + (k.up ? 'up' : 'dn')}>
              {k.up ? <FaArrowTrendUp style={{ fontSize: 10 }} /> : <FaArrowTrendDown style={{ fontSize: 10 }} />}
              {k.ch}
            </div>
            <div className="kpi-note">{k.note}</div>
          </div>
        ))}
      </div>

      <div className="cdet-nav" style={{ marginBottom: 20 }}>
        {VIEWS.map((v) => {
          const Icon = v.icon
          return (
            <button
              className={'cdet-nav-btn' + (view === v.id ? ' active' : '')}
              key={v.id}
              onClick={() => setView(v.id)}
            >
              <i><Icon /></i> {v.label}
            </button>
          )
        })}
      </div>

      {platform !== 'all' && view !== 'topics' && (
        <div className="filter-note">
          <FaCircleInfo style={{ fontSize: 11 }} />
          The platform filter applies to Viral Topics. This view shows all platforms.
        </div>
      )}

      {view === 'pulse' && <IndustryPulse timeframe={timeframe} />}
      {view === 'demographics' && <Demographics />}
      {view === 'topics' && <ViralTopics platform={platform} />}
      {view === 'competitors' && <Competitors />}
    </div>
  )
}
