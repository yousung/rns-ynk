import { useState, useMemo } from 'react';
import { useDataStore } from '../store/useDataStore.js';

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { products, inventoryItems } = useDataStore();

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchCat = !category || p.category === category;
      return matchSearch && matchCat;
    });
  }, [products, search, category]);

  function reset() {
    setSearch('');
    setCategory('');
  }

  return (
    <>
      <div className="header-bar">
        <h1>상품 관리</h1>
        <button className="btn-primary" style={{ marginLeft: 'auto' }} onClick={() => alert('데모: 등록 기능은 준비 중입니다.')}>
          + 상품 등록
        </button>
      </div>
      <div className="content-area">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>검색:</label>
            <input
              type="text"
              placeholder="상품명/코드"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '0.375rem 0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem', fontSize: '0.875rem', width: 150, background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>분류:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: '0.375rem 0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem', fontSize: '0.875rem', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            >
              <option value="">전체</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button
            onClick={reset}
            style={{ padding: '0.375rem 0.75rem', background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            초기화
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>상품코드</th>
                <th>상품명</th>
                <th>분류</th>
                <th>등록일</th>
                <th>현재 재고</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 14px', color: 'var(--text-secondary)' }}>
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const total = inventoryItems
                    .filter((i) => i.product_id === p.id)
                    .reduce((s, i) => s + i.quantity, 0);
                  return (
                    <tr key={p.id}>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.code}</td>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>{p.created_at}</td>
                      <td>{total}개</td>
                      <td>
                        <button style={{ color: 'var(--cyan)', fontSize: '0.875rem', marginRight: 8, cursor: 'pointer', background: 'none', border: 'none' }} onClick={() => alert('데모: 수정 기능 준비 중')}>수정</button>
                        <button style={{ color: 'var(--red)', fontSize: '0.875rem', cursor: 'pointer', background: 'none', border: 'none' }} onClick={() => alert('데모: 삭제 기능 준비 중')}>삭제</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
