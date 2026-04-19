import { useDataStore } from '../../store/useDataStore.js';

const CELL_W = 52, CELL_H = 36, PAD_L = 36, PAD_T = 32;

const CAT_COLORS = {
  '의료용 밴드': '#60A5FA', '붕대류': '#F59E0B', '보호대류': '#34D399',
  '원단/소재': '#A78BFA', '포장재': '#22D3EE', '접착제': '#F87171',
};

export default function WarehouseSection({ warehouseId, selectedProductId, selectedRackId, onRackSelect }) {
  const { racks, pallets, inventoryItems, products } = useDataStore();

  const whRacks = racks.filter(r => r.warehouse_id === warehouseId);
  const productPalletIds = selectedProductId
    ? new Set(inventoryItems.filter(i => i.product_id === selectedProductId).map(i => i.pallet_id))
    : null;

  const rack = racks.find(r => r.id === selectedRackId);

  // rack buttons
  const rackBtns = whRacks.map(r => {
    const palletsInRack = pallets.filter(p => parseInt(p.location.split('-')[0]) === r.id);
    const hasProduct = productPalletIds && palletsInRack.some(p => productPalletIds.has(p.id));
    const isActive = r.id === selectedRackId;
    return (
      <button
        key={r.id}
        onClick={() => onRackSelect && onRackSelect(r.id)}
        style={{
          padding: '3px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
          border: `1px solid ${isActive ? 'var(--cyan)' : hasProduct ? 'rgba(0,212,255,0.4)' : 'var(--border)'}`,
          background: isActive ? 'var(--cyan-dim)' : 'var(--bg-surface)',
          color: isActive ? 'var(--cyan)' : hasProduct ? 'var(--cyan)' : 'var(--text-secondary)',
        }}
      >
        R{String(r.rack_no).padStart(2, '0')}
      </button>
    );
  });

  // SVG section
  let sectionContent = null;
  if (!rack) {
    sectionContent = (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 140, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        위에서 랙을 선택하세요
      </div>
    );
  } else {
    const svgW = PAD_L + rack.groups * CELL_W + 20;
    const svgH = PAD_T + rack.floors * CELL_H + 28;
    const svgElements = [];

    for (let g = 1; g <= rack.groups; g++) {
      const cx = PAD_L + (g - 1) * CELL_W + CELL_W / 2;
      svgElements.push(
        <text key={`k${g}`} x={cx} y={PAD_T - 8} textAnchor="middle"
          fill="var(--text-secondary)" fontSize={10} fontWeight={600}>K{g}</text>
      );
    }
    svgElements.push(
      <text key="front" x={PAD_L} y={PAD_T - 18} fill="var(--text-secondary)" fontSize={8.5} opacity={0.6}>← 전면</text>,
      <text key="back" x={PAD_L + rack.groups * CELL_W - 2} y={PAD_T - 18} textAnchor="end" fill="var(--text-secondary)" fontSize={8.5} opacity={0.6}>후면 →</text>
    );

    for (let fl = rack.floors; fl >= 1; fl--) {
      const row = rack.floors - fl;
      const cy = PAD_T + row * CELL_H + CELL_H / 2 + 4;
      svgElements.push(
        <text key={`fl${fl}`} x={PAD_L - 8} y={cy} textAnchor="end"
          fill="var(--text-secondary)" fontSize={10} fontWeight={600}>{fl}F</text>
      );

      for (let g = 1; g <= rack.groups; g++) {
        const key = `${rack.id}-${fl}-${g}`;
        const x = PAD_L + (g - 1) * CELL_W;
        const y = PAD_T + row * CELL_H;
        const pallet = pallets.find(p => p.location === key);
        const items = pallet ? inventoryItems.filter(i => i.pallet_id === pallet.id) : [];
        const isHighlighted = productPalletIds && pallet && productPalletIds.has(pallet.id);

        let fillColor = 'rgba(94,226,198,0.08)';
        let strokeColor = 'rgba(94,226,198,0.2)';
        let textColor = 'var(--text-secondary)';
        let label = '빈칸';
        let sublabel = '';

        if (pallet) {
          const firstItem = items[0] ? products.find(pr => pr.id === items[0].product_id) : null;
          const catColor = firstItem ? (CAT_COLORS[firstItem.category] || '#60A5FA') : '#60A5FA';
          const dimmed = productPalletIds && !isHighlighted;
          fillColor = catColor + (dimmed ? '11' : '22');
          strokeColor = catColor + (dimmed ? '44' : '88');
          textColor = dimmed ? catColor + '66' : catColor;
          label = firstItem ? firstItem.name.slice(0, 5) : '상품';
          sublabel = `${items.length}종`;
        }

        svgElements.push(
          <g key={`${fl}-${g}`}>
            <rect x={x} y={y} width={CELL_W - 2} height={CELL_H - 2}
              fill={fillColor} stroke={strokeColor} strokeWidth={1} rx={3} />
            <text x={x + (CELL_W - 2) / 2} y={y + 14} textAnchor="middle"
              fill={textColor} fontSize={9} fontWeight={pallet ? 600 : 400}>{label}</text>
            {sublabel && <text x={x + (CELL_W - 2) / 2} y={y + 26} textAnchor="middle"
              fill={textColor} fontSize={8.5}>{sublabel}</text>}
          </g>
        );
      }
    }

    sectionContent = (
      <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, padding: '0 4px' }}>
          {rack.rack_no}번 랙 단면도 — {rack.floors}층 × {rack.groups}칸
        </div>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ minWidth: Math.min(svgW, 320), display: 'block' }}>
          {svgElements}
        </svg>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', padding: '8px 12px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        {rackBtns}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 12px 12px' }}>
        {sectionContent}
      </div>
    </div>
  );
}
