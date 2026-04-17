# WMS 창고 시각화(랙 맵) — 통일된 와이어프레임 스펙

**목적**: 입고처리, 출고처리, 재고리스트 화면에서 창고 랙 시각화의 UI/UX를 통일하고, 퍼블리셔가 바로 구현할 수 있는 상세 스펙 제공.

**작성 기준**: 기존 Type B(매트릭스) 구현 + inventory.html의 Type A(랙 카드) 부분 구현을 통합하여 두 방식 모두 3개 화면에 동일하게 적용 가능하도록 정의.

---

## 1. 상위 레이아웃 구조

### 1.1 공통 화면 섹션 (모든 화면 동일)

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEADER BAR (고정)                         │
│   [페이지 제목]                    [뷰 토글 버튼] (재고만)     │
└─────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│ WAREHOUSE TABS (고정)                      ← Flex, 가로 스크롤 │
│ [완제품창고] [부자재창고] [전동랙창고]                          │
├─────────────────────────────────────────────────────────────────┤
│ SCHEDULE SECTION (flex-shrink: 0)      ← 입고/출고만, 고정높이 │
│ [상품1 카드] [상품2 카드] [상품3 카드]  [→ 가로 스크롤 가능]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                    MATRIX SECTION (flex: 1)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ACTION BAR (flex-shrink: 0)                              │   │
│  │ [액션 정보] ... [실행 버튼]                             │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ WAREHOUSE VISUALIZATION (flex: 1, overflow: auto)        │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  [Type A 랙 카드 그리드] 또는 [Type B 매트릭스]   │ │   │
│  │  │  (창고 타입에 따라 선택 — .warehouse-type 속성)  │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ CELL DETAILS PANEL (flex: 0 0 auto, height: 200px)       │   │
│  │ [선택 셀의 상세 정보 테이블]                           │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ STATS BAR (flex-shrink: 0)                               │   │
│  │ [현재 입고] [잔여 공간] [전체 용량] 또는 기타 통계      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**세로 레이아웃 비율**:
- Header: 고정 약 50px
- Warehouse Tabs: 고정 약 40px
- Schedule Section: 고정 약 60px (입고/출고만)
- Matrix Section: 나머지 공간 (flex: 1)
  - Action Bar: 고정 약 35px
  - Visualization: 가변
  - Cell Details: 고정 200px
  - Stats Bar: 고정 약 40px

---

## 2. 창고 탭 (Warehouse Tabs)

### 2.1 HTML 구조
```html
<div class="wh-tabs-row">
  <button class="wh-tab" data-warehouse-id="1">완제품창고</button>
  <button class="wh-tab active" data-warehouse-id="2">부자재창고</button>
  <button class="wh-tab" data-warehouse-id="3">전동랙창고</button>
</div>
```

### 2.2 CSS 변수 및 스타일

**CSS 변수**:
```css
--wh-tab-padding: 4px 12px
--wh-tab-font-size: 0.8rem
--wh-tab-border-radius: 5px
--wh-tab-gap: 6px
--wh-tab-height: 32px
```

**상태별 스타일**:
| 상태 | 배경색 | 텍스트색 | 보더 | 폰트가중 |
|------|--------|---------|------|----------|
| 비활성 | `var(--bg-surface)` | `var(--text-secondary)` | `var(--border)` | 400 |
| 활성 | `var(--cyan)` | `#000` | `var(--cyan)` | **700** |
| Hover (비활성) | `var(--bg-hover)` | `var(--text-secondary)` | `var(--border-bright)` | 400 |

**반응형 규칙**:
- 모바일(<768px): 스크롤 가능 (`overflow-x: auto`), 각 탭 최소 너비 80px
- 데스크톱: Flex wrap 없음, 고정 배치

---

## 3. 예정 목록 섹션 (Schedule Section) — 입고/출고만

### 3.1 HTML 구조
```html
<div class="sched-section">
  <div class="sched-scroll">
    <div class="sched-card selected">
      <div class="sched-card-name">일반 밴드 20매입</div>
      <div class="sched-card-meta">
        <span>2400개</span>
        <span>2026-04-17</span>
        <span class="sched-note">자사 생산</span>
      </div>
    </div>
    <div class="sched-card">
      <!-- ... -->
    </div>
  </div>
</div>
```

### 3.2 카드 스타일

**카드 컨테이너**:
- 최소 너비: 130px
- 패딩: 7px 11px
- 보더 반경: 6px
- 보더: 1px `var(--border)`
- 배경: `var(--bg-surface)`
- 커서: pointer
- Transition: all 0.15s

