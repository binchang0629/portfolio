import { useId } from 'react'
import { assets } from '../assets'
import CassetteCase from './CassetteCase'
import { archiveTray as geometry, archiveCells } from '../assets/archive/tray-geometry'

export default function ArchiveTray({ slots, cases, preview, previewTrack }) {
  const spine = geometry.spine
  // The lower/front wall points toward the viewer even when the tray is turned on the desk.
  const angle = -geometry.rotation * Math.PI / 180
  const depthX = Math.sin(angle) * geometry.frontDepth
  const depthY = Math.cos(angle) * geometry.frontDepth
  const frontWall = `M101 935Q101 995 161 995H1281Q1341 995 1341 935L${1341 + depthX} ${935 + depthY}Q${1341 + depthX} ${995 + depthY} ${1281 + depthX} ${995 + depthY}H${161 + depthX}Q${101 + depthX} ${995 + depthY} ${101 + depthX} ${935 + depthY}Z`
  const prefix = useId().replaceAll(':', '')
  return <svg className="archive-art" viewBox={geometry.viewBox} preserveAspectRatio="none" aria-hidden="true" data-camera="player-matched-near-overhead-v2" data-capacity={geometry.capacity}>
    <defs>
      <clipPath id={`${prefix}-front-wall`}><path d={frontWall} /></clipPath>
      <linearGradient id={`${prefix}-wall-depth`} x2="0" y2="1">
        <stop stopColor="#d6e6ef" stopOpacity=".32" />
        <stop offset=".55" stopColor="#91aec0" stopOpacity=".34" />
        <stop offset="1" stopColor="#617e95" stopOpacity=".42" />
      </linearGradient>
      <clipPath id={`${prefix}-floor`}><rect {...geometry.floor} rx="23" /></clipPath>
      <clipPath id={`${prefix}-rim`}><path d="M161 95H1281Q1341 95 1341 155V935Q1341 995 1281 995H161Q101 995 101 935V155Q101 95 161 95ZM179 161H1262Q1286 161 1286 185V903Q1286 927 1262 927H179Q155 927 155 903V185Q155 161 179 161Z" clipRule="evenodd" /></clipPath>
      <linearGradient id={`${prefix}-left-shadow`}><stop stopColor="#344d69" stopOpacity=".18" /><stop offset=".14" stopColor="#344d69" stopOpacity="0" /></linearGradient>
      <linearGradient id={`${prefix}-top-shadow`} x2="0" y2="1"><stop stopColor="#344d69" stopOpacity=".15" /><stop offset=".18" stopColor="#344d69" stopOpacity="0" /></linearGradient>
    </defs>
    <g data-layer="front-wall" clipPath={`url(#${prefix}-front-wall)`}>
      <path d={frontWall} fill="#c7dce8" fillOpacity=".7" />
      <svg x="101" y="936" width="1252" height="110" viewBox="160 958 300 32" preserveAspectRatio="none"><image href={assets.archive} width="1440" height="1092" /></svg>
      <path d={frontWall} fill={`url(#${prefix}-wall-depth)`} />
      <path d={`M${161 + depthX} ${991 + depthY}H${1281 + depthX}`} stroke="#eef7fb" strokeOpacity=".55" strokeWidth="3" />
    </g>
    <g data-layer="floor" clipPath={`url(#${prefix}-floor)`}>{archiveCells.map((cell, i) => <svg key={i} {...cell} viewBox="155 161 201 766" preserveAspectRatio="none" data-slot={i}>
      <image href={assets.archive} width="1440" height="1092" />
    </svg>)}</g>
    {preview && <g data-layer="slot-preview" pointerEvents="none">
      {archiveCells.map((cell, i) => <g key={i} data-slot-highlight={i === preview.slot ? 'destination' : i === preview.hoveredSlot ? 'hovered-occupied' : 'idle'}>
        {(i === preview.slot || i === preview.hoveredSlot) && <rect x={cell.x + 12} y={cell.y + 8} width={cell.width - 24} height={cell.height - 16} rx="10" fill={i === preview.slot ? '#729fbd' : '#b69e7e'} fillOpacity={i === preview.slot ? .23 : .13} stroke={i === preview.slot ? '#386b98' : '#907b61'} strokeWidth={i === preview.slot ? 7 : 4} strokeDasharray={i === preview.slot ? undefined : '14 12'} />}

      </g>)}
    </g>}
    <g data-layer="stored-tapes">{cases.map((track, i) => track && <g key={track.id} transform={`translate(${archiveCells[i].x + archiveCells[i].width / 2 - spine.width / 2} ${spine.y})`} opacity={preview?.slot === i ? .16 : 1} data-case-id={track.id} data-stored-id={slots[i]?.id} data-slot={i}>
      <CassetteCase track={track} occupied={Boolean(slots[i])} />
    </g>)}</g>
    {preview?.slot >= 0 && previewTrack && <g data-part="storage-silhouette" data-slot={preview.slot} pointerEvents="none" transform={`translate(${archiveCells[preview.slot].x + archiveCells[preview.slot].width / 2 - spine.width / 2} ${spine.y})`}>
      <g opacity=".5"><CassetteCase track={previewTrack} occupied /></g>
      <rect x="1" y="1" width={spine.width - 2} height={spine.height - 2} rx="6" fill="none" stroke="#3f759f" strokeWidth="5" strokeDasharray="15 12" />
    </g>}
    <g data-layer="inner-shadow" clipPath={`url(#${prefix}-floor)`}>{archiveCells.map((cell, i) => <g key={i}><rect {...cell} fill={`url(#${prefix}-left-shadow)`} /><rect {...cell} fill={`url(#${prefix}-top-shadow)`} /></g>)}</g>
    <g data-layer="rim">
      <image href={assets.archive} width="1440" height="1092" clipPath={`url(#${prefix}-rim)`} />
      {/* Clean straight lips remove the former five-cell divider caps. */}
      <svg x="179" y="95" width="1083" height="66" viewBox="400 95 175 66" preserveAspectRatio="none"><image href={assets.archive} width="1440" height="1092" /></svg>
      <svg x="179" y="927" width="1083" height="12" viewBox="400 927 120 12" preserveAspectRatio="none"><image href={assets.archive} width="1440" height="1092" /></svg>
    </g>
    <g data-layer="dividers">{archiveCells.slice(1).map((cell, i) => <svg key={i} x={cell.x - 9} y="115" width="18" height="815" viewBox="357 115 28 815" preserveAspectRatio="none" data-divider={i}><image href={assets.archive} width="1440" height="1092" /></svg>)}</g>
    {preview && <g data-layer="slot-numbers" pointerEvents="none">{archiveCells.map((cell, i) => <g key={i}>
        <circle cx={cell.x + cell.width / 2} cy="126" r="24" fill={i === preview.slot ? '#386b98' : '#f8fbfc'} fillOpacity={i === preview.slot ? 1 : .8} />
        <text x={cell.x + cell.width / 2} y="136" textAnchor="middle" fontSize="29" fontWeight="600" fill={i === preview.slot ? '#fff' : '#506b83'}>{i + 1}</text>
    </g>)}</g>}
    <text x="721" y="973" fontSize="39" textAnchor="middle" fill="#4d7095" letterSpacing="2">MY TAPES</text>
  </svg>
}
