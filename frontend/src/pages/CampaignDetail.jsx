import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FaArrowLeft, FaWandMagicSparkles, FaChartBar, FaClipboardCheck,
  FaAlignLeft, FaImage, FaMusic, FaVideo,
  FaCheck, FaXmark, FaPen, FaPlay, FaInbox,
  FaHeart, FaComment, FaShareNodes, FaEye, FaBookmark,
  FaArrowPointer, FaChartLine, FaClock, FaFaceSmile, FaFaceMeh, FaFaceFrown,
  FaRoute, FaTableList, FaWandMagicSparkles as FaWand,
  FaChevronDown, FaCircleCheck, FaTriangleExclamation, FaLightbulb,
  FaFlagCheckered, FaRotate, FaLock,
} from 'react-icons/fa6'
import { CAMPAIGNS } from '../data'
import CampaignPlan from '../components/CampaignPlan'
import PostTracker from '../components/PostTracker'
import ContentGenerator from '../components/ContentGenerator'
import { CAMPAIGN_POSTS } from '../postData'
import { CAMPAIGN_STATUSES, ENDED, buildCampaignReview } from '../campaignSummaryData'

// The Plan panel only applies to multi-post online campaigns, so it is added
// conditionally in the component below.
const PLAN_PANEL = { id: 'plan', label: 'Campaign Plan', icon: FaRoute }
// The AI planner sits directly beside the plan and shares its state.
const PLANNER_PANEL = { id: 'planner', label: 'AI Planner', icon: FaWand }

// Online campaigns track individual posts; physical ones keep the review queue.
const POSTS_PANEL = { id: 'posts', label: 'Post Tracker', icon: FaTableList }
const REVIEW_PANEL = { id: 'review', label: 'Review Queue', icon: FaClipboardCheck }
// Only offered once the campaign is marked Ended.
const SUMMARY_PANEL = { id: 'summary', label: 'AI Summary', icon: FaFlagCheckered }

const BASE_PANELS = [
  { id: 'gen', label: 'Content Generator', icon: FaWandMagicSparkles },
  { id: 'eng', label: 'Engagement & Reactions', icon: FaChartBar },
]

const TYPE_ICON = { Text: FaAlignLeft, Image: FaImage, Audio: FaMusic, Video: FaVideo }

