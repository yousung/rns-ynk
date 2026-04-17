// ============================================================
// 창고 관리 시스템 - 공유 데이터 (밴드류 의류 제조사)
// ============================================================

const warehouses = [
  { id: 1, name: '완제품창고', type: 'normal' },
  { id: 2, name: '부자재창고', type: 'normal' },
  { id: 3, name: '전동랙창고', type: 'electric' },
];

const racks = [
  // 완제품창고 (12개, 3층 4그룹)
  { id: 1,  warehouse_id: 1, rack_no: 1,  floors: 3, groups: 4 },
  { id: 2,  warehouse_id: 1, rack_no: 2,  floors: 3, groups: 4 },
  { id: 3,  warehouse_id: 1, rack_no: 3,  floors: 3, groups: 4 },
  { id: 4,  warehouse_id: 1, rack_no: 4,  floors: 3, groups: 4 },
  { id: 40, warehouse_id: 1, rack_no: 5,  floors: 3, groups: 4 },
  { id: 41, warehouse_id: 1, rack_no: 6,  floors: 3, groups: 4 },
  { id: 42, warehouse_id: 1, rack_no: 7,  floors: 3, groups: 4 },
  { id: 43, warehouse_id: 1, rack_no: 8,  floors: 3, groups: 4 },
  { id: 44, warehouse_id: 1, rack_no: 9,  floors: 3, groups: 4 },
  { id: 45, warehouse_id: 1, rack_no: 10, floors: 3, groups: 4 },
  { id: 46, warehouse_id: 1, rack_no: 11, floors: 3, groups: 4 },
  { id: 47, warehouse_id: 1, rack_no: 12, floors: 3, groups: 4 },
  // 부자재창고 (12개, 3층 4그룹)
  { id: 5,  warehouse_id: 2, rack_no: 1,  floors: 3, groups: 4 },
  { id: 6,  warehouse_id: 2, rack_no: 2,  floors: 3, groups: 4 },
  { id: 7,  warehouse_id: 2, rack_no: 3,  floors: 3, groups: 4 },
  { id: 48, warehouse_id: 2, rack_no: 4,  floors: 3, groups: 4 },
  { id: 49, warehouse_id: 2, rack_no: 5,  floors: 3, groups: 4 },
  { id: 50, warehouse_id: 2, rack_no: 6,  floors: 3, groups: 4 },
  { id: 51, warehouse_id: 2, rack_no: 7,  floors: 3, groups: 4 },
  { id: 52, warehouse_id: 2, rack_no: 8,  floors: 3, groups: 4 },
  { id: 53, warehouse_id: 2, rack_no: 9,  floors: 3, groups: 4 },
  { id: 54, warehouse_id: 2, rack_no: 10, floors: 3, groups: 4 },
  { id: 55, warehouse_id: 2, rack_no: 11, floors: 3, groups: 4 },
  { id: 56, warehouse_id: 2, rack_no: 12, floors: 3, groups: 4 },
  // 전동랙창고 (30개 — rack_no 1~15: 4단×10칸, rack_no 16~30: 3단×10칸)
  { id: 10, warehouse_id: 3, rack_no: 1,  floors: 4, groups: 10 },
  { id: 11, warehouse_id: 3, rack_no: 2,  floors: 4, groups: 10 },
  { id: 12, warehouse_id: 3, rack_no: 3,  floors: 4, groups: 10 },
  { id: 13, warehouse_id: 3, rack_no: 4,  floors: 4, groups: 10 },
  { id: 14, warehouse_id: 3, rack_no: 5,  floors: 4, groups: 10 },
  { id: 15, warehouse_id: 3, rack_no: 6,  floors: 4, groups: 10 },
  { id: 16, warehouse_id: 3, rack_no: 7,  floors: 4, groups: 10 },
  { id: 17, warehouse_id: 3, rack_no: 8,  floors: 4, groups: 10 },
  { id: 18, warehouse_id: 3, rack_no: 9,  floors: 4, groups: 10 },
  { id: 19, warehouse_id: 3, rack_no: 10, floors: 4, groups: 10 },
  { id: 20, warehouse_id: 3, rack_no: 11, floors: 4, groups: 10 },
  { id: 21, warehouse_id: 3, rack_no: 12, floors: 4, groups: 10 },
  { id: 22, warehouse_id: 3, rack_no: 13, floors: 4, groups: 10 },
  { id: 23, warehouse_id: 3, rack_no: 14, floors: 4, groups: 10 },
  { id: 24, warehouse_id: 3, rack_no: 15, floors: 4, groups: 10 },
  { id: 25, warehouse_id: 3, rack_no: 16, floors: 3, groups: 10 },
  { id: 26, warehouse_id: 3, rack_no: 17, floors: 3, groups: 10 },
  { id: 27, warehouse_id: 3, rack_no: 18, floors: 3, groups: 10 },
  { id: 28, warehouse_id: 3, rack_no: 19, floors: 3, groups: 10 },
  { id: 29, warehouse_id: 3, rack_no: 20, floors: 3, groups: 10 },
  { id: 30, warehouse_id: 3, rack_no: 21, floors: 3, groups: 10 },
  { id: 31, warehouse_id: 3, rack_no: 22, floors: 3, groups: 10 },
  { id: 32, warehouse_id: 3, rack_no: 23, floors: 3, groups: 10 },
  { id: 33, warehouse_id: 3, rack_no: 24, floors: 3, groups: 10 },
  { id: 34, warehouse_id: 3, rack_no: 25, floors: 3, groups: 10 },
  { id: 35, warehouse_id: 3, rack_no: 26, floors: 3, groups: 10 },
  { id: 36, warehouse_id: 3, rack_no: 27, floors: 3, groups: 10 },
  { id: 37, warehouse_id: 3, rack_no: 28, floors: 3, groups: 10 },
  { id: 38, warehouse_id: 3, rack_no: 29, floors: 3, groups: 10 },
  { id: 39, warehouse_id: 3, rack_no: 30, floors: 3, groups: 10 },
];

