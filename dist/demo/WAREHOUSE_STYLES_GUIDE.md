# 창고 시각화 CSS 통합 가이드

## 개요
`warehouse-styles.js` 파일은 **Type A (카드 방식)** 과 **Type B (매트릭스 방식)** 에서 공통으로 사용하는 창고 시각화 CSS를 제공합니다.

이 CSS는 입고 처리, 출고 처리, 재고 리스트 3개 화면에서 모두 사용 가능합니다.

---

## 파일 구성

- `warehouse-styles.js` — 모든 창고 시각화 클래스 포함 (다크/라이트 테마 지원)
- `shared.js` — 기본 CSS 변수, 사이드바, 헤더, 테이블 등 공통 스타일
- 각 HTML 파일 — 창고 시각화 전용 스타일

---

## Type A: 랙 카드 방식 (평면 그리드)

### 핵심 클래스

```css
.wh3d-container        /* 창고 컨테이너 */
.rack-card             /* 개별 랙 카드 */
.rack-card.selected    /* 선택된 랙 카드 */
.rack-card-header      /* 카드 헤더 */
.rack-card-no          /* 랙 번호 */
.rack-card-lot         /* Lot 배지 */
.rack-cell-grid        /* 셀 그리드 */
.rc                    /* 개별 셀 (height: 9px) */
.rc-empty              /* 빈 셀 */
.rc-filled             /* 채워진 셀 (인디고) */
.rc-highlight          /* 하이라이트 셀 (cyan) */
```

### 상세 뷰 (슬롯 그리드)

```css
.slot-grid             /* 슬롯 그리드 */
.slot                  /* 개별 슬롯 (60x60px) */
.slot-empty            /* 빈 슬롯 */
.slot-filled           /* 가득 찬 슬롯 */
.slot-selected         /* 선택된 슬롯 */
```

### 색상 스펙 (다크 테마)

| 클래스 | 배경색 | 텍스트색 |
|-------|--------|---------|
| rc-empty | var(--bg-surface) | rgba(30,58,95,0.45) |
| rc-filled | rgba(55,48,163,0.35) | #6366F1 |
| rc-highlight | rgba(0,212,255,0.5) | var(--cyan) |

---

## Type B: 매트릭스 방식 (테이블 그리드)

### 핵심 클래스

```css
.matrix-scroll         /* 매트릭스 스크롤 컨테이너 (--rm-cell-size 변수 사용) */
.rack-matrix           /* 테이블 */
.label-cell            /* 라벨 컬럼 (sticky left) */
.rm-cell               /* 개별 셀 (aspect-ratio: 1/1) */
.rm-na                 /* 셀 없음 (NA) */
.rm-empty              /* 빈 셀 */
.rm-fill-1/.rm-fill-2/.rm-fill-3  /* 점유율 1/3, 2/3, 3/3 */
.rm-full               /* 완전히 가득 참 */
.rm-selected           /* 선택된 셀 */
.rm-occupied           /* 점유된 셀 (출고 전용) */
```

### FIFO 색상 (출고 전용)

```css
.rm-fifo1              /* FIFO 1순위 (빨강) */
.rm-fifo2              /* FIFO 2순위 (주황) */
.rm-fifon              /* FIFO n순위 (청색) */
```

### 셀 크기 규칙

모든 창고의 셀 크기를 통일하기 위해 다음과 같이 설정합니다:

```javascript
// 전체 창고 중 최대 랙 수 기준
const maxRackCount = Math.max(
  ...warehouses.map(w => racks.filter(r => r.warehouse_id === w.id).length)
);

const scrollEl = document.querySelector('.matrix-scroll');
if (scrollEl && maxRackCount > 0) {
  const available = scrollEl.clientWidth - 60; // 라벨 컬럼 너비 제외
  const cellSize = Math.max(36, Math.floor(available / maxRackCount));
  scrollEl.style.setProperty('--rm-cell-size', cellSize + 'px');
}
```

### 색상 스펙 (다크 테마 기준)

| 클래스 | 배경색 | 텍스트색 |
|-------|--------|---------|
| rm-na | #030A14 | #0D1F35 |
| rm-empty | #05101C | #1E3A5F |
| rm-fill-1 | rgba(30,80,200,0.2) | #7BAAE8 |
| rm-fill-2 | rgba(30,80,200,0.4) | #AACCF8 |
| rm-fill-3 | rgba(30,80,200,0.65) | #D0E4FF |
| rm-full | rgba(30,80,200,0.88) | #EFF6FF |
| rm-selected | rgba(0,212,255,0.22) | var(--cyan) |
| rm-fifo1 | rgba(239,68,68,0.5) | #FCA5A5 |
| rm-fifo2 | rgba(245,158,11,0.4) | #FCD34D |
| rm-fifon | rgba(0,212,255,0.25) | var(--cyan) |

---

## 공통 요소

### 창고 탭

```css
.wh-tabs-row           /* 탭 행 */
.wh-tab                /* 개별 탭 */
.wh-tab.active         /* 활성 탭 */
```

### 예정 목록 (가로 스크롤)

```css
.sched-section         /* 예정 섹션 */
.sched-scroll          /* 스크롤 컨테이너 */
.sched-card            /* 예정 카드 */
.sched-card.selected   /* 선택된 카드 */
.sched-card-name       /* 상품명 */
.sched-card-meta       /* 메타 정보 */
.sched-note            /* 특수 노트 */
```

### 액션 바

