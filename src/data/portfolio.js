import { personalProjects, projects } from './projects'

export const profile = {
  name: '정창빈', englishName: 'CHANG BIN', role: 'UI/UX DESIGNER',
  intro: '화면을 디자인하고 직접 구현합니다.',
  tools: ['Figma', 'Photoshop', 'HTML', 'CSS', 'JavaScript', 'React'],
}

export const tracks = [
  { id: 'about', number: '01', title: 'ABOUT ME', subtitle: 'Who I am.', tint: 0, x: 218, y: 288, rotate: -12,
    eyebrow: '01 / ABOUT ME', heading: '정창빈',
    summary: 'UI/UX 디자인을 공부하고 있습니다. Figma로 설계한 화면을 HTML, CSS, JavaScript, React로 구현하는 작업도 함께 하고 있습니다.',
    facts: [{ label: '분야', value: 'UI/UX 디자인 · 웹 화면 구현' }, { label: '사용 도구', value: profile.tools.join(', ') }],
    sections: [
      { title: '지금 하고 있는 작업', body: '팀 프로젝트로 국순당 웹사이트와 왈가왈BOT에 참여했습니다. 개인 작업은 코레일 홈페이지 리디자인과 반려식물 관리 웹앱입니다. 두 개인 프로젝트는 아직 작업 중입니다.' },
      { title: '교육', items: ['나사렛대학교 IT인공지능학부 · 2020.03 입학', '이젠아카데미DX교육센터 · AI 활용 UXUI 디자인 & 웹기획 프론트엔드 과정 · 2026.04–2026.10'] },
      { title: '이전 경험', body: '하나시스주식회사에서 제조 및 기계관리 업무를 담당했습니다. (2022.04–2024.06)' },
      { title: '그 외', items: ['이젠아카데미DX교육센터 우수상 · 2026', '일본어 일상회화 가능'] },
    ],
  },
  { id: 'team', number: '02', title: 'TEAM PLAY', subtitle: 'Better together.', tint: 88, x: 709, y: 129, rotate: 10,
    eyebrow: '02 / TEAM PLAY', heading: '팀 프로젝트',
    summary: '국순당 웹사이트 리디자인에는 서브팀장으로, 왈가왈BOT 신규 웹앱 제작에는 개발 팀장으로 참여했습니다.',
    projects,
  },
  { id: 'design', number: '03', title: 'DESIGN', subtitle: 'Ideas into experience.', tint: -65, x: 1077, y: 360, rotate: 16,
    eyebrow: '03 / DESIGN', heading: '개인 프로젝트',
    summary: '코레일 홈페이지를 리디자인하고, 반려식물 관리 모바일 웹앱을 새롭게 만들고 있습니다.',
    projects: personalProjects,
  },
  { id: 'branding', number: '04', title: 'BRANDING', subtitle: 'A side of me.', tint: 35, x: 425, y: 695, rotate: 8,
    eyebrow: '04 / BRANDING', heading: '이 포트폴리오를 만든 과정',
    summary: '카세트에 프로젝트를 담고, 플레이어로 선택해 보는 개인 웹사이트입니다.',
    facts: [{ label: '작업', value: '개인 포트폴리오 · 제작 중' }, { label: '구현', value: 'Vite · React · JavaScript · CSS' }],
    sections: [
      { title: '카세트를 고른 이유', body: '소개와 작업을 다섯 개의 테이프로 나눴습니다. 테이프를 끌어 넣거나 클릭해 선택한 뒤 재생하면 해당 내용을 볼 수 있습니다.' },
      { title: '수정한 부분', items: ['사물마다 달랐던 시점을 플레이어 기준으로 맞췄습니다.', '테이프 크기와 삽입 위치를 같은 기준으로 계산했습니다.', '릴과 테이프 띠를 분리해 재생·빨리 감기·되감기 상태를 표현했습니다.', '보관함에 놓을 칸을 미리 보여 주고, 꺼낸 뒤에는 빈 케이스가 남도록 했습니다.'] },
      { title: '이미지와 직접 구현한 부분', body: '사물 이미지를 만드는 데 AI를 사용했습니다. 콘텐츠 구성, 배치, 문구를 정리하고 React와 CSS로 드래그, 보관, 재생 상태와 상세 화면을 구현하고 있습니다. 이미지의 원근과 카세트 구조는 여러 차례 수정했습니다.' },
      { title: '남은 작업', body: '프로젝트별 실제 화면과 전후 비교를 추가하고, 모바일에서 콘텐츠를 읽고 이동하는 흐름을 더 다듬을 예정입니다.' },
    ],
  },
  { id: 'next', number: '05', title: 'NEXT TRACK', subtitle: 'Still writing.', tint: 185, x: 853, y: 694, rotate: -10,
    eyebrow: '05 / NEXT TRACK', heading: '다음 작업',
    summary: '진행 중인 개인 작업과 이 포트폴리오를 마무리하고 있습니다.',
    checklist: [
      { label: '코레일 리디자인', detail: '조사에서 찾은 문제와 바뀐 예매 화면을 함께 정리하기', state: '작업 중' },
      { label: '반려식물 웹앱', detail: '상태 확인부터 결과 기록까지 핵심 화면 연결하기', state: '작업 중' },
      { label: '포트폴리오', detail: '프로젝트 화면, 담당 작업, 수정 과정을 추가하기', state: '작업 중' },
    ],
    contact: true,
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
  checklist: tracks[4].checklist,
}

export const archiveTracks = []
