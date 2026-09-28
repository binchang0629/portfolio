import { useId } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { assets } from '../assets'
import { coherentPlayer as geometry } from '../assets/player/coherent-geometry'
import MechanicalKeys from './MechanicalKeys'
import CassetteSurface from './CassetteSurface'
import { topviewCassette } from '../assets/cassette/topview-geometry'

export default function IntegratedPlayer({ track, angles, progress, travel, transport }) {
  const prefix = useId().replaceAll(':', '')
  const reducedMotion = useReducedMotion()
  const loaded = Boolean(track)
  return <svg className="player-shell integrated-player" viewBox={geometry.viewBox} role="img" aria-label={loaded ? `${track.title} 테이프가 들어간 흰색 카세트 플레이어` : '흰색 휴대용 카세트 플레이어'} data-camera="player-v1">
    <defs>
      <clipPath id={`${prefix}-body`}><path d={geometry.body} /></clipPath>
      <clipPath id={`${prefix}-cassette`}><path d={geometry.cassette} /></clipPath>
      <filter id={`${prefix}-tray-blend`}><feGaussianBlur stdDeviation="6" /></filter>
      <mask id={`${prefix}-spindle-tray`} maskUnits="userSpaceOnUse" x="290" y="370" width="760" height="310">
        <rect x="310" y="390" width="720" height="270" rx="16" fill="white" filter={`url(#${prefix}-tray-blend)`} />
      </mask>
    </defs>
    <image href={assets.player.empty} width={geometry.width} height={geometry.height} clipPath={`url(#${prefix}-body)`} />
    {/* The neutral tray replaces the old blue tape even when a different tape is loaded. */}
    {!loaded && <g mask={`url(#${prefix}-spindle-tray)`} data-part="empty-spindles" data-offset-x={geometry.spindleOffsetX}>
      <image href={assets.player.empty} x={geometry.spindleOffsetX} width={geometry.width} height={geometry.height} />
    </g>}
    {loaded && <Motion.g key={track.id} initial={reducedMotion ? false : { opacity: .4 }} animate={{ opacity: 1 }} transition={{ duration: .18 }} clipPath={`url(#${prefix}-cassette)`} data-part="inserted-cassette"><g transform={`translate(${topviewCassette.insertion.x} ${topviewCassette.insertion.y}) scale(${topviewCassette.insertion.scale})`}><CassetteSurface track={track} angles={angles} progress={progress} travel={travel} /></g></Motion.g>}
    <MechanicalKeys transport={transport} />
  </svg>
}
