import { useEffect } from 'react'

const STRENGTH = .12
const MAX_PULL = 14
// How far outside a tape (as a share of its size) the pull starts.
const REACH = .3

// Desk tapes lean toward a nearby pointer, only part of the way, so they read as things to pick up.
export default function useMagneticTapes(stageRef, enabled) {
  useEffect(() => {
    const stage = stageRef.current
    if (!enabled || !stage || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let frame = 0, pointer = null, held = null
    const set = (tape, x, y) => { tape.style.setProperty('--mx', `${x.toFixed(1)}px`); tape.style.setProperty('--my', `${y.toFixed(1)}px`) }
    const update = () => {
      frame = 0
      for (const tape of stage.querySelectorAll('.tape')) {
        const box = tape.getBoundingClientRect()
        const cx = box.left + box.width / 2, cy = box.top + box.height / 2
        if (!pointer || tape === held) { set(tape, 0, 0); continue }
        const dx = pointer.x - cx, dy = pointer.y - cy
        // 0 inside the tape, 1 at the edge of the reach; the pull fades out over that band so it never snaps.
        const outside = Math.max(Math.abs(dx) / (box.width / 2), Math.abs(dy) / (box.height / 2)) - 1
        const falloff = 1 - Math.max(0, Math.min(1, outside / (REACH * 2)))
        const clamp = v => Math.max(-MAX_PULL, Math.min(MAX_PULL, v * STRENGTH * falloff))
        set(tape, clamp(dx), clamp(dy))
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const move = event => { pointer = { x: event.clientX, y: event.clientY }; schedule() }
    const leave = () => { pointer = null; schedule() }
    // A tape in the hand follows the drag instead; release lets it settle again.
    const down = event => { held = event.target.closest?.('.tape') ?? null; schedule() }
    const up = () => { held = null; schedule() }
    stage.addEventListener('pointermove', move)
    stage.addEventListener('pointerleave', leave)
    stage.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      cancelAnimationFrame(frame)
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerleave', leave)
      stage.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      for (const tape of stage.querySelectorAll('.tape')) set(tape, 0, 0)
    }
  }, [stageRef, enabled])
}
