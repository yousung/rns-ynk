import React, { useState, useEffect, useRef } from 'react';
import '../../styles/kiosk.css';

const BT_STATES = [
  { cls: 'bt-connected', anim: 'anim-pulse', icon: '🔵', status: '전동랙 BT-001 연결됨',      sub: '-65dBm',              logType: 'success', logMsg: 'BT-001 신호 강도 정상 (-65dBm)' },
  { cls: 'bt-retrying',  anim: 'anim-blink', icon: '🟡', status: '재연결 시도 중... (3/5)',   sub: '마지막 실패: 신호 손실', logType: 'warn',    logMsg: 'BT-001 재연결 시도 중 (3/5)' },
  { cls: 'bt-failed',    anim: '',           icon: '🔴', status: '연결 실패 — 장치를 확인하세요', sub: 'E_BT_TIMEOUT',     logType: 'error',   logMsg: 'BT-001 연결 실패: E_BT_TIMEOUT' },
];

const INIT_LOGS = [
  { type: 'success', msg: '시스템 시작 완료' },
  { type: 'info',    msg: 'BT 스캔 시작' },
  { type: 'success', msg: 'BT-001 장치 발견' },
  { type: 'success', msg: 'BT-001 연결 성공' },
  { type: 'info',    msg: '재고 데이터 동기화 완료 (32건)' },
  { type: 'info',    msg: '입고 예정 불러오기 완료' },
  { type: 'success', msg: '서버 연결 정상 (192.168.1.1)' },
  { type: 'info',    msg: '화면 초기화 완료' },
  { type: 'info',    msg: '운영자 모드 활성화' },
  { type: 'success', msg: '키오스크 준비 완료' },
];

const RANDOM_LOGS = [
  { type: 'info',    msg: '하트비트 전송 완료' },
  { type: 'info',    msg: 'BT-001 신호 수신 정상' },
  { type: 'success', msg: '재고 동기화 완료' },
  { type: 'warn',    msg: 'BT 신호 약함 (-82dBm)' },
  { type: 'info',    msg: '서버 핑 응답: 4ms' },
  { type: 'success', msg: '전동랙 상태 정상' },
  { type: 'info',    msg: '세션 유지 중 (idle)' },
  { type: 'warn',    msg: '패킷 재전송 감지 (1회)' },
  { type: 'success', msg: 'NTP 동기화 완료' },
  { type: 'info',    msg: '화면 슬립 방지 갱신' },
];

function fmtTime(d) {
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(n => String(n).padStart(2, '0'))
    .join(':');
}

