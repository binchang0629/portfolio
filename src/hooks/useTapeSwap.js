import { useEffect, useRef, useState } from 'react'

// Each phase waits for the same physical movement in the desk and the reader.
export default function useTapeSwap({ track, mechanism, reducedMotion, onChange, onBusyChange }) {
  const [swap, setSwap] = useState({ phase: 'idle', mechanism: null, incomingId: null })
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
    setSwap({ phase: 'idle', mechanism: null, incomingId: null })
    onBusyChange(false)
  }
  const advance = (nextPhase, snapshot = null) => {
    phase.current = nextPhase
    setSwap({ phase: nextPhase, mechanism: snapshot, incomingId: pending.current?.track?.id ?? null })
  }
  const delay = (callback, milliseconds) => timers.current.push(setTimeout(() => {
    if (active.current) callback()
  }, milliseconds))
  const replace = () => {
    const next = pending.current.track
    advance('empty')
    onChange(next)
    delay(() => advance(next ? 'inserting' : 'closing'), 80)
  }
  const finishStage = completed => {
    if (!active.current || phase.current !== completed) return
    if (completed === 'opening') {
      if (pending.current.hadTape) advance('ejecting', pending.current.mechanism)
      else replace()
    } else if (completed === 'ejecting') replace()
    else if (completed === 'inserting') advance('closing')
    else if (completed === 'closing') {
      advance('latching')
      delay(() => {
        const settled = pending.current.onSettled
        advance('idle')
        active.current = false
        onBusyChange(false)
        pending.current = null
        timers.current = []
        settled?.()
      }, 70)
    }
  }
  const changeTrack = (next, onSettled) => {
    if (next?.id === track?.id || active.current) return
    if (reducedMotion) { onChange(next); onSettled?.(); return }
    active.current = true
    onBusyChange(true)
    pending.current = { track: next, mechanism, hadTape: Boolean(track), onSettled }
    advance('unlocking', mechanism)
    delay(() => advance('opening', mechanism), 80)
  }
  return { phase: swap.phase, busy: swap.phase !== 'idle', incomingId: swap.phase === 'idle' ? null : swap.incomingId, mechanism: swap.mechanism || mechanism, changeTrack, cancel, finishStage }
}
