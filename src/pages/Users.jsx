import { useState } from 'react';
import { useDataStore } from '../store/useDataStore.js';

const ROLE_TEXT = {
  admin: '관리자',
  manager: '매니저',
  warehouse_staff: '창고직원',
  viewer: '뷰어',
};

export default function Users() {
  const { users } = useDataStore();
  const [userData, setUserData] = useState(() => [...users]);

  function toggleApprove(id) {
    setUserData((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_approved: !u.is_approved } : u))
    );
  }

  return (
    <>
      <div className="header-bar">
        <h1>사용자 관리</h1>
        <button className="btn-primary" style={{ marginLeft: 'auto' }} onClick={() => alert('데모: 등록 기능은 준비 중입니다.')}>
          + 사용자 등록
        </button>
      </div>
      <div className="content-area">
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>역할</th>
                <th>상태</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>{u.email}</td>
                  <td>
                    <span className={`badge role-${u.role.replace('_', '-')}`}>
                      {ROLE_TEXT[u.role] || u.role}
                    </span>
                  </td>
                  <td>
                    {u.is_approved ? (
                      <span style={{ color: 'var(--green)', fontSize: '0.875rem', fontWeight: 500 }}>승인됨</span>
                    ) : (
                      <span style={{ color: 'var(--red)', fontSize: '0.875rem', fontWeight: 500 }}>대기중</span>
                    )}
                  </td>
                  <td>
                    {u.is_approved ? (
                      <button
                        style={{ color: 'var(--red)', fontSize: '0.875rem', cursor: 'pointer', background: 'none', border: 'none' }}
                        onClick={() => toggleApprove(u.id)}
                      >
                        거부
                      </button>
                    ) : (
                      <button
                        className="btn-primary"
                        style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                        onClick={() => toggleApprove(u.id)}
                      >
                        승인
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
