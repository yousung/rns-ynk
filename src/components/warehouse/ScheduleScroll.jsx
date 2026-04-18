import { useDataStore } from '../../store/useDataStore.js';

export default function ScheduleScroll({ schedules, selectedId, onSelect, type }) {
  const products = useDataStore((s) => s.products);

  return (
    <div className="sched-section">
      <div className="sched-scroll">
        {schedules.map((sched) => {
          const product = products.find((p) => p.id === sched.product_id);
          return (
            <div
              key={sched.id}
              className={`sched-card${sched.id === selectedId ? ' selected' : ''}`}
              onClick={() => onSelect(sched.id)}
            >
              <div className="sched-card-name">{product?.name || '-'}</div>
              <div className="sched-card-meta">
                <span>{sched.quantity.toLocaleString()}개</span>
                <span>·</span>
                <span>{sched.scheduled_date}</span>
              </div>
              {sched.note && <div className="sched-note" style={{fontSize:'0.7rem',marginTop:2}}>{sched.note}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