const pallets = [
  // 완제품창고
  { id: 1,  location: '1-3-1' },
  { id: 2,  location: '1-3-2' },
  { id: 3,  location: '1-2-1' },
  { id: 4,  location: '2-1-3' },
  { id: 5,  location: '2-2-2' },
  { id: 6,  location: '3-3-4' },
  { id: 7,  location: '4-1-2' },
  { id: 8,  location: '5-2-3' },
  // 부자재창고
  { id: 9,  location: '1-1-1' },
  { id: 10, location: '1-2-3' },
  { id: 11, location: '2-3-2' },
  { id: 12, location: '3-1-4' },
  { id: 13, location: '4-2-1' },
  // 전동랙창고
  { id: 14, location: '10-2-1' },
  { id: 15, location: '10-4-3' },
  { id: 16, location: '12-1-2' },
  { id: 17, location: '15-3-4' },
  { id: 18, location: '20-2-2' },
  { id: 19, location: '25-2-1' },
  { id: 20, location: '30-3-3' },
  // 혼합 팔레트 (전동랙창고 11번 랙 2단 5칸)
  { id: 21, location: '11-2-5' },
];

const products = [
  // 완제품 (FP: Finished Product)
  { id: 1,  code: 'FP-001', name: '헤어밴드 블랙 S',        created_at: '2025-06-01' },
  { id: 2,  code: 'FP-002', name: '헤어밴드 화이트 S',       created_at: '2025-06-01' },
  { id: 3,  code: 'FP-003', name: '헤어밴드 네이비 M',       created_at: '2025-06-15' },
  { id: 4,  code: 'FP-004', name: '허리밴드 블랙 M',         created_at: '2025-07-01' },
  { id: 5,  code: 'FP-005', name: '허리밴드 베이지 L',       created_at: '2025-07-01' },
  { id: 6,  code: 'FP-006', name: '손목밴드 블랙 Free',      created_at: '2025-08-01' },
  { id: 7,  code: 'FP-007', name: '리본밴드 핑크 Free',      created_at: '2025-09-01' },
  { id: 8,  code: 'FP-008', name: '스포츠밴드 그레이 M',     created_at: '2025-09-15' },
  { id: 9,  code: 'FP-009', name: '헤어타이 혼합 10입',      created_at: '2025-10-01' },
  { id: 10, code: 'FP-010', name: '넥밴드 블랙 Free',        created_at: '2025-11-01' },
  // 부자재 (RM: Raw Material)
  { id: 11, code: 'RM-001', name: '탄성원단 블랙 (롤/50m)',  created_at: '2025-06-01' },
  { id: 12, code: 'RM-002', name: '탄성원단 화이트 (롤/50m)',created_at: '2025-06-01' },
  { id: 13, code: 'RM-003', name: '고무원사 3mm (롤/200m)',  created_at: '2025-06-15' },
  { id: 14, code: 'RM-004', name: '고무원사 5mm (롤/200m)',  created_at: '2025-06-15' },
  { id: 15, code: 'RM-005', name: '염료 블랙 (1kg)',         created_at: '2025-07-01' },
  { id: 16, code: 'RM-006', name: '버클 클립 (100개입)',     created_at: '2025-08-01' },
  { id: 17, code: 'RM-007', name: '포장비닐 소 (1000매)',    created_at: '2025-09-01' },
  { id: 18, code: 'RM-008', name: '라벨 국내용 (500매)',     created_at: '2025-09-01' },
  { id: 19, code: 'RM-009', name: '라벨 수출용 영문 (500매)',created_at: '2025-10-01' },
  { id: 20, code: 'RM-010', name: '포장박스 중 (100개)',     created_at: '2025-11-01' },
];

