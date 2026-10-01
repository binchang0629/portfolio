// 반려식물 관리 모바일 웹앱 케이스 스터디 (작업 중) — 내용만 담는 파일입니다.
// 규칙: docs/케이스스터디_작성_규칙.md
// 출처: 개인 Figma(린캔버스 페이지 — 아이디어 메모, 경쟁 앱 체험, 인터뷰 3명, 린캔버스, 타깃 사용자 / 앱 페이지 — 핵심 화면),
//       docs/projects/개인_앱.md. 시장 통계는 원문 확인 전이라 쓰지 않았고, 화면 속 수치는 예시 값입니다.
const img = name => `/cases/plant-care/${name}.webp`
const phone = (name, alt) => ({ src: img(name), w: 402, h: 874, alt, device: 'phone' })

export default {
  // 앱 화면의 색: 진한 잎 초록(브랜드), 먹색, 종이색 배경, 연두(포인트). bright는 어두운 띠 위의 연두
  theme: { brand: '#4F6645', onBrand: '#FFFFFF', bright: '#BFD49C', onBright: '#30312E', dark: '#30312E', light: '#F9F8F1', point: '#D4E7B8' },
  sides: {
    A: { name: '기획', note: '아이디어를 정하고 방향을 바꾼 과정' },
    B: { name: '설계한 화면', note: '핵심 흐름 8개 화면 중 일부 · 작업 중' },
  },
  sections: [
    {
      side: 'A', type: 'cards', tone: 'light',
      label: '문제 발견', kicker: 'Problem',
      title: '물 줄 날짜는 알려 주는데,\n지금 줘야 하는지는 모른다',
      body: '많은 식물 앱은 정해진 날짜에 물을 주라고 알려 줍니다. 하지만 같은 식물이라도 계절, 빛, 실내 환경에 따라 필요한 관리가 달라집니다.',
      cards: [
        { title: '일정과 실제 상태가 어긋난다', body: '날짜에 맞춰 물을 줬는데 흙은 아직 촉촉할 수 있다' },
        { title: '정보는 많은데 우선순위가 없다', body: '지금 필요한 내용을 찾기 어렵다' },
        { title: '기록이 흩어진다', body: '상태와 관리, 이후 변화가 사진과 기억에만 남는다' },
      ],
    },
    {
      side: 'A', type: 'cards', tone: 'dark',
      label: '조사', kicker: 'Research',
      title: '직접 써 보고,\n직접 물어봤다',
      body: '식물 관리 앱 여러 개를 직접 써 보고, 식물을 직접 키우는 3명에게 물었습니다. 세 사람의 공통점은 ‘큰 부담 없이 얻는 만족’이었습니다.',
      cards: [
        { kicker: '앱 체험', title: '기능을 써 보기 전에 결제', body: '여러 기능에서 프리미엄 결제로 흐름이 끊겼다' },
        { kicker: '앱 체험', title: '정보 과밀', body: '정보는 충분한데 무엇이 중요한지 구분되지 않았다' },
        { kicker: '인터뷰 3명', title: '적은 손길, 꾸준한 만족', body: '큰 비용·책임·개입 없이 성장을 지켜보는 데서 만족을 느꼈다' },
      ],
      source: '경쟁 앱 체험 기록, 인터뷰 3명',
    },
    {
      side: 'A', type: 'match', tone: 'light',
      label: '방향 전환', kicker: 'Pivot',
      title: '게임으로 키우는 대신,\n상태를 보고 판단하게',
      body: '처음에는 실제 식물과 앱 속 식물을 함께 키우는 게임형 아이디어였습니다. 기록이 귀찮고 게임이 본질을 가릴 수 있다는 단점을 정리한 뒤 방향을 바꿨습니다.',
      columns: ['처음 아이디어', '바꾼 방향'],
      rows: [
        { problem: '앱 속 캐릭터가 함께 자라는 게임', decision: '실제 식물의 흙과 잎 상태를 먼저 확인' },
        { problem: '7일마다 물주기 알림', decision: '“상태를 확인해 볼 시기예요”라고 알리고, 판단은 사용자가' },
        { problem: '정해진 관리법 안내', decision: '비슷한 환경에서 키운 사람들의 상태 → 행동 → 결과를 비교' },
      ],
    },
    {
      side: 'A', type: 'cards', tone: 'dark',
      label: '사용자', kicker: 'Persona',
      title: '정답을 찾는 초보와,\n경험을 나누고 싶은 숙련자',
      body: '일정에 의존하다 식물을 잃어 본 초보와, 오래 쌓은 경험이 기억에만 남아 있는 숙련자를 함께 봤습니다.',
      cards: [
        { kicker: '김서연 · 27세 · 초보 식집사', title: '“정해진 날짜보다, 지금 내 식물에게 필요한 게 무엇인지 확인하고 싶어요.”', body: '앱 알림대로 물을 주다 과습으로 식물을 잃은 경험이 있다.' },
        { kicker: '박현우 · 33세 · 숙련 식집사', title: '“같은 식물도 환경마다 다르게 자라더라고요.”', body: '5년 동안 쌓은 경험이 사진과 기억에만 남아 비교하기 어렵다.', highlight: true },
      ],
      source: '가상 퍼소나',
    },
    {
      side: 'A', type: 'cards', tone: 'brand',
      label: '핵심 가설', kicker: 'Hypothesis',
      title: '정답 하나보다,\n비슷한 사례가 도움이 될 것이다',
      body: '사용자는 하나의 관리 정답보다 비슷한 환경의 상태·행동·결과 사례를 더 유용하게 느낄 것이라고 보고, 이 가설을 중심으로 화면을 설계했습니다. 아직 검증하지 않은 가설입니다.',
      status: 'unverified',
      cards: [
        { kicker: '01', title: '상태 확인형 관리', body: '바로 지시하지 않고 확인할 시기를 알린다' },
        { kicker: '02', title: '비슷한 환경의 경험 비교', body: '같은 상태였던 사람들이 무엇을 했는지 본다' },
        { kicker: '03', title: '상태 → 행동 → 결과 기록', body: '비교할 수 있는 형식으로 남긴다' },
      ],
      source: '린캔버스',
    },
    {
      side: 'B', type: 'screens', tone: 'light',
      label: '기본 화면', kicker: 'Screens',
      title: '정답보다\n관찰이 먼저',
      body: '홈은 오늘 확인할 식물과 주변 환경, 이어서 기록할 결과를 먼저 보여 줍니다. 내 식물과 상세 화면도 관리가 필요한 상태부터 보이게 했습니다.',
      status: 'intent',
      steps: [
        { label: '홈', image: phone('home', '홈. 오늘 몬스테라를 한번 바라봐요, 상태 확인하기 버튼, 오늘의 환경, 이어서 기록할 결과'), caption: '오늘 확인할 식물과 환경' },
        { label: '내 식물', image: phone('plants', '내 식물 목록. 확인할 시기인 몬스테라 카드와 스킨답서스, 고무나무, 상태별 보기'), caption: '확인이 필요한 식물이 맨 위에' },
        { label: '식물 상세', image: phone('detail', '몬스테라 상세. 최근 관리, 관찰 리듬, 상태 확인하기 버튼'), caption: '최근 관리와 관찰 리듬' },
      ],
    },
    {
      side: 'B', type: 'screens', tone: 'dark',
      label: '핵심 흐름', kicker: 'Core Flow',
      title: '확인하고, 비교하고,\n결과를 남긴다',
      body: '흙과 잎 상태를 직접 골라 확인하고, 비슷한 상황의 사람들이 한 일을 본 뒤, 다음 날 결과를 기록합니다.',
      status: 'intent',
      steps: [
        { label: '상태 확인', image: phone('check', '상태 확인 1/3. 흙 상태는 어떤가요? 촉촉해요, 조금 촉촉해요, 충분히 말랐어요'), caption: '흙과 잎 상태를 직접 보고 고르기' },
        { label: '비슷한 경험', image: phone('similar', '나와 비슷한 상황에서는 이런 흐름이 많았어요. 전체 경향과 개별 경험'), caption: '같은 상태였던 사람들의 선택' },
        { label: '결과 기록', image: phone('result', '결과 기록. 지금 몬스테라는 어떤 모습에 가까운가요? 세 가지 상태 선택과 짧은 메모'), caption: '하루 뒤 실제 모습으로 기록' },
      ],
      source: '화면 속 수치는 예시 값',
    },
    {
      side: 'B', type: 'annotated', tone: 'light',
      label: '경험 데이터', kicker: 'Experience Data',
      title: '쌓인 경험은\n데이터로 다시 본다',
      body: '기본 비교는 무료로 충분히 보이고, 구독(GROW PASS)은 기능을 잠그는 대신 더 깊은 분석을 더하는 구조로 설계했습니다.',
      status: 'intent',
      image: { ...phone('data', '경험 데이터. 124개의 경험, 가장 많은 행동 62%, 좋아진 기록 78%, 행동별 결과 비교, GROW PASS 고급 분석 카드'), caption: '화면 속 수치는 예시 값입니다' },
      notes: [
        { x: 30, y: 30, title: '가장 많이 선택한 행동' },
        { x: 8, y: 46, title: '행동별 결과 비교' },
        { x: 8, y: 66, title: '환경별 요약은 무료로' },
        { x: 8, y: 82, title: '구독은 더 깊은 분석만 더하기' },
      ],
    },
    {
      side: 'B', type: 'cards', tone: 'brand',
      label: '다음 작업', kicker: 'Next',
      title: '아직 만드는 중,\n남은 것들',
      body: '핵심 흐름의 화면 설계까지 진행했습니다. 아래 작업은 이어서 추가할 예정입니다.',
      status: 'unverified',
      cards: [
        { kicker: '설계', title: '행동 선택 화면 다듬기', body: '참고 사례와 직접 선택의 관계를 더 분명하게' },
        { kicker: '설계', title: '빈 상태와 오류 화면', body: '사례가 없을 때, 저장에 실패했을 때' },
        { kicker: '검증', title: '기록 부담과 사례 신뢰도', body: '사용자에게 직접 확인하기' },
      ],
    },
    {
      side: 'B', type: 'links', tone: 'light',
      label: '자료', kicker: 'Links',
      title: '직접 보기',
      links: [
        { href: 'https://www.figma.com/design/WW3bdlwtel1WXeNpVPiRlv?node-id=120-209', label: '앱 화면' },
        { href: 'https://www.figma.com/design/WW3bdlwtel1WXeNpVPiRlv?node-id=16-2', label: '린캔버스' },
      ],
    },
  ],
}
