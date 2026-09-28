import { useEffect, useRef, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import IntegratedPlayer from './IntegratedPlayer'
import ContentBody from './ContentBody'
import ReaderShelf from './ReaderShelf'
import { coherentPlayer } from '../assets/player/coherent-geometry'

export default function StoryReader({ track, content, tracks, cases, mechanism, transport, reducedMotion, mobile, onToggle, onStop, onChange, onDesk, onProject, onBack, onProgress }) {
  const pane = useRef(null)
  const heading = useRef(null)
  const scrollUpdate = useRef(null)
  const player = useRef(null)
  const [playerPreview, setPlayerPreview] = useState(false)
  const [read, setRead] = useState({ key: '', ratio: 0 })
  const contentKey = content.id || track.id
  const ratio = read.key === contentKey ? read.ratio : 0
  const index = tracks.findIndex(item => item.id === track.id)
  const progressCallback = useRef(onProgress)
  useEffect(() => { progressCallback.current = onProgress }, [onProgress])
  useEffect(() => {
    const element = pane.current
    element.scrollTo({ top: 0, behavior: 'instant' })
    heading.current?.focus({ preventScroll: true })
    const update = () => {
      const maximum = element.scrollHeight - element.clientHeight
      const value = maximum > 2 ? Math.min(1, Math.max(0, element.scrollTop / maximum)) : 1
      setRead({ key: contentKey, ratio: value })
      progressCallback.current(value)
    }
    scrollUpdate.current = update
    const observer = new ResizeObserver(update)
    observer.observe(element)
    observer.observe(element.firstElementChild)
    element.addEventListener('scroll', update, { passive: true })
    update()
    return () => { scrollUpdate.current = null; observer.disconnect(); element.removeEventListener('scroll', update) }
  }, [contentKey])
  const change = offset => { if (tracks[index + offset]) onChange(tracks[index + offset]) }
  const transition = reducedMotion ? { duration: 0 } : { duration: .36, ease: [.22, 1, .36, 1] }
  return <Motion.main className="story-reader" aria-label={`${track.title} 내용 읽기`} initial={{ opacity: reducedMotion ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .18 }} onKeyDown={event => { if (event.key === 'Escape') onDesk() }}>
    <aside className="reader-sidebar">
      <button className="reader-wordmark" onClick={onDesk}>CHANG BIN<span>UI/UX DESIGNER</span></button>
      <div className="reader-current"><span className="reader-caption">{transport === 'playing' ? 'NOW PLAYING' : 'PAUSED'} · SIDE A</span><div className="reader-track-title"><span>{track.number}</span><h1>{track.title}</h1></div></div>
      <Motion.section className={`reader-player ${playerPreview ? 'is-drop-target' : ''}`} ref={player} layoutId="portfolio-player" transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 30 }} aria-label="카세트 플레이어" data-state={transport}>
        <IntegratedPlayer track={track} angles={mechanism.angles} progress={mechanism.progress} travel={mechanism.travel} transport={transport} />
        <span className="player-label">CHANG BIN · PORTFOLIO</span>
        <div className="transport-controls" aria-label="읽기 플레이어 조작">{coherentPlayer.controls.map((control, i) => {
          const [x, y, width, height] = control.bounds
          const labels = ['재생 또는 일시정지', '정지', '다음 테이프', '이전 테이프']
          const actions = [onToggle, onStop, () => change(1), () => change(-1)]
          return <button key={control.name} onClick={actions[i]} aria-label={labels[i]} title={labels[i]} aria-pressed={i === 0 ? transport === 'playing' : undefined} disabled={(i === 2 && index === tracks.length - 1) || (i === 3 && index === 0)} style={{ left: `${(x - 70) / 1380 * 100}%`, top: `${(y - 75) / 880 * 100}%`, width: `${width / 1380 * 100}%`, height: `${height / 880 * 100}%` }} />
        })}</div>
      </Motion.section>
      <div className="reader-position"><div><span>읽기 위치</span><span>{Math.round(ratio * 100)}%</span></div><div className="reader-progress" role="progressbar" aria-label="내용 읽기 위치" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(ratio * 100)}><span style={{ transform: `scaleX(${ratio})` }} /></div><p>스크롤에 맞춰 테이프가 감깁니다.</p></div>
      <nav className="reader-transport" aria-label="테이프 이동"><button disabled={index === 0} onClick={() => change(-1)}><svg viewBox="0 0 24 16" aria-hidden="true"><path d="M11 0L0 8l11 8V0zm12 0L12 8l11 8V0z" /></svg> 이전</button><button onClick={onToggle} aria-pressed={transport === 'playing'}><svg viewBox="0 0 24 16" aria-hidden="true">{transport === 'playing' ? <path d="M5 0h5v16H5zm9 0h5v16h-5z" /> : <path d="M6 0l14 8-14 8z" />}</svg>{transport === 'playing' ? '일시정지' : '재생'}</button><button disabled={index === tracks.length - 1} onClick={() => change(1)}>다음 <svg viewBox="0 0 24 16" aria-hidden="true"><path d="M1 0l11 8-11 8V0zm12 0l11 8-11 8V0z" /></svg></button></nav>
      <nav className="reader-track-list" aria-label="모든 테이프">{tracks.map(item => <button key={item.id} onClick={() => onChange(item)} aria-current={item.id === track.id ? 'page' : undefined} aria-label={`${item.number} ${item.title} 읽기`} title={item.title}>{item.number}</button>)}</nav>
      <ReaderShelf cases={cases} loadedId={track.id} playerRef={player} onChange={onChange} onPreview={setPlayerPreview} mobile={mobile} />
      <button className="reader-return" onClick={onDesk}>⏏ 책상으로 돌아가기</button>
    </aside>
    <Motion.section className="reader-page" initial={reducedMotion ? false : { opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ ...transition, delay: reducedMotion ? 0 : .12 }}>
      <header className="reader-toolbar">{content.parent ? <button className="reader-back" onClick={onBack} aria-label={`${content.parent.heading || content.parent.title} 목록으로 돌아가기`}><span aria-hidden="true">←</span>{content.parent.heading || content.parent.title}</button> : <span>TAPE {track.number} / SIDE A</span>}<button className="reader-exit" onClick={onDesk} aria-label="나가기 · 책상 홈으로 돌아가기"><span aria-hidden="true">×</span> 나가기</button></header>
      <div className="reader-scroll" ref={pane} tabIndex={0} aria-label="설명 페이지 스크롤">
        <Motion.article className={`reader-article content-${content.kind || 'story'}`} key={contentKey} initial={reducedMotion ? false : { opacity: .6, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={transition} onAnimationComplete={() => scrollUpdate.current?.()}>
          {!content.parent && <span className="detail-caption">{content.eyebrow}</span>}
          <ContentBody content={content} titleId="reader-title" headingRef={heading} onProject={onProject} motionEnabled={!reducedMotion} />
          <footer className="reader-page-footer"><span>{track.number} / {String(tracks.length).padStart(2, '0')}</span><button onClick={onDesk}>다른 테이프 고르기 ↗</button></footer>
        </Motion.article>
      </div>
    </Motion.section>
  </Motion.main>
}
