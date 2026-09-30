// Case-study sections drawn as full-width colour bands: short centred heading, large screen, little chrome.
// Project files only supply words and images; this file decides how they sit.
// Text written as "[...]" is an unfilled slot and shows as a dashed placeholder instead of real copy.
import Sentences from './Sentences'

const isSlot = text => typeof text === 'string' && /^\[.*\]$/.test(text.trim())
const Copy = ({ as: Tag = 'span', className, children, ...rest }) => {
  if (children == null || children === '') return null
  return isSlot(children)
    ? <Tag {...rest} className={`${className ?? ''} case-slot`.trim()}>{children.slice(1, -1)}</Tag>
    : <Tag {...rest} className={className}>{children}</Tag>
}
// Titles may break lines on purpose with "\n".
const Lines = ({ text }) => text.split('\n').map((line, i) => <span key={i} className="case-line">{line}</span>)

const statusLabel = { intent: '설계 의도', verified: '확인된 결과', unverified: '검증 전' }

function CaseImage({ image }) {
  if (!image) return null
  if (!image.src) return <div className="case-image case-image-empty"><span>{(image.alt || '[이미지 입력]').replace(/^\[|\]$/g, '')}</span></div>
  return <img className="case-image" src={image.src} width={image.w} height={image.h} alt={image.alt ?? ''} loading="lazy" decoding="async" />
}

function Figure({ image, children }) {
  if (!image) return null
  return <figure className="case-figure">
    {children ?? <CaseImage image={image} />}
    {image.caption && <Copy as="figcaption">{image.caption}</Copy>}
  </figure>
}

// A — one large image
const Lead = ({ section }) => <Figure image={section.image} />

// B — the screen first, then a row of short points, figures or quotes
const Cards = ({ section }) => <>
  <Figure image={section.image} />
  {section.cards?.length > 0 && <ul className="case-points" data-count={section.cards.length}>
    {section.cards.map((card, i) => <li key={i} className={card.highlight ? 'is-highlight' : undefined}>
      {card.kicker && <Copy className="case-point-kicker">{card.kicker}</Copy>}
      {card.value && <Copy className="case-point-value">{card.value}</Copy>}
      {card.title && <Copy as="strong" className="case-point-title">{card.title}</Copy>}
      <Copy as="p">{card.body}</Copy>
    </li>)}
  </ul>}
</>

// C — what was found on the left, what was done about it on the right
// Cells use the same tidy line layout as body copy (see Sentences.jsx).
const Cell = ({ className, text }) => isSlot(text)
  ? <Copy as="p" className={className} role="cell">{text}</Copy>
  : <p className={className} role="cell"><Sentences text={text} /></p>
const Match = ({ section }) => {
  const [from, to] = section.columns ?? ['발견한 문제', '설계 판단']
  return <>
    <div className="case-match" role="table" aria-label={section.label}>
      <div className="case-match-head" role="row"><span role="columnheader">{from}</span><span role="columnheader">{to}</span></div>
      {section.rows?.map((row, i) => <div key={i} className="case-match-row" role="row">
        <Cell className="case-match-problem" text={row.problem} />
        <Cell className="case-match-decision" text={row.decision} />
      </div>)}
    </div>
    <Figure image={section.image} />
  </>
}

// D — numbered marks on a screen, named in one line underneath
const Annotated = ({ section }) => <>
  <Figure image={section.image}>
    <div className="case-pins">
      <CaseImage image={section.image} />
      {section.image?.src && section.notes?.map((note, i) => <span key={i} className="case-pin" style={{ left: `${note.x}%`, top: `${note.y}%` }} aria-hidden="true">{i + 1}</span>)}
    </div>
  </Figure>
  {section.notes?.length > 0 && <ol className="case-notes">
    {section.notes.map((note, i) => <li key={i}><span className="case-note-no" aria-hidden="true">{i + 1}</span><Copy>{note.title}</Copy>{note.body && <Copy as="small">{note.body}</Copy>}</li>)}
  </ol>}
</>

// E — screens one after another (side by side when the band is wide)
const Compare = ({ section }) => <ol className={`case-steps${section.steps?.length === 1 ? ' is-single' : ''}`}>
  {section.steps?.map((step, i) => <li key={i}>
    <Copy className="case-step-label">{step.label}</Copy>
    <CaseImage image={step.image} />
    <Copy as="p">{step.caption}</Copy>
  </li>)}
</ol>

const Links = ({ section }) => <p className="case-links">
  {section.links?.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true">↗</span></a>)}
</p>

// Any section can carry a bar chart drawn from numbers instead of a screenshot of one.
function CaseChart({ chart }) {
  const max = chart.max ?? 100
  const unit = chart.unit ?? '%'
  return <figure className="case-chart">
    {chart.series?.length > 1 && <ul className="case-chart-legend">{chart.series.map((name, s) => <li key={name} data-series={s}>{name}</li>)}</ul>}
    {chart.groups.map(group => <div key={group.title} className="case-chart-group">
      <p className="case-chart-title">{group.title}</p>
      <dl>{group.items.map(item => <div key={item.label} className={item.emphasis ? 'is-emphasis' : undefined}>
        <dt>{item.label}</dt>
        <dd>{item.values.map((value, s) => <span key={s} className="case-bar" data-series={s}>
          <i style={{ width: `${(value / max) * 100}%` }} aria-hidden="true" />
          <b>{chart.series?.[s] && <span className="sr-only">{chart.series[s]} </span>}{value}{unit}</b>
          {s === 0 && item.note && <small>{item.note}</small>}
        </span>)}</dd>
      </div>)}</dl>
    </div>)}
    {chart.caption && <Copy as="figcaption">{chart.caption}</Copy>}
  </figure>
}

const layouts = { lead: Lead, cards: Cards, match: Match, annotated: Annotated, compare: Compare, links: Links }

export default function CaseSection({ section, id, code }) {
  const Layout = layouts[section.type] ?? Lead
  return <section className="case-band" id={id} data-tone={section.tone ?? 'light'} data-layout={section.type} aria-labelledby={`${id}-title`}>
    <header className="case-head">
      <p className="case-kicker"><span className="case-code">{code}</span>{section.kicker ?? section.label}{section.status && <span className="case-status">{statusLabel[section.status]}</span>}</p>
      <h3 id={`${id}-title`}>{isSlot(section.title) ? <Copy>{section.title}</Copy> : <Lines text={section.title} />}</h3>
      {section.body && (isSlot(section.body) ? <Copy as="p" className="case-lead">{section.body}</Copy> : <p className="case-lead"><Sentences text={section.body} /></p>)}
    </header>
    <Layout section={section} />
    {section.chart && <CaseChart chart={section.chart} />}
    {section.source && <p className="case-source">출처 · <Copy>{section.source}</Copy></p>}
  </section>
}

// Divider between the two sides of the tape, e.g. "SIDE A · 기획".
export function CaseSide({ letter, side }) {
  const { name, note, image } = typeof side === 'string' ? { name: side } : side
  return <div className="case-side" role="presentation">
    <p className="case-side-letter">SIDE {letter}</p>
    <p className="case-side-name">{name}</p>
    {note && <p className="case-side-note">{note}</p>}
    {image && <CaseImage image={image} />}
  </div>
}
