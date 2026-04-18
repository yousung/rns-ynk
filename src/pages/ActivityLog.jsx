import { useState, useMemo } from 'react';
import { useDataStore } from '../store/useDataStore.js';
import DateRangePicker from '../components/DateRangePicker.jsx';

const FEATURE_LABEL = {
  inbound: '입고',
  outbound: '출고',
  inventory: '재고',
  products: '상품',
  users: '사용자',
  settings: '설정',
};

export default function ActivityLog() {
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [feature, setFeature] = useState('all');
  const { activityLogs } = useDataStore();

  const features = useMemo(
    () => [...new Set(activityLogs.map((l) => l.feature).filter(Boolean))].sort(),
    [activityLogs]
  );

  const filtered = useMemo(() => {
    return activityLogs.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q || l.user.toLowerCase().includes(q) || l.detail.toLowerCase().includes(q);
      const logDate = l.created_at.split(' ')[0];
      const matchStart = !dateRange.start || logDate >= dateRange.start;
      const matchEnd = !dateRange.end || logDate <= dateRange.end;
      const matchFeature = feature === 'all' || l.feature === feature;
      return matchSearch && matchStart && matchEnd && matchFeature;
    });
  }, [activityLogs, search, dateRange, feature]);

  function reset() {
    setSearch('');
    setDateRange({ start: '', end: '' });
    setFeature('all');
  }

  return (
    <>
      <div className="header-bar">
        <h1>활동 로그</h1>
      </div>
      <div className="content-area">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>검색</label>
            <input
              type="text"
              placeholder="사용자명/내용"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '0.375rem 0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem', fontSize: '0.875rem', width: 150, background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* 기간 선택 — 달력 범위 피커 */}
          <div className="flex items-center gap-2">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>기간</label>
            <DateRangePicker
              startDate={dateRange.start}
              endDate={dateRange.end}
              onChange={(range) => setDateRange(range)}
            />
          </div>

          <div className="flex items-center gap-2">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>기능</label>
            <select
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              style={{ padding: '0.375rem 0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem', fontSize: '0.875rem', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            >
              <option value="all">전체</option>
              {features.map((f) => (
                <option key={f} value={f}>{FEATURE_LABEL[f] || f}</option>
              ))}
            </select>
          </div>

          <button
            onClick={reset}
            style={{ padding: '0.375rem 0.75rem', background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            초기화
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>일시</th>
                <th>사용자</th>
                <th>기능</th>
                <th>액션</th>
                <th>상세</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px 14px', color: 'var(--text-secondary)' }}>
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id}>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{l.created_at}</td>
                    <td>{l.user}</td>
                    <td>
                      <span className="badge" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                        {FEATURE_LABEL[l.feature] || l.feature}
                      </span>
                    </td>
                    <td>{l.action}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{l.detail}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
