export default function StatsBar({ items }) {
  return (
    <div className="stats-bar">
      {items.map((item, i) => (
        <div key={i} className="stat-item">
          <span className="stat-label">{item.label}</span>
          <span className="stat-value" style={item.color ? { color: item.color } : {}}>
            {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
          </span>
          {item.unit && <span className="stat-unit">{item.unit}</span>}
        </div>
      ))}
    </div>
  );
}
