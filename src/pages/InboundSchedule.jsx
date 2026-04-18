import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore.js';

const FILTERS = [
  { label: '전체', value: 'all' },
  { label: '대기', value: 'pending' },
  { label: '완료', value: 'done' },
  { label: '취소', value: 'cancelled' },
];

const STATUS_LABEL = { pending: '대기', done: '완료', cancelled: '취소' };

export default function InboundSchedule() {
  const [filter, setFilter] = useState('all');
  const { inboundSchedules, products } = useDataStore();
  const navigate = useNavigate();

  const filtered =
    filter === 'all' ? inboundSchedules : inboundSchedules.filter((s) => s.status === filter);

  return (
    <>
      <div className="header-bar">
        <h1>입고 예정</h1>
        <button className="btn-primary" style={{ marginLeft: 'auto' }} onClick={() => alert('데모: 등록 기능은 준비 중입니다.')}>
          + 예정 등록
        </button>
      </div>
      <div className="content-area">
        <div className="mb-4 flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`filter-btn${filter === f.value ? ' active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>상품명</th>
                <th>수량</th>
                <th>예정일</th>
                <th>상태</th>
                <th>비고</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const product = products.find((p) => p.id === s.product_id);
                return (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{product?.name}</td>
                    <td>{s.quantity}개</td>
                    <td>{s.scheduled_date}</td>
                    <td>
                      <span className={`badge badge-${s.status}`}>{STATUS_LABEL[s.status]}</span>
                    </td>
                    <td>{s.note || '-'}</td>
                    <td>
                      <button
                        className="btn-primary"
                        style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                        onClick={() => navigate('/inbound-execute')}
                      >
                        처리
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
