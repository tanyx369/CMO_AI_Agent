import { useEffect, useMemo, useRef, useState } from 'react'
import { FaCalendarDays, FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

/**
 * Two-month calendar for picking a start and end date.
 *
 * Built directly on `Date` — the project has no date library, and the handful of
 * helpers below are cheaper than adding one.
 *
 *   <DateRangePicker value={{ start, end }} onChange={setRange} />
 *
 * `value` holds Date objects. Click once to set the start, again to set the end;
 * clicking before the current start restarts the selection.
 */

/* ---------------------------------------------------------------- */
/* Date helpers                                                      */
/* ---------------------------------------------------------------- */

const DAY_MS = 86400000
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
export const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1)
export const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1)
export const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0)
export const isSameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

/** Whole days between two dates, inclusive of both ends. */
export const daysBetween = (a, b) =>
  Math.round((startOfDay(b) - startOfDay(a)) / DAY_MS) + 1

export function formatDate(d, withYear = true) {
  if (!d) return ''
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(withYear ? { year: 'numeric' } : {}),
  })
}

/** "Aug 1 – Aug 30, 2026", dropping the repeated year on the left side. */
export function formatRange({ start, end }) {
  if (!start) return 'Select a range'
  if (!end || isSameDay(start, end)) return formatDate(start)
  const sameYear = start.getFullYear() === end.getFullYear()
  return `${formatDate(start, !sameYear)} – ${formatDate(end)}`
}

/** Presets are relative to `today` so they stay correct as the clock moves. */
export function buildPresets(today = new Date()) {
  const t = startOfDay(today)
  return [
    { id: '7d', label: 'Last 7 days', range: () => ({ start: addDays(t, -6), end: t }) },
    { id: '30d', label: 'Last 30 days', range: () => ({ start: addDays(t, -29), end: t }) },
    { id: '90d', label: 'Last 90 days', range: () => ({ start: addDays(t, -89), end: t }) },
    { id: 'mtd', label: 'This month', range: () => ({ start: startOfMonth(t), end: t }) },
    {
      id: 'lastMonth',
      label: 'Last month',
      range: () => {
        const prev = addMonths(startOfMonth(t), -1)
        return { start: prev, end: endOfMonth(prev) }
      },
    },
    { id: 'ytd', label: 'Year to date', range: () => ({ start: new Date(t.getFullYear(), 0, 1), end: t }) },
  ]
}

/* ---------------------------------------------------------------- */
/* One month grid                                                    */
/* ---------------------------------------------------------------- */

function MonthGrid({ month, range, hovered, onPick, onHover, maxDate }) {
  const cells = useMemo(() => {
    const first = startOfMonth(month)
    const last = endOfMonth(month)
    const out = []
    for (let i = 0; i < first.getDay(); i++) out.push(null) // leading blanks
    for (let d = 1; d <= last.getDate(); d++) {
      out.push(new Date(month.getFullYear(), month.getMonth(), d))
    }
    return out
  }, [month])

  // While picking the end date, preview the range under the cursor.
  const previewEnd = range.start && !range.end && hovered && hovered > range.start ? hovered : range.end

  return (
    <div className="drp-month">
      <div className="drp-month-name">
        {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>
      <div className="drp-grid">
        {WEEKDAYS.map((w) => <div className="drp-wd" key={w}>{w}</div>)}
        {cells.map((day, i) => {
          if (!day) return <div key={'b' + i} />

          const disabled = maxDate && startOfDay(day) > startOfDay(maxDate)
          const isStart = isSameDay(day, range.start)
          const isEnd = isSameDay(day, previewEnd)
          const inRange =
            range.start && previewEnd && day > range.start && day < previewEnd

          const cls = [
            'drp-day',
            disabled ? 'is-disabled' : '',
            isStart || isEnd ? 'is-edge' : '',
            inRange ? 'is-inside' : '',
            isStart ? 'is-start' : '',
            isEnd ? 'is-end' : '',
          ].filter(Boolean).join(' ')

          return (
            <button
              key={day.toISOString()}
              type="button"
              className={cls}
              disabled={disabled}
              onClick={() => onPick(day)}
              onMouseEnter={() => onHover(day)}
              aria-label={formatDate(day)}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* Picker                                                            */
/* ---------------------------------------------------------------- */

export default function DateRangePicker({ value, onChange, maxDate = new Date() }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)
  const [hovered, setHovered] = useState(null)
  const [leftMonth, setLeftMonth] = useState(() => addMonths(startOfMonth(value.end || new Date()), -1))

  const wrapRef = useRef(null)
  const presets = useMemo(() => buildPresets(maxDate), [maxDate])

  // Close on an outside click or Escape.
  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function openPicker() {
    setDraft(value)
    setHovered(null)
    setLeftMonth(addMonths(startOfMonth(value.end || new Date()), -1))
    setOpen(true)
  }

  function pick(day) {
    // No start yet, or the range is already complete -> begin a new one.
    if (!draft.start || draft.end || day < draft.start) {
      setDraft({ start: day, end: null })
      return
    }
    const next = { start: draft.start, end: day }
    setDraft(next)
    onChange(next)
    setOpen(false)
  }

  function applyPreset(preset) {
    const next = preset.range()
    setDraft(next)
    onChange(next)
    setOpen(false)
  }

  const activePreset = presets.find((p) => {
    const r = p.range()
    return isSameDay(r.start, value.start) && isSameDay(r.end, value.end)
  })

  return (
    <div className="drp" ref={wrapRef}>
      <button
        type="button"
        className={'drp-trigger' + (open ? ' is-open' : '')}
        onClick={() => (open ? setOpen(false) : openPicker())}
        aria-expanded={open}
      >
        <FaCalendarDays style={{ fontSize: 12, color: 'var(--t3)' }} />
        <span className="drp-value">{formatRange(value)}</span>
        {activePreset && <span className="drp-preset-tag">{activePreset.label}</span>}
      </button>

      {open && (
        <div className="drp-pop" role="dialog" aria-label="Select a date range">
          <div className="drp-presets">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                className={'drp-preset' + (activePreset?.id === p.id ? ' active' : '')}
                onClick={() => applyPreset(p)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="drp-cals">
            <div className="drp-nav">
              <button type="button" className="drp-nav-btn" onClick={() => setLeftMonth(addMonths(leftMonth, -1))} aria-label="Previous month">
                <FaChevronLeft />
              </button>
              <span className="drp-hint">
                {draft.start && !draft.end ? 'Now pick the end date' : 'Pick a start date'}
              </span>
              <button type="button" className="drp-nav-btn" onClick={() => setLeftMonth(addMonths(leftMonth, 1))} aria-label="Next month">
                <FaChevronRight />
              </button>
            </div>

            <div className="drp-months" onMouseLeave={() => setHovered(null)}>
              {[leftMonth, addMonths(leftMonth, 1)].map((m) => (
                <MonthGrid
                  key={m.toISOString()}
                  month={m}
                  range={draft}
                  hovered={hovered}
                  onPick={pick}
                  onHover={setHovered}
                  maxDate={maxDate}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
