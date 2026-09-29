import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, LayoutGroup, motion as Motion, useReducedMotion } from 'framer-motion'
import Cassette from './components/Cassette'
import BrandMark from './components/BrandMark'
import ArchiveTray from './components/ArchiveTray'
import DeskPen from './components/DeskPen'
import { archiveTray, archiveCells, archiveCaseTargets } from './assets/archive/tray-geometry'
import ContentDialog from './components/ContentDialog'
import StoryReader from './components/StoryReader'
import IntegratedPlayer from './components/IntegratedPlayer'
import { coherentPlayer } from './assets/player/coherent-geometry'
import { topviewCassette } from './assets/cassette/topview-geometry'
import { assets } from './assets'
import { storageSlot } from './lib/storage-slot'
import useTapeTransport from './hooks/useTapeTransport'
import useTapeSwap from './hooks/useTapeSwap'
import { archiveTracks, memo, notes, profile, tracks } from './data/portfolio'

// Match the same source-art scale on the desk and inside the player.
// The door crops the inserted cassette; its visible rectangle is not its full size.
const cassetteViewportWidth = Number(topviewCassette.viewBox.split(' ')[2])
const playerViewportWidth = Number(coherentPlayer.viewBox.split(' ')[2])
const tapeToPlayerRatio = cassetteViewportWidth * topviewCassette.insertion.scale / playerViewportWidth
const allTracks = [...tracks, ...archiveTracks]
const initialStoredSlots = () => Array.from({ length: archiveTray.capacity }, (_, i) => archiveTracks[i]?.id ?? null)
const subscribeScreen = listener => {
  const media = window.matchMedia('(max-width: 760px)')
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}
const mobileSnapshot = () => window.matchMedia('(max-width: 760px)').matches

