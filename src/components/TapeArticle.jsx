import { Fragment, useEffect, useState } from 'react'
import { ProjectPreviewFrame } from './ProjectCards'
import CaseSection, { CaseSide } from './CaseSection'
import Sentences from './Sentences'

// Sections are laid out like a cassette's J-card. A section can name its own side ('A' or 'B');
// otherwise the first half is side A and the rest side B.
const sideCodes = sections => {
  if (sections.some(section => section.side)) {
    const count = {}
    return sections.map(section => { const side = section.side ?? 'A'; count[side] = (count[side] ?? 0) + 1; return `${side}${count[side]}` })
  }
  const half = Math.ceil(sections.length / 2)
  return sections.map((_, i) => i < half ? `A${i + 1}` : `B${i - half + 1}`)
}
const chapterIds = (track, sections) => sideCodes(sections).map(code => `${track.id}-${code.toLowerCase()}`)

// The reading page for one tape: label strip, big title, credits row, then chapters with a J-card tracklist.
// Case-study sections can be switched off with `hidden` instead of being deleted.
const visibleSections = content => (content.sections ?? []).filter(section => !section.hidden)
const chapterName = section => section.label ?? section.title
// A case study brings its own palette (from the project's style guide) for the colour bands.
const caseTheme = theme => ({ '--case-brand': theme.brand, '--case-deep': theme.deep, '--case-dark': theme.dark, '--case-light': theme.light, '--case-point': theme.point })

export default function TapeArticle({ track, content, number, total, nextTrack, nextLabel, busy, headingRef, scrollRoot, transport, reducedMotion, onNext, onContact, onChapter }) {
  const sections = visibleSections(content)
  const codes = sideCodes(sections)
  const ids = chapterIds(track, sections)
  const [active, setActive] = useState(0)

  // The chapter whose heading has passed the upper third of the page is the one "playing".
  useEffect(() => {
    const root = scrollRoot.current
    const targets = chapterIds(track, visibleSections(content))
    if (!root || !targets.length) return
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).map(entry => targets.indexOf(entry.target.id))
      if (visible.length) setActive(Math.min(...visible))
    }, { root, rootMargin: '0px 0px -65% 0px' })
    targets.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [scrollRoot, track, content])

  useEffect(() => {
    const list = visibleSections(content)
    onChapter?.(list[active] ? { code: sideCodes(list)[active], title: chapterName(list[active]) } : null)
  }, [active, content, onChapter])

  const jump = i => document.getElementById(ids[i])?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })

  return <article className="tape-article" style={{ '--accent': track.accent }}>
    <header className="tape-opening">
      <div className="tape-strip" aria-hidden="true"><span className="tape-play"><i /></span><span className="tape-no">{track.number}</span><span className="tape-rule" /><span className="tape-count">{number} / {total}</span></div>
      <div className="tape-title-row">
        <p className="tape-title-en" aria-hidden="true">{track.title}</p>
        {content.site && <a className="tape-live" href={content.site} target="_blank" rel="noopener noreferrer"><span>사이트</span><span aria-hidden="true">↗</span></a>}
      </div>
      <h2 className="tape-title" id="reader-title" ref={headingRef} tabIndex={-1}>{content.heading || content.title}</h2>
      {content.role && <p className="tape-role">{content.role}{content.period && <span className="tape-period">{content.period}</span>}{content.state && <span className="tape-state">{content.state}</span>}</p>}
    </header>

    {content.facts && content.kind !== 'project' && <dl className="tape-meta">{content.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}

    {content.summary && <p className="tape-lead"><Sentences text={content.summary} /></p>}
    {content.preview && <ProjectPreviewFrame project={content} transport={transport} />}

    {sections.length > 0 && (content.theme ? <div className="case-flow" style={caseTheme(content.theme)}>
      {sections.map((section, i) => <Fragment key={chapterName(section)}>
        {content.sides?.[section.side] && section.side !== sections[i - 1]?.side && <CaseSide letter={section.side} side={content.sides[section.side]} />}
        <CaseSection section={section} id={ids[i]} code={codes[i]} />
      </Fragment>)}
    </div> : <div className="tape-body">
      <div className="tape-chapters">
        {sections.map((section, i) => <section key={chapterName(section)} id={ids[i]} className="tape-chapter" aria-labelledby={`${ids[i]}-title`}>
          <header><span className="tape-code">{codes[i]}</span><h3 id={`${ids[i]}-title`}>{section.title}</h3></header>
          <div className="tape-chapter-body">
            {section.body && <p><Sentences text={section.body} /></p>}
            {section.items && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
            {section.flow && <ol className="tape-flow">{section.flow.map((step, n) => <li key={step}><span>{String(n + 1).padStart(2, '0')}</span>{step}</li>)}</ol>}
            {section.link && <a className="tape-source" href={section.link} target="_blank" rel="noreferrer">{section.linkLabel} <span aria-hidden="true">↗</span></a>}
            {section.links && <p className="tape-links">{section.links.map(link => <a key={link.href} className="tape-source" href={link.href} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}</p>}
          </div>
        </section>)}
      </div>
      <nav className="tape-tracklist" aria-label="트랙 목록">
        {['A', 'B'].map(side => codes.some(code => code.startsWith(side)) && <div key={side}>
          <p className="tape-side">SIDE {side}</p>
          <ol>{sections.map((section, i) => codes[i].startsWith(side) && <li key={chapterName(section)}>
            <button className={i === active ? 'is-active' : ''} aria-current={i === active ? 'true' : undefined} onClick={() => jump(i)}><span>{codes[i]}</span>{chapterName(section)}</button>
          </li>)}</ol>
        </div>)}
      </nav>
    </div>)}

    {content.contact && <div className="tape-contact"><button onClick={onContact}>편지 보내기 <span aria-hidden="true">↗</span></button></div>}

    {nextTrack && <button className="tape-next" style={{ '--next': nextTrack.accent }} disabled={busy} onClick={onNext}>
      <span className="tape-next-label">{nextLabel}</span>
      <span className="tape-next-title"><i aria-hidden="true" />{nextTrack.number} {nextTrack.title}</span>
      <span className="tape-next-ko">{nextTrack.heading}</span>
    </button>}
  </article>
}
