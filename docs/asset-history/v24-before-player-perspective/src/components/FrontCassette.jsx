import { useId } from 'react'
import { assets } from '../assets'
import { frontGeometry as geometry } from '../assets/cassette/front-geometry'
import { reelRadii } from '../lib/tape-mechanism'

function FrontReel({ name, radius, angle, prefix }) {
  const [x, y] = geometry.reelCenters[name]
  return <g transform={`translate(${x} ${y})`} data-part={`reel-${name}`}>
    <circle r={radius} fill={`url(#${prefix}-pack)`} />
    {Array.from({ length: Math.max(0, Math.floor((radius - 91) / 1.4)) }, (_, i) => <circle key={i} r={91 + i * 1.4} fill="none" stroke={i % 3 === 0 ? '#363637' : '#080809'} strokeWidth=".5" opacity=".35" />)}
    <circle r="89" fill="#b2b7bc" />
    <circle r="86" fill={`url(#${prefix}-rim)`} stroke="#f4f5f5" strokeWidth="3" />
    <circle r="74" fill="#e3e6e8" stroke="#c3c9ce" strokeWidth="3" />
    <circle r="60" fill={`url(#${prefix}-hole)`} />
    <g transform={`rotate(${angle})`} data-part="hub" data-angle={angle}>
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x="-8" y="-64" width="16" height="16" rx="2" transform={`rotate(${i * 45})`} fill="#f0f1f2" stroke="#cdd2d6" strokeWidth="1" />)}
      <circle r="67" fill="none" stroke="#fafafa" strokeWidth="2" />
    </g>
    <circle r="31" fill="#262a30" stroke="#1c2026" strokeWidth="3" />
    <circle r="22" fill={`url(#${prefix}-spindle)`} />
  </g>
}

export default function FrontCassette({ track, angles = { left: 0, right: 0 }, progress = track.winding ?? .28 }) {
  const prefix = useId().replaceAll(':', '')
  const radii = reelRadii(progress)
  const window = geometry.window
  return <svg className="cassette-art cassette-front" viewBox={geometry.viewBox} role="img" aria-label={`${track.number} ${track.title} 정면 카세트`}>
    <defs>
      <clipPath id={`${prefix}-shell`}><path d={geometry.shell} /></clipPath>
      <clipPath id={`${prefix}-window`}><rect x={window.x} y={window.y} width={window.width} height={window.height} rx={window.radius} /></clipPath>
      <radialGradient id={`${prefix}-pack`}><stop stopColor="#242425" /><stop offset=".6" stopColor="#202021" /><stop offset="1" stopColor="#09090a" /></radialGradient>
      <radialGradient id={`${prefix}-rim`}><stop offset=".6" stopColor="#f8f9f9" /><stop offset=".86" stopColor="#eef0f2" /><stop offset="1" stopColor="#bec7ce" /></radialGradient>
      <radialGradient id={`${prefix}-hole`}><stop stopColor="#484d52" /><stop offset="1" stopColor="#16191e" /></radialGradient>
      <linearGradient id={`${prefix}-spindle`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#7a818a" /><stop offset="1" stopColor="#30353b" /></linearGradient>
    </defs>
    <image href={assets.cassette.front} width={geometry.width} height={geometry.height} clipPath={`url(#${prefix}-shell)`} style={{ filter: `hue-rotate(${track.tint}deg) saturate(.48) brightness(1.02)` }} data-part="shell" />
    <g clipPath={`url(#${prefix}-window)`}>
      <FrontReel name="left" radius={radii.left} angle={angles.left} prefix={prefix} />
      <FrontReel name="right" radius={radii.right} angle={angles.right} prefix={prefix} />
    </g>
    <text x="768" y="276" textAnchor="middle" fill="#244576" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="58" letterSpacing="1">{track.number}. {track.title}</text>
    <text x="285" y="687" fill="#345172" fontFamily="Arial,sans-serif" fontSize="43">{track.subtitle}</text>
    <image href={assets.cassette.stickers[track.sticker || track.id] || assets.cassette.stickers.next} x="1180" y="624" width="90" height="90" />
  </svg>
}
