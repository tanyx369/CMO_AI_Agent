/**
 * Renders the light markdown that language models emit for social copy —
 * headings, bullet and numbered lists, bold, italic, inline code and links.
 *
 * Everything becomes React elements, never HTML. That matters: model output is
 * untrusted input, so injecting it with `dangerouslySetInnerHTML` would be an
 * XSS hole. Anything the parser does not recognise falls through as plain text,
 * so nothing is ever lost — worst case it looks the same as before.
 */

/* -------------------------------------------------------------------------- */
/*  Inline formatting                                                         */
/* -------------------------------------------------------------------------- */

// One capture group, so String.split() returns alternating text/token pieces.
// Order matters: `**bold**` must be tried before `*italic*`.
//
// Two deliberate restrictions, both to avoid mangling ordinary marketing copy:
//
//   * Emphasis content may not begin or end with a space, so a stray marker in
//     "50% off ** today only" is left alone instead of italicising the rest.
//   * Underscores are not treated as emphasis at all. Models emit `*`/`**` for
//     emphasis, whereas `_` shows up inside identifiers and file names
//     (`apex_watch_v2`, `__init__`) where turning it into italics is wrong.
const INLINE_TOKEN = new RegExp(
  [
    '`[^`\\n]+`', // `code`
    '\\*\\*[^\\s*](?:[^\\n]*?[^\\s*])?\\*\\*', // **bold**
    '\\*[^\\s*](?:[^*\\n]*[^\\s*])?\\*', // *italic*
    '\\[[^\\]\\n]+\\]\\([^)\\s]+\\)', // [label](url)
  ].map((p) => `(?:${p})`).join('|'),
  'g',
)

/** Only http(s) links become anchors; anything else stays literal text. */
function safeHref(url) {
  return /^https?:\/\//i.test(url) ? url : null
}

const WORD_CHAR = /[\p{L}\p{N}]/u

/**
 * Emphasis wedged between two word characters — the `4` in `3*4*5` — is a
 * multiplication sign far more often than it is italics. Skipping it keeps the
 * asterisks visible instead of silently deleting them from the copy.
 */
function isIntraword(text, start, end) {
  const before = start > 0 ? text[start - 1] : ''
  const after = end < text.length ? text[end] : ''
  return WORD_CHAR.test(before) && WORD_CHAR.test(after)
}

function renderInline(text, keyPrefix) {
  const nodes = []
  let cursor = 0
  let n = 0

  const pushText = (value) => {
    if (value) nodes.push(<span key={`${keyPrefix}-t${n++}`}>{value}</span>)
  }

  // matchAll (rather than split) keeps the match offsets, which the intraword
  // check needs.
  for (const match of text.matchAll(new RegExp(INLINE_TOKEN.source, 'g'))) {
    const token = match[0]
    const start = match.index
    const end = start + token.length
    const key = `${keyPrefix}-${n++}`
    const isEmphasis = token.startsWith('*')

    if (isEmphasis && isIntraword(text, start, end)) continue // leave it literal

    pushText(text.slice(cursor, start))
    cursor = end

    if (token.startsWith('`')) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>)
    } else if (token.startsWith('**')) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*')) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>)
    } else {
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token)
      const href = link && safeHref(link[2])
      nodes.push(
        href
          ? <a key={key} href={href} target="_blank" rel="noopener noreferrer">{link[1]}</a>
          : <span key={key}>{token}</span>,
      )
    }
  }

  pushText(text.slice(cursor))
  return nodes
}

/* -------------------------------------------------------------------------- */
/*  Block structure                                                           */
/* -------------------------------------------------------------------------- */

const HEADING = /^(#{1,6})\s+(.*)$/
const BULLET = /^\s*[-*•]\s+(.*)$/
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/
const RULE = /^\s*(?:-{3,}|_{3,}|\*{3,})\s*$/

/** Group lines into headings, lists, rules and paragraphs. */
function toBlocks(text) {
  const lines = String(text).replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let paragraph = []
  let list = null

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'p', lines: paragraph })
      paragraph = []
    }
  }
  const flushList = () => {
    if (list) {
      blocks.push(list)
      list = null
    }
  }

  for (const line of lines) {
    if (!line.trim()) {
      flushParagraph()
      flushList()
      continue
    }
    if (RULE.test(line)) {
      flushParagraph(); flushList()
      blocks.push({ type: 'hr' })
      continue
    }
    const heading = HEADING.exec(line)
    if (heading) {
      flushParagraph(); flushList()
      blocks.push({ type: 'h', level: heading[1].length, text: heading[2] })
      continue
    }
    const bullet = BULLET.exec(line)
    const numbered = !bullet && NUMBERED.exec(line)
    if (bullet || numbered) {
      flushParagraph()
      const kind = bullet ? 'ul' : 'ol'
      if (!list || list.type !== kind) {
        flushList()
        list = { type: kind, items: [] }
      }
      list.items.push((bullet || numbered)[1])
      continue
    }
    // Plain line — part of the current paragraph.
    flushList()
    paragraph.push(line)
  }
  flushParagraph()
  flushList()
  return blocks
}

/* -------------------------------------------------------------------------- */

export default function MarkdownText({ text, className = '' }) {
  if (!text) return null
  const blocks = toBlocks(text)

  return (
    <div className={'md' + (className ? ' ' + className : '')}>
      {blocks.map((b, i) => {
        if (b.type === 'hr') return <hr key={i} />

        if (b.type === 'h') {
          // Cap at h4 so generated copy never out-shouts the panel's own titles.
          const Tag = `h${Math.min(b.level + 2, 6)}`
          return <Tag key={i} className={'md-h md-h' + b.level}>{renderInline(b.text, i)}</Tag>
        }

        if (b.type === 'ul' || b.type === 'ol') {
          const Tag = b.type
          return (
            <Tag key={i} className="md-list">
              {b.items.map((item, j) => <li key={j}>{renderInline(item, `${i}-${j}`)}</li>)}
            </Tag>
          )
        }

        // Paragraph — soft line breaks inside it are preserved.
        return (
          <p key={i} className="md-p">
            {b.lines.map((line, j) => (
              <span key={j}>
                {renderInline(line, `${i}-${j}`)}
                {j < b.lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}