const inventoryItems = [
  // 완제품창고 재고
  { id: 1,  product_id: 1,  pallet_id: 1,  quantity: 120, received_at: '2026-03-10' },
  { id: 2,  product_id: 2,  pallet_id: 1,  quantity: 80,  received_at: '2026-03-10' },
  { id: 3,  product_id: 3,  pallet_id: 2,  quantity: 95,  received_at: '2026-03-12' },
  { id: 4,  product_id: 4,  pallet_id: 3,  quantity: 60,  received_at: '2026-03-15' },
  { id: 5,  product_id: 5,  pallet_id: 4,  quantity: 45,  received_at: '2026-03-20' },
  { id: 6,  product_id: 6,  pallet_id: 5,  quantity: 200, received_at: '2026-03-22' },
  { id: 7,  product_id: 7,  pallet_id: 6,  quantity: 150, received_at: '2026-03-25' },
  { id: 8,  product_id: 8,  pallet_id: 7,  quantity: 75,  received_at: '2026-04-01' },
  { id: 9,  product_id: 9,  pallet_id: 8,  quantity: 300, received_at: '2026-04-05' },
  // 부자재창고 재고
  { id: 10, product_id: 11, pallet_id: 9,  quantity: 30,  received_at: '2026-02-20' },
  { id: 11, product_id: 12, pallet_id: 10, quantity: 25,  received_at: '2026-02-20' },
  { id: 12, product_id: 13, pallet_id: 11, quantity: 50,  received_at: '2026-03-05' },
  { id: 13, product_id: 14, pallet_id: 12, quantity: 40,  received_at: '2026-03-05' },
  { id: 14, product_id: 15, pallet_id: 13, quantity: 18,  received_at: '2026-03-18' },
  // 전동랙창고 재고
  { id: 15, product_id: 1,  pallet_id: 14, quantity: 240, received_at: '2026-04-08' },
  { id: 16, product_id: 3,  pallet_id: 15, quantity: 180, received_at: '2026-04-08' },
  { id: 17, product_id: 6,  pallet_id: 16, quantity: 500, received_at: '2026-04-10' },
  { id: 18, product_id: 9,  pallet_id: 17, quantity: 600, received_at: '2026-04-10' },
  { id: 19, product_id: 16, pallet_id: 18, quantity: 80,  received_at: '2026-04-12' },
  { id: 20, product_id: 17, pallet_id: 19, quantity: 120, received_at: '2026-04-12' },
  // 혼합 팔레트 — 신규 입고 검수 중 (10종)
  { id: 21, product_id: 1,  pallet_id: 21, quantity: 50,  received_at: '2026-04-15' },
  { id: 22, product_id: 2,  pallet_id: 21, quantity: 50,  received_at: '2026-04-15' },
  { id: 23, product_id: 3,  pallet_id: 21, quantity: 40,  received_at: '2026-04-15' },
  { id: 24, product_id: 4,  pallet_id: 21, quantity: 30,  received_at: '2026-04-15' },
  { id: 25, product_id: 5,  pallet_id: 21, quantity: 30,  received_at: '2026-04-15' },
  { id: 26, product_id: 6,  pallet_id: 21, quantity: 100, received_at: '2026-04-15' },
  { id: 27, product_id: 7,  pallet_id: 21, quantity: 80,  received_at: '2026-04-16' },
  { id: 28, product_id: 8,  pallet_id: 21, quantity: 60,  received_at: '2026-04-16' },
  { id: 29, product_id: 9,  pallet_id: 21, quantity: 150, received_at: '2026-04-16' },
  { id: 30, product_id: 10, pallet_id: 21, quantity: 40,  received_at: '2026-04-16' },
];

const inboundSchedules = [
  { id: 1, product_id: 11, quantity: 40,  scheduled_date: '2026-04-16', status: 'pending', note: '긴급 — (주)탄성텍스타일' },
  { id: 2, product_id: 13, quantity: 60,  scheduled_date: '2026-04-16', status: 'pending', note: '동양고무원사' },
  { id: 3, product_id: 1,  quantity: 300, scheduled_date: '2026-04-17', status: 'pending', note: '자사 생산' },
  { id: 4, product_id: 6,  quantity: 500, scheduled_date: '2026-04-17', status: 'pending', note: '자사 생산' },
  { id: 5, product_id: 15, quantity: 20,  scheduled_date: '2026-04-18', status: 'pending', note: '보광염색' },
  { id: 6, product_id: 18, quantity: 100, scheduled_date: '2026-04-18', status: 'pending', note: '인쇄라벨 재주문' },
  { id: 7, product_id: 3,  quantity: 200, scheduled_date: '2026-04-15', status: 'done',    note: '자사 생산' },
  { id: 8, product_id: 12, quantity: 30,  scheduled_date: '2026-04-14', status: 'done',    note: '(주)탄성텍스타일' },
];

