import { useEffect, useRef, useState } from 'react'

const matches = query => typeof window !== 'undefined' && window.matchMedia(query).matches
const prefersReducedMotion = () => matches('(prefers-reduced-motion: reduce)')
const canHover = () => matches('(hover: hover) and (pointer: fine)')

// Plays while `active`, rewinds to the poster when released.
function PreviewMedia({ preview, title, active }) {
  const video = useRef(null)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const element = video.current
    if (!element) return
    if (active) element.play().catch(() => {})
    else { element.pause(); element.currentTime = 0 }
  }, [active])
  if (!preview) return <div className="project-media is-empty" aria-hidden="true">
    <span className="project-media-empty-title">{title}</span>
    <span className="project-media-empty-note">작업 화면 준비 중</span>
  </div>
  return <div className="project-media" data-kind={preview.kind} data-active={active} aria-hidden="true">
    <video ref={video} src={preview.video} poster={preview.poster} muted loop playsInline preload="none" onTimeUpdate={event => setProgress(event.currentTarget.currentTime / (event.currentTarget.duration || 1))} />
    <span className="project-media-badge">{active ? '재생 중' : preview.kind === 'mobile' ? '모바일 흐름' : '웹사이트'}</span>
    <span className="project-media-progress"><i style={{ transform: `scaleX(${active ? progress : 0})` }} /></span>
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
    <PreviewMedia preview={project.preview} title={project.heading} active={active} />
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

// Detail pages keep the same recording running while it is on screen.
export function ProjectPreviewFrame({ project }) {
  const frame = useRef(null)
  const [playable] = useState(() => !prefersReducedMotion())
  const inView = useInView(frame, playable)
  return <figure ref={frame} className="project-preview-frame">
    <PreviewMedia preview={project.preview} title={project.heading} active={inView} />
    {project.preview.caption && <figcaption>{project.preview.caption}</figcaption>}
  </figure>
}