export default function App() {
  const stageRef = useRef(null), playerRef = useRef(null), archiveRef = useRef(null), dragging = useRef(false)
  const archiveDrag = useRef(null), suppressArchiveClick = useRef(false), returnFocus = useRef(false)
  const letterDragging = useRef(false)
  const reducedMotion = useReducedMotion()
  const isMobile = useSyncExternalStore(subscribeScreen, mobileSnapshot, () => false)
  const [loadedId, setLoadedId] = useState(null)
  const [reading, setReading] = useState(null)
  const [readerContent, setReaderContent] = useState(null)
  const [tapeChanging, setTapeChanging] = useState(false)
  const [deskTapeChanging, setDeskTapeChanging] = useState(false)
  const { mechanism, tapePositions, transport, setTransport, loadMechanism, saveMechanism } = useTapeTransport(reducedMotion, tapeChanging || deskTapeChanging)
  const [dialog, setDialog] = useState(null)
  const [status, setStatus] = useState('테이프를 골라 플레이어에 넣어보세요.')
  const [cycle, setCycle] = useState(0)
  const [storedSlots, setStoredSlots] = useState(initialStoredSlots)
  const [caseSlots, setCaseSlots] = useState(initialStoredSlots)
  const [dropTarget, setDropTarget] = useState(null)
  const [draggedId, setDraggedId] = useState(null)
  const [heldTape, setHeldTape] = useState(null)
  const [deskPositions, setDeskPositions] = useState({})
  useEffect(() => {
    if (!reading && returnFocus.current) {
      returnFocus.current = false
      playerRef.current?.querySelector('button')?.focus({ preventScroll: true })
    }
  }, [reading])
  const loaded = allTracks.find(t => t.id === loadedId)

  const loadTrack = id => {
    const track = allTracks.find(t => t.id === id)
    if (!track) return
    setStoredSlots(slots => slots.map(storedId => storedId === id ? null : storedId))
    setLoadedId(id)
    loadMechanism(track.id)
    setStatus(`${track.title} 테이프를 넣었습니다. 재생을 누르면 이야기가 열립니다.`)
  }

  const startReading = track => {
    setDialog(null); setReading(track); setReaderContent(track); setTransport('playing')
    setStatus(`${track.title} 이야기를 재생합니다.`)
  }
  const play = () => {
    if (deskSwap.busy) return
    if (loaded) startReading(loaded)
    else deskSwap.changeTrack(tracks[0], () => startReading(tracks[0]))
  }
  const changeReadingTrack = track => {
    loadTrack(track.id)
    setReading(track); setReaderContent(track); setTransport('playing')
    setStatus(`${track.number} ${track.title} 테이프로 바꿨습니다.`)
  }
  const returnToDesk = () => {
    returnFocus.current = true
    setReading(null); setReaderContent(null); setTapeChanging(false)
    eject()
  }
  const readerCases = Array.from({ length: archiveTray.capacity }, (_, index) => tracks[index] ?? null)
  const eject = () => {
    saveMechanism()
    setLoadedId(null); setTransport('stopped')
    setStatus('테이프를 꺼냈습니다. 다른 이야기를 골라보세요.')
  }
  const deskSwap = useTapeSwap({
    track: loaded, mechanism, reducedMotion, onBusyChange: setDeskTapeChanging,
    onChange: next => { if (next) loadTrack(next.id); else eject() },
  })
  const insertTrack = id => {
    if (deskSwap.busy) return
    const next = allTracks.find(track => track.id === id)
    if (!next || next.id === loadedId) return
    setStoredSlots(slots => slots.map(storedId => storedId === id ? null : storedId))
    deskSwap.changeTrack(next)
  }
  const reset = () => {
    deskSwap.cancel()
    setDeskPositions({}); setHeldTape(null); setDraggedId(null); archiveDrag.current = null
    eject(); setStoredSlots(initialStoredSlots()); setCaseSlots(initialStoredSlots()); setDropTarget(null); setCycle(c => c + 1)
    setStatus('테이프를 처음 배치로 되돌렸습니다.')
  }
  const stop = () => { saveMechanism(); setTransport('stopped'); setStatus('재생을 정지했습니다.') }
  const move = direction => {
    if (!loaded) { setStatus('먼저 테이프를 선택해 주세요.'); return }
    setTransport(direction)
    setStatus(direction === 'rewinding' ? '테이프를 되감고 있습니다.' : '테이프를 빨리 감고 있습니다.')
  }
  const storeTrack = (id, preferredSlot) => {
    if (storedSlots.includes(id)) return
    const slot = storageSlot(storedSlots, caseSlots, id, preferredSlot)
    if (slot === -1) { setStatus('보관함이 가득 찼습니다. 테이프를 먼저 꺼내주세요.'); return }
    setStoredSlots(slots => slots.map((storedId, i) => i === slot ? id : storedId))
    setCaseSlots(slots => slots.map((caseId, i) => i === slot ? id : caseId === id ? null : caseId))
    if (loadedId === id) { saveMechanism(); setLoadedId(null); setTransport('stopped') }
    const track = allTracks.find(t => t.id === id)
    setStatus(`${track.title} 테이프를 ${slot + 1}번 칸에 보관했습니다.`)
  }
  const locateDrop = info => {
    const x = info.point.x - window.scrollX, y = info.point.y - window.scrollY
    const player = playerRef.current.getBoundingClientRect()
    if (x >= player.left && x <= player.right && y >= player.top && y <= player.bottom) return { kind: 'player' }
    const svg = archiveRef.current.querySelector('.archive-art'), matrix = svg.getScreenCTM()
    if (!matrix) return null
    const point = svg.createSVGPoint(); point.x = x; point.y = y
    const local = point.matrixTransform(matrix.inverse()), body = archiveTray.body
    if (local.x < body.x || local.x > body.x + body.width || local.y < body.y || local.y > body.y + body.height) return null
    const slot = Math.max(0, Math.min(archiveTray.capacity - 1, Math.floor((local.y - archiveTray.floor.y) / archiveCells[0].height)))
    return { kind: 'archive', slot }
  }
  const previewDrop = (info, id) => {
    const target = locateDrop(info)
    if (target?.kind !== 'archive') return target
    return { ...target, hoveredSlot: target.slot, slot: storageSlot(storedSlots, caseSlots, id, target.slot), id }
  }
  const onDragEnd = (info, track) => {
    const target = previewDrop(info, track.id)
    setDropTarget(null); setDraggedId(null)
    if (target?.kind === 'player') insertTrack(track.id)
    else if (target?.kind === 'archive') storeTrack(track.id, target.slot)
    else setStatus(`${track.title} 테이프를 옮겼습니다.`)
    setTimeout(() => { dragging.current = false }, 0)
  }
  const startArchiveDrag = (event, track, slot) => {
    if (event.button !== 0) return
    suppressArchiveClick.current = false
    if (!storedSlots.includes(track.id)) return
    archiveDrag.current = { id: track.id, slot, pointerId: event.pointerId, x: event.clientX, y: event.clientY, active: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const moveArchiveDrag = event => {
    const current = archiveDrag.current
    if (!current || current.pointerId !== event.pointerId) return
    if (!current.active && Math.hypot(event.clientX - current.x, event.clientY - current.y) < 6) return
    if (!current.active) {
      current.active = true
      current.width = playerRef.current.getBoundingClientRect().width * tapeToPlayerRatio
      dragging.current = true
      setDraggedId(current.id)
      setStoredSlots(slots => slots.map(id => id === current.id ? null : id))
    }
    setHeldTape({ id: current.id, x: event.clientX, y: event.clientY, width: current.width })
    setDropTarget(previewDrop({ point: { x: event.clientX + window.scrollX, y: event.clientY + window.scrollY } }, current.id))
  }
  const finishArchiveDrag = (event, cancelled = false) => {
    const current = archiveDrag.current
    if (!current || current.pointerId !== event.pointerId) return
    archiveDrag.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (!current.active) return
    setHeldTape(null); setDropTarget(null); setDraggedId(null)
    suppressArchiveClick.current = !cancelled
    if (cancelled) {
      setStoredSlots(slots => slots.map((id, i) => i === current.slot ? current.id : id))
      setStatus('테이프를 원래 케이스로 되돌렸습니다.')
    } else {
      const target = previewDrop({ point: { x: event.clientX + window.scrollX, y: event.clientY + window.scrollY } }, current.id)
      if (target?.kind === 'player') insertTrack(current.id)
      else if (target?.kind === 'archive') storeTrack(current.id, target.slot)
      else {
        const bounds = stageRef.current.getBoundingClientRect()
        const height = current.width * Number(topviewCassette.viewBox.split(' ')[3]) / cassetteViewportWidth
        const left = Math.max(0, Math.min(bounds.width - current.width, event.clientX - bounds.left - current.width / 2))
        const top = Math.max(0, Math.min(bounds.height - height, event.clientY - bounds.top - height / 2))
        setDeskPositions(positions => ({ ...positions, [current.id]: { left: left / bounds.width * 100, top: top / bounds.height * 100 } }))
        setStatus('케이스에서 테이프를 꺼내 책상에 놓았습니다.')
      }
    }
    setTimeout(() => { dragging.current = false }, 0)
  }
  const clickArchiveCase = (event, track, slot) => {
    if (event.detail === 0) suppressArchiveClick.current = false
    if (suppressArchiveClick.current) { suppressArchiveClick.current = false; return }
    if (storedSlots[slot]) takeFromArchive(track.id)
    else storeTrack(track.id, slot)
  }

  const takeFromArchive = id => {
    setDialog(null)
    setStoredSlots(slots => slots.map(storedId => storedId === id ? null : storedId))
    setStatus('케이스에서 테이프를 꺼냈습니다. 빈 케이스는 보관함에 남습니다.')
  }

  const contact = { id: 'contact', kind: 'contact', eyebrow: 'LETTER', heading: '편지 보내기' }
  const storedTracks = storedSlots.map(id => allTracks.find(t => t.id === id) ?? null)
  const caseTracks = caseSlots.map(id => allTracks.find(t => t.id === id) ?? null)
  const storedCount = storedTracks.filter(Boolean).length
  const availableDeskTracks = allTracks.filter(t => !storedSlots.includes(t.id) && t.id !== loadedId && t.id !== deskSwap.incomingId && t.id !== heldTape?.id)
  const archivePreview = dropTarget?.kind === 'archive' ? dropTarget : null
  const previewTrack = allTracks.find(track => track.id === archivePreview?.id)
  const storageHint = archivePreview ? (archivePreview.slot < 0 ? '보관함이 가득 찼어요' : archivePreview.hoveredSlot === archivePreview.slot ? `${archivePreview.slot + 1}번 칸에 놓으면 보관됩니다` : `${archivePreview.hoveredSlot + 1}번 칸 사용 중 → ${archivePreview.slot + 1}번 칸에 보관`) : null

  return <>
    <LayoutGroup><AnimatePresence initial={false}>
    {!reading && <Motion.main key="desk" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }} onAnimationComplete={() => { if (!reading && returnFocus.current) { returnFocus.current = false; playerRef.current?.querySelector("button")?.focus({ preventScroll: true }) } }} className="portfolio" aria-label="정창빈 포트폴리오">
      <div className="desk" ref={stageRef} style={{ '--tape-player-ratio': tapeToPlayerRatio }}>
        <img className="desk-book-art" src={assets.background} alt="" aria-hidden="true" draggable={false} />
        <img className="desk-memo-art" src={assets.memoBackground} alt="" aria-hidden="true" draggable={false} />
        <header className="site-header"><BrandMark onHome={() => { setDialog(null); reset() }} /></header>
        <section className="hero" aria-label="소개"><h1>Press Play to Meet Me.</h1><p>{profile.intro}</p></section>
        <div className="tape-stage" aria-label="포트폴리오 테이프 선택">
          {availableDeskTracks.map(track => <Motion.button key={`${track.id}-${cycle}`} className={`tape tape-${track.id} ${archivePreview && draggedId === track.id ? 'is-storage-preview' : ''}`} aria-label={`${track.number} ${track.title} 테이프 넣기`} style={{ '--left': `${deskPositions[track.id]?.left ?? track.x / 1536 * 100}%`, '--top': `${deskPositions[track.id]?.top ?? track.y / 1024 * 100}%`, '--rotation': `${deskPositions[track.id] ? 0 : track.rotate}deg` }} drag={!isMobile && !deskSwap.busy} disabled={deskSwap.busy} dragConstraints={stageRef} dragMomentum={false} onDragStart={() => { dragging.current = true; setDraggedId(track.id) }} onDrag={(_e, info) => setDropTarget(previewDrop(info, track.id))} onDragEnd={(_e, info) => onDragEnd(info, track)} onClick={() => { if (!dragging.current) insertTrack(track.id) }} whileHover={reducedMotion ? undefined : { scale: 1.025 }} whileTap={{ scale: 1.01 }}>
            <div className="tape-orientation"><Cassette track={track} {...tapePositions[track.id]} /></div>
          </Motion.button>)}
        </div>
        <Motion.section layoutId="portfolio-player" transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 30 }} className={`player ${loaded ? 'is-loaded' : ''} ${dropTarget?.kind === 'player' ? 'is-drop-target' : ''}`} ref={playerRef} aria-label="카세트 플레이어" data-state={deskSwap.busy ? 'stopped' : transport} data-tape-phase={deskSwap.phase} aria-busy={deskSwap.busy}>
          <IntegratedPlayer track={loaded} angles={deskSwap.mechanism.angles} progress={deskSwap.mechanism.progress} travel={deskSwap.mechanism.travel} transport={deskSwap.busy ? 'stopped' : transport} tapePhase={deskSwap.phase} onTapeMotionComplete={deskSwap.finishStage} />
          <span className="player-label">CHANG BIN · PORTFOLIO</span>
          <div className="transport-controls" aria-label="플레이어 조작">{coherentPlayer.controls.map((control, i) => {
            const [x, y, width, height] = control.bounds
            const action = [play, stop, () => move('forwarding'), () => move('rewinding')][i]
            const pressed = [transport === 'playing', false, transport === 'forwarding', transport === 'rewinding'][i]
            return <button key={control.name} onClick={action} disabled={deskSwap.busy || (i !== 0 && !loaded)} aria-label={control.name} title={control.name} aria-pressed={i !== 1 ? !deskSwap.busy && pressed : undefined} style={{ left: `${(x - 70) / 1380 * 100}%`, top: `${(y - 75) / 880 * 100}%`, width: `${width / 1380 * 100}%`, height: `${height / 880 * 100}%` }} />
          })}</div>
          <div className="player-under"><span className={`led ${transport !== 'stopped' ? 'active' : ''}`} /><span>{deskSwap.busy ? 'CHANGING TAPE' : loaded ? (transport === 'playing' ? 'PLAYING' : transport === 'rewinding' ? 'REWIND' : transport === 'forwarding' ? 'FAST FORWARD' : 'READY TO PLAY') : 'PICK A TAPE'}</span>{loaded && <button disabled={deskSwap.busy} onClick={() => deskSwap.changeTrack(null)}>꺼내기 ⏏</button>}</div>
        </Motion.section>
        <Motion.button key={`letter-${cycle}`} className="desk-letter" drag dragConstraints={stageRef} dragMomentum={false} onPointerDown={() => { letterDragging.current = false }} onDragStart={() => { letterDragging.current = true }} onClick={event => { if (event.detail === 0 || !letterDragging.current) setDialog(contact) }} whileDrag={{ zIndex: 8 }} aria-label="이메일 보내기">
          <span className="desk-letter-paper">
            <span className="desk-letter-to">TO. CHANG BIN</span>
            <span className="desk-letter-stamp" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m3 6 9 7 9-7" /></svg></span>
            <span className="desk-letter-title">이메일 보내기 <span aria-hidden="true">↗</span></span>
          </span>
        </Motion.button>
        <button className="desk-object notebook" onClick={() => setDialog(notes)}><span className="object-eyebrow">WORK NOTES</span><strong>코레일 · 반려식물<br />국순당 · 왈가왈BOT</strong><span className="object-link">작업 기록 ↗</span></button>
        <div className="memo-scene">
        <button className="desk-object memo" onClick={() => setDialog(memo)} aria-label="작업 메모 · 남은 작업 보기">
          <span className="memo-binding" aria-hidden="true" />
          <span className="memo-content">
            <span className="memo-heading"><strong>작업 메모</strong><span>TO DO</span></span>
            <span className="memo-task-list"><span>코레일 화면 정리</span><span>식물 앱 흐름 연결</span><span>포트폴리오 보완</span></span>
            <span className="object-link">남은 작업 보기 <span aria-hidden="true">↗</span></span>
          </span>
        </button>
          <DeskPen key={`pen-${cycle}`} stageRef={stageRef} reducedMotion={reducedMotion} />
        </div>
        <section className={`desk-object archive ${dropTarget?.kind === 'archive' ? 'is-drop-target' : ''}`} ref={archiveRef} aria-label="카세트 보관함" data-hovered-slot={archivePreview?.hoveredSlot} data-preview-slot={archivePreview?.slot}>
          <div className="archive-orientation">
            <div className="archive-display"><ArchiveTray slots={storedTracks} cases={caseTracks} preview={archivePreview} previewTrack={previewTrack} /></div>
            {caseTracks.map((track, i) => track && <button key={track.id} className="archive-slot" data-slot={i} disabled={deskSwap.busy} aria-label={`${track.number} ${track.title} ${storedTracks[i] ? '테이프 꺼내기' : '빈 케이스에 넣기'}`} title={`${track.title} ${storedTracks[i] ? '끌어 꺼내기 · 클릭해서 꺼내기' : '빈 케이스 · 클릭하면 테이프 다시 보관'}`} onPointerDown={event => startArchiveDrag(event, track, i)} onPointerMove={moveArchiveDrag} onPointerUp={event => finishArchiveDrag(event)} onPointerCancel={event => finishArchiveDrag(event, true)} onClick={event => clickArchiveCase(event, track, i)} style={{ left: `${(archiveCaseTargets[i].x - archiveTray.viewport.x) / archiveTray.viewport.width * 100}%`, top: `${(archiveCaseTargets[i].y - archiveTray.viewport.y) / archiveTray.viewport.height * 100}%`, width: `${archiveCaseTargets[i].width / archiveTray.viewport.width * 100}%`, height: `${archiveCaseTargets[i].height / archiveTray.viewport.height * 100}%` }} />)}
          </div>
          {storageHint && <span className="archive-drop-hint" role="status">{storageHint}</span>}
          <p className="archive-caption">테이프 {storedCount}개 보관 · {archiveTray.capacity}칸</p>
        </section>
        <div className="desk-help"><span aria-hidden="true">↔</span><span className="desktop-help">테이프를 플레이어나 보관함에 끌어 넣으세요.</span><span className="mobile-help">테이프를 누르고, 재생 버튼으로 이야기를 만나세요.</span><button onClick={reset}>배치 초기화 ↺</button></div>
        <footer className="site-footer"><span>© {new Date().getFullYear()} CHANG BIN</span><span>UI/UX · PERSONAL PORTFOLIO</span></footer>
      </div>
    </Motion.main>}
    {reading && <StoryReader key="reader" tapePositions={tapePositions} track={reading} content={readerContent} tracks={tracks} cases={readerCases} mechanism={mechanism} transport={transport} reducedMotion={reducedMotion} mobile={isMobile} onPlay={() => setTransport('playing')} onStop={stop} onWind={move} onChange={changeReadingTrack} onDesk={returnToDesk} onProject={project => setReaderContent({ ...project, parent: readerContent })} onBack={() => setReaderContent(readerContent.parent)} onContact={() => setDialog(contact)} onTapeBusyChange={setTapeChanging} />}
    </AnimatePresence></LayoutGroup>
    {heldTape && <div className={`archive-held-tape ${archivePreview ? 'is-storage-preview' : ''}`} aria-hidden="true" style={{ left: heldTape.x, top: heldTape.y, width: heldTape.width }}><Cassette track={allTracks.find(t => t.id === heldTape.id)} {...tapePositions[heldTape.id]} /></div>}
    <p className="sr-only" aria-live="polite">{status}</p>
    {dialog && <ContentDialog key={dialog.id || dialog.title || dialog.heading} content={dialog} onContact={() => setDialog(contact)} onClose={() => setDialog(null)} onProject={project => setDialog({ ...project, parent: dialog })} onBack={() => setDialog(dialog.parent)} />}
  </>
}
