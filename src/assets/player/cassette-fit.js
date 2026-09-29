// One physical fit drives the lid aperture, cassette, shafts, and desk tape scale.
const window = { x: 224, y: 314, width: 919, height: 466, rx: 10 }
const sourceBounds = { x: 50, y: 62, width: 1438, height: 863 }
const sourceReels = [{ name: 'left', x: 469, y: 441 }, { name: 'right', x: 1068, y: 441 }]
const center = { x: window.x + window.width / 2, y: window.y + window.height / 2 }
const scale = (window.width - 8) / sourceBounds.width
const insertion = {
  scale,
  x: center.x - (sourceBounds.x + sourceBounds.width / 2) * scale,
  y: center.y - (sourceBounds.y + sourceBounds.height / 2) * scale,
}
// The player's face recedes towards its top edge. Project the whole cassette as
// one plane, so labels, winding and hubs share the same foreshortening.
const nearWidth = window.width - 6
const farWidth = nearWidth - 22
const top = window.y - 12, bottom = window.y + window.height + 12
const farLeft = center.x - farWidth / 2, nearLeft = center.x - nearWidth / 2
const q = farWidth / nearWidth - 1
const a = farWidth, b = nearLeft * (1 + q) - farLeft
const e = bottom * (1 + q) - top
const project = (x, y) => {
  const u = (x - sourceBounds.x) / sourceBounds.width
  const v = (y - sourceBounds.y) / sourceBounds.height
  return { x: (a * u + b * v + farLeft) / (1 + q * v), y: (e * v + top) / (1 + q * v) }
}
const projection = {
  corners: [project(50, 62), project(1488, 62), project(1488, 925), project(50, 925)],
  transform: `matrix3d(${[
    a / sourceBounds.width, 0, 0, 0,
    b / sourceBounds.height, e / sourceBounds.height, 0, q / sourceBounds.height,
    0, 0, 1, 0,
    farLeft - a * sourceBounds.x / sourceBounds.width - b * sourceBounds.y / sourceBounds.height,
    top - e * sourceBounds.y / sourceBounds.height, 0, 1 - q * sourceBounds.y / sourceBounds.height,
  ].join(',')})`,
}
const reels = sourceReels.map(reel => ({ name: reel.name, ...project(reel.x, reel.y) }))
const shaftScale = (reels[1].x - reels[0].x) / 392
const shaftCenter = { x: (reels[0].x + reels[1].x) / 2, y: reels[0].y }
const sample = project(769, 441)
const planeRatio = (project(769, 442).y - sample.y) / (project(770, 441).x - sample.x)
// The empty drive shafts sit on the same projected plane as the loaded tape hubs.
const shaftTransform = `translate(${shaftCenter.x} ${shaftCenter.y}) scale(${shaftScale} ${shaftScale * planeRatio}) translate(-709 -520)`
export const cassetteFit = { window, center, sourceBounds, sourceReels, insertion, projection, reels, shaftTransform }