**상태별 스타일**:
| 상태 | 배경색 | 보더색 | 카드명 색상 |
|------|--------|--------|-----------|
| 일반 | `var(--bg-surface)` | `var(--border)` | `var(--text-primary)` |
| Hover | `var(--bg-hover)` | `var(--border-bright)` | `var(--text-primary)` |
| Selected | `var(--cyan-dim)` | `var(--cyan)` | **`var(--cyan)`** |

**텍스트 스타일**:
- 카드명: 0.82rem, 700, `var(--text-primary)`
- 메타: 0.7rem, 400, `var(--text-secondary)`
  - note: 색상 `var(--amber)`, 가중 600

---

## 4. 액션 바 (Action Bar)

### 4.1 HTML 구조
```html
<div class="action-bar">
  <div class="action-info">
    <span>입고: <span class="action-highlight">일반 밴드 20매입 2400개</span></span>
    <span class="action-highlight">1번 랙 · 1칸 · 1단</span>
    <div class="dan-selector">
      <button class="dan-btn active">1단</button>
      <button class="dan-btn">2단</button>
      <button class="dan-btn occupied" disabled>3단</button>
    </div>
  </div>
  <button class="btn-exec">입고 실행</button>
</div>
```

### 4.2 스타일

**컨테이너**:
- 패딩: 8px 14px
- 높이: auto, 최소 35px
- Flex: `display: flex; gap: 10px; align-items: center;`
- 배경: `#0A1420` (다크) / `var(--bg-hover)` (라이트)
- 보더 하단: 1px `var(--border)`

**액션 정보**:
- Flex: 1 (자동 너비)
- 폰트 크기: 0.82rem
- 색상: `var(--text-secondary)`
- Wrap: flex-wrap

**액션 하이라이트** (중요 정보):
- 색상: `var(--cyan)`
- 가중: 700
- 폰트 패밀리: `'JetBrains Mono', monospace`

**단 선택 버튼 (DAN-BTN)**:
- 패딩: 2px 8px
- 폰트 크기: 0.72rem
- 가중: 700
- 폰트 패밀리: `'JetBrains Mono', monospace`
- 보더 반경: 3px
- 보더: 1px `var(--border)`
- 배경: `var(--bg-surface)`
- 색상: `var(--text-secondary)`
- Cursor: pointer
- Transition: 0.12s

**단 버튼 상태**:
| 상태 | 배경색 | 보더색 | 색상 | Disabled |
|------|--------|--------|------|----------|
| 일반 | `var(--bg-surface)` | `var(--border)` | `var(--text-secondary)` | false |
| Hover | `var(--bg-surface)` | `var(--border-bright)` | `var(--text-primary)` | false |
| Active (선택) | `var(--cyan-dim)` | `var(--cyan)` | `var(--cyan)` | false |
| Occupied (차있음) | `var(--bg-surface)` | `var(--border)` | `var(--text-secondary)` | **true**, opacity: 0.35 |

**실행 버튼 (BTN-EXEC)**:
- 패딩: 7px 18px
- 폰트 크기: 0.85rem
- 가중: 700
- 보더 반경: 5px
- 보더: none
- 커서: pointer
- Flex-shrink: 0
- Transition: 0.15s

**실행 버튼 상태**:
| 상태 | 배경색 | 색상 |
|------|--------|------|
| 활성 | `#10B981` (입고) / `var(--amber)` (출고) | `#000` |
| Hover | brightness(1.1) 필터 | `#000` |
| Disabled | `var(--bg-surface)` | `#334155` |

---

## 5. 창고 시각화 (Type A & Type B)

### 5.1 공통 계산 로직

**동적 셀 크기 계산**:
```javascript
// 전체 창고(1,2,3) 중 최대 랙 수를 기준으로 셀 크기 통일
const maxRackCount = Math.max(
  ...warehouses.map(w => racks.filter(r => r.warehouse_id === w.id).length)
);
// 창고3: 30개 랙 → maxRackCount = 30

const scrollEl = document.querySelector('.matrix-scroll');
const available = scrollEl.clientWidth - 60; // 라벨 컬럼 + 보더 여유
const cellSize = Math.max(36, Math.floor(available / maxRackCount));

scrollEl.style.setProperty('--rm-cell-size', cellSize + 'px');
// 예: 1200px 너비 → cellSize = 38px (화면 너비에 따라 유동)
```

