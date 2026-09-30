// 국순당 케이스 스터디 — 내용만 담는 파일입니다. 레이아웃은 src/components/CaseSection.jsx가 그립니다.
// 섹션 구조와 채우는 법은 ./_template.js를 참고하세요.
// 출처: 팀 발표 슬라이드(Figma Slides), 팀 공지 보드(Figma), 배포된 Pairing 페이지 캡처.
const img = name => `/cases/kooksoondang/${name}.webp`

export default {
  period: '2026.05 – 2026.08',
  // 팀 스타일 가이드의 색: 주황(브랜드), 먹색, 밝은 배경, 연두(포인트). 브랜드 띠는 주황 배경에 흰 글씨
  theme: { brand: '#F29556', dark: '#262322', light: '#FAF8F7', point: '#D4E400' },
  // 카세트 J-카드의 두 면: A는 팀 기획 과정, B는 제가 만든 Pairing 페이지
  sides: {
    A: { name: '기획', note: '팀이 함께 조사하고 방향을 정한 과정' },
    B: { name: 'Pairing 페이지', note: '제가 디자인하고 코드로 만든 페이지', image: { src: img('hero'), w: 1600, h: 584, alt: 'Pairing 페이지 첫 화면. Find Your Perfect pairing 문구와 막걸리, 복숭아, 청포도 사진' } },
  },
  sections: [
    {
      side: 'A', type: 'cards', tone: 'light',
      label: '문제 발견', kicker: 'Problem',
      title: '읽히지도, 이어지지도,\n해외에 닿지도 않는 사이트',
      body: '국순당 웹사이트는 2009년에 만든 구조 그대로였습니다. 그사이 사용자는 모바일로 옮겨 갔고, 막걸리는 K-푸드와 함께 해외에서 다시 알려지고 있었습니다.',
      image: { src: img('old-site'), w: 880, h: 850, alt: '2009년에 제작된 기존 국순당 웹사이트의 PC와 모바일 화면', caption: '기존 사이트의 PC·모바일 화면' },
      cards: [
        { title: '읽히지 않는다', body: '작은 글자와 복잡한 레이아웃' },
        { title: '이어지지 않는다', body: '새 창으로 열리는 메뉴, 끊기는 이동' },
        { title: '닿지 않는다', body: '이미지 속 글자, 반응형 미지원' },
      ],
      source: '팀 데스크 리서치',
    },
    {
      side: 'A', type: 'cards', tone: 'dark',
      label: '근거', kicker: 'Research',
      title: '맛으로 고르는데,\n맛을 설명하는 말이 없다',
      body: '설문 두 건에서 선택 기준은 모두 맛·풍미였습니다. 사기 전에 확인하기 어려운 정보인데 기존 사이트는 이를 말로 풀어 주지 않았습니다. 혼자 마신다는 응답은 없었습니다.',
      cards: [
        { value: '14/16', body: '새로운 술을 시도해 볼 의향이 있다' },
        { value: '56%', body: '술을 고를 때 맛·풍미를 본다' },
        { value: '0명', body: '혼자 마신다' },
      ],
      // 두 설문(4명, 12명)의 응답 수를 더해 16명 기준 비율로 합쳤습니다.
      // 슬라이드 비율 → 응답 수: 설문 1은 25% 단위(4명), 설문 2는 17%가 12명 중 2명이라 12명.
      chart: {
        groups: [
          { title: '주로 마시는 상황', items: [
            { label: '모임·파티', values: [75], note: '12명', emphasis: true },
            { label: '의식·행사', values: [19], note: '3명' },
            { label: '혼술', values: [0], note: '0명', emphasis: true },
          ] },
          { title: '술을 고를 때 보는 것 (복수 선택)', items: [
            { label: '맛·풍미', values: [56], note: '9명', emphasis: true },
            { label: '패키지·디자인', values: [19], note: '3명' },
            { label: '가격', values: [19], note: '3명' },
            { label: '음식과의 페어링', values: [19], note: '3명', emphasis: true },
            { label: '브랜드 스토리', values: [13], note: '2명' },
          ] },
        ],
      },
      source: '팀 설문조사 2건 합산 (Google Forms, 4명 + 12명)',
    },
    {
      side: 'A', type: 'cards', tone: 'light',
      label: '사용자', kicker: 'Persona',
      title: '음식에 맞는 술을\n빨리 찾고 싶은 사람',
      body: '팀이 세운 두 페르소나 중, Pairing 페이지는 두 번째 사람의 불편에서 출발했습니다. 페어링 정보가 없고 제품을 비교하기 어렵다는 점입니다.',
      cards: [
        { kicker: 'PERSONA 01', title: 'Emily · 한국 거주 2년 차', body: '“막걸리를 처음 접하는 사람도 쉽게 즐길 수 있는 방법을 알고 싶어요.”' },
        { kicker: 'PERSONA 02', title: 'David · 싱가포르 여행사 직원', body: '“음식에 가장 잘 어울리는 막걸리를 쉽고 빠르게 찾고 싶어요.”', highlight: true },
      ],
      image: { src: img('persona'), w: 1600, h: 595, alt: '두 페르소나 Emily Carter와 David Lim의 목표, 불편, 필요', caption: '팀이 세운 페르소나 (가상 인물)' },
    },
    {
      side: 'A', type: 'lead', tone: 'brand',
      label: '내 역할', kicker: 'My Role',
      title: '7개 페이지 중 PAIRING,\n디자인부터 코드까지',
      body: '5명 팀의 서브팀장이었습니다. Pairing 페이지는 레퍼런스 조사부터 디자인, 피드백 반영, 코딩과 반응형까지 맡았습니다. Products 페이지 구현에도 참여했습니다. 팀 자체 평가 기여도는 디자인 10% · 개발 25% · 기획 10%입니다.',
      image: { src: img('mvp'), w: 910, h: 720, alt: '인트로부터 페어링까지 팀이 정의한 7개 페이지 목록, 07 PAIRING 강조', caption: '팀이 정의한 페이지 구성' },
    },
    {
      side: 'A', type: 'match', tone: 'light',
      label: '설계 판단', kicker: 'Direction',
      title: '길게 설명하는 대신,\n고르면서 알게',
      status: 'intent',
      columns: ['조사에서 본 것', 'Pairing 페이지에서'],
      rows: [
        { problem: '맛은 사기 전에 확인하기 어렵다', decision: '맛·스타일·상황·관심사 4문항으로 취향을 먼저 묻고, 결과에서 맛 지표와 함께 추천' },
        { problem: '혼자보다 함께 마신다', decision: '질문에 상황(파티·저녁·캠핑·데이트·집)을 넣고, 한식·세계 음식 페어링으로 연결' },
        { problem: '처음이면 마시는 법도 모른다', decision: '결과 창에 음용 팁, 페이지 끝에 재료와 순서가 있는 레시피' },
      ],
    },
    {
      side: 'B', type: 'annotated', tone: 'light',
      label: '핵심 기능 1', kicker: 'Feature 01',
      title: '한 번에 한 질문씩',
      body: '지금 답할 질문만 펼치고 나머지는 색 탭으로 접었습니다. 몇 단계가 남았는지 보이고, 답을 골라야 넘어갑니다.',
      status: 'intent',
      image: { src: img('quiz'), w: 1600, h: 774, alt: 'Find Your Drink 질문지. Q1 맛 질문이 펼쳐져 Spicy가 선택되어 있고 Q2~Q4는 세로 탭으로 접혀 있다', caption: 'Find Your Drink — Q1에서 답을 고른 상태' },
      notes: [
        { x: 35, y: 27, title: '고른 답은 질문 색으로' },
        { x: 85, y: 45, title: '남은 질문은 세로 탭으로' },
        { x: 60, y: 89, title: '답을 골라야 Next가 켜짐' },
      ],
    },
    {
      side: 'B', type: 'annotated', tone: 'dark',
      label: '핵심 기능 2', kicker: 'Feature 02',
      title: '추천 제품과\n마시는 법을 한 창에',
      body: '제품 하나만 보여 주면 비교할 기준이 없어서 맛 지표와 비슷한 제품, 마시는 팁을 함께 두었습니다.',
      status: 'intent',
      image: { src: img('result'), w: 1600, h: 1000, alt: 'YOUR PERFECT MATCH 결과 창. 추천 막걸리, 맛 지표, 비슷한 제품, 마시는 팁, 음식 페어링 버튼', caption: '4문항을 마친 뒤 열리는 결과 창' },
      notes: [
        { x: 13, y: 33, title: '추천 제품' },
        { x: 20, y: 63, title: '당도·산미·바디·탄산' },
        { x: 53, y: 45, title: '비슷한 제품' },
        { x: 60, y: 45, title: '처음 마시는 사람을 위한 팁' },
        { x: 63, y: 83, title: '음식 페어링으로 이동' },
      ],
    },
    {
      side: 'B', type: 'compare', tone: 'brand',
      label: '핵심 기능 3', kicker: 'Feature 03',
      title: '추천 뒤에도\n음식과 레시피로',
      body: '결과를 본 뒤 페이지가 끝나지 않도록 어울리는 음식과 직접 만들어 볼 레시피를 이어 두었습니다.',
      status: 'intent',
      steps: [
        { label: 'Food Pairing', image: { src: img('food'), w: 1600, h: 838, alt: '인기·한식·세계 음식 탭과 파전, 보쌈, 불고기 음식 카드' }, caption: '인기·한식·세계 음식 탭, 좌우로 넘기는 카드' },
        { label: 'Drink Recipes', image: { src: img('recipes'), w: 1600, h: 845, alt: '막걸리 하이볼 레시피 카드. 재료, 만드는 법, 난이도와 소요 시간' }, caption: '5가지 레시피 — 재료, 순서, 난이도와 시간' },
      ],
    },
    {
      side: 'B', type: 'match', tone: 'light',
      label: '피드백 반영', kicker: 'Feedback',
      title: '‘확인하고 넘어가게’를\n버튼 상태로',
      body: '8월 7일 중간 점검에서 받은 피드백입니다.',
      columns: ['받은 피드백', '반영한 것'],
      rows: [
        { problem: '체크를 확인하고 넘어갈 수 있게', decision: '답을 고르기 전엔 Next·View Result를 끄고, 고른 답을 색으로 표시' },
        { problem: '칵테일 섹션 오른쪽 위 동그라미를 주황색으로', decision: '[반영 여부 확인 후 입력]' },
      ],
      image: { src: img('quiz-last'), w: 1600, h: 774, alt: 'Q4까지 답을 모두 고른 질문지. View Result 버튼이 켜져 있다', caption: '모든 답을 고르면 View Result가 켜집니다' },
      source: '팀 중간 피드백 (8/7)',
    },
    {
      side: 'B', type: 'cards', tone: 'dark',
      label: '결과와 한계', kicker: 'Result',
      title: '완성했지만,\n검증은 아직',
      body: '질문부터 레시피까지 이어지는 흐름을 구현해 배포했습니다. 사용자가 추천을 믿고 제품을 고르는지는 테스트하지 못했습니다.',
      cards: [
        { kicker: '확인된 것', title: '질문 → 결과 → 음식 → 레시피', body: '배포된 페이지에서 전체 흐름이 동작합니다.' },
        { kicker: '검증 전', title: '추천 결과의 설득력', body: '[사용성 테스트 결과 입력]' },
        { kicker: '남은 과제', title: '반응형과 디자인 통일', body: '모바일·태블릿 화면, 페이지 간 분위기 통일' },
      ],
    },
    {
      side: 'B', type: 'lead', tone: 'light',
      label: '회고', kicker: 'Retrospective',
      title: '소통이 늦으면\n일정이 밀린다',
      body: '자체 평가는 10점 중 5점이었습니다. 초반에 소통이 늦어 같은 논의가 반복됐고, 후반에 소통이 늘자 속도가 붙었습니다. 낯을 가리더라도 처음부터 먼저 묻고 참여하기로 했습니다.',
    },
    {
      side: 'B', type: 'cards', label: 'AI 활용', kicker: 'AI', hidden: true,
      title: '[제목 입력]',
      body: '[AI를 어느 단계에서 왜 썼는지 입력]',
      cards: [{ title: '[사용한 도구]', body: '[프롬프트와 수정 과정 입력]' }],
    },
    {
      side: 'B', type: 'links', tone: 'light',
      label: '자료', kicker: 'Links',
      title: '직접 보기',
      links: [
        { href: 'https://kooksoondang-k1iilin9n-binchang0629.vercel.app/pairing/pairing.html', label: 'Pairing 페이지' },
        { href: 'https://kooksoondang-k1iilin9n-binchang0629.vercel.app/products/products.html', label: 'Products 페이지' },
        { href: 'https://www.figma.com/slides/9TAEi7HeQYv6TCNPN3TenX', label: '발표 자료' },
      ],
    },
  ],
}
