import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/useDataStore.js';
import '../../styles/tablet.css';

export default function TabletOutbound() {
  const navigate = useNavigate();
  const { warehouses, racks, pallets, products, inventoryItems, outboundSchedules } = useDataStore();

  const [theme, setTheme] = useState('light');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedLotId, setSelectedLotId] = useState(null);
  const [elecStatus, setElecStatus] = useState('idle');
  const [qty, setQty] = useState('');
  const [toast, setToast] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profile, setProfile] = useState({ name: '작업자1', phone: '', position: '', memo: '' });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  const pendingSchedules = outboundSchedules.filter(s => s.status === 'pending');
  const selectedSchedule = pendingSchedules.find(s => s.id === selectedId) ?? null;
  const selectedProduct = selectedSchedule ? products.find(p => p.id === selectedSchedule.product_id) : null;

  function getProductLots(schedule) {
    if (!schedule) return [];
    return inventoryItems
      .filter(item => item.product_id === schedule.product_id)
      .map(item => {
        const pallet = pallets.find(p => p.id === item.pallet_id);
        if (!pallet) return null;
        const [rId, floor, kan] = pallet.location.split('-').map(Number);
        const rack = racks.find(r => r.id === rId);
        const warehouse = rack ? warehouses.find(w => w.id === rack.warehouse_id) : null;
        return { item, pallet, rackId: rId, floor, kan, rack, warehouse };
      })
      .filter(Boolean)
      .sort((a, b) => a.item.received_at.localeCompare(b.item.received_at));
  }

  const lots = getProductLots(selectedSchedule);
  const selectedLot = lots.find(l => l.item.id === selectedLotId) ?? null;
  const isElectric = selectedLot?.warehouse?.type === 'electric';

  function handleSelectSchedule(id) {
    setSelectedId(id);
    setSelectedLotId(null);
    setElecStatus('idle');
    setQty('');
  }

  function handleSelectLot(itemId) {
    setSelectedLotId(itemId);
    setElecStatus('idle');
    setQty('');
  }

  function showToast(msg, color) {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  }

  const qtyNum = Number(qty);
  const validQty = qty !== '' && qtyNum > 0 && (!selectedLot || qtyNum <= selectedLot.item.quantity);
  const canConfirm = selectedId !== null && selectedLotId !== null && validQty;

  function handleConfirm() {
    if (!canConfirm) return;
    showToast(
      `출고 완료: ${selectedProduct?.name} ${qtyNum.toLocaleString()}개 — ${selectedSchedule?.note}`,
      'green'
    );
    setTimeout(() => {
      setSelectedId(null);
      setSelectedLotId(null);
      setElecStatus('idle');
      setQty('');
    }, 2600);
  }

  const elecStatusText = {
    idle: '대기 중 — [열기] 버튼을 눌러 전동랙을 이동하세요',
    running: '전동랙 이동 중...',
    stopped: '정지됨 — 위치를 확인 후 출고를 진행하세요',
  };

  return (
    <div className="t-root" data-theme={theme}>
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
        <div className="t-header-title">출고 처리</div>
        <div style={{ width: 40 }} />
      </div>

      <div className="t-main">
        {/* 왼쪽: 출고 예정 목록 */}
        <div className="t-left-panel">
          <div className="t-panel-header">
            출고 예정 목록
            <span className="t-fifo-badge">FIFO</span>
          </div>
          <div className="t-schedule-list">
            {pendingSchedules.length === 0 ? (
              <div className="t-sched-empty">출고 예정 없음</div>
            ) : pendingSchedules.map(s => {
              const prod = products.find(p => p.id === s.product_id);
              return (
                <div
                  key={s.id}
                  className={`t-sched-card${selectedId === s.id ? ' selected' : ''}`}
                  onClick={() => handleSelectSchedule(s.id)}
                >
                  <div className="t-sched-card-header">
                    <span className="t-sched-card-name">{prod?.name}</span>
                  </div>
                  <div className="t-sched-sku">{prod?.code}</div>
                  <div className="t-sched-card-meta">
                    <span className="t-sched-qty">{s.quantity.toLocaleString()}개</span>
                    <span className="t-sched-meta-item">{s.scheduled_date}</span>
                  </div>
                  {s.note && <div className="t-sched-dest">{s.note}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* 오른쪽: 로트 선택 및 출고 처리 */}
        <div className="t-right-panel">
          {!selectedSchedule ? (
            <div className="t-right-empty">좌측에서 출고 예정을 선택하세요</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
              {/* 선택된 상품 정보 */}
              <div className="t-sel-banner active">
                <div className="t-sel-product">{selectedProduct?.name}</div>
                <div className="t-sel-meta">
                  <span>출고 {selectedSchedule.quantity.toLocaleString()}개</span>
                  <span>{selectedSchedule.note}</span>
                </div>
              </div>

              {/* FIFO 로트 목록 */}
              <div className="t-lot-list-section">
                <div className="t-lot-list-label">재고 위치 (FIFO 순)</div>
                <div className="t-lot-list">
                  {lots.length === 0 ? (
                    <div className="t-lot-empty">재고 없음</div>
                  ) : lots.map((l, idx) => (
                    <div
                      key={l.item.id}
                      className={`t-lot-card${selectedLotId === l.item.id ? ' selected' : ''}`}
                      onClick={() => handleSelectLot(l.item.id)}
                    >
                      <div className="t-lot-rank">#{idx + 1}</div>
                      <div className="t-lot-body">
                        <div className="t-lot-date">{l.item.received_at}</div>
                        <div className="t-lot-loc">
                          {l.warehouse?.name} · {l.rack?.rack_no}번랙 {l.floor}칸 {l.kan}단
                        </div>
                        <div className="t-lot-qty">{l.item.quantity.toLocaleString()}개 재고</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 선택된 로트 위치 정보 */}
              {selectedLot && (
                <div className="t-fifo-location-block">
                  <div className="t-fifo-location-label">출고 위치</div>
                  <div className="t-fifo-location-main">
                    <div className="t-fifo-loc-item">
                      <span className="t-fifo-loc-value">{selectedLot.warehouse?.name}</span>
                    </div>
                    <div className="t-fifo-loc-sep">/</div>
                    <div className="t-fifo-loc-item">
                      <span className="t-fifo-loc-value">{selectedLot.rack?.rack_no}</span>
                      <span className="t-fifo-loc-unit">번랙</span>
                    </div>
                    <div className="t-fifo-loc-sep">/</div>
                    <div className="t-fifo-loc-item">
                      <span className="t-fifo-loc-value">{selectedLot.floor}</span>
                      <span className="t-fifo-loc-unit">칸</span>
                    </div>
                    <div className="t-fifo-loc-sep">/</div>
                    <div className="t-fifo-loc-item">
                      <span className="t-fifo-loc-value">{selectedLot.kan}</span>
                      <span className="t-fifo-loc-unit">단</span>
                    </div>
                  </div>
                  <div className="t-fifo-received">입고일: {selectedLot.item.received_at}</div>
                </div>
              )}

              {/* 전동랙 제어 */}
              {isElectric && selectedLotId && (
                <div className="t-control-area">
                  <div className={`t-elec-status${elecStatus !== 'idle' ? ` ${elecStatus}` : ''}`}>
                    {elecStatusText[elecStatus]}
                  </div>
                  <div className="t-electric-btns" style={{ marginTop: 8 }}>
                    <button
                      className="t-electric-btn open"
                      onClick={() => setElecStatus('running')}
                    >
                      <span className="t-electric-btn-icon">▶</span>열기
                    </button>
                    <button
                      className="t-electric-btn stop"
                      onClick={() => setElecStatus('stopped')}
                    >
                      <span className="t-electric-btn-icon">■</span>멈춤
                    </button>
                  </div>
                </div>
              )}

              {/* 확정 바 */}
              <div className="t-confirm-bar" style={{ flexShrink: 0 }}>
                <div className="t-qty-row">
                  <span className="t-qty-label">수량</span>
                  <input
                    type="number"
                    className="t-qty-input"
                    value={qty}
                    onChange={e => setQty(e.target.value)}
                    placeholder="0"
                    min="1"
                    max={selectedLot?.item.quantity}
                  />
                  {selectedLot && (
                    <span className="t-qty-hint">/ {selectedLot.item.quantity.toLocaleString()}개</span>
                  )}
                </div>
                <button className="t-btn-confirm" disabled={!canConfirm} onClick={handleConfirm}>
                  출고 확정
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {settingsOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-bright)', borderRadius: 14, width: '100%', maxWidth: 420, maxHeight: '90vh', overflowY: 'auto', padding: 24, boxSizing: 'border-box' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>설정</div>

            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>프로필</div>
            {[
              { label: '이름', key: 'name' },
              { label: '전화번호', key: 'phone' },
              { label: '직책', key: 'position' },
              { label: '메모', key: 'memo' },
            ].map(({ label, key }) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
                <input
                  type="text"
                  value={profile[key]}
                  onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}

            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '18px 0 10px' }}>비밀번호 변경</div>
            {[
              { label: '현재 비밀번호', key: 'current' },
              { label: '새 비밀번호', key: 'next' },
              { label: '확인', key: 'confirm' },
            ].map(({ label, key }) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
                <input
                  type="password"
                  value={passwords[key]}
                  onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}

            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '18px 0 10px' }}>테마</div>
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
              <button onClick={() => setTheme('light')} style={{ flex: 1, padding: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit', background: theme === 'light' ? 'var(--cyan)' : 'var(--bg-surface)', color: theme === 'light' ? '#000' : 'var(--text-secondary)' }}>라이트</button>
              <button onClick={() => setTheme('dark')} style={{ flex: 1, padding: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit', background: theme === 'dark' ? 'var(--cyan)' : 'var(--bg-surface)', color: theme === 'dark' ? '#000' : 'var(--text-secondary)' }}>다크</button>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setSettingsOpen(false)} style={{ flex: 1, padding: 12, borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>닫기</button>
              <button onClick={() => { setSettingsOpen(false); showToast('설정이 저장되었습니다', 'green'); }} style={{ flex: 2, padding: 12, borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', border: 'none', background: 'var(--cyan)', color: '#000', cursor: 'pointer', fontFamily: 'inherit' }}>저장</button>
            </div>

            <button onClick={() => navigate('/')} style={{ width: '100%', marginTop: 12, padding: 12, borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', border: 'none', background: 'var(--red-dim, #7f1d1d)', color: 'var(--red, #f87171)', cursor: 'pointer', fontFamily: 'inherit' }}>로그아웃</button>
          </div>
        </div>
      )}

      <div className="t-tab-bar">
        <button className="t-tab" onClick={() => navigate('/tablet/inbound')}>입고처리</button>
        <button className="t-tab active">출고처리</button>
        <button className="t-tab" onClick={() => setSettingsOpen(true)}>설정</button>
      </div>
    </div>
  );
}
