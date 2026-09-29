import { useEffect, useRef, useState } from 'react'

// Advance only after a physical movement finishes, even when rendering takes longer.
export default function useReaderTapeSwap({ track, mechanism, reducedMotion, onChange, onBusyChange }) {
  const [swap, setSwap] = useState({ phase: 'idle', mechanism: null })
  const active = useRef(false)
  const phase = useRef('idle')
  const pending = useRef(null)
  const timers = useRef([])
  useEffect(() => () => {
    timers.current.forEach(clearTimeout)
    active.current = false
    pending.current = null
    onBusyChange(false)
  }, [onBusyChange])
  const cancel = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    active.current = false
    pending.current = null
    phase.current = 'idle'
    onBusyChange(false)
  }
  const advance = (nextPhase, snapshot = null) => {
    phase.current = nextPhase
    setSwap({ phase: nextPhase, mechanism: snapshot })
  }
  const delay = (callback, milliseconds) => timers.current.push(setTimeout(() => {
    if (active.current) callback()
  }, milliseconds))
  const finishStage = completed => {
    if (!active.current || phase.current !== completed) return
    if (completed === 'opening') advance('ejecting', pending.current.mechanism)
    else if (completed === 'ejecting') {
      const next = pending.current.track
      advance('empty')
      onChange(next)
      delay(() => advance('inserting'), 80)
    } else if (completed === 'inserting') advance('closing')
    else if (completed === 'closing') {
      advance('latching')
      delay(() => {
        advance('idle')
        active.current = false
        onBusyChange(false)
        pending.current = null
        timers.current = []
      }, 70)
    }
  }
  const changeTrack = next => {
    if (!next || next.id === track.id || active.current) return
    if (reducedMotion) { onChange(next); return }
    active.current = true
    onBusyChange(true)
    pending.current = { track: next, mechanism }
    advance('unlocking', mechanism)
    delay(() => advance('opening', mechanism), 80)
  }
  return { phase: swap.phase, busy: swap.phase !== 'idle', mechanism: swap.mechanism || mechanism, changeTrack, cancel, finishStage }
}
