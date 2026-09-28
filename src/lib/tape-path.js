export const TAPE_RIBBON_WIDTH = 8

// Common external tangents keep the ribbon attached as either pack changes size.
export function tapeTangent(pack, guide, side) {
  const dx = guide.x - pack.x, dy = guide.y - pack.y
  const distance = Math.hypot(dx, dy)
  const along = (pack.radius - guide.radius) / distance
  const across = Math.sqrt(1 - along * along)
  const sign = side === 'left' ? 1 : -1
  const nx = along * dx / distance - sign * across * dy / distance
  const ny = along * dy / distance + sign * across * dx / distance
  return {
    pack: { x: pack.x + nx * pack.radius, y: pack.y + ny * pack.radius },
    guide: { x: guide.x + nx * guide.radius, y: guide.y + ny * guide.radius },
  }
}

export function tapeRoute(packs, guides, ribbonWidth = TAPE_RIBBON_WIDTH) {
  // SVG strokes extend on both sides of their centerline. Tuck that centerline
  // half a ribbon width into the pack so its outer edge meets the winding flush.
  // The pack is drawn above the ribbon and hides the cut end inside the coil.
  const insetPacks = packs.map(pack => ({ ...pack, radius: pack.radius - ribbonWidth / 2 }))
  const left = tapeTangent(insetPacks[0], guides[0], 'left')
  const right = tapeTangent(insetPacks[1], guides[1], 'right')
  const [a, b] = guides
  return {
    left, right,
    path: `M${left.pack.x} ${left.pack.y}L${left.guide.x} ${left.guide.y}A${a.radius} ${a.radius} 0 0 0 ${a.x} ${a.y + a.radius}L${b.x} ${b.y + b.radius}A${b.radius} ${b.radius} 0 0 0 ${right.guide.x} ${right.guide.y}L${right.pack.x} ${right.pack.y}`,
  }
}
