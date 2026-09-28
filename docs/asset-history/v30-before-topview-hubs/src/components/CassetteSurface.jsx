import { useId } from 'react'
import { assets } from '../assets'
import { topviewCassette as geometry } from '../assets/cassette/topview-geometry'
import { reelRadii } from '../lib/tape-mechanism'

function PhotographicReel({ reel, radius, angle, prefix }) {
  const scale = radius / geometry.texturePackRadius
  return <g transform={`translate(${reel.x} ${reel.y})`} data-part={`reel-${reel.name}`}>
    <defs><clipPath id={`${prefix}-${reel.name}-pack`}><circle r={radius} /></clipPath><clipPath id={`${prefix}-${reel.name}-hub`}><circle r={geometry.hubRadius} /></clipPath></defs>
    <circle r={radius} fill={`url(#${prefix}-pack)`} data-part="pack-surface" />
    {Array.from({ length: Math.max(0, Math.floor((radius - geometry.hubRadius) / 1.3)) }, (_, i) => <circle key={i} r={geometry.hubRadius + i * 1.3} fill="none" stroke={i % 3 === 0 ? '#393939' : '#101011'} strokeWidth=".6" opacity=".25" />)}
    <g clipPath={`url(#${prefix}-${reel.name}-pack)`}>
      <g transform={`scale(${scale})`} mask={`url(#${prefix}-pack-texture)`}>
        <image href={assets.cassette.render} x="-469" y="-441" width={geometry.width} height={geometry.height} />
      </g>
    </g>
    <g clipPath={`url(#${prefix}-${reel.name}-hub)`}>
      <g transform={`rotate(${angle})`} data-part="hub" data-angle={angle}>
        <image href={assets.cassette.render} x={-reel.x} y={-reel.y} width={geometry.width} height={geometry.height} />
      </g>
    </g>
  </g>
}

// Identical orthographic artwork is shared by the desk and the compartment.
export default function CassetteSurface({ track, angles = { left: 0, right: 0 }, progress = track.winding ?? .28 }) {
  const prefix = useId().replaceAll(':', '')
  const radii = reelRadii(progress)
  const tint = { filter: `hue-rotate(${track.tint}deg) saturate(.6)` }
  return <g data-camera="orthographic-topview-v1" data-part="cassette-surface">
    <defs>
      <clipPath id={`${prefix}-body`}><path d={geometry.outline} /></clipPath>
      <clipPath id={`${prefix}-window`}><rect {...geometry.window} /></clipPath>
      <clipPath id={`${prefix}-paper`}>{geometry.paper.map((rect,i) => <rect key={i} {...rect} rx="7" />)}</clipPath>
      <radialGradient id={`${prefix}-pack`}><stop stopColor="#282829" /><stop offset=".7" stopColor="#222223" /><stop offset="1" stopColor="#111112" /></radialGradient>
      <linearGradient id={`${prefix}-texture-fade`} x1="0" y1="-123" x2="0" y2="123" gradientUnits="userSpaceOnUse"><stop stopColor="black" /><stop offset=".12" stopColor="white" /><stop offset=".88" stopColor="white" /><stop offset="1" stopColor="black" /></linearGradient>
      <mask id={`${prefix}-pack-texture`} x="-237" y="-123" width="474" height="246" maskUnits="userSpaceOnUse">
        <rect x="-237" y="-123" width="474" height="246" fill={`url(#${prefix}-texture-fade)`} />
        {/* The source hub and its crescent shadow must never be scaled into the winding. */}
        <circle r="128" fill="black" />
      </mask>
    </defs>
    <g clipPath={`url(#${prefix}-body)`}>
      <image href={assets.cassette.clean} width={geometry.width} height={geometry.height} style={tint} data-part="shell" />
      <image href={assets.cassette.clean} width={geometry.width} height={geometry.height} clipPath={`url(#${prefix}-paper)`} data-part="labels" />
      <g clipPath={`url(#${prefix}-window)`}>
        <PhotographicReel reel={geometry.reels[0]} radius={radii.left * 236 / 185} angle={angles.left} prefix={prefix} />
        <PhotographicReel reel={geometry.reels[1]} radius={radii.right * 236 / 185} angle={angles.right} prefix={prefix} />
      </g>
      <text x="768" y="225" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="71" fontWeight="700" fill="#345477">{track.number}. {track.title}</text>
      <text x="210" y="660" fontFamily="Arial,sans-serif" fontSize="47" fill="#425d78">{track.subtitle}</text>
      <image href={assets.cassette.stickers[track.sticker || track.id] || assets.cassette.stickers.next} x="1247" y="608" width="63" height="63" />
    </g>
  </g>
}
