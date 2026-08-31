import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_PLATFORM, generateContent } from '../api/contentApi'
import { DEFAULT_EMAIL_TYPE } from '../emailData'

/**
 * Generation lifecycle for one Content Generator.
 *
 * Owns the type/prompt/options form state and the request itself, so any page
 * can render a generator without repeating the plumbing. The request is
 * abortable: switching type, clearing, or unmounting cancels an in-flight call
 * so a late response can never overwrite newer state.
 *
 * @param {object} args
 * @param {string} args.campaignId  passed straight through to the API
 * @param {string} [args.defaultType='text']
 * @param {object} [args.defaultOptions]
 */
export default function useContentGenerator({
  campaignId,
  defaultType = 'text',
  defaultOptions = {
    platform: DEFAULT_PLATFORM,
    format: 'Ad Copy',
    tone: 'Energetic',
    emailType: DEFAULT_EMAIL_TYPE,
  },
}) {
  const [type, setType] = useState(defaultType)
  const [prompt, setPrompt] = useState('')
  const [options, setOptions] = useState(defaultOptions)
  const [status, setStatus] = useState('idle') // idle | generating | done | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [promptInvalid, setPromptInvalid] = useState(false)

  const abortRef = useRef(null)
  const invalidTimer = useRef(null)

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
  }, [])

  // Drop any in-flight request when the campaign changes or we unmount.
  useEffect(() => {
    return () => {
      cancel()
      clearTimeout(invalidTimer.current)
    }
  }, [cancel, campaignId])

  /** Back to an empty form — used on mount for a new campaign. */
  const reset = useCallback(() => {
    cancel()
    setPrompt('')
    setStatus('idle')
    setResult(null)
    setError(null)
  }, [cancel])

  /** Switch content type; any pending result is no longer relevant. */
  const changeType = useCallback((next) => {
    cancel()
    setType(next)
    setStatus('idle')
    setResult(null)
    setError(null)
  }, [cancel])

  const setOption = useCallback((key, value) => {
    setOptions((o) => ({ ...o, [key]: value }))
  }, [])

  const generate = useCallback(async () => {
    if (!prompt.trim()) {
      setPromptInvalid(true)
      clearTimeout(invalidTimer.current)
      invalidTimer.current = setTimeout(() => setPromptInvalid(false), 1200)
      return
    }

    cancel()
    const controller = new AbortController()
    abortRef.current = controller

    setStatus('generating')
    setResult(null)
    setError(null)

    try {
      const data = await generateContent({
        campaignId,
        type,
        prompt: prompt.trim(),
        options,
        signal: controller.signal,
      })
      if (controller.signal.aborted) return
      setResult(data)
      setStatus('done')
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) return
      setError(err.message || 'Generation failed.')
      setStatus('error')
    } finally {
      if (abortRef.current === controller) abortRef.current = null
    }
  }, [campaignId, cancel, options, prompt, type])

  return {
    // form
    type, changeType,
    prompt, setPrompt, promptInvalid,
    options, setOption,
    // lifecycle
    status, result, error,
    isGenerating: status === 'generating',
    isDone: status === 'done',
    generate, reset, cancel,
  }
}
