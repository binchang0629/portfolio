// 새 프로젝트 케이스 스터디를 만들 때 이 파일을 복사해 이름을 바꾸고 내용만 채우세요.
// 그다음 src/data/projects.js에서 불러와 프로젝트 항목에 펼쳐 넣습니다: { id: '...', ...newCase }
//
// 공통 필드 (모든 섹션)
//   type    'lead' | 'cards' | 'match' | 'annotated' | 'compare'  — 레이아웃 A~E
//   label   트랙 목록에 보일 짧은 이름 (예: '문제 발견')
//   title   결론 문장. 항목 이름('사용자 조사')이 아니라 알게 된 것('사람들은 맛으로 고릅니다')
//   body    본문 한두 문단
//   status  'intent'(설계 의도) | 'verified'(확인된 결과) | 'unverified'(검증 전) — 생략 가능
//   source  근거의 출처 — 생략 가능
//   hidden  true면 화면에서 숨김. 해당 과정이 없던 프로젝트는 지우지 말고 숨겨 두세요
//
// 이미지: { src: '/cases/<id>/screen.webp', w: 1600, h: 900, alt, caption }  — 파일은 public/cases/<id>/에 둡니다.
//   src가 비어 있으면 alt 문구가 들어간 자리 표시가 보입니다. w, h는 원본 크기(레이아웃 흔들림 방지).
// 아직 모르는 내용은 '[실제 결과 입력]'처럼 대괄호로 적으면 점선 자리 표시로 보입니다.
// 조사 수치·인터뷰·테스트 결과는 실제로 한 것만 적습니다.
export default {
  period: '[기간 입력]',
  sections: [
    // A 대표 이미지형 — 한 장의 이미지로 설명되는 섹션 (개요, 역할, 최종 화면, 회고)
    { type: 'lead', label: '[짧은 이름]', title: '[제목 입력]', body: '[본문 입력]', image: { src: '', alt: '[대표 이미지]', caption: '[주석 입력]' } },

    // B 근거 카드형 — 조사 결과, 문제 목록, 페르소나. value는 큰 숫자, kicker는 작은 머리말
    { type: 'cards', label: '[짧은 이름]', title: '[제목 입력]', body: '[본문 입력]', source: '[출처 입력]',
      cards: [{ value: '[수치]', title: '[카드 제목]', body: '[카드 본문]' }, { kicker: '[머리말]', title: '[카드 제목]', body: '[카드 본문]', highlight: true }],
      image: { src: '', alt: '[근거 이미지]' } },

    // C 문제·해결 연결형 — 발견한 문제와 설계 판단, 받은 피드백과 반영한 내용
    { type: 'match', label: '[짧은 이름]', title: '[제목 입력]', status: 'intent', columns: ['발견한 문제', '설계 판단'],
      rows: [{ problem: '[문제 입력]', decision: '[판단 입력]' }] },

    // D 화면 주석형 — 핵심 기능 화면. x, y는 이미지 왼쪽 위 기준 퍼센트(0~100)
    // 핵심 기능이 여러 개면 이 섹션을 복사해 반복하세요
    { type: 'annotated', label: '핵심 기능', title: '[제목 입력]', body: '[본문 입력]', status: 'intent',
      image: { src: '', alt: '[기능 화면]', caption: '[주석 입력]' },
      notes: [{ x: 30, y: 40, title: '[주석 제목]', body: '[주석 설명]' }] },

    // E 과정·비교형 — 전후 비교, 단계별 과정. 두 장이면 나란히, 한 장이면 넓게
    { type: 'compare', label: '[짧은 이름]', title: '[제목 입력]', body: '[본문 입력]',
      steps: [{ label: 'BEFORE', image: { src: '', alt: '[이전 화면]' }, caption: '[주석 입력]' }, { label: 'AFTER', image: { src: '', alt: '[이후 화면]' }, caption: '[주석 입력]' }] },

    // 결과 — 확인된 결과와 의도를 섞지 마세요
    { type: 'cards', label: '결과와 한계', title: '[제목 입력]', status: 'verified',
      cards: [{ kicker: '확인된 것', title: '[실제 결과 입력]' }, { kicker: '검증 전', title: '[검증하지 못한 것]' }] },

    // AI를 쓴 프로젝트에서만 hidden을 지우세요
    { type: 'cards', label: 'AI 활용', hidden: true, title: '[제목 입력]', body: '[본문 입력]', cards: [{ title: '[사용한 도구]', body: '[프롬프트와 수정 과정]' }] },
  ],
}