function AudioWave({ count = 40 }) {
  const bars = useMemo(
    () => Array.from({ length: count }, (_, i) => 20 + Math.sin(i * 0.7) * 14 + Math.random() * 10),
    [count]
  )
  return (
    <div className="audio-wave">
      {bars.map((h, i) => <div className="audio-bar" key={i} style={{ height: h }} />)}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Status control                                                      */
/* ------------------------------------------------------------------ */

/** Dropdown in the hero for moving a campaign through its lifecycle. */
function StatusMenu({ status, onChange }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = CAMPAIGN_STATUSES.find((s) => s.id === status) || CAMPAIGN_STATUSES[0]

  return (
    <div className="status-menu" ref={wrapRef}>
      <button
        className={'status-trigger st-' + current.cls + (open ? ' is-open' : '')}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="status-dot" />
        {current.label}
        <FaChevronDown style={{ fontSize: 9, opacity: 0.8 }} />
      </button>

      {open && (
        <div className="status-pop" role="listbox">
          <div className="status-pop-hd">Campaign status</div>
          {CAMPAIGN_STATUSES.map((s) => (
            <button
              key={s.id}
              role="option"
              aria-selected={s.id === status}
              className={'status-opt' + (s.id === status ? ' active' : '')}
              onClick={() => { onChange(s.id); setOpen(false) }}
            >
              <span className={'status-swatch sw-' + s.cls} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="status-opt-name">{s.label}</span>
                <span className="status-opt-blurb">{s.blurb}</span>
              </span>
              {s.id === status && <FaCheck style={{ fontSize: 10, color: 'var(--accent)' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Post-campaign AI summary                                            */
/* ------------------------------------------------------------------ */

function CampaignSummary({ campaign }) {
  const [variant, setVariant] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [review, setReview] = useState(() => buildCampaignReview(campaign, 0))
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  function regenerate() {
    clearTimeout(timer.current)
    setGenerating(true)
    const next = variant + 1
    timer.current = setTimeout(() => {
      setReview(buildCampaignReview(campaign, next))
      setVariant(next)
      setGenerating(false)
    }, 1800)
  }

  return (
    <div className="det-sec">
      <div className="det-sec-title" style={{ justifyContent: 'space-between' }}>
        <span><FaFlagCheckered /> Post-Campaign AI Summary</span>
        <button className="btn btn-g btn-sm" onClick={regenerate} disabled={generating}>
          {generating
            ? <><span className="gen-spinner" style={{ width: 12, height: 12 }} /> Reviewing…</>
            : <><FaRotate /> Regenerate</>}
        </button>
      </div>

      {generating ? (
        <div className="empty-state" style={{ border: 'none', padding: '44px 16px' }}>
          <span className="gen-spinner" /> Reviewing the full campaign…
        </div>
      ) : (
        <>
          <div className="cs-head">
            <div className="cs-grade">{review.grade}</div>
            <div>
              <div className="cs-verdict">{review.verdict}</div>
              <p className="cs-summary">{review.summary}</p>
            </div>
          </div>

          {review.metrics.length > 0 && (
            <div className="cs-metrics">
              {review.metrics.map((m) => (
                <div className="cs-metric" key={m.label}>
                  <div className="cs-metric-v">{m.value}</div>
                  <div className="cs-metric-l">{m.label}</div>
                  <div className={'cs-metric-c ' + (m.up ? 'up' : 'dn')}>{m.change}</div>
                </div>
              ))}
            </div>
          )}

          <div className="cs-cols">
            <div>
              <div className="ai-col-title ai-good"><FaCircleCheck /> What worked</div>
              {review.wins.map((w) => (
                <div className="ai-item" key={w.t}>
                  <div className="ai-item-title">{w.t}</div>
                  <div className="ai-item-body">{w.d}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="ai-col-title ai-bad"><FaTriangleExclamation /> What held it back</div>
              {review.issues.map((c) => (
                <div className="ai-item" key={c.t}>
                  <div className="ai-item-title">{c.t}</div>
                  <div className="ai-item-body">{c.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ai-col-title ai-next" style={{ marginTop: 20 }}>
            <FaLightbulb /> Do this on the next campaign
          </div>
          <div className="ai-actions">
            {review.advice.map((a, i) => (
              <div className="ai-action" key={a.t}>
                <span className="ai-action-n">{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div className="ai-item-title">
                    {a.t}
                    <span className={'ai-pri pri-' + a.p}>{a.p}</span>
                  </div>
                  <div className="ai-item-body">{a.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="ai-foot">
            Review of {campaign.title} · {campaign.meta} · generated {review.generatedAt}
          </div>
        </>
      )}
    </div>
  )
}

export default function CampaignDetail({ campaignId, onBack }) {
  const campaign = CAMPAIGNS.find((c) => c.id === campaignId) || CAMPAIGNS[0]

  // Only online multi-post campaigns get a plan panel
  const hasPlan = campaign.category === 'online' && campaign.onlineType === 'campaign'
  // Every online campaign — single post or series — tracks its posts.
  const isOnline = campaign.category === 'online'
  const [panel, setPanel] = useState(hasPlan ? 'plan' : 'gen')
  // Lifecycle status is editable from the hero; Ended unlocks the AI summary.
  const [status, setStatus] = useState(campaign.status)
  const [reviewItems, setReviewItems] = useState([])
  const [posts, setPosts] = useState([])
  const timerRef = useRef(null)

  // Declared after `status` so the panel list can read it.
  const hasEnded = status === ENDED
  const panels = [
    ...(hasPlan ? [PLAN_PANEL, PLANNER_PANEL] : []),
    ...BASE_PANELS,
    isOnline ? POSTS_PANEL : REVIEW_PANEL,
    // The summary only exists for a finished campaign.
    ...(hasEnded ? [SUMMARY_PANEL] : []),
  ]

  // Moving off Ended while viewing the summary would leave a dead tab selected.
  useEffect(() => {
    if (!hasEnded && panel === 'summary') setPanel(isOnline ? 'posts' : 'review')
  }, [hasEnded, panel, isOnline])

  // Reset everything when the campaign changes
  useEffect(() => {
    setPanel(hasPlan ? 'plan' : 'gen')
    setStatus(campaign.status)
    setReviewItems(campaign.reviewItems.map((r) => ({ ...r })))
    setPosts((CAMPAIGN_POSTS[campaign.id] || []).map((p) => ({ ...p })))
    return () => clearTimeout(timerRef.current)
  }, [campaignId]) // eslint-disable-line react-hooks/exhaustive-deps

  const pendingCount = reviewItems.filter((r) => r.status === 'pending').length
  // Posts still awaiting a decision drive the Post Tracker tab badge.
  const inReviewCount = posts.filter((p) => p.status === 'review').length
  const navBadge = isOnline ? inReviewCount : pendingCount

  function updatePost(id, patch) {
    setPosts((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  function setPostStatus(id, status) {
    setPosts((list) => list.map((p) => {
      if (p.id !== id) return p
      const next = { ...p, status }
      // Publishing stamps the time it went out; restoring clears it again.
      if (status === 'posted' && !next.postedAt) next.postedAt = formatPostedAt(p.date, p.time)
      if (status === 'review' || status === 'pending') delete next.postedAt
      return next
    }))
  }

  /**
   * Receives whatever the generator produced and files it in the right place:
   * online campaigns collect posts, physical ones use the review queue.
   * `result` carries the API payload (url/id) once the backend is wired up.
   */
  function acceptGenerated({ type, text, result }) {
    const typeMap = { text: 'Text', image: 'Image', audio: 'Audio', video: 'Video', email: 'Email' }
    if (isOnline) {
      const today = new Date()
      setPosts((list) => [
        {
          id: 'new-' + Date.now(),
          title: 'Untitled ' + typeMap[type].toLowerCase() + ' post',
          media: ['image', 'video', 'audio'].includes(type) ? type : null,
          caption: text || 'Add a caption for this post.',
          mediaUrl: result?.url || null,
          // An email post belongs on the Email channel, not a social one.
          platform: type === 'email' ? 'Email' : 'Instagram',
          date: today.toISOString().slice(0, 10),
          time: '18:00',
          status: 'review',
        },
        ...list,
      ])
    } else {
      setReviewItems((items) => [
        {
          type: typeMap[type],
          typeIcon: type,
          platform: 'Instagram',
          content: type === 'text' ? text : type,
          status: 'pending',
        },
        ...items,
      ])
    }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setPanel(isOnline ? 'posts' : 'review'), 1200)
  }

  function approveReview(idx) {
    setReviewItems((items) => items.map((it, i) => (i === idx ? { ...it, status: 'approved' } : it)))
  }
  function rejectReview(idx) {
    setReviewItems((items) => items.map((it, i) => (i === idx ? { ...it, status: 'rejected' } : it)))
  }
  function editReview(idx) {
    const item = reviewItems[idx]
    if (['img', 'image', 'audio', 'video'].includes(item.content)) return
    const next = window.prompt('Edit content:', item.content)
    if (next !== null) {
      setReviewItems((items) => items.map((it, i) => (i === idx ? { ...it, content: next } : it)))
    }
  }


  const engKeys = [
    { l: 'Likes', v: campaign.eng.likes, icon: FaHeart, col: '--pink' },
    { l: 'Comments', v: campaign.eng.comments, icon: FaComment, col: '--accent' },
    { l: 'Shares', v: campaign.eng.shares, icon: FaShareNodes, col: '--green' },
    { l: 'Reach', v: campaign.eng.reach, icon: FaEye, col: '--amber' },
    { l: 'Saves', v: campaign.eng.saves, icon: FaBookmark, col: '--pink' },
    { l: 'CTR', v: campaign.eng.ctr, icon: FaArrowPointer, col: '--accent' },
    { l: 'Eng. Rate', v: campaign.eng.engRate, icon: FaChartLine, col: '--green' },
    { l: 'Avg. Watch', v: campaign.eng.avgWatch, icon: FaClock, col: '--amber' },
  ]

  const s = campaign.sent

  return (
    <div className="page" style={{ padding: 0 }}>
      <div className="cdet-hero" style={{ background: campaign.bg }}>
        <div className="cdet-hero-overlay" />
        <div className="cdet-hero-content">
          <div style={{ padding: '20px 0 16px' }}>
            <button className="back-btn" onClick={onBack} style={{ marginBottom: 10 }}>
              <FaArrowLeft /> Back to campaigns
            </button>
            <div className="cdet-title-row">
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', color: '#fff' }}>
                {campaign.emoji} {campaign.title}
              </div>
              <StatusMenu status={status} onChange={setStatus} />
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{campaign.meta}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 36px 36px' }}>
        {/* KPIs */}
        <div className="g4" style={{ marginBottom: 20, marginTop: 20 }}>
          {campaign.kpis.map((k, i) => (
            <div className="mc" key={i}>
              <div className="ml">{k.l}</div>
              <div className="mv" style={{ fontSize: 22 }}>{k.v}</div>
              <div className={'mch ' + (k.up ? 'up' : 'dn')} style={{ fontSize: 11 }}>{k.ch}</div>
            </div>
          ))}
        </div>

        {/* Section nav */}
        <div className="cdet-nav">
          {panels.map((p) => {
            const Icon = p.icon
            return (
              <button key={p.id} className={'cdet-nav-btn' + (panel === p.id ? ' active' : '')} onClick={() => setPanel(p.id)}>
                <Icon /> {p.label}
                {(p.id === 'review' || p.id === 'posts') && navBadge > 0 && (
                  <span style={{ background: 'var(--accent)', color: 'white', fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 99, marginLeft: 2 }}>
                    {navBadge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* PANEL: CAMPAIGN PLAN
            Kept mounted (just hidden) so the deliverables checklist and planner
            chat survive switching between tabs. */}
        {hasPlan && (
          <div style={{ display: panel === 'plan' || panel === 'planner' ? 'block' : 'none' }}>
            <CampaignPlan campaignId={campaign.id} view={panel === 'planner' ? 'planner' : 'plan'} />
          </div>
        )}

        {/* PANEL: GENERATOR
            All of this lives in components/ContentGenerator.jsx now, so the
            same generator can be dropped on any post or campaign page. */}
        {panel === 'gen' && (
          <ContentGenerator
            campaignId={campaign.id}
            destinationLabel={isOnline ? 'post tracker' : 'review queue'}
            acceptLabel={isOnline ? 'Add to post tracker' : 'Add to review queue'}
            onAccept={acceptGenerated}
          />
        )}

        {/* PANEL: ENGAGEMENT */}
        {panel === 'eng' && (
          <div className="det-sec">
            <div className="det-sec-title"><FaChartBar /> Campaign Engagement &amp; Reactions</div>
            <div className="eng-grid">
              {engKeys.map((ek, i) => {
                const Icon = ek.icon
                return (
                  <div className="eng-card" key={i}>
                    <div className="eng-val" style={{ color: `var(${ek.col})` }}>{ek.v}</div>
                    <div style={{ fontSize: 16, color: `var(${ek.col})`, marginBottom: 4 }}><Icon /></div>
                    <div className="eng-lbl">{ek.l}</div>
                  </div>
                )
              })}
            </div>
            <div className="dvd" style={{ margin: '16px 0' }} />
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div className="sec" style={{ marginBottom: 12 }}>Comment Sentiment</div>
                <div className="sentiment-bar-wrap">
                  <div className="sentiment-label">
                    <span style={{ color: 'var(--green)' }}><FaFaceSmile /> Positive</span>
                    <span style={{ color: 'var(--t2)' }}>{s.pos ? s.pos + '%' : '—'}</span>
                  </div>
                  <div className="sentiment-track">
                    <div className="sent-pos" style={{ width: (s.pos || 0) + '%' }} />
                    <div className="sent-neu" style={{ width: (s.neu || 0) + '%' }} />
                    <div className="sent-neg" style={{ width: (s.neg || 0) + '%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 12 }}>
                  <span style={{ color: 'var(--amber)' }}><FaFaceMeh /> Neutral <strong>{s.neu ? s.neu + '%' : '—'}</strong></span>
                  <span style={{ color: 'var(--red)' }}><FaFaceFrown /> Negative <strong>{s.neg ? s.neg + '%' : '—'}</strong></span>
                </div>
                <div style={{ marginTop: 16 }}>
                  <div className="sec" style={{ marginBottom: 10 }}>Top keywords in comments</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {campaign.keywords.length ? (
                      campaign.keywords.map((k, i) => (
                        <span className={'tag ' + (campaign.kwColors[i] || 'tp')} key={i}>{k}</span>
                      ))
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--t3)', fontStyle: 'italic' }}>No data yet — campaign not live</span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div className="sec" style={{ marginBottom: 10 }}>Recent Comments</div>
                <div className="comment-list">
                  {campaign.comments.length ? (
                    campaign.comments.map((cm, i) => {
                      const sb = cm.sent === 'pos' ? 'sb-pos' : cm.sent === 'neu' ? 'sb-neu' : 'sb-neg'
                      const label = cm.sent === 'pos' ? 'Positive' : cm.sent === 'neu' ? 'Neutral' : 'Negative'
                      return (
                        <div className="comment-item" key={i}>
                          <div className="comment-av" style={{ background: cm.avColor + '22', color: cm.avColor }}>{cm.av}</div>
                          <div className="comment-body">
                            <div className="comment-user">{cm.user}<span className={'sent-badge ' + sb}>{label}</span></div>
                            <div className="comment-text">{cm.text}</div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--t3)', fontStyle: 'italic', padding: '10px 0' }}>No comments yet — campaign not live</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: AI SUMMARY — only once the campaign has ended */}
        {panel === 'summary' && hasEnded && <CampaignSummary campaign={campaign} />}

        {/* PANEL: POST TRACKER — online campaigns */}
        {panel === 'posts' && (
          <div className="det-sec">
            <div className="det-sec-title" style={{ justifyContent: 'space-between' }}>
              <span><FaTableList /> Post Tracker</span>
              <span className="det-sec-note">
                {posts.length} post{posts.length === 1 ? '' : 's'} in this campaign
                {inReviewCount > 0 && ' · ' + inReviewCount + ' awaiting review'}
              </span>
            </div>
            <PostTracker posts={posts} onChange={updatePost} onStatus={setPostStatus} />
          </div>
        )}

        {/* PANEL: REVIEW QUEUE — physical campaigns */}
        {panel === 'review' && (
          <div className="det-sec">
            <div className="det-sec-title" style={{ justifyContent: 'space-between' }}>
              <span><FaClipboardCheck /> Content Review Queue</span>
              <span style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{pendingCount} pending</span>
            </div>
            <ReviewQueue items={reviewItems} onApprove={approveReview} onReject={rejectReview} onEdit={editReview} />
          </div>
        )}
      </div>
    </div>
  )
}

/** Stamp a human-readable publish time from the post's scheduled slot. */
function formatPostedAt(date, time) {
  const d = new Date((date || '') + 'T' + (time || '00:00'))
  if (Number.isNaN(d.getTime())) return 'just now'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function ReviewQueue({ items, onApprove, onReject, onEdit }) {
  if (!items.length) {
    return (
      <div style={{ textAlign: 'center', padding: 32, color: 'var(--t3)', fontSize: 13 }}>
        <FaInbox style={{ fontSize: 28, display: 'block', margin: '0 auto 10px' }} />
        No content in the review queue yet.<br />Generate content above and add it here.
      </div>
    )
  }
  return (
    <div>
      {items.map((item, i) => {
        const approved = item.status !== 'pending'
        const Icon = TYPE_ICON[item.type] || FaAlignLeft
        return (
          <div className={'review-item' + (approved ? ' review-approved' : '')} key={i}>
            <div className="review-hdr">
              <div className="review-type"><Icon style={{ color: 'var(--accent)' }} /> {item.type} · <span style={{ color: 'var(--t2)' }}>{item.platform}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {item.status === 'pending' && <span className="status-pill sp-pending">Pending review</span>}
                {item.status === 'approved' && <span className="status-pill sp-approved"><FaCheck /> Approved</span>}
                {item.status === 'rejected' && <span className="status-pill sp-rejected"><FaXmark /> Rejected</span>}
                {!approved && (
                  <button className="btn btn-g btn-ic btn-sm" onClick={() => onEdit(i)} title="Edit"><FaPen style={{ fontSize: 11 }} /></button>
                )}
              </div>
            </div>
            <div className="review-body"><ReviewBody content={item.content} /></div>
            {!approved && (
              <div className="review-actions">
                <button className="btn btn-gr btn-sm" onClick={() => onApprove(i)}><FaCheck /> Approve &amp; Schedule</button>
                <button className="btn btn-rd btn-sm" onClick={() => onReject(i)}><FaXmark /> Reject</button>
                <select className="fsel" style={{ fontSize: 11, padding: '5px 8px', marginLeft: 'auto' }}>
                  <option>Post now</option><option>Today 6pm</option><option>Tomorrow 9am</option><option>Best time (AI)</option>
                </select>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ReviewBody({ content }) {
  if (content === 'img' || content === 'image') {
    return (
      <>
        <div className="img-mock" style={{ height: 120 }}>🖼️</div>
        <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 8 }}>Generated image · Ready to post</div>
      </>
    )
  }
  if (content === 'audio') {
    return (
      <div className="audio-mock" style={{ padding: 12 }}>
        <button className="btn btn-p btn-ic btn-sm"><FaPlay /></button>
        <AudioWave count={28} />
        <span style={{ fontSize: 11, color: 'var(--t2)' }}>0:30</span>
      </div>
    )
  }
  if (content === 'video') {
    return (
      <div className="video-mock" style={{ height: 100 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(109,94,245,0.25),rgba(232,91,170,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🎬</div>
        <div className="video-play" style={{ position: 'relative' }}><FaPlay style={{ marginLeft: 2 }} /></div>
      </div>
    )
  }
  return (
    <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text)' }}>
      {content.split('\n').map((line, i) => (
        <span key={i}>{line}{i < content.split('\n').length - 1 && <br />}</span>
      ))}
    </div>
  )
}
