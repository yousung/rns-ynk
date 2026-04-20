# 웹 서비스 분석 — /app 라우트

분석 일자: 2026-04-20

---

## 1. 전체 서비스 목적

**의료용품(밴드·붕대·보호대 등) 제조업체의 창고 관리 시스템(WMS)**

- 회사 도메인: `ynk-band.com` (의료 밴드 제조사)
- 3개 창고(완제품창고·부자재창고·전동랙창고) 운영
- 입고 예정/처리, 출고 예정/처리, 재고 조회, 상품 관리, 활동 로그, 사용자 관리 기능 제공
- 현재는 **데모 시스템** (실제 DB 저장 없음, 더미 데이터 사용)

---

## 2. 라우팅 구조 (HashRouter)

```
/                   → PlatformSelect (플랫폼 선택 랜딩)
/login              → Login
/app/*              → RequireAuth → Layout (사이드바 + Outlet)
  /app/dashboard          → Dashboard
  /app/inbound-schedule   → InboundSchedule
  /app/inbound-execute    → InboundExecute
  /app/outbound-schedule  → OutboundSchedule
  /app/outbound-execute   → OutboundExecute
  /app/inventory          → Inventory
  /app/products           → Products
  /app/activity-log       → ActivityLog
  /app/users              → Users
  /app/settings           → Settings
/tablet/inbound     → TabletInbound
/tablet/outbound    → TabletOutbound
/kiosk              → KioskPage
*                   → redirect /
```

**인증 보호**: `RequireAuth` HOC가 `useAuthStore.currentUser` 확인 후 없으면 `/login`으로 redirect.

---

## 3. 각 페이지 역할 및 주요 기능

### PlatformSelect (`/`)
- 서비스 진입점. **관리용 웹 / 태블릿 웹 / 키오스크** 3가지 플랫폼 선택 카드
- 다크/라이트 테마 토글 내장
- 관리용 웹 선택 → `/login`, 태블릿 → `/tablet/inbound`, 키오스크 → `/kiosk`

### Login (`/login`)
- 이메일 입력 후 로그인 (데모: 아무 값 입력 가능)
- `useDataStore.users`에서 이메일 매칭 또는 기본값으로 users[1] 사용
- 성공 시 `/app/dashboard`로 이동

### Dashboard (`/app/dashboard`)
**KPI 카드 5개:**
- 총 재고 수량 (inventoryItems 합산)
- 입고 예정 건수 + 수량
- 출고 예정 건수 + 수량
- 등록 상품 수 + 카테고리 수
- 창고 가동률 (pallets / 전체 슬롯)

**테이블 3개:**
- 입고 예정 목록 (pending 상태)
- 출고 예정 목록 (pending 상태)
- 최근 활동 로그 8건

### InboundSchedule (`/app/inbound-schedule`)
- 입고 예정 목록을 상태(전체/대기/완료/취소)로 필터링
- 테이블: 번호, 상품명, 수량, 예정일, 상태(badge), 비고, 처리 버튼
- 처리 버튼 클릭 → `/inbound-execute`로 이동 (라우팅 버그: `/app/` prefix 누락)
- + 예정 등록 버튼은 데모 알림만 표시

### InboundExecute (`/app/inbound-execute`)
가장 복잡한 페이지. **창고 시각화 + 입고 처리** 통합 UI.

**레이아웃 구성:**
1. 왼쪽 사이드패널 (w=188px): 대기중 입고 예정 스크롤 목록 + 검색
2. 오른쪽 메인:
   - WarehouseTabs: 창고 선택 탭
   - 액션 바: 선택된 예정 정보 + 위치 정보 + 수량 입력 + 입고 실행 버튼
   - 창고 시각화 영역 (warehouseType에 따라 4가지 뷰):
     - `a`: WarehouseRackGrid (격자형)
     - `b` (default): WarehouseMatrix (층×칸 매트릭스)
     - `c`: WarehouseFloorPlan (도면형)
     - `d`: WarehouseElevation (입면도)
   - WarehouseMinimap: 오른쪽 상단 미니맵
   - 하단 2분할: 칸별 현황 + 적재 상세 (KanDetailPanel)
   - StatsBar: 현재 입고 PLT / 잔여 공간 / 전체 용량

