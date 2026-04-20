import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import { useDataStore } from '../store/useDataStore.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);
  const users = useDataStore((s) => s.users);
  const navigate = useNavigate();

  function handleLogin() {
    if (!email.trim()) {
      setError('이메일을 입력하세요.');
      return;
    }
    const user = users.find((u) => u.email === email) || users[1];
    login(user);
    navigate('/app/dashboard');
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleLogin();
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-title">창고 관리 시스템</div>
        <div className="login-sub">Warehouse Management System</div>
        <div className="login-field">
          <label>이메일</label>
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>
        <div className="login-field">
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>
        <button className="btn-login" onClick={handleLogin}>
          로그인
        </button>
        <div className="login-hint">데모용: 아무 값이나 입력 후 로그인</div>
        {error && <div className="login-error">{error}</div>}
      </div>
    </div>
  );
}
