import { cassetteFit } from './cassette-fit'

export const coherentPlayer = {
  width: 1536, height: 1024,
  viewBox: '70 75 1380 880',
  cassetteViewBox: '228 306 940 482',
  cassetteOutline: 'M286 315H1114Q1144 315 1147 345L1155 741Q1156 778 1116 783H272Q234 780 237 742L248 347Q249 315 286 315Z',
  body: 'M211 139L975 127L991 122V106Q996 85 1051 85Q1108 85 1119 107V127H1168L1171 104Q1201 87 1235 111L1241 133L1344 137Q1414 141 1420 209L1443 840Q1445 935 1349 937H193Q101 937 98 853L120 213Q120 143 211 139Z',
  // Center the visible cassette between the door's inner side rails.
  cassette: 'M234 315L1122 315L1135 776L217 776Z',
  door: {
    // The bottom latch releases the lid; its top rail stays on the hinge axis.
    hinge: { x: 683.5, y: 268 },
    outline: 'M220 261H1147Q1169 261 1169 285V801Q1169 827 1144 827H223Q198 827 198 801V285Q198 261 220 261Z',
    glass: cassetteFit.window,
    latch: { x: 645, y: 804, width: 104, height: 49, rx: 8 },
  },
  spindleTrayTransform: cassetteFit.shaftTransform,
  emptyBay: 'M240 300L1155 300L1166 781L212 781Z',
  window: { x: 313, y: 427, width: 773, height: 166 },
  reels: cassetteFit.reels,
  hubRadius: 109 * cassetteFit.insertion.scale,
  texturePackRadius: 236 * cassetteFit.insertion.scale,
  controls: [
    { name: '재생', bounds: [1228, 271, 139, 116] },
    { name: '정지', bounds: [1230, 397, 138, 116] },
    { name: '빨리 감기', bounds: [1232, 522, 140, 119] },
    { name: '되감기', bounds: [1235, 655, 143, 122] },
  ],
}
