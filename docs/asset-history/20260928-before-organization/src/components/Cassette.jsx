import { useId } from 'react'
import geometry from '../data/cassette-geometry.json'

const source = '/assets/cassette/'

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
          <image href={`${source}reel-corrected-black.png`} width="1536" height="1024" transform={`matrix(${reel.inverse.join(' ')})`} />
        </g>
      </g>
    </g>
  </g>
}

export default function Cassette({ track, angle = 0, progress = track.winding ?? .28 }) {
  const prefix = useId().replaceAll(':', '')
  // Both packs share the same hub centres. Their combined winding area is constant.
  const minimum = 91 ** 2, capacity = 185 ** 2 - minimum
  const left = Math.sqrt(minimum + capacity * (1 - progress))
  const right = Math.sqrt(minimum + capacity * progress)
  return <svg className="cassette-art" viewBox="170 65 1280 930" role="img" aria-label={`${track.number} ${track.title} 카세트`}>
    <defs>
      <clipPath id={`${prefix}-window`}><path d={geometry.window} /></clipPath>
      <clipPath id={`${prefix}-body`}><path d={geometry.body} clipRule="evenodd" /></clipPath>
      <clipPath id={`${prefix}-paper`}><path d={geometry.top + geometry.lower} /></clipPath>
      <radialGradient id={`${prefix}-pack`}><stop stopColor="#242425" /><stop offset=".6" stopColor="#202021" /><stop offset="1" stopColor="#09090a" /></radialGradient>
      {geometry.reels.map(r => <clipPath key={r.name} id={`${prefix}-${r.name}-hub`}><circle cx={r.r} cy={r.r} r={r.r} /></clipPath>)}
    </defs>
    <image href={`${source}window-clean.png`} width="1536" height="1024" clipPath={`url(#${prefix}-window)`} style={{ filter: `hue-rotate(${track.tint}deg) saturate(.48)` }} />
    <Reel reel={geometry.reels[0]} radius={left} angle={angle} prefix={prefix} />
    <Reel reel={geometry.reels[1]} radius={right} angle={angle * (left / right)} prefix={prefix} />
    <image href={`${source}cassette-original.png`} width="1536" height="1024" clipPath={`url(#${prefix}-body)`} style={{ filter: `hue-rotate(${track.tint}deg) saturate(.48) brightness(1.02)` }} data-part="shell" />
    <image href={`${source}label-cleanup.png`} width="1536" height="1024" clipPath={`url(#${prefix}-paper)`} data-part="labels" />
    <g fill="#244576" transform="translate(470 407) rotate(-14)"><text fontFamily="Arial,sans-serif" fontWeight="700" fontSize="67" letterSpacing="1">{track.number}. {track.title}</text></g>
    <g fill="#345172" transform="translate(470 735) rotate(-14)"><text fontFamily="Arial,sans-serif" fontSize="47">{track.subtitle}</text></g>
    <g transform="translate(1216 519) rotate(-14) scale(1 .91)" fill="none" stroke="#214bb8" strokeWidth="7" data-part="sticker">
      {track.id === 'about' ? <><circle r="43" /><circle cx="-14" cy="-8" r="4" fill="#214bb8" stroke="none" /><circle cx="14" cy="-8" r="4" fill="#214bb8" stroke="none" /><path d="M-18 8Q0 31 18 8" strokeLinecap="round" /></> : track.id === 'team' ? <><circle cx="-17" cy="-16" r="14" /><circle cx="17" cy="-16" r="14" /><path d="M-43 35v-12q0-28 26-28t26 28v12M0 4q35-20 43 19v12H-43" /></> : track.id === 'design' ? <><path d="M0-23v-22M0 23v22M23 0h22M-23 0h-22M17-17l16-16M-17 17l-16 16M17 17l16 16M-17-17l-16-16" /><circle r="17" /></> : track.id === 'branding' ? <><circle r="43" /><ellipse rx="19" ry="43" /><path d="M-43 0h86M-37-20h74M-37 20h74" /></> : <><path d="M-35 35Q0-10 0-42M0 0Q-44 0-39-28Q-4-35 0 0M0-16Q34-18 38-42Q3-44 0-16" strokeLinejoin="round" /></>}
    </g>
  </svg>
}
