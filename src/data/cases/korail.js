// 코레일 홈페이지 리디자인 케이스 스터디 (작업 중) — 내용만 담는 파일입니다.
// 규칙: docs/케이스스터디_작성_규칙.md
// 출처: docs/projects/개인_웹사이트.md(이력서 기록). 조사 인원·기간·수치와 실제 화면은 아직 옮기지 않았습니다.
export default {
  // 코레일 파랑 계열의 임시 색입니다. 작업 중인 스타일 가이드 색이 정해지면 바꿉니다
  theme: { brand: '#1F57A8', onBrand: '#FFFFFF', bright: '#8DB8F5', onBright: '#1C2330', dark: '#1C2330', light: '#F7F9FC', point: '#8DB8F5' },
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
      label: '진행한 작업', kicker: 'Process',
      title: '조사한 것을\n화면의 뼈대로',
      body: '찾은 문제를 바탕으로 페르소나, 사용자 여정, 와이어프레임을 만들었습니다.',
      cards: [
        { kicker: '01', title: '설문조사 · 인터뷰' },
        { kicker: '02', title: '페르소나' },
        { kicker: '03', title: '사용자 여정' },
        { kicker: '04', title: '와이어프레임' },
      ],
    },
    {
      side: 'A', type: 'cards', tone: 'brand',
      label: '추가 중', kicker: 'Next',
      title: '바꾼 화면은\n지금 추가하는 중',
      body: '와이어프레임을 바탕으로 실제 화면을 만들고 있습니다. 문제마다 무엇을 바꿨는지 화면과 함께 이어서 정리합니다.',
      cards: [
        { kicker: '추가 중', title: '매진 정보 화면' },
        { kicker: '추가 중', title: '비회원 예매 진입' },
        { kicker: '추가 중', title: '좌석 선택' },
      ],
    },
  ],
}
