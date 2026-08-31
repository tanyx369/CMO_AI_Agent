import { useState } from 'react'
import {
  FaUser, FaPen, FaCheck, FaRobot, FaAlignLeft, FaImage, FaMusic, FaVideo,
  FaCircleCheck, FaArrowRotateLeft, FaCircleInfo, FaBolt, FaCoins, FaStar,
} from 'react-icons/fa6'
import { MODEL_GROUPS, MODELS, findModel } from '../modelData'
import { useModels, useProfile, resetModels, setModel, updateProfile } from '../settingsStore'

const GROUP_ICON = { text: FaAlignLeft, image: FaImage, audio: FaMusic, video: FaVideo }

const FIELDS = [
  { key: 'name', label: 'Full name' },
  { key: 'role', label: 'Role' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'organization', label: 'Organization' },
  { key: 'timezone', label: 'Timezone' },
]

/* ------------------------------------------------------------------ */
/* Account details                                                     */
/* ------------------------------------------------------------------ */

function AccountCard() {
  const profile = useProfile()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)

  function startEdit() {
    setDraft(profile)
    setEditing(true)
  }
  function save() {
    const name = draft.name.trim() || profile.name
    // Keep the avatar initials in step with the name.
    const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    updateProfile({ ...draft, name, initials })
    setEditing(false)
  }

  return (
    <div className="det-sec">
      <div className="det-sec-title" style={{ justifyContent: 'space-between' }}>
        <span><FaUser /> Account</span>
        {!editing && (
          <button className="btn btn-g btn-sm" onClick={startEdit}><FaPen /> Edit</button>
        )}
      </div>

      <div className="prof-head">
        <div className="prof-avatar">{profile.initials}</div>
        <div>
          <div className="prof-name">{profile.name}</div>
          <div className="prof-role">{profile.role} · {profile.organization}</div>
          <div className="prof-email">{profile.email}</div>
        </div>
      </div>

      {editing ? (
        <>
          <div className="prof-form">
            {FIELDS.map((f) => (
              <label className="prof-field" key={f.key}>
                <span className="fl2">{f.label}</span>
                <input
                  className="fi"
                  type={f.type || 'text'}
                  value={draft[f.key]}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                />
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn btn-p btn-sm" onClick={save}><FaCheck /> Save changes</button>
            <button className="btn btn-g btn-sm" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <div className="prof-form prof-readonly">
          {FIELDS.map((f) => (
            <div className="prof-field" key={f.key}>
              <span className="fl2">{f.label}</span>
              <div className="prof-value">{profile[f.key]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Model selection                                                     */
/* ------------------------------------------------------------------ */

function ModelGroup({ group }) {
  const models = useModels()
  const selectedId = models[group.id]
  const Icon = GROUP_ICON[group.icon] || FaRobot

  return (
    <div className="model-group">
      <div className="model-group-head">
        <span className="model-group-ico"><Icon /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="model-group-name">{group.label}</div>
          <div className="model-group-blurb">
            {group.blurb}
            {group.note && <em className="model-group-note"> {group.note}</em>}
          </div>
        </div>
      </div>

      <div className="model-list">
        {MODELS[group.id].map((m) => {
          const active = m.id === selectedId
          return (
            <button
              key={m.id}
              type="button"
              className={'model-card' + (active ? ' active' : '')}
              onClick={() => setModel(group.id, m.id)}
              aria-pressed={active}
            >
              <span className="model-check">{active && <FaCircleCheck />}</span>
              <span className="model-main">
                <span className="model-name">
                  {m.name}
                  {m.wired && <span className="model-wired" title="Currently connected to the backend">connected</span>}
                </span>
                <span className="model-provider">{m.provider}</span>
                <span className="model-blurb">{m.blurb}</span>
                <span className="model-specs">
                  <span><FaBolt style={{ fontSize: 9 }} /> {m.speed}</span>
                  <span><FaCoins style={{ fontSize: 9 }} /> {m.cost}</span>
                  <span><FaStar style={{ fontSize: 9 }} /> {m.quality}</span>
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ModelSettings() {
  const models = useModels()

  return (
    <div className="det-sec" style={{ marginBottom: 0 }}>
      <div className="det-sec-title" style={{ justifyContent: 'space-between' }}>
        <span><FaRobot /> AI Models</span>
        <button className="btn btn-g btn-sm" onClick={resetModels}>
          <FaArrowRotateLeft /> Reset to defaults
        </button>
      </div>

      <div className="model-note">
        <FaCircleInfo style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          Your choice is saved on this device and sent with every generation request.
          Models marked <strong>connected</strong> are the ones the backend calls today —
          the others are stored as a preference until the server reads the field.
        </span>
      </div>

      <div className="model-summary">
        {MODEL_GROUPS.map((g) => {
          const m = findModel(g.id, models[g.id])
          return (
            <div className="model-sum" key={g.id}>
              <span className="model-sum-l">{g.label}</span>
              <span className="model-sum-v">{m ? m.name : '—'}</span>
            </div>
          )
        })}
      </div>

      {MODEL_GROUPS.map((g) => <ModelGroup group={g} key={g.id} />)}
    </div>
  )
}

/* ------------------------------------------------------------------ */

export default function Profile() {
  return (
    <div className="page">
      <div className="ph">
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 4 }}>
          Profile &amp; Settings
        </h1>
        <p style={{ color: 'var(--t2)', fontSize: 14 }}>
          Your account details, and which AI model generates each kind of content.
        </p>
      </div>

      <AccountCard />
      <ModelSettings />
    </div>
  )
}
