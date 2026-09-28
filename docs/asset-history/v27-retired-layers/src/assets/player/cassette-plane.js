// The fitted cassette occupies the compartment, not the visible glass opening.
// All four edges use the same measured plane; arbitrary per-reel skew is forbidden.
const sourceCorners = [[101, 98], [1436, 98], [1436, 929], [101, 929]]
const fittedCorners = [[591, 400], [894, 400], [895, 570], [589, 570]]

function fitPlane(source, target) {
  const rows = source.flatMap(([x, y], i) => {
    const [u, v] = target[i]
    return [[x, y, 1, 0, 0, 0, -u * x, -u * y, u], [0, 0, 0, x, y, 1, -v * x, -v * y, v]]
  })
  for (let col = 0; col < 8; col++) {
    let pivot = col
    for (let row = col + 1; row < 8; row++) if (Math.abs(rows[row][col]) > Math.abs(rows[pivot][col])) pivot = row
    ;[rows[col], rows[pivot]] = [rows[pivot], rows[col]]
    const divisor = rows[col][col]
    for (let j = col; j < 9; j++) rows[col][j] /= divisor
    for (let row = 0; row < 8; row++) {
      if (row === col) continue
      const factor = rows[row][col]
      for (let j = col; j < 9; j++) rows[row][j] -= factor * rows[col][j]
    }
  }
  return [...rows.map(row => row[8]), 1]
}

export const cassettePlane = {
  playerWidth: 410, playerHeight: 285,
  origin: [570, 330], sourceWidth: 1536, sourceHeight: 1024,
  sourceCorners, fittedCorners,
  aperture: [[603, 414], [883, 414], [885, 549], [598, 549]],
  homography: fitPlane(sourceCorners, fittedCorners),
}

export function projectCassettePoint(x, y) {
  const [a, b, c, d, e, f, g, h, i] = cassettePlane.homography
  const denominator = g * x + h * y + i
  return [(a * x + b * y + c) / denominator, (d * x + e * y + f) / denominator]
}

export const fittedSpindles = [[486, 465], [1051, 465]].map(([x, y]) => projectCassettePoint(x, y))

export const cassettePlaneTransform = (() => {
  const [a, b, c, d, e, f, g, h, i] = cassettePlane.homography
  const [x, y] = cassettePlane.origin
  return `matrix3d(${[a - x * g, d - y * g, 0, g, b - x * h, e - y * h, 0, h, 0, 0, 1, 0, c - x * i, f - y * i, 0, i].join(',')})`
})()

export const cassetteAperture = `polygon(${cassettePlane.aperture.map(([x, y]) => `${(x - cassettePlane.origin[0]) / cassettePlane.playerWidth * 100}% ${(y - cassettePlane.origin[1]) / cassettePlane.playerHeight * 100}%`).join(',')})`
export const aperturePath = `M${cassettePlane.aperture.map(point => point.join(' ')).join('L')}Z`
