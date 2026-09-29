import { useId } from 'react'
import { assets } from '../assets'
import { coherentPlayer as geometry } from '../assets/player/coherent-geometry'

// Mirror the complete right jamb, including BOTH rounded corners and lower lip.
// Include the narrow white gutter to erase the old rail outside the mirrored edge.
// The mounting screw sits outside that footprint instead of cutting a notch in the lid.
export default function PlayerHousingArtwork(props) {
  const id = useId().replaceAll(':', '')
  return <g {...props}>
    <defs>
      <mask id={`${id}-left-frame`} maskUnits="userSpaceOnUse" x="138" y="236" width="182" height="616">
        <path d="M166 244H312V840H165Q145 840 145 820V264Q145 244 166 244Z" fill="white" filter={`url(#${id}-feather)`} />
      </mask>
      <filter id={`${id}-feather`}><feGaussianBlur stdDeviation="3" /></filter>
      <mask id={`${id}-old-screw`} maskUnits="userSpaceOnUse" x="114" y="780" width="104" height="104">
        <circle cx="166" cy="832" r="44" fill="white" filter={`url(#${id}-feather)`} />
      </mask>
      <clipPath id={`${id}-screw`}><circle cx="166" cy="832" r="37" /></clipPath>
    </defs>
    <image href={assets.player.empty} width={geometry.width} height={geometry.height} />
    <g mask={`url(#${id}-old-screw)`}>
      <image href={assets.player.empty} width={geometry.width} height={geometry.height} transform="translate(-234 638)" style={{ filter: 'brightness(.975)' }} />
    </g>
    <g mask={`url(#${id}-left-frame)`}>
      <image href={assets.player.empty} width={geometry.width} height={geometry.height} transform="translate(1367 0) scale(-1 1)" />
    </g>
    <g transform="translate(-25 0)" data-part="left-mounting-screw">
      <g clipPath={`url(#${id}-screw)`}><image href={assets.player.empty} width={geometry.width} height={geometry.height} /></g>
    </g>
  </g>
}
