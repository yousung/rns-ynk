# 웹 플랫폼 — 입출고·대시보드 분석

## 대시보드 (Dashboard)

### KPI 항목
1. **총 재고 수량** (cyan) — 전체 inventory 합계 + 사용 중인 팔레트 개수 표시
2. **입고 예정** (amber) — pending 상태의 입고 건수 + 예정 수량 합계
3. **출고 예정** (red) — pending 상태의 출고 건수 + 예정 수량 합계
4. **등록 상품** (text-primary) — 등록된 상품 종수 + 카테고리 개수
5. **창고 가동률** (dynamic) — 팔레트/전체슬롯 비율 % (색상: 80% 이상 red, 60-80% amber, 60% 이상 cyan)

### 테이블 항목
- **입고 예정 테이블**: 상품명, 수량, 예정일 (pending 상태만, 상위 8개)
- **출고 예정 테이블**: 상품명, 수량, 예정일 (pending 상태만, 상위 8개)
- **최근 활동 로그**: 일시, 사용자, 기능(배지), 내용 (상위 8개)

---

## 입고 처리 흐름

### 1단계: 입고 예정 선택
- **위치**: 왼쪽 사이드 패널 (188px 고정 너비)
- **화면**: 입고 예정 목록 (필터링: 전체/대기/완료/취소)
- **액션**: 상품명으로 검색 + 항목 클릭하여 선택
- **상태**: 선택 시 오른쪽 창고 매트릭스 활성화

### 2단계: 위치 선택
- **매트릭스 표시**: Type B 창고 (기본)
  - 각 셀: 랙-층 조합
  - 각 셀 내 미니블록: 단(kan) 표시 (occupied/empty/selected)
- **클릭**: 층(floor) 클릭 → 칸 선택 가능
- **자동 칸 매칭**: 선택된 층에서 빈 칸 자동 탐지

### 3단계: 입고 실행
- **액션 바**: 
  - 좌측: 입고 상품 정보 (상품명, 수량, 예정일) + 선택된 위치 (랙번호, 층, 단)
  - 중앙: 수량 입력 (기본값: 스케줄 수량)
  - 우측: "입고 실행" 버튼 (선택 완료 시 활성화)
- **실행**: 알림 표시 후 상태 초기화

### 하단 정보
- **칸별 현황**: 선택된 층의 각 단별 적재 상태 (FloorPlanRackDetail)
- **적재 상세**: 선택된 단의 팔레트 내용 (KanDetailPanel)
- **통계 바**: 현재 입고 PLT, 잔여 공간, 전체 용량

---

## 출고 처리 흐름 (FIFO)

### 1단계: 출고 예정 선택
- **위치**: 왼쪽 사이드 패널 (동일)
- **자동 창고 이동**: 선택 시 해당 상품이 있는 창고로 자동 전환
- **검색**: 상품명 또는 예정일로 필터링

### 2단계: FIFO 계산 및 표시
- **계산 로직**: 
  - 같은 상품 팔레트 중 received_at(입고일)이 가장 오래된 것부터 순서화
  - rank 부여: F1(가장 오래됨, amber), F2(파랑), F3+(회색)
- **매트릭스 표시**: 
  - Type B 셀별 미니블록 색상: fifo1(amber), fifo2(파랑), fifon(회색), occupied(다른상품)
  - Type A 셀 색상: rc-fifo1, rc-fifo2, rc-fifon

### 3단계: 출고 위치 확인 및 실행
- **액션 바**:
  - 좌측: 출고 상품명 + FIFO F1 위치 자동 강조 + 재고 부족 경고 (재고/필요량)
  - 중앙 뱃지: 현재 재고, 입고예정, 출고수량, 잔여 예측
  - 수량 입력 및 실행 버튼

### 하단 3분할 뷰
1. **칸별 현황**: 팔레트 있는 단만 표시 (disableEmptyKan=true)
2. **적재 상세**: 선택된 단의 상세 정보
3. **재고 리스트 (FIFO 테이블)**:
   - 순위, 입고일, 위치 (랙번호-층-단), 수량 표시
   - 클릭 시 해당 셀 선택
   - F1, F2 강조 (amber, 파랑)

---

## 주요 UI 요소

### 공통 UI
- **헤더 바**: 페이지 타이틀 (예: "입고 처리", "출고 처리")
- **창고 탭**: 여러 창고 선택 (WarehouseTabs)
- **창고 미니맵**: 현재 선택 위치 미리보기 (WarehouseMinimap)
- **통계 바**: 하단 고정 통계 (현재재고, 잔여공간, 전체용량)

### 시각화 모드 (warehouseType별)
- **Type B** (기본, Matrix): 2D 매트릭스 뷰 (랙 × 층, 미니블록)
- **Type A** (RackGrid): 개별 랙 그리드 뷰
- **Type C** (FloorPlan): 평면도 뷰
- **Type D** (Elevation): 입면도 뷰

### 입고 전용 요소
- 미니블록 상태: mini-sel(선택), mini-product(해당상품), mini-filled(점유), mini-empty(비어있음)
- 셀 클래스: rc-highlight(선택), rc-filled(점유), rc-empty(비어있음)

### 출고 전용 요소
- 미니블록 FIFO: mini-fifo1(F1, amber), mini-fifo2(F2, 파랑), mini-fifon(F3+), mini-occupied(다른상품)
- 셀 클래스 FIFO: rc-fifo1, rc-fifo2, rc-fifon, rc-filled, rc-empty
- FIFO 재고 리스트: 테이블 형식, 클릭으로 선택 가능

### 예정 목록 페이지
- **필터 버튼**: 전체, 대기, 완료, 취소 상태 필터
- **테이블**: 번호, 상품명, 수량, 예정일, 상태(배지), 비고, 액션 버튼("처리")
- **처리 버튼**: -execute 페이지로 네비게이션

---

## 데이터 흐름

### 상태 관리 (useDataStore)
- `inboundSchedules` / `outboundSchedules`: 예정 목록
- `products`: 상품 마스터
- `racks`: 창고 랙 데이터 (warehouse_id, floors, groups, rack_no)
- `pallets`: 팔레트 위치 (location: "rackId-floor-kan")
- `inventoryItems`: 팔레트별 상품 (pallet_id, product_id, quantity, received_at)
- `activityLogs`: 사용자 활동 로그

### 선택 상태 (local state)
- `selectedScheduleId`: 현재 선택된 예정 ID
- `selectedCell`: { rackId, floor, kan }
- `selectedWarehouseId`: 현재 선택 창고
- `searchQuery`: 예정 목록 검색어
- `execQty`: 입력된 실행 수량

---

## 프레젠테이션 포인트

1. **대시보드**: 창고 운영 현황의 한 눈에 보는 대시보드 (KPI + 최근 활동)
2. **입고 처리**: 예정 → 위치선택 → 실행의 3단계 간단한 워크플로우
3. **출고 처리**: FIFO 자동 계산 + 시각화를 통한 선입선출 강제화
4. **유연한 시각화**: Type A/B/C/D 여러 창고 시각화 모드 지원
5. **실시간 상태**: 검색, 필터, 자동 업데이트를 통한 동적 UI
