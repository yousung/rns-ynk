import { useState, useMemo, useCallback } from 'react';
import { useDataStore } from '../store/useDataStore.js';
import { useUIStore } from '../store/useUIStore.js';
import WarehouseTabs from '../components/warehouse/WarehouseTabs.jsx';
import WarehouseMatrix from '../components/warehouse/WarehouseMatrix.jsx';
import WarehouseRackGrid from '../components/warehouse/WarehouseRackGrid.jsx';
import WarehouseFloorPlan, { FloorPlanRackDetail } from '../components/warehouse/WarehouseFloorPlan.jsx';
import WarehouseElevation from '../components/warehouse/WarehouseElevation.jsx';
import WarehouseSection from '../components/warehouse/WarehouseSection.jsx';

export default function Inventory() {
  const [view, setView] = useState(() => localStorage.getItem('wms_inventory_view') || 'list');
  const [listSearch, setListSearch] = useState('');
  const [listCategory, setListCategory] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const [whSearch, setWhSearch] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(1);
  const [selectedCell, setSelectedCell] = useState(null);

  const [selectedRackId, setSelectedRackId] = useState(null);

  const { products, inventoryItems, pallets, racks } = useDataStore();
  const { warehouseType } = useUIStore();

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  );

  // ─── 리스트 뷰 ───────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = listSearch.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      const matchCat = !listCategory || p.category === listCategory;
      return matchSearch && matchCat;
    });
  }, [products, listSearch, listCategory]);

  // ─── 창고 뷰 - 상품 검색 ─────────────────────────────────
  const filteredWhProducts = useMemo(() => {
    const q = whSearch.toLowerCase();
    return products.filter(
      (p) => !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
    );
  }, [products, whSearch]);

  // ─── 상품 선택 시 해당 창고로 자동 이동 ──────────────────
  function selectProduct(id) {
    const newId = selectedProductId === id ? null : id;
    setSelectedProductId(newId);
    setSelectedCell(null);
    if (newId) {
      const palletIds = new Set(inventoryItems.filter((i) => i.product_id === newId).map((i) => i.pallet_id));
      const hasInCurrent = pallets.some((p) => {
        if (!palletIds.has(p.id)) return false;
        const rackId = parseInt(p.location.split('-')[0]);
        return racks.some((r) => r.id === rackId && r.warehouse_id === selectedWarehouseId);
      });
      if (!hasInCurrent) {
        for (const p of pallets) {
          if (palletIds.has(p.id)) {
            const rack = racks.find((r) => r.id === parseInt(p.location.split('-')[0]));
            if (rack) { setSelectedWarehouseId(rack.warehouse_id); break; }
          }
        }
      }
    }
  }

  // ─── Type B: getCellClass (WarehouseRackGrid용) ──────────
  const getCellClass = useCallback(
    (rackId, floor, kan) => {
      const pallet = pallets.find((p) => p.location === `${rackId}-${floor}-${kan}`);
      if (!pallet) return 'rc-empty';
      if (selectedProductId) {
        const hasProduct = inventoryItems.some(
          (i) => i.pallet_id === pallet.id && i.product_id === selectedProductId
        );
        return hasProduct ? 'rc-highlight' : 'rc-filled';
      }
      return 'rc-filled';
    },
    [pallets, inventoryItems, selectedProductId]
  );

  // ─── Type B: getMiniBlocksFn (WarehouseMatrix용) ──────────
  const getMiniBlocksFn = useCallback(
    (rackId, floor) => {
      const rack = racks.find((r) => r.id === rackId);
      if (!rack) return [];
      return Array.from({ length: rack.groups }, (_, i) => {
        const kan = i + 1;
        const pallet = pallets.find((p) => p.location === `${rackId}-${floor}-${kan}`);
        const isCellSel = selectedCell?.rackId === rackId && selectedCell?.floor === floor && selectedCell?.kan === kan;
        if (isCellSel) return 'mini-sel';
        if (!pallet) return 'mini-empty';
        if (selectedProductId) {
          const hasProduct = inventoryItems.some(
            (i) => i.pallet_id === pallet.id && i.product_id === selectedProductId
          );
          return hasProduct ? 'mini-sel' : 'mini-filled';
        }
        return 'mini-filled';
      });
    },
    [racks, pallets, inventoryItems, selectedProductId, selectedCell]
  );

  function switchView(v) {
    setView(v);
    localStorage.setItem('wms_inventory_view', v);
  }

  // ─── 셀 상세 (창고 뷰 하단) ──────────────────────────────
  const cellRack = selectedCell ? racks.find((r) => r.id === selectedCell.rackId) : null;

  return (
    <>
      <div className="header-bar">
        <h1>재고 리스트</h1>
        <div className="view-toggle">
          <button className={`view-btn${view === 'list' ? ' active' : ''}`} onClick={() => switchView('list')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            <span>리스트</span>
          </button>
          <button className={`view-btn${view === 'warehouse' ? ' active' : ''}`} onClick={() => switchView('warehouse')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>창고</span>
          </button>
        </div>
      </div>

      {/* 리스트 뷰 */}
      {view === 'list' && (
        <div className="content-area">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>검색:</label>
              <input
                type="text"
                placeholder="상품명/코드"
                value={listSearch}
                onChange={(e) => setListSearch(e.target.value)}
                style={{ padding: '0.375rem 0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem', fontSize: '0.875rem', width: 150, background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
              />
            </div>
            <div className="flex items-center gap-2">
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>분류:</label>
              <select
                value={listCategory}
                onChange={(e) => setListCategory(e.target.value)}
                style={{ padding: '0.375rem 0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem', fontSize: '0.875rem', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
              >
                <option value="">전체</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button
              onClick={() => { setListSearch(''); setListCategory(''); }}
              style={{ padding: '0.375rem 0.75rem', background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              초기화
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>상품코드</th><th>상품명</th><th>분류</th><th>총 수량</th><th>위치 수</th><th>상세</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px 14px', color: 'var(--text-secondary)' }}>검색 결과가 없습니다.</td></tr>
                ) : (
                  filteredProducts.map((p) => {
                    const items = inventoryItems.filter((i) => i.product_id === p.id);
                    const total = items.reduce((s, i) => s + i.quantity, 0);
                    const isExpanded = expandedId === p.id;
                    return (
                      <>
                        <tr key={p.id}>
                          <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.code}</td>
                          <td>{p.name}</td>
                          <td>{p.category || '-'}</td>
                          <td>{total}개</td>
                          <td>{items.length}곳</td>
                          <td>
                            <button
                              style={{ color: 'var(--cyan)', fontSize: '0.875rem', cursor: 'pointer', background: 'none', border: 'none' }}
                              onClick={() => setExpandedId(isExpanded ? null : p.id)}
                            >
                              {isExpanded ? '닫기' : '상세보기'}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`detail-${p.id}`}>
                            <td colSpan={6}>
                              <div style={{ background: 'var(--bg-hover)', padding: 12, borderRadius: 4 }}>
                                <table>
                                  <thead><tr><th>위치</th><th>입고일</th><th>수량</th></tr></thead>
                                  <tbody>
                                    {items.map((item) => {
                                      const pl = pallets.find((pl2) => pl2.id === item.pallet_id);
                                      return (
                                        <tr key={item.id}>
                                          <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>{pl ? pl.location : '-'}</td>
                                          <td>{item.received_at}</td>
                                          <td>{item.quantity}개</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 창고 뷰 */}
      {view === 'warehouse' && (
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="wh-view" style={{ flex: 1, overflow: 'hidden' }}>
            {/* 왼쪽: 상품 검색 패널 */}
            <div className="wh-search-panel">
              <div className="wh-search-header">
                <input
                  type="text"
                  placeholder="상품명/코드 검색"
                  value={whSearch}
                  onChange={(e) => setWhSearch(e.target.value)}
                />
              </div>
              <div className="wh-product-list">
                {filteredWhProducts.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>검색 결과 없음</div>
                ) : (
                  filteredWhProducts.map((p) => {
                    const items = inventoryItems.filter((i) => i.product_id === p.id);
                    const total = items.reduce((s, i) => s + i.quantity, 0);
                    return (
                      <div
                        key={p.id}
                        className={`wh-product-card${selectedProductId === p.id ? ' selected' : ''}`}
                        onClick={() => selectProduct(p.id)}
                      >
                        <div className="wh-product-name">{p.name}</div>
                        <div className="wh-product-meta">
                          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.code}</span>
                          <span>{total}개</span>
                          <span>{items.length}곳</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 오른쪽: 창고 시각화 */}
            <div className="wh-visual-panel">
              <WarehouseTabs
                selectedWarehouseId={selectedWarehouseId}
                onSelect={(id) => { setSelectedWarehouseId(id); setSelectedCell(null); }}
              />
              <div className="wh-rack-area">
                {warehouseType === 'a' ? (
                  <WarehouseRackGrid
                    warehouseId={selectedWarehouseId}
                    highlightedRackIds={
                      selectedProductId
                        ? racks
                            .filter((r) =>
                              pallets.some((p) => {
                                const rId = parseInt(p.location.split('-')[0]);
                                return rId === r.id && inventoryItems.some((i) => i.pallet_id === p.id && i.product_id === selectedProductId);
                              })
                            )
                            .map((r) => r.id)
                        : []
                    }
                    getCellClass={getCellClass}
                  />
                ) : warehouseType === 'c' ? (
                  <WarehouseFloorPlan
                    warehouseId={selectedWarehouseId}
                    selectedProductId={selectedProductId}
                    selectedRackId={selectedRackId}
                    onRackClick={(id) => setSelectedRackId((prev) => prev === id ? null : id)}
                  />
                ) : warehouseType === 'd' ? (
                  <WarehouseElevation
                    warehouseId={selectedWarehouseId}
                    selectedProductId={selectedProductId}
                    selectedRackId={selectedRackId}
                    onRackClick={(id) => setSelectedRackId((prev) => prev === id ? null : id)}
                  />
                ) : warehouseType === 'e' ? (
                  <WarehouseSection
                    warehouseId={selectedWarehouseId}
                    selectedProductId={selectedProductId}
                    selectedRackId={selectedRackId}
                    onRackSelect={(id) => setSelectedRackId((prev) => prev === id ? null : id)}
                  />
                ) : (
                  <WarehouseMatrix
                    warehouseId={selectedWarehouseId}
                    selectedCell={selectedCell}
                    onCellClick={(rackId, floor) =>
                      setSelectedCell((prev) =>
                        prev?.rackId === rackId && prev?.floor === floor ? null : { rackId, floor }
                      )
                    }
                    getMiniBlocksFn={getMiniBlocksFn}
                    mode="inventory"
                  />
                )}
              </div>

              {/* C/D/E 랙 상세 */}
              {['c', 'd'].includes(warehouseType) && selectedRackId && (
                <FloorPlanRackDetail rackId={selectedRackId} />
              )}

              {/* 셀 상세 */}
              {selectedCell && cellRack && (
                <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg-panel)', flexShrink: 0, maxHeight: 200, overflowY: 'auto' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>
                    {cellRack.rack_no}번 랙 {selectedCell.floor}층 — 칸별 현황
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ color: 'var(--text-secondary)' }}>
                        <th style={{ textAlign: 'left', padding: '3px 8px' }}>칸</th>
                        <th style={{ textAlign: 'left', padding: '3px 8px' }}>상품</th>
                        <th style={{ textAlign: 'left', padding: '3px 8px' }}>수량</th>
                        <th style={{ textAlign: 'left', padding: '3px 8px' }}>입고일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: cellRack.groups }, (_, i) => i + 1).map((kan) => {
                        const pallet = pallets.find((p) => p.location === `${selectedCell.rackId}-${selectedCell.floor}-${kan}`);
                        if (!pallet) {
                          return (
                            <tr key={kan}>
                              <td style={{ padding: '3px 8px' }}>{kan}칸</td>
                              <td colSpan={3} style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '3px 8px' }}>비어있음</td>
                            </tr>
                          );
                        }
                        return inventoryItems
                          .filter((i) => i.pallet_id === pallet.id)
                          .map((item) => {
                            const prod = products.find((p) => p.id === item.product_id);
                            const isTarget = selectedProductId && item.product_id === selectedProductId;
                            return (
                              <tr key={item.id} style={isTarget ? { color: 'var(--amber)', fontWeight: 600 } : {}}>
                                <td style={{ padding: '3px 8px' }}>{kan}칸</td>
                                <td style={{ padding: '3px 8px' }}>{prod?.name || '-'}</td>
                                <td style={{ padding: '3px 8px' }}>{item.quantity}개</td>
                                <td style={{ padding: '3px 8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.received_at}</td>
                              </tr>
                            );
                          });
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 범례 */}
              <div className="wh-legend">
                <span style={{ marginRight: 4 }}>채움 정도:</span>
                {[
                  { label: '비어있음', bg: 'rgba(30,58,95,0.25)', border: '1px solid rgba(30,58,95,0.5)' },
                  { label: '재고 있음', bg: 'rgba(30,80,200,0.5)', border: '1px solid rgba(80,120,240,0.6)' },
                  { label: '선택 상품', bg: 'rgba(0,212,255,0.75)', border: '1px solid var(--cyan)' },
                ].map((item) => (
                  <div key={item.label} className="legend-item">
                    <div className="legend-dot" style={{ background: item.bg, border: item.border }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
