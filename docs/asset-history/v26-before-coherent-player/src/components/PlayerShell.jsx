import { useId } from 'react'
import EmptyPlayerBay from './EmptyPlayerBay'
import { assets } from '../assets'
import { playerGeometry } from '../assets/player/geometry'

export default function PlayerShell({ occupied = false }) {
  const id = useId().replaceAll(':', '')
  return <svg className="player-shell" viewBox={playerGeometry.viewBox} role="img" aria-label="흰색 휴대용 카세트 플레이어">
    <defs><clipPath id={id}><path d={playerGeometry.shell} /></clipPath><linearGradient id={`${id}-label`} x2="0" y2="1"><stop stopColor="#f4f3f0" /><stop offset="1" stopColor="#e8e7e5" /></linearGradient></defs>
    <image href={assets.player.material} width={playerGeometry.materialWidth} height={playerGeometry.materialHeight} clipPath={`url(#${id})`} />
    {!occupied && <EmptyPlayerBay prefix={id} />}
    <rect x="613" y="377" width="276" height="27" rx="4" fill={`url(#${id}-label)`} />
  </svg>
}
