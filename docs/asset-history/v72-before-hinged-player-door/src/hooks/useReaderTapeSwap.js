import { useEffect, useRef, useState } from 'react'

// One short mechanical sequence is shared by keys, case clicks, and drops.
// Committing the track in the empty phase returns the old tape to its numbered case.
export default function useReaderTapeSwap({ track, mechanism, reducedMotion, onChange }) {
  const [swap, setSwap] = useState({ phase: 'idle', mechanism: null })
  const active = useRef(false)
  const timers = useRef([])
  useEffect(() => () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    active.current = false
  }, [])

  const cancel = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    active.current = false
  }

  const changeTrack = next => {
    if (!next || next.id === track.id || active.current) return
    if (reducedMotion) { onChange(next); return }
    active.current = true
    setSwap({ phase: 'ejecting', mechanism })
    timers.current = [
      setTimeout(() => {
        setSwap({ phase: 'empty', mechanism: null })
        onChange(next)
      }, 260),
      setTimeout(() => setSwap({ phase: 'inserting', mechanism: null }), 340),
      setTimeout(() => {
        setSwap({ phase: 'idle', mechanism: null })
        active.current = false
        timers.current = []
      }, 660),
    ]
  }
  return { phase: swap.phase, busy: swap.phase !== 'idle', mechanism: swap.mechanism || mechanism, changeTrack, cancel }
}
