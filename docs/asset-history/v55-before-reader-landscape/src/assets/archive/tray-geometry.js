export const archiveTray = {
  capacity: 7,
  spine: { width: 116, height: 742, y: 173 },
  viewBox: '80 87 975 1313',
  viewport: { x: 80, y: 87, width: 975, height: 1313 },
  rotation: -90,
  frontDepth: 48,
  body: { x: 95, y: 98, width: 900, height: 1240 },
  floor: { x: 161, y: 153, width: 766, height: 1131 },
}

// Shared row geometry drives the drawing, pointer targets, preview and committed storage.
export const archiveCells = Array.from({ length: archiveTray.capacity }, (_, i) => ({
  x: archiveTray.floor.x,
  y: archiveTray.floor.y + i * archiveTray.floor.height / archiveTray.capacity,
  width: archiveTray.floor.width,
  height: archiveTray.floor.height / archiveTray.capacity,
}))
