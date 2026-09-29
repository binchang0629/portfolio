import { topviewCassette as geometry } from '../assets/cassette/topview-geometry'
import CassetteSurface from './CassetteSurface'

export default function Cassette({ track, angles, progress }) {
  return <svg className="cassette-art" viewBox={geometry.viewBox} role="img" aria-label={`${track.number} ${track.title} 카세트`} data-camera="orthographic-topview-v1">
    <CassetteSurface track={track} angles={angles} progress={progress} />
  </svg>
}
