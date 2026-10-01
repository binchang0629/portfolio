import kooksoondangCase from './cases/kooksoondang'
import walgawalbotCase from './cases/walgawalbot'

export const personalProjects = [
  { id: 'korail', kind: 'project', eyebrow: 'PERSONAL / 01', heading: '코레일 홈페이지 리디자인', role: '개인 프로젝트 · 웹사이트 리디자인', state: '작업 중',
    summary: '열차를 예매할 때 겪는 불편을 조사하고, 예매 화면을 다시 설계하는 작업입니다.',
    facts: [{ label: '유형', value: '웹사이트 리디자인' }, { label: '진행', value: '사용자 조사 · 페르소나 · 사용자 여정 · 와이어프레임' }],
    sections: [
      { title: '조사에서 찾은 문제', items: ['열차와 좌석의 매진 정보를 이해하기 어렵다.', '비회원 예매를 어디서 시작해야 하는지 찾기 어렵다.', '좌석 선택 과정이 불편하다.'] },
      { title: '진행한 작업', body: '설문조사와 인터뷰를 진행했습니다. 발견한 문제를 바탕으로 페르소나, 사용자 여정, 와이어프레임을 만들었습니다.' },
      { title: '다음 작업', body: '조사 내용과 실제로 바뀐 화면을 함께 정리하고 있습니다. 완성한 화면과 구현 범위는 이후 추가할 예정입니다.' },
    ],
  },
  { id: 'plant-care', kind: 'project', eyebrow: 'PERSONAL / 02', heading: '반려식물 관리 모바일 웹앱', role: '개인 프로젝트 · 신규 웹앱 제작', state: '작업 중',
    summary: '식물의 상태를 살펴보고, 비슷한 환경에서 키운 사람들의 기록을 참고하는 모바일 웹앱입니다.',
    facts: [{ label: '유형', value: '신규 모바일 웹앱 기획·설계' }, { label: '진행', value: '기획 · 핵심 화면 설계' }],
    sections: [
      { title: '출발점', body: '물주기 일정만으로는 지금 물이 필요한지 판단하기 어렵다고 보았습니다. 같은 식물이라도 빛과 계절, 실내 환경이 다르기 때문에 현재 상태를 먼저 확인하도록 구성했습니다.' },
      { title: '화면 흐름', flow: ['식물 선택', '상태 확인', '비슷한 경험', '행동 선택', '결과 기록'] },
      { title: '설계한 화면', body: '홈, 내 식물, 식물 상세, 상태 확인, 비슷한 경험, 행동 선택, 결과 기록 화면을 설계했습니다. 관리 전후의 변화를 기록하고 다음 관리 때 참고하는 흐름입니다.' },
      { title: '남은 부분', body: '핵심 흐름을 연결하고 기록 부담과 사례 비교 기준을 확인해야 합니다. 포인트와 상점은 확장 기능으로 계획한 단계입니다.' },
      { title: '자료', link: 'https://www.figma.com/design/WW3bdlwtel1WXeNpVPiRlv?node-id=59-114', linkLabel: 'Figma 화면 보기' },
    ],
  },
]

export const projects = [
  { id: 'kooksoondang', site: 'https://kooksoondang-k1iilin9n-binchang0629.vercel.app/', deck: 'https://www.figma.com/slides/9TAEi7HeQYv6TCNPN3TenX', kind: 'project', eyebrow: 'TEAM / 01', heading: '국순당 글로벌 웹사이트 리디자인', role: '팀 프로젝트 · 리디자인 · 서브팀장',
    preview: { kind: 'web', video: '/projects/kooksoondang/preview.mp4', poster: '/projects/kooksoondang/poster.webp', caption: '인트로 영상 → 연령 확인 → 취향 테스트 첫 화면' },
    summary: '기존 국순당 웹사이트를 리디자인했습니다. 전통주에 익숙하지 않은 해외 사용자가 제품의 맛과 음식 조합을 알아보도록 구성했습니다.',
    facts: [{ label: '프로젝트', value: '기존 웹사이트 리디자인' }, { label: '내 역할', value: '서브팀장 · 기획·디자인·개발 참여' }, { label: '담당 페이지', value: 'Pairing 디자인·구현 · Products 구현' }],
    ...kooksoondangCase,
  },
  { id: 'walgawalbot', site: 'https://walgawal-bot.vercel.app/onboarding', deck: 'https://www.figma.com/design/5msPuamjPpGJOUFl0OXBOX/?node-id=3294-5477', kind: 'project', eyebrow: 'TEAM / 02', heading: '왈가왈BOT', role: '팀 프로젝트 · 신규 웹앱 제작 · 개발 팀장',
    preview: { kind: 'mobile', video: '/projects/walgawalbot/preview.mp4', poster: '/projects/walgawalbot/poster.webp', caption: '스플래시 → 온보딩 → 홈 → 밸런스 게임 → 막상막하 → 후일담 편지' },
    summary: '새롭게 기획하고 제작한 커뮤니티 웹앱입니다. 일상 갈등에 대한 AI의 참고 의견과 사람들의 판단을 비교하고, 이후 이야기를 기록합니다.',
    facts: [{ label: '프로젝트', value: '신규 커뮤니티 웹앱 제작' }, { label: '내 역할', value: '개발 팀장' }, { label: '담당 화면', value: '홈 · 배심원 광장 · 후일담' }, { label: '구현 범위', value: '시나리오 기반 발표용 UI' }],
    ...walgawalbotCase,
  },
]
