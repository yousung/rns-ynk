import { useMemo } from 'react';
import { useDataStore } from '../../store/useDataStore.js';
import { useUIStore } from '../../store/useUIStore.js';

const U = 2.5, Wx = 1.0, Dy = 1.8, Zh = 0.65, GAP = 0.08;
const COS30 = Math.sqrt(3) / 2, SIN30 = 0.5;
const TARGET_H = 144, PAD = 1.2;

function iso(wx, wy, wz) {
  return [(wx - wy) * COS30 * U, (wx + wy) * SIN30 * U - wz * U];
}

function polyPts(corners) {
  return corners.map(([x, y]) => `${x},${y}`).join(' ');
}

export default function WarehouseMinimap({ warehouseId, selectedRackId, selectedCell, hoveredRackId, hoveredFloor, hoveredSlot }) {
  const { racks } = useDataStore();
  const { theme } = useUIStore();
  const isDark = theme === 'dark';

  const computed = useMemo(() => {
    const whRacks = racks
      .filter(r => r.warehouse_id === warehouseId)
      .sort((a, b) => a.rack_no - b.rack_no);

    if (whRacks.length === 0) return null;

    const cells = [];
    whRacks.forEach((rack, i) => {
      const x0 = i * (Wx + GAP);
      const cellW = Wx / rack.groups;
      for (let floor = 1; floor <= rack.floors; floor++) {
        for (let slot = 1; slot <= rack.groups; slot++) {
          const xs = x0 + (slot - 1) * cellW;
          const xe = xs + cellW;
          const zs = (floor - 1) * Zh;
          const ze = floor * Zh;
          cells.push({
            rackId: rack.id,
            floor,
            slot,
            sortX: xs,
            right: polyPts([iso(xe,0,zs), iso(xe,Dy,zs), iso(xe,Dy,ze), iso(xe,0,ze)]),
            front: polyPts([iso(xs,0,zs), iso(xe,0,zs), iso(xe,0,ze), iso(xs,0,ze)]),
            top:   polyPts([iso(xs,0,ze), iso(xe,0,ze), iso(xe,Dy,ze), iso(xs,Dy,ze)]),
          });
        }
      }
    });
    // Painter's algorithm: right-to-left, bottom-to-top
    cells.sort((a, b) => b.sortX - a.sortX || a.floor - b.floor);

    const allPts = whRacks.flatMap((rack, i) => {
      const x0 = i * (Wx + GAP);
      const h = rack.floors * Zh;
      return [
        iso(x0,0,h), iso(x0+Wx,0,h),
        iso(x0,0,0), iso(x0+Wx,0,0),
        iso(x0,Dy,0), iso(x0+Wx,Dy,0),
        iso(x0,Dy,h), iso(x0+Wx,Dy,h),
      ];
    });
    const xs = allPts.map(p => p[0]);
    const ys = allPts.map(p => p[1]);
    const minX = Math.min(...xs) - PAD, maxX = Math.max(...xs) + PAD;
    const minY = Math.min(...ys) - PAD, maxY = Math.max(...ys) + PAD;
    const vbW = maxX - minX, vbH = maxY - minY;
    const scale = TARGET_H / vbH;

    return {
      cells,
      viewBox: `${minX} ${minY} ${vbW} ${vbH}`,
      svgW: Math.round(vbW * scale),
      svgH: TARGET_H,
    };
  }, [racks, warehouseId]);

  if (!computed) return null;

  const { cells, viewBox, svgW, svgH } = computed;

  const c = isDark ? {
    bg: 'rgba(8,12,20,0.72)',
    border: 'rgba(94,226,198,0.22)',
    hBorder: 'rgba(94,226,198,0.55)',
    label: 'rgba(94,226,198,0.7)',
    shadow: '0 6px 20px rgba(0,0,0,0.5)',
    hShadow: '0 10px 36px rgba(0,0,0,0.7), 0 0 0 1px rgba(94,226,198,0.2)',
    // 셀 선택 — black + white stroke
    aTop: 'rgba(0,0,0,0.92)', aFront: 'rgba(0,0,0,0.78)', aSide: 'rgba(0,0,0,0.62)',
    aStroke: 'rgba(255,255,255,0.88)', aGlow: '0 0 4px rgba(255,255,255,0.75)',
    // 랙 호버 — light cyan
    hTop: 'rgba(94,226,198,0.22)', hFront: 'rgba(94,226,198,0.14)', hSide: 'rgba(94,226,198,0.09)',
    hStroke: 'rgba(94,226,198,0.45)',
    // 랙 선택 — dark cyan
    rsTop: 'rgba(94,226,198,0.65)', rsFront: 'rgba(94,226,198,0.44)', rsSide: 'rgba(94,226,198,0.28)',
    rsStroke: 'rgba(94,226,198,0.95)',
    // 층 호버 — amber
    yTop: 'rgba(251,191,36,0.62)', yFront: 'rgba(251,191,36,0.42)', ySide: 'rgba(251,191,36,0.28)',
    yStroke: 'rgba(251,191,36,0.9)',
    // 칸 호버 — light black
    khTop: 'rgba(0,0,0,0.30)', khFront: 'rgba(0,0,0,0.20)', khSide: 'rgba(0,0,0,0.13)',
    khStroke: 'rgba(255,255,255,0.38)',
    // 기본
    iTop: 'rgba(94,226,198,0.18)', iFront: 'rgba(94,226,198,0.10)', iSide: 'rgba(94,226,198,0.06)',
    iStroke: 'rgba(140,163,196,0.45)',
  } : {
    bg: 'rgba(248,250,252,0.92)',
    border: 'rgba(59,130,246,0.25)',
    hBorder: 'rgba(59,130,246,0.55)',
    label: 'rgba(59,130,246,0.75)',
    shadow: '0 4px 16px rgba(0,0,0,0.12)',
    hShadow: '0 8px 28px rgba(0,0,0,0.18), 0 0 0 1px rgba(59,130,246,0.2)',
    // 셀 선택 — black
    aTop: 'rgba(0,0,0,0.82)', aFront: 'rgba(0,0,0,0.62)', aSide: 'rgba(0,0,0,0.44)',
    aStroke: '#000000', aGlow: '0 0 3px rgba(0,0,0,0.65)',
    // 랙 호버 — light blue
    hTop: 'rgba(59,130,246,0.20)', hFront: 'rgba(59,130,246,0.13)', hSide: 'rgba(59,130,246,0.08)',
    hStroke: 'rgba(59,130,246,0.40)',
    // 랙 선택 — dark blue
    rsTop: 'rgba(59,130,246,0.58)', rsFront: 'rgba(59,130,246,0.38)', rsSide: 'rgba(59,130,246,0.24)',
    rsStroke: 'rgba(59,130,246,0.90)',
    // 층 호버 — amber
    yTop: 'rgba(245,158,11,0.60)', yFront: 'rgba(245,158,11,0.40)', ySide: 'rgba(245,158,11,0.26)',
    yStroke: 'rgba(245,158,11,0.88)',
    // 칸 호버 — light black
    khTop: 'rgba(0,0,0,0.22)', khFront: 'rgba(0,0,0,0.14)', khSide: 'rgba(0,0,0,0.09)',
    khStroke: 'rgba(0,0,0,0.38)',
    // 기본
    iTop: 'rgba(99,143,176,0.22)', iFront: 'rgba(99,143,176,0.13)', iSide: 'rgba(99,143,176,0.08)',
    iStroke: 'rgba(100,116,139,0.4)',
  };

  return (
    <div
      style={{
        position: 'absolute', top: 10, right: 10, zIndex: 10,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 6,
        padding: '5px 7px 6px',
        backdropFilter: 'blur(6px)',
        boxShadow: c.shadow,
        opacity: 0.5,
        transition: 'opacity 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.opacity = '1';
        el.style.borderColor = c.hBorder;
        el.style.boxShadow = c.hShadow;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.opacity = '0.5';
        el.style.borderColor = c.border;
        el.style.boxShadow = c.shadow;
      }}
    >
      <div style={{ fontSize: '0.55rem', color: c.label, marginBottom: 4, fontWeight: 700, letterSpacing: '0.08em', fontFamily: "'JetBrains Mono', monospace" }}>
        MINIMAP
      </div>
      <svg viewBox={viewBox} width={svgW} height={svgH} style={{ display: 'block' }}>
        {cells.map(({ rackId, floor, slot, right, front, top }) => {
          const isCellActive = selectedCell?.rackId === rackId && selectedCell?.floor === floor && selectedCell?.slot === slot;
          const isSlotHovered = !isCellActive && hoveredSlot?.rackId === rackId && hoveredSlot?.floor === floor && hoveredSlot?.slot === slot;
          const isFloorHovered = !isCellActive && !isSlotHovered && hoveredRackId === rackId && hoveredFloor === floor;
          const isFloorActive = !isCellActive && !isSlotHovered && !isFloorHovered && selectedCell?.rackId === rackId && selectedCell?.floor === floor && !hoveredRackId;
          const isRackHovered = !isCellActive && !isSlotHovered && !isFloorHovered && !isFloorActive && hoveredRackId === rackId;
          const isRackSelected = !isCellActive && !isSlotHovered && !isFloorHovered && !isFloorActive && !isRackHovered && (selectedRackId === rackId || selectedCell?.rackId === rackId);

          let tF, fF, sF, stroke, glowStyle = {};
          if (isCellActive) {
            tF = c.aTop; fF = c.aFront; sF = c.aSide; stroke = c.aStroke;
            glowStyle = { filter: `drop-shadow(${c.aGlow})` };
          } else if (isSlotHovered) {
            tF = c.khTop; fF = c.khFront; sF = c.khSide; stroke = c.khStroke;
          } else if (isFloorHovered) {
            tF = c.yTop; fF = c.yFront; sF = c.ySide; stroke = c.yStroke;
          } else if (isFloorActive) {
            tF = isDark ? 'rgba(0,0,0,0.50)' : 'rgba(0,0,0,0.32)';
            fF = isDark ? 'rgba(0,0,0,0.36)' : 'rgba(0,0,0,0.22)';
            sF = isDark ? 'rgba(0,0,0,0.24)' : 'rgba(0,0,0,0.14)';
            stroke = isDark ? 'rgba(255,255,255,0.48)' : 'rgba(0,0,0,0.52)';
          } else if (isRackHovered) {
            tF = c.hTop; fF = c.hFront; sF = c.hSide; stroke = c.hStroke;
          } else if (isRackSelected) {
            tF = c.rsTop; fF = c.rsFront; sF = c.rsSide; stroke = c.rsStroke;
          } else {
            tF = c.iTop; fF = c.iFront; sF = c.iSide; stroke = c.iStroke;
          }

          return (
            <g key={`${rackId}-${floor}-${slot}`} style={glowStyle}>
              <polygon points={right} fill={sF}  stroke={stroke} strokeWidth={0.2} />
              <polygon points={front} fill={fF}  stroke={stroke} strokeWidth={0.2} />
              <polygon points={top}   fill={tF}  stroke={stroke} strokeWidth={0.2} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
