import { useEffect, useId, useLayoutEffect, useRef } from 'react'
import { animate, motion as Motion, useMotionValue, useTransform } from 'framer-motion'
import { assets } from '../assets'
import PlayerHousingArtwork from './PlayerHousingArtwork'
import { coherentPlayer as geometry } from '../assets/player/coherent-geometry'

const openPhases = ['opening', 'ejecting', 'empty', 'inserting']

export default function PlayerDoor({ phase, reducedMotion, onComplete }) {
  const prefix = useId().replaceAll(':', '')
  const angle = useMotionValue(0)
  const lid = useRef(null)
  const complete = useRef(onComplete)
  useLayoutEffect(() => { complete.current = onComplete }, [onComplete])
  const open = openPhases.includes(phase)
  const { hinge, outline, glass, latch } = geometry.door
  // Orthographic projection of a real horizontal hinge: the top edge never moves.
  const projection = useTransform(angle, value => `translate(${hinge.x} ${hinge.y}) scale(1 ${Math.cos(value * Math.PI / 180)}) translate(${-hinge.x} ${-hinge.y})`)
  useLayoutEffect(() => {
    const update = value => lid.current?.setAttribute('transform', value)
    update(projection.get())
    return projection.on('change', update)
  }, [projection])
  const shade = useTransform(angle, value => Math.sin(value * Math.PI / 180) * .2)
  useEffect(() => {
    const control = animate(angle, open ? 74 : 0, { duration: reducedMotion ? 0 : .22, ease: [.4, 0, .2, 1] })
    control.then(() => complete.current?.(open ? 'opening' : 'closing'))
    return () => control.stop()
  }, [angle, open, reducedMotion])

  return <g data-part="player-door" data-open={open} data-phase={phase} pointerEvents="none">
    <defs>
      <mask id={`${prefix}-rim`} maskUnits="userSpaceOnUse" x="190" y="250" width="990" height="610">
        <path d={outline} fill="white" /><rect {...glass} fill="black" /><rect {...latch} fill="black" />
      </mask>
      <clipPath id={`${prefix}-latch`}><rect {...latch} /></clipPath>
      <linearGradient id={`${prefix}-glass`} x2=".2" y2="1"><stop stopColor="#eaf4ff" stopOpacity=".035"/><stop offset=".5" stopColor="#ffffff" stopOpacity=".015"/><stop offset="1" stopColor="#a8b4bf" stopOpacity=".045"/></linearGradient>
      <filter id={`${prefix}-shadow`} x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="12" /></filter>
    </defs>
    <g ref={lid} data-part="hinged-lid">
      <g transform="translate(0 18)"><Motion.path d={outline} fill="#1d2c3b" style={{ opacity: shade }} filter={`url(#${prefix}-shadow)`} /></g>
      <rect {...glass} fill={`url(#${prefix}-glass)`} stroke="#eff6fb" strokeOpacity=".15" strokeWidth="2" />
      <PlayerHousingArtwork mask={`url(#${prefix}-rim)`} />
      <Motion.g animate={{ y: phase === 'unlocking' ? 6 : 0 }} transition={{ duration: reducedMotion ? 0 : .07 }} data-part="door-latch">
        <image href={assets.player.empty} width={geometry.width} height={geometry.height} clipPath={`url(#${prefix}-latch)`} />
      </Motion.g>
      <Motion.path d="M221 826H1144" fill="none" stroke="#eef5fa" strokeWidth="5" style={{ opacity: shade }} />
    </g>
  </g>
}
