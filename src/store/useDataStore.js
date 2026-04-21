import { create } from 'zustand';

export const MAX_RACK_COUNT = 31;

const warehouses = [
  { id: 1, name: '크로이드 원자재 창고', type: 'normal' },
  { id: 2, name: '부자재창고', type: 'normal' },
  { id: 3, name: '전동랙창고', type: 'electric', max_rack_count: 30 },
];

const racks = [
  { id: 1,  warehouse_id: 1, rack_no: 1,  floors: 12, groups: 3 },
  { id: 2,  warehouse_id: 1, rack_no: 2,  floors: 12, groups: 3 },
  { id: 3,  warehouse_id: 1, rack_no: 3,  floors: 12, groups: 3 },
  { id: 5,  warehouse_id: 2, rack_no: 1,  floors: 8, groups: 3 },
  { id: 6,  warehouse_id: 2, rack_no: 2,  floors: 8, groups: 3 },
  { id: 7,  warehouse_id: 2, rack_no: 3,  floors: 8, groups: 3 },
  { id: 48, warehouse_id: 2, rack_no: 4,  floors: 8, groups: 3 },
  { id: 49, warehouse_id: 2, rack_no: 5,  floors: 8, groups: 3 },
  { id: 50, warehouse_id: 2, rack_no: 6,  floors: 8, groups: 3 },
  { id: 10, warehouse_id: 3, rack_no: 1,  floors: 10, groups: 4 },
  { id: 11, warehouse_id: 3, rack_no: 2,  floors: 10, groups: 4 },
  { id: 12, warehouse_id: 3, rack_no: 3,  floors: 10, groups: 4 },
  { id: 13, warehouse_id: 3, rack_no: 4,  floors: 10, groups: 4 },
  { id: 14, warehouse_id: 3, rack_no: 5,  floors: 10, groups: 4 },
  { id: 15, warehouse_id: 3, rack_no: 6,  floors: 10, groups: 4 },
  { id: 16, warehouse_id: 3, rack_no: 7,  floors: 10, groups: 4 },
  { id: 17, warehouse_id: 3, rack_no: 8,  floors: 10, groups: 4 },
  { id: 18, warehouse_id: 3, rack_no: 9,  floors: 10, groups: 4 },
  { id: 19, warehouse_id: 3, rack_no: 10, floors: 10, groups: 4 },
  { id: 20, warehouse_id: 3, rack_no: 11, floors: 10, groups: 4 },
  { id: 21, warehouse_id: 3, rack_no: 12, floors: 10, groups: 4 },
  { id: 22, warehouse_id: 3, rack_no: 13, floors: 10, groups: 4 },
  { id: 23, warehouse_id: 3, rack_no: 14, floors: 10, groups: 4 },
  { id: 24, warehouse_id: 3, rack_no: 15, floors: 10, groups: 4 },
  { id: 25, warehouse_id: 3, rack_no: 16, floors: 10, groups: 3 },
  { id: 26, warehouse_id: 3, rack_no: 17, floors: 10, groups: 3 },
  { id: 27, warehouse_id: 3, rack_no: 18, floors: 10, groups: 3 },
  { id: 28, warehouse_id: 3, rack_no: 19, floors: 10, groups: 3 },
  { id: 29, warehouse_id: 3, rack_no: 20, floors: 10, groups: 3 },
  { id: 30, warehouse_id: 3, rack_no: 21, floors: 10, groups: 3 },
  { id: 31, warehouse_id: 3, rack_no: 22, floors: 10, groups: 3 },
  { id: 32, warehouse_id: 3, rack_no: 23, floors: 10, groups: 3 },
  { id: 33, warehouse_id: 3, rack_no: 24, floors: 10, groups: 3 },
  { id: 34, warehouse_id: 3, rack_no: 25, floors: 10, groups: 3 },
  { id: 35, warehouse_id: 3, rack_no: 26, floors: 10, groups: 3 },
  { id: 36, warehouse_id: 3, rack_no: 27, floors: 10, groups: 3 },
  { id: 37, warehouse_id: 3, rack_no: 28, floors: 10, groups: 3 },
  { id: 38, warehouse_id: 3, rack_no: 29, floors: 10, groups: 3 },
  { id: 39, warehouse_id: 3, rack_no: 30, floors: 10, groups: 3 },
  { id: 100, warehouse_id: 3, rack_no: 31, floors: 10, groups: 3 },
];

