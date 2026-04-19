import { useDataStore } from '../../store/useDataStore.js';

export default function ScheduleScroll({ schedules, selectedId, onSelect, vertical }) {
  const products = useDataStore((s) => s.products);

  if (vertical) {
    return (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {schedules.length === 0 && (
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', padding: '8px 4px' }}>항목 없음</div>
        )}
        {schedules.map((sched) => {
          const product = products.find((p) => p.id === sched.product_id);
          return (
            <div
              key={sched.id}
              className={`sched-card${sched.id === selectedId ? ' selected' : ''}`}
              onClick={() => onSelect(sched.id)}
              style={{ minWidth: 0 }}
            >
              <div className="sched-card-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product?.name || '-'}
              </div>
              <div className="sched-card-meta">
                <span>{sched.quantity.toLocaleString()}개</span>
                <span>·</span>
                <span>{sched.scheduled_date}</span>
              </div>
              {sched.note && <div className="sched-note" style={{ fontSize: '0.7rem', marginTop: 2 }}>{sched.note}</div>}
            </div>
          );
        })}
      </div>
    );
  }

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
