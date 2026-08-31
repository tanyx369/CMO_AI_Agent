import {
  FaHouse, FaRocket, FaChartLine, FaBox, FaWandMagicSparkles, FaUsersViewfinder,
  FaGear, FaChessKnight,
} from 'react-icons/fa6'
import { useProfile } from '../settingsStore'

const NAV = {
  Overview: [{ id: 'home', label: 'Dashboard', icon: FaHouse }],
  Marketing: [
    { id: 'strategy', label: 'Strategy', icon: FaChessKnight },
    { id: 'campaigns', label: 'Campaigns', icon: FaRocket, badge: '3' },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine },
    { id: 'demographics', label: 'Demographic Analysis', icon: FaUsersViewfinder },
    { id: 'products', label: 'Products', icon: FaBox },
  ],
  AI: [{ id: 'ai', label: 'Strategist AI', icon: FaWandMagicSparkles }],
  Account: [{ id: 'profile', label: 'Profile & Settings', icon: FaGear }],
}

export default function Sidebar({ page, onNav }) {
  const profile = useProfile()
  // Campaign detail counts as "campaigns" for highlight purposes
  const activeId = page === 'cdetail' ? 'campaigns'
    : page === 'sdetail' ? 'strategy'
    : page

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">A</div>
        <div className="logo-text">APEX<span>CMO</span></div>
      </div>

      {Object.entries(NAV).map(([section, items]) => (
        <div className="nav-section" key={section}>
          <div className="nav-label">{section}</div>
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className={'nav-item' + (activeId === item.id ? ' active' : '')}
                onClick={() => onNav(item.id)}
              >
                <i><Icon /></i> {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </div>
            )
          })}
        </div>
      ))}

      <div className="sidebar-footer">
        <button
          className={'user-card' + (activeId === 'profile' ? ' active' : '')}
          onClick={() => onNav('profile')}
          title="Profile & settings"
        >
          <div className="avatar">{profile.initials}</div>
          <div style={{ minWidth: 0, textAlign: 'left' }}>
            <div className="user-name">{profile.name}</div>
            <div className="user-role">{profile.role}</div>
          </div>
        </button>
      </div>
    </aside>
  )
}
