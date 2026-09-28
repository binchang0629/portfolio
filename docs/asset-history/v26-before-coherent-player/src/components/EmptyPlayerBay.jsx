import { fittedSpindles } from '../assets/player/cassette-plane'

export default function EmptyPlayerBay({ prefix }) {
  return <g data-part="empty-bay">
    <defs>
      <linearGradient id={`${prefix}-plate`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#c9cdd6" /><stop offset=".58" stopColor="#c4c9d3" /><stop offset="1" stopColor="#bdc4ce" /></linearGradient>
      <linearGradient id={`${prefix}-cone`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#747981" /><stop offset=".35" stopColor="#4b5057" /><stop offset=".78" stopColor="#2c3037" /><stop offset="1" stopColor="#1c2027" /></linearGradient>
      <linearGradient id={`${prefix}-tip`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ededed" /><stop offset=".5" stopColor="#b7bdc6" /><stop offset="1" stopColor="#858f9d" /></linearGradient>
    </defs>
    <rect x="608" y="435" width="271" height="77" rx="2" fill={`url(#${prefix}-plate)`} />
    <path d="M609 436H878M609 511H878" stroke="#afbac8" strokeWidth=".6" opacity=".35" />
    {fittedSpindles.map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`} data-part="empty-spindle">
      <ellipse cy="7" rx="23" ry="15" fill="#263143" opacity=".15" />
      <ellipse cy="2" rx="21" ry="14" fill="#242930" stroke="#818a98" strokeWidth=".7" />
      <path d="M-18 0L-9-14Q0-20 9-14L18 0Q15 11 0 11Q-15 11-18 0Z" fill={`url(#${prefix}-cone)`} stroke="#343943" strokeWidth=".5" />
      <ellipse cy="-14" rx="9" ry="6" fill={`url(#${prefix}-tip)`} stroke="#e3e6eb" strokeWidth=".5" />
      <path d="M-7-11L-11 0" stroke="#b2bac4" strokeWidth="1" opacity=".34" />
    </g>)}
  </g>
}
