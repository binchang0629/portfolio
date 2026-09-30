// 국순당 케이스 스터디 — 내용만 담는 파일입니다. 레이아웃은 src/components/CaseSection.jsx가 그립니다.
// 섹션 구조와 채우는 법은 ./_template.js를 참고하세요.
// 출처: 팀 발표 슬라이드(Figma Slides), 팀 공지 보드(Figma), 배포된 Pairing 페이지 캡처.
const img = name => `/cases/kooksoondang/${name}.webp`

export default {
  period: '2026.05 – 2026.08',
  sections: [
    {
      type: 'cards',
      label: '문제 발견',
      title: '기존 사이트는 읽히지도, 이어지지도, 해외에 닿지도 않았습니다',
      body: '국순당 웹사이트는 2009년 제작 이후 구조와 언어가 거의 그대로였습니다. 그사이 사용자는 모바일로 옮겨 갔고, 막걸리는 K-푸드와 함께 해외에서 다시 알려지기 시작했습니다.',
      cards: [
        { title: '읽히지 않는다', body: '작은 글자와 복잡한 레이아웃 때문에 내용을 읽기 어렵습니다.' },
        { title: '이어지지 않는다', body: '새 창으로 열리는 메뉴와 끊기는 페이지 이동이 이탈을 만듭니다.' },
        { title: '닿지 않는다', body: '이미지 속 글자와 반응형 미지원으로 모바일·해외 환경에서 쓰기 어렵습니다.' },
      ],
      image: { src: img('old-site'), w: 880, h: 850, alt: '2009년에 제작된 기존 국순당 웹사이트의 PC와 모바일 화면', caption: '기존 사이트의 PC·모바일 화면' },
      source: '팀 데스크 리서치',
    },
    {
      type: 'cards',
      label: '근거',
      title: '사람들은 맛으로 술을 고르지만, 사이트에는 맛을 설명하는 말이 없었습니다',
      body: '팀이 진행한 설문 두 건 모두에서 선택 기준은 ‘맛·풍미’에 모였습니다. 맛은 사기 전에 직접 확인하기 어려운 정보인데, 기존 사이트에는 이를 말로 풀어 주는 내용이 부족했습니다. 혼자 마신다는 응답이 없었기 때문에, 함께 마시는 상황까지 고려한 정보가 필요하다고 판단했습니다.',
      cards: [
        { value: '14 / 16', title: '새로운 술을 시도할 의향', body: '응답자 16명 중 14명이 있다고 답했습니다.' },
        { value: '1순위', title: '선택 기준은 맛·풍미', body: '두 설문 모두 같은 결과였습니다.' },
        { value: '0%', title: '혼술 응답', body: '두 설문 모두 모임·파티가 75%였습니다.' },
      ],
      image: { src: img('survey'), w: 1024, h: 738, alt: '마시는 상황과 술을 고르는 기준을 두 설문으로 비교한 막대그래프', caption: '설문 결과 — 마시는 상황과 선택 기준' },
      source: '팀 설문조사 2건 (Google Forms)',
    },
    {
      type: 'cards',
      label: '사용자',
      title: 'Pairing 페이지는 ‘음식에 맞는 술을 빨리 찾고 싶은’ 사용자에서 출발했습니다',
      body: '팀은 조사를 바탕으로 두 명의 페르소나를 세웠습니다. 제가 맡은 Pairing 페이지는 두 번째 페르소나가 겪는 문제, 곧 페어링 정보가 없고 제품을 비교하기 어렵다는 점을 풀기 위한 페이지입니다.',
      cards: [
        { kicker: 'PERSONA 01', title: 'Emily · 한국 거주 2년 차', body: '“막걸리를 처음 접하는 사람도 쉽게 즐길 수 있는 방법을 알고 싶어요.”' },
        { kicker: 'PERSONA 02', title: 'David · 싱가포르 여행사 직원', body: '“음식에 가장 잘 어울리는 막걸리를 쉽고 빠르게 찾고 싶어요.”', highlight: true },
      ],
      image: { src: img('persona'), w: 1600, h: 595, alt: '두 페르소나 Emily Carter와 David Lim의 목표, 불편, 필요', caption: '팀이 세운 페르소나 (가상 인물)' },
    },
    {
      type: 'lead',
      label: '내 역할',
      title: '7개 페이지 중 PAIRING을 맡아 디자인부터 코드까지 만들었습니다',
      body: '5명이 기획·디자인·개발을 나눠 맡은 팀에서 서브팀장을 맡았습니다. Pairing 페이지는 레퍼런스 조사, PC 디자인, 피드백 반영, 코딩과 반응형 작업까지 직접 했고, Products 페이지 구현에도 참여했습니다. 팀 자체 평가에서 적은 기여도는 디자인 10% · 개발 25% · 기획 10%입니다.',
      image: { src: img('mvp'), w: 910, h: 720, alt: '인트로부터 페어링까지 팀이 정의한 7개 페이지 목록, 07 PAIRING 강조', caption: '팀이 정의한 페이지 구성 — 07 PAIRING 담당' },
    },
    {
      type: 'match',
      label: '설계 판단',
      title: '맛을 글로 길게 설명하는 대신, 고르면서 알게 되는 순서로 설계했습니다',
      status: 'intent',
      columns: ['조사에서 본 문제', 'Pairing 페이지의 판단'],
      rows: [
        { problem: '맛·풍미는 사기 전에 확인하기 어렵다', decision: '맛·스타일·상황·관심사 4문항으로 취향을 먼저 묻고, 결과에서 맛 지표와 함께 제품을 추천했습니다.' },
        { problem: '혼자보다 함께 마시는 상황이 많다', decision: '질문에 ‘상황’(파티·저녁 식사·캠핑·데이트·집)을 넣고, 한식·세계 음식 페어링을 이어서 보여 줍니다.' },
        { problem: '막걸리가 처음이면 마시는 법도 모른다', decision: '결과 창에 음용 팁을, 페이지 끝에 재료와 순서가 있는 레시피를 두었습니다.' },
      ],
    },
    {
      type: 'annotated',
      label: '핵심 기능 1',
      title: '한 번에 한 질문만 펼쳐서, 네 단계를 끝까지 따라오게 했습니다',
      body: '네 문항을 한 화면에 늘어놓지 않고 지금 답할 질문만 펼쳤습니다. 나머지는 색 탭으로 접어 남은 단계가 보이게 했습니다.',
      status: 'intent',
      image: { src: img('quiz'), w: 1600, h: 774, alt: 'Find Your Drink 질문지. Q1 맛 질문이 펼쳐져 Spicy가 선택되어 있고 Q2~Q4는 세로 탭으로 접혀 있다', caption: 'Find Your Drink — Q1에서 답을 고른 상태' },
      notes: [
        { x: 35, y: 27, title: '고른 답을 질문 색으로 표시', body: '무엇을 골랐는지 바로 보입니다.' },
        { x: 85, y: 45, title: '남은 질문은 색 탭으로 접기', body: 'Q2–Q4가 세로 탭으로 남아 있어 몇 단계가 남았는지 알 수 있습니다.' },
        { x: 60, y: 89, title: '답을 골라야 Next가 켜짐', body: '빈 답으로 다음 질문에 넘어가지 않습니다.' },
      ],
    },
    {
      type: 'annotated',
      label: '핵심 기능 2',
      title: '결과 창에서 추천 제품과 함께 마시는 법까지 알려 줍니다',
      body: '제품 하나만 보여 주면 비교할 기준이 없습니다. 맛 지표, 비슷한 제품, 마시는 팁을 한 창에 모으고 음식 페어링으로 넘어가는 버튼을 두었습니다.',
      status: 'intent',
      image: { src: img('result'), w: 1600, h: 1000, alt: 'YOUR PERFECT MATCH 결과 창. 추천 막걸리, 맛 지표, 비슷한 제품, 마시는 팁, 음식 페어링 버튼', caption: '4문항을 마친 뒤 열리는 결과 창' },
      notes: [
        { x: 13, y: 33, title: '추천 제품과 한 줄 설명' },
        { x: 20, y: 63, title: '당도·산미·바디·탄산 4가지 맛 지표' },
        { x: 53, y: 45, title: '비슷한 제품으로 비교' },
        { x: 60, y: 45, title: '처음 마시는 사람을 위한 팁', body: '맑은 윗부분을 먼저 맛보고, 섞어서 마시는 순서를 안내합니다.' },
        { x: 63, y: 83, title: '음식 페어링으로 이어지는 버튼' },
      ],
    },
    {
      type: 'compare',
      label: '핵심 기능 3',
      title: '추천이 끝난 뒤에도 음식과 레시피로 이어지게 했습니다',
      body: '결과를 본 뒤 페이지가 끝나지 않도록, 어울리는 음식과 직접 만들어 볼 수 있는 레시피를 차례로 배치했습니다.',
      status: 'intent',
      steps: [
        { label: 'FOOD PAIRING', image: { src: img('food'), w: 1600, h: 838, alt: '인기·한식·세계 음식 탭과 파전, 보쌈, 불고기 음식 카드' }, caption: '인기·한식·세계 음식 탭과 좌우로 넘기는 음식 카드' },
        { label: 'DRINK RECIPES', image: { src: img('recipes'), w: 1600, h: 845, alt: '막걸리 하이볼 레시피 카드. 재료, 만드는 법, 난이도와 소요 시간' }, caption: '5가지 레시피 — 재료, 만드는 순서, 난이도와 시간' },
      ],
    },
    {
      type: 'match',
      label: '피드백 반영',
      title: '‘확인하고 넘어가게’ 해 달라는 피드백을 버튼 상태로 반영했습니다',
      body: '8월 7일 중간 점검에서 Pairing 페이지에 두 가지 피드백을 받았습니다.',
      columns: ['받은 피드백', '반영한 내용'],
      rows: [
        { problem: '체크를 확인하고 넘어갈 수 있게 해 주세요', decision: '답을 고르기 전에는 Next·View Result 버튼을 끄고, 고른 답을 색으로 표시했습니다.' },
        { problem: '마지막 칵테일 섹션 오른쪽 위 동그라미를 주황색으로 바꿔 주세요', decision: '[반영 여부 확인 후 입력]' },
      ],
      image: { src: img('quiz-last'), w: 1600, h: 774, alt: 'Q4까지 답을 모두 고른 질문지. View Result 버튼이 켜져 있다', caption: '모든 답을 고르면 View Result가 켜집니다' },
      source: '팀 중간 피드백 (8/7)',
    },
    {
      type: 'cards',
      label: '결과와 한계',
      title: '페이지는 완성했지만, 사용자에게 검증하지는 못했습니다',
      body: '질문부터 레시피까지 이어지는 흐름을 구현해 배포했습니다. 다만 사용자가 추천 결과를 믿고 제품을 고르는지는 테스트하지 못했습니다.',
      cards: [
        { kicker: '확인된 것', title: '질문 → 결과 → 음식 → 레시피', body: '배포된 페이지에서 전체 흐름이 동작합니다.' },
        { kicker: '검증 전', title: '추천 결과의 설득력', body: '[사용성 테스트 결과 입력]' },
        { kicker: '남은 과제', title: '반응형 보완과 디자인 통일', body: '모바일·태블릿 화면과 페이지 간 분위기 통일을 팀 과제로 정리했습니다.' },
      ],
    },
    {
      type: 'lead',
      label: '회고',
      title: '초반의 소통 공백이 일정을 밀었고, 다음에는 처음부터 먼저 묻기로 했습니다',
      body: '자체 평가는 10점 중 5점이었습니다. 계획한 것을 다 담지 못했고, 초반에 소통이 늦어 같은 논의가 반복되면서 일정에 쫓겼습니다. 후반에 소통이 늘자 속도가 붙었습니다. 낯을 가리더라도 처음부터 적극적으로 참여해야 결과물이 좋아진다는 것을 배웠습니다.',
    },
    {
      type: 'cards',
      label: 'AI 활용',
      hidden: true,
      title: '[제목 입력]',
      body: '[AI를 어느 단계에서 왜 썼는지 입력]',
      cards: [{ title: '[사용한 도구]', body: '[프롬프트와 수정 과정 입력]' }],
    },
    {
      label: '자료',
      title: '자료',
      links: [
        { href: 'https://kooksoondang-k1iilin9n-binchang0629.vercel.app/pairing/pairing.html', label: 'Pairing 페이지 보기' },
        { href: 'https://kooksoondang-k1iilin9n-binchang0629.vercel.app/products/products.html', label: 'Products 페이지 보기' },
        { href: 'https://www.figma.com/slides/9TAEi7HeQYv6TCNPN3TenX', label: '발표 자료 보기' },
      ],
    },
  ],
}
