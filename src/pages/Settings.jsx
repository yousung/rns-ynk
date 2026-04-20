import { useState } from 'react';
import { useUIStore } from '../store/useUIStore.js';
import { useAuthStore } from '../store/useAuthStore.js';

const FIELD_STYLE = {
  padding: '7px 10px',
  border: '1px solid var(--border)',
  borderRadius: 6,
  fontSize: '0.875rem',
  background: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  width: '100%',
  fontFamily: 'inherit',
};

export default function Settings() {
  const { theme, setTheme } = useUIStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    position: currentUser?.position || '',
    memo: currentUser?.memo || '',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState({ text: '', ok: false });

  function handleProfileSave() {
    updateUser(profile);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  function handlePwSave() {
    if (!pw.current) { setPwMsg({ text: '현재 비밀번호를 입력하세요.', ok: false }); return; }
    if (pw.next.length < 4) { setPwMsg({ text: '새 비밀번호는 4자 이상이어야 합니다.', ok: false }); return; }
    if (pw.next !== pw.confirm) { setPwMsg({ text: '새 비밀번호가 일치하지 않습니다.', ok: false }); return; }
    updateUser({ password: pw.next });
    setPw({ current: '', next: '', confirm: '' });
    setPwMsg({ text: '비밀번호가 변경되었습니다.', ok: true });
    setTimeout(() => setPwMsg({ text: '', ok: false }), 3000);
  }

  const cardStyle = {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: 20,
    maxWidth: 480,
  };
  const sectionTitle = { fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, color: 'var(--text-primary)' };
  const labelStyle = { fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 };

  return (
    <>
      <div className="header-bar">
        <h1>계정 설정</h1>
      </div>
      <div className="content-area" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24 }}>

        {/* 계정 정보 (읽기 전용) */}
        <div style={cardStyle}>
          <div style={sectionTitle}>계정 정보</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
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

        {/* 프로필 수정 */}
        <div style={cardStyle}>
          <div style={sectionTitle}>프로필 수정</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={labelStyle}>이름</div>
              <input
                style={FIELD_STYLE}
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                placeholder="이름 입력"
              />
            </div>
            <div>
              <div style={labelStyle}>연락처</div>
              <input
                style={FIELD_STYLE}
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                placeholder="010-0000-0000"
              />
            </div>
            <div>
              <div style={labelStyle}>직책</div>
              <input
                style={FIELD_STYLE}
                value={profile.position}
                onChange={(e) => setProfile((p) => ({ ...p, position: e.target.value }))}
                placeholder="직책 입력"
              />
            </div>
            <div>
              <div style={labelStyle}>메모</div>
              <textarea
                style={{ ...FIELD_STYLE, resize: 'vertical', minHeight: 72 }}
                value={profile.memo}
                onChange={(e) => setProfile((p) => ({ ...p, memo: e.target.value }))}
                placeholder="메모 입력"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="btn-primary" onClick={handleProfileSave}>저장</button>
              {profileSaved && <span style={{ fontSize: '0.8rem', color: 'var(--green)' }}>저장되었습니다.</span>}
            </div>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div style={cardStyle}>
          <div style={sectionTitle}>비밀번호 변경</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={labelStyle}>현재 비밀번호</div>
              <input
                style={FIELD_STYLE}
                type="password"
                value={pw.current}
                onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
                placeholder="현재 비밀번호"
              />
            </div>
            <div>
              <div style={labelStyle}>새 비밀번호</div>
              <input
                style={FIELD_STYLE}
                type="password"
                value={pw.next}
                onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
                placeholder="새 비밀번호 (4자 이상)"
              />
            </div>
            <div>
              <div style={labelStyle}>비밀번호 확인</div>
              <input
                style={FIELD_STYLE}
                type="password"
                value={pw.confirm}
                onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="새 비밀번호 재입력"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="btn-primary" onClick={handlePwSave}>변경</button>
              {pwMsg.text && (
                <span style={{ fontSize: '0.8rem', color: pwMsg.ok ? 'var(--green)' : 'var(--red)' }}>
                  {pwMsg.text}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 화면 설정 */}
        <div style={cardStyle}>
          <div style={sectionTitle}>화면 설정</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: 'var(--text-secondary)', width: 100 }}>테마</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {['dark', 'light'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    style={{
                      padding: '6px 16px', borderRadius: 6, border: '1px solid var(--border)',
                      cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit',
                      background: theme === t ? 'var(--cyan)' : 'var(--bg-surface)',
                      color: theme === t ? '#000' : 'var(--text-secondary)',
                    }}
                  >
                    {t === 'dark' ? '다크' : '라이트'}
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
