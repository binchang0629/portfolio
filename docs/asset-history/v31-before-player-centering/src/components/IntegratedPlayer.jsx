import { useId } from 'react'
import { assets } from '../assets'
import { coherentPlayer as geometry } from '../assets/player/coherent-geometry'
import CassetteSurface from './CassetteSurface'
import { topviewCassette } from '../assets/cassette/topview-geometry'

export default function IntegratedPlayer({ track, angles, progress }) {
  const prefix = useId().replaceAll(':', '')
  const loaded = Boolean(track)
  return <svg className="player-shell integrated-player" viewBox={geometry.viewBox} role="img" aria-label={loaded ? `${track.title} 테이프가 들어간 흰색 카세트 플레이어` : '흰색 휴대용 카세트 플레이어'} data-camera="player-v1">
    <defs>
      <clipPath id={`${prefix}-body`}><path d={geometry.body} /></clipPath>
      <clipPath id={`${prefix}-cassette`}><path d={geometry.cassette} /></clipPath>
      <clipPath id={`${prefix}-empty`}><path d={geometry.emptyBay} /></clipPath>
    </defs>
    <image href={assets.player.render} width={geometry.width} height={geometry.height} clipPath={`url(#${prefix}-body)`} />
    {!loaded && <image href={assets.player.empty} width={geometry.width} height={geometry.height} clipPath={`url(#${prefix}-empty)`} />}
    {loaded && <g clipPath={`url(#${prefix}-cassette)`} data-part="inserted-cassette"><g transform={`translate(${topviewCassette.insertion.x} ${topviewCassette.insertion.y}) scale(${topviewCassette.insertion.scale})`}><CassetteSurface track={track} angles={angles} progress={progress} /></g></g>}
  </svg>
}