**CSS 변수**:
```css
--rm-cell-size: 42px; /* 동적 설정, 기본 42px */
```

---

### 5.2 Type A: 랙 카드 그리드 방식

**용도**: 창고 타입이 'normal' 또는 'a'일 때 (완제품창고, 부자재창고)

**HTML 구조**:
```html
<div class="wh-rack-grid" style="grid-template-columns: repeat(3, 1fr);">
  <!-- 각 랙당 1개 카드 -->
  <div class="rack-card highlighted">
    <div class="rack-card-header">
      <span class="rack-card-no">1번</span>
      <span class="rack-card-lot">3Lot</span>
    </div>
    <div class="rack-cell-grid" style="grid-template-columns: repeat(4, 1fr);">
      <!-- 각 셀은 floor×group 배열 표현 (역순, 위층부터) -->
      <div class="rc rc-filled"></div>
      <div class="rc rc-empty"></div>
      <div class="rc rc-filled"></div>
      <!-- ... floors=3, groups=4 → 12개 셀 -->
    </div>
  </div>
  <!-- ... 다음 랙 카드 -->
</div>
```

**카드 레이아웃**:
- Grid: `repeat(cols, 1fr)` — 창고3는 cols=6, 창고1,2는 cols=3
- 갭: 8px
- 카드 패딩: 8px
- 카드 보더: 1px `var(--border)`
- 카드 보더 반경: 8px
- 카드 배경: `var(--bg-panel)`
- Transition: border-color 0.2s, box-shadow 0.2s

**카드 헤더**:
- Flex: space-between, align-items: center
- 마진 하단: 6px
- 폰트 패밀리: `'JetBrains Mono', monospace`

**랙 카드 번호**:
- 폰트 크기: 0.72rem
- 가중: 700
- 색상: `var(--text-primary)`

**랙 카드 Lot 배지**:
- 폰트 크기: 0.68rem
- 가중: 600
- 색상: `#4ADE80` (occupied) / `#334155` (empty)

**셀 그리드**:
- Grid: `repeat(groups, 1fr)`
- 갭: 2px

**개별 셀 스타일**:
```css
/* 너비는 고정이 아니라 그리드로 계산 */
.rc {
  height: 9px;
  border-radius: 2px;
}

.rc-empty {
  background: var(--bg-surface);
  border: 1px solid rgba(30, 58, 95, 0.45);
}

.rc-filled {
  background: rgba(55, 48, 163, 0.35);
  border: 1px solid #6366F1;
}

.rc-highlight {
  background: rgba(0, 212, 255, 0.5) !important;
  border: 1px solid var(--cyan) !important;
}
```

**카드 상태**:
| 상태 | 보더색 | 배경색 | Box-shadow |
|------|--------|--------|-----------|
| 일반 | `var(--border)` | `var(--bg-panel)` | none |
| Hover | `var(--border-bright)` | `var(--bg-hover)` | none |
| Highlighted (선택) | `var(--cyan)` | `var(--bg-panel)` | `0 0 14px rgba(0,212,255,0.45)` |

**반응형**:
- 모바일(<768px): cols = 2
- 태블릿(768-1024px): cols = 3
- 데스크톱(>1024px): 창고1,2는 cols=3, 창고3는 cols=6

---

### 5.3 Type B: 매트릭스 테이블 방식

**용도**: 창고 타입이 'electric' 또는 'b'일 때 (전동랙창고)

**HTML 구조**:
```html
<div class="matrix-scroll">
  <table class="rack-matrix">
    <!-- THEAD: 랙번호 행 -->
    <thead>
      <tr>
        <th class="label-cell">칸</th>
        <th>R1</th>
        <th>R2</th>
        <th>R3</th>
        <!-- ... floors=6 랙별 칼럼 -->
      </tr>
    </thead>
    
    <!-- TBODY: 칸 행들 (역순, maxGroups → 1) -->
    <tbody>
      <tr>
        <td class="label-cell">칸4</td>
        <td><div class="rm-cell rm-fill-1">1종<br/>2400개</div></td>
        <td><div class="rm-cell rm-empty">0</div></td>
        <td><div class="rm-cell rm-full">3종<br/>7200개</div></td>
      </tr>
      <!-- ... -->
    </tbody>
    
    <!-- TFOOT: 통계 행 (랙번호, 단수, 유효공간) -->
    <tfoot>
      <tr>
        <td class="label-cell">랙번호</td>
        <td>1</td>
        <td>2</td>
        <td>3</td>
      </tr>
      <tr>
        <td class="label-cell">단수</td>
        <td>4</td>
        <td>4</td>
        <td>4</td>
      </tr>
      <tr>
        <td class="label-cell">유효공간</td>
        <td>16</td>
        <td>16</td>
        <td>14</td>
      </tr>
    </tfoot>
  </table>
</div>
```

