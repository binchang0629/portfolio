import { personalProjects, projects } from './projects'

export const profile = {
  name: '정창빈', englishName: 'CHANG BIN', role: 'UI/UX DESIGNER',
  intro: '사용자의 불편을 발견하고, 화면과 인터랙션으로 풀어갑니다.',
  email: 'jcb0629@gmail.com',
  tools: ['Figma', 'Photoshop', 'HTML', 'CSS', 'JavaScript', 'React'],
}

export const tracks = [
  { id: 'about', number: '01', title: 'ABOUT ME', subtitle: 'Who I am.', tint: 0, winding: .28, x: 410, y: 185, rotate: -12,
    eyebrow: 'MY SIDE A', heading: '사용자 경험을 화면으로 구현하는 디자이너',
    summary: '안녕하세요, 정창빈입니다. 보기 좋은 화면을 넘어, 사용자가 어디에서 불편을 느끼는지 이해하고 해결하는 디자인을 지향합니다.',
    tags: ['사용자 중심', 'UI/UX 설계', '프론트엔드 이해'],
    sections: [
      { title: '디자인과 구현을 연결합니다', body: '나사렛대학교 IT인공지능학부에서 공부하며 UI/UX를 접했습니다. 사용자 조사, 문제 정의, 와이어프레임과 UI 디자인을 경험하고 HTML, CSS, JavaScript, React로 화면이 실제 서비스에서 동작하는 과정을 배우고 있습니다.' },
      { title: '경험의 기록', items: ['나사렛대학교 IT인공지능학부 재학 · 2020.03–2026.09 이력서 기재 기준', '하나시스주식회사 · 제조 및 기계관리 · 2022.04–2024.06', '이젠아카데미DX교육센터 · AI 활용 UXUI 디자인 & 웹기획 프론트엔드 부트캠프 · 2026.04–2026.10', '이젠아카데미DX교육센터 우수상 · 2026년', '일본어 일상회화 가능'] },
      { title: '함께 일하는 태도', body: '사용자 흐름을 따라가며 개선할 부분을 먼저 찾으려 노력합니다. 결과물을 만든 뒤 피드백을 받아 가독성, 정보의 우선순위와 화면 구조를 반복해서 개선합니다.' },
    ],
  },
  { id: 'team', number: '02', title: 'TEAM PLAY', subtitle: 'Better together.', tint: 88, winding: .62, x: 830, y: 170, rotate: 10,
    eyebrow: 'PROJECT / TEAM', heading: '함께 설계하고, 구현하고, 개선한 경험',
    summary: '국순당에서는 서브팀장으로, 왈가왈BOT에서는 개발 팀장으로 참여했습니다. 두 프로젝트에서 팀이 만든 경험과 제가 담당한 작업을 구분해 소개합니다.',
    tags: ['국순당', '왈가왈BOT', '협업과 구현'],
    projects,
    sections: [
      { title: '협업에서 쌓은 기준', body: '작업의 어려움을 일찍 공유하고, 화면을 합친 뒤에도 사용자 흐름과 반응형을 다시 확인하는 것이 중요하다는 것을 배웠습니다.' },
    ],
  },
  { id: 'design', number: '03', title: 'DESIGN', subtitle: 'Ideas into experience.', tint: -65, winding: .4, x: 1120, y: 390, rotate: 16,
    eyebrow: 'PERSONAL / IN PROGRESS', heading: '다음 화면을 만들고 있습니다.',
    summary: '코레일 홈페이지 리디자인과 반려식물 관리 모바일 웹앱을 작업하고 있습니다. 문제를 발견하고 설계한 과정을 함께 정리합니다.',
    tags: ['코레일 리디자인', '반려식물 웹앱', '작업 중'],
    projects: personalProjects,
    sections: [
      { title: '진행 중인 작업', body: '두 프로젝트 모두 작업 중입니다. 실제 설계 자료와 직접 만든 화면을 확인하며 내용을 보완하고 있습니다.' },
    ],
  },
  { id: 'branding', number: '04', title: 'BRANDING', subtitle: 'A side of me.', tint: 35, winding: .76, x: 515, y: 700, rotate: 8,
    eyebrow: 'PERSONAL / BRANDING', heading: '경험을 재생하는 나의 책상',
    summary: '서로 다른 경험을 담은 테이프를 골라 재생하면, 지금의 나를 만나는 개인 브랜딩 포트폴리오입니다.',
    tags: ['개인 브랜딩', '인터랙션 설계', 'React'],
    sections: [
      { title: '하나의 비유, 다섯 가지 이야기', body: '소개, 협업, 디자인, 브랜딩, 앞으로의 목표를 다섯 개의 카세트에 담았습니다. 테이프를 고르고 플레이어에 넣는 동작이 콘텐츠 선택과 연결됩니다.' },
      { title: '사물에서 인터페이스로', body: '파스텔 톤의 책상과 흰 플레이어를 바탕으로 경험별 색을 부여했습니다. 읽을 수 있는 실제 글자와 분리된 카세트 부품을 사용해 선택과 재생 상태를 표현합니다.' },
      { title: '만드는 과정', body: 'Figma로 화면과 인터랙션을 설계하고, AI 보조 렌더 에셋의 구조와 디테일을 검토했습니다. React, JavaScript와 CSS로 선택·이동·삽입 동작을 구현하며 디자인을 보완하고 있습니다.' },
    ],
  },
  { id: 'next', number: '05', title: 'NEXT TRACK', subtitle: 'Still writing.', tint: 185, winding: .18, x: 865, y: 675, rotate: 0,
    eyebrow: 'NEXT / CONTACT', heading: '디자인과 개발 사이를 연결하며',
    summary: '사용자의 문제를 발견하고 화면을 설계하는 일에서, 실제 구현 과정까지 이해하는 디자이너로 성장하고 싶습니다.',
    tags: ['꾸준한 개선', '구현 이해', '함께 성장'],
    sections: [
      { title: '다음에 쌓을 경험', body: '사용자 중심의 UI 설계 능력을 발전시키고, 프론트엔드 기술에 대한 이해를 꾸준히 높이겠습니다. 개발자와 원활하게 소통하며 실제 서비스에서도 안정적으로 동작하는 결과물을 만드는 것이 목표입니다.' },
      { title: '계속 배우는 도구', items: profile.tools },
      { title: '연락하기', body: '함께 이야기하고 작업할 기회를 기다립니다.', email: profile.email },
    ],
  },
]

export const notes = {
  title: '작업 노트', eyebrow: 'DESIGN NOTES',
  summary: '화면보다 먼저 사용자의 흐름을 살펴봅니다.',
  sections: [
    { title: '01 · 관찰', body: '설문조사와 인터뷰로 실제 불편을 확인합니다.' },
    { title: '02 · 정의', body: '페르소나와 사용자 여정으로 문제와 우선순위를 정리합니다.' },
    { title: '03 · 설계', body: '와이어프레임에서 UI와 인터랙션으로 구체화합니다.' },
    { title: '04 · 개선', body: '팀원의 의견과 피드백을 바탕으로 화면을 수정하고, 구현하며 다시 확인합니다.' },
  ],
}

// Additional, finished project stories go here. The five category tapes stay separate.
export const archiveTracks = []
