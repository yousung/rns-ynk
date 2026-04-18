import { useDataStore } from '../../store/useDataStore.js';

export default function WarehouseRackGrid({
  warehouseId,
  selectedRackId,
  onRackClick,
  highlightedRackIds = [],
  getCellClass,
}) {
  const { racks, pallets, inventoryItems } = useDataStore();

  const whRacks = racks
    .filter((r) => r.warehouse_id === warehouseId)
    .sort((a, b) => a.rack_no - b.rack_no);

  function getRackLotCount(rackId) {
    const rackPallets = pallets.filter((p) => p.location.startsWith(`${rackId}-`));
    return rackPallets.length;
  }

  function getCellCls(rackId, floor, kan) {
    if (getCellClass) return getCellClass(rackId, floor, kan);
    const hasPallet = !!pallets.find((p) => p.location === `${rackId}-${floor}-${kan}`);
    return hasPallet ? 'rc-filled' : 'rc-empty';
  }

  return (
    <div className="wh3d-container">
      <div className="wh3d-scroll">
        <div
          className="wh3d-grid"
          style={{ gridTemplateColumns: `repeat(${Math.min(whRacks.length, 6)}, 1fr)` }}
        >
          {whRacks.map((rack) => {
            const lotCount = getRackLotCount(rack.id);
            const isSelected = rack.id === selectedRackId;
            const isHighlighted = highlightedRackIds.includes(rack.id);

            const floors = Array.from({ length: rack.floors }, (_, i) => rack.floors - i);
            const groups = Array.from({ length: rack.groups }, (_, i) => i + 1);

            return (
              <div
                key={rack.id}
                className={`rack-card${isSelected ? ' selected' : ''}${isHighlighted ? ' highlighted' : ''}`}
                onClick={() => onRackClick?.(rack.id)}
              >
                <div className="rack-card-header">
                  <span className="rack-card-no">R{String(rack.rack_no).padStart(2, '0')}</span>
                  <span className={`rack-card-lot${lotCount === 0 ? ' empty' : ''}`}>
                    {lotCount > 0 ? `${lotCount}P` : '공'}
                  </span>
                </div>
                <div
                  className="rack-cell-grid"
                  style={{ gridTemplateColumns: `repeat(${rack.groups}, 1fr)` }}
                >
                  {floors.map((floor) =>
                    groups.map((kan) => (
                      <div
                        key={`${floor}-${kan}`}
                        className={`rc ${getCellCls(rack.id, floor, kan)}`}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
