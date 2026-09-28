export const archiveTray = {
  capacity: 7,
  spine: { width: 116, height: 742, y: 173 },
  viewBox: '87 80 1265 975',
  viewport: { x: 87, y: 80, width: 1265, height: 975 },
  rotation: -12,
  frontDepth: 48,
  body: { x: 101, y: 95, width: 1240, height: 900 },
  floor: { x: 155, y: 161, width: 1131, height: 766 },
}

export const archiveCells = Array.from({ length: archiveTray.capacity }, (_, i) => ({
  x: archiveTray.floor.x + i * archiveTray.floor.width / archiveTray.capacity,
  y: archiveTray.floor.y,
  width: archiveTray.floor.width / archiveTray.capacity,
  height: archiveTray.floor.height,
}))
