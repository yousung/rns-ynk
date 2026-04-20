# YNK WMS — 서비스 통합 개요

> 작성일: 2026-04-20
> 분석 범위: 웹(`/app`), 태블릿(`/tablet`), 키오스크(`/kiosk`) 3개 플랫폼
> 기반 분석: `.omc/research/web-service.md`, `kiosk-service.md`, `tablet-service.md`

---

## 1. 서비스 개요

**YNK WMS(Warehouse Management System)** 는 의료용품(밴드·붕대·보호대 등) 제조업체 **YNK밴드(`ynk-band.com`)** 의 창고 운영을 통합 관리하기 위한 시스템이다.

### 비즈니스 배경
- 제조 완제품 및 원·부자재의 입고·적재·출고 전 과정을 디지털화
- 물리적 **전동랙(Electric Rack)** 을 시스템과 연동하여 자동 위치 지정·랙 제어를 지원
- 3개 창고(완제품창고 / 부자재창고 / 전동랙창고)를 단일 시스템에서 운영

### 핵심 가치
| 구분 | 내용 |
|------|------|
| 운영 효율 | 입고 예정 → 위치 지정 → 적재, 출고 FIFO 자동 제안으로 작업 표준화 |
| 재고 가시성 | 창고 매트릭스·도면·입면도 등 다중 뷰로 실시간 위치·수량 파악 |
| 현장 친화 | 태블릿 터치 UI, 키오스크 상시 모니터링으로 사무실·현장 연결 |
| 선입선출(FIFO) | 출고 시 `received_at` 기준 자동 정렬·순위 강조로 재고 회전 보장 |

### 현재 상태
**프로토타입(데모) 단계**. 모든 데이터가 `useDataStore` 내 인메모리 상수로 하드코딩되어 있으며, 입고·출고 확정이 store에 반영되지 않는다. 실서비스 전환을 위해 백엔드 API 연동, 인증 체계, 전동랙·블루투스 장치 연동이 필요하다.

---

## 2. 플랫폼 구성 — 3개 플랫폼 비교

서비스 진입점(`/`)의 `PlatformSelect` 화면에서 세 플랫폼 중 하나를 선택한다.

| 항목 | 웹 (`/app`) | 태블릿 (`/tablet`) | 키오스크 (`/kiosk`) |
|------|-------------|--------------------|---------------------|
| **대상 사용자** | 관리자 / 사무직 | 창고 현장 작업자 | 현장 방문자 / 무인 디스플레이 |
| **주요 목적** | 전체 WMS 관리·분석 | 입고·출고 현장 처리 | 상태 모니터링 (상시 표시) |
| **인증** | `RequireAuth` 필수 | 인증 없음 (자유 접근) | 인증 없음 |
| **레이아웃** | 사이드바 + 헤더 + Outlet | 헤더 + 2컬럼 + 하단 탭바 | 전용 풀스크린 |
| **화면 수** | 10개 (대시보드·재고·상품·로그·사용자 등) | 2개 (입고처리 / 출고처리) | 1개 (단일 모니터링 페이지) |
| **기능 범위** | CRUD·조회·분석·관리 전체 | 입고·출고 실행만 | 조회 없음 (로그 시뮬레이션) |
| **UI 밀도** | 고밀도 (테이블·KPI·차트) | 저밀도 (대형 버튼) | 극저밀도 (시계·상태·로그) |
| **창고 시각화** | 매트릭스·도면·입면도·미니맵 | 텍스트·버튼 | 없음 |
| **전역 Store 사용** | useAuthStore + useDataStore + useUIStore | useDataStore만 사용 | 모두 미사용 (로컬 useState) |
| **전용 스타일** | 전역 + 컴포넌트 CSS | `tablet.css` | `kiosk.css` |
| **데이터 연동** | 더미 데이터 + UI CRUD | 더미 데이터 읽기 전용 | 하드코딩 시뮬레이션 |

---

## 3. 웹 서비스 (`/app`)

관리자·사무직이 창고 운영 전반을 관리하는 **풀기능 WMS 콘솔**이다.

### 3.1 라우팅 구조 (HashRouter)

```
/                        → PlatformSelect (랜딩)
/login                   → Login
/app/*                   → RequireAuth → Layout (사이드바 + Outlet)
  /app/dashboard            → Dashboard
  /app/inbound-schedule     → 입고 예정 목록
  /app/inbound-execute      → 입고 처리 (창고 시각화)
  /app/outbound-schedule    → 출고 예정 목록
  /app/outbound-execute     → 출고 처리 (FIFO)
  /app/inventory            → 재고 조회 (리스트 / 창고 뷰)
  /app/products             → 상품 관리
  /app/activity-log         → 활동 로그 (날짜 필터)
  /app/users                → 사용자 관리
  /app/settings             → 설정 (프로필·테마)
```