const outboundSchedules = [
  { id: 1, product_id: 1,  quantity: 200, scheduled_date: '2026-04-16', status: 'pending', note: '올리브영 정기납품' },
  { id: 2, product_id: 9,  quantity: 500, scheduled_date: '2026-04-16', status: 'pending', note: '다이소 긴급' },
  { id: 3, product_id: 6,  quantity: 150, scheduled_date: '2026-04-17', status: 'pending', note: 'CJ오쇼핑 방송분' },
  { id: 4, product_id: 3,  quantity: 100, scheduled_date: '2026-04-17', status: 'pending', note: '이마트 납품' },
  { id: 5, product_id: 8,  quantity: 80,  scheduled_date: '2026-04-18', status: 'pending', note: '수출 — 일본 거래처' },
  { id: 6, product_id: 7,  quantity: 120, scheduled_date: '2026-04-18', status: 'pending', note: '수출 — 미국 거래처' },
  { id: 7, product_id: 2,  quantity: 80,  scheduled_date: '2026-04-15', status: 'done',    note: '올리브영 정기납품' },
  { id: 8, product_id: 4,  quantity: 50,  scheduled_date: '2026-04-14', status: 'done',    note: '홈쇼핑 소진분' },
];

const activityLogs = [
  { id: 1,  user: '김민준', action: '입고 처리',     feature: 'inbound_execute',   detail: '헤어밴드 네이비 M 200개 → 완제품창고 3번랙 2층 1번',    created_at: '2026-04-15 15:42' },
  { id: 2,  user: '이지훈', action: '출고 처리',     feature: 'outbound_execute',  detail: '헤어밴드 화이트 S 80개 출고 — 올리브영 정기납품',        created_at: '2026-04-15 14:10' },
  { id: 3,  user: '박서연', action: '입고 처리',     feature: 'inbound_execute',   detail: '탄성원단 화이트 롤 30개 → 부자재창고 1번랙 1층 1번',     created_at: '2026-04-15 11:25' },
  { id: 4,  user: '김민준', action: '출고 처리',     feature: 'outbound_execute',  detail: '허리밴드 블랙 M 50개 출고 — 홈쇼핑 소진분',             created_at: '2026-04-14 16:50' },
  { id: 5,  user: '이지훈', action: '입고 예정 등록', feature: 'inbound_schedule', detail: '고무원사 3mm 60롤 예정 등록 — 동양고무원사',             created_at: '2026-04-14 09:30' },
  { id: 6,  user: '최현우', action: '입고 처리',     feature: 'inbound_execute',   detail: '탄성원단 블랙 롤 30개 → 부자재창고 1번랙 2층 3번',      created_at: '2026-04-12 13:15' },
  { id: 7,  user: '박서연', action: '출고 예정 등록', feature: 'outbound_schedule', detail: '스포츠밴드 그레이 M 80개 예정 등록 — 수출 일본',        created_at: '2026-04-12 10:00' },
  { id: 8,  user: '이지훈', action: '입고 처리',     feature: 'inbound_execute',   detail: '헤어타이 혼합 10입 600세트 → 전동랙창고 10번랙 4층 3번', created_at: '2026-04-10 14:00' },
  { id: 9,  user: '김민준', action: '출고 처리',     feature: 'outbound_execute',  detail: '손목밴드 블랙 Free 500개 출고 — 전동랙창고',             created_at: '2026-04-10 11:30' },
  { id: 10, user: '최현우', action: '사용자 승인',    feature: 'users',             detail: '신규 사용자 정승현 승인 처리',                          created_at: '2026-04-09 09:05' },
];

const users = [
  { id: 1, name: '김개발',  email: 'dev@ynk-band.com',   role: 'developer',   is_approved: true  },
  { id: 2, name: '이관리',  email: 'super@ynk-band.com', role: 'super_admin', is_approved: true  },
  { id: 3, name: '최현우',  email: 'admin@ynk-band.com', role: 'admin',       is_approved: true  },
  { id: 4, name: '김민준',  email: 'minjun@ynk-band.com',role: 'user',        is_approved: true  },
  { id: 5, name: '이지훈',  email: 'jihun@ynk-band.com', role: 'user',        is_approved: true  },
  { id: 6, name: '박서연',  email: 'seoyeon@ynk-band.com',role: 'user',       is_approved: true  },
  { id: 7, name: '정승현',  email: 'sh.jung@ynk-band.com',role: 'user',       is_approved: false },
];
