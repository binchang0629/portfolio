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
const reels = sourceReels.map(reel => ({ name: reel.name, x: insertion.x + reel.x * scale, y: insertion.y + reel.y * scale }))
const shaftScale = (reels[1].x - reels[0].x) / 392
const shaftCenter = { x: (reels[0].x + reels[1].x) / 2, y: reels[0].y }
// Project both photographic shafts together without changing their round shape.
const shaftTransform = `translate(${shaftCenter.x} ${shaftCenter.y}) scale(${shaftScale}) translate(-709 -520)`
export const cassetteFit = { window, center, sourceBounds, sourceReels, insertion, reels, shaftTransform }
