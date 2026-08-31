import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FaWandMagicSparkles, FaPaperPlane, FaCheck, FaFlagCheckered,
  FaCircleNotch, FaBullseye, FaUsers, FaCalendarDays, FaCoins,
  FaListCheck, FaRoute, FaArrowRotateLeft, FaAlignLeft, FaImage,
  FaVideo, FaMusic, FaClipboardList, FaLightbulb,
} from 'react-icons/fa6'
import {
  CAMPAIGN_PLANS, GENERATED_PLAN, PLANNER_REPLIES, PLANNER_PROMPTS,
  PLANNER_GREETING, PLANNER_GREETING_EMPTY, ASSET_TYPES, ASSET_ORDER,
} from '../planData'

const ASSET_ICON = { text: FaAlignLeft, image: FaImage, video: FaVideo, audio: FaMusic }

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** "2 posters" / "1 video" — pluralised label for an asset count. */
function assetLabel(type, n) {
  const meta = ASSET_TYPES[type]
  return n + ' ' + (n === 1 ? meta.one : meta.many)
}

/** Sum asset counts across a list of deliverables. */
function sumAssets(deliverables) {
  const total = {}
  deliverables.forEach((d) => {
    Object.entries(d.assets || {}).forEach(([k, v]) => {
      total[k] = (total[k] || 0) + v
    })
  })
  return total
}

/** Total number of individual pieces of content in an assets object. */
function assetCount(assets) {
  return Object.values(assets || {}).reduce((a, b) => a + b, 0)
}