**테이블 스타일**:
- border-collapse: collapse
- Font: `'JetBrains Mono', monospace`
- width: max-content
- margin: 0 auto

**TH (헤더)**:
- 배경: `#09131F` (다크) / `var(--bg-surface)` (라이트)
- 패딩: 5px 6px
- 텍스트 정렬: center
- 폰트 크기: 0.68rem
- 가중: 700
- 색상: `#5A7A9A` (다크) / `var(--text-secondary)` (라이트)
- 보더: 1px `rgba(30,58,95,0.6)`
- 공백: nowrap
- Position: sticky (top: 0, z-index: 2)
- Min-width/width: `var(--rm-cell-size, 42px)` (label-cell 제외)

**LABEL-CELL (칸/랙번호 라벨)**:
- 패딩: 4px 6px
- 텍스트 정렬: center
- 폰트 크기: 0.68rem
- 가중: 700
- 색상: `#6A8AAA` (다크) / `var(--text-secondary)` (라이트)
- 배경: `#060F1A` (다크) / `var(--bg-hover)` (라이트)
- 공백: nowrap
- 보더: 1px `rgba(30,58,95,0.5)`
- 보더 오른쪽: 1px `var(--border)` (중요, 우측 경계)
- Min-width: 50px
- Position: sticky (left: 0, z-index: 1)
  - thead .label-cell: z-index: 3 (최상단)
  - tbody .label-cell: z-index: 1
  - tfoot .label-cell: z-index: 1

**TFOOT (푸터)**:
- 배경: `#06101A` (다크) / `var(--bg-surface)` (라이트)
- 패딩: 4px 6px
- 텍스트 정렬: center
- 폰트 크기: 0.65rem
- 가중: 600
- 색상: `#4A6A8A` (다크) / `var(--text-secondary)` (라이트)
- 보더: 1px `rgba(30,58,95,0.4)`
- 공백: nowrap

**개별 셀 (RM-CELL)**:
- width: 100%
- aspect-ratio: 1 / 1
- display: flex
- flex-direction: column
- align-items: center
- justify-content: center
- cursor: pointer
- Transition: all 0.12s
- 폰트 크기: 0.68rem
- 가중: 700
- line-height: 1.2

**셀 상태별 색상**:
| CSS 클래스 | 배경색 (다크) | 색상 (다크) | 배경색 (라이트) | 색상 (라이트) | 의미 |
|-----------|------------|--------|------------|----------|------|
| `rm-na` | `#030A14` | `#0D1F35` | `var(--bg-hover)` | `var(--border-bright)` | 셀 없음 (floors/groups 초과) |
| `rm-empty` | `#05101C` | `#1E3A5F` | `#F1F5F9` | `#94A3B8` | 빈 셀 |
| `rm-fill-1` | `rgba(30,80,200,0.2)` | `#7BAAE8` | `rgba(59,130,246,0.15)` | `#2563EB` | 채움 ~33% |
| `rm-fill-2` | `rgba(30,80,200,0.4)` | `#AACCF8` | `rgba(59,130,246,0.3)` | `#1D4ED8` | 채움 ~66% |
| `rm-fill-3` | `rgba(30,80,200,0.65)` | `#D0E4FF` | `rgba(59,130,246,0.5)` | `#1E40AF` | 채움 ~100% 직전 |
| `rm-full` | `rgba(30,80,200,0.88)` | `#EFF6FF` | `rgba(59,130,246,0.75)` | `#DBEAFE` | 채움 100% |
| `rm-selected` | `rgba(0,212,255,0.22)` + outline 2px | `var(--cyan)` | `rgba(0,212,255,0.22)` + outline 2px | `var(--cyan)` | 선택된 셀 |

**셀 상호작용**:
- Hover (`:not(.rm-na):hover`): 
  - filter: brightness(1.4)
  - z-index: 2
  - transform: scale(1.08)
- 클릭: 셀 상세 패널 업데이트

**셀 내용 (inner HTML)**:
- 빈 셀: `0`
- 채워진 셀 (채움도 > 0):
  ```html
  <span>1종</span>
  <span>2400개</span>
  ```
  - 상품 종류 수 / 총 수량 표시

