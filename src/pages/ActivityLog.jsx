import { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDataStore } from '../store/useDataStore.js';

const FEATURE_LABEL = {
  inbound: '입고',
  outbound: '출고',
  inventory: '재고',
  products: '상품',
  users: '사용자',
  settings: '설정',
};

function fmtDate(date) {
  if (!date) return '-';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

function toStr(date) {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

export default function ActivityLog() {
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [feature, setFeature] = useState('all');
  const { activityLogs } = useDataStore();

  const features = useMemo(
    () => [...new Set(activityLogs.map((l) => l.feature).filter(Boolean))].sort(),
    [activityLogs]
  );

  const filtered = useMemo(() => {
    const startStr = toStr(startDate);
    const endStr = toStr(endDate);
    return activityLogs.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q || l.user.toLowerCase().includes(q) || l.detail.toLowerCase().includes(q);
      const logDate = l.created_at.split(' ')[0];
      const matchStart = !startStr || logDate >= startStr;
      const matchEnd = !endStr || logDate <= endStr;
      const matchFeature = feature === 'all' || l.feature === feature;
      return matchSearch && matchStart && matchEnd && matchFeature;
    });
  }, [activityLogs, search, dateRange, feature]);

  function reset() {
    setSearch('');
    setDateRange([null, null]);
    setFeature('all');
  }

  return (
    <>
      <div className="header-bar">
        <h1>활동 로그</h1>
      </div>
      <div className="content-area" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* 필터 행 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>검색</label>
            <input
              type="text"
              placeholder="사용자명/내용"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '0.375rem 0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem', fontSize: '0.875rem', width: 150, background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

        {/* 날짜 범위 영역 */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* 시작일 / 종료일 카드 */}
            <div style={{
              display: 'flex',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              background: 'var(--bg-surface)',
            }}>
              <div style={{ padding: '0.5rem 1.25rem', flex: 1, borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>시작일</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: startDate ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {fmtDate(startDate)}
                </div>
              </div>
              <div style={{ padding: '0.5rem 1.25rem', flex: 1 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>종료일</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: endDate ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {fmtDate(endDate)}
                </div>
              </div>
            </div>

            {/* 인라인 달력 */}
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              inline
              monthsShown={1}
            />
          </div>

          {/* 테이블 */}
          <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
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
      </div>
    </>
  );
}
