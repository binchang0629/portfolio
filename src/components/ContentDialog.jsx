import { useEffect, useRef } from 'react'

export default function ContentDialog({ content, onClose, onTrack, onProject }) {
  const dialog = useRef(null)
  useEffect(() => {
    const element = dialog.current
    const previous = document.activeElement
    element.showModal()
    return () => { element.close(); previous?.focus() }
  }, [])
  return <dialog className="content-dialog" ref={dialog} aria-labelledby="dialog-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
    <div className="dialog-top"><span>{content.eyebrow || 'MY COLLECTION'}</span><button onClick={onClose} aria-label="닫기">닫기 <span aria-hidden="true">×</span></button></div>
    <h2 id="dialog-title">{content.heading || content.title}</h2>
    {content.role && <p className="project-role">{content.role}</p>}
    {content.summary && <p className="dialog-summary">{content.summary}</p>}
    {content.tags && <div className="tags">{content.tags.map(t => <span key={t}>{t}</span>)}</div>}
    <div className="dialog-sections">{content.sections?.map(s => <section key={s.title}>
      <h3>{s.title}</h3>{s.body && <p>{s.body}</p>}
      {s.items && <ul>{s.items.map(i => <li key={i}>{i}</li>)}</ul>}
      {s.email && <a className="email-link" href={`mailto:${s.email}`}>{s.email} ↗</a>}
      {s.link && <a className="source-link" href={s.link} target="_blank" rel="noreferrer">{s.linkLabel} ↗</a>}
    </section>)}</div>
    {content.collection && <div className="collection">{content.collection.map(t => <button key={t.id} onClick={() => onTrack(t.id)}><span>{t.number}</span><strong>{t.title}</strong><span>↗</span></button>)}</div>}
    {content.projects && <div className="project-grid">{content.projects.map(p => <button key={p.id} onClick={() => onProject(p)}><span>{p.eyebrow}</span><h3>{p.heading}</h3><p>{p.role}</p><p>{p.summary}</p><strong>프로젝트 보기 ↗</strong></button>)}</div>}
  </dialog>
}
