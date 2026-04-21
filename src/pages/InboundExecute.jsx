import { useState, useCallback } from 'react';
import { useDataStore } from '../store/useDataStore.js';
import { useUIStore } from '../store/useUIStore.js';
import WarehouseTabs from '../components/warehouse/WarehouseTabs.jsx';
import ScheduleScroll from '../components/warehouse/ScheduleScroll.jsx';
import WarehouseMatrix from '../components/warehouse/WarehouseMatrix.jsx';
import WarehouseRackGrid from '../components/warehouse/WarehouseRackGrid.jsx';
import WarehouseFloorPlan, { FloorPlanRackDetail } from '../components/warehouse/WarehouseFloorPlan.jsx';
import WarehouseElevation from '../components/warehouse/WarehouseElevation.jsx';
import StatsBar from '../components/warehouse/StatsBar.jsx';
import { KanDetailPanel as SlotDetailPanel } from '../components/warehouse/CellDetailsPanel.jsx';
import WarehouseMinimap from '../components/warehouse/WarehouseMinimap.jsx';

export default function InboundExecute() {
  const { racks, pallets, inventoryItems, inboundSchedules, products } = useDataStore();
  const { warehouseType } = useUIStore();

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(1);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null); // { rackId, floor, slot }
  const [hoveredRackId, setHoveredRackId] = useState(null);
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [execQty, setExecQty] = useState('');

  // ─── 스케줄 ───────────────────────────────────────────────
  const pendingSchedules = inboundSchedules
    .filter((s) => s.status === 'pending')
    .map((s) => ({ ...s, productName: products.find((p) => p.id === s.product_id)?.name || '' }));

  const filteredSchedules = searchQuery
    ? pendingSchedules.filter(s => s.productName.toLowerCase().includes(searchQuery.toLowerCase()) || (s.scheduled_date || '').includes(searchQuery))
    : pendingSchedules;

  function toggleSchedule(id) {
    setSelectedScheduleId((prev) => (prev === id ? null : id));
    setSelectedCell(null);
    setExecQty('');
  }

  // ─── 셀 클릭 (Type B) ────────────────────────────────────
  function handleCellClick(rackId, floor) {
    const rack = racks.find((r) => r.id === rackId);
    if (!rack || floor > rack.floors) return;

    if (selectedCell?.rackId === rackId && selectedCell?.floor === floor) {
      setSelectedCell(null);
      return;
    }

    const occupiedSlots = new Set();
    for (let slot = 1; slot <= rack.groups; slot++) {
      if (pallets.find((p) => p.location === `${rackId}-${floor}-${slot}`)) occupiedSlots.add(slot);
    }
    const emptySlot = Array.from({ length: rack.groups }, (_, i) => i + 1).find(
      (k) => !occupiedSlots.has(k)
    );
    setSelectedCell({ rackId, floor, slot: null });
  }

  // ─── 랙 클릭 (Type A) ────────────────────────────────────
  function handleRackClick(rackId) {
    const rack = racks.find((r) => r.id === rackId);
    if (!rack) return;
    if (selectedCell?.rackId === rackId) { setSelectedCell(null); return; }
    setSelectedCell({ rackId, floor: 1, slot: null });
  }

  // ─── getMiniBlocksFn ──────────────────────────────────────
  const getMiniBlocksFn = useCallback(
    (rackId, floor) => {
      const rack = racks.find((r) => r.id === rackId);
      if (!rack) return [];

      const schedule = selectedScheduleId
        ? inboundSchedules.find((s) => s.id === selectedScheduleId)
        : null;

      const productSlots = new Set();
      if (schedule) {
        for (let slot = 1; slot <= rack.groups; slot++) {
          const pallet = pallets.find((p) => p.location === `${rackId}-${floor}-${slot}`);
          if (pallet && inventoryItems.some((i) => i.pallet_id === pallet.id && i.product_id === schedule.product_id)) {
            productSlots.add(slot);
          }
        }
      }

      return Array.from({ length: rack.groups }, (_, i) => {
        const slot = i + 1;
        const hasPallet = !!pallets.find((p) => p.location === `${rackId}-${floor}-${slot}`);
        const isSel = selectedCell?.rackId === rackId && selectedCell?.floor === floor && selectedCell?.slot === slot;
        const isProduct = productSlots.has(slot);
        if (isSel) return 'mini-sel';
        if (isProduct) return 'mini-product';
        return hasPallet ? 'mini-filled' : 'mini-empty';
      });
    },
    [racks, pallets, inventoryItems, selectedCell, selectedScheduleId, inboundSchedules]
  );

  // ─── getCellClass (Type A) ────────────────────────────────
  const getCellClass = useCallback(
    (rackId, floor, slot) => {
      const isSel = selectedCell?.rackId === rackId && selectedCell?.floor === floor && selectedCell?.slot === slot;
      if (isSel) return 'rc-highlight';
      const hasPallet = !!pallets.find((p) => p.location === `${rackId}-${floor}-${slot}`);
      return hasPallet ? 'rc-filled' : 'rc-empty';
    },
    [pallets, selectedCell]
  );

  // ─── 통계 ─────────────────────────────────────────────────
  const whRacks = racks.filter((r) => r.warehouse_id === selectedWarehouseId);
  const rackIds = new Set(whRacks.map((r) => r.id));
  const filled = pallets.filter((p) => rackIds.has(parseInt(p.location.split('-')[0]))).length;
  const total = whRacks.reduce((s, r) => s + r.floors * r.groups, 0);

  // ─── 액션 바 ──────────────────────────────────────────────
  const sched = inboundSchedules.find((s) => s.id === selectedScheduleId);
  const schedProduct = sched ? products.find((p) => p.id === sched.product_id) : null;
  const rack = selectedCell ? racks.find((r) => r.id === selectedCell.rackId) : null;

  const inQty = execQty !== '' ? (parseInt(execQty) || 0) : (sched?.quantity ?? 0);

  function executeInbound() {
    if (!sched || !selectedCell || !rack) return;
    alert(`✅ 입고 완료!\n${schedProduct?.name} ${inQty}개\n→ ${rack.rack_no}번 랙 · ${selectedCell.floor}단 · ${selectedCell.slot}열\n\n(데모: 실제 저장 없음)`);
    setSelectedScheduleId(null);
    setSelectedCell(null);
    setExecQty('');
  }

  const canExecute = !!(selectedScheduleId && selectedCell);

  return (
    <>
      <div className="header-bar">
        <h1>입고 처리</h1>
      </div>
      <div className="content-area" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'row', minHeight: 0 }}>
        {/* 스케줄 사이드패널 */}
        <div style={{ width: 188, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'var(--bg-base)', overflow: 'hidden' }}>
          <div style={{ flexShrink: 0, padding: '8px 8px 6px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>입고 예정</div>
            <input
              type="text"
              placeholder="검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 5, padding: '5px 8px', fontSize: '0.78rem', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
          <ScheduleScroll
            schedules={filteredSchedules}
            selectedId={selectedScheduleId}
            onSelect={toggleSchedule}
            vertical
          />
        </div>

        {/* 오른쪽 메인 영역 */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <WarehouseTabs
            selectedWarehouseId={selectedWarehouseId}
            onSelect={(id) => { setSelectedWarehouseId(id); setSelectedCell(null); setSelectedScheduleId(null); }}
          />

          <div className="matrix-section">
            {/* 액션 바 */}
            <div className="action-bar">
              <div className="action-info">
                {schedProduct ? (
                  <span>입고: <span className="action-highlight">{schedProduct.name} {sched.quantity}개</span> · {sched.scheduled_date}</span>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>← 예정 목록에서 항목 선택</span>
                )}
                {selectedCell && rack ? (
                  <>
                    <span style={{ marginLeft: 8 }}>위치: <span className="action-highlight">{rack.rack_no}번 랙 · {selectedCell.floor}단{selectedCell.slot ? ` · ${selectedCell.slot}열` : ''}</span></span>
                  </>
                ) : (
                  <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>← 매트릭스에서 위치 클릭</span>
                )}
              </div>
              {sched && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>수량</label>
                  <input
                    type="number"
                    min="1"
                    value={execQty !== '' ? execQty : (sched?.quantity ?? '')}
                    onChange={e => setExecQty(e.target.value)}
                    style={{ width: 64, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 4, padding: '3px 6px', fontSize: '0.85rem', color: 'var(--text-primary)', outline: 'none', textAlign: 'right', fontFamily: 'inherit' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>개</span>
                </div>
              )}
              <button className="btn-exec" disabled={!canExecute} onClick={executeInbound}>
                입고 실행
              </button>
            </div>

            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* 창고 시각화 */}
              <div style={{ flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
                <div style={{ height: 28, display: 'flex', alignItems: 'center', padding: '0 12px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>창고 시각화</span>
                </div>
                <div style={{ position: 'relative', paddingBottom: 6 }}>
                  <WarehouseMinimap warehouseId={selectedWarehouseId} selectedCell={selectedCell} hoveredRackId={hoveredRackId} hoveredFloor={hoveredFloor} hoveredSlot={hoveredSlot} />
                  {warehouseType === 'a' ? (
                    <div style={{ padding: '10px 230px 10px 10px', maxHeight: 520, overflowY: 'auto' }}>
                      <WarehouseRackGrid
                        warehouseId={selectedWarehouseId}
                        selectedRackId={selectedCell?.rackId}
                        onRackClick={handleRackClick}
                        onRackHover={setHoveredRackId}
                        getCellClass={getCellClass}
                      />
                    </div>
                  ) : warehouseType === 'c' ? (
                    <div style={{ paddingRight: 230, minHeight: 186 }}>
                      <WarehouseFloorPlan
                        warehouseId={selectedWarehouseId}
                        selectedRackId={selectedCell?.rackId}
                        onRackClick={(id) => { setSelectedCell((prev) => prev?.rackId === id ? null : { rackId: id, floor: 1, slot: null }); }}
                        onRackHover={setHoveredRackId}
                      />
                    </div>
                  ) : warehouseType === 'd' ? (
                    <div style={{ paddingRight: 230, minHeight: 166 }}>
                      <WarehouseElevation
                        warehouseId={selectedWarehouseId}
                        selectedRackId={selectedCell?.rackId}
                        onRackClick={(id) => { setSelectedCell((prev) => prev?.rackId === id ? null : { rackId: id, floor: 1, slot: null }); }}
                        onRackHover={setHoveredRackId}
                      />
                    </div>
                  ) : (
                    <div style={{ paddingRight: 230, maxHeight: 520, overflowY: 'auto' }}>
                      <WarehouseMatrix
                        warehouseId={selectedWarehouseId}
                        selectedCell={selectedCell ? { rackId: selectedCell.rackId, floor: selectedCell.floor } : null}
                        onCellClick={handleCellClick}
                        onCellHover={(rackId, floor) => { setHoveredRackId(rackId); setHoveredFloor(floor ?? null); }}
                        getMiniBlocksFn={getMiniBlocksFn}
                        mode="inbound"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 단별현황 + 적재 상세 (가로 분할) */}
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
                {/* 단별 현황 */}
                <div style={{ flex: 3, minWidth: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 12px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {selectedCell ? `랙 ${rack?.rack_no ?? ''} — ${selectedCell.floor}열 단별 현황` : '딘별 현황'}
                    </span>
                  </div>
                  <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
                    <FloorPlanRackDetail
                      rackId={selectedCell?.rackId}
                      selectedFloor={selectedCell?.floor}
                      selectedSlot={selectedCell?.slot}
                      onSlotClick={(floor, slot) => setSelectedCell(prev => {
                        if (!prev) return null;
                        if (prev.floor === floor && prev.slot === slot) return { ...prev, slot: null };
                        return { ...prev, floor, slot };
                      })}
                      onSlotHover={(floor, slot) => setHoveredSlot(floor != null ? { rackId: selectedCell?.rackId, floor, slot } : null)}
                    />
                  </div>
                </div>
                {/* 적재 상세 */}
                <div style={{ flex: 7, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 12px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {selectedCell?.slot ? `${selectedCell.slot}열 적재 상세` : '적재 상세'}
                    </span>
                  </div>
                  <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                    <SlotDetailPanel
                      rackId={selectedCell?.rackId}
                      floor={selectedCell?.floor}
                      kan={selectedCell?.slot}
                    />
                  </div>
                </div>
              </div>
            </div>

            <StatsBar
              items={[
                { label: '현재 입고', value: filled, unit: 'PLT', color: 'var(--cyan)' },
                { label: '잔여 공간', value: total - filled, unit: 'PLT', color: 'var(--amber)' },
                { label: '전체 용량', value: total, unit: 'PLT', color: 'var(--text-secondary)' },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
