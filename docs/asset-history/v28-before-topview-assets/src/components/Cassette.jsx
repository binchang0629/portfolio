import { coherentPlayer as geometry } from '../assets/player/coherent-geometry'
import CassetteSurface from './CassetteSurface'

export default function Cassette({ track, angles, progress }) {
  return <svg className="cassette-art" viewBox={geometry.cassetteViewBox} role="img" aria-label={`${track.number} ${track.title} 카세트`} data-camera="player-v1">
    <CassetteSurface track={track} angles={angles} progress={progress} standalone />
  </svg>
}
