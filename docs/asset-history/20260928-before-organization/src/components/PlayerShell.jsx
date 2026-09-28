import { useId } from 'react'

export default function PlayerShell() {
  const id = useId().replaceAll(':', '')
  return <svg className="player-shell" viewBox="570 330 410 285" role="img" aria-label="흰색 휴대용 카세트 플레이어">
    <defs><clipPath id={id}><path d="M605 360Q589 360 589 382L584 563Q580 594 613 598L935 599Q965 595 965 570L961 384Q958 360 938 360L938 344L915 343L908 356L881 356L881 346L850 345L848 356Z" /></clipPath><linearGradient id={`${id}-label`} x2="0" y2="1"><stop stopColor="#f4f3f0" /><stop offset="1" stopColor="#e8e7e5" /></linearGradient></defs>
    <image href="/assets/desk/source-v2.png" width="1536" height="1024" clipPath={`url(#${id})`} />
    <rect x="613" y="377" width="276" height="27" rx="4" fill={`url(#${id}-label)`} />
  </svg>
}
