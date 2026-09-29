import { useId } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { assets } from '../assets'
import { coherentPlayer as geometry } from '../assets/player/coherent-geometry'
import MechanicalKeys from './MechanicalKeys'
import CassetteSurface from './CassetteSurface'
import { topviewCassette } from '../assets/cassette/topview-geometry'

export default function IntegratedPlayer({ track, angles, progress, travel, transport, tapePhase = 'idle' }) {
  const prefix = useId().replaceAll(':', '')
  const reducedMotion = useReducedMotion()
  const loaded = Boolean(track) && tapePhase !== 'empty'
  const changing = tapePhase === 'ejecting' || tapePhase === 'inserting'
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
    {(!loaded || changing) && <g mask={`url(#${prefix}-spindle-tray)`} data-part="empty-spindles" data-offset-x={geometry.spindleOffsetX}>
      <image href={assets.player.empty} x={geometry.spindleOffsetX} width={geometry.width} height={geometry.height} />
    </g>}
    {loaded && <g clipPath={`url(#${prefix}-cassette)`}>
      <Motion.g key={track.id} data-part="inserted-cassette" data-tape-id={track.id}
        initial={reducedMotion ? false : tapePhase === 'inserting' ? { y: -520, opacity: .25 } : { y: 0, opacity: .4 }}
        animate={tapePhase === 'ejecting' ? { y: -520, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : changing ? tapePhase === 'ejecting' ? .26 : .32 : .18, ease: [.22, 1, .36, 1] }}>
        <g transform={`translate(${topviewCassette.insertion.x} ${topviewCassette.insertion.y}) scale(${topviewCassette.insertion.scale})`}>
          <CassetteSurface track={track} angles={angles} progress={progress} travel={travel} />
        </g>
      </Motion.g>
    </g>}
    <MechanicalKeys transport={transport} />
  </svg>
}
