import { useEffect, useRef, useState } from 'react'

const matches = query => typeof window !== 'undefined' && window.matchMedia(query).matches
const prefersReducedMotion = () => matches('(prefers-reduced-motion: reduce)')
const canHover = () => matches('(hover: hover) and (pointer: fine)')

const BADGE = { playing: '재생 중', forwarding: '빨리 감기', rewinding: '되감기', paused: '정지' }

// mode: 'idle' shows the poster, the others follow a tape transport (paused keeps its place).
function PreviewMedia({ preview, title, mode }) {
  const video = useRef(null)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const element = video.current
    if (!element) return
    if (mode === 'idle') { element.pause(); element.currentTime = 0; return }
    if (mode === 'paused') { element.pause(); return }
    if (mode === 'rewinding') {
      element.pause()
      let frame = 0, last = performance.now()
      const step = now => {
        element.currentTime = Math.max(0, element.currentTime - (now - last) / 1000 * 3)
        last = now
        if (element.currentTime > 0) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
      return () => cancelAnimationFrame(frame)
    }
    element.playbackRate = mode === 'forwarding' ? 3 : 1
    element.play().catch(() => {})
  }, [mode])
  if (!preview) return <div className="project-media is-empty" aria-hidden="true">
    <span className="project-media-empty-title">{title}</span>
    <span className="project-media-empty-note">작업 화면 준비 중</span>
  </div>
  const running = mode !== 'idle' && mode !== 'paused'
  return <div className="project-media" data-kind={preview.kind} data-active={running} aria-hidden="true">
    <video ref={video} src={preview.video} poster={preview.poster} muted loop playsInline preload="none" onTimeUpdate={event => setProgress(event.currentTarget.currentTime / (event.currentTarget.duration || 1))} />
    <span className="project-media-badge">{BADGE[mode] ?? (preview.kind === 'mobile' ? '모바일 흐름' : '웹사이트')}</span>
    <span className="project-media-progress" data-visible={mode !== 'idle'}><i style={{ transform: `scaleX(${mode === 'idle' ? 0 : progress})` }} /></span>
  </div>
}

// Touch screens have no hover, so the card that is mostly on screen plays instead.
function useInView(ref, enabled) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!enabled || !ref.current) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= .6), { threshold: [0, .6, 1] })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, enabled])
  return enabled && inView
}

function ProjectCard({ project, index, onOpen }) {
  const card = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [playable] = useState(() => Boolean(project.preview) && !prefersReducedMotion())
  const [hoverMode] = useState(canHover)
  const inView = useInView(card, playable && !hoverMode)
  const active = playable && (hoverMode ? hovered : inView)
  return <button ref={card} className="project-card" onClick={() => onOpen(project)} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}>
    <PreviewMedia preview={project.preview} title={project.heading} mode={active ? 'playing' : 'idle'} />
    <div className="project-card-body">
      <div className="project-card-title"><span className="project-index">{String(index + 1).padStart(2, '0')}</span><h3>{project.heading}</h3>{project.state && <span className="project-state">{project.state}</span>}</div>
      <p className="list-role">{project.role}</p>
      <p className="project-card-summary">{project.summary}</p>
      <span className="project-card-link">자세히 보기 <span aria-hidden="true">→</span></span>
    </div>
  </button>
}

export function ProjectCards({ projects, onProject }) {
  const hasPreview = projects.some(project => project.preview)
  return <div className="project-cards">
    {hasPreview && <p className="project-cards-hint"><i aria-hidden="true" /><span className="hint-hover">카드에 마우스를 올리면 작업 화면이 재생됩니다</span><span className="hint-touch">화면에 보이는 카드의 작업 화면이 재생됩니다</span></p>}
    <div className="project-card-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={onProject} />)}</div>
  </div>
}

const TRANSPORT_MODE = { playing: 'playing', forwarding: 'forwarding', rewinding: 'rewinding', stopped: 'paused' }

// Detail pages play the recording while it is on screen. Inside the reader it follows the player's transport instead.
export function ProjectPreviewFrame({ project, transport }) {
  const frame = useRef(null)
  const [playable] = useState(() => !prefersReducedMotion())
  const inView = useInView(frame, playable)
  const mode = !playable ? 'idle' : !inView ? (transport ? 'paused' : 'idle') : transport ? TRANSPORT_MODE[transport] ?? 'paused' : 'playing'
  return <figure ref={frame} className="project-preview-frame">
    <PreviewMedia preview={project.preview} title={project.heading} mode={mode} />
    {project.preview.caption && <figcaption>{project.preview.caption}</figcaption>}
  </figure>
}
