// Calibrate a flat cassette plane to the existing player's photographic viewpoint.
// Rotation remains in cassette coordinates; this projection is applied afterwards.
const sourceAxisY = 465
const sourceCenterX = (488 + 1065) / 2
const targetCenterX = (690 + 818) / 2
const targetAxisY = 478
const perspective = -.0001
const denominator = 1 + perspective * sourceAxisY
const xScale = (818 - 690) / (1065 - 488)
const yScale = .196
const a = xScale * denominator
const b = targetCenterX * perspective
const c = targetCenterX - a * sourceCenterX
const e = yScale * denominator + perspective * targetAxisY
const f = targetAxisY * denominator - e * sourceAxisY

export const cassettePlane = {
  playerWidth: 410,
  playerHeight: 285,
  origin: [570, 330],
  sourceWidth: 1536,
  sourceHeight: 1024,
  aperture: [[602, 412], [886, 412], [889, 551], [595, 551]],
  homography: [a, b, c, 0, e, f, 0, perspective, 1],
}

export function projectCassettePoint(x, y) {
  const [a, b, c, d, e, f, g, h, i] = cassettePlane.homography
  const denominator = g * x + h * y + i
  return [(a * x + b * y + c) / denominator, (d * x + e * y + f) / denominator]
}

export const cassettePlaneTransform = (() => {
  const [a, b, c, d, e, f, g, h, i] = cassettePlane.homography
  const [x, y] = cassettePlane.origin
  return `matrix3d(${[a - x * g, d - y * g, 0, g, b - x * h, e - y * h, 0, h, 0, 0, 1, 0, c - x * i, f - y * i, 0, i].join(',')})`
})()

export const cassetteAperture = `polygon(${cassettePlane.aperture.map(([x, y]) => `${(x - cassettePlane.origin[0]) / cassettePlane.playerWidth * 100}% ${(y - cassettePlane.origin[1]) / cassettePlane.playerHeight * 100}%`).join(',')})`
