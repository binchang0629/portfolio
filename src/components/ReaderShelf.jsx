import { useRef, useState } from 'react'
import ArchiveTray from './ArchiveTray'
import Cassette from './Cassette'
import { coherentPlayer } from '../assets/player/coherent-geometry'
import { topviewCassette } from '../assets/cassette/topview-geometry'
import { landscapeArchiveTray as archiveTray, landscapeCaseTargets as archiveCells } from '../assets/archive/tray-geometry'

const tapeToPlayerRatio = Number(topviewCassette.viewBox.split(' ')[2]) * topviewCassette.insertion.scale / Number(coherentPlayer.viewBox.split(' ')[2])

export default function ReaderShelf({ cases, loadedId, playerRef, onChange, onPreview, mobile }) {
  const drag = useRef(null), suppressClick = useRef(false)
  const [held, setHeld] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const slots = cases.map(track => track?.id === loadedId || track?.id === held?.track.id ? null : track)
  const insidePlayer = event => {
    const bounds = playerRef.current.getBoundingClientRect()
    return event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom
  }
  const start = (event, track) => {
    if (event.button !== 0 || track.id === loadedId) return
    suppressClick.current = false
    drag.current = { track, pointerId: event.pointerId, x: event.clientX, y: event.clientY, active: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const move = event => {
    const current = drag.current
    if (!current || current.pointerId !== event.pointerId) return
    if (!current.active && Math.hypot(event.clientX - current.x, event.clientY - current.y) < 6) return
    current.active = true
    setHeld({ track: current.track, x: event.clientX, y: event.clientY, width: playerRef.current.getBoundingClientRect().width * tapeToPlayerRatio })
    onPreview(insidePlayer(event))
  }
  const finish = (event, cancelled = false) => {
    const current = drag.current
    if (!current || current.pointerId !== event.pointerId) return
    drag.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    setHeld(null); onPreview(false)
    if (!current.active) return
    suppressClick.current = !cancelled
    if (!cancelled && insidePlayer(event)) { onChange(current.track); setExpanded(false) }
  }
  const select = (event, track) => {
    if (event.detail === 0) suppressClick.current = false
    if (suppressClick.current) { suppressClick.current = false; return }
    onChange(track); setExpanded(false)
  }
  return <section className={`reader-shelf ${expanded ? 'is-expanded' : ''}`} aria-label="읽기 화면 테이프 상자">
    <button className="reader-shelf-toggle" onClick={() => setExpanded(value => !value)} aria-expanded={!mobile || expanded}>테이프 상자 <span>{expanded ? '닫기 −' : '열기 +'}</span></button>
    <div className="reader-shelf-content">
      <div className="reader-shelf-art archive-orientation">
        <ArchiveTray slots={slots} cases={cases} orientation="landscape" />
        {cases.map((track, index) => track && <button className="reader-case" key={track.id} data-slot={index} disabled={track.id === loadedId} aria-label={`${track.number} ${track.title} ${track.id === loadedId ? '현재 재생 중' : '테이프 재생'}`} title={track.id === loadedId ? '플레이어에 들어간 테이프의 빈 케이스' : '플레이어로 끌어 넣기 · 클릭해서 교체'} onPointerDown={event => start(event, track)} onPointerMove={move} onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)} onClick={event => select(event, track)} style={{ left: `${(archiveCells[index].x - archiveTray.viewport.x) / archiveTray.viewport.width * 100}%`, top: `${(archiveCells[index].y - archiveTray.viewport.y) / archiveTray.viewport.height * 100}%`, width: `${archiveCells[index].width / archiveTray.viewport.width * 100}%`, height: `${archiveCells[index].height / archiveTray.viewport.height * 100}%` }} />)}
      </div>
      <p>끌어 넣거나 눌러서 테이프를 바꾸세요.</p>
    </div>
    {held && <div className="reader-held-tape" aria-hidden="true" style={{ left: held.x, top: held.y, width: held.width }}><Cassette track={held.track} /></div>}
  </section>
}
