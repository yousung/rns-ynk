# 창고 관리 시스템 (YNK WMS)

의료용품(밴드·붕대·보호대 등) 제조업체 **YNK밴드**의 창고 운영을 통합 관리하는 **Warehouse Management System**.
웹(`/app`), 태블릿(`/tablet`), 키오스크(`/kiosk`) 3개 플랫폼을 단일 React SPA에서 제공한다.

> 현재 상태: **프로토타입(데모)**. 모든 데이터가 `useDataStore` 내 인메모리 상수로 동작한다.

---

## 실행 방법

```bash
npm install
npm run dev       # 개발 서버 (http://localhost:5173)
npm run build     # 프로덕션 빌드 (dist/ 생성)
npm run preview   # 빌드 결과 미리보기
```

진입 후 `/` (`PlatformSelect`)에서 플랫폼을 선택한다.
시스템 사용법은 `/#/presentation` 에서 확인할 수 있다.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | React 18 (JSX, 함수형 + Hooks) |
| 라우터 | `react-router-dom` v6 (`HashRouter`, future flags 활성) |
| 빌드 | Vite |
| 상태 관리 | Zustand — `useAuthStore` / `useDataStore` / `useUIStore` |
| 날짜 UI | `react-datepicker` (한국어 로케일) |
| 스타일 | CSS 변수 테마 + 플랫폼별 전용 CSS (`tablet.css`, `kiosk.css`) |
| 데이터 | 인메모리 더미 데이터 (실제 API 미연동) |
| 위치 포맷 | `"rackId-floor-kan"` 문자열 (예: `"1-3-1"`) |

---

## 3개 플랫폼 개요

| 항목 | 웹 (`/app`) | 태블릿 (`/tablet`) | 키오스크 (`/kiosk`) |
|------|-------------|--------------------|---------------------|
| 대상 사용자 | 관리자·사무직 | 현장 작업자 | 무인 디스플레이 |
| 주요 목적 | 전체 WMS 관리·분석 | 입고·출고 현장 처리 | 상태 모니터링 |
| 인증 | `RequireAuth` 필수 | 비보호 | 비보호 |
| 레이아웃 | 사이드바 + 헤더 + Outlet | 헤더 + 2컬럼 + 탭바 | 전용 풀스크린 |
| 화면 수 | 10개 | 2개 | 1개 |
| UI 밀도 | 고밀도 (테이블·KPI) | 저밀도 (대형 버튼) | 극저밀도 (시계·로그) |
| 창고 시각화 | 매트릭스·도면·입면도 | 텍스트·버튼 | 없음 |

---

## 라우팅 구조 (HashRouter)

```
/                           → PlatformSelect (랜딩)
/login                      → Login
/presentation               → 시스템 사용법 프레젠테이션 (10슬라이드)

/app/*                      → RequireAuth → Layout
  /app/dashboard               → 운영 현황 (KPI 5개 + 테이블 3개)
  /app/inbound-schedule        → 입고 예정 목록
  /app/inbound-execute         → 입고 처리 (창고 시각화)
  /app/outbound-schedule       → 출고 예정 목록
  /app/outbound-execute        → 출고 처리 (FIFO)
  /app/inventory               → 재고 조회 (리스트/창고 뷰)
  /app/products                → 상품 관리
  /app/activity-log            → 활동 로그 (날짜 필터)
  /app/users                   → 사용자 관리
  /app/settings                → 설정 (프로필·테마)

/tablet/inbound             → 태블릿 입고 처리
/tablet/outbound            → 태블릿 출고 처리
/kiosk                      → 키오스크 모니터링
```

---

## 핵심 기능

### 웹 (`/app`)
- **대시보드** — 총 재고 / 입고 예정 / 출고 예정 / 등록 상품 / 창고 가동률 KPI + 최근 활동 로그
- **입고 처리** — 예정 선택 → 창고 매트릭스 셀 클릭 → 수량 입력 → 입고 실행
- **출고 처리** — 예정 선택 시 FIFO 슬롯 자동 계산 (F1 앰버·F2 파랑·F3+ 회색), 창고 자동 이동
- **재고 조회** — 리스트 뷰(상품·카테고리 필터) + 창고 뷰(상품 선택 시 위치 강조)
- **4가지 창고 뷰** — Type A (RackGrid) / Type B (Matrix, 기본) / Type C (FloorPlan) / Type D (Elevation)

