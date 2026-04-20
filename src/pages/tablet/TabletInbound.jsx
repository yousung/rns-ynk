import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/useDataStore.js';
import '../../styles/tablet.css';

export default function TabletInbound() {
  const navigate = useNavigate();
  const { warehouses, racks, pallets, products, inboundSchedules } = useDataStore();

  const [theme, setTheme] = useState('dark');
  const [whMode, setWhMode] = useState('normal');
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [selectedRackId, setSelectedRackId] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedKan, setSelectedKan] = useState(null);
  const [qty, setQty] = useState('');
  const [toast, setToast] = useState(null);

  const normalWarehouses = warehouses.filter(w => w.type === 'normal');
  const electricWarehouse = warehouses.find(w => w.type === 'electric');
  const pendingSchedules = inboundSchedules.filter(s => s.status === 'pending');
  const selectedSchedule = pendingSchedules.find(s => s.id === selectedScheduleId) ?? null;
  const selectedProduct = selectedSchedule ? products.find(p => p.id === selectedSchedule.product_id) : null;
  const warehouseRacks = racks.filter(r => r.warehouse_id === selectedWarehouseId);
  const selectedRack = warehouseRacks.find(r => r.id === selectedRackId) ?? null;
  const floors = selectedRack ? Array.from({ length: selectedRack.floors }, (_, i) => selectedRack.floors - i) : [];
  const kans = selectedRack ? Array.from({ length: selectedRack.groups }, (_, i) => i + 1) : [];

  function handleWhModeChange(mode) {
    setWhMode(mode);
    setSelectedRackId(null);
    setSelectedFloor(null);
    setSelectedKan(null);
    if (mode === 'electric') {
      setSelectedWarehouseId(electricWarehouse?.id ?? null);
    } else {
      setSelectedWarehouseId(null);
    }
  }

  function handleSelectWarehouse(id) {
    setSelectedWarehouseId(id);
    setSelectedRackId(null);
    setSelectedFloor(null);
    setSelectedKan(null);
  }

  function handleSelectRack(id) {
    setSelectedRackId(id);
    setSelectedFloor(null);
    setSelectedKan(null);
  }

  function handleSelectFloor(f) {
    setSelectedFloor(f);
    setSelectedKan(null);
  }

  function isOccupied(rackId, floor, kan) {
    return pallets.some(p => p.location === `${rackId}-${floor}-${kan}`);
  }

  function showToast(msg, color) {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  }

  const hasLocation = selectedRackId !== null && selectedFloor !== null && selectedKan !== null;
  const qtyNum = Number(qty);
  const validQty = qty !== '' && qtyNum > 0 && (!selectedSchedule || qtyNum <= selectedSchedule.quantity);
  const canConfirm = selectedScheduleId !== null && hasLocation && validQty;

  function handleConfirm() {
    if (!canConfirm) return;
    const rack = racks.find(r => r.id === selectedRackId);
    const wh = warehouses.find(w => w.id === selectedWarehouseId);
    showToast(`입고 완료: ${selectedProduct?.name} ${qtyNum.toLocaleString()}개 → ${wh?.name} ${rack?.rack_no}번랙 ${selectedFloor}층 ${selectedKan}번`, 'green');
    setTimeout(() => {
      setSelectedScheduleId(null);
      setSelectedRackId(null);
      setSelectedFloor(null);
      setSelectedKan(null);
      setQty('');
    }, 2600);
  }

  return (
    <div className="t-root" data-theme={theme}>
      <button
        className="t-theme-btn"
        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, padding: '12px 24px', borderRadius: 8, fontWeight: 600,
          background: toast.color === 'green' ? 'var(--green-dim)' : 'var(--amber-dim)',
          border: `1px solid ${toast.color === 'green' ? 'var(--green)' : 'var(--amber)'}`,
          color: toast.color === 'green' ? 'var(--green)' : 'var(--amber)',
          whiteSpace: 'nowrap',
        }}>
          {toast.msg}
        </div>
      )}

      <div className="t-header">
        <div className="t-header-logo">WMS</div>
        <div className="t-header-title">입고 처리</div>
        <div style={{ width: 40 }} />
      </div>

      <div className="t-main">
        {/* 왼쪽: 입고 예정 목록 */}
        <div className="t-left-panel">
          <div className="t-panel-header">입고 예정 목록</div>
          <div className="t-schedule-list">
            {pendingSchedules.length === 0 ? (
              <div className="t-sched-empty">입고 예정 없음</div>
            ) : pendingSchedules.map(s => {
              const prod = products.find(p => p.id === s.product_id);
              return (
                <div
                  key={s.id}
                  className={`t-sched-card${selectedScheduleId === s.id ? ' selected' : ''}`}
                  onClick={() => setSelectedScheduleId(s.id)}
                >
                  <div className="t-sched-card-header">
                    <span className="t-sched-card-name">{prod?.name}</span>
                  </div>
                  <div className="t-sched-card-meta">
                    <span className="t-sched-meta-item">{s.quantity.toLocaleString()}개</span>
                    <span className="t-sched-meta-item">{s.scheduled_date}</span>
                  </div>
                  {s.note && <div className="t-sched-meta-note">{s.note}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* 오른쪽: 위치 선택 */}
        <div className="t-right-panel">
          <div className="t-wh-toggle">
            <span className="t-toggle-label">창고 유형</span>
            <div className="t-toggle-switch">
              <button
                className={`t-toggle-btn${whMode === 'normal' ? ' active' : ''}`}
                onClick={() => handleWhModeChange('normal')}
              >일반 창고</button>
              <button
                className={`t-toggle-btn${whMode === 'electric' ? ' active' : ''}`}
                onClick={() => handleWhModeChange('electric')}
              >전동랙</button>
            </div>
          </div>

          <div className="t-right-content">
            <div className={`t-sel-banner${selectedProduct ? ' active' : ''}`}>
              {selectedProduct ? (
                <>
                  <div className="t-sel-product">{selectedProduct.name}</div>
                  <div className="t-sel-meta">
                    <span>예정 {selectedSchedule?.quantity.toLocaleString()}개</span>
                    {hasLocation && (
                      <span>
                        → {racks.find(r => r.id === selectedRackId)?.rack_no}번랙 {selectedFloor}층 {selectedKan}번
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  좌측에서 입고 예정을 선택하세요
                </span>
              )}
            </div>

            <div className="t-location-section">
              {whMode === 'normal' && (
                <>
                  <div className="t-section-title">창고 선택</div>
                  <div className="t-rack-grid">
                    {normalWarehouses.map(wh => (
                      <button
                        key={wh.id}
                        className={`t-grid-btn${selectedWarehouseId === wh.id ? ' active' : ''}`}
                        onClick={() => handleSelectWarehouse(wh.id)}
                      >{wh.name}</button>
                    ))}
                  </div>
                </>
              )}

              {selectedWarehouseId && (
                <>
                  <div className="t-section-title">랙 선택</div>
                  <div className="t-rack-grid">
                    {warehouseRacks.map(r => (
                      <button
                        key={r.id}
                        className={`t-grid-btn${selectedRackId === r.id ? ' active' : ''}`}
                        onClick={() => handleSelectRack(r.id)}
                      >{r.rack_no}번</button>
                    ))}
                  </div>
                </>
              )}

              {selectedRackId && (
                <>
                  <div className="t-section-title">층 선택</div>
                  <div className="t-floor-grid">
                    {floors.map(f => (
                      <button
                        key={f}
                        className={`t-grid-btn${selectedFloor === f ? ' active' : ''}`}
                        onClick={() => handleSelectFloor(f)}
                      >{f}층</button>
                    ))}
                  </div>
                </>
              )}

              {selectedFloor !== null && (
                <>
                  <div className="t-section-title">칸 선택</div>
                  <div className="t-kan-grid">
                    {kans.map(k => {
                      const occ = isOccupied(selectedRackId, selectedFloor, k);
                      return (
                        <button
                          key={k}
                          className={`t-grid-btn${selectedKan === k ? ' active' : ''}${occ ? ' occupied' : ''}`}
                          onClick={() => !occ && setSelectedKan(k)}
                          disabled={occ}
                        >{k}번</button>
                      );
                    })}
                  </div>
                </>
              )}

              {whMode === 'electric' && selectedRackId && (
                <div className="t-electric-control">
                  <div className="t-electric-title">전동랙 제어</div>
                  <div className="t-electric-btns">
                    <button
                      className="t-electric-btn open"
                      onClick={() => showToast('전동랙 열기 신호를 전송했습니다', 'green')}
                    >
                      <span className="t-electric-btn-icon">▶</span>열기
                    </button>
                    <button
                      className="t-electric-btn stop"
                      onClick={() => showToast('전동랙 멈춤 신호를 전송했습니다', 'amber')}
                    >
                      <span className="t-electric-btn-icon">■</span>멈춤
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="t-confirm-bar">
              <div className="t-qty-row">
                <span className="t-qty-label">수량</span>
                <input
                  type="number"
                  className="t-qty-input"
                  value={qty}
                  onChange={e => setQty(e.target.value)}
                  placeholder="0"
                  min="1"
                  max={selectedSchedule?.quantity}
                />
                {selectedSchedule && (
                  <span className="t-qty-hint">/ {selectedSchedule.quantity.toLocaleString()}개</span>
                )}
              </div>
              <button className="t-btn-confirm" disabled={!canConfirm} onClick={handleConfirm}>
                입고 확정
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="t-tab-bar">
        <button className="t-tab active">입고처리</button>
        <button className="t-tab" onClick={() => navigate('/tablet/outbound')}>출고처리</button>
        <button className="t-tab logout" onClick={() => navigate('/')}>로그아웃</button>
      </div>
    </div>
  );
}
