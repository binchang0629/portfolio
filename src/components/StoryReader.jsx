import { useLayoutEffect, useRef, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import IntegratedPlayer from './IntegratedPlayer'
import BrandMark from './BrandMark'
import ContentBody from './ContentBody'
import ReaderShelf from './ReaderShelf'
import useTapeSwap from '../hooks/useTapeSwap'
import { coherentPlayer } from '../assets/player/coherent-geometry'

export default function StoryReader({ track, content, tracks, cases, tapePositions, mechanism, transport, reducedMotion, mobile, onPlay, onStop, onWind, onChange, onDesk, onProject, onBack, onTapeBusyChange, onContact }) {
  const pane = useRef(null)
  const heading = useRef(null)
  const player = useRef(null)
  const [playerPreview, setPlayerPreview] = useState(false)
  const swap = useTapeSwap({ track, mechanism, reducedMotion, onChange, onBusyChange: onTapeBusyChange })
  const leaveReader = () => { swap.cancel(); onDesk() }
  const contentKey = content.id || track.id
  const index = tracks.findIndex(item => item.id === track.id)
  // Content scroll stays independent from the physical tape transport.
  useLayoutEffect(() => {
    pane.current.scrollTo({ top: 0, behavior: 'instant' })
    heading.current?.focus({ preventScroll: true })
  }, [contentKey])
  const change = offset => { if (tracks[index + offset]) swap.changeTrack(tracks[index + offset]) }
  const transportLabel = { playing: '재생 중', stopped: '정지', forwarding: '빨리 감는 중', rewinding: '되감는 중' }[transport]
  const transition = reducedMotion ? { duration: 0 } : { duration: .36, ease: [.22, 1, .36, 1] }
  return <Motion.main className="story-reader" aria-label={`${track.title} 내용 읽기`} initial={{ opacity: reducedMotion ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .18 }} onKeyDown={event => { if (event.key === 'Escape') leaveReader() }}>
    <header className="reader-header">
      <BrandMark reader onHome={leaveReader} />
      <button className="reader-exit" onClick={leaveReader} aria-label="나가기 · 책상 홈으로 돌아가기"><span>책상으로 돌아가기</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
    </header>
    <div className="reader-workspace">
    <aside className="reader-sidebar" aria-label="테이프 재생과 선택">
      <div className="reader-current"><span className="reader-caption" data-playing={!swap.busy && transport === 'playing'}><i aria-hidden="true" />{swap.busy ? '테이프 교체 중' : transportLabel}</span><div className="reader-track-title"><span>{track.number}</span><h1>{track.title}</h1></div></div>
      <Motion.section className={`reader-player ${playerPreview ? 'is-drop-target' : ''}`} ref={player} layoutId="portfolio-player" transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 30 }} aria-label="카세트 플레이어" data-state={swap.busy ? 'stopped' : transport} data-tape-phase={swap.phase} aria-busy={swap.busy}>
        <IntegratedPlayer track={track} angles={swap.mechanism.angles} progress={swap.mechanism.progress} travel={swap.mechanism.travel} transport={swap.busy ? 'stopped' : transport} tapePhase={swap.phase} onTapeMotionComplete={swap.finishStage} />
        <span className="player-label">CHANG BIN · PORTFOLIO</span>
        {!mobile && <div className="transport-controls" aria-label="카세트 플레이어 조작">{coherentPlayer.controls.map((control, i) => {
          const [x, y, width, height] = control.bounds
          const labels = ['재생', '정지', '빨리 감기', '되감기']
          const actions = [onPlay, onStop, () => onWind('forwarding'), () => onWind('rewinding')]
          const pressed = [transport === 'playing', false, transport === 'forwarding', transport === 'rewinding'][i]
          return <button key={control.name} onClick={actions[i]} aria-label={labels[i]} title={labels[i]} aria-pressed={i !== 1 ? !swap.busy && pressed : undefined} disabled={swap.busy} style={{ left: `${(x - 70) / 1380 * 100}%`, top: `${(y - 75) / 880 * 100}%`, width: `${width / 1380 * 100}%`, height: `${height / 880 * 100}%` }} />
        })}</div>}
      </Motion.section>
      {mobile && <div className="reader-mobile-controls" aria-label="카세트 플레이어 조작">
        {['재생', '정지', '빨리 감기', '되감기'].map((label, i) => <button key={label} onClick={[onPlay, onStop, () => onWind('forwarding'), () => onWind('rewinding')][i]} disabled={swap.busy} aria-label={label} aria-pressed={i !== 1 ? !swap.busy && [transport === 'playing', false, transport === 'forwarding', transport === 'rewinding'][i] : undefined}>{label}</button>)}
      </div>}
      <nav className="reader-transport" aria-label="테이프 교체">
        <button className="reader-previous" aria-label="이전 테이프" disabled={swap.busy || index === 0} onClick={() => change(-1)} title="이전 테이프로 교체">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6" /></svg><span>이전 테이프</span>
        </button>
        <button className="reader-next" aria-label="다음 테이프" disabled={swap.busy || index === tracks.length - 1} onClick={() => change(1)} title="다음 테이프로 교체">
          <span>다음 테이프</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
        </button>
      </nav>
      <ReaderShelf tapePositions={tapePositions} cases={cases} loadedId={track.id} playerRef={player} onChange={swap.changeTrack} busy={swap.busy} onPreview={setPlayerPreview} mobile={mobile} />
    </aside>
    <Motion.section className="reader-page" initial={reducedMotion ? false : { opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ ...transition, delay: reducedMotion ? 0 : .12 }}>
      <header className="reader-toolbar">{content.parent ? <button className="reader-back" onClick={onBack} aria-label={`${content.parent.heading || content.parent.title} 목록으로 돌아가기`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg><span>{content.parent.heading || content.parent.title}</span></button> : <span className="reader-section-label">{track.eyebrow}</span>}</header>
      <div className="reader-scroll" ref={pane} tabIndex={0} aria-label="설명 페이지 스크롤">
        <Motion.article className={`reader-article content-${content.kind || 'story'}`} key={contentKey} initial={reducedMotion ? false : { opacity: .8 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : .16, ease: 'easeOut' }}>
          <ContentBody content={content} titleId="reader-title" headingRef={heading} onProject={onProject} onContact={onContact} motionEnabled={false} transport={swap.busy ? 'stopped' : transport} />
          <footer className="reader-page-footer"><span>{track.number} / {String(tracks.length).padStart(2, '0')} · {track.title}</span>{index < tracks.length - 1 && <button disabled={swap.busy} onClick={() => change(1)}>다음 이야기 <span aria-hidden="true">→</span></button>}</footer>
        </Motion.article>
      </div>
    </Motion.section>
    </div>
  </Motion.main>
}
