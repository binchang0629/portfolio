// 코레일 홈페이지 리디자인 케이스 스터디 (작업 중) — 내용만 담는 파일입니다.
// 규칙: docs/케이스스터디_작성_규칙.md
// 출처: 개인 Figma(기획 페이지 — 린 프로덕트 캔버스, 퍼소나 / 와이어프레임 페이지 / 디자인 페이지 — 작업 중인 시안),
//       docs/projects/개인_웹사이트.md(이력서 기록). 디자인은 최종안이 아닙니다.
//       기획 메모의 시장 통계(내일로 판매 감소 등)는 원문 확인 전이라 쓰지 않았습니다.
const img = name => `/cases/korail/${name}.webp`

export default {
  // 시안의 색: 예매 버튼 파랑, 푸터 남색, 아주 옅은 파랑 배경. bright는 어두운 띠 위의 파랑
  theme: { brand: '#255EFF', onBrand: '#FFFFFF', bright: '#8FAEFF', onBright: '#1B1D33', dark: '#2E2F48', light: '#FAFCFF', point: '#8FAEFF' },
  sides: {
    A: { name: '기획', note: '조사에서 찾은 문제와 가설' },
    B: { name: '디자인 시안', note: '작업 중 · 최종 디자인은 아직 정하지 않았습니다' },
  },
  sections: [
    {
      side: 'A', type: 'cards', tone: 'light',
      label: '문제 발견', kicker: 'Problem',
      title: '표를 사는 길에서\n세 군데가 막힌다',
      body: '설문조사와 인터뷰로 열차를 예매할 때 겪는 불편을 모았습니다. 크게 세 가지 문제가 나왔습니다.',
      cards: [
        { kicker: '01', title: '매진 정보가 헷갈린다', body: '좌석과 차량의 매진 정보를 이해하기 어렵다' },
        { kicker: '02', title: '비회원 예매를 찾기 어렵다', body: '어디서 시작해야 하는지 잘 보이지 않는다' },
        { kicker: '03', title: '좌석 고르기가 불편하다', body: '좌석을 선택하는 과정이 번거롭다' },
      ],
      source: '설문조사, 인터뷰',
    },
    {
      side: 'A', type: 'cards', tone: 'dark',
      label: '사용자', kicker: 'Persona',
      title: '세 사람이\n서로 다른 곳에서 멈춘다',
      body: '가끔 KTX를 타는 사람, 자유여행을 좋아하는 대학생, 외국인 관광객을 퍼소나로 정했습니다.',
      cards: [
        { kicker: '박민수 · 48세 · 비정기 KTX 이용자', title: '예매 단계가 복잡하다', body: '할인 혜택을 찾기 어렵고, 원하는 기능을 찾으려 여러 화면을 오간다' },
        { kicker: '김서연 · 24세 · 대학생', title: '여행 상품을 찾기 어렵다', body: '자유여행을 좋아하지만 여행 상품과 내일로 정보가 흩어져 있다', highlight: true },
        { kicker: 'Emily · 28세 · 외국인 관광객', title: '해외 카드 결제가 막힌다', body: '결제 오류와 번역 부족 때문에 공식 채널 대신 다른 예약 사이트를 쓴다' },
      ],
      source: '가상 퍼소나 · 린 프로덕트 캔버스',
    },
    {
      side: 'A', type: 'cards', tone: 'brand',
      label: '가설', kicker: 'Hypothesis',
      title: '빠른 예매를\n가장 먼저',
      body: '린 프로덕트 캔버스로 가설을 세우고 순서를 정했습니다. 아직 검증하지 않은 가설입니다.',
      status: 'unverified',
      cards: [
        { kicker: '1순위', title: '빠른 예매', body: '메인에서 출발역, 도착역, 날짜, 인원만 넣고 바로 예매로' },
        { kicker: '2순위', title: '나에게 맞는 할인', body: '결제할 때 맞는 할인을 찾아 보여 주고 적용' },
        { kicker: '3순위', title: '자유여행과 글로벌 예약', body: 'KTX와 숙소·렌터카 조합, 해외 결제 수단과 다국어' },
      ],
      source: '린 프로덕트 캔버스',
    },
    {
      side: 'B', type: 'compare', tone: 'light',
      label: '메인 예매', kicker: 'Main',
      title: '예매 칸은 줄이고,\n표처럼 보이게',
      body: '와이어프레임에서는 시간과 좌석까지 메인에서 입력했습니다. 시안에서는 출발역, 도착역, 날짜, 인원만 남기고 승차권 모양으로 바꿨습니다.',
      status: 'intent',
      steps: [
        { label: '와이어프레임', image: { src: img('wireframe'), w: 1600, h: 1200, alt: '메인 와이어프레임. 큰 이미지 위의 예매 카드에 출발역, 도착역, 출발일, 시간, 인원, 좌석 입력과 예매하기 버튼' }, caption: '입력 여섯 개가 들어간 예매 카드' },
        { label: '디자인 시안', image: { src: img('main'), w: 1600, h: 1330, alt: '메인 시안. 철길 사진과 코레일_잇다 문구 아래 승차권 모양의 티켓 예약하기 칸(출발, 도착, 날짜, 인원, search journey 버튼)' }, caption: '네 가지만 넣는 승차권 모양 예매 칸' },
      ],
    },
    {
      side: 'B', type: 'lead', tone: 'dark',
      label: '할인과 여행', kicker: 'Offers',
      title: '할인과 여행 상품을\n첫 화면에서',
      body: '메인 예매 칸 바로 아래에 나에게 맞는 할인 상품과 여행 인기 상품을 두었습니다. 여행 상품을 파는지도 몰랐다는 메모에서 출발했습니다.',
      status: 'intent',
      image: { src: img('offers'), w: 1600, h: 1170, alt: '나에게 맞는 할인 상품 찾기(온라인특가, 청소년 드림, 힘내라청춘, 4인동반석, 단체할인)와 기차타고 떠나자 여행 인기 상품 카드 네 개' },
    },
    {
      side: 'B', type: 'annotated', tone: 'light',
      label: '승차권 예매', kicker: 'Reservation',
      title: '조회부터 결제 금액까지\n한 화면에서',
      body: '날짜와 시간, 열차, 좌석, 할인을 한 화면에서 고릅니다. 적용할 수 있는 할인과 할인된 금액은 예매하기 버튼 바로 위에 보여 줍니다.',
      status: 'intent',
      image: { src: img('reservation'), w: 1600, h: 1175, alt: '승차권 예매 시안. 달력과 출발 시간 선택, 서울에서 부산 열차 목록, 매진 열차 숨김 체크, 오른쪽에 일반실·특실 요금, 인원, 좌석, 적용 가능한 할인, 할인된 가격과 예매하기 버튼', caption: '화면 속 시간과 요금은 예시 값입니다' },
      notes: [
        { x: 60, y: 23, title: '날짜와 출발 시간을 먼저 고른다' },
        { x: 55.5, y: 45.8, title: '매진 열차는 숨겨서 볼 수 있다' },
        { x: 57, y: 76, title: '적용할 수 있는 할인을 찾아 보여 준다' },
        { x: 57, y: 89, title: '할인된 금액은 예매 버튼 바로 위에' },
      ],
    },
    {
      side: 'B', type: 'compare', tone: 'dark',
      label: '역과 좌석', kicker: 'Station · Seat', row: true,
      title: '역과 좌석은\n창을 띄워 고른다',
      body: '역은 자주 이용하는 역과 초성 검색으로 찾습니다. 좌석 창은 호차마다 남은 좌석 수와 매진을 먼저 보여 줍니다.',
      status: 'intent',
      steps: [
        { label: '기차역 조회', image: { src: img('station'), w: 600, h: 800, alt: '기차역 조회 창. 초성 검색 칸, 자주 이용하는 역, 지역별·가나다 순 탭과 수도권 역 목록' }, caption: '자주 가는 역과 초성 검색' },
        { label: '좌석 선택', image: { src: img('seat'), w: 900, h: 655, alt: '좌석 선택 창. 1호차부터 14호차까지 남은 좌석 수와 매진 표시, 순방향·역방향·매진·콘센트 범례, 12호차 좌석 배치도에서 6A·6B 선택' }, caption: '호차별 남은 좌석과 매진 표시' },
      ],
    },
    {
      side: 'B', type: 'cards', tone: 'brand',
      label: '다음 작업', kicker: 'Next',
      title: '최종 디자인은\n아직 정하는 중',
      body: '지금 화면은 작업 중인 시안입니다. 아래 작업을 이어서 정리할 예정입니다.',
      status: 'unverified',
      cards: [
        { kicker: '디자인', title: '최종 시안 정하기', body: '메인과 예매 화면의 톤과 구성' },
        { kicker: '설계', title: '비회원 예매와 모바일', body: '조사에서 나온 문제와 작은 화면' },
        { kicker: '검증', title: '빠른 예매 가설', body: '예매가 실제로 쉬워졌는지 확인하기' },
      ],
    },
    {
      side: 'B', type: 'links', tone: 'light',
      label: '자료', kicker: 'Links',
      title: '직접 보기',
      links: [
        { href: 'https://www.figma.com/design/PdUlcuZSsyY76nAxn01Amx?node-id=224-2017', label: '디자인 시안' },
        { href: 'https://www.figma.com/design/PdUlcuZSsyY76nAxn01Amx?node-id=101-86', label: '기획' },
      ],
    },
  ],
}
