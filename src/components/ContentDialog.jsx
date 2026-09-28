import { useEffect, useRef } from 'react'
import ContentBody from './ContentBody'
import ContactForm from './ContactForm'

export default function ContentDialog({ content, onClose, onBack, onProject, onContact }) {
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
      {content.kind === 'contact' ? <ContactForm /> : <ContentBody content={content} onProject={onProject} onContact={onContact} />}
    </div>
  </dialog>
}