const pallets = (() => {
  const racksByWarehouse = {
    1: [{ id: 1, floors: 12, groups: 3 }, { id: 2, floors: 12, groups: 3 }, { id: 3, floors: 12, groups: 3 }],
    2: [{ id: 5, floors: 8, groups: 3 }, { id: 6, floors: 8, groups: 3 }, { id: 7, floors: 8, groups: 3 }, { id: 48, floors: 8, groups: 3 }, { id: 49, floors: 8, groups: 3 }, { id: 50, floors: 8, groups: 3 }],
    3: [{ id: 10, floors: 10, groups: 4 }, { id: 11, floors: 10, groups: 4 }, { id: 12, floors: 10, groups: 4 }, { id: 13, floors: 10, groups: 4 }, { id: 14, floors: 10, groups: 4 }, { id: 15, floors: 10, groups: 4 }, { id: 16, floors: 10, groups: 4 }, { id: 17, floors: 10, groups: 4 }, { id: 18, floors: 10, groups: 4 }, { id: 19, floors: 10, groups: 4 }, { id: 20, floors: 10, groups: 4 }, { id: 21, floors: 10, groups: 4 }, { id: 22, floors: 10, groups: 4 }, { id: 23, floors: 10, groups: 4 }, { id: 24, floors: 10, groups: 4 }, { id: 25, floors: 10, groups: 3 }, { id: 26, floors: 10, groups: 3 }, { id: 27, floors: 10, groups: 3 }, { id: 28, floors: 10, groups: 3 }, { id: 29, floors: 10, groups: 3 }, { id: 30, floors: 10, groups: 3 }, { id: 31, floors: 10, groups: 3 }, { id: 32, floors: 10, groups: 3 }, { id: 33, floors: 10, groups: 3 }, { id: 34, floors: 10, groups: 3 }, { id: 35, floors: 10, groups: 3 }, { id: 36, floors: 10, groups: 3 }, { id: 37, floors: 10, groups: 3 }, { id: 38, floors: 10, groups: 3 }, { id: 39, floors: 10, groups: 3 }, { id: 100, floors: 10, groups: 3 }],
  };
  const pallets = [];
  let id = 1;
  const usedLocations = new Set();
  for (const warehouseId of [1, 2, 3]) {
    const racks = racksByWarehouse[warehouseId];
    for (const rack of racks) {
      const maxCells = rack.floors * rack.groups;
      const cellsToFill = Math.floor(maxCells * 0.5) + Math.floor(Math.random() * Math.floor(maxCells * 0.1));
      const availableCells = [];
      for (let f = 1; f <= rack.floors; f++) {
        for (let g = 1; g <= rack.groups; g++) {
          availableCells.push([f, g]);
        }
      }
      for (let i = 0; i < cellsToFill && availableCells.length > 0; i++) {
        const idx = Math.floor(Math.random() * availableCells.length);
        const [floor, group] = availableCells[idx];
        const location = `${rack.id}-${floor}-${group}`;
        if (!usedLocations.has(location)) {
          pallets.push({ id, location });
          usedLocations.add(location);
          id++;
          availableCells.splice(idx, 1);
        }
      }
    }
  }
  return pallets;
})();

const products = [
  { id: 1,  code: 'FP-001', name: '일반 밴드 20매입',         category: '의료용 밴드', created_at: '2025-06-01' },
  { id: 2,  code: 'FP-002', name: '방수 밴드 20매입',         category: '의료용 밴드', created_at: '2025-06-01' },
  { id: 3,  code: 'FP-003', name: '대형 밴드 10매입',         category: '의료용 밴드', created_at: '2025-06-15' },
  { id: 4,  code: 'FP-004', name: '압박 붕대 5cm×4.5m',      category: '붕대류',      created_at: '2025-07-01' },
  { id: 5,  code: 'FP-005', name: '탄력 붕대 7.5cm×4.5m',    category: '붕대류',      created_at: '2025-07-15' },
  { id: 6,  code: 'FP-006', name: '무릎 보호대 M',            category: '보호대류',    created_at: '2025-08-01' },
  { id: 7,  code: 'FP-007', name: '손목 보호대 Free',         category: '보호대류',    created_at: '2025-08-01' },
  { id: 8,  code: 'FP-008', name: '발목 보호대 M',            category: '보호대류',    created_at: '2025-09-01' },
  { id: 9,  code: 'FP-009', name: '거즈 붕대 7.5cm×5m',      category: '붕대류',      created_at: '2025-10-01' },
  { id: 10, code: 'FP-010', name: '반창고 롤 2.5cm×5m',      category: '의료용 밴드', created_at: '2025-10-01' },
  { id: 11, code: 'RM-001', name: '탄성 직물 원단 (롤/50m)',  category: '원단/소재',   created_at: '2025-06-01' },
  { id: 12, code: 'RM-002', name: '의료용 접착제 (통/5L)',    category: '접착제',      created_at: '2025-06-01' },
  { id: 13, code: 'RM-003', name: '거즈 원단 (롤/100m)',      category: '원단/소재',   created_at: '2025-06-15' },
  { id: 14, code: 'RM-004', name: '벨크로 테이프 (롤/25m)',   category: '원단/소재',   created_at: '2025-07-01' },
  { id: 15, code: 'RM-005', name: '포장 비닐 (박스/1000개)',  category: '포장재',      created_at: '2025-08-01' },
];

