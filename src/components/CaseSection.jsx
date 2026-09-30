// Case-study layouts A–E. Project files only supply words and images; this file decides how they sit.
// Text written as "[...]" is an unfilled slot and shows as a dashed placeholder instead of real copy.
const isSlot = text => typeof text === 'string' && /^\[.*\]$/.test(text.trim())
const Copy = ({ as: Tag = 'span', className, children, ...rest }) => {
  if (children == null || children === '') return null
  return isSlot(children)
    ? <Tag {...rest} className={`${className ?? ''} case-slot`.trim()}>{children.slice(1, -1)}</Tag>
    : <Tag {...rest} className={className}>{children}</Tag>
}

const statusLabel = { intent: '설계 의도', verified: '확인된 결과', unverified: '검증 전' }

function CaseImage({ image, className = '' }) {
  if (!image) return null
  if (!image.src) return <div className={`case-image case-image-empty ${className}`}><span>{(image.alt || '[이미지 입력]').replace(/^\[|\]$/g, '')}</span></div>
  return <img className={`case-image ${className}`} src={image.src} width={image.w} height={image.h} alt={image.alt ?? ''} loading="lazy" decoding="async" />
}

function Figure({ image, children }) {
  if (!image) return null
  return <figure className="case-figure">
    {children ?? <CaseImage image={image} />}
    {image.caption && <Copy as="figcaption">{image.caption}</Copy>}
  </figure>
}

// A — one representative image under the text
const Lead = ({ section }) => <Figure image={section.image} />

// B — evidence cards (figures, findings, personas), optionally followed by the source image
const Cards = ({ section }) => <>
  <ul className="case-cards">
    {section.cards?.map((card, i) => <li key={i} className={card.highlight ? 'is-highlight' : undefined}>
      {card.kicker && <Copy className="case-card-kicker">{card.kicker}</Copy>}
      {card.value && <Copy className="case-card-value">{card.value}</Copy>}
      <Copy as="strong" className="case-card-title">{card.title}</Copy>
      <Copy as="p">{card.body}</Copy>
    </li>)}
  </ul>
  <Figure image={section.image} />
</>

// C — problem on the left, the decision it led to on the right
const Match = ({ section }) => {
  const [from, to] = section.columns ?? ['발견한 문제', '설계 판단']
  return <>
    <div className="case-match" role="table" aria-label={section.label}>
      <div className="case-match-head" role="row"><span role="columnheader">{from}</span><span role="columnheader">{to}</span></div>
      {section.rows?.map((row, i) => <div key={i} className="case-match-row" role="row">
        <Copy as="p" className="case-match-problem">{row.problem}</Copy>
        <span className="case-match-arrow" aria-hidden="true" />
        <Copy as="p" className="case-match-decision">{row.decision}</Copy>
      </div>)}
    </div>
    <Figure image={section.image} />
  </>
}

// D — numbered pins on a screen, explained in the list below it
const Annotated = ({ section }) => <>
  <Figure image={section.image}>
    <div className="case-pins">
      <CaseImage image={section.image} />
      {section.image?.src && section.notes?.map((note, i) => <span key={i} className="case-pin" style={{ left: `${note.x}%`, top: `${note.y}%` }} aria-hidden="true">{i + 1}</span>)}
    </div>
  </Figure>
  {section.notes?.length > 0 && <ol className="case-notes">
    {section.notes.map((note, i) => <li key={i}>
      <span className="case-note-no" aria-hidden="true">{i + 1}</span>
      <div><Copy as="strong">{note.title}</Copy><Copy as="p">{note.body}</Copy></div>
    </li>)}
  </ol>}
</>

// E — before/after or step-by-step images
const Compare = ({ section }) => <ol className={`case-steps${section.steps?.length === 1 ? ' is-single' : ''}`}>
  {section.steps?.map((step, i) => <li key={i}>
    <Copy className="case-step-label">{step.label}</Copy>
    <CaseImage image={step.image} />
    <Copy as="p">{step.caption}</Copy>
  </li>)}
</ol>

// Any layout can carry a small bar chart drawn from numbers, instead of a screenshot of one.
// Horizontal bars keep grouped values apart and stay readable in a narrow column.
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
          {s === 0 && item.note && <small className="case-bar-note">{item.note}</small>}
        </span>)}</dd>
      </div>)}</dl>
    </div>)}
    {chart.caption && <Copy as="figcaption">{chart.caption}</Copy>}
  </figure>
}

const layouts = { lead: Lead, cards: Cards, match: Match, annotated: Annotated, compare: Compare }

export default function CaseSection({ section }) {
  const Layout = layouts[section.type] ?? Lead
  return <div className="case" data-layout={section.type}>
    {(section.status || section.body) && <div className="case-intro">
      {section.status && <span className="case-status" data-status={section.status}>{statusLabel[section.status]}</span>}
      <Copy as="p">{section.body}</Copy>
    </div>}
    <Layout section={section} />
    {section.chart && <CaseChart chart={section.chart} />}
    {section.source && <p className="case-source">출처 · <Copy>{section.source}</Copy></p>}
  </div>
}

export { Copy }
