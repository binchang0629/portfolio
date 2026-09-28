import { useId } from 'react'
import { assets } from '../assets'

export default function ArchiveTray({ tracks }) {
  const prefix = useId().replaceAll(':', '')
  const cells = [155, 388, 626, 863, 1099]
  return <svg className="archive-art" viewBox="87 80 1265 927" preserveAspectRatio="none" aria-hidden="true" data-camera="orthographic-topview-v1">
    <defs>
      <clipPath id={`${prefix}-body`}><rect x="101" y="95" width="1240" height="900" rx="60" /></clipPath>
      <clipPath id={`${prefix}-floor`}><rect x="155" y="161" width="1131" height="766" rx="23" /></clipPath>
      <clipPath id={`${prefix}-rim`}><path d="M161 95H1281Q1341 95 1341 155V935Q1341 995 1281 995H161Q101 995 101 935V155Q101 95 161 95ZM179 161H1262Q1286 161 1286 185V903Q1286 927 1262 927H179Q155 927 155 903V185Q155 161 179 161Z" clipRule="evenodd" /></clipPath>
      <linearGradient id={`${prefix}-left-shadow`}><stop stopColor="#344d69" stopOpacity=".18" /><stop offset=".14" stopColor="#344d69" stopOpacity="0" /></linearGradient>
      <linearGradient id={`${prefix}-top-shadow`} x2="0" y2="1"><stop stopColor="#344d69" stopOpacity=".15" /><stop offset=".18" stopColor="#344d69" stopOpacity="0" /></linearGradient>
    </defs>
    <g data-layer="floor"><image href={assets.archive} width="1440" height="1092" clipPath={`url(#${prefix}-floor)`} /></g>
    <g data-layer="stored-tapes">{tracks.slice(0,5).map((track,i) => <g key={track.id} transform={`translate(${cells[i] + 88} 175)`}>
      <rect width="38" height="724" rx="8" fill="#b6d6f4" style={{ filter: `hue-rotate(${track.tint}deg)` }} />
      <rect x="8" y="105" width="22" height="180" rx="3" fill="#fffcf6" />
      <text transform="translate(16 128) rotate(90)" fontSize="16" fill="#345477">{track.number} {track.title}</text>
    </g>)}</g>
    <g data-layer="inner-shadow" clipPath={`url(#${prefix}-floor)`}>{cells.map((x,i) => <g key={i}><rect x={x} y="161" width="201" height="766" fill={`url(#${prefix}-left-shadow)`} /><rect x={x} y="161" width="201" height="766" fill={`url(#${prefix}-top-shadow)`} /></g>)}</g>
    <g data-layer="rim"><image href={assets.archive} width="1440" height="1092" clipPath={`url(#${prefix}-rim)`} /></g>
    <g data-layer="dividers">{[357,594,831,1068].map(x => <svg key={x} x={x} y="115" width="28" height="815" viewBox={`${x} 115 28 815`}><image href={assets.archive} width="1440" height="1092" /></svg>)}</g>
    <text x="721" y="973" fontSize="39" fontFamily="Arial,sans-serif" textAnchor="middle" fill="#4d7095" letterSpacing="2">MORE TAPES</text>
  </svg>
}
