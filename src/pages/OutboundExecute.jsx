import { useState, useCallback, useMemo } from 'react';
import { useDataStore } from '../store/useDataStore.js';
import { useUIStore } from '../store/useUIStore.js';
import WarehouseTabs from '../components/warehouse/WarehouseTabs.jsx';
import ScheduleScroll from '../components/warehouse/ScheduleScroll.jsx';
import WarehouseMatrix from '../components/warehouse/WarehouseMatrix.jsx';
import WarehouseRackGrid from '../components/warehouse/WarehouseRackGrid.jsx';
import StatsBar from '../components/warehouse/StatsBar.jsx';
import CellDetailsPanel from '../components/warehouse/CellDetailsPanel.jsx';

export default function OutboundExecute() {
  const { racks, pallets, inventoryItems, outboundSchedules, inboundSchedules, products } = useDataStore();
  const { warehouseType } = useUIStore();
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(1);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  const pendingSchedules = outboundSchedules
    .filter((s) => s.status === 'pending')
    .map((s) => ({ ...s, productName: products.find((p) => p.id === s.product_id)?.name || '' }));

  const sched = outboundSchedules.find((s) => s.id === selectedScheduleId);

  // ─── FIFO 계산 ────────────────────────────────────────────
  const fifoSlots = useMemo(() => {
    if (!sched) return [];
    const whRacks = racks.filter((r) => r.warehouse_id === selectedWarehouseId);
    const rackIds = new Set(whRacks.map((r) => r.id));
    const slots = [];
    pallets.forEach((pallet) => {
      const [rId, floor, kan] = pallet.location.split('-').map(Number);
      if (!rackIds.has(rId)) return;
      const items = inventoryItems.filter(
        (i) => i.pallet_id === pallet.id && i.product_id === sched.product_id
      );
      if (items.length === 0) return;
      const earliest = items.reduce(
        (min, i) => (i.received_at < min ? i.received_at : min),
        items[0].received_at
      );
      const qty = items.reduce((s, i) => s + i.quantity, 0);
      slots.push({ rackId: rId, floor, kan, key: pallet.location, received_at: earliest, qty });
    });
    slots.sort((a, b) => a.received_at.localeCompare(b.received_at));
    slots.forEach((s, i) => { s.rank = i + 1; });
    return slots;
  }, [sched, selectedWarehouseId, racks, pallets, inventoryItems]);

  // ─── 창고 선택 시 상품 보유 창고로 자동 이동 ──────────────
  function selectSchedule(id) {
    if (selectedScheduleId === id) {
      setSelectedScheduleId(null);
      setSelectedCell(null);
      return;
    }
    const s = outboundSchedules.find((x) => x.id === id);
    let whId = selectedWarehouseId;
    if (s) {
      const hasProduct = checkWarehouseHasProduct(selectedWarehouseId, s.product_id);
      if (!hasProduct) {
        const foundWh = findWarehouseWithProduct(s.product_id);
        if (foundWh) whId = foundWh;
      }
    }
    setSelectedWarehouseId(whId);
    setSelectedScheduleId(id);
    setSelectedCell(null);
  }

  function checkWarehouseHasProduct(warehouseId, productId) {
    const rackIds = new Set(racks.filter((r) => r.warehouse_id === warehouseId).map((r) => r.id));
    return pallets.some((p) => {
      const rId = parseInt(p.location.split('-')[0]);
      return rackIds.has(rId) && inventoryItems.some((i) => i.pallet_id === p.id && i.product_id === productId);
    });
  }

  function findWarehouseWithProduct(productId) {
    const palletIds = new Set(inventoryItems.filter((i) => i.product_id === productId).map((i) => i.pallet_id));
    for (const p of pallets) {
      if (palletIds.has(p.id)) {
        const rack = racks.find((r) => r.id === parseInt(p.location.split('-')[0]));
        if (rack) return rack.warehouse_id;
      }
    }
    return null;
  }

  // ─── getCellFifoInfo ──────────────────────────────────────
  const getCellFifoInfo = useCallback(
    (rackId, floor) => {
      const rack = racks.find((r) => r.id === rackId);
      if (!rack || floor > rack.floors) return null;
      if (!sched) return null;

      let bestFifo = null;
      let hasOther = false;

      for (let kan = 1; kan <= rack.groups; kan++) {
        const key = `${rackId}-${floor}-${kan}`;
        const slot = fifoSlots.find((s) => s.key === key);
        if (slot) {
          if (!bestFifo || slot.rank < bestFifo.rank) bestFifo = slot;
        } else {
          const pallet = pallets.find((p) => p.location === key);
          if (pallet && inventoryItems.some((i) => i.pallet_id === pallet.id)) hasOther = true;
        }
      }

      if (bestFifo) return { type: 'fifo', rank: bestFifo.rank, qty: bestFifo.qty };
      if (hasOther) return { type: 'occupied' };
      return { type: 'empty' };
    },
    [racks, pallets, inventoryItems, fifoSlots, sched]
  );

  // ─── getMiniBlocksFn ──────────────────────────────────────
  const getMiniBlocksFn = useCallback(
    (rackId, floor) => {
      const rack = racks.find((r) => r.id === rackId);
      if (!rack) return [];
      return Array.from({ length: rack.groups }, (_, i) => {
        const kan = i + 1;
        const key = `${rackId}-${floor}-${kan}`;
        const slot = fifoSlots.find((s) => s.key === key);
        if (slot) {
          if (slot.rank === 1) return 'mini-fifo1';
          if (slot.rank === 2) return 'mini-fifo2';
          return 'mini-fifon';
        }
        const pallet = pallets.find((p) => p.location === key);
        if (pallet && inventoryItems.some((i) => i.pallet_id === pallet.id)) return 'mini-occupied';
        return 'mini-empty';
      });
    },
    [racks, pallets, inventoryItems, fifoSlots]
  );

  // ─── getCellClass (Type A) ────────────────────────────────
  const getCellClass = useCallback(
    (rackId, floor, kan) => {
      const key = `${rackId}-${floor}-${kan}`;
      const slot = fifoSlots.find((s) => s.key === key);
      if (slot) {
        if (slot.rank === 1) return 'rc-fifo1';
        if (slot.rank === 2) return 'rc-fifo2';
        return 'rc-fifon';
      }
      const hasPallet = !!pallets.find((p) => p.location === key);
      return hasPallet ? 'rc-filled' : 'rc-empty';
    },
    [pallets, fifoSlots]
  );

  // ─── 통계 ─────────────────────────────────────────────────
  const whRacks = racks.filter((r) => r.warehouse_id === selectedWarehouseId);
  const rackIds = new Set(whRacks.map((r) => r.id));
  const filledPallets = pallets.filter((p) => rackIds.has(parseInt(p.location.split('-')[0]))).length;
  const totalSlots = whRacks.reduce((s, r) => s + r.floors * r.groups, 0);
  const pendingCount = outboundSchedules.filter((s) => s.status === 'pending').length;

  // ─── 액션 바 ──────────────────────────────────────────────
  const schedProduct = sched ? products.find((p) => p.id === sched.product_id) : null;
  const totalAvailable = fifoSlots.reduce((s, sl) => s + sl.qty, 0);
  const top = fifoSlots[0];
  const topRack = top ? racks.find((r) => r.id === top.rackId) : null;

  const totalStock = inventoryItems
    .filter((i) => {
      const p = pallets.find((pl) => pl.id === i.pallet_id);
      return p && rackIds.has(parseInt(p.location.split('-')[0]));
    })
    .reduce((s, i) => s + i.quantity, 0);
  const inboundPending = inboundSchedules.filter((s) => s.status === 'pending').reduce((s, x) => s + x.quantity, 0);
  const outboundQty = sched?.quantity ?? 0;

  const canExecute = !!(sched && fifoSlots.length > 0 && totalAvailable >= outboundQty);

  function executeOutbound() {
    if (!canExecute) return;
    const topSlots = fifoSlots.slice(0, 3).map((sl) => {
      const r = racks.find((x) => x.id === sl.rackId);
      return `  F${sl.rank}: ${r?.rack_no}번 랙 · ${sl.floor}층 · ${sl.kan}칸 (${sl.qty}개)`;
    }).join('\n');
    alert(`✅ 출고 완료!\n${schedProduct?.name} ${outboundQty}개 출고\n\nFIFO 출고 위치:\n${topSlots}\n\n(데모: 실제 저장 없음)`);
    setSelectedScheduleId(null);
    setSelectedCell(null);
  }

  return (
    <>
      <div className="header-bar">
        <h1>출고 처리</h1>
      </div>
      <div className="content-area" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <WarehouseTabs
          selectedWarehouseId={selectedWarehouseId}
          onSelect={(id) => { setSelectedWarehouseId(id); setSelectedScheduleId(null); setSelectedCell(null); }}
        />

        <div style={{ flexShrink: 0, maxHeight: 80, overflow: 'hidden' }}>
          <ScheduleScroll
            schedules={pendingSchedules}
            selectedId={selectedScheduleId}
            onSelect={selectSchedule}
          />
        </div>

        <div className="matrix-section">
          <div className="action-bar">
            <div className="action-info">
              {schedProduct ? (
                <>
                  <span>출고: <span className="action-highlight">{schedProduct.name} {outboundQty}개</span>
                    {sched.note && <> · <span className="action-highlight">{sched.note}</span></>}
                  </span>
                  {top && topRack && (
                    <span style={{ marginLeft: 8 }}>
                      | <span className="action-highlight">FIFO F{top.rank}: {topRack.rack_no}번 랙 · {top.floor}층 · {top.kan}칸 ({top.qty}개)</span>
                    </span>
                  )}
                  {totalAvailable < outboundQty && (
                    <span style={{ color: 'var(--red)', fontWeight: 700, marginLeft: 8 }}>⚠ 재고 부족: {totalAvailable}/{outboundQty}개</span>
                  )}
                  <span style={{ marginLeft: 8 }}>|
                    <span className="lg-badge lg-stock"> 현재 {totalStock}개</span>
                    <span className="lg-badge lg-inbound"> 입고예정 {inboundPending}개</span>
                    <span className="lg-badge lg-outbound"> 출고 {outboundQty}개</span>
                    <span className="lg-badge lg-after"> 잔여 {Math.max(0, totalStock - outboundQty)}개</span>
                  </span>
                </>
              ) : (
                <span>상품을 선택하세요</span>
              )}
            </div>
            <button className="btn-exec" disabled={!canExecute} onClick={executeOutbound}>
              출고 실행
            </button>
          </div>

          {warehouseType === 'b' ? (
            <WarehouseMatrix
              warehouseId={selectedWarehouseId}
              selectedCell={selectedCell}
              onCellClick={(rackId, floor) => setSelectedCell({ rackId, floor })}
              getCellFifoInfo={getCellFifoInfo}
              getMiniBlocksFn={getMiniBlocksFn}
              mode="outbound"
            />
          ) : (
            <div style={{ flex: 1, overflow: 'auto', padding: 10 }}>
              <WarehouseRackGrid
                warehouseId={selectedWarehouseId}
                selectedRackId={selectedCell?.rackId}
                onRackClick={(rackId) => setSelectedCell((prev) => prev?.rackId === rackId ? null : { rackId, floor: 1 })}
                getCellClass={getCellClass}
              />
            </div>
          )}

          <CellDetailsPanel selectedCell={selectedCell} />

          <StatsBar
            items={[
              { label: '현재 재고', value: filledPallets, unit: 'PLT', color: '#60A5FA' },
              { label: '출고 예정', value: pendingCount, unit: '건', color: 'var(--amber)' },
              { label: '잔여 용량', value: totalSlots - filledPallets, unit: 'PLT', color: 'var(--text-secondary)' },
            ]}
          />
        </div>
      </div>
    </>
  );
}
