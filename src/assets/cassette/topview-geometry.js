export const topviewCassette = {
  width: 1536, height: 1024,
  viewBox: '36 48 1464 884',
  outline: 'M107 62H1428Q1488 62 1488 124V836Q1488 898 1426 898H1264V912Q1264 925 1248 925H291Q275 925 275 898H108Q50 898 50 837V121Q50 62 107 62Z',
  window: { x: 150, y: 275, width: 1244, height: 295 },
  paper: [{ x: 173, y: 137, width: 1189, height: 134 }, { x: 172, y: 574, width: 1193, height: 134 }],
  reels: [{ name: 'left', x: 469, y: 441 }, { name: 'right', x: 1068, y: 441 }],
  hubRadius: 109,
  texturePackRadius: 236,
  // Uniform scale matches both spindle centers without stretching either hub.
  insertion: { scale: 392 / 599, x: 481 - 469 * 392 / 599, y: 520 - 441 * 392 / 599 },
}
