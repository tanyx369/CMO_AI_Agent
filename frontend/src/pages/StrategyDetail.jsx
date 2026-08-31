import { useEffect, useState } from 'react'
import {
  FaArrowLeft, FaBullseye, FaComments, FaRocket, FaRoute, FaLightbulb,
  FaCheck, FaCircleNotch, FaGlobe, FaStore, FaThumbsUp, FaBan, FaTag,
} from 'react-icons/fa6'
import { CAMPAIGNS } from '../data'
import { PILLARS, campaignMix } from '../strategyData'
import CampaignLinks from '../components/CampaignLinks'

const TABS = [
  { id: 'overview', label: 'Overview', icon: FaBullseye },
  { id: 'voice', label: 'Brand Voice & Positioning', icon: FaComments },
  { id: 'campaigns', label: 'Campaign Mix', icon: FaRocket },
  { id: 'roadmap', label: 'Roadmap', icon: FaRoute },
]

/* ------------------------------------------------------------------ */

function Overview({ strategy, mix, onOpenCampaign, onOpenCampaigns }) {
  return (
    <>
      <div className="det-sec">
        <div className="det-sec-title"><FaBullseye /> Objective</div>
        <p className="strat-lead">{strategy.objective}</p>

        <div className="strat-facts">
          <div>
            <div className="plan-fact-label">Why now</div>
            <div className="plan-fact-body">{strategy.why}</div>
          </div>
          <div>
            <div className="plan-fact-label">Target outcome</div>
            <div className="plan-fact-body">{strategy.targetOutcome}</div>
          </div>
        </div>
      </div>

      <div className="det-sec">
        <div className="det-sec-title" style={{ justifyContent: 'space-between' }}>
          <span><FaBullseye /> Measures of Success</span>
          <span className="det-sec-note">{strategy.progress}% to target overall</span>
        </div>
        <div className="skpi-grid">
          {strategy.kpis.map((k) => (
            <div className="skpi" key={k.l}>
              <div className="skpi-l">{k.l}</div>
              <div className="skpi-v">
                {k.now}<span className="skpi-target">→ {k.target}</span>
              </div>
              <div className="pbar" style={{ marginTop: 9 }}>
                <div className="pfill" style={{ width: Math.min(100, k.progress) + '%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns are reachable from the overview too, not only their own tab */}
      <div className="det-sec" style={{ marginBottom: 0 }}>
        <CampaignLinks
          ids={strategy.campaignIds}
          onOpenCampaign={onOpenCampaign}
          onOpenCampaigns={onOpenCampaigns}
          title={`Campaigns delivering this strategy (${mix.total})`}
        />
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */

function Voice({ strategy, onOpenCampaign, onOpenCampaigns }) {
  const { voice } = strategy
  return (
    <>
      <div className="det-sec">
        <div className="det-sec-title"><FaComments /> Voice Pillars</div>
        <div className="voice-grid">
          {voice.pillars.map((p, i) => (
            <div className="voice-card" key={p.t}>
              <div className="voice-n">{i + 1}</div>
              <div className="voice-t">{p.t}</div>
              <div className="voice-d">{p.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="det-sec">
        <div className="det-sec-title"><FaComments /> Tone Rules</div>
        <div className="g2 tone-grid">
          <div>
            <div className="ai-col-title ai-good"><FaThumbsUp /> Do</div>
            <ul className="tone-list tone-do">
              {voice.tone.does.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </div>
          <div>
            <div className="ai-col-title ai-bad"><FaBan /> Don&apos;t</div>
            <ul className="tone-list tone-dont">
              {voice.tone.donts.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="det-sec">
        <div className="det-sec-title"><FaTag /> Product Positioning</div>
        {voice.positioning.map((p) => (
          <div className="pos-row" key={p.product}>
            <div className="pos-product">{p.product}</div>
            <div className="pos-line">“{p.line}”</div>
          </div>
        ))}
      </div>

      <div className="det-sec" style={{ marginBottom: 0 }}>
        <CampaignLinks
          ids={strategy.campaignIds}
          onOpenCampaign={onOpenCampaign}
          onOpenCampaigns={onOpenCampaigns}
          title="Campaigns this voice applies to"
          compact
        />
        <div className="camp-links-note">
          Every asset in these campaigns should be traceable to one of the pillars above.
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */

function Mix({ strategy, mix, onOpenCampaign, onOpenCampaigns }) {
  return (
    <>
      <div className="det-sec">
        <div className="det-sec-title" style={{ justifyContent: 'space-between' }}>
          <span><FaRocket /> Campaign Mix</span>
          <span className="det-sec-note">
            {mix.online} online · {mix.physical} physical
          </span>
        </div>

        <p className="strat-lead" style={{ marginBottom: 18 }}>
          A strategy works through several campaigns at once. These run under
          <strong> {strategy.name}</strong> — open any of them to plan, generate and monitor its content
          in campaign management.
        </p>

        <div className="mix-split">
          <div className="mix-stat">
            <span className="mix-ico mix-online"><FaGlobe /></span>
            <div>
              <div className="mix-v">{mix.online}</div>
              <div className="mix-l">Online campaigns</div>
            </div>
          </div>
          <div className="mix-stat">
            <span className="mix-ico mix-physical"><FaStore /></span>
            <div>
              <div className="mix-v">{mix.physical}</div>
              <div className="mix-l">Physical activations</div>
            </div>
          </div>
        </div>

        <CampaignLinks
          ids={strategy.campaignIds}
          onOpenCampaign={onOpenCampaign}
          onOpenCampaigns={onOpenCampaigns}
        />
      </div>

      <div className="det-sec" style={{ marginBottom: 0 }}>
        <div className="det-sec-title"><FaLightbulb /> Strategic Advice</div>
        {strategy.advice.length === 0 ? (
          <div className="camp-links-empty">
            No advice yet — it appears once the strategy has campaigns running.
          </div>
        ) : (
        <div className="ai-actions">
          {strategy.advice.map((a, i) => (
            <div className="ai-action" key={a.t}>
              <span className="ai-action-n">{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div className="ai-item-title">
                  {a.t}
                  <span className={'ai-pri pri-' + a.p}>{a.p}</span>
                </div>
                <div className="ai-item-body">{a.d}</div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */

function Roadmap({ strategy, onOpenCampaign, onOpenCampaigns }) {
  return (
    <div className="det-sec" style={{ marginBottom: 0 }}>
      <div className="det-sec-title" style={{ justifyContent: 'space-between' }}>
        <span><FaRoute /> Roadmap</span>
        <span className="det-sec-note">{strategy.timeframe}</span>
      </div>

      {strategy.phases.length === 0 && (
        <div className="camp-links-empty" style={{ marginBottom: 14 }}>
          No phases planned yet.
        </div>
      )}

      <div className="tl">
        {strategy.phases.map((p, i) => (
          <div className={'tl-item tl-' + p.status} key={p.name}>
            <div className="tl-marker">
              <span className="tl-dot">
                {p.status === 'done' ? <FaCheck style={{ fontSize: 8 }} />
                  : p.status === 'active' ? <FaCircleNotch style={{ fontSize: 8 }} /> : null}
              </span>
              {i < strategy.phases.length - 1 && <span className="tl-line" />}
            </div>
            <div className="tl-body">
              <div className="tl-top">
                <span className="tl-date">{p.dates}</span>
                {p.status === 'active' && <span className="status-pill sp-pending">In progress</span>}
              </div>
              <div className="tl-title">{p.name}</div>
              <div className="tl-detail">{p.goal}</div>

              {/* Each phase links straight to the campaigns that deliver it */}
              <div className="phase-camps">
                <CampaignLinks
                  ids={p.campaignIds}
                  onOpenCampaign={onOpenCampaign}
                  emptyNote="No campaigns created for this phase yet."
                  compact
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="camp-links-hd" style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <span className="camp-links-title"><FaRocket /> All campaigns in this strategy</span>
        <button className="camp-links-all" onClick={onOpenCampaigns}>
          Open campaign management →
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

export default function StrategyDetail({
  strategies,
  strategyId,
  onBack,
  onOpenCampaign,
  onOpenCampaigns,
}) {
  // Looked up in the passed list so strategies created this session resolve too.
  const strategy = strategies.find((s) => s.id === strategyId) || strategies[0]
  const [tab, setTab] = useState('overview')
  const pillar = PILLARS.find((p) => p.id === strategy.pillar)
  const mix = campaignMix(strategy, CAMPAIGNS)

  useEffect(() => { setTab('overview') }, [strategyId])

  const shared = {
    strategy,
    mix,
    onOpenCampaign,
    onOpenCampaigns,
  }

  return (
    <div className="page" style={{ padding: 0 }}>
      <div className={'strat-hero ' + pillar.cls}>
        <div style={{ padding: '20px 36px 22px' }}>
          <button className="back-btn" onClick={onBack} style={{ marginBottom: 10 }}>
            <FaArrowLeft /> Back to strategies
          </button>
          <div className="strat-hero-row">
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', color: '#fff' }}>
              {strategy.emoji} {strategy.name}
            </div>
            <span className="strat-hero-pillar">{pillar.label}</span>
          </div>
          <div className="strat-hero-meta">
            {strategy.timeframe} · {strategy.status} · Owner {strategy.owner} · {mix.total} campaigns
          </div>
        </div>
      </div>

      <div style={{ padding: '0 36px 36px' }}>
        <div className="cdet-nav" style={{ marginTop: 4 }}>
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                className={'cdet-nav-btn' + (tab === t.id ? ' active' : '')}
                onClick={() => setTab(t.id)}
              >
                <Icon /> {t.label}
                {t.id === 'campaigns' && mix.total > 0 && (
                  <span className="nav-count">{mix.total}</span>
                )}
              </button>
            )
          })}
        </div>

        {tab === 'overview' && <Overview {...shared} />}
        {tab === 'voice' && <Voice {...shared} />}
        {tab === 'campaigns' && <Mix {...shared} />}
        {tab === 'roadmap' && <Roadmap {...shared} />}
      </div>
    </div>
  )
}
