import { useEffect, useRef } from 'react'
import Cassette from './Cassette'
import { archiveCells, archiveTray } from '../assets/archive/tray-geometry'

// A brief visual handoff: the real, draggable tapes stay at their final positions.
// The temporary tapes use those measured positions, so finishing never moves the desk.
export default function DeskArrival({ stageRef, archiveRef, tracks, onRelease, onFinish }) {
  const flightRefs = useRef([])

  useEffect(() => {
    const animations = [], flights = [], timers = []
    let disposed = false
    const start = async () => {
      // Let textures and fonts finish loading before the brief first-entry motion.
      const imageUrls = [...new Set([...document.querySelectorAll('.desk image')]
        .map(image => image.getAttribute('href')).filter(Boolean))]
      await Promise.all([document.fonts.ready, ...imageUrls.map(src => {
        const image = new Image(); image.src = src
        return image.decode().catch(() => {})
      })])
      if (disposed) return
      const stage = stageRef.current
      const svg = archiveRef.current?.querySelector('.archive-art')
      const matrix = svg?.getScreenCTM()
      if (!stage || !matrix) { onFinish(); return }
      const desk = stage.getBoundingClientRect()
      const transform = (x, y, angle, sx = 1, sy = .96) =>
        `translate(${x}px, ${y}px) scale(${sx}, ${sy}) rotate(${angle}deg)`

      tracks.forEach((track, index) => {
        const tape = stage.querySelector(`.tape-${track.id}`)
        const flight = flightRefs.current[index]
        if (!tape || !flight) return
        const target = tape.getBoundingClientRect()
        const cell = archiveCells[index]
        const point = svg.createSVGPoint()
        point.x = archiveTray.spine.y + archiveTray.spine.height / 2
        point.y = cell.y + cell.height / 2
        const origin = point.matrixTransform(matrix)
        const x0 = origin.x - desk.left - target.width / 2
        const y0 = origin.y - desk.top - target.height / 2
        const x1 = target.left - desk.left, y1 = target.top - desk.top
        const lift = Math.min(desk.height * .12, target.height * .7)
        const direction = index % 2 === 0 ? -1 : 1
        const startDelay = 240 + index * 65
        flight.style.width = `${target.width}px`
        const animation = flight.animate([
          { offset: 0, transform: transform(x0, y0, 0, .73, .17), opacity: 0,
            filter: 'drop-shadow(1px 2px 1px #38445632)', easing: 'cubic-bezier(.2,.6,.32,1)' },
          { offset: .035, transform: transform(x0, y0 - 6, direction * 3, .76, .23), opacity: 1 },
          { offset: .22, transform: transform(x0 + (x1 - x0) * .18, y0 - lift, direction * 24, 1.04, .9),
            filter: 'drop-shadow(10px 24px 12px #38445626)', easing: 'cubic-bezier(.12,.52,.3,1)' },
          { offset: .7, transform: transform(x1 - (x1 - x0) * .035, y1 - 13, track.rotate + direction * 7, 1.018, .96),
            filter: 'drop-shadow(5px 12px 6px #38445627)', easing: 'cubic-bezier(.4,0,.9,.6)' },
          { offset: .84, transform: transform(x1 + direction * 3, y1 + 2, track.rotate - direction * 2, 1, .96),
            filter: 'drop-shadow(1px 2px 1px #38445632) drop-shadow(4px 9px 6px #675f601f)', easing: 'ease-out' },
          { offset: 1, transform: transform(x1, y1, track.rotate), opacity: 1,
            filter: 'drop-shadow(1px 2px 1px #38445632) drop-shadow(4px 9px 6px #675f601f)' },
        ], { duration: 940, delay: startDelay, fill: 'both' })
        animations.push(animation); flights.push(animation)
        // Keep the source case disappearance on the same animation timeline as flight.
        // This also stays synchronized while the browser is busy painting SVG textures.
        for (const source of svg.querySelectorAll(`[data-case-id="${track.id}"], [data-number="${track.number}"]`)) {
          animations.push(source.animate([{ opacity: 1 }, { opacity: 0 }],
            { duration: 45, delay: startDelay, fill: 'forwards' }))
        }
        timers.push(window.setTimeout(() => { if (!disposed) onRelease(index) }, startDelay + 32))
      })

      Promise.all(flights.map(animation => animation.finished)).then(() => {
        if (!disposed) onFinish()
      }).catch(() => { /* Cancelled when the visitor starts interacting or resizes. */ })
    }
    start().catch(() => { if (!disposed) onFinish() })
    const settle = () => onFinish()
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    window.addEventListener('resize', settle)
    motionPreference.addEventListener('change', settle)
    return () => {
      disposed = true
      timers.forEach(window.clearTimeout)
      animations.forEach(animation => animation.cancel())
      window.removeEventListener('resize', settle)
      motionPreference.removeEventListener('change', settle)
    }
  }, [stageRef, archiveRef, tracks, onRelease, onFinish])

  return <div className="desk-arrival" aria-hidden="true">
    {tracks.map((track, index) => <div key={track.id} className="desk-arrival-tape"
      ref={element => { flightRefs.current[index] = element }} data-arrival-id={track.id}>
      <Cassette track={track} />
    </div>)}
  </div>
}
