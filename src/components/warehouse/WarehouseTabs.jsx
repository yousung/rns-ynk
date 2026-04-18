import { useDataStore } from '../../store/useDataStore.js';

export default function WarehouseTabs({ selectedWarehouseId, onSelect, children }) {
  const warehouses = useDataStore((s) => s.warehouses);

  return (
    <div className="wh-tabs-row">
      {warehouses.map((wh) => (
        <button
          key={wh.id}
          className={`wh-tab${wh.id === selectedWarehouseId ? ' active' : ''}`}
          onClick={() => onSelect(wh.id)}
        >
          {wh.name}
        </button>
      ))}
      {children}
    </div>
  );
}