const inventoryItems = (() => {
  const items = [];
  const productQuantities = [
    { productId: 1, minQty: 1200, maxQty: 5000 },
    { productId: 2, minQty: 1200, maxQty: 3000 },
    { productId: 3, minQty: 800, maxQty: 2000 },
    { productId: 4, minQty: 400, maxQty: 1200 },
    { productId: 5, minQty: 300, maxQty: 900 },
    { productId: 6, minQty: 200, maxQty: 600 },
    { productId: 7, minQty: 200, maxQty: 800 },
    { productId: 8, minQty: 200, maxQty: 700 },
    { productId: 9, minQty: 400, maxQty: 1500 },
    { productId: 10, minQty: 150, maxQty: 500 },
    { productId: 11, minQty: 20, maxQty: 80 },
    { productId: 12, minQty: 15, maxQty: 50 },
    { productId: 13, minQty: 20, maxQty: 100 },
    { productId: 14, minQty: 15, maxQty: 80 },
    { productId: 15, minQty: 30, maxQty: 300 },
  ];
  const dates = [
    '2026-02-10', '2026-02-15', '2026-02-20', '2026-02-25',
    '2026-03-05', '2026-03-10', '2026-03-15', '2026-03-20', '2026-03-25', '2026-03-30',
    '2026-04-05', '2026-04-10', '2026-04-15', '2026-04-20',
  ];
  let id = 1;
  for (let palletId = 1; palletId <= 250; palletId++) {
    const productInfo = productQuantities[Math.floor(Math.random() * productQuantities.length)];
    const date = dates[Math.floor(Math.random() * dates.length)];
    const quantity = productInfo.minQty + Math.floor(Math.random() * (productInfo.maxQty - productInfo.minQty));
    items.push({
      id,
      product_id: productInfo.productId,
      pallet_id: palletId,
      quantity,
      received_at: date,
    });
    id++;
  }
  return items;
})();

const inboundSchedules = [
  { id: 1, product_id: 11, quantity: 50,   scheduled_date: '2026-04-16', status: 'pending', note: '긴급 — 한국의료소재(주)' },
  { id: 2, product_id: 13, quantity: 80,   scheduled_date: '2026-04-16', status: 'pending', note: '대한탄성원단' },
  { id: 3, product_id: 1,  quantity: 5000, scheduled_date: '2026-04-17', status: 'pending', note: '자사 생산' },
  { id: 4, product_id: 3,  quantity: 3000, scheduled_date: '2026-04-15', status: 'done',    note: '자사 생산' },
];

const outboundSchedules = [
  { id: 1, product_id: 1,  quantity: 3000, scheduled_date: '2026-04-16', status: 'pending', note: 'CJ올리브영 정기납품' },
  { id: 2, product_id: 9,  quantity: 1000, scheduled_date: '2026-04-16', status: 'pending', note: '세브란스병원 납품' },
  { id: 3, product_id: 6,  quantity: 200,  scheduled_date: '2026-04-17', status: 'pending', note: '이마트 납품' },
  { id: 4, product_id: 2,  quantity: 1800, scheduled_date: '2026-04-15', status: 'done',    note: 'CJ올리브영 정기납품' },
];

