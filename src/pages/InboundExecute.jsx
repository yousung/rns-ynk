import { useState, useCallback, useEffect } from 'react';
import { useDataStore } from '../store/useDataStore.js';
import { useUIStore } from '../store/useUIStore.js';
import WarehouseTabs from '../components/warehouse/WarehouseTabs.jsx';
import ScheduleScroll from '../components/warehouse/ScheduleScroll.jsx';
import WarehouseMatrix from '../components/warehouse/WarehouseMatrix.jsx';
import WarehouseRackGrid from '../components/warehouse/WarehouseRackGrid.jsx';
import StatsBar from '../components/warehouse/StatsBar.jsx';
import CellDetailsPanel from '../components/warehouse/CellDetailsPanel.jsx';

export default function InboundExecute() {
  const { racks, pallets, inventoryItems, inboundSchedules, products } = useDataStore();
  const { warehouseType } = useUIStore();

  useEffect(() => {
    if (['c', 'd', 'e'].includes(warehouseType)) {
      window.location.href = `${import.meta.env.BASE_URL}demo/samples/type-${warehouseType}/inbound-execute.html`;
    }
  }, [warehouseType]);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(1);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null); // { rackId, floor, kan }

  // ─── 스케줄 ───────────────────────────────────────────────
  const pendingSchedules = inboundSchedules
    .filter((s) => s.status === 'pending')
    .map((s) => ({ ...s, productName: products.find((p) => p.id === s.product_id)?.name || '' }));

  function toggleSchedule(id) {
    setSelectedScheduleId((prev) => (prev === id ? null : id));
    setSelectedCell(null);
  }

  // ─── 셀 클릭 (Type B) ────────────────────────────────────
  function handleCellClick(rackId, floor) {
    const rack = racks.find((r) => r.id === rackId);
    if (!rack || floor > rack.floors) return;

    if (selectedCell?.rackId === rackId && selectedCell?.floor === floor) {
      setSelectedCell(null);
      return;
    }

    const occupiedKans = new Set();
    for (let kan = 1; kan <= rack.groups; kan++) {
      if (pallets.find((p) => p.location === `${rackId}-${floor}-${kan}`)) occupiedKans.add(kan);
    }
    const emptyKan = Array.from({ length: rack.groups }, (_, i) => i + 1).find(
      (k) => !occupiedKans.has(k)
    );
    setSelectedCell({ rackId, floor, kan: emptyKan ?? 1 });
  }

  // ─── 랙 클릭 (Type A) ────────────────────────────────────
  function handleRackClick(rackId) {
    const rack = racks.find((r) => r.id === rackId);
    if (!rack) return;
    if (selectedCell?.rackId === rackId) { setSelectedCell(null); return; }
    setSelectedCell({ rackId, floor: 1, kan: 1 });
  }

  function selectKan(kan) {
    if (!selectedCell) return;
    setSelectedCell((prev) => ({ ...prev, kan }));
  }

  // ─── getMiniBlocksFn ──────────────────────────────────────
  const getMiniBlocksFn = useCallback(
    (rackId, floor) => {
      const rack = racks.find((r) => r.id === rackId);
      if (!rack) return [];

      const schedule = selectedScheduleId
        ? inboundSchedules.find((s) => s.id === selectedScheduleId)
        : null;

      const productKans = new Set();
      if (schedule) {
        for (let kan = 1; kan <= rack.groups; kan++) {
          const pallet = pallets.find((p) => p.location === `${rackId}-${floor}-${kan}`);
          if (pallet && inventoryItems.some((i) => i.pallet_id === pallet.id && i.product_id === schedule.product_id)) {
            productKans.add(kan);
          }
        }
      }

      return Array.from({ length: rack.groups }, (_, i) => {
        const kan = i + 1;
        const hasPallet = !!pallets.find((p) => p.location === `${rackId}-${floor}-${kan}`);
        const isSel = selectedCell?.rackId === rackId && selectedCell?.floor === floor && selectedCell?.kan === kan;
        const isProduct = productKans.has(kan);
        if (isSel) return 'mini-sel';
        if (isProduct) return 'mini-product';
        return hasPallet ? 'mini-filled' : 'mini-empty';
      });
    },
    [racks, pallets, inventoryItems, selectedCell, selectedScheduleId, inboundSchedules]
  );

  // ─── getCellClass (Type A) ────────────────────────────────
  const getCellClass = useCallback(
    (rackId, floor, kan) => {
      const isSel = selectedCell?.rackId === rackId && selectedCell?.floor === floor && selectedCell?.kan === kan;
      if (isSel) return 'rc-highlight';
      const hasPallet = !!pallets.find((p) => p.location === `${rackId}-${floor}-${kan}`);
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

  function executeInbound() {
    if (!sched || !selectedCell || !rack) return;
    alert(`✅ 입고 완료!\n${schedProduct?.name} ${sched.quantity}개\n→ ${rack.rack_no}번 랙 · ${selectedCell.floor}층 · ${selectedCell.kan}칸\n\n(데모: 실제 저장 없음)`);
    setSelectedScheduleId(null);
    setSelectedCell(null);
  }

  const canExecute = !!(selectedScheduleId && selectedCell);

  const occupiedKansInCell = rack && selectedCell
    ? Array.from({ length: rack.groups }, (_, i) => i + 1).filter(
        (k) => !!pallets.find((p) => p.location === `${selectedCell.rackId}-${selectedCell.floor}-${k}`)
      )
    : [];

  return (
    <>
      <div className="header-bar">
        <h1>입고 처리</h1>
      </div>
      <div className="content-area" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <WarehouseTabs
          selectedWarehouseId={selectedWarehouseId}
          onSelect={(id) => { setSelectedWarehouseId(id); setSelectedCell(null); setSelectedScheduleId(null); }}
        />

        <div style={{ flexShrink: 0, maxHeight: 80, overflow: 'hidden' }}>
          <ScheduleScroll
            schedules={pendingSchedules}
            selectedId={selectedScheduleId}
            onSelect={toggleSchedule}
          />
        </div>

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
                  <span style={{ marginLeft: 8 }}>위치: <span className="action-highlight">{rack.rack_no}번 랙 · {selectedCell.floor}층</span></span>
                  {warehouseType !== 'a' && (
                    <div className="dan-selector">
                      {Array.from({ length: rack.groups }, (_, i) => i + 1).map((kan) => (
                        <button
                          key={kan}
                          className={`dan-btn${selectedCell.kan === kan ? ' active' : ''}${occupiedKansInCell.includes(kan) ? ' occupied' : ''}`}
                          onClick={() => selectKan(kan)}
                        >
                          {kan}칸
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>← 매트릭스에서 위치 클릭</span>
              )}
            </div>
            <button className="btn-exec" disabled={!canExecute} onClick={executeInbound}>
              입고 실행
            </button>
          </div>

          {warehouseType === 'a' ? (
            <div style={{ flex: 1, overflow: 'auto', padding: 10 }}>
              <WarehouseRackGrid
                warehouseId={selectedWarehouseId}
                selectedRackId={selectedCell?.rackId}
                onRackClick={handleRackClick}
                getCellClass={getCellClass}
              />
            </div>
          ) : (
            <WarehouseMatrix
              warehouseId={selectedWarehouseId}
              selectedCell={selectedCell ? { rackId: selectedCell.rackId, floor: selectedCell.floor } : null}
              onCellClick={handleCellClick}
              getMiniBlocksFn={getMiniBlocksFn}
              mode="inbound"
            />
          )}

          <CellDetailsPanel selectedCell={selectedCell} />

          <StatsBar
            items={[
              { label: '현재 입고', value: filled, unit: 'PLT', color: 'var(--cyan)' },
              { label: '잔여 공간', value: total - filled, unit: 'PLT', color: 'var(--amber)' },
              { label: '전체 용량', value: total, unit: 'PLT', color: 'var(--text-secondary)' },
            ]}
          />
        </div>
      </div>
    </>
  );
}
