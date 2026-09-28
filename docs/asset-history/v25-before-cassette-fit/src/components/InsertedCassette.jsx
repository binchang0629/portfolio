import { useLayoutEffect, useRef } from 'react'
import FrontCassette from './FrontCassette'
import { cassetteAperture, cassettePlane, cassettePlaneTransform } from '../assets/player/cassette-plane'

export default function InsertedCassette({ track, angles, progress }) {
  const viewport = useRef(null)
  useLayoutEffect(() => {
    const element = viewport.current
    const align = () => element.style.setProperty('--player-scale', element.getBoundingClientRect().width / cassettePlane.playerWidth)
    align()
    const observer = new ResizeObserver(align)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <div className="player-window" ref={viewport} style={{ clipPath: cassetteAperture }}>
    <div className="cassette-player-space">
      <div className="inserted-tape" style={{ transform: cassettePlaneTransform }}>
        <FrontCassette track={track} angles={angles} progress={progress} fullCanvas />
      </div>
    </div>
    <span className="window-glass" />
  </div>
}
