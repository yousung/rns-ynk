// ============================================================
// 창고 관리 시스템 - 공유 데이터
// ============================================================

const warehouses = [
  { id: 1, name: '창고1', type: 'normal' },
  { id: 2, name: '창고2', type: 'normal' },
  { id: 3, name: '창고3', type: 'electric' },
];

const racks = [
  // 창고1 (4개, 3층 4그룹)
  { id: 1, warehouse_id: 1, rack_no: 1,  floors: 3, groups: 4 },
  { id: 2, warehouse_id: 1, rack_no: 2,  floors: 3, groups: 4 },
  { id: 3, warehouse_id: 1, rack_no: 3,  floors: 3, groups: 4 },
  { id: 4, warehouse_id: 1, rack_no: 4,  floors: 3, groups: 4 },
  // 창고2 (3개, 3층 4그룹)
  { id: 5, warehouse_id: 2, rack_no: 1,  floors: 3, groups: 4 },
  { id: 6, warehouse_id: 2, rack_no: 2,  floors: 3, groups: 4 },
  { id: 7, warehouse_id: 2, rack_no: 3,  floors: 3, groups: 4 },
  // 창고3 (30개 — rack_no 1~15: 4층, 16~30: 6층, 모두 4그룹)
  { id: 10, warehouse_id: 3, rack_no: 1,  floors: 4, groups: 4 },
  { id: 11, warehouse_id: 3, rack_no: 2,  floors: 4, groups: 4 },
  { id: 12, warehouse_id: 3, rack_no: 3,  floors: 4, groups: 4 },
  { id: 13, warehouse_id: 3, rack_no: 4,  floors: 4, groups: 4 },
  { id: 14, warehouse_id: 3, rack_no: 5,  floors: 4, groups: 4 },
  { id: 15, warehouse_id: 3, rack_no: 6,  floors: 4, groups: 4 },
  { id: 16, warehouse_id: 3, rack_no: 7,  floors: 4, groups: 4 },
  { id: 17, warehouse_id: 3, rack_no: 8,  floors: 4, groups: 4 },
  { id: 18, warehouse_id: 3, rack_no: 9,  floors: 4, groups: 4 },
  { id: 19, warehouse_id: 3, rack_no: 10, floors: 4, groups: 4 },
  { id: 20, warehouse_id: 3, rack_no: 11, floors: 4, groups: 4 },
  { id: 21, warehouse_id: 3, rack_no: 12, floors: 4, groups: 4 },
  { id: 22, warehouse_id: 3, rack_no: 13, floors: 4, groups: 4 },
  { id: 23, warehouse_id: 3, rack_no: 14, floors: 4, groups: 4 },
  { id: 24, warehouse_id: 3, rack_no: 15, floors: 4, groups: 4 },
  { id: 25, warehouse_id: 3, rack_no: 16, floors: 6, groups: 4 },
  { id: 26, warehouse_id: 3, rack_no: 17, floors: 6, groups: 4 },
  { id: 27, warehouse_id: 3, rack_no: 18, floors: 6, groups: 4 },
  { id: 28, warehouse_id: 3, rack_no: 19, floors: 6, groups: 4 },
  { id: 29, warehouse_id: 3, rack_no: 20, floors: 6, groups: 4 },
  { id: 30, warehouse_id: 3, rack_no: 21, floors: 6, groups: 4 },
  { id: 31, warehouse_id: 3, rack_no: 22, floors: 6, groups: 4 },
  { id: 32, warehouse_id: 3, rack_no: 23, floors: 6, groups: 4 },
  { id: 33, warehouse_id: 3, rack_no: 24, floors: 6, groups: 4 },
  { id: 34, warehouse_id: 3, rack_no: 25, floors: 6, groups: 4 },
  { id: 35, warehouse_id: 3, rack_no: 26, floors: 6, groups: 4 },
  { id: 36, warehouse_id: 3, rack_no: 27, floors: 6, groups: 4 },
  { id: 37, warehouse_id: 3, rack_no: 28, floors: 6, groups: 4 },
  { id: 38, warehouse_id: 3, rack_no: 29, floors: 6, groups: 4 },
  { id: 39, warehouse_id: 3, rack_no: 30, floors: 6, groups: 4 },
];

