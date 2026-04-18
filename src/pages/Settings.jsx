import { useUIStore } from '../store/useUIStore.js';
import { useAuthStore } from '../store/useAuthStore.js';

export default function Settings() {
  const { theme, setTheme, warehouseType, setWarehouseType } = useUIStore();
  const currentUser = useAuthStore((s) => s.currentUser);

  return (
    <>
      <div className="header-bar">
        <h1>설정</h1>
      </div>
      <div className="content-area" style={{ padding: '24px', gap: '24px' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 20, maxWidth: 480 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, color: 'var(--text-primary)' }}>계정 정보</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: 'var(--text-secondary)', width: 80 }}>이름</span>
              <span>{currentUser?.name || '-'}</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: 'var(--text-secondary)', width: 80 }}>이메일</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{currentUser?.email || '-'}</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: 'var(--text-secondary)', width: 80 }}>역할</span>
              <span>{currentUser?.role || '-'}</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 20, maxWidth: 480 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, color: 'var(--text-primary)' }}>화면 설정</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: 'var(--text-secondary)', width: 100 }}>테마</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {['dark', 'light'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      background: theme === t ? 'var(--cyan)' : 'var(--bg-surface)',
                      color: theme === t ? '#000' : 'var(--text-secondary)',
                    }}
                  >
                    {t === 'dark' ? '다크' : '라이트'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: 'var(--text-secondary)', width: 100 }}>창고 타입</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {['a', 'b'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setWarehouseType(t)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      background: warehouseType === t ? 'var(--cyan)' : 'var(--bg-surface)',
                      color: warehouseType === t ? '#000' : 'var(--text-secondary)',
                    }}
                  >
                    Type {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
