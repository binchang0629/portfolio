export default function CaseNumberLabel({ number, x, y }) {
  return <g data-number={number}>
    <rect x={x - 40} y={y - 26} width="80" height="52" rx="9" fill="#f9fcff" fillOpacity=".94" stroke="#8eabc4" strokeOpacity=".55" strokeWidth="2" />
    <text x={x} y={y + 15} textAnchor="middle" fontSize="44" fontWeight="650" fill="#315a80">{number}</text>
  </g>
}