/** Row of small chips: "3 text · 3 posters · 2 videos". */
function AssetChips({ assets, muted }) {
  const entries = ASSET_ORDER.filter((t) => assets && assets[t])
  if (!entries.length) return null
  return (
    <span className={'asset-chips' + (muted ? ' muted' : '')}>
      {entries.map((t) => {
        const Icon = ASSET_ICON[t]
        return (
          <span className={'asset-chip ac-' + t} key={t}>
            <Icon style={{ fontSize: 9 }} /> {assetLabel(t, assets[t])}
          </span>
        )
      })}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* 1. Phase progression — horizontal stepper                           */
/* ------------------------------------------------------------------ */

function PhaseStepper({ phases }) {
  const active = phases.find((p) => p.status === 'active')
  const allDone = phases.every((p) => p.progress === 100)
  const overall = Math.round(phases.reduce((s, p) => s + p.progress, 0) / phases.length)

  return (
    <div className="det-sec">
      <div className="det-sec-title" style={{ justifyContent: 'space-between' }}>
        <span><FaRoute /> Phase Progression</span>
        <span className="det-sec-note">
          {active ? `Currently in ${active.name}` : allDone ? 'All phases complete' : 'Not started'}
          {' · '}{overall}% overall
        </span>
      </div>

      <div className="phase-track">
        {phases.map((p, i) => (
          <div className={'phase-step ph-' + p.status} key={p.name}>
            <div className="phase-connector" aria-hidden="true">
              <span className="phase-dot">
                {p.progress === 100 ? <FaCheck style={{ fontSize: 9 }} />
                  : p.status === 'active' ? <FaCircleNotch style={{ fontSize: 9 }} />
                    : i + 1}
              </span>
              {i < phases.length - 1 && <span className="phase-line" />}
            </div>
            <div className="phase-name">{p.name}</div>
            <div className="phase-dates">{p.dates}</div>
            <div className="pbar" style={{ marginTop: 8 }}>
              <div className="pfill" style={{ width: p.progress + '%' }} />
            </div>
            <div className="phase-pct">
              {p.progress}% · {p.doneCount}/{p.total} items
            </div>
            <div className="phase-goal">{p.goal}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Campaign brief — objective, audience, duration, targets          */
/* ------------------------------------------------------------------ */

function CampaignBrief({ plan }) {
  const facts = [
    { icon: FaBullseye, label: 'Objective', body: plan.objective },
    { icon: FaUsers, label: 'Target audience', body: plan.audience },
    { icon: FaCalendarDays, label: 'Duration', body: plan.duration },
  ]

  return (
    <div className="det-sec" style={{ marginBottom: 0 }}>
      <div className="det-sec-title"><FaClipboardList /> Campaign Brief</div>

      <div className="brief-facts">
        {facts.map((f) => {
          const Icon = f.icon
          return (
            <div className="brief-fact" key={f.label}>
              <span className="plan-fact-ico"><Icon /></span>
              <div>
                <div className="plan-fact-label">{f.label}</div>
                <div className="plan-fact-body">{f.body}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="dvd" style={{ margin: '18px 0 16px' }} />

      <div className="plan-sub">Targets</div>
      <div className="plan-kpis brief-kpis">
        {plan.kpiTargets.map((k) => (
          <div className="plan-kpi" key={k.l}>
            <div className="plan-kpi-v">{k.v}</div>
            <div className="plan-kpi-l">{k.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Budget split                                                     */
/* ------------------------------------------------------------------ */

function BudgetSplit({ plan }) {
  return (
    <div className="det-sec" style={{ marginBottom: 0 }}>
      <div className="det-sec-title"><FaCoins /> Budget Split</div>
      {plan.budgetSplit.map((b) => (
        <div className="budget-row" key={b.ch}>
          <span className={'tag ' + b.cls} style={{ minWidth: 78, textAlign: 'center' }}>{b.ch}</span>
          <div className="budget-bar"><div className="budget-fill" style={{ width: b.pct + '%' }} /></div>
          <span className="budget-pct">{b.pct}%</span>
          <span className="budget-amt">{b.amt}</span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Content requirements summary                                     */
/* ------------------------------------------------------------------ */

function ContentRequirements({ phases }) {
  const all = phases.flatMap((p) => p.deliverables)
  const required = sumAssets(all)
  const produced = sumAssets(all.filter((d) => d.done))
  const totalPieces = assetCount(required)
  const donePieces = assetCount(produced)

  return (
    <div className="det-sec" style={{ marginBottom: 0 }}>
      <div className="det-sec-title" style={{ justifyContent: 'space-between' }}>
        <span><FaListCheck /> Content Requirements</span>
        <span className="det-sec-note">{donePieces} of {totalPieces} pieces ready</span>
      </div>
      <div className="req-grid">
        {ASSET_ORDER.filter((t) => required[t]).map((t) => {
          const Icon = ASSET_ICON[t]
          const need = required[t]
          const have = produced[t] || 0
          return (
            <div className="req-card" key={t}>
              <div className={'req-ico ac-' + t}><Icon /></div>
              <div className="req-count">{have}<span className="req-of">/{need}</span></div>
              <div className="req-label">{ASSET_TYPES[t].many}</div>
              <div className="pbar" style={{ marginTop: 8 }}>
                <div className="pfill" style={{ width: (need ? (have / need) * 100 : 0) + '%' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5. Deliverables checklist                                           */
/* ------------------------------------------------------------------ */

function Deliverables({ phases, onToggle }) {
  const total = phases.reduce((n, p) => n + p.total, 0)
  const done = phases.reduce((n, p) => n + p.doneCount, 0)

  return (
    <div className="det-sec" style={{ marginBottom: 0 }}>
      <div className="det-sec-title" style={{ justifyContent: 'space-between' }}>
        <span><FaListCheck /> Deliverables Checklist</span>
        <span className="det-sec-note">{done} of {total} complete</span>
      </div>

      {phases.map((p) => {
        const need = sumAssets(p.deliverables)
        return (
          <div className="deliv-block" key={p.name}>
            <div className="deliv-head">
              <span className={'phase-chip ph-' + p.status}>{p.name}</span>
              <span className="deliv-dates">{p.dates}</span>
              <span className="deliv-count">{p.doneCount}/{p.total} done</span>
            </div>
            <div className="deliv-need">
              Needs: <AssetChips assets={need} muted />
            </div>

            {p.deliverables.map((d) => (
              <label className={'check-row' + (d.done ? ' checked' : '')} key={d.id}>
                <input type="checkbox" checked={d.done} onChange={() => onToggle(d.id)} />
                <span className="check-box" aria-hidden="true">
                  {d.done && <FaCheck style={{ fontSize: 9 }} />}
                </span>
                <span className="check-body">
                  <span className="check-label">{d.label}</span>
                  <AssetChips assets={d.assets} />
                </span>
              </label>
            ))}
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Timeline                                                         */
/* ------------------------------------------------------------------ */

function Timeline({ milestones }) {
  return (
    <div className="det-sec" style={{ marginBottom: 0 }}>
      <div className="det-sec-title"><FaFlagCheckered /> Timeline</div>
      <div className="tl">
        {milestones.map((m, i) => (
          <div className={'tl-item tl-' + m.status} key={i}>
            <div className="tl-marker">
              <span className="tl-dot">
                {m.status === 'done' && <FaCheck style={{ fontSize: 8 }} />}
              </span>
              {i < milestones.length - 1 && <span className="tl-line" />}
            </div>
            <div className="tl-body">
              <div className="tl-top">
                <span className="tl-date">{m.date}</span>
                {m.status === 'active' && <span className="status-pill sp-pending">In progress</span>}
              </div>
              <div className="tl-title">{m.title}</div>
              <div className="tl-detail">{m.detail}</div>
              {assetCount(m.assets) > 0 && (
                <div className="tl-assets">
                  <span className="tl-assets-label">Content due:</span>
                  <AssetChips assets={m.assets} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Campaign Plan view                                                  */
/* ------------------------------------------------------------------ */

function PlanView({ plan, phases, generating, onToggle }) {
  if (!plan) {
    return (
      <>
        <div className="det-sec">
          <div className="det-sec-title"><FaRoute /> Phase Progression</div>
          <div className="empty-state" style={{ border: 'none', padding: '26px 16px' }}>
            {generating
              ? <><span className="gen-spinner" /> Drafting phases and timeline…</>
              : 'No plan yet — open the AI Planner tab to generate one.'}
          </div>
        </div>
        <div className="det-sec" style={{ marginBottom: 0 }}>
          <div className="det-sec-title"><FaListCheck /> Complete Plan &amp; Timeline</div>
          <div className="empty-state" style={{ border: 'none', padding: '32px 16px' }}>
            {generating
              ? <><span className="gen-spinner" /> Building the plan…</>
              : 'Once a plan is generated, the brief, budget split, deliverables checklist and timeline appear here.'}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PhaseStepper phases={phases} />

      <div className="g21 plan-row">
        <CampaignBrief plan={plan} />
        <BudgetSplit plan={plan} />
      </div>

      <div className="plan-row">
        <ContentRequirements phases={phases} />
      </div>

      <div className="g21 plan-row plan-row-last">
        <Deliverables phases={phases} onToggle={onToggle} />
        <Timeline milestones={plan.milestones} />
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* AI Planner view                                                     */
/* ------------------------------------------------------------------ */

function PlannerView({ plan, phases, generating, onGenerate, chat }) {
  const { messages, typing, input, setInput, send, scrollRef } = chat

  function keyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  // Snapshot of what the planner is currently working on
  const totals = useMemo(() => {
    if (!plan) return null
    const all = phases.flatMap((p) => p.deliverables)
    const pieces = assetCount(sumAssets(all))
    const ready = assetCount(sumAssets(all.filter((d) => d.done)))
    return {
      phases: phases.length,
      items: all.length,
      done: all.filter((d) => d.done).length,
      pieces,
      ready,
    }
  }, [plan, phases])

  return (
    <div className="planner-layout">
      <div className="det-sec planner-main">
        <div className="det-sec-title" style={{ justifyContent: 'space-between' }}>
          <span><FaWandMagicSparkles /> Plan with AI</span>
          <span className="det-sec-note">
            {plan ? 'Refining the current plan' : 'No plan yet — ask for one to get started'}
          </span>
        </div>

        <div className="planner-msgs" ref={scrollRef}>
          {messages.map((m, i) => (
            <div className={'msg ' + m.role} key={i}>
              <div className={'mav ' + (m.role === 'ai' ? 'aiav' : 'usav')}>{m.role === 'ai' ? 'AI' : 'SC'}</div>
              <div className="mbub">{m.text}</div>
            </div>
          ))}
          {typing && (
            <div className="msg ai">
              <div className="mav aiav">AI</div>
              <div className="mbub">
                <div className="typing"><div className="dot" /><div className="dot" /><div className="dot" /></div>
              </div>
            </div>
          )}
        </div>

        <div className="cinput-row planner-input">
          <textarea
            className="cinput"
            rows={1}
            placeholder="Ask the AI to adjust the plan…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={keyDown}
          />
          <button className="btn btn-p" onClick={() => send()} aria-label="Send">
            <FaPaperPlane />
          </button>
        </div>
      </div>

      <div className="planner-rail">
        <div className="det-sec" style={{ marginBottom: 0 }}>
          <div className="det-sec-title">
            {plan ? <><FaRoute /> Current Plan</> : <><FaWandMagicSparkles /> Generate</>}
          </div>

          {totals ? (
            <div className="rail-stats">
              <div className="rail-stat">
                <span className="rail-stat-v">{totals.phases}</span>
                <span className="rail-stat-l">Phases</span>
              </div>
              <div className="rail-stat">
                <span className="rail-stat-v">{totals.done}<span className="rail-of">/{totals.items}</span></span>
                <span className="rail-stat-l">Deliverables</span>
              </div>
              <div className="rail-stat">
                <span className="rail-stat-v">{totals.ready}<span className="rail-of">/{totals.pieces}</span></span>
                <span className="rail-stat-l">Content pieces</span>
              </div>
            </div>
          ) : (
            <p className="rail-empty">
              Generate a full plan — phases, deliverables, budget split and timeline — then refine it in the chat.
            </p>
          )}

          <button
            className={'btn btn-sm rail-gen ' + (plan ? 'btn-g' : 'btn-p')}
            onClick={onGenerate}
            disabled={generating}
          >
            {generating
              ? <><span className="gen-spinner" style={{ width: 12, height: 12 }} /> Working…</>
              : plan
                ? <><FaArrowRotateLeft /> Regenerate plan</>
                : <><FaWandMagicSparkles /> Generate plan</>}
          </button>
          {plan && (
            <div className="rail-warn">Regenerating replaces the current plan and resets the checklist.</div>
          )}
        </div>

        <div className="det-sec" style={{ marginBottom: 0 }}>
          <div className="det-sec-title"><FaLightbulb /> Suggested Prompts</div>
          <div className="rail-prompts">
            {PLANNER_PROMPTS.map((p) => (
              <button className="qab" key={p} onClick={() => send(p)}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Shell — owns the state both views share                             */
/* ------------------------------------------------------------------ */

export default function CampaignPlan({ campaignId, view = 'plan' }) {
  // Initialised synchronously so the planner greeting reflects whether a plan
  // already exists on the very first render.
  const [plan, setPlan] = useState(() => CAMPAIGN_PLANS[campaignId] || null)
  // Checklist state lives here so ticking an item re-derives phase progress.
  const [checked, setChecked] = useState(() => initChecked(CAMPAIGN_PLANS[campaignId]))
  const [generating, setGenerating] = useState(false)

  // Chat state also lives here, so switching tabs never loses the thread.
  const [messages, setMessages] = useState(() => [
    { role: 'ai', text: CAMPAIGN_PLANS[campaignId] ? PLANNER_GREETING : PLANNER_GREETING_EMPTY },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  const replyIdx = useRef(0)
  const scrollRef = useRef(null)
  const timerRef = useRef(null)
  const chatTimerRef = useRef(null)

  function initChecked(p) {
    const map = {}
    if (p) p.phases.forEach((ph) => ph.deliverables.forEach((d) => { map[d.id] = d.done }))
    return map
  }

  // Reload when the user switches to a different campaign
  useEffect(() => {
    const next = CAMPAIGN_PLANS[campaignId] || null
    setPlan(next)
    setChecked(initChecked(next))
    setGenerating(false)
    setMessages([{ role: 'ai', text: next ? PLANNER_GREETING : PLANNER_GREETING_EMPTY }])
    setInput('')
    setTyping(false)
    replyIdx.current = 0
    return () => {
      clearTimeout(timerRef.current)
      clearTimeout(chatTimerRef.current)
    }
  }, [campaignId])

  // Keep the transcript pinned to the newest message
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, typing, view])

  function send(text) {
    const msg = (text ?? input).trim()
    if (!msg) return
    setMessages((m) => [...m, { role: 'user', text: msg }])
    setInput('')
    setTyping(true)
    clearTimeout(chatTimerRef.current)
    chatTimerRef.current = setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { role: 'ai', text: PLANNER_REPLIES[replyIdx.current % PLANNER_REPLIES.length] }])
      replyIdx.current += 1
    }, 1400)
  }

  function toggle(id) {
    setChecked((c) => ({ ...c, [id]: !c[id] }))
  }

  function generate() {
    setGenerating(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const next = CAMPAIGN_PLANS[campaignId] || GENERATED_PLAN
      setPlan(next)
      setChecked(initChecked(next))
      setGenerating(false)
    }, 2200)
  }

  // Phases with live completion derived from the checklist
  const phases = useMemo(() => {
    if (!plan) return []
    return plan.phases.map((p) => {
      const deliverables = p.deliverables.map((d) => ({ ...d, done: !!checked[d.id] }))
      const doneCount = deliverables.filter((d) => d.done).length
      return {
        ...p,
        deliverables,
        doneCount,
        total: deliverables.length,
        progress: deliverables.length ? Math.round((doneCount / deliverables.length) * 100) : 0,
      }
    })
  }, [plan, checked])

  if (view === 'planner') {
    return (
      <PlannerView
        plan={plan}
        phases={phases}
        generating={generating}
        onGenerate={generate}
        chat={{ messages, typing, input, setInput, send, scrollRef }}
      />
    )
  }

  return <PlanView plan={plan} phases={phases} generating={generating} onToggle={toggle} />
}
