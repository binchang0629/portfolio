import { useEffect, useRef, useState } from 'react'
import { advanceMechanism, initialMechanism } from '../lib/tape-mechanism'

export default function useTapeTransport(reducedMotion) {
  const [transport, setTransport] = useState('stopped')
  const [mechanism, setMechanism] = useState(() => initialMechanism())
  const current = useRef(mechanism)

  const resetMechanism = progress => {
    current.current = initialMechanism(progress)
    setMechanism(current.current)
    setTransport('stopped')
  }

  useEffect(() => {
    if (transport === 'stopped') return
    let frame, last = null
    const tick = time => {
      if (last !== null) {
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
  }, [transport, reducedMotion])

  return { mechanism, transport, setTransport, resetMechanism }
}