---

## 6. 셀 상세 패널 (Cell Details Panel)

### 6.1 HTML 구조
```html
<div class="cell-details">
  <div class="cd-header">완제품창고 · 1번 랙 · 1칸 · 3종 8400개</div>
  <div class="cd-table-wrap">
    <table class="cd-table">
      <thead>
        <tr>
          <th>상품코드</th>
          <th>상품명</th>
          <th style="text-align:right;">수량</th>
          <th>입고일</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="4" class="cd-dan-header">1단 · 팔레트 #1</td>
        </tr>
        <tr>
          <td>FP-001</td>
          <td>일반 밴드 20매입</td>
          <td style="text-align:right;">2400</td>
          <td>2026-03-10</td>
        </tr>
        <!-- ... 다음 상품 -->
        <tr>
          <td colspan="4" class="cd-dan-header">2단 · 팔레트 #2</td>
        </tr>
        <!-- ... -->
      </tbody>
    </table>
  </div>
</div>
```

### 6.2 스타일

**컨테이너**:
- flex: 0 0 auto
- height: 200px
- display: flex
- flex-direction: column
- 보더 상단: 1px `var(--border)`
- 배경: `#060F1A` (다크) / `var(--bg-panel)` (라이트)
- 패딩: 10px 14px

**헤더**:
- flex: 0 0 auto
- 폰트 크기: 0.82rem
- 가중: 700
- 색상: `var(--cyan)`
- 마진 하단: 8px
- 폰트 패밀리: `'JetBrains Mono', monospace`

**테이블 래퍼**:
- flex: 1 1 auto
- overflow: auto

**테이블**:
- width: 100%
- border-collapse: collapse
- 폰트 패밀리: `'JetBrains Mono', monospace`
- 폰트 크기: 0.72rem

**TH (헤더)**:
- 배경: `#09131F` (다크) / `var(--bg-surface)` (라이트)
- 패딩: 5px 8px
- 텍스트 정렬: left
- 폰트 크기: 0.7rem
- 가중: 700
- 색상: `#5A7A9A` (다크) / `var(--text-secondary)` (라이트)
- 보더 하단: 1px `var(--border)`
- Position: sticky (top: 0, z-index: 1)

**TD (데이터)**:
- 패딩: 4px 8px
- 보더 하단: 1px `rgba(30,58,95,0.3)`
- 색상: `var(--text-primary)` (다크) / `var(--text-primary)` (라이트)

**TR Hover**:
- 배경: `#0A1420` (다크) / `var(--bg-hover)` (라이트)

**단 헤더 (CD-DAN-HEADER)**:
- 폰트 크기: 0.72rem
- 가중: 700
- 색상: `var(--amber)`
- 패딩: 4px 8px
- 배경: `#0A1828` (다크) / `var(--bg-surface)` (라이트)
- 보더 좌: 2px `var(--amber)`

**빈 상태**:
- 텍스트 센터 정렬
- 색상: `var(--text-secondary)`
- 폰트 크기: 0.78rem
- 패딩: 20px 0

---

## 7. 통계 바 (Stats Bar)

### 7.1 HTML 구조
```html
<div class="stats-bar">
  <div class="stat-item">
    <span class="stat-label">현재 입고</span>
    <span class="stat-value" style="color:var(--cyan);">12</span>
    <span class="stat-unit">PLT</span>
  </div>
  <div class="stat-item">
    <span class="stat-label">잔여 공간</span>
    <span class="stat-value" style="color:var(--amber);">48</span>
    <span class="stat-unit">PLT</span>
  </div>
  <div class="stat-item">
    <span class="stat-label">전체 용량</span>
    <span class="stat-value" style="color:var(--text-secondary);">60</span>
    <span class="stat-unit">PLT</span>
  </div>
</div>
```

### 7.2 스타일

**컨테이너**:
- flex-shrink: 0
- 패딩: 7px 14px
- 보더 상단: 1px `var(--border)`
- 배경: `#060F1A` (다크) / `var(--bg-surface)` (라이트)
- display: flex
- gap: 0 (stat-item의 border-right로 분리)

**통계 항목**:
- display: flex
- align-items: center
- gap: 5px
- 패딩: 0 16px
- 보더 오른쪽: 1px `var(--border)`

**항목 위치**:
- `:first-child`: padding-left = 0
- `:last-child`: border-right = none

