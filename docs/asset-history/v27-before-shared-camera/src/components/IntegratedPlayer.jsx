import { useId } from 'react'
import { assets } from '../assets'
import { coherentPlayer as geometry } from '../assets/player/coherent-geometry'
import { reelRadii } from '../lib/tape-mechanism'

function PhotographicReel({ reel, radius, angle, prefix }) {
  const scale = radius / geometry.texturePackRadius
  // Surface detail and the hub are sampled from the same player render.
  // The unlit dark winding surface extends beneath the paper's occlusion mask.
  return <g transform={`translate(${reel.x} ${reel.y})`} data-part={`reel-${reel.name}`}>
    <defs><clipPath id={`${prefix}-${reel.name}-pack`}><circle r={radius} /></clipPath><clipPath id={`${prefix}-${reel.name}-hub`}><circle r={geometry.hubRadius} /></clipPath></defs>
    <circle r={radius} fill={`url(#${prefix}-pack)`} data-part="pack-surface" />
    {Array.from({ length: Math.floor((radius - 70) / 1.2) }, (_, i) => <circle key={i} r={70 + i * 1.2} fill="none" stroke={i % 3 === 0 ? '#4a4a4c' : '#161618'} strokeWidth=".5" opacity=".22" />)}
    <g clipPath={`url(#${prefix}-${reel.name}-pack)`}>
      <g transform={`scale(${scale})`} mask={`url(#${prefix}-texture-band)`}>
        <image href={assets.player.render} x="-513" y="-520" width={geometry.width} height={geometry.height} />
      </g>
    </g>
    <g clipPath={`url(#${prefix}-${reel.name}-hub)`}>
      <g transform={`rotate(${angle})`} data-part="hub" data-angle={angle}>
        <image href={assets.player.render} x={-reel.x} y={-reel.y} width={geometry.width} height={geometry.height} />
      </g>
    </g>
  </g>
}

export default function IntegratedPlayer({ track, angles, progress }) {
  const prefix = useId().replaceAll(':', '')
  const radii = reelRadii(progress ?? .28)
  const loaded = Boolean(track)
  const tint = { filter: `hue-rotate(${track?.tint ?? 0}deg) saturate(.7)` }
  return <svg className="player-shell integrated-player" viewBox={geometry.viewBox} role="img" aria-label={loaded ? `${track.title} 테이프가 들어간 흰색 카세트 플레이어` : '흰색 휴대용 카세트 플레이어'}>
    <defs>
      <clipPath id={`${prefix}-body`}><path d={geometry.body} /></clipPath>
      <clipPath id={`${prefix}-cassette`}><path d={geometry.cassette} /></clipPath>
      <clipPath id={`${prefix}-empty`}><path d={geometry.emptyBay} /></clipPath>
      <clipPath id={`${prefix}-window`}><rect x={geometry.window.x} y={geometry.window.y} width={geometry.window.width} height={geometry.window.height} /></clipPath>
      <radialGradient id={`${prefix}-pack`}><stop stopColor="#414144" /><stop offset=".58" stopColor="#333335" /><stop offset=".9" stopColor="#2d2d2f" /><stop offset="1" stopColor="#202123" /></radialGradient>
      <linearGradient id={`${prefix}-texture-fade`} x1="0" y1="-70" x2="0" y2="70" gradientUnits="userSpaceOnUse"><stop stopColor="black" /><stop offset=".17" stopColor="white" /><stop offset=".83" stopColor="white" /><stop offset="1" stopColor="black" /></linearGradient>
      <mask id={`${prefix}-texture-band`} x="-154" y="-70" width="308" height="140" maskUnits="userSpaceOnUse"><rect x="-154" y="-70" width="308" height="140" fill={`url(#${prefix}-texture-fade)`} /></mask>
    </defs>
    <image href={assets.player.render} width={geometry.width} height={geometry.height} clipPath={`url(#${prefix}-body)`} />
    {!loaded && <image href={assets.player.empty} width={geometry.width} height={geometry.height} clipPath={`url(#${prefix}-empty)`} />}
    {loaded && <>
      <image href={assets.player.render} width={geometry.width} height={geometry.height} clipPath={`url(#${prefix}-cassette)`} style={tint} />
      <image href={assets.player.clean} width={geometry.width} height={geometry.height} clipPath={`url(#${prefix}-window)`} style={tint} />
      <g clipPath={`url(#${prefix}-window)`} data-part="inserted-cassette">
        <PhotographicReel reel={geometry.reels[0]} radius={radii.left * 153 / 185} angle={angles.left} prefix={prefix} />
        <PhotographicReel reel={geometry.reels[1]} radius={radii.right * 153 / 185} angle={angles.right} prefix={prefix} />
        <rect x="313" y="427" width="773" height="166" fill="#d9e3f0" opacity=".035" pointerEvents="none" />
      </g>
      <text x="700" y="389" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="46" fontWeight="700" fill="#345477">{track.number}. {track.title}</text>
      <text x="346" y="647" fontFamily="Arial,sans-serif" fontSize="29" fill="#425d78">{track.subtitle}</text>
      <image href={assets.cassette.stickers[track.sticker || track.id] || assets.cassette.stickers.next} x="1008" y="612" width="43" height="43" />
    </>}
  </svg>
}
