import { Fragment, useMemo, useState } from 'react'
import {
  FaUsers, FaMagnifyingGlass, FaDownload, FaArrowRight, FaSort, FaSortUp,
  FaSortDown, FaGlobe, FaStore, FaCoins, FaRepeat, FaCartShopping, FaInbox,
} from 'react-icons/fa6'
import { CAMPAIGNS } from '../data'
import {
  CUSTOMERS, CHANNELS, CHANNEL_LABEL, CHANNEL_CLS, CUSTOMER_STATUSES, STATUS_META,
  acquisitionByCampaign, customerAvatar, customerTotals, formatDate, money,
} from '../customerData'

const COLUMNS = [
  { id: 'name', label: 'Customer', sortable: true },
  { id: 'campaign', label: 'Acquired from', sortable: true },
  { id: 'channel', label: 'Channel', sortable: true },
  { id: 'acquired', label: 'Date', sortable: true },
  { id: 'orders', label: 'Orders', sortable: true, align: 'right' },
  { id: 'ltv', label: 'Lifetime value', sortable: true, align: 'right' },
  { id: 'status', label: 'Status', sortable: true },
]

/** Values used for sorting — campaign sorts by title, not id. */
const sortValue = (c, key) => {
  if (key === 'campaign') return CAMPAIGNS.find((x) => x.id === c.campaignId)?.title || ''
  if (key === 'channel') return CHANNEL_LABEL[c.channel] || ''
  if (key === 'name') return c.name
  return c[key]
}

/**
 * Customer List — everyone acquired through a marketing campaign.
 *
 * Each row names the campaign that brought the customer in and links straight
 * to it, so acquisition can always be traced back to the work that earned it.
 */
