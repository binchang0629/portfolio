import { useLayoutEffect, useRef, useState } from 'react'
import Sentences from './Sentences'

const openingLeaves = Array.from({ length: 5 }, (_, index) => index)
// A record reads as labelled lines; a line without text (an unwritten 'learned') is left out.
const entryLines = [['problem', '부딪힌 문제'], ['change', '바꾼 것'], ['learned', '느낀 점']]
const goalStates = { done: '완료', doing: '진행 중', next: '다음' }

function Cover() {
  return <span className="journal-cover-face">
    <span className="journal-cover-rule" />
    <span className="journal-cover-title">작업 노트</span>
    <span className="journal-cover-subtitle">기록과 다음 목표</span>
    <span className="journal-cover-name">CHANG BIN</span>
  </span>
}

export default function WorkNotebook({ buttonRef, onOpen }) {
  return <button ref={buttonRef} className="desk-journal" onClick={onOpen} aria-label="작업 노트 · 작업 기록과 앞으로의 목표 펼치기" aria-haspopup="dialog">
    <span className="desk-journal-pages" aria-hidden="true" />
    <span className="desk-journal-cover"><Cover /></span>
    <span className="desk-journal-ribbon" aria-hidden="true" />
  </button>
}

export function NotebookDialog({ triggerRef, entries, goals, reducedMotion, mobile, onClose, onProject }) {
  const dialog = useRef(null), book = useRef(null), cover = useRef(null), leftPage = useRef(null)
  const heading = useRef(null), closing = useRef(false), animations = useRef([]), origin = useRef(null)
  const leaves = useRef([])
  const [page, setPage] = useState('records')
  const animate = (element, frames, options) => {
    const animation = element.animate(frames, { fill: 'both', ...options })
    animations.current.push(animation)
    return animation.finished.catch(() => {})
  }
  useLayoutEffect(() => {
    const element = dialog.current, trigger = triggerRef.current
    const previousOverflow = document.body.style.overflow
    const previousVisibility = trigger?.style.visibility
    const currentAnimations = animations.current
    element.showModal()
    document.body.style.overflow = 'hidden'
    const from = trigger?.getBoundingClientRect(), to = book.current.getBoundingClientRect()
    const pivot = mobile ? .5 : .75
    if (trigger) trigger.style.visibility = 'hidden'
    origin.current = from ? `translate(${from.x + from.width / 2 - (to.x + to.width * pivot)}px, ${from.y + from.height / 2 - (to.y + to.height / 2)}px) ${getComputedStyle(trigger).transform} scale(${trigger.offsetWidth / (to.width * (mobile ? 1 : .5))}, ${trigger.offsetHeight / to.height})` : 'scale(.8)'
    book.current.style.transformOrigin = `${pivot * 100}% 50%`
    if (!reducedMotion) {
      // The cover leads a short cascade of double-sided sheets at the same spine.
      const timing = { duration: 1040, easing: 'cubic-bezier(.28,.08,.2,1)' }
      animate(book.current, [{ transform: origin.current }, { transform: 'none' }], timing)
      animate(cover.current, [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-180deg)' }], { ...timing, duration: 880 })
      if (!mobile) animate(leftPage.current, [{ transform: 'rotateY(180deg)' }, { transform: 'rotateY(0deg)' }], { ...timing, duration: 900 })
      leaves.current.forEach((leaf, index) => {
        animate(leaf, [
          { transform: 'rotateY(0deg) skewY(0deg)', opacity: 1, offset: 0 },
          { transform: 'rotateY(-82deg) skewY(-1.4deg)', opacity: 1, offset: .46 },
          { transform: 'rotateY(-170deg) skewY(-.3deg)', opacity: 1, offset: .9 },
          { transform: 'rotateY(-180deg) skewY(0deg)', opacity: 0, offset: 1 },
        ], { duration: 610, delay: 170 + index * 72, easing: 'cubic-bezier(.32,.02,.26,1)' })
      })
      for (const chrome of element.querySelectorAll('.journal-toolbar,.journal-tabs')) {
        animate(chrome, [{ opacity: 0 }, { opacity: 1 }], { duration: 320, delay: 520, easing: 'ease-out' })
      }
    }
    heading.current?.focus({ preventScroll: true })
    return () => {
      currentAnimations.forEach(animation => animation.cancel())
      element.close()
      if (trigger) trigger.style.visibility = previousVisibility
      document.body.style.overflow = previousOverflow
      trigger?.focus({ preventScroll: true })
    }
  }, [triggerRef, reducedMotion, mobile])

  const close = async (project) => {
    if (closing.current) return
    closing.current = true
    if (!reducedMotion) {
      const coverTransform = getComputedStyle(cover.current).transform
      const bookTransform = getComputedStyle(book.current).transform
      const pageTransform = getComputedStyle(leftPage.current).transform
      const leafPoses = leaves.current.map(leaf => ({ transform: getComputedStyle(leaf).transform, opacity: getComputedStyle(leaf).opacity }))
      animations.current.forEach(animation => animation.cancel())
      const current = book.current.getBoundingClientRect(), target = triggerRef.current?.getBoundingClientRect()
      const pivot = mobile ? .5 : .75
      const destination = target ? `translate(${target.x + target.width / 2 - (current.x + current.width * pivot)}px, ${target.y + target.height / 2 - (current.y + current.height / 2)}px) ${getComputedStyle(triggerRef.current).transform} scale(${triggerRef.current.offsetWidth / (current.width * (mobile ? 1 : .5))}, ${triggerRef.current.offsetHeight / current.height})` : origin.current
      dialog.current.dataset.closing = 'true'
      const timing = { duration: 650, easing: 'cubic-bezier(.4,0,.25,1)' }
      leaves.current.forEach((leaf, index) => {
        if (Number(leafPoses[index].opacity) > 0) animate(leaf, [leafPoses[index], { transform: 'rotateY(0deg)', opacity: 0 }], { duration: 260, easing: 'ease-out' })
      })
      const fold = animate(cover.current, [{ transform: coverTransform }, { transform: 'rotateY(0deg)' }], timing)
      if (!mobile) animate(leftPage.current, [{ transform: pageTransform }, { transform: 'rotateY(180deg)' }], timing)
      const returnToDesk = animate(book.current, [{ transform: bookTransform }, { transform: destination }], timing)
      for (const chrome of dialog.current.querySelectorAll('.journal-toolbar,.journal-tabs')) {
        animate(chrome, [{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: 'ease-out' })
      }
      await Promise.all([fold, returnToDesk])
    }
    if (project) onProject(project)
    else onClose()
  }
  const switchPage = value => {
    setPage(value)
    book.current.querySelector('.journal-paper-scroll')?.scrollTo({ top: 0 })
  }
  return <dialog ref={dialog} className="journal-dialog" data-reduced-motion={Boolean(reducedMotion)} aria-labelledby="journal-title" onCancel={event => { event.preventDefault(); close() }} onClick={event => { if (event.target === event.currentTarget) close() }}>
    <div className="journal-frame">
      <div className="journal-toolbar"><h2 id="journal-title" ref={heading} tabIndex={-1}>작업 노트</h2><button onClick={() => close()} aria-label="작업 노트 닫기">닫기 <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div>
      <div className="journal-tabs" role="tablist" aria-label="노트 페이지" onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
        event.preventDefault()
        const next = ['ArrowLeft', 'Home'].includes(event.key) ? 'records' : 'goals'
        switchPage(next)
        event.currentTarget.querySelector(`[data-page="${next}"]`)?.focus()
      }}>
        <button role="tab" id="journal-records-tab" data-page="records" aria-selected={page === 'records'} aria-controls="journal-records" tabIndex={page === 'records' ? 0 : -1} onClick={() => switchPage('records')}>작업 기록</button>
        <button role="tab" id="journal-goals-tab" data-page="goals" aria-selected={page === 'goals'} aria-controls="journal-goals" tabIndex={page === 'goals' ? 0 : -1} onClick={() => switchPage('goals')}>앞으로의 목표</button>
      </div>
      <div ref={book} className="journal-spread" data-page={page}>
        <section ref={leftPage} id="journal-records" className="journal-paper journal-left" role={mobile ? 'tabpanel' : undefined} aria-labelledby={mobile ? 'journal-records-tab' : 'journal-records-heading'}>
          <header><span>기록</span><h3 id="journal-records-heading">작업 기록</h3><p>만들면서 고민하고, 고쳐 온 것들.</p></header>
          <div className="journal-paper-scroll">
            {entries.map((entry, index) => <details className="journal-entry" key={entry.project} open={index === 0 ? true : undefined}>
              <summary><span className="journal-entry-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{entry.project}</strong><small>{entry.label}</small></span><span className="journal-entry-mark" aria-hidden="true" /></summary>
              <dl className="journal-entry-lines">{entryLines.filter(([key]) => entry[key]).map(([key, name]) => <div key={key} data-line={key}><dt>{name}</dt><dd><Sentences text={entry[key]} /></dd></div>)}</dl>
              <button className="journal-project-link" onClick={() => close(entry.target)}>프로젝트 보기 <span aria-hidden="true">↗</span></button>
            </details>)}
          </div>
          <footer><span>CHANG BIN</span><span>01</span></footer>
        </section>
        <section id="journal-goals" className="journal-paper journal-right" role={mobile ? 'tabpanel' : undefined} aria-labelledby={mobile ? 'journal-goals-tab' : 'journal-goals-heading'}>
          <header><span>다음</span><h3 id="journal-goals-heading">앞으로의 목표</h3><p>끝낸 것, 하고 있는 것, 다음에 할 것.</p></header>
          <div className="journal-paper-scroll"><ol className="journal-goals">{goals.map(goal => <li key={goal.label} data-state={goal.state}>
            <span className="journal-goal-mark" aria-hidden="true">{goal.state === 'done' && <svg viewBox="0 0 24 24"><path d="M4.2 13.4c1.4 1.1 2.6 2.4 3.6 4.1 2.7-5.3 6.4-9.8 11.6-13.6" /></svg>}</span>
            <div><h4>{goal.label}<span className="journal-goal-state">{goalStates[goal.state]}</span></h4><p><Sentences text={goal.detail} /></p></div>
          </li>)}</ol></div>
          <footer><span>계속 채워 가는 노트</span><span>02</span></footer>
        </section>
        <div className="journal-turning-pages" aria-hidden="true">{openingLeaves.map(index => <div ref={element => { leaves.current[index] = element }} className="journal-turning-leaf" key={index} style={{ zIndex: openingLeaves.length - index }}>
          <span className="journal-leaf-face journal-leaf-front" />
          <span className="journal-leaf-face journal-leaf-back" />
        </div>)}</div>
        <div ref={cover} className="journal-opening-cover" aria-hidden="true"><Cover /></div>
      </div>
    </div>
  </dialog>
}
