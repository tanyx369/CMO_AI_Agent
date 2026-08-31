import { useState } from 'react'
import './chartSetup'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import { CampaignModal, ProductModal } from './components/Modals'
import Home from './pages/Home'
import Campaigns from './pages/Campaigns'
import CampaignDetail from './pages/CampaignDetail'
import Analytics from './pages/Analytics'
import Strategy from './pages/Strategy'
import StrategyDetail from './pages/StrategyDetail'
import { STRATEGIES } from './strategyData'
import DemographicAnalysis from './pages/DemographicAnalysis'
import StrategistAI from './pages/StrategistAI'
import Products from './pages/Products'
import Profile from './pages/Profile'

export default function App() {
  const [page, setPage] = useState('home')
  const [campaignId, setCampaignId] = useState(0)
  const [strategyId, setStrategyId] = useState(0)
  // Strategies created this session sit in front of the seeded ones.
  const [customStrategies, setCustomStrategies] = useState([])
  const strategies = [...customStrategies, ...STRATEGIES]
  // null = closed; an object (possibly empty) = open, optionally pre-filled
  const [campaignModal, setCampaignModal] = useState(null)
  const [productModal, setProductModal] = useState(false)

  const openCampaign = (id) => {
    setCampaignId(id)
    setPage('cdetail')
    window.scrollTo(0, 0)
  }

  const openStrategy = (id) => {
    setStrategyId(id)
    setPage('sdetail')
    window.scrollTo(0, 0)
  }

  /** Map the wizard's draft onto the shape the strategy views expect. */
  const createStrategy = (draft) => {
    const id = 1000 + customStrategies.length
    setCustomStrategies((list) => [
      {
        ...draft,
        id,
        progress: 0,
        secondaryPillars: [],
        voice: {
          pillars: draft.voicePillars,
          tone: { does: draft.does, donts: draft.donts },
          positioning: draft.positioning,
        },
        // Selected campaigns start in a single phase; phases are edited later.
        phases: draft.campaignIds.length
          ? [{
            name: 'Phase 1',
            dates: draft.timeframe || 'To be scheduled',
            status: 'upcoming',
            goal: 'First wave of campaigns for this strategy.',
            campaignIds: draft.campaignIds,
          }]
          : [],
        kpis: draft.kpis.map((k) => ({ ...k, progress: 0 })),
        advice: [],
      },
      ...list,
    ])
  }

  // Strategy views hand off to campaign management through these two.
  const goToCampaigns = () => {
    setPage('campaigns')
    window.scrollTo(0, 0)
  }

  return (
    <div className="app">
      <Sidebar page={page} onNav={setPage} />
      <div className="main">
        <Topbar onNewCampaign={() => setCampaignModal({})} />

        {page === 'home' && <Home onNav={setPage} onNewCampaign={() => setCampaignModal({})} />}
        {page === 'campaigns' && (
          <Campaigns onOpenCampaign={openCampaign} onNewCampaign={(preset) => setCampaignModal(preset || {})} />
        )}
        {page === 'cdetail' && (
          <CampaignDetail campaignId={campaignId} onBack={() => setPage('campaigns')} />
        )}
        {page === 'strategy' && (
          <Strategy
            strategies={strategies}
            onCreateStrategy={createStrategy}
            onOpenStrategy={openStrategy}
            onOpenCampaign={openCampaign}
            onOpenCampaigns={goToCampaigns}
          />
        )}
        {page === 'sdetail' && (
          <StrategyDetail
            strategies={strategies}
            strategyId={strategyId}
            onBack={() => setPage('strategy')}
            onOpenCampaign={openCampaign}
            onOpenCampaigns={goToCampaigns}
          />
        )}
        {page === 'analytics' && <Analytics />}
        {page === 'demographics' && <DemographicAnalysis />}
        {page === 'ai' && <StrategistAI />}
        {page === 'products' && <Products onAddProduct={() => setProductModal(true)} />}
        {page === 'profile' && <Profile />}
      </div>

      {campaignModal && <CampaignModal preset={campaignModal} onClose={() => setCampaignModal(null)} />}
      {productModal && <ProductModal onClose={() => setProductModal(false)} />}
    </div>
  )
}
