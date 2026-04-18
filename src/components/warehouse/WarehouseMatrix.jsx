import { useRef, useEffect, useCallback } from 'react';
import { useDataStore, MAX_RACK_COUNT } from '../../store/useDataStore.js';
import MiniBlocks from './MiniBlocks.jsx';

function getCellClass(occupiedKans, groups, selectedKan, fifoInfo) {
  if (fifoInfo) {
    if (fifoInfo.type === 'fifo' && fifoInfo.rank === 1) return 'rm-fifo1';
    if (fifoInfo.type === 'fifo' && fifoInfo.rank === 2) return 'rm-fifo2';
    if (fifoInfo.type === 'fifo') return 'rm-fifon';
    if (fifoInfo.type === 'occupied') return 'rm-occupied';
    return 'rm-empty';
  }
  const filled = occupiedKans;
  if (filled === 0) return 'rm-empty';
  if (filled >= groups) return 'rm-full';
  const ratio = filled / groups;
  if (ratio <= 0.33) return 'rm-fill-1';
  if (ratio <= 0.66) return 'rm-fill-2';
  return 'rm-fill-3';
}

export default function WarehouseMatrix({
  warehouseId,
  selectedCell,
  onCellClick,
  getCellFifoInfo,
  getMiniBlocksFn,
  mode = 'inbound',
}) {
  const { racks, pallets } = useDataStore();
  const containerRef = useRef(null);
  const tableRef = useRef(null);

  const whRacks = racks
    .filter((r) => r.warehouse_id === warehouseId)
    .sort((a, b) => a.rack_no - b.rack_no);

  const maxFloors = Math.max(...whRacks.map((r) => r.floors), 1);

  useEffect(() => {
    function updateCellSize() {
      if (!containerRef.current || !tableRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const labelColWidth = 54;
      const availableWidth = containerWidth - labelColWidth - 20;
      const cellSize = Math.max(28, Math.floor(availableWidth / MAX_RACK_COUNT));
      tableRef.current.style.setProperty('--rm-cell-size', `${cellSize}px`);
    }
    updateCellSize();
    const observer = new ResizeObserver(updateCellSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [warehouseId]);

  const getOccupiedKans = useCallback(
    (rackId, floor) => {
      const rack = racks.find((r) => r.id === rackId);
      if (!rack) return 0;
      let count = 0;
      for (let kan = 1; kan <= rack.groups; kan++) {
        if (pallets.find((p) => p.location === `${rackId}-${floor}-${kan}`)) count++;
      }
      return count;
    },
    [racks, pallets]
  );

  const getMiniBlocks = useCallback(
    (rackId, floor) => {
      if (getMiniBlocksFn) return getMiniBlocksFn(rackId, floor);
      const rack = racks.find((r) => r.id === rackId);
      if (!rack) return [];
      const blocks = [];
      for (let kan = 1; kan <= rack.groups; kan++) {
        const hasPallet = !!pallets.find((p) => p.location === `${rackId}-${floor}-${kan}`);
        const isSel = selectedCell?.rackId === rackId && selectedCell?.floor === floor && selectedCell?.kan === kan;
        blocks.push(isSel ? 'mini-sel' : hasPallet ? 'mini-filled' : 'mini-empty');
      }
      return blocks;
    },
    [racks, pallets, selectedCell, getMiniBlocksFn]
  );

  const floors = Array.from({ length: maxFloors }, (_, i) => maxFloors - i);

  return (
    <div className="matrix-section">
      <div className="matrix-scroll" ref={containerRef}>
        <table className="rack-matrix" ref={tableRef}>
          <thead>
            <tr>
              <th className="label-cell">층/랙</th>
              {whRacks.map((rack) => (
                <th key={rack.id}>{rack.rack_no}</th>
              ))}
              {whRacks.length < MAX_RACK_COUNT &&
                Array.from({ length: MAX_RACK_COUNT - whRacks.length }).map((_, i) => (
                  <th key={`dummy-${i}`} className="rm-dummy-th" />
                ))}
            </tr>
          </thead>
          <tbody>
            {floors.map((floor) => (
              <tr key={floor}>
                <td className="label-cell">{floor}층</td>
                {whRacks.map((rack) => {
                  const hasFloor = floor <= rack.floors;
                  if (!hasFloor) {
                    return (
                      <td key={rack.id}>
                        <div className="rm-cell rm-na" />
                      </td>
                    );
                  }
                  const isSelected =
                    selectedCell?.rackId === rack.id && selectedCell?.floor === floor;
                  const fifoInfo = getCellFifoInfo ? getCellFifoInfo(rack.id, floor) : null;
                  const occupiedKans = getOccupiedKans(rack.id, floor);
                  const cellClass = getCellClass(occupiedKans, rack.groups, null, fifoInfo);
                  const miniBlocks = getMiniBlocks(rack.id, floor);

                  return (
                    <td key={rack.id} onClick={() => onCellClick?.(rack.id, floor)}>
                      <div className={`rm-cell ${cellClass}${isSelected ? ' rm-selected' : ''}`}>
                        <MiniBlocks blocks={miniBlocks} />
                      </div>
                    </td>
                  );
                })}
                {whRacks.length < MAX_RACK_COUNT &&
                  Array.from({ length: MAX_RACK_COUNT - whRacks.length }).map((_, i) => (
                    <td key={`dummy-${i}`}>
                      <div className="rm-cell rm-dummy" />
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="label-cell">랙 No.</td>
              {whRacks.map((rack) => (
                <td key={rack.id}>{rack.rack_no}</td>
              ))}
              {whRacks.length < MAX_RACK_COUNT &&
                Array.from({ length: MAX_RACK_COUNT - whRacks.length }).map((_, i) => (
                  <td key={`dummy-${i}`} className="rm-dummy-th" />
                ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
