import { useEffect, useRef } from 'react'

export default function ContentDialog({ content, onClose, onBack, onTrack, onProject, onStore }) {
  const dialog = useRef(null)
  const previousFocus = useRef(null)
  useEffect(() => {
    const element = dialog.current
    previousFocus.current = document.activeElement
    element.showModal()
    return () => { element.close(); previousFocus.current?.focus() }
  }, [])
  const close = () => { dialog.current.close(); onClose() }
  return <dialog className={`content-dialog content-${content.kind || 'story'}`} ref={dialog} aria-labelledby="dialog-title" onCancel={event => { event.preventDefault(); close() }} onClick={event => { if (event.target === event.currentTarget) close() }}>
    <div className="dialog-top">
      {content.parent ? <button className="dialog-back" onClick={onBack}>← {content.parent.heading || content.parent.title}</button> : <span>{content.eyebrow || 'MY TAPES'}</span>}
      <button className="dialog-close" onClick={close} aria-label="닫기">닫기 <span aria-hidden="true">×</span></button>
    </div>
    <div className="dialog-body">
      <header className="dialog-heading">
        {content.parent && <span className="detail-caption">{content.eyebrow}</span>}
        <h2 id="dialog-title">{content.heading || content.title}</h2>
        {content.role && <p className="project-role">{content.role}{content.state && <span className="project-state">{content.state}</span>}</p>}
        {content.summary && <p className="dialog-summary">{content.summary}</p>}
      </header>
      {content.facts && <dl className="project-facts">{content.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}
      {content.entries && <div className="work-entries">{content.entries.map(entry => <article key={entry.project}>
        <div className="entry-caption"><span>{entry.project}</span><span>{entry.label}</span></div><p>{entry.body}</p>
        <button onClick={() => onProject(entry.target)}>프로젝트 보기 <span aria-hidden="true">↗</span></button>
      </article>)}</div>}
      {content.checklist && <ol className="work-checklist">{content.checklist.map(item => <li key={item.label}><span className="task-mark" aria-hidden="true"/><div><strong>{item.label}</strong><p>{item.detail}</p></div><span className="task-state">{item.state}</span></li>)}</ol>}
      {content.projects && <div className="project-list">{content.projects.map((project, index) => <button key={project.id} onClick={() => onProject(project)}>
        <span className="project-index">0{index + 1}</span><div><div className="project-list-title"><h3>{project.heading}</h3>{project.state && <span className="project-state">{project.state}</span>}</div><p className="list-role">{project.role}</p><p>{project.summary}</p></div><span className="project-arrow" aria-hidden="true">↗</span>
      </button>)}</div>}
      {content.sections?.length > 0 && <div className="dialog-sections">{content.sections.map(section => <section key={section.title}>
        <h3>{section.title}</h3><div className="section-content">
          {section.body && <p>{section.body}</p>}
          {section.items && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
          {section.flow && <ol className="project-flow">{section.flow.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol>}
          {section.email && <a className="email-link" href={`mailto:${section.email}`}>{section.email} <span aria-hidden="true">↗</span></a>}
          {section.link && <a className="source-link" href={section.link} target="_blank" rel="noreferrer">{section.linkLabel} <span aria-hidden="true">↗</span></a>}
        </div>
      </section>)}</div>}
      {content.collection && <section className="storage-section"><h3>보관 중인 테이프 <span>{content.collection.length}</span></h3>{content.collection.length ? <div className="collection">{content.collection.map(track => <button key={track.id} aria-label={`${track.number} ${track.title} 테이프 꺼내기`} onClick={() => onTrack(track.id)}><span>{track.number}</span><strong>{track.title}</strong><span>꺼내기 ↗</span></button>)}</div> : <p>{content.emptyCaseCount ? '보관된 테이프는 없습니다. 빈 케이스는 그대로 남아 있습니다.' : '테이프를 끌어 놓으면 이곳에 보관됩니다.'}</p>}</section>}
      {content.storeCollection && <section className="storage-section"><h3>보관함에 넣기</h3>{content.storeCollection.length ? <div className="collection">{content.storeCollection.map(track => <button key={track.id} disabled={content.storageFull} aria-label={`${track.number} ${track.title} 보관함에 넣기`} onClick={() => onStore(track.id)}><span>{track.number}</span><strong>{track.title}</strong><span>보관 ↓</span></button>)}</div> : <p>다섯 테이프 모두 보관 중입니다.</p>}</section>}
      <footer className="dialog-footer"><span>CHANG BIN</span><span>{content.kind === 'notes' ? '작업 기록' : content.kind === 'memo' ? '진행 중인 작업' : 'PORTFOLIO'}</span></footer>
    </div>
  </dialog>
}
