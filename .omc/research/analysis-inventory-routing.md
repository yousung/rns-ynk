# 재고·데이터·라우팅 분석

## 재고 조회 사용법

### 1단계: Inventory.jsx 진입
- 라우트: `/#/app/inventory`
- 두 가지 뷰 모드 제공:
  - **리스트 뷰**: 상품 테이블 형식, 검색/분류 필터링 가능
  - **창고 뷰**: 좌측 상품 검색패널 + 우측 창고 시각화

### 2단계: 리스트 뷰
- 상품명/코드 검색 가능 (input[type="text"])
- 분류별 필터 제공 (select)
- 각 상품별 총 수량, 위치 수 표시
- "상세보기" 클릭 시 해당 상품의 모든 팔레트 위치 확인 가능
- 데이터 출처: `filteredProducts` (Inventory.jsx:36-43)

### 3단계: 창고 뷰
- 좌측 상품 검색패널에서 상품 선택
- `selectProduct()` 함수 호출 (Inventory.jsx:54-74)
- 선택된 상품이 있는 팔레트 위치가 우측 창고에서 강조 표시
- 자동 창고 전환: 선택 상품이 현재 창고에 없으면 해당 창고로 자동 이동
- 창고 유형별 시각화:
  - Type A: WarehouseRackGrid (일반 랙)
  - Type C: WarehouseFloorPlan (평면도)
  - Type D: WarehouseElevation (입면도)
  - Type B: WarehouseMatrix (전동랙 - 층/칸 매트릭스)

---

## 데이터 구조 요약

### 창고 (Warehouses)
```javascript
[
  { id: 1, name: '완제품창고', type: 'normal' },
  { id: 2, name: '부자재창고', type: 'normal' },
  { id: 3, name: '전동랙창고', type: 'electric', max_rack_count: 30 },
]
```

### 랙 (Racks)
- **총 48개 랙**
- 창고1: 12개 (id: 1-4, 40-47)
- 창고2: 12개 (id: 5-7, 48-56)
- 창고3: 30개 (id: 10-39) — 전동랙, 최대 30개

**주요 속성:**
- `id`: 랙 고유 ID
- `warehouse_id`: 속한 창고
- `rack_no`: 창고 내 랙 번호 (1부터)
- `floors`: 높이 (창고1,2=4층, 창고3=10층)
- `groups`: 칸 수 (4 또는 3, 최대값 = `MAX_RACK_COUNT=30`)

### 팔레트 (Pallets)
- **총 32개 팔레트**
- 형식: `location: "rackId-floor-kan"`
  - rackId: 랙 ID
  - floor: 층 번호 (1부터 시작)
  - kan: 칸 번호 (1부터 시작)
- 예: `"10-2-1"` = 랙10의 2층 1칸

### 상품 (Products)
- **총 15개 상품**
- 의료용 밴드류 (FP-001~010): 완제품
- 원단/소재/접착제/포장재 (RM-001~005): 부자재

**속성:**
- `id`, `code`, `name`, `category`, `created_at`

### 재고 (InventoryItems)
- **총 32개 기록** (각 팔레트당 1개 이상의 상품 보유 가능)
- 주요 속성: `product_id`, `pallet_id`, `quantity`, `received_at`
- 1개 팔레트 = 1개 상품 (현재 정규화)

---

## 현재 라우팅 구조 (App.jsx)

### 1. 최상위 경로

| 경로 | 컴포넌트 | 용도 | 인증 |
|------|---------|------|------|
| `/` | PlatformSelect | 플랫폼 선택 | 불필요 |
| `/login` | Login | 로그인 | 불필요 |

### 2. /app 하위 경로 (인증 필수 — RequireAuth로 보호)

**레이아웃:** Layout (공통 사이드바, 헤더 적용)

| 경로 | 컴포넌트 | 용도 |
|------|---------|------|
| `/app` (index) | → `/app/dashboard` (리다이렉트) | |
| `/app/dashboard` | Dashboard | 대시보드 |
| `/app/inbound-schedule` | InboundSchedule | 입고 예정 |
| `/app/inbound-execute` | InboundExecute | 입고 실행 |
| `/app/outbound-schedule` | OutboundSchedule | 출고 예정 |
| `/app/outbound-execute` | OutboundExecute | 출고 실행 |
| `/app/inventory` | Inventory | **재고 조회** |
| `/app/products` | Products | 상품 관리 |
| `/app/activity-log` | ActivityLog | 활동 로그 |
| `/app/users` | Users | 사용자 관리 |
| `/app/settings` | Settings | 설정 |

### 3. 특수 경로 (인증 불필요)

| 경로 | 컴포넌트 | 용도 |
|------|---------|------|
| `/tablet/inbound` | TabletInbound | 태블릿 입고 UI |
| `/tablet/outbound` | TabletOutbound | 태블릿 출고 UI |
| `/kiosk` | KioskPage | 키오스크 UI |

### 4. Catch-all
- `*` → `/` (홈으로 리다이렉트)

---

## /presentation 라우트 추가 위치

### 📍 **삽입 위치: App.jsx 47번 줄 위**

```jsx
// 47번 줄 위에 추가
<Route path="/presentation" element={<PresentationPage />} />
<Route path="/kiosk"           element={<KioskPage />} />
```

### ✅ 완전한 추가 예시

```jsx
// App.jsx
import PresentationPage from './pages/PresentationPage.jsx'; // 임포트 추가 (18번 줄 근처)

export default function App() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<PlatformSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<RequireAuth><Layout /></RequireAuth>}>
          {/* ... 기존 /app 하위 경로들 ... */}
        </Route>
        <Route path="/tablet/inbound"  element={<TabletInbound />} />
        <Route path="/tablet/outbound" element={<TabletOutbound />} />
        <Route path="/presentation" element={<PresentationPage />} />  {/* 추가 */}
        <Route path="/kiosk"           element={<KioskPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
```

### 💡 주의사항

- **/presentation은 인증 불필요**로 설정했습니다 (공개 화면이므로)
- Layout 내부에 추가하려면 47번 줄 대신 44번 줄 아래에 추가하고, URL은 `/#/app/presentation`이 됨
- 현재 제안: 최상위 경로로 추가 (키오스크, 태블릿과 동일 수준)

---

## 코드 참조

- **Inventory.jsx**: 재고 조회 페이지 구현 (Inventory.jsx:12-394)
- **useDataStore.js**: 모든 데이터 정의 (useDataStore.js:1-189)
- **App.jsx**: 라우팅 구조 (App.jsx:26-52)
