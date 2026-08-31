/**
 * AI model catalogue for the Profile page.
 *
 * Grounded in what the backend actually calls today — the entry marked
 * `wired: true` in each group is the model the server currently uses:
 *
 *   text  -> gemma via Ollama          (post_content_generator agent)
 *   image -> FLUX.1-dev via fal-ai     (image_generator agent)
 *   audio -> nothing yet
 *   video -> nothing yet
 *
 * Selecting a different model saves the preference and sends it with each
 * generation request. The backend ignores the field until it reads it.
 */

export const MODEL_GROUPS = [
  {
    id: 'text',
    label: 'Text & Email',
    blurb: 'Captions, ad copy, headlines and every email type.',
    icon: 'text',
    note: 'Email generation uses this model too.',
  },
  {
    id: 'image',
    label: 'Image',
    blurb: 'Product shots, posters and social creative.',
    icon: 'image',
  },
  {
    id: 'audio',
    label: 'Audio',
    blurb: 'Jingles, voice-over beds and short audio clips.',
    icon: 'audio',
  },
  {
    id: 'video',
    label: 'Video',
    blurb: 'Short-form reels and product films.',
    icon: 'video',
  },
]

export const MODELS = {
  text: [
    {
      id: 'ollama_chat/gemma4:31b', name: 'Gemma 4 31B', provider: 'Ollama · self-hosted',
      speed: 'Medium', cost: 'Free', quality: 'Good',
      blurb: 'Runs on your own hardware. No per-token cost and nothing leaves your network.',
      wired: true,
    },
    {
      id: 'claude-sonnet-5', name: 'Claude Sonnet 5', provider: 'Anthropic',
      speed: 'Fast', cost: 'Medium', quality: 'Excellent',
      blurb: 'Strong long-form copy and reliable tone control. A good default for campaign work.',
    },
    {
      id: 'claude-opus-5', name: 'Claude Opus 5', provider: 'Anthropic',
      speed: 'Medium', cost: 'High', quality: 'Highest',
      blurb: 'The most capable option — worth it for launch copy and anything nuanced.',
    },
    {
      id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', provider: 'Anthropic',
      speed: 'Fastest', cost: 'Low', quality: 'Good',
      blurb: 'Built for volume. Best when generating many variants to pick from.',
    },
    {
      id: 'ollama_chat/llama3.3:70b', name: 'Llama 3.3 70B', provider: 'Ollama · self-hosted',
      speed: 'Slow', cost: 'Free', quality: 'Good',
      blurb: 'Larger local model. Slower per request but keeps everything on-premises.',
    },
  ],
  image: [
    {
      id: 'black-forest-labs/FLUX.1-dev', name: 'FLUX.1 dev', provider: 'Black Forest Labs · fal.ai',
      speed: 'Medium', cost: 'Medium', quality: 'Excellent',
      blurb: 'Sharp product renders and reliable text rendering inside images.',
      wired: true,
    },
    {
      id: 'black-forest-labs/FLUX.1-schnell', name: 'FLUX.1 schnell', provider: 'Black Forest Labs · fal.ai',
      speed: 'Fastest', cost: 'Low', quality: 'Good',
      blurb: 'A few seconds per image. Use it for rough concepts before committing.',
    },
    {
      id: 'stabilityai/stable-diffusion-3.5-large', name: 'Stable Diffusion 3.5 L', provider: 'Stability AI',
      speed: 'Medium', cost: 'Medium', quality: 'Very good',
      blurb: 'Broad style range and a large community of fine-tunes.',
    },
  ],
  audio: [
    {
      id: 'facebook/musicgen-large', name: 'MusicGen Large', provider: 'Meta',
      speed: 'Slow', cost: 'Medium', quality: 'Very good',
      blurb: 'Instrumental beds and jingles from a text description.',
    },
    {
      id: 'stabilityai/stable-audio-open-1.0', name: 'Stable Audio Open', provider: 'Stability AI',
      speed: 'Medium', cost: 'Low', quality: 'Good',
      blurb: 'Short loops and sound effects, up to about 47 seconds.',
    },
    {
      id: 'suno/bark', name: 'Bark', provider: 'Suno',
      speed: 'Medium', cost: 'Low', quality: 'Good',
      blurb: 'Spoken voice-over with natural intonation, plus simple sound effects.',
    },
  ],
  video: [
    {
      id: 'Wan-AI/Wan2.1-T2V-14B', name: 'Wan 2.1 T2V 14B', provider: 'Wan-AI · fal.ai',
      speed: 'Slow', cost: 'High', quality: 'Very good',
      blurb: 'Text-to-video with steady motion. The current default for reels.',
    },
    {
      id: 'tencent/HunyuanVideo', name: 'HunyuanVideo', provider: 'Tencent',
      speed: 'Slow', cost: 'High', quality: 'Excellent',
      blurb: 'Higher fidelity and better prompt adherence, at a longer render time.',
    },
    {
      id: 'genmo/mochi-1-preview', name: 'Mochi 1', provider: 'Genmo',
      speed: 'Medium', cost: 'Medium', quality: 'Good',
      blurb: 'Faster turnaround for short clips where motion matters more than detail.',
    },
  ],
}

/** The model each group starts on — the one the backend already uses. */
export const DEFAULT_MODELS = Object.fromEntries(
  Object.entries(MODELS).map(([group, list]) => [
    group,
    (list.find((m) => m.wired) || list[0]).id,
  ]),
)

/** Look a model up by group and id. */
export function findModel(group, id) {
  return (MODELS[group] || []).find((m) => m.id === id) || null
}
