import { profile } from '../data/portfolio'

// Reader header mark, set in the same label grammar as the desk intro: play box, condensed name, small role.
export default function BrandMark({ onHome }) {
  return <div className="brand-mark reader-brand">
    <button className="reader-wordmark" onClick={onHome} aria-label="CHANG BIN · 책상 홈으로 돌아가기">
      <span className="reader-mark-play" aria-hidden="true"><i /></span>
      <span className="reader-mark-name">{profile.englishName}</span>
    </button>
    <span className="reader-brand-role">{profile.role}</span>
  </div>
}