```css
.action-bar            /* 액션 바 */
.action-info           /* 액션 정보 */
.action-highlight      /* 강조 텍스트 */
.dan-selector          /* 단 선택 버튼 그룹 */
.dan-btn               /* 단 선택 버튼 */
.dan-btn.active        /* 활성 버튼 */
.dan-btn.occupied      /* 점유된 버튼 (비활성화) */
.btn-exec              /* 실행 버튼 */
```

### 셀 상세 패널

```css
.cell-details          /* 셀 상세 패널 */
.cell-details .cd-empty   /* 빈 상태 메시지 */
.cell-details .cd-header  /* 패널 헤더 */
.cell-details .cd-table-wrap  /* 테이블 래퍼 */
.cd-table              /* 상세 테이블 */
.cd-dan-header         /* 단별 헤더 */
```

### 통계 바

```css
.stats-bar             /* 통계 바 */
.stat-item             /* 통계 항목 */
.stat-label            /* 통계 라벨 */
.stat-value            /* 통계 값 */
.stat-unit             /* 통계 단위 */
```

### 범례 (Type A 전용)

```css
.legend                /* 범례 컨테이너 */
.legend-item           /* 범례 항목 */
.legend-box            /* 범례 박스 */
```

---

## HTML 파일 통합 방법

### 1. 스크립트 추가

HTML의 `<head>` 섹션에 warehouse-styles.js를 추가합니다:

```html
<script src="shared.js"></script>
<script src="warehouse-styles.js"></script>
<style id="commonStyle"></style>
<style id="warehouseStyle"></style>
```

### 2. JavaScript에서 스타일 주입

HTML의 `<body>` 시작 부분에서:

```javascript
// 공통 스타일 주입
document.getElementById('commonStyle').textContent = getCommonStyles();

// 창고 시각화 스타일 주입
document.getElementById('warehouseStyle').textContent = getWarehouseStyles();
```

### 3. 현재 구조 (기존 방식)

현재 각 HTML 파일에는 inline `<style>` 태그에 창고 시각화 CSS가 하드코딩되어 있습니다. 
이를 warehouse-styles.js로 추출하면 다음과 같은 이점이 있습니다:

- 중복 코드 제거 (Type A, Type B 간 공통 클래스 재사용)
- 유지보수 용이성 증대
- 테마 변경 시 중앙 집중식 관리

---

## 테마 지원

warehouse-styles.js는 다크/라이트 테마를 모두 지원합니다.

### 다크 테마 (기본값)
- 배경: 청감 (dark blue-gray)
- 텍스트: 밝은 청색 (#E8F0FE)
- 강조색: Cyan (#00D4FF)

### 라이트 테마
- 배경: 밝은 회색-청색
- 텍스트: 어두운 청색 (#1E293B)
- 강조색: 파랑 (#0284C7)

라이트 테마 적용 시, CSS는 `[data-theme="light"]` 셀렉터를 통해 자동으로 색상을 오버라이드합니다.

---

## 호버 효과 및 애니메이션

### Type A: 랙 카드
- `:hover` — 배경색 변경, 테두리 밝아짐
- `.selected` — Cyan 테두리, 글로우 효과

### Type B: 매트릭스 셀
- `:hover` — brightness(1.4) 필터, scale(1.08) 확대
- `.rm-selected` — Cyan 아웃라인, 배경색 변경

---

## 폰트 설정

모든 창고 시각화 요소는 다음 폰트 스택을 사용합니다:

```css
font-family: 'JetBrains Mono', monospace;  /* 셀 내용, 라벨 */
```

상위 텍스트는 shared.js의 기본 폰트('Noto Sans KR')를 상속합니다.

---

## 색상 변수 (CSS Custom Properties)

warehouse-styles.js는 shared.js에서 정의한 CSS 변수를 활용합니다:

```css
--bg-base              /* 배경 기본색 */
--bg-panel             /* 패널 배경 */
--bg-surface           /* 표면 배경 */
--bg-hover             /* 호버 배경 */
--border               /* 테두리 색 */
--border-bright        /* 밝은 테두리 */
--cyan                 /* Cyan 강조색 */
--cyan-dim             /* Cyan 차분한 버전 */
--cyan-glow            /* Cyan 글로우 */
--amber                /* Amber 강조색 */
--text-primary         /* 기본 텍스트 색 */
--text-secondary       /* 보조 텍스트 색 */
```

---

## 반응형 설계

### 다양한 해상도 지원
- Type B 매트릭스: `--rm-cell-size` 변수를 동적으로 조정하여 모든 랙을 화면 폭에 맞춤
- Type A 카드: 그리드 컬럼 수(`grid-template-columns`)를 동적으로 조정

### 스크롤 처리
- 매트릭스: 좌측 라벨 컬럼 sticky, 상단 헤더 sticky
- 예정 목록: 가로 스크롤, 사용자 정의 스크롤바

---

## CSS 클래스 네이밍 규칙

- `rc-*` — Type A 랙 셀
- `rm-*` — Type B 랙 매트릭스 셀
- `sched-*` — 예정 목록 요소
- `stat-*` — 통계 바 요소
- `cd-*` — 셀 상세 패널 요소
- `dan-*` — 단 선택 요소
- `wh-*` — 창고 관련 요소 (탭, 컨테이너)

---

## 추가 참고

- 다크 테마 색상은 대비도(contrast)를 고려하여 선정됨
- 라이트 테마 색상은 밝은 배경에서의 가독성을 우선함
- 모든 hover 효과는 transition으로 부드럽게 처리됨
- 선택된 요소는 outline + background의 이중 강조를 사용
