import { useId } from 'react'
import { assets } from '../assets'
import { coherentPlayer as geometry } from '../assets/player/coherent-geometry'

// Reuse the existing narrow right rail's material on the left, across body and lid.
// The shared aperture determines which part stays fixed and which opens on the hinge.
export default function PlayerHousingArtwork(props) {
  const id = useId().replaceAll(':', '')
  return <g {...props}>
    <defs><clipPath id={`${id}-left-edge`}><path d="M168 249H224V780H310V832H168Z" /></clipPath></defs>
    <image href={assets.player.empty} width={geometry.width} height={geometry.height} />
    <g clipPath={`url(#${id}-left-edge)`}>
      <image href={assets.player.empty} width={geometry.width} height={geometry.height} transform="translate(1367 0) scale(-1 1)" />
    </g>
  </g>
}