**레이블**:
- 폰트 크기: 0.75rem
- 색상: `var(--text-secondary)`

**값**:
- 폰트 패밀리: `'JetBrains Mono', monospace`
- 가중: 700
- 폰트 크기: 0.95rem
- 색상: 콘텍스트별 (청록, 황색 등)

**단위**:
- 폰트 크기: 0.68rem
- 색상: `var(--text-secondary)`

---

## 8. 출고 처리 화면 (Type B) 추가 요소

### 8.1 FIFO 색상 표시

**출고 처리**에서만 추가 셀 상태:

| CSS 클래스 | 배경색 (다크) | 색상 (다크) | 보더 | 의미 |
|-----------|------------|--------|------|------|
| `rm-fifo1` | `rgba(239,68,68,0.5)` | `#FCA5A5` | 1px `rgba(239,68,68,0.8)` | FIFO 순위 1 (최우선 출고) |
| `rm-fifo2` | `rgba(245,158,11,0.4)` | `#FCD34D` | 1px `rgba(245,158,11,0.7)` | FIFO 순위 2 |
| `rm-fifon` | `rgba(0,212,255,0.25)` | `var(--cyan)` | 1px `rgba(0,212,255,0.5)` | FIFO 순위 3+ |

**라이트 테마 오버라이드**:
```css
[data-theme="light"] .rm-fifo1 { background: rgba(239,68,68,0.15); color: #DC2626; }
[data-theme="light"] .rm-fifo2 { background: rgba(245,158,11,0.15); color: #D97706; }
[data-theme="light"] .rm-fifon { background: rgba(2,132,199,0.12); color: #0284C7; }
```

---

## 9. 재고 리스트 화면 (Inventory) 추가 사항

### 9.1 뷰 토글 버튼 위치

```html
<div class="view-toggle">
  <button class="view-btn active" onclick="showView('list')">
    <svg><!-- List icon --></svg>
    <span>리스트</span>
  </button>
  <button class="view-btn" onclick="showView('warehouse')">
    <svg><!-- Warehouse icon --></svg>
    <span>창고</span>
  </button>
</div>
```

**위치**: 헤더 바 우측 (헤더 내용 우측 정렬)

**스타일**:
- display: flex
- gap: 3px
- margin-left: auto
- 배경: `var(--bg-surface)`
- 보더: 1px `var(--border)`
- 보더 반경: 7px
- 패딩: 3px

**버튼**:
- display: flex
- align-items: center
- gap: 6px
- 패딩: 5px 12px
- 보더 반경: 5px
- 폰트 크기: 0.8rem
- 가중: 600
- 보더: none
- 배경: transparent → active 시 `var(--cyan)`
- 색상: `var(--text-secondary)` → active 시 `#000`

### 9.2 창고 뷰 — 좌측 검색 패널

```html
<div class="wh-search-panel">
  <div class="wh-search-header">
    <input id="whSearch" placeholder="상품명/코드 검색">
  </div>
  <div class="wh-product-list">
    <div class="wh-product-card selected">
      <div class="wh-product-name">일반 밴드 20매입</div>
      <div class="wh-product-meta">
        <span>FP-001</span>
        <span>2400개</span>
        <span>1곳</span>
      </div>
    </div>
  </div>
</div>
```

**패널**:
- width: 280px
- flex-shrink: 0
- 보더 오른쪽: 1px `var(--border)`
- display: flex
- flex-direction: column
- overflow: hidden

**헤더**:
- 패딩: 12px
- 보더 하단: 1px `var(--border)`
- 갭: 8px

**상품 목록**:
- flex: 1
- overflow-y: auto

**상품 카드**:
- 패딩: 10px 14px
- 보더 하단: 1px `var(--border)`
- 보더 좌: 3px transparent
- Cursor: pointer
- Transition: background 0.1s

**상품 카드 상태**:
| 상태 | 배경색 | 보더 좌색 |
|------|--------|----------|
| 일반 | 투명 | transparent |
| Hover | `var(--bg-hover)` | transparent |
| Selected | `var(--cyan-dim)` | **`var(--cyan)`** |

**상품명**:
- 폰트 크기: 0.85rem
- 가중: 600
- 색상: `var(--text-primary)`

**상품 메타**:
- 폰트 크기: 0.75rem
- 색상: `var(--text-secondary)`
- 마진 상단: 2px
- display: flex
- gap: 8px

### 9.3 창고 뷰 — 우측 시각화 패널

