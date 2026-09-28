import { assets } from '../assets'
import { topviewCassette as geometry } from '../assets/cassette/topview-geometry'

// Restore the photographed front skin over the mechanism. Spindle bores stay open.
export default function CassetteCover({ prefix, tint }) {
  return <g data-part="cassette-front-cover" pointerEvents="none">
    <defs>
      <mask id={`${prefix}-front-skin`} maskUnits="userSpaceOnUse" x="0" y="0" width={geometry.width} height={geometry.height}>
        <path d={geometry.outline} fill="white" />
        {geometry.reels.map(reel => <circle key={reel.name} cx={reel.x} cy={reel.y} r={geometry.hubRadius * .635} fill="black" />)}
      </mask>
      <clipPath id={`${prefix}-front-moulding`}>
        {/* Raised edges and the front of the head/drive openings occlude internals. */}
        <path d="M150 275H1394V574H150Z M162 287V558H1382V287Z" clipRule="evenodd" />
        <rect x="80" y="874" width="1390" height="54" />
        <circle cx="513" cy="822" r="43" /><circle cx="1025" cy="822" r="43" />
        <rect x="680" y="786" width="175" height="49" rx="8" />
      </clipPath>
    </defs>
    {/* The original case's reflections stay stationary while the winding turns below. */}
    <image href={assets.cassette.clean} width={geometry.width} height={geometry.height} style={tint} opacity=".18" mask={`url(#${prefix}-front-skin)`} data-part="case-reflections" />
    <image href={assets.cassette.clean} width={geometry.width} height={geometry.height} style={tint} clipPath={`url(#${prefix}-front-moulding)`} data-part="case-moulding" />
  </g>
}
