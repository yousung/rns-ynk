import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [backdropVisible, setBackdropVisible] = useState(false);
  const closeTimerRef = useRef(null);

  function openSidebar() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setMobileOpen(true);
    setBackdropVisible(true);
  }

  function closeSidebar() {
    setMobileOpen(false);
    // backdrop은 사이드바 transition(0.25s) 완료 후 제거
    closeTimerRef.current = setTimeout(() => setBackdropVisible(false), 260);
  }

  useEffect(() => () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }, []);

  return (
    <div className="app-layout">
      {backdropVisible && (
        <div
          className={`sidebar-backdrop${mobileOpen ? '' : ' hiding'}`}
          onClick={closeSidebar}
        />
      )}
      <Sidebar mobileOpen={mobileOpen} onClose={closeSidebar} />
      <div className="main-area">
        <button
          className="hamburger-btn"
          style={{ position: 'absolute', top: 13, left: 14, zIndex: 10 }}
          onClick={openSidebar}
          aria-label="메뉴 열기"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <Outlet />
      </div>
    </div>
  );
}
