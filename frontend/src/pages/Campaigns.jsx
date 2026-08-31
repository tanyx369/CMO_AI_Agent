import { useMemo, useState } from 'react'
import {
  FaPlus, FaSliders, FaArrowRight, FaChevronLeft, FaChevronRight,
  FaStore, FaGlobe, FaLayerGroup, FaFileLines,
} from 'react-icons/fa6'
import { CAMPAIGNS, CALENDAR_EVENTS } from '../data'
import CampaignDashboard from '../components/CampaignDashboard'

const TABS = [
  { id: 'all', label: 'All Campaigns' },
  { id: 'physical', label: 'Physical', icon: FaStore },
  { id: 'online', label: 'Online', icon: FaGlobe },
  { id: 'calendar', label: 'Calendar' },
]

// Sub-filter shown only while the Online tab is active
const ONLINE_SUBTABS = [
  { id: 'all', label: 'All Online' },
  { id: 'single', label: 'Single Post', icon: FaFileLines },
  { id: 'campaign', label: 'Campaign', icon: FaLayerGroup },
]

const PRODUCTS = ['All Products', 'Smart Watch Series 5', 'Earbuds Pro', 'Fitness Tracker Lite']
const STATUSES = ['All Status', 'Live', 'Scheduled', 'Draft']

/** Small badge describing what kind of campaign a card is. */
function CategoryBadge({ campaign }) {
  const isPhysical = campaign.category === 'physical'
  const Icon = isPhysical ? FaStore : campaign.onlineType === 'single' ? FaFileLines : FaLayerGroup
  const label = isPhysical
    ? campaign.physicalType
    : campaign.onlineType === 'single' ? 'Single Post' : 'Campaign'

  return (
    <span className={'cat-badge ' + (isPhysical ? 'cat-physical' : 'cat-online')}>
      <Icon style={{ fontSize: 9 }} /> {label}
    </span>
  )
}

function Calendar() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const startDay = 2 // Sep 2026 starts Tuesday
  const totalDays = 30
  const cells = []

  for (let i = 0; i < startDay; i++) {
    cells.push(<div className="cal-day oth" key={'p' + i}><div className="dn">{31 - startDay + i + 1}</div></div>)
  }
  for (let d = 1; d <= totalDays; d++) {
    const evs = CALENDAR_EVENTS[d] || []
    const bgMap = { tp: 'var(--acs)', tg: 'var(--grs)', ta: 'var(--ams)', tk: 'var(--pks)' }
    const colMap = { tp: 'var(--accent)', tg: 'var(--green)', ta: 'var(--amber)', tk: 'var(--pink)' }
    cells.push(
      <div className={'cal-day' + (d === 26 ? ' today' : '')} key={d}>
        <div className="dn">{d}</div>
        {evs.map((ev, i) => (
          <div className="cev" key={i} style={{ background: bgMap[ev.cls], color: colMap[ev.cls] }}>{ev.t}</div>
        ))}
      </div>
    )
  }
  const rem = (7 - ((startDay + totalDays) % 7)) % 7
  for (let i = 1; i <= rem; i++) {
    cells.push(<div className="cal-day oth" key={'n' + i}><div className="dn">{i}</div></div>)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-g btn-sm"><FaChevronLeft /></button>
          <span style={{ fontSize: 16, fontWeight: 600 }}>September 2026</span>
          <button className="btn btn-g btn-sm"><FaChevronRight /></button>
        </div>
        <button className="btn btn-g btn-sm">Today</button>
      </div>
      <div className="cal-grid">
        {days.map((d) => <div className="cal-hdr" key={d}>{d}</div>)}
        {cells}
      </div>
    </div>
  )
}

