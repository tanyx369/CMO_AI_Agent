import { useState } from 'react'
import { FaPlus, FaMagnifyingGlass, FaPen, FaCheck, FaWandMagicSparkles } from 'react-icons/fa6'
import { PRODUCTS, AI_DESCRIPTIONS } from '../data'

function ProductItem({ product, aiDesc }) {
  const [desc, setDesc] = useState(product.desc)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(product.desc)

  function startEdit() {
    setDraft(desc)
    setEditing(true)
  }
  function save() {
    setDesc(draft.trim())
    setEditing(false)
  }
  function aiImprove() {
    setDraft('Improving with AI…')
    setTimeout(() => setDraft(aiDesc), 1500)
  }

  return (
    <div className="pi">
      <div className="pi-hdr">
        <div>
          <div className="pi-name">{product.name}</div>
          <div className="pi-sku">{product.sku}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className={'tag ' + product.statusCls}>{product.status}</span>
          <button className="btn btn-g btn-sm" onClick={startEdit}><FaPen /> Edit</button>
        </div>
      </div>

      {!editing ? (
        <div className="pi-desc">{desc}</div>
      ) : (
        <div>
          <textarea className="edf" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-p btn-sm" onClick={save}><FaCheck /> Save</button>
            <button className="btn btn-g btn-sm" onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn btn-g btn-sm" onClick={aiImprove}><FaWandMagicSparkles /> AI improve</button>
          </div>
        </div>
      )}

      <div className="pi-stats" style={{ marginTop: 12 }}>
        {product.stats.map((s, i) => (
          <div className="ps" key={i}><strong>{s.v}</strong> {s.l}</div>
        ))}
      </div>
    </div>
  )
}

export default function Products({ onAddProduct }) {
  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 4 }}>Product Catalog</h1>
          <p style={{ color: 'var(--t2)', fontSize: 14 }}>Keep product descriptions sharp — they power AI-generated campaigns.</p>
        </div>
        <button className="btn btn-p" onClick={onAddProduct}><FaPlus /> Add Product</button>
      </div>

      <div className="frow" style={{ marginBottom: 20 }}>
        <FaMagnifyingGlass style={{ color: 'var(--t2)' }} />
        <input
          type="text"
          placeholder="Search products..."
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '7px 12px', color: 'var(--text)', fontFamily: 'Inter, sans-serif', fontSize: 13, outline: 'none', width: 240 }}
        />
        <select className="fsel"><option>All Categories</option><option>Wearables</option><option>Audio</option><option>Fitness</option></select>
      </div>

      <div className="pl">
        {PRODUCTS.map((p, i) => (
          <ProductItem key={p.id} product={p} aiDesc={AI_DESCRIPTIONS[i]} />
        ))}
      </div>
    </div>
  )
}