**핵심 로직:**
- 예정 선택 → 매트릭스 셀 클릭 → 위치 지정 → 입고 실행
- getMiniBlocksFn: 선택된 예정 상품이 이미 있는 칸을 `mini-product`로 강조

### OutboundSchedule (`/app/outbound-schedule`)
- InboundSchedule과 구조 동일, 출고 예정 관리
- 처리 버튼 → `/outbound-execute` 이동 (동일한 라우팅 버그)

### OutboundExecute (`/app/outbound-execute`)
InboundExecute와 유사하나 **FIFO 출고 로직** 추가.

**핵심 차이점:**
- fifoSlots: 선택된 상품의 재고를 `received_at` 기준 오름차순 정렬 (FIFO 우선순위 계산)
- 미니블록 색상: `mini-fifo1`(1순위, 앰버), `mini-fifo2`(2순위, 파랑), `mini-fifon`(n순위)
- 창고 자동 이동: 예정 선택 시 해당 상품 재고가 있는 창고로 자동 전환
- 하단 3분할: 칸별 현황 + 적재 상세 + **재고 리스트(FIFO 순위 테이블)**
- 재고 부족 시 빨간 경고 표시
- 출고 실행 결과: FIFO 위치 목록 알림

### Inventory (`/app/inventory`)
**2가지 뷰 전환** (localStorage에 저장):

**리스트 뷰:**
- 상품명/코드 검색 + 카테고리 필터
- 테이블: 상품코드, 상품명, 분류, 총 수량, 위치 수, 상세보기(토글)
- 상세 펼치기: 팔레트별 위치, 입고일, 수량

**창고 뷰:**
- 왼쪽: 상품 검색 패널 (카드 목록, 클릭 시 창고에서 위치 강조)
- 오른쪽: 창고 시각화 (InboundExecute와 동일한 4가지 뷰 타입)
- 상품 선택 시 해당 창고로 자동 이동 + 재고 위치 강조 (`mini-sel`)
- 하단 2분할: 칸별 현황 + 적재 상세

### Products (`/app/products`)
- 상품명/코드 검색 + 카테고리 필터
- 테이블: 상품코드, 상품명, 분류, 등록일, 현재 재고, 수정/삭제 버튼
- 수정/삭제/등록 모두 데모 알림만 표시

### ActivityLog (`/app/activity-log`)
- 사용자명/내용 검색 + 기능 필터(입고/출고/재고 등) + **날짜 범위 선택 (달력 인라인)**
- react-datepicker 사용, 한국어 로케일
- 테이블: 일시, 사용자, 기능(badge), 액션, 상세

### Users (`/app/users`)
- 사용자 목록: 이름, 이메일, 역할(badge), 승인 상태
- 승인/거부 토글 기능 (로컬 state만, 실제 저장 없음)
- 역할: admin, manager, warehouse_staff, viewer

### Settings (`/app/settings`)
- **계정 정보**: 이메일·역할 읽기 전용
- **프로필 수정**: 이름, 연락처, 직책, 메모
- **비밀번호 변경**: 현재/새/확인 입력, 4자 이상 검증
- **화면 설정**: 다크/라이트 테마 전환

---

## 4. 상태 관리 (Zustand 3 stores)

### useAuthStore (`src/store/useAuthStore.js`)
```
currentUser: User | null  ← localStorage('wms_user') 초기화
login(user)               ← localStorage 저장 + state 업데이트
logout()                  ← localStorage 제거 + state 초기화
updateUser(updates)       ← 현재 사용자 필드 병합 업데이트
```

