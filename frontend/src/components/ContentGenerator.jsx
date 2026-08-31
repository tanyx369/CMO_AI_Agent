import { useMemo, useRef, useState } from 'react'
import {
  FaWandMagicSparkles, FaAlignLeft, FaImage, FaMusic, FaVideo,
  FaRotateLeft, FaRotate, FaCopy, FaPlus, FaCheck, FaPlay,
  FaTriangleExclamation, FaFloppyDisk, FaEnvelope, FaEnvelopeOpenText,
} from 'react-icons/fa6'
import useContentGenerator from '../hooks/useContentGenerator'
import { PLATFORM_OPTIONS } from '../api/contentApi'
import MarkdownText from './MarkdownText'
import { EMAIL_TYPES } from '../emailData'

/**
 * Reusable AI content generator.
 *
 * Drop it on any campaign or post detail page:
 *
 *   <ContentGenerator
 *     campaignId={campaign.id}
 *     destinationLabel="post tracker"
 *     onAccept={({ type, text, result }) => ...}
 *   />
 *
 * All backend wiring lives in `src/api/contentApi.js` — this component never
 * calls fetch itself, so connecting the API changes nothing here.
 */

const GEN_TABS = [
  { id: 'text', label: 'Text', icon: FaAlignLeft },
  { id: 'image', label: 'Image', icon: FaImage },
  { id: 'audio', label: 'Audio', icon: FaMusic },
  { id: 'video', label: 'Video', icon: FaVideo },
  { id: 'email', label: 'Email', icon: FaEnvelope },
]

const PROMPT_PLACEHOLDER = {
  text: 'e.g. Write a punchy Instagram caption for the Smart Watch launch targeting fitness professionals aged 28–40',
  image: 'e.g. Minimalist product shot of the Smart Watch on a wrist, gym background, bold typography overlay',
  audio: 'e.g. 30-second energetic jingle for Earbuds Pro — upbeat summer vibe, no vocals, modern electronic',
  video: 'e.g. 15-second TikTok reel showing the Smart Watch GPS tracking a morning run, fast cuts, motivational',
  email: 'e.g. Announce the Series 5 to subscribers who bought a Series 3, lead with the battery improvement',
}

const LOADING_LABEL = {
  text: 'Writing copy variants…',
  image: 'Generating image…',
  audio: 'Composing audio…',
  video: 'Rendering video…',
  email: 'Drafting subject lines and copy…',
}

/** `value` is what the API receives; `label` is what the user sees. */
const asOptions = (labels) => labels.map((l) => ({ value: l, label: l }))

const OPTION_CHOICES = {
  // Platform is a backend enum, so the wire value differs from the label.
  platform: PLATFORM_OPTIONS,
  format: asOptions(['Ad Copy', 'Caption', 'Headline', 'CTA', 'Script']),
  tone: asOptions(['Energetic', 'Professional', 'Playful', 'Urgent', 'Minimal']),
  emailType: EMAIL_TYPES.map((t) => ({ value: t.id, label: t.label })),
}

/**
 * Which dropdowns each content type shows.
 *
 * Email has no platform or copy format — it picks a kind of email instead, so
 * showing the social platform list there would be noise.
 */
const OPTIONS_FOR_TYPE = {
  email: ['tone'],
  default: ['platform', 'format', 'tone'],
}

