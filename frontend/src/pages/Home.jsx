import { Line, Doughnut } from 'react-chartjs-2'
import {
  FaBolt, FaChevronRight, FaArrowTrendUp, FaArrowTrendDown,
  FaRocket, FaWandMagicSparkles, FaChartPie, FaBoxOpen,
} from 'react-icons/fa6'
import { gridColor, tickColor } from '../chartSetup'

const METRICS = [
  { l: 'Revenue MTD', v: '$1.24M', ch: '+14.2% vs last month', up: true },
  { l: 'Active Campaigns', v: '8', ch: '3 launched this week', up: true },
  { l: 'Blended ROAS', v: '3.8x', ch: '−0.3x vs target', up: false },
  { l: 'Total Impressions', v: '4.1M', ch: '+22% vs last week', up: true },
]

const PICKUP = [
  { pri: 'Urgent', priCls: 'pri-h', title: 'Q3 Launch — 3 ad sets need creative review before Thursday', sub: 'Campaign Management', to: 'campaigns' },
  { pri: 'Review', priCls: 'pri-m', title: 'TikTok ROAS dropped 18% week-on-week — analysis ready', sub: 'Analytics → Platform Performance', to: 'analytics' },
  { pri: 'Pending', priCls: 'pri-l', title: 'Strategist AI drafted a 90-day growth plan — awaiting your input', sub: 'Strategist AI → Growth Planning', to: 'ai' },
]

const lineData = {
  labels: ['Aug 1', '5', '10', '15', '20', '25', '26'],
  datasets: [
    { label: 'Revenue ($K)', data: [38, 42, 51, 48, 59, 62, 65], borderColor: '#6D5EF5', backgroundColor: 'rgba(109,94,245,0.10)', fill: true, tension: 0.4, pointRadius: 3 },
    { label: 'Ad Spend ($K)', data: [10, 11, 14, 13, 16, 17, 18], borderColor: '#E85BAA', backgroundColor: 'transparent', tension: 0.4, pointRadius: 3 },
  ],
}
const lineOpts = {
  responsive: true,
  plugins: { legend: { display: true, labels: { color: tickColor, font: { size: 11 }, boxWidth: 12 } } },
  scales: {
    x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } } },
    y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } } },
  },
}

const doughnutData = {
  labels: ['Instagram', 'Google', 'TikTok', 'Email'],
  datasets: [{ data: [33, 27, 23, 17], backgroundColor: ['#6D5EF5', '#E85BAA', '#E8940C', '#12B76A'], borderWidth: 0 }],
}
const doughnutOpts = {
  responsive: true, cutout: '68%',
  plugins: { legend: { position: 'bottom', labels: { color: tickColor, font: { size: 11 }, boxWidth: 10, padding: 10 } } },
}

const QUICK = [
  { icon: FaRocket, label: 'New Campaign', action: 'newCampaign' },
  { icon: FaWandMagicSparkles, label: 'Ask Strategist AI', action: 'ai' },
  { icon: FaChartPie, label: 'View Analytics', action: 'analytics' },
  { icon: FaBoxOpen, label: 'Update Products', action: 'products' },
]

export default function Home({ onNav, onNewCampaign }) {
  const doAction = (a) => (a === 'newCampaign' ? onNewCampaign() : onNav(a))

  return (
    <div className="page">
      <div className="greeting">Good morning, <em>Sarah.</em></div>
      <p style={{ color: 'var(--t2)', marginTop: 4, marginBottom: 24 }}>
        Here's your marketing command center for today.
      </p>

      <div className="pickup-card">
        <div className="pu-hdr"><FaBolt /> Pick up where you left off</div>
        {PICKUP.map((p, i) => (
          <div className="pu-item" key={i} onClick={() => onNav(p.to)}>
            <span className={'pri ' + p.priCls}>{p.pri}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{p.title}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{p.sub}</div>
            </div>
            <FaChevronRight style={{ color: 'var(--t3)', fontSize: 11 }} />
          </div>
        ))}
      </div>

      <div className="g4" style={{ marginBottom: 20 }}>
        {METRICS.map((m, i) => (
          <div className="mc" key={i}>
            <div className="ml">{m.l}</div>
            <div className="mv">{m.v}</div>
            <div className={'mch ' + (m.up ? 'up' : 'dn')}>
              {m.up ? <FaArrowTrendUp style={{ fontSize: 10 }} /> : <FaArrowTrendDown style={{ fontSize: 10 }} />} {m.ch}
            </div>
          </div>
        ))}
      </div>

      <div className="g21" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="ct-title">Revenue vs Ad Spend — Last 30 Days</div>
          <Line data={lineData} options={lineOpts} height={80} />
        </div>
        <div className="card">
          <div className="ct-title">Channel Mix</div>
          <Doughnut data={doughnutData} options={doughnutOpts} height={80} />
        </div>
      </div>

      <div className="sec">Quick Actions</div>
      <div className="qa-wrap">
        {QUICK.map((q, i) => {
          const Icon = q.icon
          return (
            <div className="qa-btn" key={i} onClick={() => doAction(q.action)}>
              <i><Icon /></i>
              <span>{q.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