`RequireAuth` HOC가 `useAuthStore.currentUser` 존재 여부를 확인하여, 미로그인 시 `/login`으로 리다이렉트한다.

### 3.2 페이지별 설명

#### Dashboard — 운영 현황 한눈에
- **KPI 5개**: 총 재고 수량, 입고 예정(건/수량), 출고 예정(건/수량), 등록 상품(개/카테고리), 창고 가동률
- **테이블 3개**: 입고 예정·출고 예정·최근 활동 로그(8건)

#### InboundSchedule / OutboundSchedule — 예정 목록
- 상태 필터(전체/대기/완료/취소), 처리 버튼으로 Execute 화면 이동
- `+예정 등록` 버튼은 현재 알림만 표시 (데모)

#### InboundExecute — 입고 처리 (가장 복잡한 페이지)
왼쪽 사이드패널(예정 스크롤 + 검색)과 오른쪽 메인(창고 시각화)으로 구성된다.

- **4가지 창고 뷰**: `warehouseType`에 따라 분기
  - `a` → `WarehouseRackGrid` (격자)
  - `b` (기본) → `WarehouseMatrix` (층×칸 매트릭스)
  - `c` → `WarehouseFloorPlan` (도면형)
  - `d` → `WarehouseElevation` (입면도)
- **핵심 흐름**: 예정 선택 → 매트릭스 셀 클릭 → 위치 지정 → 수량 입력 → 입고 실행
- `getMiniBlocksFn`: 선택된 상품이 이미 있는 칸을 `mini-product`로 강조
- `WarehouseMinimap`: 우측 상단 미니맵, `StatsBar`: 하단 PLT 통계

#### OutboundExecute — 출고 처리 (FIFO 적용)
InboundExecute와 유사하나 **선입선출(FIFO) 로직**이 추가된다.

- `fifoSlots`: 선택된 상품 재고를 `received_at` 오름차순으로 정렬
- **미니블록 색상**: `mini-fifo1`(앰버, 1순위), `mini-fifo2`(파랑, 2순위), `mini-fifon`(n순위)
- 창고 자동 이동: 예정 선택 시 해당 상품 재고가 있는 창고로 전환
- 하단 3분할: 칸별 현황 + 적재 상세 + **FIFO 재고 리스트**

#### Inventory — 재고 조회 (2가지 뷰)
`localStorage`에 저장되는 뷰 전환:
- **리스트 뷰**: 상품 검색·카테고리 필터, 상품별 총수량·위치 수, 상세 펼치기로 팔레트별 위치·입고일 확인
- **창고 뷰**: 상품 선택 시 창고 자동 이동 + 위치 강조(`mini-sel`), 하단 칸별 현황 + 적재 상세

#### Products / ActivityLog / Users / Settings
- **Products**: 상품 CRUD (현재 데모 알림)
- **ActivityLog**: react-datepicker 기반 날짜 범위 필터 + 기능 필터 + 테이블
- **Users**: 역할(admin/manager/warehouse_staff/viewer) 목록, 승인 토글 (로컬 state)
- **Settings**: 프로필 수정 / 비밀번호 변경(4자 이상) / 다크·라이트 테마 토글

### 3.3 주요 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| `Layout` | 사이드바 + Outlet 래퍼, 모바일 햄버거 |
| `Sidebar` | 좌측 네비게이션 9항목 |
| `WarehouseTabs` | 창고 선택 탭 (완제품/부자재/전동랙) |
| `WarehouseMatrix` | 층×랙 매트릭스 (Type B 전동랙 기본) |
| `WarehouseRackGrid` | 랙×층×칸 격자 (Type A) |
| `WarehouseFloorPlan` | 도면형 (Type C) + `FloorPlanRackDetail` |
| `WarehouseElevation` | 입면도 (Type D) |
| `WarehouseMinimap` | 우측 상단 미니맵 |
| `MiniBlocks` | 칸별 상태 미니 블록 |
| `CellDetailsPanel` (`KanDetailPanel`) | 칸 적재 상세 |
| `StatsBar` | 하단 PLT 통계 |

---

## 4. 키오스크 서비스 (`/kiosk`)