function AudioWave({ count = 40 }) {
  const bars = useMemo(
    () => Array.from({ length: count }, (_, i) => 20 + Math.sin(i * 0.7) * 14 + Math.random() * 10),
    [count],
  )
  return (
    <div className="audio-wave">
      {bars.map((h, i) => <div className="audio-bar" key={i} style={{ height: h }} />)}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Output renderer                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Where the file landed on the server.
 *
 * Shown only when the response gave us nothing renderable, so a successful
 * generation still has visible proof. It disappears on its own once the API
 * returns a loadable image.
 */
function SavedPath({ result }) {
  const path = result.meta?.savedPath
  if (!path || result.url) return null
  return (
    <div className="gen-saved-path" title={path}>
      <FaFloppyDisk style={{ flexShrink: 0 }} />
      <span>Saved on the server — <code>{path}</code></span>
    </div>
  )
}

/**
 * The generated image.
 *
 * Shows a shimmer while the file downloads from the /media mount, then swaps in
 * the real image. If the URL 404s (wrong mount path, file not written) it falls
 * back to the placeholder and surfaces the path rather than showing a broken
 * image icon, so the failure is diagnosable.
 */
function ImagePreview({ result }) {
  const [state, setState] = useState(result.url ? 'loading' : 'none')

  // A new generation resets the loader.
  const urlRef = useRef(result.url)
  if (urlRef.current !== result.url) {
    urlRef.current = result.url
    setState(result.url ? 'loading' : 'none')
  }

  const showImage = state === 'loading' || state === 'loaded'

  return (
    <>
      {showImage ? (
        <div className={'gen-media-wrap' + (state === 'loading' ? ' is-loading' : '')}>
          <img
            className="gen-media"
            src={result.url}
            alt={result.prompt || 'Generated image'}
            onLoad={() => setState('loaded')}
            onError={() => setState('failed')}
          />
        </div>
      ) : (
        <div className="img-mock">{result.meta?.emoji || '🖼️'}</div>
      )}

      <div style={{ fontSize: 12, color: 'var(--t2)' }}>
        Generated from your prompt
        {result.prompt && (
          <>
            <br />
            <em style={{ fontSize: 11, color: 'var(--t3)' }}>
              "{result.prompt.slice(0, 60)}{result.prompt.length > 60 ? '…' : ''}"
            </em>
          </>
        )}
      </div>

      {state === 'failed' && (
        <div className="gen-media-warn">
          <FaTriangleExclamation style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            The file was generated but could not be loaded from <code>{result.url}</code>.
            Check that the API serves that folder.
          </span>
        </div>
      )}

      <SavedPath result={result} />
    </>
  )
}

/**
 * The generated email, laid out the way an inbox shows one: subject, preview
 * text, then the body. Both subject lines are offered so the user can A/B them.
 */
function EmailPreview({ result }) {
  const email = result.meta?.email
  if (!email) {
    return <span className="gen-text">{result.text}</span>
  }

  return (
    <div className="email-preview">
      <div className="email-head">
        <span className="email-kind"><FaEnvelopeOpenText style={{ fontSize: 10 }} /> {email.typeLabel}</span>
        {email.meta?.audience && <span className="email-meta">{email.meta.audience}</span>}
        {email.meta?.send && <span className="email-meta">{email.meta.send}</span>}
      </div>

      <div className="email-field">
        <span className="email-label">Subject line</span>
        {email.subjects.map((sub, i) => (
          <div className="email-subject" key={i}>
            <span className="email-variant">{String.fromCharCode(65 + i)}</span>
            {sub}
          </div>
        ))}
      </div>

      <div className="email-field">
        <span className="email-label">Preview text</span>
        <div className="email-preheader">{email.preheader}</div>
      </div>

      <div className="email-body">
        <MarkdownText text={email.body} />
        <button className="email-cta" type="button" disabled>{email.cta.label}</button>
        {email.cta.note && <div className="email-cta-note">{email.cta.note}</div>}
      </div>
    </div>
  )
}

/**
 * Renders whatever the API returned. Each branch prefers real media (`url`) and
 * falls back to a placeholder when it is absent — so the moment the backend
 * starts returning URLs, real images and video appear here with no code change.
 */
function GeneratedOutput({ result }) {
  if (!result) return null

  if (result.kind === 'text') {
    // `html` only ever comes from local mock data, so it is safe to inject.
    // Anything from the API lands in `text` and renders escaped, preserving the
    // model's own line breaks via pre-wrap.
    if (result.html) return <span dangerouslySetInnerHTML={{ __html: result.html }} />
    // Model output is markdown-ish; MarkdownText formats it as React elements
    // (never HTML), so headings, lists and bold render instead of showing raw
    // `##` and `**`. Copy and "add to tracker" still use the raw text.
    if (result.text?.trim()) return <MarkdownText text={result.text} className="gen-text" />
    return (
      <span className="gen-placeholder">
        The request succeeded but the model returned no text. Try rephrasing the prompt.
      </span>
    )
  }

  if (result.kind === 'email') {
    return <EmailPreview result={result} />
  }

  if (result.kind === 'image') {
    return <ImagePreview result={result} />
  }

  if (result.kind === 'audio') {
    return (
      <>
        {result.url ? (
          <audio className="gen-media" src={result.url} controls />
        ) : (
          <div className="audio-mock">
            <button className="btn btn-p btn-ic btn-sm" type="button"><FaPlay /></button>
            <AudioWave count={40} />
            <span style={{ fontSize: 12, color: 'var(--t2)', whiteSpace: 'nowrap' }}>0:30</span>
          </div>
        )}
        <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 10 }}>
          Audio clip · generated from your prompt
        </div>
      </>
    )
  }

  // video
  return (
    <>
      {result.url ? (
        <video className="gen-media" src={result.url} controls />
      ) : (
        <div className="video-mock">
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg,rgba(109,94,245,0.3),rgba(232,91,170,0.2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48,
          }}>⌚</div>
          <div className="video-play" style={{ position: 'relative' }}><FaPlay style={{ marginLeft: 2 }} /></div>
        </div>
      )}
      <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 10 }}>
        Video · generated from your prompt
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Panel                                                                     */
/* -------------------------------------------------------------------------- */

