import { useMemo, useState } from 'react'
import {
  FaAlignLeft, FaImage, FaVideo, FaMusic, FaPlay, FaPen, FaCheck, FaXmark,
  FaTrash, FaRotateLeft, FaPaperPlane, FaClock, FaShareNodes, FaHeart,
  FaComment, FaInbox, FaCircleInfo,
} from 'react-icons/fa6'
import { POST_STATUSES, PLATFORMS, MEDIA_LABEL } from '../postData'

const MEDIA_ICON = { image: FaImage, video: FaVideo, audio: FaMusic }
const STATUS = Object.fromEntries(POST_STATUSES.map((s) => [s.id, s]))

/** "Sat, Aug 30 · 6:00 PM" from an ISO date + 24h time. */
function formatSlot(date, time) {
  if (!date) return 'No date set'
  const d = new Date(date + 'T' + (time || '00:00'))
  if (Number.isNaN(d.getTime())) return date + (time ? ' · ' + time : '')
  const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  if (!time) return day
  return day + ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function AudioWave({ count = 28 }) {
  const bars = useMemo(
    () => Array.from({ length: count }, (_, i) => 14 + Math.sin(i * 0.7) * 10 + Math.random() * 8),
    [count]
  )
  return (
    <div className="audio-wave">
      {bars.map((h, i) => <div className="audio-bar" key={i} style={{ height: h }} />)}
    </div>
  )
}

/** The media preview that sits above the caption. */
function PostMedia({ media, mediaUrl }) {
  if (media === 'image') {
    // A real file once the generator produced one; the placeholder otherwise.
    return mediaUrl
      ? <img className="post-media" src={mediaUrl} alt="Post image" />
      : <div className="img-mock" style={{ height: 110, marginBottom: 10 }}>🖼️</div>
  }
  if (media === 'video') {
    if (mediaUrl) return <video className="post-media" src={mediaUrl} controls />
    return (
      <div className="video-mock" style={{ height: 100, marginBottom: 10 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg,rgba(109,94,245,0.25),rgba(232,91,170,0.15))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34,
        }}>🎬</div>
        <div className="video-play" style={{ position: 'relative' }}><FaPlay style={{ marginLeft: 2 }} /></div>
      </div>
    )
  }
  if (media === 'audio') {
    if (mediaUrl) return <audio className="post-media" src={mediaUrl} controls />
    return (
      <div className="audio-mock" style={{ padding: 12, marginBottom: 10 }}>
        <button className="btn btn-p btn-ic btn-sm"><FaPlay /></button>
        <AudioWave />
        <span style={{ fontSize: 11, color: 'var(--t2)' }}>0:30</span>
      </div>
    )
  }
  return null
}

/* ------------------------------------------------------------------ */
/* One post                                                            */
/* ------------------------------------------------------------------ */

