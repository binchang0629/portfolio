import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react'
import { motion as Motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import { assets } from '../assets'

const Pen3D = lazy(() => import('./Pen3D'))

// The flat pen image carries the first paint; three.js is fetched once the page has gone idle.
function useIdle() {
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    const ready = () => setIdle(true)
    if ('requestIdleCallback' in window) { const id = requestIdleCallback(ready, { timeout: 2500 }); return () => cancelIdleCallback(id) }
    const id = setTimeout(ready, 1200)
    return () => clearTimeout(id)
  }, [])
  return idle
}

export default function DeskPen({ stageRef, reducedMotion }) {
  const penRef = useRef(null), rolling = useRef(null)
  const x = useMotionValue(0), y = useMotionValue(0), rotate = useMotionValue(0), roll = useMotionValue(0)
  const instructions = useId()
  const idle = useIdle()
  const stopRolling = () => { rolling.current = null; x.stop(); y.stop(); rotate.stop() }
  const release = (_event, info) => {
    stopRolling()
    if (reducedMotion || Math.hypot(info.velocity.x, info.velocity.y) < 70) return
    const pen = penRef.current, bounds = pen.getBoundingClientRect(), desk = stageRef.current.getBoundingClientRect()
    // Rotation changes the footprint, so keep the entire rotating pen on the desk.
    rolling.current = {
      vx: Math.max(-1800, Math.min(1800, info.velocity.x)),
      vy: Math.max(-1800, Math.min(1800, info.velocity.y)),
      spin: Math.max(-140, Math.min(140, (info.velocity.x * .97 + info.velocity.y * .24) * .012)),
      width: pen.offsetWidth, height: pen.offsetHeight,
      centerX: bounds.left + bounds.width / 2 - x.get() - desk.left,
      centerY: bounds.top + bounds.height / 2 - y.get() - desk.top,
    }
  }
  useAnimationFrame((_time, delta) => {
    const current = rolling.current
    if (!current || !stageRef.current) return
    if (reducedMotion) { stopRolling(); return }
    const dt = Math.min(delta, 40) / 1000, friction = Math.exp(-5 * dt), spinFriction = Math.exp(-6 * dt)
    const previousX = x.get(), previousY = y.get()
    let nextX = previousX + current.vx * (1 - friction) / 5
    let nextY = previousY + current.vy * (1 - friction) / 5
    const angle = rotate.get() + current.spin * (1 - spinFriction) / 6
    const radians = angle * Math.PI / 180
    const halfWidth = (current.width * Math.abs(Math.cos(radians)) + current.height * Math.abs(Math.sin(radians))) / 2
    const halfHeight = (current.width * Math.abs(Math.sin(radians)) + current.height * Math.abs(Math.cos(radians))) / 2
    const desk = stageRef.current.getBoundingClientRect()
    const minX = halfWidth - current.centerX, maxX = desk.width - halfWidth - current.centerX
    const minY = halfHeight - current.centerY, maxY = desk.height - halfHeight - current.centerY
    if (nextX < minX || nextX > maxX) { nextX = Math.max(minX, Math.min(maxX, nextX)); current.vx *= -.12; current.spin *= .65 }
    if (nextY < minY || nextY > maxY) { nextY = Math.max(minY, Math.min(maxY, nextY)); current.vy *= -.12; current.spin *= .65 }
    const across = (14 + angle) * Math.PI / 180
    const rollingDistance = (nextX - previousX) * Math.cos(across) + (nextY - previousY) * Math.sin(across)
    // No-slip rolling: distance = radius × angle, independent of frame rate.
    roll.set(roll.get() + rollingDistance / (current.height * .075 / 2.8))
    x.set(nextX); y.set(nextY); rotate.set(angle)
    current.vx *= friction; current.vy *= friction; current.spin *= spinFriction
    if (Math.hypot(current.vx, current.vy) < 5 && Math.abs(current.spin) < .5) rolling.current = null
  })
  const moveWithKeys = event => {
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
    const direction = directions[event.key]
    if (!direction || !stageRef.current) return
    event.preventDefault(); stopRolling()
    const desk = stageRef.current.getBoundingClientRect(), pen = event.currentTarget.getBoundingClientRect()
    const step = event.shiftKey ? 30 : 12
    x.set(Math.max(x.get() + desk.left - pen.left, Math.min(x.get() + desk.right - pen.right, x.get() + direction[0] * step)))
    y.set(Math.max(y.get() + desk.top - pen.top, Math.min(y.get() + desk.bottom - pen.bottom, y.get() + direction[1] * step)))
  }
  const flatPen = <svg viewBox="354 49 431 1437" aria-hidden="true"><image href={assets.pen} width="1024" height="1536" /></svg>
  return <>
    <Motion.button ref={penRef} className="desk-pen" type="button" style={{ x, y, rotate }} drag dragConstraints={stageRef} dragMomentum={false} dragElastic={0} onDragStart={stopRolling} onDragEnd={release} whileDrag={{ zIndex: 9 }} onKeyDown={moveWithKeys} aria-label="펜 · 끌어서 이동" aria-describedby={instructions} title="잡아서 옮기거나 가볍게 던져보세요">
      <span className="desk-pen-art">{idle ? <Suspense fallback={flatPen}><Pen3D roll={roll} turn={rotate} /></Suspense> : flatPen}</span>
    </Motion.button>
    <span className="sr-only" id={instructions}>펜을 잡아끌고 놓으면 살짝 회전하며 미끄러지다 멈춥니다. 키보드 방향키로도 옮길 수 있습니다. 배치 초기화를 누르면 제자리로 돌아갑니다.</span>
  </>
}
