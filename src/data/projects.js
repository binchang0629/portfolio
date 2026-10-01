import kooksoondangCase from './cases/kooksoondang'
import walgawalbotCase from './cases/walgawalbot'
import plantCareCase from './cases/plant-care'
import korailCase from './cases/korail'

export const personalProjects = [
  { id: 'korail', kind: 'project', eyebrow: 'PERSONAL / 01', heading: '코레일 홈페이지 리디자인', role: '개인 프로젝트 · 웹사이트 리디자인', state: '작업 중',
    summary: '열차를 예매할 때 겪는 불편을 조사하고, 예매 화면을 다시 설계하는 작업입니다. 디자인은 아직 최종안이 아닌 작업 중 시안입니다.',
    facts: [{ label: '유형', value: '웹사이트 리디자인' }, { label: '진행', value: '사용자 조사 · 페르소나 · 와이어프레임 · 디자인 시안' }],
    ...korailCase,
  },
  { id: 'plant-care', kind: 'project', eyebrow: 'PERSONAL / 02', heading: '반려식물 관리 모바일 웹앱', role: '개인 프로젝트 · 신규 웹앱 제작', state: '작업 중',
    summary: '식물의 상태를 직접 살펴보고, 비슷한 환경에서 키운 사람들의 경험을 참고하는 모바일 웹앱 Planty입니다.',
    facts: [{ label: '유형', value: '신규 모바일 웹앱 기획·설계' }, { label: '진행', value: '기획 · 핵심 화면 설계' }],
    ...plantCareCase,
  },
]

export const projects = [
  { id: 'kooksoondang', site: 'https://kooksoondang-k1iilin9n-binchang0629.vercel.app/', deck: 'https://www.figma.com/slides/9TAEi7HeQYv6TCNPN3TenX', kind: 'project', eyebrow: 'TEAM / 01', heading: '국순당 글로벌 웹사이트 리디자인', role: '팀 프로젝트 · 리디자인 · 서브팀장',
    preview: { kind: 'web', video: '/projects/kooksoondang/preview.mp4', poster: '/projects/kooksoondang/poster.webp', caption: '인트로 영상 → 연령 확인 → 취향 테스트 첫 화면' },
    summary: '기존 국순당 웹사이트를 리디자인했습니다. 전통주에 익숙하지 않은 해외 사용자가 제품의 맛과 음식 조합을 알아보도록 구성했습니다.',
    facts: [{ label: '프로젝트', value: '기존 웹사이트 리디자인' }, { label: '내 역할', value: '서브팀장 · 기획·디자인·개발 참여' }, { label: '담당 페이지', value: 'Pairing 디자인·구현 · Products 구현' }],
    ...kooksoondangCase,
  },
  { id: 'walgawalbot', site: 'https://walgawal-bot.vercel.app/onboarding', deck: 'https://www.figma.com/deck/emKhyBGkOFHLUV1nzrw7CX', kind: 'project', eyebrow: 'TEAM / 02', heading: '왈가왈BOT', role: '팀 프로젝트 · 신규 웹앱 제작 · 개발 팀장',
    preview: { kind: 'mobile', video: '/projects/walgawalbot/preview.mp4', poster: '/projects/walgawalbot/poster.webp', caption: '스플래시 → 온보딩 → 홈 → 밸런스 게임 → 막상막하 → 후일담 편지' },
    summary: '새롭게 기획하고 제작한 커뮤니티 웹앱입니다. 일상 갈등에 대한 AI의 참고 의견과 사람들의 판단을 비교하고, 이후 이야기를 기록합니다.',
    facts: [{ label: '프로젝트', value: '신규 커뮤니티 웹앱 제작' }, { label: '내 역할', value: '개발 팀장' }, { label: '담당 화면', value: '홈 · 배심원 광장 · 후일담' }, { label: '구현 범위', value: '시나리오 기반 발표용 UI' }],
    ...walgawalbotCase,
  },
]
