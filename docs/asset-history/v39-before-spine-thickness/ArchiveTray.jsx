import { useId } from 'react'
import { assets } from '../assets'
import { archiveTray as geometry, archiveCells } from '../assets/archive/tray-geometry'

export default function ArchiveTray({ slots }) {
  const prefix = useId().replaceAll(':', '')
  return <svg className="archive-art" viewBox={geometry.viewBox} preserveAspectRatio="none" aria-hidden="true" data-camera="orthographic-topview-v1" data-capacity={geometry.capacity}>
    <defs>
      <clipPath id={`${prefix}-floor`}><rect {...geometry.floor} rx="23" /></clipPath>
      <clipPath id={`${prefix}-rim`}><path d="M161 95H1281Q1341 95 1341 155V935Q1341 995 1281 995H161Q101 995 101 935V155Q101 95 161 95ZM179 161H1262Q1286 161 1286 185V903Q1286 927 1262 927H179Q155 927 155 903V185Q155 161 179 161Z" clipRule="evenodd" /></clipPath>
      <clipPath id={`${prefix}-spine`}><rect width="38" height="724" rx="8" /></clipPath>
      <linearGradient id={`${prefix}-left-shadow`}><stop stopColor="#344d69" stopOpacity=".18" /><stop offset=".14" stopColor="#344d69" stopOpacity="0" /></linearGradient>
      <linearGradient id={`${prefix}-top-shadow`} x2="0" y2="1"><stop stopColor="#344d69" stopOpacity=".15" /><stop offset=".18" stopColor="#344d69" stopOpacity="0" /></linearGradient>
    </defs>
    <g data-layer="floor" clipPath={`url(#${prefix}-floor)`}>{archiveCells.map((cell, i) => <svg key={i} {...cell} viewBox="155 161 201 766" preserveAspectRatio="none" data-slot={i}>
      <image href={assets.archive} width="1440" height="1092" />
    </svg>)}</g>
    <g data-layer="stored-tapes">{slots.map((track, i) => track && <g key={track.id} transform={`translate(${archiveCells[i].x + archiveCells[i].width / 2 - 19} 175)`} data-stored-id={track.id} data-slot={i}>
      <g clipPath={`url(#${prefix}-spine)`}>
        <rect width="38" height="724" fill="#b6d6f4" />
        <svg width="38" height="724" viewBox="0 0 62 1321" preserveAspectRatio="none">
          <g transform="translate(62 0) rotate(90)"><image href={assets.cassette.clean} x="-107" y="-62" width="1536" height="1024" style={{ filter: `hue-rotate(${track.tint}deg) saturate(.6)` }} /></g>
        </svg>
        <rect x="9" y="85" width="20" height="535" rx="3" fill="#fffcf6" />
        <text transform="translate(14 112) rotate(90)" fontFamily="Arial,sans-serif" fontSize="16" fill="#345477">{track.number} {track.title}</text>
      </g>
    </g>)}</g>
    <g data-layer="inner-shadow" clipPath={`url(#${prefix}-floor)`}>{archiveCells.map((cell, i) => <g key={i}><rect {...cell} fill={`url(#${prefix}-left-shadow)`} /><rect {...cell} fill={`url(#${prefix}-top-shadow)`} /></g>)}</g>
    <g data-layer="rim">
      <image href={assets.archive} width="1440" height="1092" clipPath={`url(#${prefix}-rim)`} />
      {/* Clean straight lips remove the former five-cell divider caps. */}
      <svg x="179" y="95" width="1083" height="66" viewBox="400 95 175 66" preserveAspectRatio="none"><image href={assets.archive} width="1440" height="1092" /></svg>
      <svg x="179" y="927" width="1083" height="12" viewBox="400 927 120 12" preserveAspectRatio="none"><image href={assets.archive} width="1440" height="1092" /></svg>
    </g>
    <g data-layer="dividers">{archiveCells.slice(1).map((cell, i) => <svg key={i} x={cell.x - 9} y="115" width="18" height="815" viewBox="357 115 28 815" preserveAspectRatio="none" data-divider={i}><image href={assets.archive} width="1440" height="1092" /></svg>)}</g>
    <text x="721" y="973" fontSize="39" fontFamily="Arial,sans-serif" textAnchor="middle" fill="#4d7095" letterSpacing="2">MY TAPES</text>
  </svg>
}
