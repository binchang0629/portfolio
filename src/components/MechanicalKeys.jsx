import { useId } from 'react'
import { assets } from '../assets'
import { coherentPlayer } from '../assets/player/coherent-geometry'

const modes = ['playing', null, 'forwarding', 'rewinding']

export default function MechanicalKeys({ transport }) {
  const prefix = useId().replaceAll(':', '')
  return <g data-part="mechanical-keys" aria-hidden="true">
    <defs>
      <linearGradient id={`${prefix}-socket`} x2="0" y2="1">
        <stop stopColor="#414744" /><stop offset=".35" stopColor="#8b8e85" /><stop offset="1" stopColor="#666d65" />
      </linearGradient>
      <linearGradient id={`${prefix}-face`} x2=".35" y2="1">
        <stop stopColor="#f4f3ee" /><stop offset=".5" stopColor="#eae9e3" /><stop offset="1" stopColor="#dfded7" />
      </linearGradient>
      <linearGradient id={`${prefix}-shade`} x2="0" y2="1">
        <stop stopColor="#29302e" stopOpacity=".22" /><stop offset=".25" stopColor="#29302e" stopOpacity=".05" /><stop offset="1" stopColor="#29302e" stopOpacity=".06" />
      </linearGradient>
      <filter id={`${prefix}-blend`}><feGaussianBlur stdDeviation="2" /></filter>
      <radialGradient id={`${prefix}-cue`} cx=".5" cy=".5" r=".6">
        <stop stopColor="#7fb0ff" stopOpacity=".75" /><stop offset=".55" stopColor="#5b94f5" stopOpacity=".35" /><stop offset="1" stopColor="#3f7fe0" stopOpacity=".12" />
      </radialGradient>
      {coherentPlayer.controls.map((control, i) => {
        const [, , width, height] = control.bounds
        return <g key={control.name}>
          <clipPath id={`${prefix}-face-${i}`}><rect x="4" y="4" width={width - 10} height={height - 10} rx="13" /></clipPath>
          <mask id={`${prefix}-texture-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
            <rect x="9" y="8" width={width - 27} height={height - 23} rx="5" fill="white" filter={`url(#${prefix}-blend)`} />
          </mask>
        </g>
      })}
    </defs>
    {coherentPlayer.controls.map((control, i) => {
      const [x, y, width, height] = control.bounds
      return <g key={control.name} className="mechanical-key" data-key-index={i} data-latched={Boolean(modes[i] && transport === modes[i])} transform={`translate(${x} ${y})`}>
        <g className="mechanical-key-socket">
          <rect width={width} height={height} rx="17" fill={`url(#${prefix}-socket)`} stroke="#737970" strokeWidth="1.5" />
          <path d={`M17 1H${width - 17}`} stroke="#3c443d" strokeWidth="2" strokeLinecap="round" />
          <path d={`M17 ${height - 1}H${width - 17}`} stroke="#faf9f2" strokeOpacity=".65" strokeWidth="2" />
        </g>
        {/* One unchanged face and icon move together. No second crop or rescaling when pressed. */}
        <g className="mechanical-key-face">
          <g clipPath={`url(#${prefix}-face-${i})`}>
            <rect x="4" y="4" width={width - 10} height={height - 10} rx="13" fill={`url(#${prefix}-face)`} />
            <image data-part="key-face-texture" href={assets.player.empty} x={-x} y={-y} width={coherentPlayer.width} height={coherentPlayer.height} mask={`url(#${prefix}-texture-${i})`} />
            <rect className="mechanical-key-shade" x="4" y="4" width={width - 10} height={height - 10} rx="13" fill={`url(#${prefix}-shade)`} />
            {/* Cue light: same shape as the face, so a highlight always fits the key exactly. */}
            <rect className="mechanical-key-cue" x="4" y="4" width={width - 10} height={height - 10} rx="13" fill={`url(#${prefix}-cue)`} />
          </g>
          <rect data-part="key-face-outline" x="4" y="4" width={width - 10} height={height - 10} rx="13" fill="none" stroke="#a8aca2" strokeWidth="1.5" />
          <path d={`M17 6H${width - 23}`} stroke="#fffef8" strokeOpacity=".65" strokeWidth="2" />
        </g>
      </g>
    })}
  </g>
}