function PostCard({ post, onChange, onStatus }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(post.caption)

  const st = STATUS[post.status]
  const locked = post.status === 'posted' || post.status === 'deleted'
  const Icon = post.media ? MEDIA_ICON[post.media] : FaAlignLeft
  const typeLabel = post.media ? MEDIA_LABEL[post.media] : 'Text'

  function startEdit() {
    setDraft(post.caption)
    setEditing(true)
  }
  function save() {
    onChange(post.id, { caption: draft })
    setEditing(false)
  }

  return (
    <div className={'post-card ' + st.cls}>
      <div className="post-hdr">
        <span className="post-type"><Icon /></span>
        <div className="post-hdr-main">
          <div className="post-title">{post.title}</div>
          <div className="post-sub">
            {typeLabel} · {post.platform}
            {post.status === 'posted' && post.postedAt && <> · Published {post.postedAt}</>}
          </div>
        </div>
        <span className={'post-status ' + st.cls}>{st.label}</span>
      </div>

      <div className="post-body">
        <PostMedia media={post.media} mediaUrl={post.mediaUrl} />

        {editing ? (
          <div className="post-edit">
            <textarea
              className="edf"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              style={{ marginBottom: 8 }}
              aria-label="Post content"
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-p btn-sm" onClick={save}><FaCheck /> Save</button>
              <button className="btn btn-g btn-sm" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="post-caption">
            {post.caption.split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </div>
        )}

        {post.status === 'deleted' && post.deletedNote && (
          <div className="post-note"><FaCircleInfo style={{ fontSize: 11 }} /> {post.deletedNote}</div>
        )}

        {post.status === 'posted' && post.metrics && (
          <div className="post-metrics">
            <span><FaHeart style={{ color: 'var(--pink)' }} /> {post.metrics.likes}</span>
            <span><FaComment style={{ color: 'var(--accent)' }} /> {post.metrics.comments}</span>
            <span><FaShareNodes style={{ color: 'var(--green)' }} /> {post.metrics.shares}</span>
          </div>
        )}
      </div>

      {/* Scheduling — editable while the post has not gone out */}
      <div className="post-sched">
        {locked ? (
          <span className="post-slot"><FaClock style={{ fontSize: 11 }} /> {formatSlot(post.date, post.time)}</span>
        ) : (
          <>
            <label className="post-field">
              <span>Platform</span>
              <select
                className="fsel"
                value={post.platform}
                onChange={(e) => onChange(post.id, { platform: e.target.value })}
              >
                {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label className="post-field">
              <span>Date</span>
              <input
                type="date"
                className="fsel"
                value={post.date}
                onChange={(e) => onChange(post.id, { date: e.target.value })}
              />
            </label>
            <label className="post-field">
              <span>Time</span>
              <input
                type="time"
                className="fsel"
                value={post.time}
                onChange={(e) => onChange(post.id, { time: e.target.value })}
              />
            </label>
            <span className="post-slot post-slot-preview">
              <FaClock style={{ fontSize: 11 }} /> {formatSlot(post.date, post.time)}
            </span>
          </>
        )}
      </div>

      <div className="post-actions">
        {post.status === 'review' && (
          <>
            <button className="btn btn-gr btn-sm" onClick={() => onStatus(post.id, 'pending')}>
              <FaCheck /> Approve &amp; schedule
            </button>
            <button className="btn btn-g btn-sm" onClick={startEdit}><FaPen /> Edit content</button>
            <button className="btn btn-rd btn-sm" onClick={() => onStatus(post.id, 'deleted')}>
              <FaTrash /> Delete
            </button>
          </>
        )}

        {post.status === 'pending' && (
          <>
            <button className="btn btn-p btn-sm" onClick={() => onStatus(post.id, 'posted')}>
              <FaPaperPlane /> Mark as posted
            </button>
            <button className="btn btn-g btn-sm" onClick={startEdit}><FaPen /> Edit content</button>
            <button className="btn btn-g btn-sm" onClick={() => onStatus(post.id, 'review')}>
              <FaRotateLeft /> Back to review
            </button>
            <button className="btn btn-rd btn-sm" onClick={() => onStatus(post.id, 'deleted')}>
              <FaTrash /> Delete
            </button>
          </>
        )}

        {post.status === 'posted' && (
          <>
            <span className="post-locked">Published — content is locked.</span>
            <button className="btn btn-rd btn-sm" style={{ marginLeft: 'auto' }} onClick={() => onStatus(post.id, 'deleted')}>
              <FaTrash /> Remove
            </button>
          </>
        )}

        {post.status === 'deleted' && (
          <button className="btn btn-g btn-sm" onClick={() => onStatus(post.id, 'review')}>
            <FaRotateLeft /> Restore to review
          </button>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

export default function PostTracker({ posts, onChange, onStatus }) {
  const [filter, setFilter] = useState('all')

  const counts = useMemo(() => {
    const c = { all: posts.length }
    POST_STATUSES.forEach((s) => { c[s.id] = posts.filter((p) => p.status === s.id).length })
    return c
  }, [posts])

  const visible = filter === 'all' ? posts : posts.filter((p) => p.status === filter)

  if (!posts.length) {
    return (
      <div className="empty-state" style={{ border: 'none', padding: '40px 24px' }}>
        <FaInbox style={{ fontSize: 28, display: 'block', margin: '0 auto 10px' }} />
        No posts in this campaign yet.<br />
        Generate content in the Content Generator and add it here.
      </div>
    )
  }

  return (
    <div>
      <div className="post-filters">
        <button
          className={'post-filter' + (filter === 'all' ? ' active' : '')}
          onClick={() => setFilter('all')}
        >
          All <span className="pf-count">{counts.all}</span>
        </button>
        {POST_STATUSES.map((s) => (
          <button
            key={s.id}
            className={'post-filter ' + s.cls + (filter === s.id ? ' active' : '')}
            onClick={() => setFilter(s.id)}
            title={s.hint}
          >
            <span className="pf-dot" /> {s.label} <span className="pf-count">{counts[s.id]}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="empty-state" style={{ border: 'none', padding: '32px 16px' }}>
          No posts with this status.
        </div>
      ) : (
        visible.map((p) => (
          <PostCard key={p.id} post={p} onChange={onChange} onStatus={onStatus} />
        ))
      )}
    </div>
  )
}