### 태블릿 (`/tablet`)
- **입고** — 창고 → 랙 → 칸 → 단 드릴다운, 점유 위치 비활성, 전동랙 열기/멈춤 신호
- **출고** — FIFO 로트 자동 정렬(#1, #2 ...), 로트 선택 시 위치 자동 결정
- **터치 최적화** — 버튼 최소 52px, `word-break: keep-all`, 다크 기본

### 키오스크 (`/kiosk`)
- 실시간 시계 (1초 갱신) · 블루투스 연결 상태 3단계 순환 · 시스템 활동 로그 (최대 50건)
- 모바일 QR 코드 장식 · 서버 IP 푸터 상시 표시 · 다크/라이트 테마 토글

---

## 창고/위치 구조 — 용어 정의

창고 공간은 **6단계 계층**으로 구성된다. UI 라벨과 변수명이 일치하지 않으므로 주의.

```
창고 (warehouse)
 └─ 랙 (rack)
     └─ 칸 (변수: floor)       ← 과거 "층"
         └─ 단 (변수: kan)     ← 과거 "그룹"/"칸"
             └─ 팔레트 (pallet)
                 └─ 아이템 (inventoryItem)
```

| UI 라벨 | 변수명 | 의미 |
|---------|--------|------|
| 창고 | `warehouse` / `warehouse_id` | 완제품창고 · 부자재창고 · 전동랙창고 3개 |
| 랙 | `rack` / `rackId` / `rack_no` | 창고 내 수직 구조물 |
| **칸** | `floor` | 랙의 수직 레벨 (1-based) |
| **단** | `kan` | 칸 내부 슬롯 (1-based) |
| 팔레트 | `pallet` | 단에 적재되는 물리 팔레트 |
| 아이템 | `inventoryItem` | 팔레트 내 상품 로트 |

위치 예: "1번 랙 3칸 2단" = `rackId=1, floor=3, kan=2` → `pallet.location = "1-3-2"`

> 변수명은 레거시 유지(`floor`/`kan`), UI 라벨만 신 용어("칸"/"단")로 표기.

---

## 데이터 규모 (더미)

- **창고 3개**: 완제품창고(랙 12개, 4칸) · 부자재창고(랙 12개, 4칸) · 전동랙창고(랙 30개, 10칸)
- **랙 48개 · 팔레트 32개 · 상품 15개 · 재고 32건**
- `max_rack_count = 30` 기준으로 `--rm-cell-size` CSS 변수 계산

---

## 비즈니스 규칙

- 입고/출고는 **사전 예정 등록** 건에 한해 실행 가능
- 같은 상품이라도 **입고일이 다르면 별도 재고 아이템**
- 출고 시 **FIFO** 원칙 자동 적용 (`received_at` 오름차순)
- 단(kan)당 **팔레트 1개** 제한
- 전동랙은 열기/멈춤 신호로 제어 (실 장비 연동은 미구현)

---

## Zustand Store 3종

| Store | 역할 | 영속성 |
|-------|------|--------|
| `useAuthStore` | `currentUser`, `login/logout/updateUser` | `localStorage('wms_user')` |
| `useDataStore` | 창고·랙·팔레트·상품·재고·예정·로그·사용자 | 인메모리 상수 (변경 불가) |
| `useUIStore` | `theme`, `sidebarSlim` | `localStorage('wms_theme'/'wms_sidebar_slim')` |

---

## 프로젝트 문서

- [`docs/service-overview.md`](docs/service-overview.md) — 서비스 통합 개요 (3개 플랫폼 상세)
- [`.omc/research/analysis-web-inout.md`](.omc/research/analysis-web-inout.md) — 웹 입출고·대시보드 분석
- [`.omc/research/analysis-tablet-kiosk.md`](.omc/research/analysis-tablet-kiosk.md) — 태블릿·키오스크 분석
- [`.omc/research/analysis-inventory-routing.md`](.omc/research/analysis-inventory-routing.md) — 재고·라우팅 분석
- [설계 문서](docs/superpowers/specs/2026-04-16-warehouse-management-design.md) — 시스템 설계, DB 스키마

---

## 알려진 이슈

- 🔴 `InboundSchedule`·`OutboundSchedule` 처리 버튼의 네비게이션 경로에 `/app/` prefix 누락
- 🔴 `useUIStore`에 `warehouseType` 필드·setter 부재 → 4가지 창고 뷰 전환 비작동 (항상 Matrix)
- 🟡 `useDataStore`가 순수 상수 → 모든 CRUD가 새로고침 시 원복
- 🟡 `/tablet/*`, `/kiosk` 비보호 라우트 (실서비스 전 정책 결정 필요)
