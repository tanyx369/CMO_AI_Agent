import { useMemo, useState } from 'react'
import {
  FaXmark, FaStar, FaComments, FaBox, FaPlus, FaTrash, FaCheck,
  FaArrowLeft, FaArrowRight, FaGlobe, FaStore, FaThumbsUp, FaBan,
  FaCircleInfo, FaWandMagicSparkles,
} from 'react-icons/fa6'
import { CAMPAIGNS } from '../data'
import { PILLARS } from '../strategyData'

const PILLAR_ICON = { star: FaStar, voice: FaComments, box: FaBox }

const STEPS = [
  { id: 'goal', label: 'Goal' },
  { id: 'objective', label: 'Objective' },
  { id: 'voice', label: 'Brand voice' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'review', label: 'Review' },
]

const EMOJI_CHOICES = ['🎯', '🗣️', '⌚', '🔁', '🚀', '📣', '🏆', '🧭', '💡', '📈']

const blank = () => ({
  name: '',
  emoji: '🎯',
  pillar: 'reputation',
  status: 'Draft',
  timeframe: '',
  owner: 'Sarah Chen',
  objective: '',
  why: '',
  targetOutcome: '',
  kpis: [{ l: '', now: '', target: '' }],
  voicePillars: [{ t: '', d: '' }],
  does: [''],
  donts: [''],
  positioning: [{ product: 'Smart Watch Series 5', line: '' }],
  campaignIds: [],
})

/** Small helper for the repeated add/remove list rows. */
function useList(value, onChange) {
  return {
    update: (i, patch) => onChange(value.map((v, j) => (j === i ? { ...v, ...patch } : v))),
    updateAt: (i, next) => onChange(value.map((v, j) => (j === i ? next : v))),
    add: (item) => onChange([...value, item]),
    remove: (i) => onChange(value.filter((_, j) => j !== i)),
  }
}

/* ------------------------------------------------------------------ */

