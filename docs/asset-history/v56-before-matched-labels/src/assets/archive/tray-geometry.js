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

// The reading page uses the original wide tray, with vertical case spines.
export const landscapeArchiveTray = {
  capacity: 7,
  spine: { width: 116, height: 742, y: 173 },
  viewBox: '87 80 1265 975',
  viewport: { x: 87, y: 80, width: 1265, height: 975 },
  rotation: 0,
  frontDepth: 48,
  body: { x: 101, y: 95, width: 1240, height: 900 },
  floor: { x: 155, y: 161, width: 1131, height: 766 },
}

export const landscapeArchiveCells = Array.from({ length: landscapeArchiveTray.capacity }, (_, i) => ({
  x: landscapeArchiveTray.floor.x + i * landscapeArchiveTray.floor.width / landscapeArchiveTray.capacity,
  y: landscapeArchiveTray.floor.y,
  width: landscapeArchiveTray.floor.width / landscapeArchiveTray.capacity,
  height: landscapeArchiveTray.floor.height,
}))

// Include the visible top number label in each reading-page pointer target.
export const landscapeCaseTargets = landscapeArchiveCells.map(cell => ({
  ...cell,
  y: 103,
  height: cell.y + cell.height - 103,
}))
