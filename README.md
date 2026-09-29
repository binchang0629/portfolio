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
- 프로젝트 카드 미리보기: `public/projects/<id>`에 `preview.mp4`(무음 H.264 녹화)와 `poster.webp`를 두고 projects.js 항목에 `preview`를 등록합니다. 카드에 마우스를 올리면 재생되고, 터치 화면에서는 보이는 카드가 재생됩니다. `preview`가 없으면 "작업 화면 준비 중" 자리를 표시합니다.
- `docs/projects`: 개인 작업의 근거와 진행 기록.
- `docs/에셋_가이드.md`: 실제 파일 목록, 편집 범위와 추가 작업 등록 방법.
- `docs/디자인_정교화_기록.md`: 시각 변경과 에셋 구조, 남은 과제.

보관함은 현재 비어 있습니다. 추가할 실제 작업은 archiveTracks 배열에 등록합니다. 항목은 기존 테이프처럼 id·number·title·subtitle·tint·winding·x·y·rotate·heading·summary·sections를 갖습니다. id는 고유해야 하며 x·y는 1536×1024 책상에서 꺼낸 테이프의 위치입니다. 보관함에서 꺼내면 책상에 놓이고, 플레이어에서 꺼내면 보관함으로 반납합니다.

## 에셋

사물의 사실적인 PNG 재질에 SVG 마스크·코일·스티커와 실제 텍스트를 결합했습니다. 모든 사물이 순수 벡터인 것은 아닙니다. 전체 시안 한 장을 인터페이스로 사용하지 않습니다.

이전 시작 파일은 docs의 starter 폴더에 보관합니다.

현재 사용 에셋은 public/assets의 background·cassette·player 폴더에 정리했습니다. 코드에서 쓰는 경로는 src/assets/index.js, 마스크는 src/assets의 사물별 폴더에서 관리합니다. 이전 원본과 시안은 docs/asset-history에 보존합니다.

V29에서는 CassetteSurface.jsx와 public/assets/cassette/topview의 공통 탑뷰 카세트를 책상 및 삽입 상태에 함께 사용합니다. 삽입은 두 릴 축에 맞춘 균일 배율만 적용하고, 늘리거나 별도 원근을 주지 않습니다. 흰 플레이어 본체와 기계식 버튼은 기존 공통 렌더를 유지하며 버튼 위에는 투명 클릭 영역을 놓습니다. ArchiveTray.jsx는 보관함의 바닥·추가 작업의 얇은 등 부분·안쪽 그림자·윗테두리·칸막이를 분리합니다. 새 에셋은 public/assets/cassette/topview, archive, background에 있고 좌표는 src/assets/cassette/topview-geometry.js와 player/coherent-geometry.js에서 관리합니다.


V31의 릴은 TopViewHub.jsx에서 동심원·회전 톱니와 고정 표면 조명을 분리합니다. 이전처럼 입체 허브 사진과 반사 전체를 회전하지 않습니다. 동작 검수와 제작 기록은 docs/design-v31에 있습니다.
