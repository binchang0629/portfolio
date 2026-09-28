import { useId } from 'react'
import { assets } from '../assets'
import { coherentPlayer } from '../assets/player/coherent-geometry'

const modes = ['playing', null, 'forwarding', 'rewinding']

export default function MechanicalKeys({ transport }) {
  const prefix = useId().replaceAll(':', '')
  return <g data-part="mechanical-keys" aria-hidden="true">
    <defs>
      <linearGradient id={`${prefix}-socket`} x2="0" y2="1">
        <stop stopColor="#353b3c" />
        <stop offset=".28" stopColor="#727570" />
        <stop offset=".78" stopColor="#95968e" />
        <stop offset="1" stopColor="#595d59" />
      </linearGradient>
      <linearGradient id={`${prefix}-shade`} x2="0" y2="1">
        <stop stopColor="#29302e" stopOpacity=".3" />
        <stop offset=".3" stopColor="#29302e" stopOpacity=".08" />
        <stop offset="1" stopColor="#29302e" stopOpacity=".1" />
      </linearGradient>
      {coherentPlayer.controls.map((control, i) => {
        const [, , width, height] = control.bounds
        return <clipPath key={control.name} id={`${prefix}-face-${i}`}><rect x="2" y="2" width={width - 4} height={height - 4} rx="14" /></clipPath>
      })}
    </defs>
    {coherentPlayer.controls.map((control, i) => {
      const [x, y, width, height] = control.bounds
      return <g key={control.name} className="mechanical-key" data-key-index={i} data-latched={Boolean(modes[i] && transport === modes[i])} transform={`translate(${x} ${y})`}>
        <g className="mechanical-key-socket">
          <rect width={width} height={height} rx="17" fill={`url(#${prefix}-socket)`} stroke="#59615e" strokeWidth="2" />
          <path d={`M17 1H${width - 17}`} stroke="#313936" strokeWidth="4" strokeLinecap="round" />
          <path d={`M17 ${height - 1}H${width - 17}`} stroke="#faf9f2" strokeOpacity=".6" strokeWidth="2" />
        </g>
        <g className="mechanical-key-face" clipPath={`url(#${prefix}-face-${i})`}>
          <image href={assets.player.empty} x={-x} y={-y} width={coherentPlayer.width} height={coherentPlayer.height} />
          <rect className="mechanical-key-shade" width={width} height={height} rx="14" fill={`url(#${prefix}-shade)`} />
          <path className="mechanical-key-shade" d={`M15 4H${width - 15}`} stroke="#38413b" strokeOpacity=".4" strokeWidth="3" />
        </g>
      </g>
    })}
  </g>
}
