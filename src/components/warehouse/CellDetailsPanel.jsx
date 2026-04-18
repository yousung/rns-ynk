import { useDataStore } from '../../store/useDataStore.js';

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
        랙 {rack?.rack_no} — {floor}층
      </div>
      <div className="cd-table-wrap">
        <table className="cd-table">
          <thead>
            <tr>
              <th>칸</th>
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
                  <td>{kan}칸</td>
                  <td colSpan={4}>—</td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const product = products.find((p) => p.id === item.product_id);
                  return (
                    <tr key={`${kan}-${idx}`}>
                      {idx === 0 && <td rowSpan={items.length}>{kan}칸</td>}
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