const activityLogs = [
  { id: 1,  user: '김민준', action: '입고 처리',      feature: 'inbound',   detail: '대형 밴드 10매입 3000박스 → 완제품창고 3번랙 2열 1단',     created_at: '2026-04-15 15:42' },
  { id: 2,  user: '이지훈', action: '출고 처리',      feature: 'outbound',  detail: '방수 밴드 20매입 1800박스 출고 — CJ올리브영 정기납품',    created_at: '2026-04-15 14:10' },
  { id: 3,  user: '최현우', action: '입고 예정 등록', feature: 'inbound',   detail: '거즈 원단 80롤 예정 등록 — 대한탄성원단',                  created_at: '2026-04-14 09:30' },
  { id: 4,  user: '김민준', action: '재고 조정',      feature: 'inventory', detail: '탄력 붕대 7.5cm 12박스 손실 기록 — 품질 불량',            created_at: '2026-04-14 16:45' },
  { id: 5,  user: '이지훈', action: '출고 처리',      feature: 'outbound',  detail: '거즈 붕대 7.5cm×5m 800박스 출고 — 세브란스병원 납품',    created_at: '2026-04-13 10:20' },
  { id: 6,  user: '최현우', action: '상품 등록',      feature: 'products',  detail: '반창고 롤 2.5cm×5m 신규 등록',                          created_at: '2026-04-13 08:30' },
  { id: 7,  user: '김민준', action: '위치 변경',      feature: 'inventory', detail: '무릎 보호대 M → 전동랙창고 12번랙 1열로 이동',          created_at: '2026-04-12 13:15' },
  { id: 8,  user: '이지훈', action: '입고 처리',      feature: 'inbound',   detail: '손목 보호대 Free 600개 입고 — 자사 생산',                created_at: '2026-04-12 09:50' },
  { id: 9,  user: '최현우', action: '사용자 추가',    feature: 'users',     detail: '창고 관리자 신규 계정 승인',                              created_at: '2026-04-11 15:30' },
  { id: 10, user: '김민준', action: '재고 확인',      feature: 'inventory', detail: '월말 재고 실사 완료 — 오차율 0.1%',                      created_at: '2026-04-10 18:00' },
  { id: 11, user: '이지훈', action: '출고 처리',      feature: 'outbound',  detail: '발목 보호대 M 300개 출고 — 이마트 납품',                 created_at: '2026-04-10 12:30' },
  { id: 12, user: '최현우', action: '설정 변경',      feature: 'settings',  detail: '입고 알람 시간 변경 (09:00→08:00)',                     created_at: '2026-04-09 14:00' },
  { id: 13, user: '김민준', action: '입고 처리',      feature: 'inbound',   detail: '벨크로 테이프 80롤 입고 — 메디텍소재(주)',               created_at: '2026-04-08 11:15' },
  { id: 14, user: '이지훈', action: '상품 수정',      feature: 'products',  detail: '압박 붕대 5cm×4.5m 규격 정보 업데이트',                 created_at: '2026-04-07 09:45' },
  { id: 15, user: '최현우', action: '출고 처리',      feature: 'outbound',  detail: '일반 밴드 20매입 3000박스 출고 — CJ올리브영 정기납품',   created_at: '2026-04-06 16:20' },
  { id: 16, user: '김민준', action: '입고 처리',      feature: 'inbound',   detail: '거즈 원단 100롤 입고 — 대한탄성원단',                    created_at: '2026-04-05 10:00' },
  { id: 17, user: '이지훈', action: '재고 조정',      feature: 'inventory', detail: '포장 비닐 50박스 손실 처리 — 파손',                      created_at: '2026-04-04 14:30' },
  { id: 18, user: '최현우', action: '출고 처리',      feature: 'outbound',  detail: '탄력 붕대 7.5cm 600박스 출고 — 홈플러스 납품',           created_at: '2026-04-03 11:45' },
];

const users = [
  { id: 1, name: '김개발',  email: 'dev@ynk-band.com',     role: 'developer',   is_approved: true  },
  { id: 2, name: '이관리',  email: 'super@ynk-band.com',   role: 'super_admin', is_approved: true  },
  { id: 3, name: '최현우',  email: 'admin@ynk-band.com',   role: 'admin',       is_approved: true  },
  { id: 4, name: '김민준',  email: 'minjun@ynk-band.com',  role: 'user',        is_approved: true  },
  { id: 5, name: '이지훈',  email: 'jihun@ynk-band.com',   role: 'user',        is_approved: true  },
  { id: 6, name: '정승현',  email: 'sh.jung@ynk-band.com', role: 'user',        is_approved: false },
];

export const useDataStore = create(() => ({
  warehouses,
  racks,
  pallets,
  products,
  inventoryItems,
  inboundSchedules,
  outboundSchedules,
  activityLogs,
  users,
}));