export default function CustomerList({ onOpenCampaign, onOpenCampaigns }) {
  const [query, setQuery] = useState('')
  const [campaignId, setCampaignId] = useState('all')
  const [channel, setChannel] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState({ key: 'acquired', dir: 'desc' })
  const [expanded, setExpanded] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CUSTOMERS.filter((c) => {
      if (campaignId !== 'all' && c.campaignId !== Number(campaignId)) return false
      if (channel !== 'all' && c.channel !== channel) return false
      if (status !== 'all' && c.status !== status) return false
      if (!q) return true
      const campaign = CAMPAIGNS.find((x) => x.id === c.campaignId)?.title || ''
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.product.toLowerCase().includes(q) ||
        campaign.toLowerCase().includes(q)
      )
    })
  }, [query, campaignId, channel, status])

  const rows = useMemo(() => {
    const list = [...filtered]
    list.sort((a, b) => {
      const av = sortValue(a, sort.key)
      const bv = sortValue(b, sort.key)
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sort.dir === 'asc' ? cmp : -cmp
    })
    return list
  }, [filtered, sort])

  // Totals reflect the current filter, so they answer "what am I looking at".
  const totals = useMemo(() => customerTotals(filtered), [filtered])
  const bySource = useMemo(() => acquisitionByCampaign(filtered, CAMPAIGNS), [filtered])

  const filtersOn = query.trim() || campaignId !== 'all' || channel !== 'all' || status !== 'all'

  function toggleSort(key) {
    setSort((s) => (s.key === key
      ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
      : { key, dir: key === 'name' || key === 'campaign' || key === 'channel' ? 'asc' : 'desc' }))
  }

  function clearFilters() {
    setQuery(''); setCampaignId('all'); setChannel('all'); setStatus('all')
  }

  const SortIcon = ({ col }) => {
    if (sort.key !== col) return <FaSort style={{ fontSize: 9, opacity: 0.35 }} />
    return sort.dir === 'asc'
      ? <FaSortUp style={{ fontSize: 9 }} />
      : <FaSortDown style={{ fontSize: 9 }} />
  }

  return (
    <div className="page">
      <div className="ph-row">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 4 }}>
            Customer List
          </h1>
          <p style={{ color: 'var(--t2)', fontSize: 14 }}>
            Everyone acquired through a marketing campaign, and which campaign brought them in.
          </p>
        </div>
        <button className="btn btn-g btn-sm"><FaDownload /> Export CSV</button>
      </div>

      {/* Headline numbers — these follow the filters */}
      <div className="kpig">
        <div className="kpi kb">
          <div className="ml">Customers</div>
          <div className="mv">{totals.total}</div>
          <div className="kpi-note">{filtersOn ? 'Matching the current filters' : 'Across all campaigns'}</div>
        </div>
        <div className="kpi kp">
          <div className="ml">Revenue attributed</div>
          <div className="mv">{money(totals.revenue)}</div>
          <div className="kpi-note">{totals.orders} orders placed</div>
        </div>
        <div className="kpi kg">
          <div className="ml">Average LTV</div>
          <div className="mv">{money(totals.avgLtv)}</div>
          <div className="kpi-note">Per acquired customer</div>
        </div>
        <div className="kpi ka">
          <div className="ml">Repeat rate</div>
          <div className="mv">{totals.repeatRate}%</div>
          <div className="kpi-note">Ordered more than once</div>
        </div>
      </div>

      {/* Which campaigns are actually producing customers */}
      <div className="chart-card" style={{ marginBottom: 14 }}>
        <div className="dash-title">
          <span><FaUsers /> Acquisition by Campaign</span>
          <button className="camp-links-all" onClick={onOpenCampaigns}>
            Open campaign management <FaArrowRight style={{ fontSize: 9 }} />
          </button>
        </div>
        {bySource.length === 0 ? (
          <div className="camp-links-empty">No customers match the current filters.</div>
        ) : (
          <div className="acq-rows">
            {bySource.map((s) => {
              const Icon = s.campaign.category === 'physical' ? FaStore : FaGlobe
              const share = totals.total ? Math.round((s.count / totals.total) * 100) : 0
              return (
                <button className="acq-row" key={s.campaignId} onClick={() => onOpenCampaign(s.campaignId)}>
                  <span className="acq-emoji">{s.campaign.emoji}</span>
                  <span className="acq-main">
                    <span className="acq-title">
                      {s.campaign.title}
                      <span className={'cat-badge cat-' + s.campaign.category}>
                        <Icon style={{ fontSize: 8 }} /> {s.campaign.category}
                      </span>
                    </span>
                    <span className="acq-bar"><span className="acq-fill" style={{ width: share + '%' }} /></span>
                  </span>
                  <span className="acq-stats">
                    <span className="acq-count">{s.count}</span>
                    <span className="acq-sub">{share}% · {money(s.revenue)}</span>
                  </span>
                  <FaArrowRight style={{ fontSize: 10, color: 'var(--accent)', flexShrink: 0 }} />
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="frow cl-filters">
        <div className="cl-search">
          <FaMagnifyingGlass style={{ color: 'var(--t3)', fontSize: 12 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, location, product or campaign…"
            aria-label="Search customers"
          />
        </div>

        <select className="fsel" value={campaignId} onChange={(e) => setCampaignId(e.target.value)} aria-label="Campaign">
          <option value="all">All campaigns</option>
          {CAMPAIGNS.map((c) => <option value={c.id} key={c.id}>{c.title}</option>)}
        </select>

        <select className="fsel" value={channel} onChange={(e) => setChannel(e.target.value)} aria-label="Channel">
          <option value="all">All channels</option>
          {CHANNELS.map((c) => <option value={c.id} key={c.id}>{c.label}</option>)}
        </select>

        <select className="fsel" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="all">All statuses</option>
          {CUSTOMER_STATUSES.map((s) => <option value={s.id} key={s.id}>{s.label}</option>)}
        </select>

        {filtersOn && (
          <button className="btn btn-g btn-sm" onClick={clearFilters}>Clear filters</button>
        )}
        <span className="cl-count">
          {rows.length} of {CUSTOMERS.length} customers
        </span>
      </div>

      {/* Table */}
      <div className="chart-card" style={{ padding: 0, overflow: 'hidden' }}>
        {rows.length === 0 ? (
          <div className="empty-state" style={{ border: 'none', padding: '48px 24px' }}>
            <FaInbox style={{ fontSize: 26, display: 'block', margin: '0 auto 10px' }} />
            No customers match those filters.<br />Try clearing one of them.
          </div>
        ) : (
          <div className="cl-scroll">
            <table className="cl-table">
              <thead>
                <tr>
                  {COLUMNS.map((col) => (
                    <th
                      key={col.id}
                      className={(col.align === 'right' ? 'ta-right ' : '') + (sort.key === col.id ? 'is-sorted' : '')}
                      onClick={() => col.sortable && toggleSort(col.id)}
                      role={col.sortable ? 'button' : undefined}
                    >
                      <span className="cl-th">{col.label} {col.sortable && <SortIcon col={col.id} />}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => {
                  const campaign = CAMPAIGNS.find((x) => x.id === c.campaignId)
                  const av = customerAvatar(c)
                  const st = STATUS_META[c.status]
                  const open = expanded === c.id
                  return (
                    <Fragment key={c.id}>
                      <tr
                        className={'cl-row' + (open ? ' is-open' : '')}
                        onClick={() => setExpanded(open ? null : c.id)}
                      >
                        <td>
                          <span className="cl-cust">
                            <span className="cl-avatar" style={{ background: av.color }}>{av.initials}</span>
                            <span style={{ minWidth: 0 }}>
                              <span className="cl-name">{c.name}</span>
                              <span className="cl-email">{c.email}</span>
                            </span>
                          </span>
                        </td>
                        <td>
                          {campaign ? (
                            <button
                              className="cl-camp"
                              onClick={(e) => { e.stopPropagation(); onOpenCampaign(campaign.id) }}
                              title={'Open ' + campaign.title}
                            >
                              <span>{campaign.emoji}</span> {campaign.title}
                            </button>
                          ) : <span className="cl-muted">—</span>}
                        </td>
                        <td><span className={'tag ' + CHANNEL_CLS[c.channel]}>{CHANNEL_LABEL[c.channel]}</span></td>
                        <td className="cl-muted">{formatDate(c.acquired)}</td>
                        <td className="ta-right">{c.orders}</td>
                        <td className="ta-right cl-ltv">{money(c.ltv)}</td>
                        <td><span className={'cl-status ' + st.cls}>{st.label}</span></td>
                      </tr>

                      {open && (
                        <tr className="cl-detail-row">
                          <td colSpan={COLUMNS.length}>
                            <div className="cl-detail">
                              <div>
                                <span className="cl-dl">First product</span>
                                <span className="cl-dv">{c.product}</span>
                              </div>
                              <div>
                                <span className="cl-dl">Location</span>
                                <span className="cl-dv">{c.location}</span>
                              </div>
                              <div>
                                <span className="cl-dl">Last active</span>
                                <span className="cl-dv">{formatDate(c.lastActive)}</span>
                              </div>
                              <div>
                                <span className="cl-dl">Avg order value</span>
                                <span className="cl-dv">{money(Math.round(c.ltv / c.orders))}</span>
                              </div>
                              {campaign && (
                                <div className="cl-detail-cta">
                                  <button className="btn btn-g btn-sm" onClick={() => onOpenCampaign(campaign.id)}>
                                    View {campaign.title} <FaArrowRight style={{ fontSize: 10 }} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="cl-foot">
        <span><FaCartShopping style={{ fontSize: 10 }} /> {totals.orders} orders</span>
        <span><FaCoins style={{ fontSize: 10 }} /> {money(totals.revenue)} attributed</span>
        <span><FaRepeat style={{ fontSize: 10 }} /> {totals.repeatRate}% repeat</span>
      </div>
    </div>
  )
}
