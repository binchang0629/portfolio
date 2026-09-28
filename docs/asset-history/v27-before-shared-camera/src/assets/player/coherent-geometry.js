export const coherentPlayer = {
  width: 1536, height: 1024,
  viewBox: '70 75 1380 880',
  body: 'M211 139L975 127L991 122V106Q996 85 1051 85Q1108 85 1119 107V127H1168L1171 104Q1201 87 1235 111L1241 133L1344 137Q1414 141 1420 209L1443 840Q1445 935 1349 937H193Q101 937 98 853L120 213Q120 143 211 139Z',
  cassette: 'M254 315L1142 315L1155 776L237 776Z',
  emptyBay: 'M240 300L1155 300L1166 781L212 781Z',
  window: { x: 313, y: 427, width: 773, height: 166 },
  reels: [{ name: 'left', x: 513, y: 520 }, { name: 'right', x: 905, y: 520 }],
  hubRadius: 70,
  texturePackRadius: 153,
  controls: [
    { name: '재생', bounds: [1228, 271, 139, 116] },
    { name: '정지', bounds: [1230, 397, 138, 116] },
    { name: '빨리 감기', bounds: [1232, 522, 140, 119] },
    { name: '되감기', bounds: [1235, 655, 143, 122] },
  ],
}
