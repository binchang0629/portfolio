# 정창빈 · 카세트 포트폴리오

Vite + React + JavaScript + CSS로 만드는 파스텔 책상 포트폴리오입니다.

## 실행

```sh
npm run dev
```

작업 확인: `npm run check:assets`, `npm run lint`, `npm run build`.

## 화면 구성

테이프 5개를 누르거나 플레이어로 끌어 넣은 뒤 재생하면 해당 이야기가 열립니다. 삽입된 테이프는 책상에서 사라지며 꺼내면 돌아옵니다. 정지·빨리 감기·되감기는 릴과 코일을 제어합니다. 배치 초기화는 이동한 테이프도 처음 위치로 돌립니다.

모바일은 테이프를 세로로 나열하고 눌러 선택합니다. 실제 음원 재생은 연결하지 않았습니다.

## 콘텐츠 수정

- `src/data/portfolio.js`: 다섯 카테고리와 작업 노트, 보관함 추가 작업.
- `src/data/projects.js`: 팀·개인 프로젝트 소개.
- `docs/projects`: 개인 작업의 근거와 진행 기록.
- `docs/에셋_가이드.md`: 실제 파일 목록, 편집 범위와 추가 작업 등록 방법.
- `docs/디자인_정교화_기록.md`: 시각 변경과 에셋 구조, 남은 과제.

보관함은 현재 비어 있습니다. 추가할 실제 작업은 archiveTracks 배열에 등록합니다. 항목은 기존 테이프처럼 id·number·title·subtitle·tint·winding·x·y·rotate·heading·summary·sections를 갖습니다. id는 고유해야 하며 x·y는 1536×1024 책상에서 꺼낸 테이프의 위치입니다. 보관함에서 꺼내면 책상에 놓이고, 플레이어에서 꺼내면 보관함으로 반납합니다.

## 에셋

사물의 사실적인 PNG 재질에 SVG 마스크·코일·스티커와 실제 텍스트를 결합했습니다. 모든 사물이 순수 벡터인 것은 아닙니다. 전체 시안 한 장을 인터페이스로 사용하지 않습니다.

이전 시작 파일은 docs의 starter 폴더에 보관합니다.

현재 사용 에셋은 public/assets의 background·cassette·player 폴더에 정리했습니다. 코드에서 쓰는 경로는 src/assets/index.js, 마스크는 src/assets의 사물별 폴더에서 관리합니다. 이전 원본과 시안은 docs/asset-history에 보존합니다.

플레이어는 IntegratedPlayer.jsx에서 하나의 일관된 렌더 재질을 사용합니다. 본체·테이프·물리 버튼·유리 문틀의 시점을 공유하고, 같은 렌더의 흰 허브를 분리해서 회전합니다. 버튼은 실제 렌더의 키 위치에 놓인 투명 클릭 영역입니다. 에셋은 public/assets/player/coherent, 좌표는 src/assets/player/coherent-geometry.js에서 관리합니다.