### useDataStore (`src/store/useDataStore.js`)
- 모든 도메인 데이터를 **인메모리 더미 데이터**로 보유 (변경 불가)
- 데이터: `warehouses`, `racks`, `pallets`, `products`, `inventoryItems`, `inboundSchedules`, `outboundSchedules`, `activityLogs`, `users`
- 창고 3개: 완제품창고(랙 12개, 4층), 부자재창고(랙 12개, 4층), 전동랙창고(랙 30개, 10층)
- 팔레트 위치 포맷: `"rackId-floor-kan"` (예: `"1-3-1"`)

### useUIStore (`src/store/useUIStore.js`)
```
theme: 'dark' | 'light'  ← localStorage('wms_theme')
sidebarSlim: boolean     ← localStorage('wms_sidebar_slim')
setTheme(theme)
toggleSidebar()
```
> **주의**: `warehouseType`이 InboundExecute·OutboundExecute·Inventory에서 `useUIStore()`로 읽히지만, useUIStore 정의에는 없음 → 항상 `undefined` → 기본 분기(WarehouseMatrix) 실행

---

## 5. 주요 컴포넌트 구성

| 컴포넌트 | 역할 |
|----------|------|
| `Layout` | 사이드바 + Outlet 래퍼, 모바일 햄버거 메뉴 |
| `Sidebar` | 좌측 네비게이션, NavLink 9개, 설정/로그아웃 |
| `WarehouseTabs` | 창고 선택 탭 (완제품/부자재/전동랙) |
| `WarehouseMatrix` | 층×랙 매트릭스 (Type B 전동랙 기본 뷰) |
| `WarehouseRackGrid` | 랙×층×칸 격자 (Type A) |
| `WarehouseFloorPlan` | 도면형 뷰 (Type C), `FloorPlanRackDetail` 포함 |
| `WarehouseElevation` | 입면도 뷰 (Type D) |
| `WarehouseMinimap` | 우측 상단 미니맵 오버레이 |
| `ScheduleScroll` | 입·출고 예정 스크롤 목록 |
| `CellDetailsPanel` | `KanDetailPanel`: 칸별 적재 상세 |
| `StatsBar` | 하단 통계 바 (PLT 수치) |
| `MiniBlocks` | 칸별 상태 미니 블록 렌더링 |

---

## 6. 사용자 흐름 (User Flow)

```
진입 (/) → 플랫폼 선택
  ↓ 관리용 웹 선택
로그인 (/login)
  ↓ 이메일 입력
대시보드 (/app/dashboard)
  ├─ 입고 예정 확인 → InboundSchedule → InboundExecute
  │    예정 선택 → 창고 위치 클릭 → 수량 확인 → 입고 실행
  ├─ 출고 예정 확인 → OutboundSchedule → OutboundExecute
  │    예정 선택 → FIFO 위치 자동 강조 → 수량 확인 → 출고 실행
  ├─ 재고 조회 → Inventory (리스트 뷰 / 창고 뷰)
  ├─ 상품 관리 → Products
  ├─ 활동 로그 → ActivityLog
  └─ 사용자 관리 → Users
       설정 → Settings (프로필/비밀번호/테마)
```

---

## 7. 기술 스택

- **프레임워크**: React (JSX)
- **라우터**: react-router-dom v6 (HashRouter)
- **상태관리**: Zustand
- **날짜 선택**: react-datepicker (ActivityLog)
- **스타일**: CSS 변수 기반 테마 (`var(--bg-surface)` 등)
- **데이터**: 모두 인메모리 더미 데이터 (실제 API 없음)

---

## 8. 식별된 이슈

1. **라우팅 버그**: InboundSchedule·OutboundSchedule의 처리 버튼이 `/inbound-execute`, `/outbound-execute`로 이동 → `/app/` prefix 누락으로 404
2. **warehouseType 미정의**: useUIStore에 `warehouseType` 필드 없음 → 창고 뷰 타입 전환 기능 미구현 상태 (항상 WarehouseMatrix)
3. **데이터 변경 불가**: useDataStore가 순수 상수 데이터 → 입고/출고 실행 결과가 실제로 반영되지 않음 (데모 한계)
