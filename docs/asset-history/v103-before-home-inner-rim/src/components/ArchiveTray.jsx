import { useId } from 'react'
import { assets } from '../assets'
import CassetteCase from './CassetteCase'
import CaseNumberLabel from './CaseNumberLabel'
import LandscapeArchiveTray from './LandscapeArchiveTray'
import { archiveTray as geometry, archiveCells } from '../assets/archive/tray-geometry'

export default function ArchiveTray(props) {
  return props.orientation === 'landscape' ? <LandscapeArchiveTray {...props} /> : <PortraitArchiveTray {...props} />
}

function PortraitArchiveTray({ slots, cases, preview, previewTrack }) {
  const spine = geometry.spine
  const prefix = useId().replaceAll(':', '')
  // Rotate objects in the desk plane, then project them through the same camera as the player.
  // Depth and lighting stay toward the screen bottom; they must not rotate with the old photograph.
  const frontWall = 'M95 1278Q95 1338 155 1338H935Q995 1338 995 1278V1326Q995 1386 935 1386H155Q95 1386 95 1326Z'
  const caseTransform = cell => `translate(${spine.y} ${cell.y + cell.height / 2 + spine.width / 2}) rotate(-90)`
  return <svg className="archive-art" viewBox={geometry.viewBox} preserveAspectRatio="none" aria-hidden="true" data-camera="player-matched-portrait-v5" data-capacity={geometry.capacity}>
    <defs>
      <clipPath id={`${prefix}-front-wall`}><path d={frontWall} /></clipPath>
      <linearGradient id={`${prefix}-wall-depth`} x2="0" y2="1"><stop stopColor="#d6e6ef" stopOpacity=".3"/><stop offset=".55" stopColor="#91aec0" stopOpacity=".34"/><stop offset="1" stopColor="#617e95" stopOpacity=".42"/></linearGradient>
      <clipPath id={`${prefix}-floor`}><rect {...geometry.floor} rx="23" /></clipPath>
      <clipPath id={`${prefix}-source-rim`}><path d="M161 95H1281Q1341 95 1341 155V935Q1341 995 1281 995H161Q101 995 101 935V155Q101 95 161 95ZM179 161H1262Q1286 161 1286 185V903Q1286 927 1262 927H179Q155 927 155 903V185Q155 161 179 161Z" clipRule="evenodd" /></clipPath>
      <linearGradient id={`${prefix}-left-shadow`}><stop stopColor="#344d69" stopOpacity=".08"/><stop offset=".08" stopColor="#344d69" stopOpacity="0"/></linearGradient>
      <linearGradient id={`${prefix}-top-shadow`} x2="0" y2="1"><stop stopColor="#344d69" stopOpacity=".065"/><stop offset=".24" stopColor="#344d69" stopOpacity="0"/></linearGradient>
      <linearGradient id={`${prefix}-floor-light`} x2="1" y2="1"><stop stopColor="#f2f8ff" stopOpacity=".24"/><stop offset="1" stopColor="#dbe7f2" stopOpacity=".12"/></linearGradient>
      <linearGradient id={`${prefix}-divider`} x2="0" y2="1"><stop stopColor="#f4faff" stopOpacity=".9"/><stop offset=".3" stopColor="#b7d2e7" stopOpacity=".85"/><stop offset=".7" stopColor="#99b9d3" stopOpacity=".8"/><stop offset="1" stopColor="#6f92ad" stopOpacity=".7"/></linearGradient>
    </defs>
    <g data-layer="front-wall" clipPath={`url(#${prefix}-front-wall)`}>
      <path d={frontWall} fill="#c7dce8" fillOpacity=".7"/>
      <svg x="95" y="1333" width="900" height="56" viewBox="160 958 300 32" preserveAspectRatio="none"><image href={assets.archive} width="1440" height="1092"/></svg>
      <path d={frontWall} fill={`url(#${prefix}-wall-depth)`}/>
      <path d="M155 1383H935" stroke="#eef7fb" strokeOpacity=".55" strokeWidth="3"/>
    </g>
    <g data-layer="floor" clipPath={`url(#${prefix}-floor)`}>
      {/* One continuous floor keeps the light direction fixed when the tray turns. */}
      <svg {...geometry.floor} viewBox="205 220 120 625" preserveAspectRatio="none"><image href={assets.archive} width="1440" height="1092"/></svg>
      <rect {...geometry.floor} fill={`url(#${prefix}-floor-light)`}/>
    </g>
    {preview && <g data-layer="slot-preview" pointerEvents="none">{archiveCells.map((cell, i) => <g key={i} data-slot-highlight={i === preview.slot ? 'destination' : i === preview.hoveredSlot ? 'hovered-occupied' : 'idle'}>
      {(i === preview.slot || i === preview.hoveredSlot) && <rect x={cell.x + 8} y={cell.y + 12} width={cell.width - 16} height={cell.height - 24} rx="10" fill={i === preview.slot ? '#729fbd' : '#b69e7e'} fillOpacity={i === preview.slot ? .23 : .13} stroke={i === preview.slot ? '#386b98' : '#907b61'} strokeWidth={i === preview.slot ? 7 : 4} strokeDasharray={i === preview.slot ? undefined : '14 12'}/>}
    </g>)}</g>}
    <g data-layer="stored-tapes">{cases.map((track, i) => track && <g key={track.id} transform={caseTransform(archiveCells[i])} opacity={preview?.slot === i ? .16 : 1} data-case-id={track.id} data-stored-id={slots[i]?.id} data-slot={i}><CassetteCase track={track} occupied={Boolean(slots[i])} horizontal readableLabel/></g>)}</g>
    {preview?.slot >= 0 && previewTrack && <g data-part="storage-silhouette" data-slot={preview.slot} pointerEvents="none" transform={caseTransform(archiveCells[preview.slot])}>
      <g opacity=".5"><CassetteCase track={previewTrack} occupied horizontal readableLabel/></g><rect x="1" y="1" width={spine.width - 2} height={spine.height - 2} rx="6" fill="none" stroke="#3f759f" strokeWidth="5" strokeDasharray="15 12"/>
    </g>}
    <g data-layer="inner-shadow" clipPath={`url(#${prefix}-floor)`}>{archiveCells.map((cell, i) => <g key={i}><rect {...cell} fill={`url(#${prefix}-left-shadow)`}/><rect {...cell} fill={`url(#${prefix}-top-shadow)`}/></g>)}</g>
    <g data-layer="rim">
      <g transform="matrix(0 -1 1 0 0 1439)">
        <image href={assets.archive} width="1440" height="1092" clipPath={`url(#${prefix}-source-rim)`}/>
        <svg x="179" y="95" width="1083" height="66" viewBox="400 95 175 66" preserveAspectRatio="none"><image href={assets.archive} width="1440" height="1092"/></svg>
        {/* Reuse a clean rim strip so the old label does not become a second, sideways label. */}
        <svg x="179" y="927" width="1083" height="68" viewBox="400 927 120 68" preserveAspectRatio="none"><image href={assets.archive} width="1440" height="1092"/></svg>
      </g>
      <path d="M109 1268V158Q109 112 155 112H925" fill="none" stroke="#f8fcff" strokeWidth="3" strokeOpacity=".55"/>
    </g>
    <g data-layer="dividers">{archiveCells.slice(1).map((cell, i) => <g key={i} data-divider={i}>
      <path d={`M154 ${cell.y + 9}H934`} stroke="#344d69" strokeWidth="5" strokeOpacity=".12" strokeLinecap="round"/>
      <rect x="143" y={cell.y - 7} width="802" height="14" rx="3" fill={`url(#${prefix}-divider)`} stroke="#8eafc8" strokeOpacity=".6" strokeWidth="1"/>
      <path d={`M151 ${cell.y - 5}H936`} stroke="#ffffff" strokeWidth="2" strokeOpacity=".8" strokeLinecap="round"/>
    </g>)}</g>
    {preview && <g data-layer="slot-numbers" pointerEvents="none">{archiveCells.map((cell, i) => <g key={i}>
      <circle cx="127" cy={cell.y + cell.height / 2} r="24" fill={i === preview.slot ? '#386b98' : '#f8fbfc'} fillOpacity={i === preview.slot ? 1 : .8}/><text x="127" y={cell.y + cell.height / 2 + 10} textAnchor="middle" fontSize="29" fontWeight="600" fill={i === preview.slot ? '#fff' : '#506b83'}>{i + 1}</text>
    </g>)}</g>}
    {!preview && <g data-layer="case-number-labels">{cases.map((track, i) => track && <CaseNumberLabel key={track.id} number={track.number} x={143} y={archiveCells[i].y + archiveCells[i].height / 2} />)}</g>}
    <g data-layer="label"><svg x="330" y="1288" width="430" height="50" viewBox="530 937 368 50" preserveAspectRatio="none"><image href={assets.archive} width="1440" height="1092"/></svg><text x="545" y="1327" fontSize="39" textAnchor="middle" fill="#4d7095" letterSpacing="2">MY TAPES</text></g>
  </svg>
}
