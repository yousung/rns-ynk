# 창고 관리 + 전동랙 관리 시스템 — 설계 문서

작성일: 2026-04-16  
작성 대상: 웹 (Laravel + Blade + Serverless Framework on AWS Lambda)

---

## 1. 시스템 개요

창고 내 상품의 입고/출고를 관리하고, 전동랙을 포함한 다양한 창고 형태를 지원하는 통합 창고 관리 시스템이다.

### 1.1 플랫폼 구성

| 플랫폼 | 기술 스택 | 단계 |
|---|---|---|
| 웹 | Laravel + Blade + Serverless (AWS Lambda) | 1단계 |
| 키오스크 (Windows) | Electron.js | 2단계 |
| 태블릿 | Flutter | 3단계 |

### 1.2 핵심 비즈니스 규칙

- 입고/출고는 사전에 **예정 등록**이 완료된 건에 한해서만 실행 가능하다.
- 같은 상품이라도 **입고일이 다르면 별도 재고 아이템 레코드**로 관리한다.
- 출고 처리 시 **선입선출(FIFO)** 원칙이 자동 적용된다 (재고 아이템의 `received_at` 오름차순).
- 재고 리스트는 입고일 무관하게 **합산 수량**으로 표시한다.
- 파레트에는 **서로 다른 상품을 함께 적재(혼적)** 할 수 있다.
- **개발자 계정**의 모든 액션은 활동 로그에 기록하지 않으며, 클라이언트 화면에 노출되지 않는다.

---

## 2. 창고 및 위치 구조

### 2.1 계층 구조

```
창고 (Warehouse)
 └─ 랙 (Rack) × N
     └─ 층 (Floor) × N
         └─ 그룹 (Group / 슬롯) × N
             └─ 파레트 (Pallet) — 슬롯당 최대 1개
                 └─ 재고 아이템 (Inventory Item) × N  ← 혼적 가능
```

- 창고 개수, 랙 개수, 층 수, 그룹 수는 **개발자 계정이 DB에서 직접 설정**한다.
- 창고 단위로 **일반랙 / 전동랙** 구분한다. (창고 전체가 동일한 타입)
- **그룹(슬롯)**은 파레트 1개만 적재 가능. 파레트가 없으면 빈 슬롯.
- **파레트**에는 서로 다른 상품을 함께 적재(혼적)할 수 있다.
- 같은 상품이라도 입고일이 다르면 파레트 내에서 별도 재고 아이템으로 구분된다.
- 위치 표현 예시: `창고1 > 3번랙 > 4층 > 2번`

### 2.2 샘플 데이터

| 창고 | 이름 | 타입 |
|---|---|---|
| 1 | 창고1 | 일반랙 |
| 2 | 창고2 | 일반랙 |
| 3 | 창고3 | 전동랙 |

---

## 3. 사용자 및 권한 체계

### 3.1 사용자 등급

| 등급 | 설명 |
|---|---|
| developer | 최고관리자와 동일 권한. 활동 로그 미기록. 클라이언트 화면 비노출. |
| super_admin | 모든 기능 접근 + 전체 계정(관리자/사용자) 승인 |
| admin | 사용자 계정 승인 + 권한 부여 가능 |
| user | 부여받은 권한 내에서만 활동 |

### 3.2 세부 권한 (창고 단위 × 기능 단위 × 액션 단위)

| 기능 영역 | 조회(view) | 등록(create) | 수정(update) | 삭제(delete) | 실행(execute) |
|---|:---:|:---:|:---:|:---:|:---:|
| 입고 예정 | ✓ | ✓ | ✓ | ✓ | — |
| 입고 처리 | ✓ | — | — | — | ✓ |
| 출고 예정 | ✓ | ✓ | ✓ | ✓ | — |
| 출고 처리 | ✓ | — | — | — | ✓ |
| 재고 리스트 | ✓ | — | ✓ | ✓ | — |
| 상품 리스트 | ✓ | ✓ | ✓ | ✓ | — |
| 활동 로그 | ✓ | — | — | — | — |

- `warehouse_id`가 NULL인 권한은 전체 창고에 적용된다.
- `super_admin` / `admin`은 별도 권한 레코드 없이 역할 자체로 전체 접근이 부여된다.
- 재고 수량 직접 수정(실사 조정)은 재고 리스트의 `update` 권한에 포함된다.

---

## 4. 화면 구성

### 4.1 화면 목록

| # | 화면 | 접근 조건 |
|---|---|---|
| 1 | 로그인 | 전체 (비로그인) |
| 2 | 입고 예정 목록 | 입고 예정 view 권한 |
| 3 | 입고 예정 등록/수정 | 입고 예정 create/update 권한 |
| 4 | 입고 처리 | 입고 처리 execute 권한 |
| 5 | 출고 예정 목록 | 출고 예정 view 권한 |
| 6 | 출고 예정 등록/수정 | 출고 예정 create/update 권한 |
| 7 | 출고 처리 | 출고 처리 execute 권한 |
| 8 | 재고 리스트 | 재고 view 권한 |
| 9 | 재고 디테일 | 재고 view 권한 |
| 10 | 상품 리스트 | 상품 view 권한 |
| 11 | 상품 디테일 | 상품 view 권한 |
| 12 | 활동 로그 | admin 이상 |
| 13 | 사용자 관리 | admin 이상 |

