import { useId } from 'react'
import { assets } from '../assets'
import { playerGeometry } from '../assets/player/geometry'
import { aperturePath } from '../assets/player/cassette-plane'

export default function PlayerWindowFrame() {
  const id = useId().replaceAll(':', '')
  const outer = 'M600 405H884Q895 405 895 419L895 550Q895 560 883 560H597Q589 560 590 547L594 419Q594 405 600 405Z'
  return <svg className="player-window-frame" viewBox={playerGeometry.viewBox} aria-hidden="true">
    <defs><clipPath id={id}><path d={outer + aperturePath} clipRule="evenodd" /></clipPath></defs>
    <image href={assets.player.material} width={1536} height={1024} clipPath={`url(#${id})`} />
    <path d={aperturePath} fill="none" stroke="#334254" strokeOpacity=".25" strokeWidth="1.2" />
    <path d="M604 415H881" fill="none" stroke="#fafcff" strokeOpacity=".38" strokeWidth="1.1" />
  </svg>
}
