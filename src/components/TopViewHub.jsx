import { assets } from '../assets'

// Geometry turns inside a mask. Surface shading stays in the cassette's space.
// A shallow concentric face avoids rotating photographed sidewalls or reflections.
export default function TopViewHub({ angle, radius, id }) {
  const bore = radius * .635
  const toothWidth = radius * .145
  const toothReach = radius * .13
  return <g data-part="hub" data-angle={angle} data-view="orthographic" data-radius={radius}>
    <defs>
      <linearGradient id={`${id}-rim`} x1={-radius} y1={-radius} x2={radius} y2={radius} gradientUnits="userSpaceOnUse">
        <stop stopColor="#fffcf1" /><stop offset=".45" stopColor="#e9e5d9" /><stop offset="1" stopColor="#bcbbae" />
      </linearGradient>
      <linearGradient id={`${id}-face`} x1={-radius} y1={-radius} x2={radius} y2={radius} gradientUnits="userSpaceOnUse">
        <stop stopColor="#faf8ef" /><stop offset=".55" stopColor="#ece9df" /><stop offset="1" stopColor="#dedbd1" />
      </linearGradient>
      <radialGradient id={`${id}-bore`}><stop stopColor="#151a1d" /><stop offset=".9" stopColor="#1b2022" /><stop offset="1" stopColor="#292d2e" /></radialGradient>
      <pattern id={`${id}-polymer`} patternUnits="userSpaceOnUse" width="45" height="30">
        <svg width="45" height="30" viewBox="520 150 90 60" overflow="hidden"><image href={assets.cassette.polymer} width="1254" height="1254" /></svg>
      </pattern>
      <filter id={`${id}-shallow-edge`} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation=".8" result="height" />
        <feSpecularLighting in="height" surfaceScale="1.6" specularConstant=".4" specularExponent="18" lightingColor="#fffdf4" result="edge-light"><feDistantLight azimuth="225" elevation="65" /></feSpecularLighting>
        <feMorphology in="SourceAlpha" operator="erode" radius="1.5" result="inner-face" /><feComposite in="SourceAlpha" in2="inner-face" operator="out" result="edge-band" /><feComposite in="edge-light" in2="edge-band" operator="in" result="lit-edge" />
        <feComposite in="SourceGraphic" in2="lit-edge" operator="arithmetic" k1="0" k2="1" k3=".5" k4="0" />
        <feDropShadow dx=".7" dy=".9" stdDeviation=".65" floodColor="#242724" floodOpacity=".32" />
      </filter>
      <mask id={`${id}-face-shape`} x={-radius-2} y={-radius-2} width={radius*2+4} height={radius*2+4} maskUnits="userSpaceOnUse">
        <circle r={radius-3} fill="white" /><circle r={bore} fill="black" />
        <g transform={`rotate(${angle})`} data-part="drive-shape">{Array.from({length:6},(_,i) => <rect key={i} x={-toothWidth/2} y={-bore-2} width={toothWidth} height={toothReach+2} rx="1.8" fill="white" transform={`rotate(${i*60})`} />)}</g>
      </mask>
    </defs>
    <g data-part="fixed-light">
      <circle r={radius+1.2} fill="#111415" opacity=".3" />
      <circle r={radius} fill={`url(#${id}-rim)`} />
      <circle r={radius-3} fill={`url(#${id}-bore)`} />
      <g filter={`url(#${id}-shallow-edge)`}>
        <g mask={`url(#${id}-face-shape)`}>
          <circle r={radius-3} fill={`url(#${id}-face)`} />
          <circle r={radius-3} fill={`url(#${id}-polymer)`} opacity=".32" />
        </g>
      </g>
      <circle r={radius-1.6} fill="none" stroke="#fffcf2" strokeWidth="1.3" opacity=".62" />
      <circle r={radius-6} fill="none" stroke="#b9b7ac" strokeWidth=".75" opacity=".45" /><circle r={radius*.84} fill="none" stroke="#b9b6aa" strokeWidth="1.5" opacity=".42" /><circle r={radius*.84+1.8} fill="none" stroke="#fffcf3" strokeWidth="1.1" opacity=".6" />
    </g>
  </g>
}