### 4.2 화면 흐름

```
로그인
  │
  ├─ 입고
  │   ├─ 입고 예정 목록 (조회/등록/수정/삭제)
  │   └─ 입고 처리
  │       └─ 예정 항목 클릭 → 위치 지정 → 실행 확인 → 완료
  │
  ├─ 출고
  │   ├─ 출고 예정 목록 (조회/등록/수정/삭제)
  │   └─ 출고 처리
  │       └─ 예정 항목 클릭 → FIFO 자동 계산 미리보기 → 실행 확인 → 완료
  │
  ├─ 재고 리스트
  │   └─ 상품별 합산 재고 표시
  │       └─ 클릭 → 디테일 (위치별 재고 + 입고일 + 수량 수정)
  │
  ├─ 상품 리스트
  │   └─ 전체 상품 목록 (등록/수정/삭제)
  │       └─ 클릭 → 재고 현황 (재고 디테일과 동일)
  │
  └─ 활동 로그 (admin 이상, 읽기 전용)
```

---

## 5. 입고/출고 처리 화면 UI 상세

### 5.0 창고 3D 뷰 개요

입고 처리 / 출고 처리 화면은 **창고 전면도 3D 뷰**를 중심으로 구성된다.

**렌더링 방식:** CSS 3D transform 기반 (Three.js 고려 가능하나 CSS로 충분한 수준)

**뷰 구성 방식: C안 — 2단계 혼합** (변경 요청 시 재논의)
1. **창고 미니맵**: 창고 내 모든 랙의 위치/상태를 요약한 오버뷰 (색상으로 재고 현황 표시)
2. **랙 상세 뷰**: 미니맵에서 특정 랙 클릭 시 해당 랙의 층 × 그룹 격자를 크게 표시

---

### 5.1 입고 처리 화면 레이아웃

```
┌─────────────────────────────────────────────────────────────┐
│  [창고1 탭] [창고2 탭] [창고3 탭]   ← 권한 있는 창고만 표시  │
├──────────────────────┬──────────────────────────────────────┤
│  입고 예정 목록       │  창고 전면도 (3D 랙 뷰)             │
│  ┌──────────────┐   │                                      │
│  │ ● 상품A  10개│   │  [랙1]  [랙2]  [랙3]  [랙4]  ...   │
│  │ ○ 상품B   5개│   │  ┌──┬──┐ ┌──┬──┐                  │
│  │ ○ 상품C  20개│   │  │  │  │ │2 │  │  ← 숫자=상품종류 수│
│  └──────────────┘   │  ├──┼──┤ ├──┼──┤                  │
│                      │  │  │1 │ │  │  │  ← 빈칸=빈 슬롯  │
│                      │  └──┴──┘ └──┴──┘                  │
│                      │                                      │
├──────────────────────┴──────────────────────────────────────┤
│  슬롯 클릭 시 하단 디테일 리스트                             │
│  위치: 창고1 > 2번랙 > 1층 > 2번                           │
│  ┌─────────┬──────────┬──────────┬──────┐                 │
│  │ 상품코드 │ 상품명   │ 입고일   │ 수량 │                 │
│  │ P001    │ 상품A   │ 2026-03-01│  8개 │                 │
│  └─────────┴──────────┴──────────┴──────┘                 │
└─────────────────────────────────────────────────────────────┘
```

**슬롯 표시 규칙:**

| 상태 | 슬롯 표시 |
|---|---|
| 파레트 없음 (빈 슬롯) | 빈 흰색 박스 |
| 파레트 있음 | 슬롯 중앙에 파레트 위 **상품 종류 수** (숫자) 표시 |
| 선택된 예정 상품과 동일 상품이 있는 슬롯 | 하이라이트 색상으로 강조 |

**입고 예정 목록 클릭 시:**
- 해당 상품이 현재 보관 중인 슬롯들이 3D 뷰에서 하이라이트
- 빈 슬롯도 별도 색상으로 강조 (신규 파레트 생성 유도)

**입고 위치 지정:**
- **빈 슬롯 클릭** → 새 파레트 생성 후 해당 상품 입고 확인 모달 → 실행
- **기존 파레트 슬롯 클릭** → 혼적 여부 확인 모달 → 확인 시 해당 파레트에 추가 → 실행

---

### 5.2 출고 처리 화면 레이아웃

입고 처리 화면과 동일한 3D 뷰 구조를 사용한다.