export default function ContentGenerator({
  campaignId,
  onAccept,
  acceptLabel = 'Add to review queue',
  destinationLabel = 'review queue',
  title = 'AI Content Generator',
  types = GEN_TABS,
}) {
  const gen = useContentGenerator({ campaignId })
  const [copied, setCopied] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const outputRef = useRef(null)

  // Plain text of whatever is on screen — covers rich HTML too.
  function currentText() {
    return gen.result?.text || outputRef.current?.innerText || ''
  }

  function copy() {
    navigator.clipboard?.writeText(currentText()).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function accept() {
    onAccept?.({ type: gen.type, text: currentText(), result: gen.result })
    setAccepted(true)
    setTimeout(() => setAccepted(false), 1200)
  }

  const hint = (() => {
    if (gen.isGenerating) return null
    if (gen.status === 'error') return 'Generation failed — adjust the prompt and try again'
    if (gen.isDone) {
      return gen.type === 'text'
        ? `Review the content above, then add to ${destinationLabel}`
        : `Preview above — add to ${destinationLabel} when ready`
    }
    return 'Press Generate to create content with AI'
  })()

  return (
    <div className="det-sec">
      <div className="det-sec-title"><FaWandMagicSparkles /> {title}</div>

      <div className="gen-tabs">
        {types.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              type="button"
              className={'gen-tab' + (gen.type === t.id ? ' active' : '')}
              onClick={() => gen.changeType(t.id)}
            >
              <Icon /> {t.label}
            </button>
          )
        })}
      </div>

      {gen.type === 'email' && (
        <div className="email-types">
          <span className="email-types-label">What kind of email?</span>
          <div className="email-type-grid">
            {EMAIL_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={'email-type' + (gen.options.emailType === t.id ? ' active' : '')}
                onClick={() => gen.setOption('emailType', t.id)}
                aria-pressed={gen.options.emailType === t.id}
              >
                <span className="email-type-name">{t.label}</span>
                <span className="email-type-blurb">{t.blurb}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        {(OPTIONS_FOR_TYPE[gen.type] || OPTIONS_FOR_TYPE.default).map((key) => (
          <select
            key={key}
            className="fsel"
            style={{ fontSize: 12, padding: '6px 10px' }}
            value={gen.options[key]}
            onChange={(e) => gen.setOption(key, e.target.value)}
            aria-label={key}
          >
            {OPTION_CHOICES[key].map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        ))}
      </div>

      <textarea
        className="prompt-area"
        value={gen.prompt}
        onChange={(e) => gen.setPrompt(e.target.value)}
        placeholder={PROMPT_PLACEHOLDER[gen.type]}
        style={gen.promptInvalid ? { borderColor: 'var(--red)' } : undefined}
      />

      <div className="prompt-actions">
        <button className="btn btn-p" type="button" onClick={gen.generate} disabled={gen.isGenerating}>
          <FaWandMagicSparkles /> Generate
        </button>
        <button className="btn btn-g btn-sm" type="button" onClick={gen.reset}>
          <FaRotateLeft /> Clear
        </button>
        <span style={{ fontSize: 12, color: 'var(--t3)', marginLeft: 'auto' }}>
          {gen.isGenerating
            ? <><span className="gen-spinner" /> Generating with AI…</>
            : hint}
        </span>
      </div>

      <div
        ref={outputRef}
        className={
          'gen-output'
          + (gen.isDone ? ' has-content' : '')
          + (gen.isGenerating ? ' generating' : '')
          + (gen.status === 'error' ? ' gen-failed' : '')
        }
        aria-live="polite"
      >
        {gen.status === 'idle' && (
          <span className="gen-placeholder">
            Generated content will appear here. You can review it before adding to the {destinationLabel}.
          </span>
        )}
        {gen.isGenerating && (
          <span style={{ color: 'var(--t3)' }}>
            <span className="gen-spinner" /> {LOADING_LABEL[gen.type]}
          </span>
        )}
        {gen.status === 'error' && (
          <div className="gen-error">
            <FaTriangleExclamation style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{gen.error}</span>
          </div>
        )}
        {gen.isDone && <GeneratedOutput result={gen.result} />}
      </div>

      {(gen.isDone || gen.status === 'error') && (
        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {gen.isDone && (
            <button className={'btn btn-sm ' + (accepted ? 'btn-gr' : 'btn-p')} type="button" onClick={accept}>
              {accepted ? <><FaCheck /> Added!</> : <><FaPlus /> {acceptLabel}</>}
            </button>
          )}
          <button className="btn btn-g btn-sm" type="button" onClick={gen.generate}>
            <FaRotate /> {gen.status === 'error' ? 'Try again' : 'Regenerate'}
          </button>
          {gen.isDone && (
            <button className="btn btn-g btn-sm" type="button" onClick={copy}>
              {copied ? <><FaCheck /> Copied</> : <><FaCopy /> Copy</>}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
