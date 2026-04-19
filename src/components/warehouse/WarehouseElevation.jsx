import { useDataStore } from '../../store/useDataStore.js';

const RACK_W = 20, RACK_G = 4, FLOOR_H = 28, PAD_L = 40, PAD_T = 16;
const GRP_GAP = 32, MAX_FLOORS = 6;
const SVG_W = 820, SVG_H = 220;

function heatColor(rate) {
  if (rate <= 0) return 'rgba(94,226,198,0.25)';
  if (rate < 0.34) return 'rgba(0,212,255,0.4)';
  if (rate < 0.67) return 'rgba(245,158,11,0.5)';
  return 'rgba(248,113,113,0.65)';
}

function getRackX(rackNo) {
  if (rackNo <= 15) return PAD_L + (rackNo - 1) * (RACK_W + RACK_G);
  return PAD_L + 15 * (RACK_W + RACK_G) + GRP_GAP + (rackNo - 16) * (RACK_W + RACK_G);
}

function getFloorY(floor) {
  return PAD_T + (MAX_FLOORS - floor) * FLOOR_H;
}

export default function WarehouseElevation({ warehouseId, selectedProductId, selectedRackId, onRackClick }) {
  const { racks, pallets, inventoryItems } = useDataStore();

  const whRacks = racks.filter(r => r.warehouse_id === warehouseId);
  const productPalletIds = selectedProductId
    ? new Set(inventoryItems.filter(i => i.product_id === selectedProductId).map(i => i.pallet_id))
    : null;

  const elements = [];

  // floor labels
  for (let fl = 1; fl <= MAX_FLOORS; fl++) {
    const y = getFloorY(fl) + FLOOR_H / 2 + 4;
    elements.push(
      <text key={`fl-${fl}`} x={PAD_L - 6} y={y} textAnchor="end"
        fill="var(--text-secondary)" fontSize={9}>{fl}F</text>
    );
  }

  // group labels
  const grp1X = PAD_L + 7 * (RACK_W + RACK_G) + RACK_W / 2;
  const grp2X = PAD_L + 15 * (RACK_W + RACK_G) + GRP_GAP + 7 * (RACK_W + RACK_G) + RACK_W / 2;
  const labelY = PAD_T + MAX_FLOORS * FLOOR_H + 16;
  elements.push(
    <text key="lbl1" x={grp1X} y={labelY} textAnchor="middle" fill="var(--text-secondary)" fontSize={9} opacity={0.7}>전면 (R01 ~ R15)</text>,
    <text key="lbl2" x={grp2X} y={labelY} textAnchor="middle" fill="var(--text-secondary)" fontSize={9} opacity={0.7}>후면 (R16 ~ R30)</text>
  );

  const sepX = PAD_L + 15 * (RACK_W + RACK_G) + GRP_GAP / 2;
  elements.push(
    <line key="sep" x1={sepX} y1={PAD_T} x2={sepX} y2={PAD_T + MAX_FLOORS * FLOOR_H}
      stroke="var(--border)" strokeWidth={1} strokeDasharray="3,3" />
  );

  whRacks.forEach(rack => {
    const x = getRackX(rack.rack_no);
    const isSelected = rack.id === selectedRackId;
    const palletsInRack = pallets.filter(p => parseInt(p.location.split('-')[0]) === rack.id);
    const hasProduct = productPalletIds && palletsInRack.some(p => productPalletIds.has(p.id));

    for (let fl = 1; fl <= rack.floors; fl++) {
      const y = getFloorY(fl);
      const palletsOnFloor = palletsInRack.filter(p => parseInt(p.location.split('-')[1]) === fl);
      const rate = rack.groups > 0 ? palletsOnFloor.length / rack.groups : 0;
      let fill = heatColor(rate);
      if (productPalletIds && palletsOnFloor.some(p => productPalletIds.has(p.id))) fill = 'rgba(0,212,255,0.55)';
      elements.push(
        <rect key={`${rack.id}-fl${fl}`} x={x} y={y} width={RACK_W} height={FLOOR_H - 1}
          fill={fill} stroke="rgba(30,58,95,0.5)" strokeWidth={0.5} rx={1} />
      );
    }
    for (let fl = rack.floors + 1; fl <= MAX_FLOORS; fl++) {
      const y = getFloorY(fl);
      elements.push(
        <rect key={`${rack.id}-na${fl}`} x={x} y={y} width={RACK_W} height={FLOOR_H - 1}
          fill="rgba(30,41,59,0.3)" stroke="rgba(30,58,95,0.2)" strokeWidth={0.5} rx={1} />
      );
    }

    const totalH = rack.floors * FLOOR_H;
    const topY = getFloorY(rack.floors);
    if (isSelected) {
      elements.push(
        <rect key={`${rack.id}-sel`} x={x - 2} y={topY - 2} width={RACK_W + 4} height={totalH + 4}
          fill="none" stroke="var(--cyan)" strokeWidth={2} rx={3} />
      );
    } else if (hasProduct) {
      elements.push(
        <rect key={`${rack.id}-hp`} x={x - 1} y={topY - 1} width={RACK_W + 2} height={totalH + 2}
          fill="none" stroke="var(--cyan)" strokeWidth={1.5} rx={2} strokeDasharray="4,2" />
      );
    }

    const numY = topY - 5;
    elements.push(
      <text key={`${rack.id}-lbl`} x={x + RACK_W / 2} y={numY} textAnchor="middle"
        fill={isSelected ? 'var(--cyan)' : hasProduct ? 'var(--cyan)' : 'var(--text-secondary)'}
        fontSize={8.5} fontWeight={(isSelected || hasProduct) ? 600 : 400}>{rack.rack_no}</text>
    );
    elements.push(
      <rect key={`${rack.id}-hit`} x={x} y={PAD_T} width={RACK_W} height={MAX_FLOORS * FLOOR_H}
        fill="transparent" style={{ cursor: 'pointer' }}
        onClick={() => onRackClick && onRackClick(rack.id)} />
    );
  });

  return (
    <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ minWidth: 480, display: 'block' }}>
        {elements}
      </svg>
    </div>
  );
}
