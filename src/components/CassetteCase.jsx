import { useId } from 'react'
import { archiveTray } from '../assets/archive/tray-geometry'

// Only the narrow edge is visible from the shared camera above the desk.
export default function CassetteCase({ track, occupied, horizontal = false, readableLabel = false }) {
  const prefix = useId().replaceAll(':', '')
  const { width: w, height: h } = archiveTray.spine
  const tint = track.caseColor ?? '#cbd8e4'
  return <g data-part="cassette-case" data-occupied={occupied}>
    <defs>
      <linearGradient id={`${prefix}-glass`} x1={horizontal ? "100%" : "0%"} x2={horizontal ? "0%" : "100%"}>
        <stop stopColor="#f9fcff" stopOpacity=".86" />
        <stop offset=".13" stopColor="#c2d5e3" stopOpacity=".48" />
        <stop offset=".27" stopColor="#f8fcff" stopOpacity=".42" />
        <stop offset=".78" stopColor="#dce8ee" stopOpacity=".3" />
        <stop offset=".94" stopColor="#8cabbf" stopOpacity=".62" />
        <stop offset="1" stopColor="#f8fcff" stopOpacity=".85" />
      </linearGradient>
      <linearGradient id={`${prefix}-lip`} x1={horizontal ? "1" : "0"} x2="0" y2={horizontal ? "0" : "1"}>
        <stop stopColor="#ffffff" stopOpacity=".8" />
        <stop offset=".5" stopColor="#b1c5d4" stopOpacity=".38" />
        <stop offset="1" stopColor="#5e7c92" stopOpacity=".58" />
      </linearGradient>
    </defs>
    <g data-layer="case-contact-shadow">
      <rect x={horizontal ? -5 : 5} y="5" width={w} height={h - 2} rx="5" fill="#34506b" opacity=".12" />
      <rect x={horizontal ? -3 : 3} y="3" width={w} height={h - 2} rx="5" fill="#34506b" opacity=".1" />
    </g>
    <g data-layer="case-back">
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="6" fill={`url(#${prefix}-glass)`} stroke="#92adbf" strokeWidth="2" />
      <rect x="9" y="12" width={w - 18} height={h - 24} rx="3" fill="#e1eaf0" fillOpacity=".32" stroke="#fff" strokeOpacity=".66" strokeWidth="1.5" />
    </g>
    <g data-layer="case-paper-insert" opacity={occupied ? 1 : .12}>
      <rect x="17" y="34" width={w - 34} height={h - 68} rx="1" fill="#fbfaf6" />
      <rect x="17" y="34" width="13" height={h - 68} fill={tint} />
      <path d={`M${w - 20} 35V${h - 35}`} stroke="#b9b9ae" strokeOpacity=".35" strokeWidth="2" />
      <g transform="translate(62 58) rotate(90)" fill="#345477">
        <text fontSize={readableLabel ? 44 : 29} fontWeight="600">{track.number}</text>
        <path d={readableLabel ? "M80 -34V16" : "M55 -25V16"} stroke={tint} strokeWidth="3" />
        <text x={readableLabel ? 104 : 76} fontSize={readableLabel ? 36 : 28} fontWeight="500" letterSpacing="1.5">{track.title}</text>
        <text x="530" fontSize="11" letterSpacing="2" fill="#6c8496">SIDE A</text>
      </g>
    </g>
    <g data-layer="tape-in-case" opacity={occupied ? .85 : 0}>
      <rect x="33" y="14" width={w - 64} height="12" rx="2" fill={tint} stroke="#65829b" strokeOpacity=".5" />
      <rect x="33" y={h - 26} width={w - 64} height="12" rx="2" fill={tint} stroke="#65829b" strokeOpacity=".5" />
    </g>
    <g data-layer="case-lid">
      <rect x="3" y="3" width={w - 6} height={h - 6} rx="5" fill="#fff" fillOpacity=".04" stroke="#fff" strokeOpacity=".7" strokeWidth="2" />
      <path d={`M13 12V${h - 12}M${w - 11} 12V${h - 12}`} stroke="#6d8c9f" strokeOpacity=".35" strokeWidth="1.5" />
      <path d={`M${horizontal ? w - 7 : 7} 10V${h - 10}`} stroke="#fff" strokeOpacity=".85" strokeWidth="3" />
      {[19, h - 39].map(y => <g key={y}>
        <rect x={w - 14} y={y} width="11" height="20" rx="2" fill={`url(#${prefix}-lip)`} stroke="#f8fcff" strokeOpacity=".85" />
        <path d={`M${w - 12} ${y + 10}H${w - 4}`} stroke="#6c8698" strokeOpacity=".4" />
      </g>)}
      <rect x="3" y={h / 2 - 16} width="9" height="32" rx="2" fill={`url(#${prefix}-lip)`} stroke="#fff" strokeOpacity=".75" />
      <path d={`M9 9H${w - 9}M9 ${h - 9}H${w - 9}`} stroke="#6c8698" strokeOpacity=".4" strokeWidth="2" />
    </g>
    {!occupied && <text transform={`translate(66 ${h / 2}) rotate(90)`} textAnchor="middle" fontSize="31" fontWeight="600" letterSpacing="4" fill="#637e91">EMPTY</text>}
  </g>
}
