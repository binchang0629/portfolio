import { useId } from 'react'
import geometry from '../assets/cassette/geometry.json'
import { assets } from '../assets'
import { reelRadii } from '../lib/tape-mechanism'

function Reel({ reel, radius, angle, prefix }) {
  const [cx, cy] = reel.axis
  const m = reel.matrix
  const packTransform = `translate(${cx} ${cy}) rotate(-14) scale(1 ${reel.k})`
  return <g clipPath={`url(#${prefix}-window)`} data-part={`reel-${reel.name}`}>
    <g transform={packTransform}>
      <g transform={`rotate(${angle})`}>
        <circle r={radius} fill={`url(#${prefix}-pack)`} />
        {Array.from({ length: Math.max(0, Math.floor((radius - reel.r) / 1.4)) }, (_, i) =>
          <circle key={i} r={reel.r + i * 1.4} fill="none" stroke={i % 3 === 0 ? '#3b3b3c' : '#080809'} strokeWidth=".5" opacity=".35" />)}
      </g>
    </g>
    <g transform={`matrix(${m.join(' ')})`}>
      <g clipPath={`url(#${prefix}-${reel.name}-hub)`}>
        <g transform={`rotate(${angle} ${reel.r} ${reel.r})`}>
          <image href={assets.cassette.hubs} width="1536" height="1024" transform={`matrix(${reel.inverse.join(' ')})`} />
        </g>
      </g>
    </g>
  </g>
}

export default function Cassette({ track, angles = { left: 0, right: 0 }, progress = track.winding ?? .28 }) {
  const prefix = useId().replaceAll(':', '')
  const { left, right } = reelRadii(progress)
  return <svg className="cassette-art" viewBox={geometry.viewBox} role="img" aria-label={`${track.number} ${track.title} 카세트`}>
    <defs>
      <clipPath id={`${prefix}-window`}><path d={geometry.window} /></clipPath>
      <clipPath id={`${prefix}-body`}><path d={geometry.body} clipRule="evenodd" /></clipPath>
      <clipPath id={`${prefix}-paper`}><path d={geometry.top + geometry.lower} /></clipPath>
      <radialGradient id={`${prefix}-pack`}><stop stopColor="#242425" /><stop offset=".6" stopColor="#202021" /><stop offset="1" stopColor="#09090a" /></radialGradient>
      {geometry.reels.map(r => <clipPath key={r.name} id={`${prefix}-${r.name}-hub`}><circle cx={r.r} cy={r.r} r={r.r} /></clipPath>)}
    </defs>
    <image href={assets.cassette.window} width="1536" height="1024" clipPath={`url(#${prefix}-window)`} style={{ filter: `hue-rotate(${track.tint}deg) saturate(.48)` }} />
    <Reel reel={geometry.reels[0]} radius={left} angle={angles.left} prefix={prefix} />
    <Reel reel={geometry.reels[1]} radius={right} angle={angles.right} prefix={prefix} />
    <image href={assets.cassette.body} width="1536" height="1024" clipPath={`url(#${prefix}-body)`} style={{ filter: `hue-rotate(${track.tint}deg) saturate(.48) brightness(1.02)` }} data-part="shell" />
    <image href={assets.cassette.labels} width="1536" height="1024" clipPath={`url(#${prefix}-paper)`} data-part="labels" />
    <g fill="#244576" transform="translate(470 407) rotate(-14)"><text fontFamily="Arial,sans-serif" fontWeight="700" fontSize="67" letterSpacing="1">{track.number}. {track.title}</text></g>
    <g fill="#345172" transform="translate(470 735) rotate(-14)"><text fontFamily="Arial,sans-serif" fontSize="47">{track.subtitle}</text></g>
    <g transform="translate(1216 519) rotate(-14) scale(1 .91)" fill="none" stroke="#214bb8" strokeWidth="7" data-part="sticker">
      <image href={assets.cassette.stickers[track.sticker || track.id] || assets.cassette.stickers.next} x="-50" y="-50" width="100" height="100" />
    </g>
  </svg>
}
