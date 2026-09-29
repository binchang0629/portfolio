import { useId } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { assets } from '../assets'
import { coherentPlayer as geometry } from '../assets/player/coherent-geometry'
import MechanicalKeys from './MechanicalKeys'
import PlayerDoor from './PlayerDoor'
import CassetteSurface from './CassetteSurface'
import { topviewCassette } from '../assets/cassette/topview-geometry'

export default function IntegratedPlayer({ track, angles, progress, travel, transport, tapePhase = 'idle', onTapeMotionComplete }) {
  const prefix = useId().replaceAll(':', '')
  const reducedMotion = useReducedMotion()
  const loaded = Boolean(track) && tapePhase !== 'empty'
  const changing = tapePhase === 'ejecting' || tapePhase === 'inserting'
  // Keep the motion carrier mounted even in an empty player. This lets first insertion
  // animate from the lower starting position inside the desk presence boundary.
  const tapeLayer = <Motion.g key="tape" data-part={loaded ? "inserted-cassette" : undefined} data-tape-id={loaded ? track.id : undefined} data-part-motion={changing ? 'lifted-tape' : undefined}
    clipPath={changing ? undefined : `url(#${prefix}-body)`}
    initial={false}
    animate={tapePhase === 'empty' ? { y: 280, scale: 1.065, opacity: 0 } : tapePhase === 'ejecting' ? { y: 280, scale: 1.065, opacity: [1, 1, 0] } : tapePhase === 'inserting' ? { y: 0, scale: 1, opacity: [0, 1, 1] } : { y: 0, scale: 1, opacity: 1 }}
    style={{ transformOrigin: `${geometry.door.glass.x + geometry.door.glass.width / 2}px ${geometry.door.glass.y + geometry.door.glass.height / 2}px` }}
    onAnimationComplete={changing ? () => onTapeMotionComplete?.(tapePhase) : undefined}
    transition={{ duration: reducedMotion || tapePhase === 'empty' ? 0 : tapePhase === 'ejecting' ? .23 : .28, ease: [.4, 0, .2, 1], opacity: { duration: reducedMotion || tapePhase === 'empty' ? 0 : tapePhase === 'ejecting' ? .23 : .28, times: tapePhase === 'ejecting' ? [0, .75, 1] : [0, .25, 1], ease: 'linear' } }}>
    {loaded && <g transform={`translate(${topviewCassette.insertion.x} ${topviewCassette.insertion.y}) scale(${topviewCassette.insertion.scale})`}>
      <CassetteSurface key={track?.id} track={track} angles={angles} progress={progress} travel={travel} />
    </g>}
  </Motion.g>
  const shellLayer = <image key="housing" href={assets.player.empty} width={geometry.width} height={geometry.height} clipPath={`url(#${prefix}-body)`} mask={`url(#${prefix}-body-without-lid)`} />
  const doorLayer = <PlayerDoor key="door" phase={tapePhase} reducedMotion={reducedMotion} onComplete={onTapeMotionComplete} />
  return <svg className="player-shell integrated-player" viewBox={geometry.viewBox} role="img" aria-label={loaded ? `${track.title} 테이프가 들어간 흰색 카세트 플레이어` : '흰색 휴대용 카세트 플레이어'} data-camera="player-v1" style={{ overflow: changing ? 'visible' : undefined }}>
    <defs>
      <mask id={`${prefix}-body-without-lid`} maskUnits="userSpaceOnUse" x="0" y="0" width={geometry.width} height={geometry.height}>
        <rect width={geometry.width} height={geometry.height} fill="white" />
        <path d={geometry.door.outline} fill="black" />
        <rect {...geometry.door.latch} fill="black" />
      </mask>
      <linearGradient id={`${prefix}-bay`} x2=".1" y2="1"><stop stopColor="#62686a"/><stop offset=".18" stopColor="#8b8e8b"/><stop offset=".85" stopColor="#9b9d98"/><stop offset="1" stopColor="#717774"/></linearGradient>
      <clipPath id={`${prefix}-bay-photo`}><rect {...geometry.door.glass} /></clipPath>
      <clipPath id={`${prefix}-body`}><path d={geometry.body} /></clipPath>
      <clipPath id={`${prefix}-cassette`}><path d={geometry.cassette} /></clipPath>
      <filter id={`${prefix}-tray-blend`}><feGaussianBlur stdDeviation="6" /></filter>
      <mask id={`${prefix}-spindle-tray`} maskUnits="userSpaceOnUse" x="290" y="370" width="760" height="310">
        <rect x="310" y="390" width="720" height="270" rx="16" fill="white" filter={`url(#${prefix}-tray-blend)`} />
      </mask>
    </defs>
    {/* The photographed lid rim is cut out of the body and rendered only on its hinge. */}
    <path d={geometry.door.outline} fill={`url(#${prefix}-bay)`} />
    <rect {...geometry.door.latch} fill="#737b77" stroke="#b2b7af" strokeWidth="3" /><path d="M665 814H729" stroke="#e0e1d9" strokeWidth="5" strokeLinecap="round" />
    <image href={assets.player.empty} width={geometry.width} height={geometry.height} clipPath={`url(#${prefix}-bay-photo)`} />
    {/* The neutral tray replaces the old blue tape even when a different tape is loaded. */}
    <g mask={`url(#${prefix}-spindle-tray)`} data-part="empty-spindles" data-shaft-transform={geometry.spindleTrayTransform}>
      <g transform={geometry.spindleTrayTransform}><image href={assets.player.empty} width={geometry.width} height={geometry.height} /></g>
    </g>
    {changing ? [shellLayer, doorLayer, tapeLayer] : [tapeLayer, shellLayer, doorLayer]}
    <MechanicalKeys transport={transport} />
  </svg>
}
