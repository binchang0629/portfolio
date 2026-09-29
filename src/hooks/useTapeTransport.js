import { useEffect, useRef, useState } from 'react'
import { advanceMechanism, initialMechanism } from '../lib/tape-mechanism'

export default function useTapeTransport(reducedMotion, suspended = false) {
  const [transport, setTransport] = useState('stopped')
  const [mechanism, setMechanism] = useState(() => initialMechanism())
  const current = useRef(mechanism)
  const currentId = useRef(null)
  const saved = useRef({})
  const [tapePositions, setTapePositions] = useState({})

  const saveMechanism = () => {
    if (!currentId.current) return
    saved.current = { ...saved.current, [currentId.current]: current.current }
    setTapePositions(saved.current)
  }
  const loadMechanism = id => {
    // A cassette keeps its own winding and hub angles when it is taken out.
    if (currentId.current) saved.current = { ...saved.current, [currentId.current]: current.current }
    currentId.current = id
    current.current = saved.current[id] ?? initialMechanism()
    saved.current = { ...saved.current, [id]: current.current }
    setTapePositions(saved.current)
    setMechanism(current.current)
    setTransport('stopped')
  }

  useEffect(() => {
    if (transport === 'stopped' || suspended) return
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
  }, [transport, reducedMotion, suspended])

  return { mechanism, tapePositions, transport, setTransport, loadMechanism, saveMechanism }
}