export default function StrategyModal({ onClose, onCreate }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(blank)
  const [touched, setTouched] = useState(false)

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const kpis = useList(form.kpis, (v) => set({ kpis: v }))
  const vp = useList(form.voicePillars, (v) => set({ voicePillars: v }))
  const dos = useList(form.does, (v) => set({ does: v }))
  const donts = useList(form.donts, (v) => set({ donts: v }))
  const pos = useList(form.positioning, (v) => set({ positioning: v }))

  const linked = useMemo(
    () => CAMPAIGNS.filter((c) => form.campaignIds.includes(c.id)),
    [form.campaignIds],
  )
  const mix = {
    online: linked.filter((c) => c.category === 'online').length,
    physical: linked.filter((c) => c.category === 'physical').length,
  }

  // Only the first two steps have anything genuinely required.
  const errors = {
    0: !form.name.trim() ? 'Give the strategy a name.' : null,
    1: !form.objective.trim() ? 'Describe what this strategy is trying to achieve.' : null,
  }
  const stepError = errors[step] || null

  function next() {
    if (stepError) { setTouched(true); return }
    setTouched(false)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  function back() {
    setTouched(false)
    setStep((s) => Math.max(s - 1, 0))
  }
  function goTo(i) {
    // Allow jumping back freely, forward only if the current step is valid.
    if (i <= step || !stepError) { setTouched(false); setStep(i) }
    else setTouched(true)
  }

  function toggleCampaign(id) {
    set({
      campaignIds: form.campaignIds.includes(id)
        ? form.campaignIds.filter((x) => x !== id)
        : [...form.campaignIds, id],
    })
  }

  function submit() {
    if (errors[0] || errors[1]) { setStep(errors[0] ? 0 : 1); setTouched(true); return }
    // Strip the empty rows people leave behind in the repeatable lists.
    onCreate({
      ...form,
      kpis: form.kpis.filter((k) => k.l.trim()),
      voicePillars: form.voicePillars.filter((p) => p.t.trim()),
      does: form.does.filter((d) => d.trim()),
      donts: form.donts.filter((d) => d.trim()),
      positioning: form.positioning.filter((p) => p.line.trim()),
    })
  }

  const pillarMeta = PILLARS.find((p) => p.id === form.pillar)

  return (
    <div className="mo" onClick={(e) => { if (e.target.classList.contains('mo')) onClose() }}>
      <div className="modal strat-modal">
        <div className="sm-head">
          <div>
            <h2>New Strategy</h2>
            <p style={{ marginBottom: 0 }}>
              A strategy groups several campaigns behind one goal. You can leave anything blank and fill it in later.
            </p>
          </div>
          <button className="btn btn-g btn-ic btn-sm" onClick={onClose} aria-label="Close"><FaXmark /></button>
        </div>

        {/* Step rail */}
        <div className="sm-steps">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              className={'sm-step' + (i === step ? ' active' : '') + (i < step ? ' done' : '')}
              onClick={() => goTo(i)}
              type="button"
            >
              <span className="sm-step-n">{i < step ? <FaCheck style={{ fontSize: 9 }} /> : i + 1}</span>
              <span className="sm-step-l">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="sm-body">
          {/* ---------------------------------------------------- 1. GOAL */}
          {step === 0 && (
            <>
              <div className="ff">
                <label className="fl2">What is this strategy for?</label>
                <div className="sm-pillars">
                  {PILLARS.map((p) => {
                    const Icon = PILLAR_ICON[p.icon]
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={'type-card ' + p.cls + (form.pillar === p.id ? ' active' : '')}
                        onClick={() => set({ pillar: p.id })}
                      >
                        <span className="type-card-hd"><Icon style={{ fontSize: 13 }} /> {p.label}</span>
                        <span className="type-card-desc">{p.blurb}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="ff">
                <label className="fl2">Strategy name</label>
                <input
                  className="fi"
                  value={form.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder="e.g. Own the Accuracy Conversation"
                  style={touched && errors[0] ? { borderColor: 'var(--red)' } : undefined}
                />
                {touched && errors[0] && <div className="sm-err">{errors[0]}</div>}
              </div>

              <div className="ff">
                <label className="fl2">Icon</label>
                <div className="sm-emoji-row">
                  {EMOJI_CHOICES.map((e) => (
                    <button
                      key={e}
                      type="button"
                      className={'sm-emoji' + (form.emoji === e ? ' active' : '')}
                      onClick={() => set({ emoji: e })}
                    >{e}</button>
                  ))}
                </div>
              </div>

              <div className="g2" style={{ gap: 10 }}>
                <div className="ff" style={{ margin: 0 }}>
                  <label className="fl2">Timeframe</label>
                  <input
                    className="fi"
                    value={form.timeframe}
                    onChange={(e) => set({ timeframe: e.target.value })}
                    placeholder="e.g. Aug 2026 – Jan 2027"
                  />
                </div>
                <div className="ff" style={{ margin: 0 }}>
                  <label className="fl2">Status</label>
                  <select className="fi" value={form.status} onChange={(e) => set({ status: e.target.value })}>
                    <option>Draft</option><option>Active</option><option>Paused</option><option>Completed</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* ----------------------------------------------- 2. OBJECTIVE */}
          {step === 1 && (
            <>
              <div className="ff">
                <label className="fl2">Objective</label>
                <textarea
                  className="fta"
                  value={form.objective}
                  onChange={(e) => set({ objective: e.target.value })}
                  placeholder="What should be true when this strategy has worked?"
                  style={touched && errors[1] ? { borderColor: 'var(--red)' } : undefined}
                />
                {touched && errors[1] && <div className="sm-err">{errors[1]}</div>}
              </div>

              <div className="ff">
                <label className="fl2">Why now</label>
                <textarea
                  className="fta"
                  value={form.why}
                  onChange={(e) => set({ why: e.target.value })}
                  placeholder="What makes this the right moment? Market shift, competitor gap, product readiness…"
                />
              </div>

              <div className="ff">
                <label className="fl2">Target outcome</label>
                <textarea
                  className="fta"
                  value={form.targetOutcome}
                  onChange={(e) => set({ targetOutcome: e.target.value })}
                  placeholder="The measurable version — numbers and a deadline."
                />
              </div>

              <div className="ff">
                <label className="fl2">Measures of success</label>
                {form.kpis.map((k, i) => (
                  <div className="sm-row" key={i}>
                    <input
                      className="fi" value={k.l} placeholder="Metric, e.g. Unaided recall"
                      onChange={(e) => kpis.update(i, { l: e.target.value })}
                    />
                    <input
                      className="fi sm-narrow" value={k.now} placeholder="Now"
                      onChange={(e) => kpis.update(i, { now: e.target.value })}
                    />
                    <input
                      className="fi sm-narrow" value={k.target} placeholder="Target"
                      onChange={(e) => kpis.update(i, { target: e.target.value })}
                    />
                    <button
                      type="button" className="sm-del" onClick={() => kpis.remove(i)}
                      disabled={form.kpis.length === 1} aria-label="Remove metric"
                    ><FaTrash /></button>
                  </div>
                ))}
                <button type="button" className="sm-add" onClick={() => kpis.add({ l: '', now: '', target: '' })}>
                  <FaPlus /> Add metric
                </button>
              </div>
            </>
          )}

          {/* --------------------------------------------------- 3. VOICE */}
          {step === 2 && (
            <>
              <div className="sm-hint">
                <FaCircleInfo style={{ flexShrink: 0, marginTop: 2 }} />
                These rules keep every campaign under this strategy sounding like the same company.
              </div>

              <div className="ff">
                <label className="fl2">Voice pillars</label>
                {form.voicePillars.map((p, i) => (
                  <div className="sm-stack" key={i}>
                    <div className="sm-row">
                      <input
                        className="fi" value={p.t} placeholder={'Pillar ' + (i + 1) + ', e.g. Measured, not loud'}
                        onChange={(e) => vp.update(i, { t: e.target.value })}
                      />
                      <button
                        type="button" className="sm-del" onClick={() => vp.remove(i)}
                        disabled={form.voicePillars.length === 1} aria-label="Remove pillar"
                      ><FaTrash /></button>
                    </div>
                    <input
                      className="fi" value={p.d} placeholder="How it shows up in the writing"
                      onChange={(e) => vp.update(i, { d: e.target.value })}
                    />
                  </div>
                ))}
                <button type="button" className="sm-add" onClick={() => vp.add({ t: '', d: '' })}>
                  <FaPlus /> Add pillar
                </button>
              </div>

              <div className="g2" style={{ gap: 16 }}>
                <div className="ff" style={{ margin: 0 }}>
                  <label className="fl2" style={{ color: 'var(--green)' }}><FaThumbsUp /> Do</label>
                  {form.does.map((d, i) => (
                    <div className="sm-row" key={i}>
                      <input
                        className="fi" value={d} placeholder="Something every asset should do"
                        onChange={(e) => dos.updateAt(i, e.target.value)}
                      />
                      <button
                        type="button" className="sm-del" onClick={() => dos.remove(i)}
                        disabled={form.does.length === 1} aria-label="Remove rule"
                      ><FaTrash /></button>
                    </div>
                  ))}
                  <button type="button" className="sm-add" onClick={() => dos.add('')}>
                    <FaPlus /> Add rule
                  </button>
                </div>

                <div className="ff" style={{ margin: 0 }}>
                  <label className="fl2" style={{ color: 'var(--red)' }}><FaBan /> Don&apos;t</label>
                  {form.donts.map((d, i) => (
                    <div className="sm-row" key={i}>
                      <input
                        className="fi" value={d} placeholder="Something to never do"
                        onChange={(e) => donts.updateAt(i, e.target.value)}
                      />
                      <button
                        type="button" className="sm-del" onClick={() => donts.remove(i)}
                        disabled={form.donts.length === 1} aria-label="Remove rule"
                      ><FaTrash /></button>
                    </div>
                  ))}
                  <button type="button" className="sm-add" onClick={() => donts.add('')}>
                    <FaPlus /> Add rule
                  </button>
                </div>
              </div>

              <div className="ff" style={{ marginTop: 16 }}>
                <label className="fl2">Product positioning</label>
                {form.positioning.map((p, i) => (
                  <div className="sm-row" key={i}>
                    <select
                      className="fi sm-product" value={p.product}
                      onChange={(e) => pos.update(i, { product: e.target.value })}
                    >
                      <option>Smart Watch Series 5</option>
                      <option>Earbuds Pro</option>
                      <option>Fitness Tracker Lite</option>
                    </select>
                    <input
                      className="fi" value={p.line} placeholder="The one line this product owns"
                      onChange={(e) => pos.update(i, { line: e.target.value })}
                    />
                    <button
                      type="button" className="sm-del" onClick={() => pos.remove(i)}
                      disabled={form.positioning.length === 1} aria-label="Remove positioning"
                    ><FaTrash /></button>
                  </div>
                ))}
                <button
                  type="button" className="sm-add"
                  onClick={() => pos.add({ product: 'Smart Watch Series 5', line: '' })}
                ><FaPlus /> Add product</button>
              </div>
            </>
          )}

          {/* ----------------------------------------------- 4. CAMPAIGNS */}
          {step === 3 && (
            <>
              <div className="sm-hint">
                <FaCircleInfo style={{ flexShrink: 0, marginTop: 2 }} />
                Pick the campaigns that deliver this strategy. Mixing physical and online usually works better
                than either alone — you can add more later from the strategy page.
              </div>

              <div className="sm-mix">
                <span><FaGlobe style={{ fontSize: 10 }} /> {mix.online} online</span>
                <span><FaStore style={{ fontSize: 10 }} /> {mix.physical} physical</span>
                <span className="sm-mix-total">{form.campaignIds.length} selected</span>
              </div>

              <div className="sm-camps">
                {CAMPAIGNS.map((c) => {
                  const on = form.campaignIds.includes(c.id)
                  const Icon = c.category === 'physical' ? FaStore : FaGlobe
                  return (
                    <label className={'sm-camp' + (on ? ' active' : '')} key={c.id}>
                      <input type="checkbox" checked={on} onChange={() => toggleCampaign(c.id)} />
                      <span className="check-box" aria-hidden="true">
                        {on && <FaCheck style={{ fontSize: 9 }} />}
                      </span>
                      <span className="sm-camp-emoji">{c.emoji}</span>
                      <span className="sm-camp-main">
                        <span className="sm-camp-title">
                          {c.title}
                          <span className={'cat-badge cat-' + c.category}>
                            <Icon style={{ fontSize: 8 }} /> {c.category}
                          </span>
                        </span>
                        <span className="sm-camp-meta">{c.meta}</span>
                      </span>
                      <span className={'tag ' + c.statusCls}>{c.status}</span>
                    </label>
                  )
                })}
              </div>
            </>
          )}

          {/* -------------------------------------------------- 5. REVIEW */}
          {step === 4 && (
            <>
              <div className="sm-review-head">
                <span className="sm-review-emoji">{form.emoji}</span>
                <div>
                  <div className="sm-review-name">{form.name || 'Untitled strategy'}</div>
                  <div className="sm-review-sub">
                    <span className={'pillar-tag ' + pillarMeta.cls}>{pillarMeta.short}</span>
                    {form.timeframe || 'No timeframe set'} · {form.status}
                  </div>
                </div>
              </div>

              <dl className="sm-review">
                <div><dt>Objective</dt><dd>{form.objective || <em>Not set</em>}</dd></div>
                {form.why.trim() && <div><dt>Why now</dt><dd>{form.why}</dd></div>}
                {form.targetOutcome.trim() && <div><dt>Target outcome</dt><dd>{form.targetOutcome}</dd></div>}
                <div>
                  <dt>Measures</dt>
                  <dd>
                    {form.kpis.filter((k) => k.l.trim()).length
                      ? form.kpis.filter((k) => k.l.trim()).map((k) => `${k.l} (${k.now || '—'} → ${k.target || '—'})`).join(' · ')
                      : <em>None added</em>}
                  </dd>
                </div>
                <div>
                  <dt>Voice pillars</dt>
                  <dd>
                    {form.voicePillars.filter((p) => p.t.trim()).length
                      ? form.voicePillars.filter((p) => p.t.trim()).map((p) => p.t).join(' · ')
                      : <em>None added</em>}
                  </dd>
                </div>
                <div>
                  <dt>Tone rules</dt>
                  <dd>
                    {form.does.filter(Boolean).length} do · {form.donts.filter(Boolean).length} don&apos;t
                  </dd>
                </div>
                <div>
                  <dt>Campaigns</dt>
                  <dd>
                    {linked.length ? (
                      <span className="camp-chips" style={{ marginTop: 4 }}>
                        {linked.map((c) => <span className="camp-chip" key={c.id}>{c.title}</span>)}
                      </span>
                    ) : <em>None linked yet</em>}
                  </dd>
                </div>
              </dl>
            </>
          )}
        </div>

        <div className="sm-foot">
          <span className="sm-progress">Step {step + 1} of {STEPS.length}</span>
          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
            {step > 0 && (
              <button className="btn btn-g" onClick={back}><FaArrowLeft /> Back</button>
            )}
            {step < STEPS.length - 1 ? (
              <button className="btn btn-p" onClick={next}>Next <FaArrowRight style={{ fontSize: 11 }} /></button>
            ) : (
              <button className="btn btn-p" onClick={submit}>
                <FaWandMagicSparkles /> Create strategy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