창고 현장에 설치된 **고정형 디스플레이(무인 단말기)** 를 위한 상태 모니터링 화면이다. 직접 조작 UI가 아니라 **연결 상태·활동 로그 실시간 시뮬레이션**을 표시한다.

### 4.1 목적
- 현장 실시간 상태 가시성 제공 (전동랙 BT 연결, 시스템 로그)
- 무인 운영: 자동 갱신만으로 화면 유지
- 내부망 전용 (푸터에 서버 IP `192.168.1.100:8080` 명시)

### 4.2 주요 기능
| 기능 | 설명 |
|------|------|
| 실시간 시계 | HH:MM:SS + 요일 포함 날짜, 1초 갱신 |
| 블루투스 연결 상태 | BT-001 전동랙의 `연결됨/재시도 중/연결 실패` 3단계, 6초 순환 |
| 시스템 활동 로그 | success/info/warn/error 4타입, 최대 50건 유지, 3~5초 간격 추가 |
| 모바일 QR 코드 | 장식용 SVG (모바일 연동 안내) |
| 서버 IP 상시 표시 | 내부망 주소 푸터 고정 |
| 다크/라이트 테마 | 우측 상단 토글 (로컬 `useState`) |

### 4.3 특징
- **Store 완전 독립**: `useDataStore`, `useUIStore`, `useAuthStore` 모두 미사용
- **인증 불필요**: `RequireAuth` 래퍼 없음
- **하드코딩 시뮬레이션**: `BT_STATES`, `INIT_LOGS`, `RANDOM_LOGS` 컴포넌트 내부 상수
- **BT 상태 시각화**: `bt-connected`(파란 펄스), `bt-retrying`(노란 점멸), `bt-failed`(빨강 정적)
- **대형 텍스트 UI**: 원거리 가독성 (`k-clock-time` 큰 폰트)
- **전용 스타일**: `kiosk.css`

---

## 5. 태블릿 서비스 (`/tablet`)

창고 현장 작업자가 태블릿/모바일 기기로 **입고·출고 작업을 직접 처리**하는 터치 최적화 인터페이스다.

### 5.1 라우팅 & 구성
```
/tablet/inbound    → TabletInbound  (입고 처리)
/tablet/outbound   → TabletOutbound (출고 처리)
```
하단 탭바 3개(입고처리 / 출고처리 / 로그아웃)로 전환하며, 서브메뉴 없음.

### 5.2 입고 처리 흐름 (TabletInbound)

```
1. 왼쪽 패널: 입고 예정 카드 클릭 (상품명·수량·날짜·메모)
2. 우측 상단 토글: 일반 창고 / 전동랙 선택
3. 창고 선택 → 랙 선택 → 층 선택 → 칸 선택 (단계별 그리드 버튼)
4. 점유된 칸은 amber 색상으로 비활성화 (isOccupied 검사)
5. 전동랙 모드: 열기 버튼으로 랙 이동 신호 전송 (토스트)
6. 하단 확정 바: 수량 입력 → 입고 확정
7. 토스트로 완료 확인
```

### 5.3 출고 처리 흐름 (TabletOutbound)

```
1. 왼쪽 패널: 출고 예정 카드 클릭 (상품명·SKU·수량·납품처)
2. 우측: FIFO 순 재고 로트 목록 (입고일·위치·재고량)
3. 로트 선택 → 출고 위치(창고/랙/층/칸) 대형 텍스트 표시 (2rem, cyan glow)
4. 전동랙 창고: idle → running → stopped 상태 표시줄 + 열기/멈춤
5. 수량 입력 → 출고 확정
6. 토스트로 완료 확인 (상품명·수량·납품처)
```

### 5.4 입고 vs 출고 차이 요약
| 항목 | 입고 | 출고 |
|------|------|------|
| 위치 선택 | 작업자가 직접 선택 | 시스템이 FIFO 순서로 제안 |
| 전동랙 제어 | 열기/멈춤 토스트 | 열기/멈춤 + 상태 표시줄 |
| 위치 표시 | 선택 배너 소형 텍스트 | 별도 블록 대형 숫자 |
| 창고 유형 전환 | 상단 수동 토글 | 자동 (로트 기반) |

