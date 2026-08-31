/**
 * ============================================================================
 *  THE ONLY FILE YOU NEED TO EDIT TO CONNECT THE BACKEND
 * ============================================================================
 *
 * Everything in the UI goes through `generateContent()` below. Wire it up once
 * here and every Content Generator in the app — on any campaign or post detail
 * page — starts using the real API. No component changes required.
 *
 * To bring a content type online:
 *   1. Set API_BASE_URL (or define VITE_API_BASE_URL in frontend/.env).
 *   2. Add its path to GENERATION_ENDPOINTS — `null` keeps it on the mock.
 *   3. Map your response shape in adaptGenerationResponse() if it differs.
 *
 * LIVE: text  -> POST /api/v1/campaigns/generate-post-content
 *       image -> POST /api/v1/campaigns/generate-image
 * Both take a MediaGenerateRequest body: { prompt, platform }.
 * Audio and video have no endpoint yet and still use the mock; delete the MOCK
 * section once every type is wired up.
 */

import { getModelFor } from '../settingsStore'

/* -------------------------------------------------------------------------- */
/*  1. Configuration                                                          */
/* -------------------------------------------------------------------------- */

/** Base URL of the FastAPI backend. */
export const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8001/api/v1'

/**
 * Where generated media files are served from.
 *
 * Matches the backend's `app.mount("/media", StaticFiles(directory="data"))`,
 * so `/media/image/<uuid>.jpg` maps to `backend/data/image/<uuid>.jpg`.
 *
 * The API stores an absolute path; `resolveMediaUrl()` below trims everything
 * up to the `data/` segment and joins the remainder onto this base.
 */
export const MEDIA_BASE_URL =
  import.meta.env?.VITE_MEDIA_BASE_URL || 'http://localhost:8001/media'

/**
 * Global override — forces every type back onto the mock (handy when the API is
 * down). Leave `false`; which types are live is decided by GENERATION_ENDPOINTS.
 */
export const FORCE_MOCK = true

/* -------------------------------------------------------------------------- */
/*  2. Endpoints — one entry per content type                                 */
/* -------------------------------------------------------------------------- */

/**
 * Paths are appended to API_BASE_URL.
 *
 * `null` means "not built yet" — that type falls back to the mock, so types can
 * come online one at a time. Fill in an entry and it goes live immediately.
 *
 * The image route is campaign-independent, so it ignores its argument.
 */
export const GENERATION_ENDPOINTS = {
  text: () => '/campaigns/generate-post-content',
  image: () => '/campaigns/generate-image',
  audio: null,
  email: null, // mock-only for now; add a path here to bring it online
  video: null, // e.g. (campaignId) => `/campaigns/${campaignId}/generate-video`
}

/**
 * Platform values accepted by the backend.
 *
 * `MediaGenerateRequest.platform` is typed as the `Platform` enum, so the value
 * sent must be one of its members exactly — lowercase, and only these seven.
 * `value` goes on the wire, `label` is what the user sees.
 *
 * Keep this in step with `Platform` in backend/app/models.py.
 */
export const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'all', label: 'All platforms' },
]

/** Platform used when nothing has been picked yet. */
export const DEFAULT_PLATFORM = PLATFORM_OPTIONS[0].value

