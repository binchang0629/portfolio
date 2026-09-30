// 왈가왈BOT 케이스 스터디 — 내용만 담는 파일입니다. 레이아웃은 src/components/CaseSection.jsx가 그립니다.
// 규칙: docs/케이스스터디_작성_규칙.md
// 출처: 팀 기획 문서(PROJECT_SPEC.md — 서비스·설문·퍼소나·제품 원칙·스타일 가이드), 팀 Figma(목업),
//       배포된 웹앱 캡처, 포트폴리오에 정리했던 발표 피드백.
const img = name => `/cases/walgawalbot/${name}.webp`
const phone = (name, alt) => ({ src: img(name), w: 603, h: 1311, alt, device: 'phone' })

export default {
  // 기간은 아직 확인하지 못했습니다. 확인되면 period: '2026.00 – 2026.00'을 추가하세요.
  // 앱 확정 스타일 가이드의 색: Primary blue(브랜드), 먹색, 연한 배경, Secondary orange(포인트).
  // bright는 어두운 띠 위에서 쓰는 밝은 파랑(#649EFF, 스타일 가이드 blue-300)
  theme: { brand: '#374BFF', onBrand: '#FFFFFF', bright: '#649EFF', onBright: '#252525', dark: '#252525', light: '#F9FAFD', point: '#FF9524' },
  sides: {
    A: { name: '기획', note: '팀이 함께 조사하고 방향을 정한 과정' },
    B: { name: '내가 만든 화면', note: '홈 · 배심원 광장 · 후일담', image: { src: img('mockup'), w: 1600, h: 743, alt: '배심원 광장, 홈, 투표 결과, AI 판멍이 챗봇 화면을 나란히 놓은 목업' } },
  },
  sections: [
    {
      side: 'A', type: 'cards', tone: 'light',
      label: '문제 발견', kicker: 'Problem',
      title: '억울한데,\n누구에게 묻기는 부담스럽다',
      body: '관계·금전·약속처럼 일상에서 생기는 갈등은 판단이 서지 않아도 주변에 털어놓기 어렵습니다. 왈가왈BOT은 AI의 참고 의견과 사람들의 판단을 함께 보고 다음 행동을 정하도록 돕는 커뮤니티 웹앱입니다.',
      cards: [
        { kicker: '관계', title: '친구 축의금 10만원, 적당한가?' },
        { kicker: '금전', title: '친구에게 빌려준 300만원, 6개월째 미변제' },
        { kicker: '직장', title: '상사가 제 아이디어를 자신의 공로로 발표했어요' },
      ],
      source: '팀 IA에 정리한 사례',
    },
    {
      side: 'A', type: 'lead', tone: 'dark',
      label: '근거', kicker: 'Research',
      title: 'AI 판단은 궁금하지만,\n내 사연을 쓰긴 싫다',
      body: 'AI 결과에 관심 있다는 응답이 84.6%였지만, 민감한 사연을 직접 쓰겠다는 응답은 없었습니다. 대신 71.4%가 다른 사람의 사례부터 구경하고 싶다고 답했습니다.',
      chart: {
        groups: [
          { title: '설문 응답 비율', items: [
            { label: 'AI 결과에 관심', values: [84.6], emphasis: true },
            { label: '개인 상황을 말하기 부담', values: [83.3] },
            { label: '심각하면 전문가가 필요', values: [78.6] },
            { label: '사례부터 구경하고 싶음', values: [71.4], emphasis: true },
            { label: 'AI 편향·부정확성 우려', values: [57.1] },
            { label: '사연 노출 우려', values: [50] },
            { label: '민감한 사연을 직접 작성', values: [0], emphasis: true },
          ] },
        ],
      },
      source: '팀 설문(자료종합) — 개편 전 17명·개편 후 14명, 두 설문은 선택 방식이 달라 합산하지 않음',
    },
    {
      side: 'A', type: 'cards', tone: 'light',
      label: '사용자', kicker: 'Persona',
      title: '쓰고 싶은 사람과,\n보기만 하고 싶은 사람',
      body: '팀은 두 사용자의 여정으로 서비스를 설계했습니다. 한 명은 자기 사건을 올리고, 다른 한 명은 사연을 공개하지 않고 판단 근거만 모읍니다.',
      cards: [
        { kicker: '신규 사용자', title: '윤서아', body: '자신의 상황을 정리해 사건을 접수하고, 다른 사람의 관점과 이후 이야기를 참고한다.' },
        { kicker: '기존 사용자', title: '곽지훈', body: '민감한 사연을 공개하기보다 AI 의견, 챗봇, 비슷한 사례로 먼저 판단 근거를 모은다.', highlight: true },
      ],
    },
    {
      side: 'A', type: 'match', tone: 'brand',
      label: '설계 판단', kicker: 'Direction',
      title: '판결 대신,\n판단의 이유를 비교하게',
      status: 'intent',
      columns: ['설문에서 본 것', '서비스에서'],
      rows: [
        { problem: '민감한 사연은 쓰기 싫다', decision: '로그인이나 작성보다 사례 둘러보기를 먼저 두고, 투표하려는 순간에 가입하게' },
        { problem: 'AI 결과를 다 믿지는 않는다', decision: 'AI 의견에 근거와 양쪽 맥락을 함께 보여 주고, 배심원 결과와 달라도 숨기지 않게' },
        { problem: '사연이 알려질까 걱정된다', decision: 'AI만 보는 흐름과 공개 범위를 나누고, 공개를 강제하지 않게' },
        { problem: '심각한 상황은 전문가가 필요하다', decision: '챗봇과 전문가 도움 화면으로 이어지게' },
      ],
      source: '팀 기획 문서의 제품·안전 원칙',
    },
    {
      side: 'A', type: 'screens', tone: 'light',
      label: '내 역할', kicker: 'My Role',
      title: '개발 팀장으로,\n세 화면을 코드로',
      body: '개발 팀장을 맡아 홈, 배심원 광장, 후일담 화면을 개발했습니다. 브랜치 병합과 기능 통합을 맡았고, 밸런스 게임과 카테고리·정렬·페이지네이션도 손봤습니다.',
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
        { label: '페이지', image: phone('plaza-pages', '사건 카드 목록 아래 페이지 번호'), caption: '페이지로 나눈 목록' },
      ],
    },
    {
      side: 'B', type: 'screens', tone: 'brand',
      label: '핵심 기능 4', kicker: 'Feature 04',
      title: '투표가 끝나도\n이야기는 이어지게',
      body: '투표로 끝내지 않도록, 판결 뒤에 달라진 이야기를 남기고 읽는 공간을 만들었습니다.',
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
      title: '‘왜 써야 하는지’가\n잘 보이지 않았다',
      body: '발표에서 받은 피드백과, 그 뒤 팀이 정리한 방향입니다.',
      columns: ['받은 피드백', '정리한 방향'],
      rows: [
        { problem: '서비스를 쓰는 상황과 차별점이 충분히 전달되지 않는다', decision: '승패를 가르기보다 서로 다른 판단의 이유를 비교하고 다음 행동을 정하는 경험으로' },
      ],
      source: '발표 피드백',
    },
    {
      side: 'B', type: 'cards', tone: 'dark',
      label: '결과와 한계', kicker: 'Result',
      title: '화면은 완성했지만,\nAI는 아직 연결 전',
      body: '발표 버전은 준비된 시나리오로 화면과 인터랙션을 확인하는 단계입니다. 실제 AI 연동과 응답 품질, 실패 상태 검증은 다음 단계입니다.',
      cards: [
        { kicker: '확인된 것', title: '두 사용자 시나리오 시연', body: '윤서아(신규)와 곽지훈(기존)의 흐름이 배포된 웹앱에서 동작합니다.' },
        { kicker: '검증 전', title: 'AI 응답 품질과 실패 상태', body: '현재 AI 의견은 준비된 데이터입니다.' },
        { kicker: '검증 전', title: '실제 사용자의 반응', body: '[사용성 테스트 결과 입력]' },
      ],
    },
    {
      side: 'B', type: 'lead', label: '회고', kicker: 'Retrospective', hidden: true,
      title: '[제목 입력]',
      body: '[회고 입력]',
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
        { href: 'https://walgawal-bot.vercel.app/onboarding', label: '웹앱' },
        { href: 'https://www.figma.com/design/5msPuamjPpGJOUFl0OXBOX', label: 'Figma 화면' },
      ],
    },
  ],
}
