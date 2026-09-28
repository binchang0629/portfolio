import { useRef, useState, useSyncExternalStore } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import Cassette from './components/Cassette'
import ArchiveTray from './components/ArchiveTray'
import { archiveTray, archiveCells } from './assets/archive/tray-geometry'
import ContentDialog from './components/ContentDialog'
import IntegratedPlayer from './components/IntegratedPlayer'
import { coherentPlayer } from './assets/player/coherent-geometry'
import { topviewCassette } from './assets/cassette/topview-geometry'
import { assets } from './assets'
import useTapeTransport from './hooks/useTapeTransport'
import { archiveTracks, notes, profile, tracks } from './data/portfolio'

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
  const reducedMotion = useReducedMotion()
  const isMobile = useSyncExternalStore(subscribeScreen, mobileSnapshot, () => false)
  const [loadedId, setLoadedId] = useState(null)
  const { mechanism, transport, setTransport, resetMechanism } = useTapeTransport(reducedMotion)
  const [dialog, setDialog] = useState(null)
  const [status, setStatus] = useState('테이프를 골라 플레이어에 넣어보세요.')
  const [cycle, setCycle] = useState(0)
  const [storedSlots, setStoredSlots] = useState(initialStoredSlots)
  const [caseSlots, setCaseSlots] = useState(initialStoredSlots)
  const [dropTarget, setDropTarget] = useState(null)
  const loaded = allTracks.find(t => t.id === loadedId)

  const loadTrack = id => {
    const track = allTracks.find(t => t.id === id)
    if (!track) return
    setStoredSlots(slots => slots.map(storedId => storedId === id ? null : storedId))
    setLoadedId(id)
    resetMechanism(track.winding ?? .28)
    setStatus(`${track.title} 테이프를 넣었습니다. 재생을 누르면 이야기가 열립니다.`)
  }

  const play = () => {
    const track = loaded || tracks[0]
    if (!loaded) loadTrack(track.id)
    setTransport('playing'); setDialog(track)
    setStatus(`${track.title} 이야기를 재생합니다.`)
  }
  const eject = () => {
    setLoadedId(null); setTransport('stopped')
    setStatus('테이프를 꺼냈습니다. 다른 이야기를 골라보세요.')
  }
  const reset = () => {
    eject(); setStoredSlots(initialStoredSlots()); setCaseSlots(initialStoredSlots()); setDropTarget(null); setCycle(c => c + 1)
    setStatus('테이프를 처음 배치로 되돌렸습니다.')
  }
  const stop = () => { setTransport('stopped'); setStatus('재생을 정지했습니다.') }
  const move = direction => {
    if (!loaded) { setStatus('먼저 테이프를 선택해 주세요.'); return }
    setTransport(direction)
    setStatus(direction === 'rewinding' ? '테이프를 되감고 있습니다.' : '테이프를 빨리 감고 있습니다.')
  }
  const storeTrack = (id, preferredSlot) => {
    if (storedSlots.includes(id)) return
    const homeSlot = caseSlots.indexOf(id)
    const requestedSlot = preferredSlot ?? (homeSlot >= 0 ? homeSlot : undefined)
    const slot = storedSlots[requestedSlot] === null ? requestedSlot : storedSlots.indexOf(null)
    if (slot === -1) { setStatus('보관함이 가득 찼습니다. 테이프를 먼저 꺼내주세요.'); return }
    setStoredSlots(slots => slots.map((storedId, i) => i === slot ? id : storedId))
    setCaseSlots(slots => slots.map((caseId, i) => i === slot ? id : caseId === id ? null : caseId))
    if (loadedId === id) { setLoadedId(null); setTransport('stopped') }
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
    const slot = Math.max(0, Math.min(archiveTray.capacity - 1, Math.floor((local.x - archiveTray.floor.x) / archiveCells[0].width)))
    return { kind: 'archive', slot }
  }
  const onDragEnd = (info, track) => {
    const target = locateDrop(info)
    setDropTarget(null)
    if (target?.kind === 'player') loadTrack(track.id)
    else if (target?.kind === 'archive') storeTrack(track.id, target.slot)
    else setStatus(`${track.title} 테이프를 옮겼습니다.`)
    setTimeout(() => { dragging.current = false }, 0)
  }
  const takeFromArchive = id => {
    setDialog(null)
    setStoredSlots(slots => slots.map(storedId => storedId === id ? null : storedId))
    setStatus('케이스에서 테이프를 꺼냈습니다. 빈 케이스는 보관함에 남습니다.')
  }

  const contact = { eyebrow: 'SAY HELLO', heading: '함께 이야기해요.', summary: '사용자의 경험을 더 나은 화면으로 만드는 일에 함께하고 싶습니다.', sections: [{ title: 'CONTACT', email: profile.email }] }
  const storedTracks = storedSlots.map(id => allTracks.find(t => t.id === id) ?? null)
  const caseTracks = caseSlots.map(id => allTracks.find(t => t.id === id) ?? null)
  const availableDeskTracks = allTracks.filter(t => !storedSlots.includes(t.id) && t.id !== loadedId)
  const archive = {
    kind: 'archive', eyebrow: 'MY TAPES', title: '카세트 보관함',
    summary: `${storedTracks.filter(Boolean).length} / ${archiveTray.capacity}칸 사용 중. 보관한 테이프를 선택하면 케이스에서 꺼냅니다. 빈 케이스를 누르면 테이프를 다시 보관합니다.`,
    collection: storedTracks.filter(Boolean), storeCollection: allTracks.filter(t => !storedSlots.includes(t.id)),
    storageFull: storedSlots.every(Boolean),
  }
  const currentDialog = dialog?.kind === 'archive' ? archive : dialog

  return <>
    <main className="portfolio" aria-label="정창빈 포트폴리오">
      <div className="desk" ref={stageRef} style={{ backgroundImage: `url(${assets.background})`, '--tape-player-ratio': tapeToPlayerRatio }}>
        <header className="site-header"><button className="wordmark" onClick={() => { setDialog(null); reset() }}>{profile.englishName}<span>{profile.role}</span></button><button className="contact-button" onClick={() => setDialog(contact)}>CONTACT <span aria-hidden="true">↗</span></button></header>
        <section className="hero"><span className="eyebrow">DESIGNING EXPERIENCES</span><h1>Press Play<br />to Meet Me.</h1><p>{profile.intro}</p><span className="hero-note">다섯 개의 테이프에 담긴, 나의 이야기.</span></section>
        <div className="tape-stage" aria-label="포트폴리오 테이프 선택">
          {availableDeskTracks.map(track => <Motion.button key={`${track.id}-${cycle}`} className={`tape tape-${track.id}`} aria-label={`${track.number} ${track.title} 테이프 넣기`} style={{ '--left': `${track.x / 1536 * 100}%`, '--top': `${track.y / 1024 * 100}%`, '--rotation': `${track.rotate}deg` }} drag={!isMobile} dragConstraints={stageRef} dragMomentum={false} onDragStart={() => { dragging.current = true }} onDrag={(_e, info) => setDropTarget(locateDrop(info)?.kind ?? null)} onDragEnd={(_e, info) => onDragEnd(info, track)} onClick={() => { if (!dragging.current) loadTrack(track.id) }} whileHover={reducedMotion ? undefined : { scale: 1.025 }} whileTap={{ scale: 1.01 }}>
            <div className="tape-orientation"><Cassette track={track} /></div>
          </Motion.button>)}
        </div>
        <section className={`player ${loaded ? 'is-loaded' : ''} ${dropTarget === 'player' ? 'is-drop-target' : ''}`} ref={playerRef} aria-label="카세트 플레이어" data-state={transport}>
          <IntegratedPlayer track={loaded} angles={mechanism.angles} progress={mechanism.progress} travel={mechanism.travel} />
          <span className="player-label">CHANG BIN · PORTFOLIO</span>
          <div className="transport-controls" aria-label="플레이어 조작">{coherentPlayer.controls.map((control, i) => {
            const [x, y, width, height] = control.bounds
            const action = [play, stop, () => move('forwarding'), () => move('rewinding')][i]
            const pressed = [transport === 'playing', false, transport === 'forwarding', transport === 'rewinding'][i]
            return <button key={control.name} onClick={action} disabled={i !== 0 && !loaded} aria-label={control.name} title={control.name} aria-pressed={i !== 1 ? pressed : undefined} style={{ left: `${(x - 70) / 1380 * 100}%`, top: `${(y - 75) / 880 * 100}%`, width: `${width / 1380 * 100}%`, height: `${height / 880 * 100}%` }} />
          })}</div>
          <div className="player-under"><span className={`led ${transport !== 'stopped' ? 'active' : ''}`} /><span>{loaded ? (transport === 'playing' ? 'PLAYING' : transport === 'rewinding' ? 'REWIND' : transport === 'forwarding' ? 'FAST FORWARD' : 'READY TO PLAY') : 'PICK A TAPE'}</span>{loaded && <button onClick={eject}>꺼내기 ⏏</button>}</div>
        </section>
        <button className="desk-object notebook" onClick={() => setDialog(notes)}><span className="object-eyebrow">NOTES</span><strong>관찰하고 만들고,<br />다시 개선하기.</strong><span className="object-link">작업 과정 보기 ↗</span></button>
        <button className="desk-object memo" onClick={() => setDialog(tracks[4])}><span className="object-eyebrow">NOW & NEXT</span><span>사용자 이해<br />화면 설계<br />더 나은 구현</span><span className="object-link">다음 목표 ↗</span></button>
        <section className={`desk-object archive ${dropTarget === 'archive' ? 'is-drop-target' : ''}`} ref={archiveRef} aria-label="카세트 보관함">
          <div className="archive-orientation">
            <button className="archive-open" onClick={() => setDialog(archive)} aria-label={`카세트 보관함 열기 · ${storedTracks.filter(Boolean).length} / ${archiveTray.capacity}칸`}><ArchiveTray slots={storedTracks} cases={caseTracks} /></button>
            {caseTracks.map((track, i) => track && <button key={track.id} className="archive-slot" data-slot={i} aria-label={`${track.number} ${track.title} ${storedTracks[i] ? '테이프 꺼내기' : '빈 케이스에 넣기'}`} title={`${track.title} ${storedTracks[i] ? '꺼내기' : '다시 보관'}`} onClick={() => storedTracks[i] ? takeFromArchive(track.id) : storeTrack(track.id, i)} style={{ left: `${(archiveCells[i].x - 87) / 1265 * 100}%`, top: `${(archiveCells[i].y - 80) / 927 * 100}%`, width: `${archiveCells[i].width / 1265 * 100}%`, height: `${archiveCells[i].height / 927 * 100}%` }} />)}
          </div>
          <button className="archive-caption" onClick={() => setDialog(archive)} aria-label="보관함 목록 열기">{storedTracks.filter(Boolean).length} / {archiveTray.capacity} · 테이프 보관함 ↗</button>
        </section>
        <div className="desk-help"><span aria-hidden="true">↔</span><span className="desktop-help">테이프를 플레이어나 보관함에 끌어 넣으세요.</span><span className="mobile-help">테이프를 누르고, 재생 버튼으로 이야기를 만나세요.</span><button onClick={reset}>배치 초기화 ↺</button></div>
        <footer className="site-footer"><span>© {new Date().getFullYear()} CHANG BIN</span><span>UI/UX · PERSONAL PORTFOLIO</span></footer>
      </div>
    </main>
    <p className="sr-only" aria-live="polite">{status}</p>
    {dialog && <ContentDialog key={dialog.id || dialog.title || dialog.heading} content={currentDialog} onClose={() => setDialog(null)} onProject={setDialog} onTrack={takeFromArchive} onStore={storeTrack} />}
  </>
}
