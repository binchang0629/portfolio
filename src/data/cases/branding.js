// 06 BRANDING — 이 카세트 포트폴리오를 만든 과정. 내용만 담는 파일입니다.
// 규칙: docs/케이스스터디_작성_규칙.md
// 출처: docs/디자인_정교화_기록.md, docs/에셋_가이드.md, docs/design-v*/(버전별 캡처와 측정 기록),
//       docs/asset-history/(버전마다 남긴 이전 파일), 수업 피드백. 숫자는 기록에 남은 측정값만 썼습니다.
const img = name => `/cases/branding/${name}.webp`

export default {
  // 테이프 색(라벤더)과 책상의 옅은 파랑. 라벤더는 흰 글씨가 약해 브랜드 띠는 deep 색을 씁니다
  theme: { brand: '#9A86C9', deep: '#6F5CA6', onBrand: '#FFFFFF', bright: '#C9BCEB', onBright: '#25233A', dark: '#25233A', light: '#F7F8FD', point: '#C9BCEB' },
  sides: {
    A: { name: '컨셉', note: '포트폴리오를 카세트로 만든 이유와 출발점' },
    B: { name: '만든 과정', note: '플레이어, 보관함, 읽는 화면을 다듬은 기록 · 제작 중' },
  },
  sections: [
    {
      side: 'A', type: 'lead', tone: 'light',
      label: '컨셉', kicker: 'Concept',
      title: '프로젝트 하나에\n테이프 하나',
      body: '소개와 프로젝트를 테이프 하나씩에 담았습니다. 테이프를 골라 플레이어에 넣고 재생하면 그 이야기가 열립니다.',
      image: { src: img('home'), w: 1440, h: 960, alt: '지금의 홈 화면. 옅은 파란 책상 가운데 흰 카세트 플레이어, 주위에 ABOUT ME, KOOKSOONDANG, WALGAWAL BOT, KORAIL, PLANT CARE 테이프, 왼쪽에 이메일 편지와 테이프 보관함, 오른쪽에 작업 노트' },
    },
    {
      side: 'A', type: 'compare', tone: 'dark', row: true,
      label: '출발점', kicker: 'Start',
      title: '한 장의 그림에서\n움직이는 책상으로',
      body: '처음 컨셉은 AI로 만든 한 장의 이미지였습니다. 글자와 사물이 그림에 붙어 있어서, 사물을 하나씩 떼어 내고 글자는 실제 텍스트로 다시 만들었습니다.',
      steps: [
        { label: '처음 컨셉 이미지', image: { src: img('concept'), w: 1536, h: 1024, alt: '처음 컨셉 이미지. 흰 책상 위 파스텔 카세트 다섯 개와 플레이어, 헤드셋, 화분, 커피, 노트. 제목과 메뉴 글자가 그림 속에 들어 있다' }, caption: '글자까지 그림에 들어간 한 장' },
        { label: '지금', image: { src: img('home'), w: 1440, h: 960, alt: '지금의 홈 화면. 끌어서 넣을 수 있는 테이프, 플레이어, 보관함과 실제 텍스트' }, caption: '사물마다 떼어 내 직접 움직이게' },
      ],
    },
    {
      side: 'A', type: 'compare', tone: 'light', row: true,
      label: '버전', kicker: 'Versions',
      title: '버전마다 남기며\n고쳐 나갔다',
      body: '고칠 때마다 이전 파일을 남겨 두었고, 버전 번호는 100을 넘었습니다. 시점, 보관함, 읽는 화면이 이렇게 바뀌었습니다.',
      steps: [
        { label: 'V23', image: { src: img('v23'), w: 1440, h: 960, alt: 'V23 화면. 크림색 책상, 큰 투명 보관함, 다섯 테이프' }, caption: '그림 속 글자를 텍스트로' },
        { label: 'V39', image: { src: img('v39'), w: 1440, h: 960, alt: 'V39 화면. 7칸 보관함에 테이프 다섯 개를 세워 꽂은 상태' }, caption: '7칸 보관함에 넣고 꺼내기' },
        { label: 'V58', image: { src: img('v58'), w: 1440, h: 960, alt: 'V58 화면. 왼쪽에 플레이어와 보관함, 오른쪽에 ABOUT ME 내용을 읽는 화면' }, caption: '재생하면 열리는 읽는 화면' },
      ],
    },
    {
      side: 'B', type: 'compare', tone: 'dark', row: true,
      label: '플레이어', kicker: 'Player',
      title: '플레이어는\n진짜 기계처럼',
      body: '테이프를 넣으면 릴이 감긴 양에 따라 돌고, 아래 테이프 띠도 재생·빨리 감기·되감기 방향과 속도로 움직입니다. 버튼은 눌린 모양이 보이는 기계식 키로 만들었습니다.',
      steps: [
        { label: '재생 키를 누른 상태 · V43', image: { src: img('player'), w: 800, h: 511, alt: '플레이어에 ABOUT ME 테이프가 들어가고 재생 키가 눌려 들어간 상태' }, caption: '눌린 키와 돌아가는 릴' },
        { label: '테이프 안쪽 · V35', image: { src: img('depth'), w: 850, h: 514, alt: '카세트 확대. 투명 케이스 안쪽에 릴과 검정 테이프 띠가 보인다' }, caption: '케이스 안에 들어간 릴과 띠' },
      ],
    },
    {
      side: 'B', type: 'match', tone: 'light',
      label: '디테일', kicker: 'Details',
      title: '어색한 곳은\n재서 고쳤다',
      body: '사진 같은 사물과 코드로 그린 부품이 어긋나는 곳을 하나씩 찾았습니다. 눈대중 대신 좌표와 크기를 재서 맞췄습니다.',
      columns: ['어색했던 점', '고친 방법'],
      rows: [
        { problem: '책상 위 테이프와 플레이어 안 테이프의 크기가 달랐다', decision: '플레이어 폭에서 같은 배율을 계산해, 릴 간격 차이를 0.005px 안으로 맞춤' },
        { problem: '테이프 띠가 케이스 표면에 붙어 보였다', decision: '뒷면, 릴과 띠, 투명 케이스, 라벨 순서로 다시 쌓음' },
        { problem: '평면 버튼이 사진 같은 본체와 어울리지 않았다', decision: '본체와 버튼을 하나의 이미지로 맞추고, 버튼 자리에 누를 수 있는 영역을 연결' },
        { problem: '끌고 가던 테이프가 플레이어 뒤로 숨었다', decision: '끄는 동안에는 테이프를 플레이어보다 앞에 표시' },
      ],
      source: 'docs/디자인_정교화_기록.md (V27, V33, V35, V37)',
    },
    {
      side: 'B', type: 'lead', tone: 'dark',
      label: '보관함', kicker: 'Storage',
      title: '꺼내면\n빈 케이스가 남는다',
      body: '테이프는 책상, 플레이어, 보관함 중 한 곳에만 있습니다. 보관함은 놓을 칸을 미리 보여 주고, 꺼낸 자리에는 빈 케이스가 남습니다.',
      image: { src: img('storage'), w: 850, h: 623, alt: '7칸 보관함. 다섯 칸에 테이프가 세워져 있고, 한 칸은 테이프를 꺼내 EMPTY 빈 케이스만 남아 있다', caption: 'V41 화면 · 테이프 이름은 그때 쓰던 이름입니다' },
    },
    {
      side: 'B', type: 'match', tone: 'light',
      label: '피드백', kicker: 'Feedback',
      title: '써 본 사람이 멈춘 곳을\n다시 고쳤다',
      body: '수업에서 받은 피드백을 화면에 바로 반영했습니다.',
      columns: ['받은 피드백', '바꾼 것'],
      rows: [
        { problem: '테이프를 어디에 넣어야 할지 모르겠다', decision: '빈 플레이어의 뚜껑이 들렸다 내려가며 넣을 곳을 알려 줌' },
        { problem: '넣은 뒤 무엇을 눌러야 할지 모르겠다', decision: '재생 키 안쪽에 빛이 돌고 눌리는 모양을 반복' },
        { problem: '글이 중간에서 잘려 내려가 AI가 쓴 것 같다', decision: '칸 너비를 재서 문장 단위로 줄을 나누는 규칙을 만듦' },
        { problem: '상세 페이지가 AI가 만든 것처럼 보인다', decision: '박스 카드와 알약 태그를 빼고, 색 띠와 큰 화면 위주로 다시 구성' },
      ],
      source: '수업 피드백',
    },
    {
      side: 'B', type: 'lead', tone: 'dark',
      label: '읽는 화면', kicker: 'Reader',
      title: '읽는 화면은\n문장이 끊기지 않게',
      body: '재생하면 왼쪽에는 플레이어가 남고, 오른쪽에 프로젝트 이야기가 색 띠로 이어집니다. 한 줄에 들어가는 문장은 그대로 두고, 넘치는 문장만 쉼표에서 나눕니다.',
      image: { src: img('reader'), w: 1440, h: 960, alt: '읽는 화면. 왼쪽에 WALGAWAL BOT 테이프가 들어간 플레이어와 보관함, 오른쪽에 처음 질문과 고친 질문을 비교하는 어두운 띠' },
    },
    {
      side: 'B', type: 'cards', tone: 'light',
      label: 'AI 활용', kicker: 'AI',
      title: 'AI로 만들고,\n직접 고르고 고쳤다',
      body: '사물 이미지와 구현에 AI를 썼습니다. 무엇을 남기고 고칠지는 화면을 보며 직접 정했습니다.',
      cards: [
        { kicker: '이미지', title: '사물 이미지 생성', body: '책상, 카세트, 플레이어 이미지를 AI로 만들고 프롬프트와 이전 파일을 남겼다' },
        { kicker: '구현', title: 'AI 코딩 도구와 함께', body: '드래그, 보관, 재생 상태와 읽는 화면을 React와 CSS로 만들었다' },
        { kicker: '판단', title: '원근과 구조는 직접', body: '시점, 카세트 구조, 크기를 캡처로 비교하며 여러 차례 고쳤다' },
      ],
    },
    {
      side: 'B', type: 'cards', tone: 'brand',
      label: '남은 작업', kicker: 'Next',
      title: '아직\n만드는 중',
      body: '포트폴리오도 프로젝트와 함께 계속 고치고 있습니다.',
      status: 'unverified',
      cards: [
        { kicker: '콘텐츠', title: '작업 중인 두 프로젝트', body: '코레일과 플랜잇의 최종 화면 넣기' },
        { kicker: '모바일', title: '읽고 이동하는 흐름', body: '작은 화면에서 테이프를 고르고 읽는 과정 다듬기' },
        { kicker: '소리', title: '실제 음원은 아직', body: '지금 재생 버튼은 이야기와 릴 움직임만 제어한다' },
      ],
    },
  ],
}
