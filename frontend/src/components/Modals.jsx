import { useState } from 'react'
import {
  FaXmark, FaWandMagicSparkles, FaPlus, FaStore, FaGlobe,
  FaLayerGroup, FaFileLines,
} from 'react-icons/fa6'
import { PHYSICAL_TYPES } from '../data'

function Overlay({ onClose, children }) {
  return (
    <div className="mo" onClick={(e) => { if (e.target.classList.contains('mo')) onClose() }}>
      {children}
    </div>
  )
}

const PLATFORMS = [
  { name: 'Instagram', checked: true },
  { name: 'TikTok', checked: false },
  { name: 'Google', checked: true },
  { name: 'YouTube', checked: false },
  { name: 'Email', checked: false },
]

const SINGLE_PLATFORMS = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'LinkedIn', 'X / Twitter']

/** Selectable card used for the Physical/Online and Single/Campaign switches. */
function TypeCard({ active, onClick, icon: Icon, title, desc }) {
  return (
    <button type="button" className={'type-card' + (active ? ' active' : '')} onClick={onClick}>
      <span className="type-card-hd"><Icon style={{ fontSize: 13 }} /> {title}</span>
      <span className="type-card-desc">{desc}</span>
    </button>
  )
}

export function CampaignModal({ onClose, preset = {} }) {
  // A preset (e.g. from an AI suggestion) can pre-select the campaign type
  const [category, setCategory] = useState(preset.category || 'online')   // 'physical' | 'online'
  const [onlineType, setOnlineType] = useState(preset.onlineType || 'campaign') // 'single' | 'campaign'

  const isPhysical = category === 'physical'
  const isSinglePost = !isPhysical && onlineType === 'single'

  const heading = isPhysical
    ? 'Create physical campaign'
    : isSinglePost ? 'Create single post' : 'Create online campaign'

  const blurb = isPhysical
    ? 'Plan an on-ground activation — APEX AI will draft supporting promotional material.'
    : isSinglePost
      ? 'Publish one post to a single platform. APEX AI will draft the copy and creative.'
      : 'Run a multi-post series across channels. APEX AI will generate content for each.'

  return (
    <Overlay onClose={onClose}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h2>{heading}</h2>
          <button className="btn btn-g btn-ic btn-sm" onClick={onClose}><FaXmark /></button>
        </div>
        <p>{blurb}</p>

        {/* Step 1 — Physical vs Online */}
        <div className="ff">
          <label className="fl2">Campaign category</label>
          <div className="type-grid">
            <TypeCard
              active={isPhysical}
              onClick={() => setCategory('physical')}
              icon={FaStore}
              title="Physical"
              desc="Roadshows, event collaborations, pop-up booths and other on-ground activations."
            />
            <TypeCard
              active={!isPhysical}
              onClick={() => setCategory('online')}
              icon={FaGlobe}
              title="Online"
              desc="Digital content published to social and advertising platforms."
            />
          </div>
        </div>

        {/* Step 2 — Online only: Single post vs Campaign */}
        {!isPhysical && (
          <div className="ff">
            <label className="fl2">Online type</label>
            <div className="type-grid">
              <TypeCard
                active={onlineType === 'single'}
                onClick={() => setOnlineType('single')}
                icon={FaFileLines}
                title="Single Post"
                desc="One standalone post on a single platform."
              />
              <TypeCard
                active={onlineType === 'campaign'}
                onClick={() => setOnlineType('campaign')}
                icon={FaLayerGroup}
                title="Campaign"
                desc="A multi-post series running across platforms."
              />
            </div>
          </div>
        )}

        <div className="dvd" style={{ margin: '20px 0 18px' }} />

        {/* Shared */}
        <div className="ff">
          <label className="fl2">{isSinglePost ? 'Post name' : 'Campaign name'}</label>
          <input
            type="text"
            className="fi"
            defaultValue={preset.name || ''}
            key={preset.name || 'blank'}
            placeholder={isPhysical ? 'e.g. KLCC Launch Roadshow' : isSinglePost ? 'e.g. Watch Teaser Post' : 'e.g. Back to School 2026'}
          />
        </div>
        <div className="ff">
          <label className="fl2">Product</label>
          <select className="fi">
            <option>APEX Smart Watch Series 5</option>
            <option>APEX Air Earbuds Pro</option>
            <option>APEX Fitness Tracker Lite</option>
          </select>
        </div>

        {/* -------------------------- PHYSICAL -------------------------- */}
        {isPhysical && (
          <>
            <div className="g2" style={{ gap: 10, marginBottom: 16 }}>
              <div className="ff" style={{ margin: 0 }}>
                <label className="fl2">Event type</label>
                <select className="fi">
                  {PHYSICAL_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="ff" style={{ margin: 0 }}>
                <label className="fl2">Expected attendance</label>
                <input type="text" className="fi" placeholder="e.g. 25,000" />
              </div>
            </div>
            <div className="ff">
              <label className="fl2">Venue / location</label>
              <input type="text" className="fi" placeholder="e.g. Suria KLCC, Concourse Level" />
            </div>
            <div className="ff">
              <label className="fl2">Partner / collaborator</label>
              <input type="text" className="fi" placeholder="e.g. FitFest Asia (leave blank if none)" />
            </div>
            <div className="g2" style={{ gap: 10, marginBottom: 16 }}>
              <div className="ff" style={{ margin: 0 }}><label className="fl2">Start date</label><input type="date" className="fi" defaultValue="2026-09-01" /></div>
              <div className="ff" style={{ margin: 0 }}><label className="fl2">End date</label><input type="date" className="fi" defaultValue="2026-09-04" /></div>
            </div>
            <div className="ff">
              <label className="fl2">Budget</label>
              <input type="text" className="fi" placeholder="$0.00" />
            </div>
          </>
        )}

        {/* --------------------- ONLINE — SINGLE POST -------------------- */}
        {isSinglePost && (
          <>
            <div className="g2" style={{ gap: 10, marginBottom: 16 }}>
              <div className="ff" style={{ margin: 0 }}>
                <label className="fl2">Platform</label>
                <select className="fi">
                  {SINGLE_PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="ff" style={{ margin: 0 }}>
                <label className="fl2">Content type</label>
                <select className="fi">
                  <option>Image post</option><option>Video / Reel</option>
                  <option>Carousel</option><option>Story</option><option>Text only</option>
                </select>
              </div>
            </div>
            <div className="g2" style={{ gap: 10, marginBottom: 16 }}>
              <div className="ff" style={{ margin: 0 }}><label className="fl2">Publish date</label><input type="date" className="fi" defaultValue="2026-09-01" /></div>
              <div className="ff" style={{ margin: 0 }}><label className="fl2">Publish time</label><input type="time" className="fi" defaultValue="18:00" /></div>
            </div>
            <div className="ff">
              <label className="fl2">Boost budget (optional)</label>
              <input type="text" className="fi" placeholder="$0.00" />
            </div>
          </>
        )}

        {/* ---------------------- ONLINE — CAMPAIGN ---------------------- */}
        {!isPhysical && !isSinglePost && (
          <>
            <div className="g2" style={{ gap: 10, marginBottom: 16 }}>
              <div className="ff" style={{ margin: 0 }}><label className="fl2">Start date</label><input type="date" className="fi" defaultValue="2026-09-01" /></div>
              <div className="ff" style={{ margin: 0 }}><label className="fl2">End date</label><input type="date" className="fi" defaultValue="2026-09-30" /></div>
            </div>
            <div className="ff">
              <label className="fl2">Platforms</label>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 4 }}>
                {PLATFORMS.map((p) => (
                  <label key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked={p.checked} /> {p.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="ff">
              <label className="fl2">Budget</label>
              <input type="text" className="fi" placeholder="$0.00" />
            </div>
          </>
        )}

        <div className="ff">
          <label className="fl2">{isPhysical ? 'Event objective' : 'Campaign goal'}</label>
          <textarea
            className="fta"
            placeholder={isPhysical
              ? 'Describe the objective, target visitors, and on-site experience...'
              : 'Describe the goal, target audience, and key messages...'}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-g" onClick={onClose}>Cancel</button>
          <button className="btn btn-p" onClick={onClose}>
            <FaWandMagicSparkles /> {isPhysical ? 'Create event' : 'Generate & Create'}
          </button>
        </div>
      </div>
    </Overlay>
  )
}

export function ProductModal({ onClose }) {
  return (
    <Overlay onClose={onClose}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h2>Add product</h2>
          <button className="btn btn-g btn-ic btn-sm" onClick={onClose}><FaXmark /></button>
        </div>
        <p>Add product details to power AI-generated campaigns and copy.</p>

        <div className="ff"><label className="fl2">Product name</label><input type="text" className="fi" placeholder="e.g. APEX Sport Band 2" /></div>
        <div className="g2" style={{ gap: 10, marginBottom: 16 }}>
          <div className="ff" style={{ margin: 0 }}><label className="fl2">SKU</label><input type="text" className="fi" placeholder="SKU-004" /></div>
          <div className="ff" style={{ margin: 0 }}><label className="fl2">Category</label><select className="fi"><option>Wearables</option><option>Audio</option><option>Fitness</option></select></div>
        </div>
        <div className="ff"><label className="fl2">Price</label><input type="text" className="fi" placeholder="$0.00" /></div>
        <div className="ff"><label className="fl2">Product description</label><textarea className="fta" rows={4} placeholder="Describe key features, target audience, and unique selling points..." /></div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-g" onClick={onClose}>Cancel</button>
          <button className="btn btn-p" onClick={onClose}><FaPlus /> Add product</button>
        </div>
      </div>
    </Overlay>
  )
}
