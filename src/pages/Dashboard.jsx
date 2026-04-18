import { useMemo } from 'react';
import { useDataStore } from '../store/useDataStore.js';

const FEATURE_LABEL = {
  inbound: '입고', outbound: '출고', inventory: '재고',
  products: '상품', users: '사용자', settings: '설정',
};

function KpiCard({ label, value, unit, color, sub }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '20px 24px', flex: 1, minWidth: 160,
    }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color, lineHeight: 1 }}>
        {value.toLocaleString()}<span style={{ fontSize: '0.9rem', marginLeft: 4, fontWeight: 400, color: 'var(--text-secondary)' }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { inventoryItems, inboundSchedules, outboundSchedules, products, pallets, racks, activityLogs } = useDataStore();

  const totalStock = useMemo(
    () => inventoryItems.reduce((s, i) => s + i.quantity, 0),
    [inventoryItems]
  );

  const inboundPending = useMemo(
    () => inboundSchedules.filter((s) => s.status === 'pending'),
    [inboundSchedules]
  );

  const outboundPending = useMemo(
    () => outboundSchedules.filter((s) => s.status === 'pending'),
    [outboundSchedules]
  );

  const totalSlots = useMemo(
    () => racks.reduce((s, r) => s + r.floors * r.groups, 0),
    [racks]
  );

  const usageRate = totalSlots > 0 ? Math.round((pallets.length / totalSlots) * 100) : 0;

  const recentLogs = useMemo(() => activityLogs.slice(0, 8), [activityLogs]);

  return (
    <>
      <div className="header-bar">
        <h1>대시보드</h1>
      </div>
      <div className="content-area" style={{ overflowY: 'auto' }}>

        {/* KPI 카드 */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          <KpiCard
            label="총 재고 수량"
            value={totalStock}
            unit="개"
            color="var(--cyan)"
            sub={`팔레트 ${pallets.length}개 사용 중`}
          />
          <KpiCard
            label="입고 예정"
            value={inboundPending.length}
            unit="건"
            color="var(--amber)"
            sub={`${inboundPending.reduce((s, x) => s + x.quantity, 0).toLocaleString()}개 예정`}
          />
          <KpiCard
            label="출고 예정"
            value={outboundPending.length}
            unit="건"
            color="var(--red)"
            sub={`${outboundPending.reduce((s, x) => s + x.quantity, 0).toLocaleString()}개 예정`}
          />
          <KpiCard
            label="등록 상품"
            value={products.length}
            unit="종"
            color="var(--text-primary)"
            sub={`${[...new Set(products.map((p) => p.category))].length}개 카테고리`}
          />
          <KpiCard
            label="창고 가동률"
            value={usageRate}
            unit="%"
            color={usageRate > 80 ? 'var(--red)' : usageRate > 60 ? 'var(--amber)' : 'var(--cyan)'}
            sub={`${pallets.length} / ${totalSlots} PLT`}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {/* 입고 예정 */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: '0.875rem' }}>
              입고 예정
            </div>
            <table>
              <thead>
                <tr>
                  <th>상품</th>
                  <th>수량</th>
                  <th>예정일</th>
                </tr>
              </thead>
              <tbody>
                {inboundPending.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 14px' }}>없음</td></tr>
                ) : inboundPending.map((s) => {
                  const p = products.find((x) => x.id === s.product_id);
                  return (
                    <tr key={s.id}>
                      <td>{p?.name ?? '-'}</td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.quantity.toLocaleString()}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{s.scheduled_date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 출고 예정 */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: '0.875rem' }}>
              출고 예정
            </div>
            <table>
              <thead>
                <tr>
                  <th>상품</th>
                  <th>수량</th>
                  <th>예정일</th>
                </tr>
              </thead>
              <tbody>
                {outboundPending.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 14px' }}>없음</td></tr>
                ) : outboundPending.map((s) => {
                  const p = products.find((x) => x.id === s.product_id);
                  return (
                    <tr key={s.id}>
                      <td>{p?.name ?? '-'}</td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.quantity.toLocaleString()}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{s.scheduled_date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 최근 활동 로그 */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: '0.875rem' }}>
            최근 활동
          </div>
          <table>
            <thead>
              <tr>
                <th>일시</th>
                <th>사용자</th>
                <th>기능</th>
                <th>내용</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{l.created_at}</td>
                  <td>{l.user}</td>
                  <td>
                    <span className="badge" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                      {FEATURE_LABEL[l.feature] || l.feature}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{l.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
