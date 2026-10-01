import { personalProjects, projects } from './projects'
import brandingCase from './cases/branding'

export const profile = {
  name: '정창빈', englishName: 'CHANG BIN', role: 'UI/UX DESIGNER',
  // Desk label, set like a blank cassette's printed label. Its stripe repeats the desk tapes' accent colours.
  label: { number: 'HOME', spec: 'UX-60 · 2026', tagline: 'UI/UX DESIGNER · FIGMA → REACT', guide: '테이프를 골라 재생하면 제 이야기가 시작됩니다.' },
  tools: ['Figma', 'Photoshop', 'HTML', 'CSS', 'JavaScript', 'React'],
}

const projectTape = (project, tape) => ({ ...project, ...tape, eyebrow: `${tape.number} / ${tape.title}` })

export const tracks = [
  { id: 'about', number: '01', title: 'ABOUT ME', subtitle: 'Who I am.', tint: 0, caseColor: '#bdd6ec', accent: '#6f93c9', x: 516, y: 146, rotate: -8,
    eyebrow: '01 / ABOUT ME', heading: '정창빈',
    summary: 'UI/UX 디자인을 공부하고 있습니다. Figma로 설계한 화면을 HTML, CSS, JavaScript, React로 구현하는 작업도 함께 하고 있습니다.',
    facts: [{ label: '분야', value: 'UI/UX 디자인 · 웹 화면 구현' }, { label: '사용 도구', value: profile.tools.join(', ') }],
    sections: [
      { title: '지금 하고 있는 작업', body: '팀 프로젝트로 국순당 웹사이트와 왈가왈BOT에 참여했습니다. 개인 작업은 코레일 홈페이지 리디자인과 반려식물 관리 웹앱입니다. 두 개인 프로젝트는 아직 작업 중입니다.' },
      { title: '일하는 방식', items: [
        '조사에서 시작합니다. 국순당은 설문 2건(16명), 왈가왈BOT은 팀 설문 33명의 응답으로 문제를 정했습니다.',
        '설계한 화면을 직접 구현합니다. Figma에서 만든 화면을 React와 CSS로 옮기고, 화면 QA와 반응형 보정까지 맡았습니다.',
        '피드백을 받으면 다시 고칩니다. 이 포트폴리오도 수업 피드백을 받아 넣는 곳 안내, 재생 버튼, 줄바꿈을 고쳤습니다.',
        'AI는 도구로 씁니다. 이미지 생성과 코딩 도구를 쓰고, 무엇을 남기고 고칠지는 화면을 보며 직접 정합니다.',
      ] },
      { title: '사용 가능한 스킬', items: [
        'UX 리서치 · 설문 설계와 문항 수정, 인터뷰, 퍼소나, 린 캔버스',
        'Figma · 와이어프레임, 화면 설계, 디자인 시안',
        'HTML · CSS · JavaScript · React · 디자인한 화면을 직접 구현하고 반응형으로 보정',
        'Git · GitHub · Vercel · 브랜치 병합과 기능 통합, 배포',
        'Photoshop · 이미지 편집',
        'AI 도구 · 이미지 생성과 코딩 도구를 쓰고, 결과는 직접 확인하고 고르기',
      ] },
      { title: '교육', items: ['나사렛대학교 IT인공지능학부 · 2020.03 입학', '이젠아카데미DX교육센터 · AI 활용 UXUI 디자인 & 웹기획 프론트엔드 과정 · 2026.04–2026.10'] },
      { title: '이전 경험', body: '하나시스주식회사에서 제조 및 기계관리 업무를 담당했습니다. (2022.04–2024.06)' },
      { title: '그 외', items: ['이젠아카데미DX교육센터 우수상 · 2026', '일본어 일상회화 가능'] },
    ],
  },
  // Each project is its own tape: pressing it plays that project directly.
  projectTape(projects[0], { number: '02', title: 'KOOKSOONDANG', subtitle: 'Global site redesign.', tint: 175, shellSaturation: 1.1, caseColor: '#f7c7a7', accent: '#F29556', sticker: 'team', x: 896, y: 141, rotate: 10 }),
  projectTape(projects[1], { number: '03', title: 'WALGAWAL BOT', subtitle: 'Judge it together.', tint: 25, shellSaturation: 1, shellBrightness: 1.08, caseColor: '#cbd0ff', accent: '#374BFF', sticker: 'team', x: 1061, y: 394, rotate: 16 }),
  projectTape(personalProjects[0], { number: '04', title: 'KORAIL', subtitle: 'Booking, redesigned.', tint: 4, shellSaturation: 1.7, shellBrightness: .68, caseColor: '#7182db', accent: '#255EFF', sticker: 'design', x: 473, y: 694, rotate: 8 }),
  projectTape(personalProjects[1], { number: '05', title: 'PLANT CARE', subtitle: 'Grow with records.', tint: -110, shellSaturation: .8, shellBrightness: .78, caseColor: '#d7e9b9', accent: '#384E2F', sticker: 'next', x: 890, y: 671, rotate: -10 }),
  // Starts in the archive; x/y is where it lands when taken out.
  { id: 'branding', number: '06', title: 'BRANDING', subtitle: 'A side of me.', tint: 35, caseColor: '#d2c8e8', accent: '#9a86c9', stored: true, x: 170, y: 330, rotate: -6,
    eyebrow: '06 / BRANDING', heading: '이 포트폴리오를 만든 과정',
    summary: '프로젝트를 카세트에 담고, 플레이어에 넣어 재생해 보는 개인 포트폴리오 웹사이트입니다. 처음 컨셉 이미지에서 지금의 책상까지 만든 과정을 정리했습니다.',
    facts: [{ label: '작업', value: '개인 포트폴리오 · 제작 중' }, { label: '구현', value: 'Vite · React · JavaScript · CSS' }],
    ...brandingCase,
  },
]

