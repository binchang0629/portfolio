// 반려식물 관리 모바일 웹앱 케이스 스터디 (작업 중) — 내용만 담는 파일입니다.
// 규칙: docs/케이스스터디_작성_규칙.md
// 출처: 개인 Figma(린캔버스 페이지 — 아이디어 메모, 경쟁 앱 체험, 인터뷰 3명, 린캔버스, 타깃 사용자 /
//       앱 페이지 '진짜' 섹션 — 직접 다듬은 실제 화면 7개, AI 초안 화면), docs/projects/개인_앱.md.
//       시장 통계는 원문 확인 전이라 쓰지 않았고, 화면 속 수치는 예시 값입니다.
const img = name => `/cases/plant-care/${name}.webp`
const phone = (name, alt) => ({ src: img(name), w: 402, h: 874, alt, device: 'phone' })

export default {
  // 플랜잇 화면의 색: 진한 이끼 초록(버튼·탭), 먹색, 종이색 배경, 연두(상태 확인 버튼·선택). bright는 어두운 띠 위의 연두
  theme: { brand: '#384D2F', onBrand: '#FFFFFF', bright: '#DBEBA8', onBright: '#2B3325', dark: '#262B22', light: '#FAF9F4', point: '#DBEBA8' },
  sides: {
    A: { name: '기획', note: '아이디어를 정하고 방향을 바꾼 과정' },
    B: { name: '플랜잇 화면', note: '직접 다듬은 화면 7개 · 작업 중' },
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
      title: '오늘 볼 식물이\n먼저 보이게',
      body: '홈은 오늘 확인할 식물과 지금의 환경, 이어서 기록할 식물을 먼저 보여 줍니다. 환경은 숫자만 두지 않고 “좋아요”, “간접광 추천”처럼 말로 풀었습니다.',
      status: 'intent',
      steps: [
        { label: '홈', image: phone('home', '홈. 몬스테라를 확인해볼 시기예요, 상태 확인하기 버튼, 현재 환경(온도·습도·햇빛·실내 환경), 이어서 기록할 식물 스킨답서스'), caption: '오늘 확인할 식물과 현재 환경' },
        { label: '내 식물', image: phone('plants', '내 식물. 전체·실내·베란다·야외 필터, 대표 식물 몬스테라와 스킨답서스 카드, 식물별 한 줄 상태'), caption: '식물마다 한 줄로 보는 상태' },
        { label: '식물 상세', image: phone('detail', '몬스테라 상세. 실내·기본 청정·중형 화분 태그, 현재 상태(마지막 물주기, 흙 상태)'), caption: '마지막 물주기와 흙 상태' },
      ],
    },
    {
      side: 'B', type: 'screens', tone: 'dark',
      label: '핵심 흐름', kicker: 'Core Flow',
      title: '확인하고, 고르고,\n비슷한 경험과 견준다',
      body: '흙과 잎 상태는 사진을 보고 고릅니다. 내가 한 행동을 고르면, 비슷한 환경의 사람들이 어떻게 했는지 볼 수 있습니다.',
      status: 'intent',
      steps: [
        { label: '상태 확인', image: phone('check', '상태 확인. 흙 상태는 어떤가요? 사진으로 된 보기(촉촉해요, 조금 촉촉해요, 충분히 말랐어요), 잎 상태는 어떤가요?'), caption: '사진을 보고 고르는 흙·잎 상태' },
        { label: '행동 선택', image: phone('action', '행동 선택. 어떤 행동을 선택하셨나요? 물주기, 조금 더 기다리기, 위치 변경, 기타 관리'), caption: '내가 한 행동 네 가지 중 하나' },
        { label: '비슷한 경험', image: phone('similar', '비슷한 환경의 경험 124건. 다른 사람들은 어떻게 했을까요? 기다렸어요 48%, 물줬어요 37%, 위치 변경했어요 15%'), caption: '같은 조건에서 사람들이 한 일' },
      ],
      source: '화면 속 수치는 예시 값',
    },
    {
      side: 'B', type: 'annotated', tone: 'light',
      label: '경험 데이터', kicker: 'Experience Data',
      title: '쌓인 경험은\n숫자로 다시 본다',
      body: '같은 식물, 계절, 환경으로 모인 경험을 숫자로 요약합니다. 전체 요약은 누구나 보고, 상태별 분석과 내 식물 비교는 프리미엄으로 더하는 구조입니다.',
      status: 'intent',
      image: { ...phone('data', '경험 데이터 분석. 식물·계절·환경 필터, 전체 요약 탭과 잠긴 상태별·내 식물과 비교 탭, 총 경험 수 1,284건, 가장 많은 행동 기다림 48%'), caption: '화면 속 수치는 예시 값입니다' },
      notes: [
        { x: 84, y: 31, title: '식물·계절·환경으로 조건 고르기' },
        { x: 37, y: 40.5, title: '전체 요약은 무료, 깊은 분석은 잠금' },
        { x: 15, y: 66, title: '조건에 맞는 경험 수' },
        { x: 15, y: 89, title: '가장 많이 한 행동' },
      ],
    },
    {
      side: 'B', type: 'screens', tone: 'dark',
      label: '다듬은 과정', kicker: 'Process',
      title: 'AI 초안에서 시작해,\n직접 고쳐 나갔다',
      body: '처음 화면은 AI로 빠르게 만든 초안이었습니다. 이 초안을 바탕으로 정보와 구성을 직접 보강하고 고쳐 지금 화면을 만들었습니다.',
      steps: [
        { label: 'AI 초안 · 홈', image: phone('draft-home', 'AI 초안 홈. 식물 그림, 오늘의 환경 숫자 세 개, 이어서 기록할 결과'), caption: '그림과 숫자 세 개뿐인 환경' },
        { label: '다듬은 홈', image: phone('home', '다듬은 홈. 실제 식물 사진, 아이콘과 상태 설명이 붙은 환경 네 가지'), caption: '사진과 상태 설명을 더한 환경' },
        { label: 'AI 초안 · 상태 확인', image: phone('draft-check', 'AI 초안 상태 확인 1/3. 글로만 된 흙 상태 보기 세 개'), caption: '글로만 고르는 보기' },
        { label: '다듬은 상태 확인', image: phone('check', '다듬은 상태 확인. 사진으로 된 흙·잎 상태 보기'), caption: '사진을 보고 고르는 보기' },
      ],
    },
    {
      side: 'B', type: 'cards', tone: 'brand',
      label: '다음 작업', kicker: 'Next',
      title: '아직 만드는 중,\n남은 것들',
      body: '핵심 흐름의 화면 설계까지 진행했습니다. 아래 작업은 이어서 추가할 예정입니다.',
      status: 'unverified',
      cards: [
        { kicker: '설계', title: '결과 기록 흐름 잇기', body: '홈의 결과 기록하기에서 이어지는 화면' },
        { kicker: '설계', title: 'Community와 Journal', body: '하단 탭에만 있고 화면은 아직 없다' },
        { kicker: '검증', title: '기록 부담과 사례 신뢰도', body: '사용자에게 직접 확인하기' },
      ],
    },
    {
      side: 'B', type: 'links', tone: 'light',
      label: '자료', kicker: 'Links',
      title: '직접 보기',
      links: [
        { href: 'https://www.figma.com/design/WW3bdlwtel1WXeNpVPiRlv?node-id=164-116', label: '앱 화면' },
        { href: 'https://www.figma.com/design/WW3bdlwtel1WXeNpVPiRlv?node-id=16-2', label: '린캔버스' },
      ],
    },
  ],
}