const pallets = [
  { id: 1,  location: '1-3-1' },
  { id: 2,  location: '1-3-2' },
  { id: 3,  location: '1-2-1' },
  { id: 4,  location: '2-1-3' },
  { id: 5,  location: '2-2-2' },
  { id: 6,  location: '3-3-4' },
  { id: 7,  location: '10-2-1' },
  { id: 8,  location: '10-4-3' },
  { id: 9,  location: '12-1-2' },
  { id: 10, location: '15-3-4' },
  { id: 11, location: '20-2-2' },
  { id: 12, location: '25-5-1' },
  { id: 13, location: '30-6-3' },
  { id: 14, location: '35-4-2' },
];

const products = [
  { id: 1, code: 'P001', name: '상품A', created_at: '2026-01-10' },
  { id: 2, code: 'P002', name: '상품B', created_at: '2026-01-15' },
  { id: 3, code: 'P003', name: '상품C', created_at: '2026-02-01' },
];

const inventoryItems = [
  { id: 1, product_id: 1, pallet_id: 1,  quantity: 8,  received_at: '2026-03-01' },
  { id: 2, product_id: 1, pallet_id: 2,  quantity: 5,  received_at: '2026-02-15' },
  { id: 3, product_id: 2, pallet_id: 2,  quantity: 3,  received_at: '2026-03-10' },
  { id: 4, product_id: 1, pallet_id: 3,  quantity: 10, received_at: '2026-01-20' },
  { id: 5, product_id: 2, pallet_id: 4,  quantity: 7,  received_at: '2026-03-05' },
  { id: 6, product_id: 3, pallet_id: 5,  quantity: 12, received_at: '2026-02-28' },
  { id: 7, product_id: 1, pallet_id: 6,  quantity: 4,  received_at: '2026-03-15' },
  { id: 8, product_id: 2, pallet_id: 7,  quantity: 6,  received_at: '2026-03-20' },
  { id: 9, product_id: 3, pallet_id: 12, quantity: 9,  received_at: '2026-04-01' },
];

const inboundSchedules = [
  { id: 1, product_id: 1, quantity: 20, scheduled_date: '2026-04-16', status: 'pending', note: '긴급' },
  { id: 2, product_id: 2, quantity: 15, scheduled_date: '2026-04-16', status: 'pending', note: '' },
  { id: 3, product_id: 3, quantity: 10, scheduled_date: '2026-04-17', status: 'pending', note: '' },
  { id: 4, product_id: 1, quantity: 8,  scheduled_date: '2026-04-15', status: 'done',    note: '' },
];

const outboundSchedules = [
  { id: 1, product_id: 1, quantity: 15, scheduled_date: '2026-04-16', status: 'pending', note: '급송' },
  { id: 2, product_id: 2, quantity: 5,  scheduled_date: '2026-04-16', status: 'pending', note: '' },
  { id: 3, product_id: 1, quantity: 5,  scheduled_date: '2026-04-15', status: 'done',    note: '' },
];

const activityLogs = [
  { id: 1, user: '김관리', action: '입고 처리', feature: 'inbound_execute',  detail: '상품A 20개 → 창고1 1번랙 2층 3번', created_at: '2026-04-15 14:32' },
  { id: 2, user: '이사용', action: '출고 처리', feature: 'outbound_execute', detail: '상품B 10개 출고',                    created_at: '2026-04-15 11:10' },
  { id: 3, user: '김관리', action: '입고 예정 등록', feature: 'inbound_schedule', detail: '상품C 30개 예정',              created_at: '2026-04-14 09:00' },
];

const users = [
  { id: 1, name: '김개발', email: 'dev@example.com',   role: 'developer',   is_approved: true  },
  { id: 2, name: '이관리', email: 'super@example.com', role: 'super_admin', is_approved: true  },
  { id: 3, name: '박관리', email: 'admin@example.com', role: 'admin',       is_approved: true  },
  { id: 4, name: '김사용', email: 'user1@example.com', role: 'user',        is_approved: true  },
  { id: 5, name: '이신규', email: 'user2@example.com', role: 'user',        is_approved: false },
];
