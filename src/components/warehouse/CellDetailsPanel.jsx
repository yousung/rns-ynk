import { useDataStore } from '../../store/useDataStore.js';

export function KanDetailPanel({ rackId, floor, kan }) {
  const { racks, pallets, inventoryItems, products } = useDataStore();

  const panelStyle = {
    padding: '12px 16px',
    background: 'transparent',
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
  };

  if (!rackId || !floor || !kan) {
    return (
      <div style={panelStyle}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>단을 선택하면 적재 상세가 표시됩니다</div>
      </div>
    );
  }

  const rack = racks.find(r => r.id === rackId);
  const pallet = pallets.find(p => p.location === `${rackId}-${floor}-${kan}`);
  const items = pallet ? inventoryItems.filter(i => i.pallet_id === pallet.id) : [];

  return (
    <div style={panelStyle}>
      <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>
        {rack?.rack_no}번 랙 {floor}칸 {kan}단 — 적재 상세
      </div>
      {items.length === 0 ? (
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>빈 단입니다</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)' }}>
              <th style={{ textAlign: 'left', padding: '3px 8px' }}>팔레트</th>
              <th style={{ textAlign: 'left', padding: '3px 8px' }}>상품</th>
              <th style={{ textAlign: 'left', padding: '3px 8px' }}>수량</th>
              <th style={{ textAlign: 'left', padding: '3px 8px' }}>입고일</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const prod = products.find(p => p.id === item.product_id);
              return (
                <tr key={item.id}>
                  <td style={{ padding: '3px 8px' }}>P{String(pallet.id).padStart(3, '0')}</td>
                  <td style={{ padding: '3px 8px' }}>{prod?.name || '-'}</td>
                  <td style={{ padding: '3px 8px' }}>{item.quantity.toLocaleString()}개</td>
                  <td style={{ padding: '3px 8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.received_at}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function CellDetailsPanel({ selectedCell }) {
  const { pallets, inventoryItems, products, racks } = useDataStore();

  if (!selectedCell) {
    return (
      <div className="cell-details">
        <div className="cd-empty">셀을 클릭하면 상세 정보가 표시됩니다</div>
      </div>
    );
  }

  const { rackId, floor } = selectedCell;
  const rack = racks.find((r) => r.id === rackId);
  const groups = rack?.groups || 4;

  const rows = [];
  for (let kan = 1; kan <= groups; kan++) {
    const locStr = `${rackId}-${floor}-${kan}`;
    const pallet = pallets.find((p) => p.location === locStr);
    const items = pallet ? inventoryItems.filter((i) => i.pallet_id === pallet.id) : [];
    rows.push({ kan, pallet, items });
  }

  return (
    <div className="cell-details">
      <div className="cd-header">
        랙 {rack?.rack_no} — {floor}칸
      </div>
      <div className="cd-table-wrap">
        <table className="cd-table">
          <thead>
            <tr>
              <th>단</th>
              <th>팔레트</th>
              <th>상품</th>
              <th>수량</th>
              <th>입고일</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ kan, pallet, items }) =>
              items.length === 0 ? (
                <tr key={kan} className="cd-empty-row">
                  <td>{kan}단</td>
                  <td colSpan={4}>—</td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const product = products.find((p) => p.id === item.product_id);
                  return (
                    <tr key={`${kan}-${idx}`}>
                      {idx === 0 && <td rowSpan={items.length}>{kan}단</td>}
                      <td>P{String(pallet.id).padStart(3, '0')}</td>
                      <td>{product?.name || '-'}</td>
                      <td>{item.quantity.toLocaleString()}</td>
                      <td>{item.received_at}</td>
                    </tr>
                  );
                })
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