// Home notebook. Each record: what got in the way (problem), what changed (change), and later what I felt (learned).
// learned stays empty until I write it myself; the notebook hides an empty line.
export const notes = {
  id: 'notes', kind: 'notes', eyebrow: 'WORK NOTES', heading: '작업 기록',
  summary: '프로젝트마다 부딪힌 문제와 바꾼 것을 모았습니다.',
  entries: [
    { project: '이 포트폴리오', label: '수업 피드백', target: { id: 'branding' },
      problem: '테이프를 어디에 넣고, 넣은 뒤 무엇을 눌러야 할지 모르겠다는 피드백을 받았습니다. 상세 페이지는 글이 중간에서 잘려 AI가 만든 것 같다는 말도 들었습니다.',
      change: '빈 플레이어의 뚜껑이 들썩이고, 테이프를 넣으면 재생 키에 빛이 돌게 했습니다. 상세 페이지는 색 띠로 다시 짜고, 문장 단위로 줄을 나누는 규칙을 만들었습니다.',
      learned: '' },
    { project: '코레일', label: '예매 흐름', target: personalProjects[0],
      problem: '설문과 인터뷰에서 매진 정보, 비회원 예매 진입, 좌석 선택의 불편을 찾았습니다.',
      change: '빠른 예매를 1순위 가설로 두고, 메인 예매 칸을 출발역·도착역·날짜·인원 네 가지로 줄였습니다. 예매 화면에는 매진 열차 숨김과 적용 가능한 할인을 넣고 있습니다.',
      learned: '' },
    { project: 'Planty', label: '방향 전환', target: personalProjects[1],
      problem: '처음에는 실제 식물과 앱 속 식물을 함께 키우는 게임형 아이디어였습니다. 첫 화면도 AI로 빠르게 만든 초안이었습니다.',
      change: '식물 상태를 확인하고 비슷한 경험과 견주는 방향으로 바꿨습니다. AI 초안은 사진으로 고르는 보기와 상태 설명을 더해 직접 다듬었습니다.',
      learned: '' },
    { project: '왈가왈BOT', label: '발표 피드백', target: projects[1],
      problem: '서비스를 언제 쓰는지와 차별점이 잘 전달되지 않는다는 피드백을 받았습니다.',
      change: '서로 다른 판단의 이유를 비교하는 경험을 중심으로 내용을 다시 정리했습니다.',
      learned: '' },
    { project: '국순당', label: '협업', target: projects[0],
      problem: '초반에는 소통이 늦어 진행에 어려움이 있었습니다.',
      change: '후반에 소통이 활발해지면서 작업 속도가 붙었습니다. 모바일과 페이지 간 디자인 통일은 보완할 부분으로 남았습니다.',
      learned: '' },
  ],
}

// state: 'done' | 'doing' | 'next'
export const memo = {
  id: 'memo', kind: 'memo', eyebrow: 'TO DO', heading: '앞으로의 목표',
  summary: '끝낸 것과 하고 있는 것, 다음에 할 것.',
  checklist: [
    { label: '프로젝트 상세 페이지', detail: '네 프로젝트와 이 포트폴리오의 과정을 색 띠 페이지로 정리하기', state: 'done' },
    { label: '수업 피드백 반영', detail: '넣는 곳 안내, 재생 키, 줄바꿈, 줄간격 고치기', state: 'done' },
    { label: '연락하기', detail: '편지 모양 폼으로 메일을 받을 수 있게 연결하기', state: 'done' },
    { label: '코레일 리디자인', detail: '최종 시안을 정하고, 비회원 예매와 모바일 화면 설계하기', state: 'doing' },
    { label: 'Planty', detail: '결과 기록 흐름과 Community · Journal 탭 설계하기', state: 'doing' },
    { label: '사용자에게 확인하기', detail: '두 개인 프로젝트의 가설을 실제 사용자에게 확인하기', state: 'next' },
    { label: '모바일 흐름', detail: '작은 화면에서 테이프를 고르고 읽는 과정 다듬기', state: 'next' },
  ],
}

export const archiveTracks = []