**구조**: Type A 또는 Type B 렌더링 (5.2 또는 5.3 참고)

---

## 10. CSS 변수 통합 목록

### 10.1 색상 변수 (theme-dependent)

```css
/* 라이트/다크 테마 공통 */
--cyan: 색상 (보통 #00D4FF)
--cyan-dim: 낮은 투명 버전
--amber: 경고/강조 색상
--bg-panel: 패널 배경
--bg-surface: 서피스 배경
--bg-hover: hover 배경
--border: 보통 보더 색상
--border-bright: 밝은 보더 색상
--text-primary: 주 텍스트 색상
--text-secondary: 보조 텍스트 색상
```

### 10.2 레이아웃 변수

```css
--rm-cell-size: 42px; /* 동적, 창고 시각화 셀 크기 */
```

### 10.3 타이포그래피 변수 (선택사항)

```css
--font-mono: 'JetBrains Mono', monospace;
--font-sans: 'Noto Sans KR', sans-serif;
```

---

## 11. 반응형 규칙

### 11.1 화면 크기별 적용

| 화면 크기 | 규칙 |
|----------|------|
| <768px (모바일) | - Type A 그리드 cols = 2<br/>- 탭 스크롤 활성화<br/>- 셀 상세 패널 높이 150px<br/>- 예정 목록 카드 최소 너비 100px |
| 768-1024px (태블릿) | - Type A 그리드 cols = 3<br/>- 탭 고정<br/>- 셀 상세 패널 높이 180px<br/>- 검색 패널 너비 240px |
| >1024px (데스크톱) | - Type A 그리드 cols = 3 (창고1,2) / 6 (창고3)<br/>- 모든 요소 고정 배치<br/>- 셀 상세 패널 높이 200px<br/>- 검색 패널 너비 280px |

### 11.2 Flex/Grid 반응형

**재고 리스트 - 창고 뷰**:
```css
.wh-search-panel {
  width: 280px; /* 데스크톱 */
}

@media (max-width: 1024px) {
  .wh-search-panel { width: 240px; }
}

@media (max-width: 768px) {
  .wh-search-panel { width: 100%; max-height: 300px; }
  .wh-visual-panel { display: none; } /* 검색만 표시 */
}
```

---

## 12. 테마 오버라이드 패턴

모든 색상은 라이트/다크 테마를 지원합니다.

```css
/* 다크 테마 (기본) */
.class-name { background: #060F1A; color: #XXXXXX; }

/* 라이트 테마 */
[data-theme="light"] .class-name { 
  background: var(--bg-surface); 
  color: var(--text-primary); 
}
```

---

## 13. 구현 체크리스트 (퍼블리셔용)

### 13.1 공통 컴포넌트
- [ ] 창고 탭 (Warehouse Tabs)
- [ ] 예정 목록 카드 (Schedule Cards)
- [ ] 액션 바 (Action Bar) + 단 선택 버튼 (DAN-BTN)
- [ ] 실행 버튼 (BTN-EXEC)
- [ ] 셀 상세 패널 (Cell Details) + 테이블
- [ ] 통계 바 (Stats Bar)

### 13.2 Type A (랙 카드)
- [ ] 랙 카드 그리드 레이아웃
- [ ] 카드 헤더 (번호 + Lot 배지)
- [ ] 셀 그리드 (9px 높이, 색상 상태)
- [ ] 카드 Hover/Highlighted 상태
- [ ] 반응형 cols (2/3/6)

### 13.3 Type B (매트릭스)
- [ ] 테이블 헤더 sticky 위치 설정
- [ ] Label-cell sticky 위치 설정 (z-index 계층)
- [ ] 셀 정사각형 비율 (aspect-ratio: 1/1)
- [ ] 동적 셀 크기 계산 (CSS var)
- [ ] 셀 상태 색상 (rm-empty/fill-1/fill-2/fill-3/full)
- [ ] FIFO 색상 (출고만)
- [ ] 푸터 통계 행

### 13.4 재고 리스트
- [ ] 뷰 토글 버튼 (헤더 우측)
- [ ] 검색 패널 (좌측 280px)
- [ ] 상품 카드 (선택 상태)
- [ ] Type A/B 선택 렌더링

### 13.5 반응형 & 테마
- [ ] 모바일 레이아웃 (max-width: 768px)
- [ ] 라이트 테마 오버라이드 (`[data-theme="light"]`)
- [ ] Sticky 요소 z-index 충돌 해결
- [ ] 스크롤바 스타일 (webkit)

