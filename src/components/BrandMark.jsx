import { profile } from '../data/portfolio'

export default function BrandMark({ onHome, reader = false }) {
  return <div className={`brand-mark${reader ? ' reader-brand' : ''}`}>
    <button className={`brand-name ${reader ? 'reader-wordmark' : 'wordmark'}`} onClick={onHome} aria-label="CHANG BIN · 책상 홈으로 돌아가기">{profile.englishName}</button>
    <span className={`brand-role${reader ? ' reader-brand-role' : ''}`}>{profile.role}</span>
  </div>
}