function fmtDate(d) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${days[d.getDay()]})`;
}

function fmtLogTime(d) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

export default function KioskPage() {
  const [theme, setTheme] = useState('light');
  const [now, setNow] = useState(new Date());
  const [btIdx, setBtIdx] = useState(0);
  const [logs, setLogs] = useState(() => {
    const t = new Date();
    return INIT_LOGS.map((l, i) => ({
      id: i,
      type: l.type,
      msg: l.msg,
      time: fmtLogTime(new Date(t - (INIT_LOGS.length - i) * 4000)),
    }));
  });
  const logIdRef = useRef(INIT_LOGS.length);
  const btTimeoutRef = useRef(null);

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    function scheduleLog() {
      const delay = 3000 + Math.random() * 2000;
      btTimeoutRef.current = setTimeout(() => {
        const bt = BT_STATES[btIdx];
        const rand = RANDOM_LOGS[Math.floor(Math.random() * RANDOM_LOGS.length)];
        const pick = Math.random() < 0.3 ? { type: bt.logType, msg: bt.logMsg } : rand;
        const id = logIdRef.current++;
        setLogs(prev => [{ id, type: pick.type, msg: pick.msg, time: fmtLogTime(new Date()) }, ...prev].slice(0, 50));
        scheduleLog();
      }, delay);
    }
    scheduleLog();
    return () => clearTimeout(btTimeoutRef.current);
  }, [btIdx]);

  useEffect(() => {
    const btCycle = setInterval(() => {
      setBtIdx(i => (i + 1) % BT_STATES.length);
    }, 6000);
    return () => clearInterval(btCycle);
  }, []);

  const bt = BT_STATES[btIdx];

  return (
    <div className="k-root" data-theme={theme}>
      <button
        className="k-theme-btn"
        onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        title={theme === 'light' ? '다크 모드' : '라이트 모드'}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* 헤더 */}
      <div className="k-header">
        <div className="k-header-logo">WMS</div>
        <div className="k-header-title">창고 관리 시스템 — 키오스크</div>
        <div className="k-header-badge">KIOSK</div>
      </div>

      {/* 메인 */}
      <div className="k-main">
        {/* 왼쪽 */}
        <div className="k-left">
          {/* 시계 */}
          <div className="k-clock-card">
            <div className="k-clock-time">{fmtTime(now)}</div>
            <div className="k-clock-date">{fmtDate(now)}</div>
          </div>

          {/* QR */}
          <div className="k-qr-card">
            <div className="k-qr-label">모바일 연동 QR</div>
            <div className="k-qr-box">
              <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="120" fill="white"/>
                {/* QR 코드 장식용 패턴 */}
                <rect x="4"  y="4"  width="40" height="40" fill="none" stroke="#1E293B" strokeWidth="4"/>
                <rect x="12" y="12" width="24" height="24" fill="#1E293B"/>
                <rect x="76" y="4"  width="40" height="40" fill="none" stroke="#1E293B" strokeWidth="4"/>
                <rect x="84" y="12" width="24" height="24" fill="#1E293B"/>
                <rect x="4"  y="76" width="40" height="40" fill="none" stroke="#1E293B" strokeWidth="4"/>
                <rect x="12" y="84" width="24" height="24" fill="#1E293B"/>
                {/* 중앙 패턴 */}
                <rect x="50" y="4"  width="6" height="6"  fill="#1E293B"/>
                <rect x="60" y="4"  width="6" height="6"  fill="#1E293B"/>
                <rect x="50" y="14" width="6" height="6"  fill="#1E293B"/>
                <rect x="64" y="14" width="6" height="6"  fill="#1E293B"/>
                <rect x="50" y="24" width="6" height="6"  fill="#1E293B"/>
                <rect x="58" y="24" width="6" height="6"  fill="#1E293B"/>
                <rect x="4"  y="50" width="6" height="6"  fill="#1E293B"/>
                <rect x="14" y="50" width="6" height="6"  fill="#1E293B"/>
                <rect x="24" y="50" width="6" height="6"  fill="#1E293B"/>
                <rect x="34" y="50" width="6" height="6"  fill="#1E293B"/>
                <rect x="4"  y="60" width="6" height="6"  fill="#1E293B"/>
                <rect x="18" y="60" width="6" height="6"  fill="#1E293B"/>
                <rect x="30" y="60" width="6" height="6"  fill="#1E293B"/>
                <rect x="76" y="50" width="6" height="6"  fill="#1E293B"/>
                <rect x="86" y="50" width="6" height="6"  fill="#1E293B"/>
                <rect x="96" y="50" width="6" height="6"  fill="#1E293B"/>
                <rect x="106" y="50" width="6" height="6" fill="#1E293B"/>
                <rect x="50" y="76" width="6" height="6"  fill="#1E293B"/>
                <rect x="60" y="76" width="6" height="6"  fill="#1E293B"/>
                <rect x="70" y="76" width="6" height="6"  fill="#1E293B"/>
                <rect x="50" y="86" width="6" height="6"  fill="#1E293B"/>
                <rect x="64" y="86" width="6" height="6"  fill="#1E293B"/>
                <rect x="54" y="96" width="6" height="6"  fill="#1E293B"/>
                <rect x="68" y="96" width="6" height="6"  fill="#1E293B"/>
                {/* 중앙 십자 */}
                <rect x="56" y="50" width="8" height="8"  fill="#0284C7"/>
                <rect x="50" y="56" width="8" height="8"  fill="#0284C7"/>
                <rect x="62" y="56" width="8" height="8"  fill="#0284C7"/>
                <rect x="56" y="62" width="8" height="8"  fill="#0284C7"/>
              </svg>
            </div>
            <div className="k-qr-hint">스캔하여 모바일 앱 연동</div>
          </div>

          {/* IP */}
          <div className="k-ip-card">
            <span className="k-ip-label">서버 주소</span>
            <span className="k-ip-value">192.168.1.100:8080</span>
          </div>
        </div>

        {/* 오른쪽 */}
        <div className="k-right">
          {/* BT 상태 */}
          <div className="k-bt-card">
            <div className="k-bt-card-title">블루투스 연결 상태</div>
            <div className="k-bt-row">
              <div className={`k-bt-icon ${bt.cls}${bt.anim ? ' ' + bt.anim : ''}`}>
                {bt.icon}
              </div>
              <div className="k-bt-info">
                <div className="k-bt-status">{bt.status}</div>
                <div className="k-bt-sub">{bt.sub}</div>
              </div>
            </div>
          </div>

          {/* 활동 로그 */}
          <div className="k-log-card">
            <div className="k-log-title">시스템 활동 로그</div>
            <div className="k-log-list">
              {logs.map(l => (
                <div key={l.id} className="k-log-item">
                  <div className={`k-log-dot ${l.type}`} />
                  <div className="k-log-msg">{l.msg}</div>
                  <div className="k-log-time">{l.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div className="k-footer">
        <span>v1.0.0-demo</span>
        <span>빌드: 2026-04-20</span>
        <span>내부망 전용</span>
      </div>
    </div>
  );
}
