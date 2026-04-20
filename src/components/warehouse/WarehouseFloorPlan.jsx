import { useState } from 'react';
import { useDataStore } from '../../store/useDataStore.js';

const RACK_W = 42, RACK_G = 6, GROUP_H = 18, PAD_L = 10;
const BACK_Y = 12, FRONT_Y = 130;
const SVG_W = 740, SVG_H = 240;

const CAT_COLORS = {
  '의료용 밴드': '#60A5FA', '붕대류': '#F59E0B', '보호대류': '#34D399',
  '원단/소재': '#A78BFA', '포장재': '#22D3EE', '접착제': '#F87171',
};

function heatColor(rate) {
  if (rate <= 0) return 'rgba(94,226,198,0.25)';
  if (rate < 0.34) return 'rgba(0,212,255,0.4)';
  if (rate < 0.67) return 'rgba(245,158,11,0.5)';
  return 'rgba(248,113,113,0.65)';
}

export default function WarehouseFloorPlan({ warehouseId, selectedProductId, selectedRackId, onRackClick, onRackHover }) {
  const { racks, pallets, inventoryItems, products } = useDataStore();

  const whRacks = racks.filter(r => r.warehouse_id === warehouseId);
  const productPalletIds = selectedProductId
    ? new Set(inventoryItems.filter(i => i.product_id === selectedProductId).map(i => i.pallet_id))
    : null;

  const rackElements = [];

  whRacks.forEach(rack => {
    const isFront = rack.rack_no <= 15;
    const idx = isFront ? rack.rack_no - 1 : rack.rack_no - 16;
    const x = PAD_L + idx * (RACK_W + RACK_G);
    const baseY = isFront ? FRONT_Y : BACK_Y;
    const rackDepth = rack.groups * GROUP_H;
    const palletsInRack = pallets.filter(p => parseInt(p.location.split('-')[0]) === rack.id);
    const isSelected = rack.id === selectedRackId;
    const hasProduct = productPalletIds && palletsInRack.some(p => productPalletIds.has(p.id));

    for (let g = 1; g <= rack.groups; g++) {
      const gy = isFront ? baseY + (g - 1) * GROUP_H : baseY + (rack.groups - g) * GROUP_H;
      const gPallets = palletsInRack.filter(p => parseInt(p.location.split('-')[2]) === g);
      let fill = heatColor(gPallets.length / Math.max(rack.floors, 1));
      if (productPalletIds && gPallets.some(p => productPalletIds.has(p.id))) fill = 'rgba(0,212,255,0.55)';
      rackElements.push(
        <rect key={`${rack.id}-g${g}`} x={x} y={gy} width={RACK_W} height={GROUP_H}
          fill={fill} stroke="rgba(30,58,95,0.6)" strokeWidth={0.5} />
      );
    }

    if (isSelected) {
      rackElements.push(
        <rect key={`${rack.id}-sel`} x={x - 2} y={baseY - 2} width={RACK_W + 4} height={rackDepth + 4}
          fill="none" stroke="var(--cyan)" strokeWidth={2} rx={3} />
      );
    } else if (hasProduct) {
      rackElements.push(
        <rect key={`${rack.id}-hp`} x={x - 1} y={baseY - 1} width={RACK_W + 2} height={rackDepth + 2}
          fill="none" stroke="var(--cyan)" strokeWidth={1.5} rx={2} strokeDasharray="4,2" />
      );
    }

    const labelY = isFront ? baseY + rackDepth + 12 : baseY - 4;
    const labelFill = (isSelected || hasProduct) ? 'var(--cyan)' : 'var(--text-secondary)';
    const labelWeight = (isSelected || hasProduct) ? 600 : 400;
    rackElements.push(
      <text key={`${rack.id}-lbl`} x={x + RACK_W / 2} y={labelY} textAnchor="middle"
        fill={labelFill} fontSize={9.5} fontWeight={labelWeight}>{rack.rack_no}</text>
    );

    rackElements.push(
      <rect key={`${rack.id}-hit`} x={x} y={baseY} width={RACK_W} height={rackDepth}
        fill="transparent" style={{ cursor: 'pointer' }}
        onClick={() => onRackClick?.(rack.id)}
        onMouseEnter={() => onRackHover?.(rack.id)}
        onMouseLeave={() => onRackHover?.(null)} />
    );
  });

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" height={SVG_H}
      preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {rackElements}
    </svg>
  );
}

export function FloorPlanRackDetail({ rackId, selectedFloor, selectedKan, onKanClick, disableEmptyKan = false }) {
  const { racks, pallets, inventoryItems, products } = useDataStore();

  const panelStyle = {
    padding: '12px 16px',
    background: 'transparent',
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
  };

  const rack = racks.find(r => r.id === rackId);
  if (!rack) {
    return (
      <div style={panelStyle}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>랙을 선택하면 칸별 현황이 표시됩니다</div>
      </div>
    );
  }

  function buildCells(fl) {
    const cells = [];
    for (let g = 1; g <= rack.groups; g++) {
      const key = `${rack.id}-${fl}-${g}`;
      const pallet = pallets.find(p => p.location === key);
      const items = pallet ? inventoryItems.filter(i => i.pallet_id === pallet.id) : [];
      const firstItem = items[0] ? products.find(pr => pr.id === items[0].product_id) : null;
      const catColor = firstItem ? (CAT_COLORS[firstItem.category] || 'var(--cyan)') : null;
      const isSel = selectedFloor === fl && selectedKan === g;
      cells.push(
        <div key={g} onClick={(e) => { e.stopPropagation(); if (disableEmptyKan && !pallet) return; onKanClick?.(fl, g); }} style={{
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          width: 52, height: 42, borderRadius: 5,
          border: isSel ? '2px solid var(--cyan)' : `1px solid ${pallet ? (catColor || 'var(--cyan)') : 'var(--border)'}`,
          background: isSel ? 'var(--cyan-dim)' : (pallet ? (catColor ? catColor + '22' : 'var(--cyan-dim)') : 'var(--bg-surface)'),
          color: isSel ? 'var(--cyan)' : (pallet ? (catColor || 'var(--cyan)') : 'var(--text-secondary)'),
          fontSize: '0.65rem', gap: 2,
          cursor: (disableEmptyKan && !pallet) ? 'not-allowed' : (onKanClick ? 'pointer' : 'default'),
          boxShadow: isSel ? '0 0 0 1px var(--cyan)' : 'none',
        }}>
          <span>K{g}</span>
          <span style={{ fontSize: '0.6rem' }}>{pallet ? items.length + '종' : '빈칸'}</span>
        </div>
      );
    }
    return cells;
  }

  if (selectedFloor) {
    return (
      <div style={panelStyle}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {buildCells(selectedFloor)}
        </div>
      </div>
    );
  }

  const rows = [];
  for (let fl = rack.floors; fl >= 1; fl--) {
    rows.push(
      <div key={fl} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <div style={{ width: 26, fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>{fl}F</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{buildCells(fl)}</div>
      </div>
    );
  }
  return (
    <div style={panelStyle}>
      <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 10 }}>{rack.rack_no}번 랙 — 칸별 현황</div>
      {rows}
    </div>
  );
}
