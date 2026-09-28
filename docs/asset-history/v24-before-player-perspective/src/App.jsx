import { useRef, useState, useSyncExternalStore } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import Cassette from './components/Cassette'
import FrontCassette from './components/FrontCassette'
import ContentDialog from './components/ContentDialog'
import PlayerShell from './components/PlayerShell'
import { assets } from './assets'
import useTapeTransport from './hooks/useTapeTransport'
import { archiveTracks, notes, profile, tracks } from './data/portfolio'

const allTracks = [...tracks, ...archiveTracks]
const subscribeScreen = listener => {
  const media = window.matchMedia('(max-width: 760px)')
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}
const mobileSnapshot = () => window.matchMedia('(max-width: 760px)').matches

export default function App() {
  const stageRef = useRef(null), playerRef = useRef(null), dragging = useRef(false)
  const reducedMotion = useReducedMotion()
  const isMobile = useSyncExternalStore(subscribeScreen, mobileSnapshot, () => false)
  const [loadedId, setLoadedId] = useState(null)
  const { mechanism, transport, setTransport, resetMechanism } = useTapeTransport(reducedMotion)
  const [dialog, setDialog] = useState(null)
  const [status, setStatus] = useState('테이프를 골라 플레이어에 넣어보세요.')
  const [cycle, setCycle] = useState(0), [takenIds, setTakenIds] = useState([])
  const loaded = allTracks.find(t => t.id === loadedId)

  const loadTrack = id => {
    const track = allTracks.find(t => t.id === id)
    if (!track) return
    // A replaced archive tape returns to its box rather than duplicating on the desk.
    setTakenIds(ids => ids.filter(takenId => takenId !== loadedId || takenId === id))
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
    setTakenIds(ids => ids.filter(id => id !== loadedId))
    setLoadedId(null); setTransport('stopped')
    setStatus('테이프를 꺼냈습니다. 다른 이야기를 골라보세요.')
  }
  const reset = () => {
    eject(); setTakenIds([]); setCycle(c => c + 1)
    setStatus('테이프를 처음 배치로 되돌렸습니다.')
  }
  const stop = () => { setTransport('stopped'); setStatus('재생을 정지했습니다.') }
  const move = direction => {
    if (!loaded) { setStatus('먼저 테이프를 선택해 주세요.'); return }
    setTransport(direction)
    setStatus(direction === 'rewinding' ? '테이프를 되감고 있습니다.' : '테이프를 빨리 감고 있습니다.')
  }
  const onDragEnd = (info, track) => {
    const rect = playerRef.current.getBoundingClientRect()
    const x = info.point.x - window.scrollX, y = info.point.y - window.scrollY
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) loadTrack(track.id)
    else setStatus(`${track.title} 테이프를 옮겼습니다.`)
    setTimeout(() => { dragging.current = false }, 0)
  }
  const takeFromArchive = id => {
    setDialog(null); setTakenIds(ids => [...new Set([...ids, id])])
    setStatus('보관함에서 테이프를 꺼냈습니다. 플레이어에 넣어주세요.')
  }

  const contact = { eyebrow: 'SAY HELLO', heading: '함께 이야기해요.', summary: '사용자의 경험을 더 나은 화면으로 만드는 일에 함께하고 싶습니다.', sections: [{ title: 'CONTACT', email: profile.email }] }
  const availableArchive = archiveTracks.filter(t => !takenIds.includes(t.id) && t.id !== loadedId)
  const archive = { eyebrow: 'MORE TAPES', title: '새로운 경험을 담을 자리', summary: archiveTracks.length ? '테이프를 꺼내 책상에 놓고 플레이어에 넣어보세요.' : '추가 작업을 준비하고 있습니다. 새로운 작업은 이 보관함에서 꺼내 재생할 수 있도록 쌓아갈 예정입니다.', collection: availableArchive }

  return <>
    <main className="portfolio" aria-label="정창빈 포트폴리오">
      <div className="desk" ref={stageRef} style={{ backgroundImage: `url(${assets.background})` }}>
        <header className="site-header"><button className="wordmark" onClick={() => { setDialog(null); reset() }}>{profile.englishName}<span>{profile.role}</span></button><button className="contact-button" onClick={() => setDialog(contact)}>CONTACT <span aria-hidden="true">↗</span></button></header>
        <section className="hero"><span className="eyebrow">DESIGNING EXPERIENCES</span><h1>Press Play<br />to Meet Me.</h1><p>{profile.intro}</p><span className="hero-note">다섯 개의 테이프에 담긴, 나의 이야기.</span></section>
        <div className="tape-stage" aria-label="포트폴리오 테이프 선택">
          {allTracks.filter(t => t.id !== loadedId && (tracks.includes(t) || takenIds.includes(t.id))).map(track => <Motion.button key={`${track.id}-${cycle}`} className={`tape tape-${track.id}`} aria-label={`${track.number} ${track.title} 테이프 넣기`} style={{ '--left': `${track.x / 1536 * 100}%`, '--top': `${track.y / 1024 * 100}%`, '--rotation': `${track.rotate}deg` }} drag={!isMobile} dragConstraints={stageRef} dragMomentum={false} onDragStart={() => { dragging.current = true }} onDragEnd={(_e, info) => onDragEnd(info, track)} onClick={() => { if (!dragging.current) loadTrack(track.id) }} whileHover={reducedMotion ? undefined : { scale: 1.025 }} whileTap={{ scale: 1.01 }}>
            <div className="tape-orientation"><Cassette track={track} /></div>
          </Motion.button>)}
        </div>
        <section className={`player ${loaded ? 'is-loaded' : ''}`} ref={playerRef} aria-label="카세트 플레이어" data-state={transport}>
          <PlayerShell />
          <span className="player-label">{loaded ? `${loaded.number} / ${loaded.title}` : 'CHANG BIN · PORTFOLIO'}</span>
          {loaded && <div className="player-window"><div className="inserted-tape"><FrontCassette track={loaded} angles={mechanism.angles} progress={mechanism.progress} /></div><span className="window-glass" /></div>}
          <div className="transport-controls"><button onClick={play} aria-pressed={transport === 'playing'} aria-label="재생" title="재생"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l12-7Z" /></svg></button><button onClick={stop} disabled={!loaded} aria-label="정지" title="정지"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h12v12H6Z" /></svg></button><button onClick={() => move('forwarding')} disabled={!loaded} aria-pressed={transport === 'forwarding'} aria-label="빨리 감기" title="빨리 감기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6v12l9-6ZM12 6v12l9-6Z" /></svg></button><button onClick={() => move('rewinding')} disabled={!loaded} aria-pressed={transport === 'rewinding'} aria-label="되감기" title="되감기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 6v12l-9-6ZM12 6v12l-9-6Z" /></svg></button></div>
          <div className="player-under"><span className={`led ${transport !== 'stopped' ? 'active' : ''}`} /><span>{loaded ? (transport === 'playing' ? 'PLAYING' : transport === 'rewinding' ? 'REWIND' : transport === 'forwarding' ? 'FAST FORWARD' : 'READY TO PLAY') : 'PICK A TAPE'}</span>{loaded && <button onClick={eject}>꺼내기 ⏏</button>}</div>
        </section>
        <button className="desk-object notebook" onClick={() => setDialog(notes)}><span className="object-eyebrow">NOTES</span><strong>관찰하고,<br />만들고,<br />다시 개선하기.</strong><span className="object-link">작업 과정 보기 ↗</span></button>
        <button className="desk-object memo" onClick={() => setDialog(tracks[4])}><span className="object-eyebrow">NOW & NEXT</span><span>사용자 이해<br />화면 설계<br />더 나은 구현</span><span className="object-link">다음 목표 ↗</span></button>
        <button className="desk-object archive" onClick={() => setDialog(archive)}><strong>MORE TAPES</strong><span>{archiveTracks.length ? `${availableArchive.length}개 꺼낼 수 있어요` : '추가 작업 준비 중'} ↗</span></button>
        <div className="desk-help"><span aria-hidden="true">↔</span><span className="desktop-help">테이프를 끌어 넣거나 눌러서 선택하세요.</span><span className="mobile-help">테이프를 누르고, 재생 버튼으로 이야기를 만나세요.</span><button onClick={reset}>배치 초기화 ↺</button></div>
        <footer className="site-footer"><span>© {new Date().getFullYear()} CHANG BIN</span><span>UI/UX · PERSONAL PORTFOLIO</span></footer>
      </div>
    </main>
    <p className="sr-only" aria-live="polite">{status}</p>
    {dialog && <ContentDialog key={dialog.id || dialog.title || dialog.heading} content={dialog} onClose={() => setDialog(null)} onProject={setDialog} onTrack={takeFromArchive} />}
  </>
}