```
┌─────────────────────────────────────────────────────────────┐
│  [창고1 탭] [창고2 탭] [창고3 탭]                           │
├──────────────────────┬──────────────────────────────────────┤
│  출고 예정 목록       │  창고 전면도 (3D 랙 뷰)             │
│  ┌──────────────┐   │                                      │
│  │ ● 상품A  15개│   │  FIFO 대상 슬롯 하이라이트 표시      │
│  │ ○ 상품B  10개│   │  (입고일 빠른 순서대로 강조)         │
│  └──────────────┘   │                                      │
│                      │                                      │
├──────────────────────┴──────────────────────────────────────┤
│  슬롯 클릭 시 하단 디테일 + FIFO 출고 계획 미리보기         │
│  출고 계획: 상품A (입고일 2026-01-01, 10개) +               │
│             상품A (입고일 2026-02-01, 5개)                  │
│  [출고 실행] 버튼                                           │
└─────────────────────────────────────────────────────────────┘
```

**출고 예정 목록 클릭 시:**
- FIFO 순서에 따른 출고 대상 슬롯들이 순서별 색상(1순위/2순위 등)으로 하이라이트
- 하단에 자동 계산된 FIFO 출고 계획 표시
- 확인 후 [출고 실행] 버튼으로 처리

---

## 6. 핵심 로직 상세

### 5.1 입고 처리 흐름

1. 입고 예정 목록에서 처리할 건 선택
2. 3D 뷰에서 슬롯 클릭하여 위치(창고 > 랙 > 층 > 그룹) 지정
   - **빈 슬롯 선택 시**: 새 `pallets` 레코드 생성 → `inventory_items` 레코드 추가
   - **기존 파레트 있는 슬롯 선택 시**: 해당 `pallet_id`에 `inventory_items` 레코드 추가 (혼적)
3. 실행 → `inbound_records` 생성 (inbound_schedule_id + pallet_id + quantity)
4. `inbound_schedules.status` → `done` 업데이트
5. 활동 로그 기록

### 5.2 출고 처리 흐름 (FIFO)

1. 출고 예정 목록에서 처리할 건 선택
2. 시스템이 해당 product_id의 `inventory_items`를 `received_at` 오름차순으로 조회
3. 요청 수량을 채울 때까지 순서대로 차감 계획 생성 → 화면에 미리보기 표시
   - 예: 출고 15개 → A재고(10개) 전량 + B재고(5개) 차감 계획
4. 실행 확인 → `outbound_records` 생성, `inventory_items.quantity` 차감
5. `outbound_schedules.status` → `done` 업데이트
6. 활동 로그 기록

### 5.3 재고 표시 규칙

- **재고 리스트**: product_code 기준으로 모든 `inventory_items.quantity` 합산 표시
- **재고 디테일**: 동일 product_code의 각 `inventory_items` 레코드를 위치 + 입고일 + 수량으로 개별 표시

---

## 6. DB 테이블 구조

### 창고/위치

```sql
warehouses
  id, name, type ENUM('normal', 'electric'), created_at, updated_at

racks
  id, warehouse_id, rack_no, floors_count, groups_per_floor, created_at

rack_locations
  id, rack_id, floor, group_no
```

### 상품/재고

```sql
products
  id, product_code, name, created_at, updated_at, deleted_at

pallets
  id, rack_location_id, created_at, updated_at
  -- rack_location_id: 현재 적재된 슬롯. 슬롯당 1개만 존재 가능.

inventory_items
  id, product_id, pallet_id, quantity,
  received_at, production_date, created_at, updated_at
  -- 같은 pallet_id에 여러 product_id 가능 (혼적)
  -- 같은 product_id라도 received_at이 다르면 별도 레코드
```

### 입출고

```sql
inbound_schedules
  id, product_id, quantity, scheduled_date,
  status ENUM('pending', 'done', 'cancelled'),
  note, created_by, created_at, updated_at

inbound_records
  id, inbound_schedule_id, pallet_id,
  quantity, processed_by, processed_at
  -- 입고 시 빈 슬롯 선택 → 새 pallet 생성 후 inventory_item 추가
  -- 기존 pallet이 있는 슬롯 선택 → 해당 pallet에 inventory_item 추가 (혼적)

outbound_schedules
  id, product_id, quantity, scheduled_date,
  status ENUM('pending', 'done', 'cancelled'),
  note, created_by, created_at, updated_at

outbound_records
  id, outbound_schedule_id, inventory_item_id,
  quantity, processed_by, processed_at
```

### 사용자/권한

```sql
users
  id, name, email, password,
  role ENUM('developer', 'super_admin', 'admin', 'user'),
  is_approved BOOLEAN, created_at, updated_at

user_permissions
  id, user_id, warehouse_id (nullable),
  feature ENUM('inbound_schedule', 'inbound_execute',
               'outbound_schedule', 'outbound_execute',
               'inventory', 'product', 'log'),
  actions JSON  -- ["view","create","update","delete","execute"]
```

### 로그

```sql
activity_logs
  id, user_id, action, feature, target_id,
  payload JSON, ip, created_at
```

> developer 계정의 액션은 이 테이블에 INSERT하지 않는다.

---

## 7. 미결 사항

- 대시보드 화면 필요 여부 (창고별 재고 현황, 오늘 입출고 예정 요약)
- Electron / Flutter 단계에서 Laravel과 API 공유 방식 확정 필요
- 전동랙 관련 추가 기능 상세 (전동랙 고유 제어 기능 여부)
