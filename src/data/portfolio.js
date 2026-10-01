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

export const notes = {
  id: 'notes', kind: 'notes', eyebrow: 'WORK NOTES', heading: '작업 기록',
  summary: '각 프로젝트에서 다뤘던 문제와 수정할 부분을 모았습니다.',
  entries: [
    { project: '코레일', label: '예매 흐름', body: '설문과 인터뷰에서 매진 정보, 비회원 예매 진입, 좌석 선택의 불편을 찾았습니다. 이 문제들을 예매 화면과 연결해 정리하고 있습니다.', target: personalProjects[0] },
    { project: '반려식물 웹앱', label: '기획 방향', body: '초기의 게임형 아이디어에서 식물 상태와 관리 경험을 기록하는 방향으로 바뀌었습니다. 상태 확인 → 행동 선택 → 결과 기록이 핵심 흐름입니다.', target: personalProjects[1] },
    { project: '왈가왈BOT', label: '발표 피드백', body: '서비스를 언제 쓰는지와 차별점이 잘 전달되지 않는다는 피드백을 받았습니다. 서로 다른 판단의 이유를 비교하는 경험을 중심으로 내용을 정리했습니다.', target: projects[1] },
    { project: '국순당', label: '협업', body: '초반에는 소통이 늦어 진행에 어려움이 있었습니다. 후반에 소통이 활발해지면서 작업 속도가 붙었습니다. 모바일과 페이지 간 디자인 통일은 보완할 부분입니다.', target: projects[0] },
  ],
}

export const memo = {
  id: 'memo', kind: 'memo', eyebrow: 'TO DO', heading: '남은 작업',
  summary: '지금 작업 중인 것들입니다.',
  checklist: [
    { label: '코레일 리디자인', detail: '조사에서 찾은 문제와 바뀐 예매 화면을 함께 정리하기', state: '작업 중' },
    { label: '반려식물 웹앱', detail: '상태 확인부터 결과 기록까지 핵심 화면 연결하기', state: '작업 중' },
    { label: '포트폴리오', detail: '프로젝트 화면, 담당 작업, 수정 과정을 추가하기', state: '작업 중' },
  ],
}

export const archiveTracks = []