/** Extra headers (auth token, etc.) sent with every generation request. */
export function buildHeaders() {
  return {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${yourToken}`,
  }
}

/**
 * Request body.
 *
 * `prompt` and `platform` are the two fields MediaGenerateRequest requires;
 * `platform` must be a backend enum value (see PLATFORM_OPTIONS). The rest are
 * ignored by Pydantic today and are sent so the schema can widen without a UI
 * change — add them to MediaGenerateRequest and they arrive automatically.
 *
 * `model` is whatever the user picked on the Profile page. Email shares the
 * text model, which `getModelFor` handles.
 */
export function buildRequestBody({ prompt, type, options }) {
  return {
    prompt,
    platform: options?.platform || DEFAULT_PLATFORM,
    content_type: type,
    format: options?.format,
    tone: options?.tone,
    model: getModelFor(type),
  }
}

/* -------------------------------------------------------------------------- */
/*  3. Response adapter — backend shape → what the UI renders                  */
/* -------------------------------------------------------------------------- */

/**
 * The UI only ever reads this shape, so the renderer stays identical whether
 * the data came from the mock or the real API:
 *
 *   {
 *     kind:      'text' | 'image' | 'audio' | 'video',
 *     text:      string,        // plain text body / caption
 *     html:      string | null, // optional rich text (rendered as HTML)
 *     url:       string | null, // media source; null falls back to a placeholder
 *     id:        string | null, // backend row id
 *     createdAt: string | null,
 *     prompt:    string,
 *     meta:      object,        // anything extra you want to show
 *   }
 */
export function adaptGenerationResponse(type, data, { prompt }) {
  // Preference order for something the browser can actually display:
  //   1. inline base64   2. an explicit url   3. a stored file path
  const inline = data.image_base64 ?? data.audio_base64 ?? data.video_base64 ?? null
  const url = inline
    ? toDataUri(type, inline, data.mime_type)
    : resolveMediaUrl(data.url ?? data.file_path ?? null)

  return {
    kind: type,
    // Adjust these keys to match your API.
    text: data.text_content ?? data.text ?? data.caption ?? data.generated_output ?? '',
    html: data.html ?? null,
    url,
    id: data.id ?? null,
    createdAt: data.created_at ?? null,
    prompt: data.prompt ?? prompt,
    // Surfaced under the preview so a successful generation is still visible
    // when the response carries nothing the browser can render.
    // `email` holds the structured subject/preheader/body/CTA for the Email tab.
    meta: { savedPath: data.file_path ?? null, email: data.email ?? null },
  }
}

/** Wrap a base64 payload so an <img>/<audio>/<video> can render it directly. */
export function toDataUri(type, base64, mimeType) {
  const fallback = { image: 'image/jpeg', audio: 'audio/mpeg', video: 'video/mp4' }[type]
  return `data:${mimeType || fallback || 'application/octet-stream'};base64,${base64}`
}

/**
 * Turn a stored path into a URL the browser can load.
 *
 * The API returns an absolute Windows path such as
 *   D:\...\backend\data\image\<uuid>.jpg
 * Separators are normalised and everything up to and including the `data/`
 * segment is dropped, leaving `image/<uuid>.jpg` to join onto MEDIA_BASE_URL —
 * which lines up with the `/media` -> `data` static mount.
 *
 * Returns null when the path names no file (no extension), so the caller shows
 * a placeholder instead of a broken image.
 */
export function resolveMediaUrl(filePath) {
  if (!filePath) return null
  if (/^(https?:|blob:|data:)/.test(filePath)) return filePath

  const normalised = String(filePath).split('\\').join('/')
  const afterData = normalised.replace(/^.*?(?:^|\/)data\//, '')
  const clean = afterData.replace(/^\/+/, '')

  if (!/\.[a-z0-9]{2,5}$/i.test(clean)) return null

  return `${MEDIA_BASE_URL.replace(/\/+$/, '')}/${clean}`
}

/* -------------------------------------------------------------------------- */
/*  4. The single call the whole UI uses                                      */
/* -------------------------------------------------------------------------- */

/**
 * Turn FastAPI's `detail` into one readable sentence.
 *
 * HTTPException gives a plain string; a 422 gives a list of
 * `{loc, msg}` objects, which is otherwise dumped as raw JSON.
 */
export function formatDetail(detail) {
  if (!detail) return null
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((d) => {
        // Drop the leading "body"/"query" segment; the field name is the useful part.
        const field = Array.isArray(d.loc) ? d.loc.slice(1).join('.') || d.loc.join('.') : null
        return field ? `${field}: ${d.msg}` : d.msg
      })
      .filter(Boolean)
      .join('; ')
  }
  return JSON.stringify(detail)
}

export class ContentApiError extends Error {
  constructor(message, { status = null, detail = null } = {}) {
    super(message)
    this.name = 'ContentApiError'
    this.status = status
    this.detail = detail
  }
}

/**
 * Generate one piece of content.
 *
 * @param {object}  args
 * @param {string}  args.campaignId  campaign the content belongs to
 * @param {string}  args.type        'text' | 'image' | 'audio' | 'video'
 * @param {string}  args.prompt
 * @param {object}  [args.options]   platform / format / tone
 * @param {AbortSignal} [args.signal]
 * @returns {Promise<object>} the shape documented on adaptGenerationResponse
 */
export async function generateContent({ campaignId, type, prompt, options, signal }) {
  const buildPath = GENERATION_ENDPOINTS[type]
  // No endpoint for this type yet (or the override is on) -> keep using the mock.
  if (FORCE_MOCK || !buildPath) return mockGenerateContent({ type, prompt, options, signal })

  // const url = `${API_BASE_URL.replace(/\/+$/, '')}${buildPath(campaignId)}`
  const url = `${API_BASE_URL.replace(/\/+$/, '')}${buildPath(campaignId)}`

  let response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(buildRequestBody({ prompt, type, options })),
      signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ContentApiError('Could not reach the server. Is the API running?')
  }

  if (!response.ok) {
    // FastAPI puts the message in `detail` for both HTTPException and 422s.
    let detail = null
    try {
      const body = await response.json()
      detail = formatDetail(body.detail)
    } catch {
      /* response had no JSON body */
    }
    throw new ContentApiError(
      detail || `Generation failed (${response.status}).`,
      { status: response.status, detail },
    )
  }

  return adaptGenerationResponse(type, await response.json(), { prompt })
}

/* ========================================================================== */
/*  MOCK — used by any type whose GENERATION_ENDPOINTS entry is null          */
/* ========================================================================== */

import { TEXT_OUTPUTS } from '../data'
import { buildMockEmail, emailToPlainText } from '../emailData'

const MOCK_DELAY = { text: 2000, image: 2400, audio: 3000, video: 3500, email: 2200 }
const MOCK_EMOJI = ['📱', '⌚', '🎧', '📡']

function mockGenerateContent({ type, prompt, options, signal }) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const base = { kind: type, text: '', html: null, url: null, id: null, createdAt: null, prompt, meta: {} }
      if (type === 'email') {
        const email = buildMockEmail({
          type: options?.emailType,
          prompt,
          tone: options?.tone,
        })
        // `text` is the flattened version, so copy and the post tracker keep
        // working without knowing anything about the email structure.
        resolve({ ...base, text: emailToPlainText(email), meta: { email } })
      } else if (type === 'text') {
        const html = TEXT_OUTPUTS[Math.floor(Math.random() * TEXT_OUTPUTS.length)]
        resolve({ ...base, html, text: stripHtml(html) })
      } else if (type === 'image') {
        // No url yet, so the renderer shows its emoji placeholder instead.
        resolve({ ...base, meta: { emoji: MOCK_EMOJI[Math.floor(Math.random() * MOCK_EMOJI.length)] } })
      } else {
        resolve(base)
      }
    }, MOCK_DELAY[type] ?? 2000)

    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

function stripHtml(html) {
  return String(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
