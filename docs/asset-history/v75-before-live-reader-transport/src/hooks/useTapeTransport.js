import { useEffect, useRef, useState } from 'react'
import { advanceMechanism, initialMechanism, seekMechanism } from '../lib/tape-mechanism'

export default function useTapeTransport(reducedMotion, reading = false) {
  const [transport, setTransport] = useState('stopped')
  const [mechanism, setMechanism] = useState(() => initialMechanism())
  const current = useRef(mechanism)

  const resetMechanism = progress => {
    current.current = initialMechanism(progress)
    setMechanism(current.current)
    setTransport('stopped')
  }

  useEffect(() => {
    if (transport === 'stopped' || reading) return
    let frame, last = null
    const tick = time => {
      // Repeated timestamps are a skipped frame, not the end of the tape.
      if (last !== null && time > last) {
        const previous = current.current
        const next = advanceMechanism(previous, time - last, transport, reducedMotion)
        if (next === previous) { setTransport('stopped'); return }
        current.current = next
        setMechanism(next)
      }
      last = time
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [transport, reducedMotion, reading])

  const seek = progress => {
    const next = seekMechanism(current.current, progress, reducedMotion)
    if (next === current.current) return
    current.current = next
    setMechanism(next)
  }
  return { mechanism, transport, setTransport, resetMechanism, seek }
}