### 5.5 특징
- **터치 최적화**: 버튼 최소 높이 `52px`, 확정 버튼 `50px`, `-webkit-tap-highlight-color: transparent`
- **한국어 최적화**: `word-break: keep-all`
- **다크 기본**: `--bg-base: #070C14` (창고 조명 눈부심 감소)
- **전동랙 통합 제어**: 물리 장비 제어와 WMS 작업을 단일 화면에서 처리
- **FIFO 강제**: 순번 배지(#1, #2) + amber 색상으로 우선순위 표시
- **인증 없는 직접 접근**: `RequireAuth` 래퍼 없음 (현장 운영 편의)

---

## 6. 기술 스택 (공통)

| 영역 | 기술 |
|------|------|
| **프레임워크** | React (JSX, 함수형 컴포넌트 + Hooks) |
| **라우터** | `react-router-dom` v6 (`HashRouter`, `future` flags 활성) |
| **상태 관리** | Zustand (3개 store 분리) |
| **날짜 UI** | `react-datepicker` (ActivityLog, 한국어 로케일) |
| **스타일** | CSS 변수 기반 테마 (`var(--bg-surface)` 등) + 플랫폼별 전용 CSS |
| **데이터** | 전량 인메모리 더미 데이터 (실제 API 없음) |
| **위치 포맷** | `"rackId-floor-kan"` 문자열 (예: `"1-3-1"`) |

### Zustand Store 3종
| Store | 역할 | 영속성 |
|-------|------|--------|
| `useAuthStore` | `currentUser`, `login/logout/updateUser` | `localStorage('wms_user')` |
| `useDataStore` | 창고·랙·팔레트·상품·재고·입출고예정·활동로그·사용자 | 인메모리 상수 (변경 불가) |
| `useUIStore` | `theme`, `sidebarSlim` | `localStorage('wms_theme'/'wms_sidebar_slim')` |

### 데이터 규모 (더미)
- 창고 3개: 완제품창고(랙 12개, 4층), 부자재창고(랙 12개, 4층), 전동랙창고(랙 30개, 10층)
- `max_rack_count = 30` 기준으로 `--rm-cell-size` CSS 변수 계산

---

## 7. 용어 정의 (중요)

창고 위치 좌표는 **변수명(코드)** 과 **UI 라벨(화면 표시)** 이 일치하지 않는다. 용어가 과거(층/그룹/칸)에서 신규(칸/단)로 전환 완료되었으므로, 이 섹션을 기준으로 해석한다.

### 7.1 창고 계층 구조

창고 공간은 아래와 같은 **6단계 계층**으로 구성된다. 각 단계의 **UI 라벨**(사용자 노출 문구)과 **변수명**(코드 식별자)이 서로 다르다는 점에 유의한다.

```
창고 (warehouse)
 └─ 랙 (rack)
     └─ 칸 (변수: floor)          ← 과거 "층"
         └─ 단 (변수: kan)        ← 과거 "그룹" / "칸"
             └─ 팔레트 (pallet)
                 └─ 아이템 (inventoryItem)
```

| 단계 | UI 라벨 | 변수명 | 설명 |
|------|---------|--------|------|
| 1 | 창고 | `warehouse` / `warehouse_id` | 완제품창고 · 부자재창고 · 전동랙창고 3개 |
| 2 | 랙 | `rack` / `rackId` / `rack_no` | 창고 내 수직 구조물 (예: 1번 랙) |
| 3 | **칸** | `floor` | 랙의 수직 레벨 (예: 1칸, 2칸 ... 1-based) |
| 4 | **단** | `kan` | 칸 내부 슬롯 (예: 1단, 2단 ... 1-based) |
| 5 | 팔레트 | `pallet` / `pallet_id` | 단에 적재되는 물리 팔레트 |
| 6 | 아이템 | `inventoryItem` | 팔레트에 담긴 상품 로트(product, quantity, received_at) |

읽는 방법 예시: "1번 랙 3칸 2단" = `rackId=1, floor=3, kan=2`.

### 7.2 용어 매핑 (과거 → 현재)

| 의미 | 과거 라벨 | 현재 라벨 | 변수명 | 예시 |
|------|-----------|-----------|--------|------|
| 랙의 수직 레벨 | 층 | **칸** | `floor` | 4층 랙 → **4칸 랙** |
| 한 레벨 내 분할 | 그룹 / 칸 | **단** | `kan` | 1층 2번칸 → **1칸 2단** |
| FIFO 재고 슬롯 | 슬롯 | 슬롯 (변경 없음) | `slot` | 출고 FIFO 순번 #1, #2 ... |

### 7.3 변수명 규칙 (코드 레이어)

| 변수 | 타입 | 의미 | UI 라벨 |
|------|------|------|---------|
| `rackId` / `rack_no` | number | 랙 식별자 | `번 랙` |
| `floor` | number | 랙의 수직 레벨 인덱스 (1부터) | **칸** |
| `kan` | number | 레벨 내부 슬롯 인덱스 (1부터) | **단** |
| `slot` | object `{ rank, floor, kan, qty, received_at, ... }` | FIFO 재고 단위 | `F1`, `F2` 뱃지 |

### 7.4 위치 포맷

팔레트 위치는 문자열로 인코딩된다:

```
pallet.location = "${rackId}-${floor}-${kan}"      // 예: "1-3-1"
                     ↑ 랙 id   ↑ 칸(구 층) ↑ 단(구 칸)
```

역참조 시 `location.split('-').map(Number)` → `[rackId, floor, kan]`.

### 7.5 주의사항

- **변수명은 레거시 유지**: `floor`, `kan` 변수명·DB 필드명은 과거 용어 기준이지만 **코드 안정성**을 위해 그대로 둔다. 리팩토링 시 전역 rename 대신 UI 라벨만 바꾸는 방식을 택했다.
- **UI 라벨만 신 용어 적용**: 사용자에게 노출되는 문구는 `floor` → "칸", `kan` → "단"으로 표기한다.
- **섹션 제목 "칸별 현황"**: 하단 패널의 "칸별 현황"은 신규 용어 기준(`floor` = 칸) 단위 현황을 의미한다.
- **이 문서 내 레거시 표현**: 본 문서의 섹션 1~6에서도 "층×랙 매트릭스", "4층 랙" 등 과거 라벨 표현이 일부 남아있다. 신규 라벨로 읽으면 각각 "칸×랙 매트릭스", "4칸 랙"으로 해석한다.

### 7.6 마이그레이션 검증 결과 (2026-04-20)

핵심 UI 파일에서 `층` 토큰 잔존 검증 완료 — **모두 0건**:

| 파일 | `층` 잔존 |
|------|-----------|
| `src/pages/InboundExecute.jsx` | ✅ 0건 |
| `src/pages/OutboundExecute.jsx` | ✅ 0건 |
| `src/components/warehouse/WarehouseMatrix.jsx` | ✅ 0건 |
| `src/components/warehouse/CellDetailsPanel.jsx` | ✅ 0건 |
| `src/pages/tablet/TabletInbound.jsx` | ✅ 0건 |
| `src/pages/tablet/TabletOutbound.jsx` | ✅ 0건 |
| `src/store/useDataStore.js` | ✅ 0건 |

"그룹" 도 `src/` 전체 UI 문구에서 미사용 (rename 완료 확인).

---

## 8. 아키텍처 특이사항

### 8.1 프로토타입 상태
- **데이터 변경 불가**: `useDataStore`가 순수 상수 데이터를 노출하므로, 입고·출고 실행이 store에 반영되지 않는다. 페이지 새로고침 시 모든 변경이 원복된다.
- **실서비스 전환 시 필요 작업**:
  - 백엔드 API 연동 (REST/GraphQL)
  - `useDataStore`를 mutable 상태로 전환 + CRUD 액션
  - 인증 토큰 발급·갱신 흐름
  - 전동랙 BT 장치 제어 API 및 상태 스트림

### 8.2 인증 구조 (3가지 모드 공존)
| 경로 | 보호 수준 |
|------|-----------|
| `/app/*` | `RequireAuth` 필수, 미로그인 시 `/login` 리다이렉트 |
| `/tablet/*` | **비보호** — 현장 편의성 우선, 실서비스 전 보안 정책 결정 필요 |
| `/kiosk` | **비보호** — 공용 디스플레이 특성상 의도된 설계 |

로그인 자체도 데모 수준으로, `useDataStore.users`에서 이메일 매칭 또는 기본값 `users[1]`을 사용한다.

### 8.3 데이터 흐름 개요

```
useDataStore (인메모리 상수)
  ├── warehouses     (normal/electric 타입 분류)
  ├── racks          (floors, groups로 칸/단 수 정의)
  ├── pallets        (location = "rackId-floor-kan")
  ├── products       (코드·이름·카테고리)
  ├── inventoryItems (product_id, pallet_id, quantity, received_at)
  ├── inboundSchedules   (pending/done)
  ├── outboundSchedules  (pending/done)
  ├── activityLogs
  └── users          (admin/manager/warehouse_staff/viewer)

   ↓ 읽기

[웹] CRUD·조회 UI    [태블릿] 입출고 실행 UI    [키오스크] 사용 안 함
```

### 8.4 창고 시각화 아키텍처 (웹 전용)
`warehouseType` 값에 따라 4가지 컴포넌트로 분기하는 **전략 패턴**을 사용한다.
```
warehouseType === 'a' → WarehouseRackGrid
warehouseType === 'b' → WarehouseMatrix    (기본, 전동랙)
warehouseType === 'c' → WarehouseFloorPlan (+ FloorPlanRackDetail)
warehouseType === 'd' → WarehouseElevation
```
InboundExecute / OutboundExecute / Inventory 3곳에서 동일하게 재사용된다.

---

## 9. 식별된 이슈

분석 과정에서 발견된 버그·개선 포인트를 우선순위 순으로 정리한다.

### 🔴 Bug — 라우팅 버그 (Critical)
- **위치**: `InboundSchedule`, `OutboundSchedule`의 처리 버튼
- **증상**: `/inbound-execute`, `/outbound-execute`로 이동하도록 되어 있으나 실제 라우트는 `/app/inbound-execute`, `/app/outbound-execute`다.
- **영향**: 처리 버튼 클릭 시 `/app/` prefix 누락으로 `*` 매칭 → `/`로 리다이렉트 (404와 유사한 현상)
- **해결**: 네비게이션 경로에 `/app/` prefix 추가

### 🔴 Bug — `warehouseType` 상태 미정의
- **위치**: `useUIStore` (`src/store/useUIStore.js`)
- **증상**: `InboundExecute`, `OutboundExecute`, `Inventory`에서 `useUIStore((s) => s.warehouseType)`를 구독하지만 store에 해당 필드와 setter가 없다. 항상 `undefined` 반환.
- **영향**: 4가지 창고 뷰(A/B/C/D) 전환 기능이 UI상 노출되어도 실제로는 항상 `WarehouseMatrix`(default 분기)만 렌더링된다.
- **해결**: `useUIStore`에 `warehouseType` 필드와 `setWarehouseType` 액션 추가 + `localStorage` 영속화

### 🟡 Design — 데이터 변경 불가 (프로토타입 한계)
- `useDataStore`가 순수 상수 → 입고/출고/상품 CRUD/사용자 승인 결과가 모두 사라짐
- **해결**: store mutation 액션 도입 또는 API 연동 레이어 추가

### 🟡 Security — 비보호 라우트
- `/tablet/*`, `/kiosk`는 `RequireAuth` 없이 접근 가능
- **키오스크**: 공용 디스플레이 특성상 의도된 설계일 수 있으나 내부망 한정
- **태블릿**: 현장 편의를 위한 설계로 보이나, 실서비스 전 디바이스 인증/세션 정책 결정 필요

### 🟢 UX — 데모 알림 일색
- `Products`의 등록/수정/삭제, `InboundSchedule`·`OutboundSchedule`의 `+예정 등록` 등이 `alert` 데모 처리됨
- **해결**: 실제 mutation + 모달 UI로 대체

### 🟢 DX — 하드코딩된 외부 연동 표시
- 키오스크의 서버 IP(`192.168.1.100:8080`), 버전(`v1.0.0-demo`), BT 장치 ID(`BT-001`)가 컴포넌트 상수
- **해결**: 환경 변수(`.env`) 또는 설정 store로 분리

---

## 부록 — 사용자 흐름 전체도

```
진입 (/) ─ PlatformSelect
  ├─ [관리용 웹] ───────────────────────────────────────────
  │   /login → /app/dashboard
  │     ├─ 입고:  InboundSchedule → InboundExecute
  │     │         (예정 선택 → 창고 클릭 → 수량 → 입고 실행)
  │     ├─ 출고:  OutboundSchedule → OutboundExecute
  │     │         (예정 선택 → FIFO 자동 강조 → 수량 → 출고 실행)
  │     ├─ 재고:  Inventory (리스트 / 창고 뷰)
  │     ├─ 상품:  Products
  │     ├─ 로그:  ActivityLog
  │     ├─ 사용자: Users
  │     └─ 설정:  Settings (프로필·비밀번호·테마)
  │
  ├─ [태블릿 웹] ──────────────────────────────────────────
  │   /tablet/inbound  ↔  /tablet/outbound
  │     (하단 탭바로 전환, 현장 입고·출고 처리 전용)
  │
  └─ [키오스크] ───────────────────────────────────────────
      /kiosk  — 상시 모니터링 (시계·BT 상태·로그 자동 갱신)
```
