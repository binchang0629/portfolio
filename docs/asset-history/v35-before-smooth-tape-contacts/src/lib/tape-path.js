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

export function tapeRoute(packs, guides) {
  const left = tapeTangent(packs[0], guides[0], 'left')
  const right = tapeTangent(packs[1], guides[1], 'right')
  const [a, b] = guides
  return {
    left, right,
    path: `M${left.pack.x} ${left.pack.y}L${left.guide.x} ${left.guide.y}A${a.radius} ${a.radius} 0 0 0 ${a.x} ${a.y + a.radius}L${b.x} ${b.y + b.radius}A${b.radius} ${b.radius} 0 0 0 ${right.guide.x} ${right.guide.y}L${right.pack.x} ${right.pack.y}`,
  }
}
