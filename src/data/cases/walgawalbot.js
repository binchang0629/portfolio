// 왈가왈BOT 케이스 스터디 — 내용만 담는 파일입니다. 레이아웃은 src/components/CaseSection.jsx가 그립니다.
// 규칙: docs/케이스스터디_작성_규칙.md
// 출처: 팀 최종 발표 자료(Figma `0930` 페이지 — 일정·역할·설문 33명·퍼소나·피드백·AI 활용·기여도),
//       팀 기획 문서(PROJECT_SPEC.md — 스타일 가이드), 팀 Figma 목업, 배포된 웹앱 캡처.
const img = name => `/cases/walgawalbot/${name}.webp`
const phone = (name, alt) => ({ src: img(name), w: 603, h: 1311, alt, device: 'phone' })

export default {
  period: '2026.08.24 – 2026.10.01',
  // 앱 컬러 시스템: 판결 블루 #374BFF(브랜드), 먹색, 파일 블루 계열 배경, 행동 오렌지 #FF9524(포인트).
  // bright는 어두운 띠 위에서 쓰는 밝은 파랑(#649EFF, 스타일 가이드 blue-300)
  theme: { brand: '#374BFF', onBrand: '#FFFFFF', bright: '#649EFF', onBright: '#252525', dark: '#252525', light: '#F9FAFD', point: '#FF9524' },
  sides: {
    A: { name: '기획', note: '팀이 함께 조사하고 방향을 정한 과정' },
    B: { name: '내가 만든 화면', note: '홈 · 배심원 광장 · 왈가왈후~', image: { src: img('mockup'), w: 1600, h: 743, alt: '배심원 광장, 홈, 투표 결과, AI 판멍이 챗봇 화면을 나란히 놓은 목업' } },
  },
  sections: [
    {
      side: 'A', type: 'cards', tone: 'light',
      label: '문제 발견', kicker: 'Problem',
      title: '판단을 구할 곳은 많은데,\n한 번에 비교할 곳은 없다',
      body: '사람들은 갈등이 생기면 지인에게 묻고, 커뮤니티를 찾아보고, AI에게 설명합니다. 방법마다 한계가 있어서 한 사건 안에서 여러 판단을 비교하기는 어려웠습니다.',
      cards: [
        { kicker: '지인', value: '57.6%', body: '개인적인 상황을 공유하기 부담스럽다' },
        { kicker: '커뮤니티', title: '편향되거나 공격적인 반응', body: '반응을 예측하기 어렵다' },
        { kicker: 'AI', value: '60.6%', body: 'AI 판단의 부정확성·편향이 걱정된다' },
      ],
      source: '팀 설문 33명',
    },
    {
      side: 'A', type: 'match', tone: 'dark',
      label: '설문 설계', kicker: 'Survey',
      title: '기능이 좋냐고 묻지 않고,\n무엇이 궁금한지 물었다',
      body: '처음 만든 질문은 기능에 좋은 반응을 유도할 수 있었습니다. 기능 선호가 아니라, 결과가 다를 때 사용자가 실제로 찾는 정보를 묻도록 고쳤습니다.',
      columns: ['처음 질문', '고친 질문'],
      rows: [
        { problem: '“AI는 60%, 배심원은 42%로 봤습니다. 이 차이를 보니 어떤가요?”', decision: '“AI와 여러 사람의 판단 결과가 다르게 나온다면, 어떤 점을 가장 확인하고 싶나요?”' },
      ],
    },
    {
      side: 'A', type: 'lead', tone: 'light',
      label: '근거', kicker: 'Research',
      title: '하나의 정답보다,\n다른 판단과 비교하고 싶다',
      body: '최근 6개월 안에 제3자의 의견을 구한 사람이 87.9%였습니다. AI와 사람의 결과가 다를 때는 누가 맞는지보다 왜 판단이 달라졌는지를 궁금해했습니다.',
      chart: {
        groups: [
          { title: '설문 응답 비율', items: [
            { label: '최근 6개월 제3자 의견을 구함', values: [87.9], emphasis: true },
            { label: '남의 사연에서도 AI 판단을 보고 싶음', values: [81.3] },
            { label: '내 생각을 남의 판단과 비교하고 싶음', values: [63.6] },
            { label: 'AI 판단을 정답처럼 믿기 어려움', values: [60.6] },
            { label: '판단이 달라진 이유가 궁금함', values: [45.5], emphasis: true },
            { label: '민감한 상황을 공개하기 부담', values: [42.2] },
          ] },
        ],
      },
      source: '팀 설문 33명',
    },
    {
      side: 'A', type: 'cards', tone: 'dark',
      label: '사용자', kicker: 'Persona',
      title: '같은 고민이라도,\n필요한 도움은 달랐다',
      body: '한 사람은 공개해서 비교하고 싶고, 다른 한 사람은 공개하지 않고 도움이 필요한지부터 알고 싶어 했습니다. 두 사람의 여정은 공개 범위와 추가 도움에서 갈립니다.',
      cards: [
        { kicker: '윤서아 · 24세 · 공개 비교형', title: '“내 행동, 생각이 과한 걸까?”', body: '다른 사람의 판단과 비교한 뒤 관계를 망치지 않을 다음 행동을 정하고 싶다.' },
        { kicker: '곽지훈 · 21세 · 비공개 도움형', title: '“어디까지 도움 받아야 할까?”', body: 'AI 판단을 확인하고, 전문가 도움이 필요한 수준인지 판단한 뒤 도움을 받고 싶다.', highlight: true },
      ],
      source: '리서치 결과를 바탕으로 구성한 가상 퍼소나',
    },
    {
      side: 'A', type: 'match', tone: 'brand',
      label: '설계 판단', kicker: 'Direction',
      title: '정답 대신,\n판단을 돕는 과정을',
      status: 'intent',
      columns: ['리서치에서 본 것', '핵심 기능으로'],
      rows: [
        { problem: 'AI가 편향될까 걱정된다', decision: '판단 근거 — 결론만이 아니라 양측 관점과 판단 이유를 함께' },
        { problem: '개인정보가 알려질까 걱정된다', decision: '공개 범위 선택 — AI 결과까지만 보거나, 공개 여부를 직접 결정' },
        { problem: '판단이 달라진 이유가 궁금하다', decision: 'AI × 배심원 비교 — 두 결과가 어디서 갈렸는지 비교' },
        { problem: '판정 이후에 뭘 해야 할지 막막하다', decision: '다음 행동과 후일담 — 실행할 행동을 제안하고 실제 결과를 기록' },
      ],
    },
    {
      side: 'A', type: 'screens', tone: 'light',
      label: '내 역할', kicker: 'My Role',
      title: '개발 팀장으로,\n홈부터 후일담까지',
      body: '홈, 배심원 광장, 왈가왈후~, 온보딩 페이지를 개발했습니다. 왈가왈후~는 UX/UI 디자인도 맡았습니다. 브랜치 병합과 기능 통합, 전체 화면 디자인 QA와 반응형 보정을 담당했습니다. 팀 자체 평가 기여도는 기획 12% · 디자인 12% · 개발 38%입니다.',
      steps: [
        { label: '홈', image: phone('home', '왈가왈BOT 홈. 오늘의 사건 친구 축의금 10만원 적당한가와 투표하러 가기 버튼') },
        { label: '배심원 광장', image: phone('plaza', '배심원 광장. 이달의 명판관 랭킹 1~3위') },
        { label: '왈가왈후~', image: phone('afterstory', '왈가왈후 화면. 내 이야기 남기기, 내가 쓴 후일담 보러가기, 다른 후일담 목록') },
      ],
    },
    {
      side: 'B', type: 'annotated', tone: 'light',
      label: '핵심 기능 1', kicker: 'Feature 01',
      title: '들어오자마자\n오늘의 사건부터',
      body: '로그인하지 않아도 오늘의 사건과 AI가 짚은 핵심을 먼저 보여 줍니다. 가입은 투표하려는 순간에만 요청합니다.',
      status: 'intent',
      image: { ...phone('home', '홈의 오늘의 사건 영역. 투표 마감 카운트다운, 사건 제목, 투표하러 가기 버튼, 판멍이가 짚은 핵심'), caption: '홈 — 오늘의 사건' },
      notes: [
        { x: 61, y: 20, title: '투표 마감까지 남은 시간' },
        { x: 48, y: 45, title: '둘러보다가 바로 투표로' },
        { x: 6, y: 63, title: 'AI 판멍이가 짚은 핵심 한 줄' },
      ],
    },
    {
      side: 'B', type: 'screens', tone: 'dark',
      label: '핵심 기능 2', kicker: 'Feature 02',
      title: '끝까지 내려도\n볼거리가 이어지게',
      body: '오늘의 사건 아래로 의견이 팽팽한 사건, AI 맞춤 추천과 밸런스 게임, 후일담 편지를 차례로 두었습니다.',
      status: 'intent',
      steps: [
        { label: '막상막하', image: phone('home-closecall', '막상막하 카드. 반려견 개물림 사고 견주 구속 합당한가, 구속 합당 48% 구속 과도 52% 게이지'), caption: '의견이 팽팽한 사건을 게이지로' },
        { label: 'AI 추천 · 밸런스 게임', image: phone('home-recommend', 'AI 맞춤 추천 카드와 깻잎 논쟁 밸런스 게임'), caption: '비슷한 고민 추천, 가볍게 고르는 게임' },
        { label: '왈가왈후~', image: phone('home-letter', '홈의 왈가왈후 영역. 편지 열어보기 봉투와 후일담 카드'), caption: '편지를 열면 판결 뒤의 이야기' },
      ],
    },
    {
      side: 'B', type: 'screens', tone: 'light',
      label: '핵심 기능 3', kicker: 'Feature 03',
      title: '사건이 많아도\n찾기 쉽게',
      body: '배심원 광장에는 이달의 명판관 랭킹과 전체 사건 목록을 두었습니다. 카테고리, 정렬, 검색, 페이지로 원하는 사건을 찾습니다.',
      status: 'intent',
      steps: [
        { label: '명판관 랭킹', image: phone('plaza', '이달의 명판관 배심원 랭킹 시상대'), caption: '판결 포인트와 참여 기록으로 뽑은 순위' },
        { label: '전체 사건', image: phone('plaza-list', '전체 사건 목록. 검색창, 카테고리 칩, 최신 사건 정렬, 투표 중 사건 카드'), caption: '카테고리 칩과 정렬, 검색' },
        { label: '페이지', image: phone('plaza-pages', '사건 카드 목록 아래 페이지 번호'), caption: '기본·선택·비활성 상태를 나눈 페이지 번호' },
      ],
    },
    {
      side: 'B', type: 'screens', tone: 'brand',
      label: '핵심 기능 4', kicker: 'Feature 04',
      title: '투표가 끝나도\n이야기는 이어지게',
      body: '왈가왈후~는 디자인부터 개발까지 맡은 페이지입니다. 판결 뒤에 달라진 이야기를 남기고 읽도록 메모지 카드와 편지형 상세로 구성했습니다.',
      status: 'intent',
      steps: [
        { label: '왈가왈후~', image: phone('afterstory', '왈가왈후 첫 화면'), caption: '내 이야기 남기기와 다른 후일담' },
        { label: '후일담 목록', image: phone('afterstory-list', '카테고리별 후일담 카드 목록과 페이지 번호'), caption: '메모지처럼 붙인 후일담 카드' },
        { label: '편지형 상세', image: phone('afterstory-detail', '편지형 후일담 상세. 요청한 색감으로 고친 뒤 잔금도 받을 수 있었어요'), caption: '판결 뒤의 변화를 편지로' },
      ],
    },
    {
      side: 'B', type: 'match', tone: 'light',
      label: '피드백 반영', kicker: 'Feedback',
      title: 'UI보다 먼저,\n서비스가 이해되지 않았다',
      body: '1차 발표 체크리스트 13명의 응답에서 사용 상황과 필요성, 차별점 점수가 UI 평가보다 낮았습니다. 그래서 UI를 더하기보다 서비스 정의와 핵심 흐름부터 고쳤습니다.',
      chartFirst: true,
      chart: {
        unit: '점', max: 5,
        groups: [
          { title: '1차 발표 체크리스트 (5점 만점)', items: [
            { label: '사용 상황 명확성', values: ['2.0'], emphasis: true },
            { label: '서비스 필요성 이해', values: [2.31] },
            { label: '차별화 인식', values: [2.31] },
            { label: 'UI 전반 평가', values: [2.69] },
          ] },
        ],
      },
      columns: ['피드백', '수정 원칙'],
      rows: [
        { problem: '서비스의 역할과 차별점이 흐리다', decision: 'AI 판정이 아니라, AI × 사람의 판단 비교 → 다음 행동 결정을 핵심 가치로' },
        { problem: '핵심 경험이 한 흐름으로 보이지 않는다', decision: '사건 작성 → AI 1심 → 배심원 비교 → 공개 선택 → 다음 행동 중심으로 재구성' },
        { problem: '캐릭터가 장식에 머문다', decision: '판멍이는 AI 기능 안내, 왈랑이·왈가닥이는 입장·반응 구분으로' },
        { problem: '반복 UI의 상태가 제각각이다', decision: '버튼·페이지네이션·카드의 기본 / 선택 / 비활성 상태를 하나의 규칙으로' },
      ],
      source: '1차 발표 체크리스트 13명',
    },
    {
      side: 'B', type: 'cards', tone: 'dark',
      label: '결과와 한계', kicker: 'Result',
      title: '화면은 완성했지만,\nAI는 아직 연결 전',
      body: '26개 화면을 3개의 공통 레이아웃으로 만들어 배포했습니다. 발표 버전의 AI 의견은 준비된 시나리오 데이터라서, 실제 AI 연동과 응답 품질 검증은 다음 단계입니다.',
      cards: [
        { kicker: '확인된 것', value: '26', body: '구현한 화면 수 (팀 전체)' },
        { kicker: '확인된 것', value: '186', body: '커밋 — 5개 브랜치를 lint·typecheck·build 통과 후 main에 병합' },
        { kicker: '검증 전', title: '실제 사용자의 반응', body: '[사용성 테스트 결과 입력]' },
      ],
    },
    {
      side: 'B', type: 'cards', tone: 'light',
      label: 'AI 활용', kicker: 'AI',
      title: '반복 작업은 AI로,\n구조와 흐름은 팀이',
      body: 'AI를 개발 보조 도구로 썼습니다. 기준 문서를 공유해 도구가 달라도 결과가 흔들리지 않게 했고, AI가 만든 코드도 같은 검사를 통과해야 병합했습니다.',
      cards: [
        { kicker: '01', title: '기준 문서 공유', body: 'CLAUDE.md · AGENTS.md · PROJECT_SPEC.md · PROJECT_CONTEXT.md' },
        { kicker: '02', title: 'Figma 확정 시안 확인', body: 'MCP로 확정 화면을 읽어 토큰과 레이아웃을 반영' },
        { kicker: '03', title: '결과 재검증', body: 'lint · typecheck · build 통과 후 실제 화면 흐름까지 확인' },
      ],
    },
    {
      side: 'B', type: 'lead', label: '회고', kicker: 'Retrospective', hidden: true,
      title: '[제목 입력]',
      body: '[회고 입력]',
    },
    {
      side: 'B', type: 'links', tone: 'dark',
      label: '자료', kicker: 'Links',
      title: '직접 보기',
      links: [
        { href: 'https://walgawal-bot.vercel.app/onboarding', label: '웹앱' },
        { href: 'https://www.figma.com/design/5msPuamjPpGJOUFl0OXBOX', label: 'Figma' },
      ],
    },
  ],
}