export default function Campaigns({ onOpenCampaign, onNewCampaign }) {
  const [tab, setTab] = useState('all')
  const [onlineSub, setOnlineSub] = useState('all')
  const [product, setProduct] = useState('All Products')
  const [status, setStatus] = useState('All Status')

  const visible = useMemo(() => {
    return CAMPAIGNS.filter((c) => {
      if (tab === 'physical' && c.category !== 'physical') return false
      if (tab === 'online') {
        if (c.category !== 'online') return false
        if (onlineSub !== 'all' && c.onlineType !== onlineSub) return false
      }
      if (product !== 'All Products' && c.product !== product) return false
      if (status !== 'All Status' && c.status !== status) return false
      return true
    })
  }, [tab, onlineSub, product, status])

  // Counts for the tab labels
  const counts = useMemo(() => ({
    all: CAMPAIGNS.length,
    physical: CAMPAIGNS.filter((c) => c.category === 'physical').length,
    online: CAMPAIGNS.filter((c) => c.category === 'online').length,
  }), [])

  return (
    <div className="page">
      <div className="ph-row">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 4 }}>Campaign Management</h1>
          <p style={{ color: 'var(--t2)', fontSize: 14 }}>Click a campaign to manage content, review analytics, and approve posts.</p>
        </div>
        <button className="btn btn-p" onClick={() => onNewCampaign()}><FaPlus /> New Campaign</button>
      </div>

      <CampaignDashboard onOpenCampaign={onOpenCampaign} onNewCampaign={onNewCampaign} />

      {/* Primary category tabs */}
      <div className="tab-row">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <div
              key={t.id}
              className={'tab' + (tab === t.id ? ' active' : '')}
              onClick={() => setTab(t.id)}
            >
              {Icon && <Icon style={{ fontSize: 11, marginRight: 6 }} />}
              {t.label}
              {counts[t.id] !== undefined && (
                <span style={{ marginLeft: 6, color: 'var(--t3)', fontSize: 11 }}>{counts[t.id]}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Online sub-type filter — only relevant under the Online tab */}
      {tab === 'online' && (
        <div className="subtab-row">
          {ONLINE_SUBTABS.map((s) => {
            const Icon = s.icon
            return (
              <button
                key={s.id}
                className={'subtab' + (onlineSub === s.id ? ' active' : '')}
                onClick={() => setOnlineSub(s.id)}
              >
                {Icon && <Icon style={{ fontSize: 11 }} />} {s.label}
              </button>
            )
          })}
        </div>
      )}

      {tab !== 'calendar' ? (
        <div>
          <div className="frow">
            <FaSliders style={{ color: 'var(--t2)' }} />
            <select className="fsel" value={product} onChange={(e) => setProduct(e.target.value)}>
              {PRODUCTS.map((p) => <option key={p}>{p}</option>)}
            </select>
            <select className="fsel" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--t3)' }}>
              {visible.length} {visible.length === 1 ? 'campaign' : 'campaigns'}
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="empty-state">
              <FaSliders style={{ fontSize: 26, display: 'block', margin: '0 auto 10px', opacity: 0.6 }} />
              No campaigns match these filters.
            </div>
          ) : (
            <div className="cg">
              {visible.map((c) => (
                <div className="cc" key={c.id} onClick={() => onOpenCampaign(c.id)}>
                  <div className="cb" style={{ background: c.bg }}>{c.emoji}</div>
                  <div className="cbody">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                      <div className="ctitle">{c.title}</div>
                      <span className={'tag ' + c.statusCls} style={{ fontSize: 10 }}>{c.status}</span>
                    </div>
                    <CategoryBadge campaign={c} />
                    <div className="cmeta" style={{ marginTop: 6 }}>{c.cardMeta}</div>
                    <div className="ctags">
                      {c.tags.map((t, j) => <span className={'tag ' + t.cls} key={j}>{t.t}</span>)}
                    </div>
                    <div className="pbar"><div className="pfill" style={{ width: c.progress + '%' }} /></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--t3)' }}>
                      <span>{c.footL}</span><span>{c.footR}</span>
                    </div>
                    <div style={{ marginTop: 12, fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <FaArrowRight style={{ fontSize: 10 }} /> Open campaign
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Calendar />
      )}
    </div>
  )
}
