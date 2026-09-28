import { tapeRoute, TAPE_RIBBON_WIDTH } from '../lib/tape-path'

// The lower magnetic ribbon belongs to the cassette, not the player or desk.
export default function TapeRibbon({ reels, radii, travel = 0 }) {
  const guides = [{ x: 214, y: 830, radius: 34 }, { x: 1324, y: 830, radius: 34 }]
  const packs = reels.map((reel, i) => ({ ...reel, radius: i === 0 ? radii.left : radii.right }))
  const { path } = tapeRoute(packs, guides)
  return <g data-part="tape-ribbon" data-travel={travel} data-left-radius={radii.left} data-right-radius={radii.right}>
    {guides.map((guide, i) => <g key={i} transform={`translate(${guide.x} ${guide.y})`} data-part="tape-guide">
      <circle r={guide.radius + 1} fill="#3a4147" opacity=".7" />
      <circle r={guide.radius - 3} fill="#89939b" opacity=".6" />
      <circle r={guide.radius - 8} fill="#c7cfd3" opacity=".55" />
      <circle r="7" fill="#40484d" />
      <circle r={guide.radius - 5} fill="none" stroke="#e3ebed" strokeWidth="1.5" opacity=".5" />
    </g>)}
    <path d={path} fill="none" stroke="#151413" strokeWidth={TAPE_RIBBON_WIDTH} strokeLinecap="butt" strokeLinejoin="round" data-part="magnetic-tape-path" />
    {/* Low-contrast grain travels along the ribbon; hardware and case light stay fixed. */}
    <path d={path} fill="none" stroke="#827a70" strokeWidth={TAPE_RIBBON_WIDTH - 2.5} strokeOpacity=".22" strokeDasharray="1.2 5 2.3 11 1 7.5" strokeDashoffset={-travel} strokeLinecap="butt" data-part="tape-moving-grain" />
    <path d={path} fill="none" stroke="#665b50" strokeWidth="1.2" strokeOpacity=".35" pointerEvents="none" />
  </g>
}