---

## 14. 파일 구조 권고

```
demo/
├── data.js                  (공유 데이터, 변경 없음)
├── shared.js                (공유 함수)
├── styles/
│   ├── common.css           (공통 변수, 테마, 기본 스타일)
│   ├── warehouse-tabs.css   (창고 탭)
│   ├── schedule-cards.css   (예정 목록)
│   ├── action-bar.css       (액션 바)
│   ├── type-a.css           (Type A 랙 카드)
│   ├── type-b.css           (Type B 매트릭스)
│   ├── cell-details.css     (셀 상세 패널)
│   └── responsive.css       (반응형)
├── samples/
│   ├── type-a/
│   │   ├── shared.js
│   │   ├── inbound-execute.html
│   │   └── outbound-execute.html
│   └── type-b/
│       ├── shared.js
│       ├── inbound-execute.html
│       └── outbound-execute.html
└── inventory.html           (리스트 + 창고 뷰)
```

---

## 15. 예시 코드 스니펫

### 15.1 CSS 변수 선언 (common.css)

```css
:root {
  /* 색상 */
  --cyan: #00D4FF;
  --cyan-dim: rgba(0, 212, 255, 0.15);
  --amber: #F59E0B;
  
  /* 라이트 테마 (data-theme="light") */
  --bg-panel: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-hover: #F1F5F9;
  --border: #E2E8F0;
  --border-bright: #CBD5E1;
  --text-primary: #1E293B;
  --text-secondary: #64748B;
}

/* 다크 테마 (기본, data-theme="dark" 또는 미지정) */
:root,
[data-theme="dark"] {
  --bg-panel: #0F1A27;
  --bg-surface: #1A252E;
  --bg-hover: #243445;
  --border: #2C3E52;
  --border-bright: #3D5167;
  --text-primary: #E2E8F0;
  --text-secondary: #94A3B8;
}
```

### 15.2 동적 셀 크기 계산 (JavaScript)

```javascript
function updateCellSize() {
  const maxRackCount = Math.max(
    ...warehouses.map(w => racks.filter(r => r.warehouse_id === w.id).length)
  );
  const scrollEl = document.querySelector('.matrix-scroll');
  if (!scrollEl || maxRackCount === 0) return;
  
  const available = scrollEl.clientWidth - 60;
  const cellSize = Math.max(36, Math.floor(available / maxRackCount));
  scrollEl.style.setProperty('--rm-cell-size', cellSize + 'px');
}

// 초기화 및 resize 이벤트
window.addEventListener('resize', () => updateCellSize());
requestAnimationFrame(() => updateCellSize());
```

### 15.3 Type A/B 조건부 렌더링

```javascript
const warehouseType = localStorage.getItem('wms_warehouse_type') || 'b';

if (warehouseType === 'a') {
  renderTypeARacks(racks, occupied);
} else {
  renderTypeB(racks, occupied);
}
```

---

## 16. 노트 및 주의사항

1. **Z-Index 계층 (Type B 매트릭스)**:
   - thead .label-cell: z-index: 3 (우측 상단 고정)
   - thead th: z-index: 2
   - tbody .label-cell: z-index: 1
   - 이는 행/열 스크롤 시 고정 요소 겹침을 방지합니다.

2. **셀 크기 통일 (전체 창고 기준)**:
   - 창고3 (30개 랙)을 기준으로 모든 창고의 셀 크기를 계산합니다.
   - 창고1,2 (4, 3개 랙)는 자동으로 센터링되어 화면 좌우 여백이 생깁니다.

3. **예정 목록 가로 스크롤**:
   - `overflow-x: auto`를 사용하며, 창고 선택 시마다 스크롤 위치를 초기화합니다.

4. **셀 상세 패널 고정 높이**:
   - 200px 고정이므로 내용이 많을 경우 내부 스크롤이 작동합니다.

5. **라이트/다크 테마 전환**:
   - HTML body 또는 최상위 요소에 `data-theme="light"` / `data-theme="dark"` 속성을 추가하면 CSS 오버라이드가 적용됩니다.

6. **FIFO 색상 (출고 처리)**:
   - 출고 처리 화면에서만 "F1", "F2", "Fn" 표시와 함께 특정 셀에 `rm-fifo1`, `rm-fifo2`, `rm-fifon` 클래스를 적용합니다.

---

**문서 작성 일자**: 2026-04-17  
**버전**: 1.0  
**상태**: 구현 준비 완료
