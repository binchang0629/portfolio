import { useLayoutEffect, useRef, useState } from 'react'

// Lays prose out so the lines look even rather than ragged. Candidate breaks are sentence ends
// (preferred), commas (acceptable) and explicit "\n" (always). Every combination is measured against
// the real column width and the tidiest one wins: similar line lengths, few lines, no stray short
// line. Short sentences may share a line; a sentence that fits is never split at its commas without
// a reason. Rechecked when the width changes or fonts finish loading.
function tokenize(text) {
  const tokens = []
  // Keep " · " separators attached to the word before them, so no line starts with a dot.
  const paragraphs = text.replace(/ · /g, '\u00a0· ').split('\n')
  paragraphs.forEach((paragraph, p) => {
    const sentences = paragraph.split(/(?<=[.!?])\s+(?=\S)/)
    sentences.forEach((sentence, s) => {
      // A single-word clause is a list item ("HTML, CSS, JavaScript"), not a place to break.
      // A single-word clause is a list item ("HTML, CSS, JavaScript, React로"): the whole list stays together.
      const parts = sentence.split(/(?<=,)\s+/)
      const isItem = i => i < parts.length - 1 && !/\s/.test(parts[i].replace(/,$/, ''))
      const clauses = []
      parts.forEach((part, i) => {
        if (clauses.length && (isItem(i) || isItem(i - 1))) clauses[clauses.length - 1] += ` ${part}`
        else clauses.push(part)
      })
      clauses.forEach((clause, c) => tokens.push({
        text: clause, sentence: `${p}-${s}`,
        end: c < clauses.length - 1 ? 'comma' : s < sentences.length - 1 ? 'sentence' : p < paragraphs.length - 1 ? 'hard' : 'end',
      }))
    })
  })
  return tokens
}

// Before anything is measured: one sentence per line.
const fallback = tokens => group(tokens, tokens.map(token => token.end !== 'comma'))

function group(tokens, breaks) {
  const lines = []
  let line = []
  tokens.forEach((token, i) => {
    line.push(token.text)
    if (i === tokens.length - 1 || breaks[i]) { lines.push(line.join(' ')); line = [] }
  })
  return lines
}

// Sentences prefer their own line; joining two is only worth it when both are short.
const cost = { line: .1, comma: .06, join: .4, orphan: .6 }

function bestLines(tokens, width, measure) {
  const n = tokens.length
  if (n < 2 || n > 14) return fallback(tokens)
  const limit = width * .98
  // Commas may only break a sentence that cannot fit on one line.
  const fits = {}
  for (const token of tokens) fits[token.sentence] ??= measure(tokens.filter(t => t.sentence === token.sentence).map(t => t.text).join(' ')) <= limit
  let best = null
  for (let mask = 0; mask < 1 << (n - 1); mask++) {
    const breaks = tokens.map((token, i) => i < n - 1 && (token.end === 'hard' || Boolean(mask & (1 << i))))
    if (tokens.some((token, i) => i < n - 1 && token.end === 'hard' && !(mask & (1 << i)))) continue
    if (tokens.some((token, i) => breaks[i] && token.end === 'comma' && fits[token.sentence])) continue
    let score = 0
    let valid = true
    const widths = []
    let start = 0
    tokens.forEach((token, i) => {
      if (!valid || !(i === n - 1 || breaks[i])) return
      const w = measure(tokens.slice(start, i + 1).map(t => t.text).join(' '))
      if (w > limit) {
        // Several phrases on a line that overflows would wrap mid-phrase; a single long phrase may wrap (balanced).
        if (i > start) valid = false
        const rows = Math.ceil(w / limit)
        for (let r = 0; r < rows; r++) widths.push(w / rows)
      } else widths.push(w)
      for (let k = start; k < i; k++) score += tokens[k].end === 'sentence' ? cost.join : 0
      if (i < n - 1 && token.end === 'comma') score += cost.comma
      start = i + 1
    })
    if (!valid) continue
    const longest = Math.max(...widths)
    for (const w of widths) {
      score += ((longest - w) / width) ** 2 + cost.line
      if (widths.length > 1 && w < longest * .3) score += cost.orphan
    }
    if (!best || score < best.score) best = { score, breaks }
  }
  return best ? group(tokens, best.breaks) : fallback(tokens)
}

// Measures with a hidden copy inside the element, so widths use exactly the fonts on screen.
function measurer(el) {
  const probe = document.createElement('span')
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:0;top:0'
  el.appendChild(probe)
  const cache = new Map()
  const measure = text => {
    if (!cache.has(text)) { probe.textContent = text; cache.set(text, probe.getBoundingClientRect().width) }
    return cache.get(text)
  }
  measure.done = () => probe.remove()
  return measure
}

export default function Sentences({ text, className = '' }) {
  const ref = useRef(null)
  const tokens = tokenize(text)
  const [lines, setLines] = useState(() => fallback(tokens))

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const list = tokenize(text)
    let width = 0
    const layout = force => {
      if (!force && el.clientWidth === width) return
      width = el.clientWidth
      if (!width) return
      const measure = measurer(el)
      const next = bestLines(list, width, measure)
      measure.done()
      setLines(current => current.join('\n') === next.join('\n') ? current : next)
    }
    layout(true)
    const observer = new ResizeObserver(() => layout(false))
    observer.observe(el)
    const refit = () => layout(true)
    document.fonts?.addEventListener('loadingdone', refit)
    return () => { observer.disconnect(); document.fonts?.removeEventListener('loadingdone', refit) }
  }, [text])

  return <span ref={ref} className={`lines ${className}`.trim()}>
    {lines.map((line, i) => <span key={i} className="line">{line}</span>)}
  </span>
}
