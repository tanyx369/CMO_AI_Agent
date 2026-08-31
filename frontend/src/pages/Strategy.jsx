import { useMemo, useState } from 'react'
import {
  FaPlus, FaStar, FaComments, FaBox, FaArrowRight, FaGlobe, FaStore,
  FaChessKnight, FaCircleInfo,
} from 'react-icons/fa6'
import { CAMPAIGNS } from '../data'
import { PILLARS, campaignMix } from '../strategyData'
import { CampaignChip } from '../components/CampaignLinks'
import StrategyModal from '../components/StrategyModal'

const PILLAR_ICON = { star: FaStar, voice: FaComments, box: FaBox }

/**
 * Strategy index.
 *
 * Strategies sit above campaigns: each one is an intent that several campaigns
 * — often a mix of physical and online — serve together. Every card shows the
 * campaigns behind it, so campaign management is one click away from here.
 */
export default function Strategy({
  strategies: all,
  onCreateStrategy,
  onOpenStrategy,
  onOpenCampaign,
  onOpenCampaigns,
}) {
  const [pillar, setPillar] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)

  const strategies = useMemo(
    () => (pillar === 'all' ? all : all.filter((s) => s.pillar === pillar)),
    [pillar, all],
  )

  const counts = useMemo(() => {
    const c = { all: all.length }
    PILLARS.forEach((p) => { c[p.id] = all.filter((s) => s.pillar === p.id).length })
    return c
  }, [all])

  function handleCreate(draft) {
    onCreateStrategy(draft)
    setModalOpen(false)
    setPillar('all')
  }

  return (
    <div className="page">
      <div className="ph-row">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 4 }}>Strategy</h1>
          <p style={{ color: 'var(--t2)', fontSize: 14 }}>
            The plan above the campaigns — what the company is trying to become, and which campaigns get it there.
          </p>
        </div>
        <button className="btn btn-p" onClick={() => setModalOpen(true)}><FaPlus /> New Strategy</button>
      </div>

      <div className="strat-explain">
        <FaCircleInfo style={{ flexShrink: 0, marginTop: 2, color: 'var(--accent)' }} />
        <span>
          A <strong>campaign</strong> is one execution you build and monitor. A <strong>strategy</strong> is the
          intent several campaigns serve together — it carries the reputation goal, the brand voice everything
          must sound like, and the product positioning. Open any strategy to see and manage its campaigns.
        </span>
      </div>

      {/* Pillars — the three things a strategy can be built to achieve */}
      <div className="pillar-row">
        <button
          className={'pillar-card pillar-all' + (pillar === 'all' ? ' active' : '')}
          onClick={() => setPillar('all')}
        >
          <span className="pillar-ico"><FaChessKnight /></span>
          <span className="pillar-name">All strategies</span>
          <span className="pillar-blurb">Everything in flight across the three goals.</span>
          <span className="pillar-count">{counts.all}</span>
        </button>

        {PILLARS.map((p) => {
          const Icon = PILLAR_ICON[p.icon]
          return (
            <button
              key={p.id}
              className={'pillar-card ' + p.cls + (pillar === p.id ? ' active' : '')}
              onClick={() => setPillar(p.id)}
            >
              <span className="pillar-ico"><Icon /></span>
              <span className="pillar-name">{p.label}</span>
              <span className="pillar-blurb">{p.blurb}</span>
              <span className="pillar-count">{counts[p.id]}</span>
            </button>
          )
        })}
      </div>

      <div className="strat-grid">
        {strategies.map((s) => {
          const mix = campaignMix(s, CAMPAIGNS)
          const pillarMeta = PILLARS.find((p) => p.id === s.pillar)
          return (
            <div className={'strat-card ' + pillarMeta.cls} key={s.id}>
              <div className="strat-head">
                <span className="strat-emoji">{s.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="strat-name">{s.name}</div>
                  <div className="strat-sub">
                    <span className={'pillar-tag ' + pillarMeta.cls}>{pillarMeta.short}</span>
                    <span>{s.timeframe}</span>
                  </div>
                </div>
                <span className={'tag ' + (s.status === 'Active' ? 'tg' : s.status === 'Draft' ? 'ta' : 'tp')}>
                  {s.status}
                </span>
              </div>

              <p className="strat-objective">{s.objective}</p>

              <div className="strat-progress">
                <div className="strat-progress-top">
                  <span>Progress to target</span>
                  <strong>{s.progress}%</strong>
                </div>
                <div className="pbar"><div className="pfill" style={{ width: s.progress + '%' }} /></div>
              </div>

              {/* Campaigns behind this strategy — always visible, always linked */}
              <div className="strat-camps">
                <div className="strat-camps-hd">
                  <span>
                    {mix.total} campaign{mix.total === 1 ? '' : 's'}
                    {mix.total > 0 && (
                      <span className="strat-mix">
                        {mix.online > 0 && <span><FaGlobe style={{ fontSize: 9 }} /> {mix.online} online</span>}
                        {mix.physical > 0 && <span><FaStore style={{ fontSize: 9 }} /> {mix.physical} physical</span>}
                      </span>
                    )}
                  </span>
                </div>
                {mix.total > 0 ? (
                  <div className="camp-chips">
                    {mix.linked.map((c) => (
                      <CampaignChip campaign={c} onOpen={onOpenCampaign} key={c.id} />
                    ))}
                  </div>
                ) : (
                  <div className="camp-links-empty">No campaigns linked yet.</div>
                )}
              </div>

              <div className="strat-foot">
                <button className="btn btn-p btn-sm" onClick={() => onOpenStrategy(s.id)}>
                  Open strategy <FaArrowRight style={{ fontSize: 10 }} />
                </button>
                <button className="btn btn-g btn-sm" onClick={onOpenCampaigns}>
                  Campaign management
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {modalOpen && (
        <StrategyModal onClose={() => setModalOpen(false)} onCreate={handleCreate} />
      )}
    </div>
  )
}
