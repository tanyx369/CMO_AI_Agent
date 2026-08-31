import { useEffect, useRef, useState } from 'react'
import {
  FaMagnifyingGlass, FaBell, FaPlus, FaRocket, FaArrowTrendUp,
  FaTriangleExclamation, FaFileLines,
} from 'react-icons/fa6'
import { NOTIFICATIONS } from '../data'

const NICO = {
  rocket: FaRocket, trend: FaArrowTrendUp, warn: FaTriangleExclamation, file: FaFileLines,
}

export default function Topbar({ onNewCampaign }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    function handle(e) {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handle)
    return () => document.removeEventListener('click', handle)
  }, [])

  return (
    <>
      <div className="topbar">
        <div className="tsearch">
          <FaMagnifyingGlass style={{ color: 'var(--t3)', fontSize: 12 }} />
          <input type="text" placeholder="Search campaigns, products..." />
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--t3)' }}>Aug 26, 2026</span>
        <button
          ref={btnRef}
          className="btn btn-g btn-sm btn-ic nbtn"
          onClick={() => setOpen((o) => !o)}
        >
          <FaBell />
          <div className="ndot" />
        </button>
        <button className="btn btn-p btn-sm" onClick={() => onNewCampaign()}>
          <FaPlus /> New Campaign
        </button>
      </div>

      {open && (
        <div className="npanel" ref={panelRef}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Notifications</span>
            <button className="btn btn-g btn-sm" style={{ fontSize: 11 }} onClick={() => setOpen(false)}>
              Mark all read
            </button>
          </div>
          {NOTIFICATIONS.map((n, i) => {
            const Icon = NICO[n.ico]
            const bg = { tp: 'var(--acs)', tg: 'var(--grs)', ta: 'var(--ams)', tk: 'var(--pks)' }[n.cls]
            const col = { tp: 'var(--accent)', tg: 'var(--green)', ta: 'var(--amber)', tk: 'var(--pink)' }[n.cls]
            return (
              <div className="nitem" key={i}>
                <div className="nico" style={{ background: bg, color: col }}><Icon /></div>
                <div>
                  <div className="ntext">{n.text}</div>
                  <div className="ntime">{n.time}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
