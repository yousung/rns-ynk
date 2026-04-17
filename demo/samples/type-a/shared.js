// ============================================================
// 창고 관리 시스템 - 공유 유틸리티
// ============================================================

// FOUC 방지: 페이지 로드 전에 테마 설정
(function () {
  document.documentElement.setAttribute('data-theme', localStorage.getItem('wms_theme') || 'dark');
})();

// 인증
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('wms_user'));
  } catch { return null; }
}

function requireAuth() {
  if (!getCurrentUser()) {
    window.location.href = '../../index.html';
  }
}

function logout() {
  localStorage.removeItem('wms_user');
  window.location.href = '../../index.html';
}

function getRoleText(role) {
  return { developer: '개발자', super_admin: '슈퍼관리자', admin: '관리자', user: '사용자' }[role] || role;
}

// 테마 함수
function getTheme() {
  return localStorage.getItem('wms_theme') || 'dark';
}

function setTheme(theme) {
  localStorage.setItem('wms_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}

// 사이드바 + 헤더 렌더링
function renderLayout(activeMenu) {
  const user = getCurrentUser();
  const menuItems = [
    { key: 'inbound-schedule',  label: '입고 예정',   href: '../../inbound-schedule.html' },
    { key: 'inbound-execute',   label: '입고 처리',   href: 'inbound-execute.html' },
    { key: 'outbound-schedule', label: '출고 예정',   href: '../../outbound-schedule.html' },
    { key: 'outbound-execute',  label: '출고 처리',   href: 'outbound-execute.html' },
    { key: 'inventory',         label: '재고 리스트', href: '../../inventory.html' },
    { key: 'products',          label: '상품 리스트', href: '../../products.html' },
    { key: 'activity-log',      label: '활동 로그',   href: '../../activity-log.html' },
    { key: 'users',             label: '사용자 관리', href: '../../users.html' },
  ];

  const nav = menuItems.map(item => `
    <a href="${item.href}" class="nav-item ${item.key === activeMenu ? 'active' : ''}">${item.label}</a>
  `).join('');

  document.getElementById('sidebar').innerHTML = `
    <div style="padding:16px;border-bottom:1px solid var(--border);">
      <h2 class="text-lg font-bold" style="color:var(--cyan);text-shadow:0 0 8px rgba(0,212,255,0.6);">창고 관리</h2>
      <p class="text-xs mt-1" style="color:var(--text-secondary);">${user ? user.name : ''}</p>
    </div>
    <nav class="flex-1 overflow-y-auto py-2">
      ${nav}
    </nav>
    <div style="border-top:1px solid var(--border);display:flex;flex-direction:column;gap:6px;padding:16px;">
      <a href="../../settings.html" class="nav-item ${activeMenu === 'settings' ? 'active' : ''}" style="border-radius:6px;padding:9px 14px;">⚙ 계정 설정</a>
      <button class="btn-secondary w-full text-sm" onclick="logout()">로그아웃</button>
    </div>
  `;
}

// 공통 CSS 반환
function getCommonStyles() {
  return `
    :root {
      --bg-base:#070C14; --bg-panel:#0D1626; --bg-surface:#132035; --bg-hover:#1A2D47;
      --border:#1E3A5F; --border-bright:#2D5A8E;
      --cyan:#00D4FF; --cyan-dim:rgba(0,212,255,0.15); --cyan-glow:0 0 12px rgba(0,212,255,0.5);
      --amber:#F59E0B; --amber-dim:rgba(245,158,11,0.15);
      --red:#EF4444; --red-dim:rgba(239,68,68,0.15);
      --green:#10B981; --green-dim:rgba(16,185,129,0.15);
      --text-primary:#E8F0FE; --text-secondary:#7B91AD; --text-accent:#00D4FF;
    }
    *{word-break:keep-all;}
    body{font-family:'Noto Sans KR',sans-serif;background-color:var(--bg-base);
      background-image:linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);
      background-size:40px 40px;color:var(--text-primary);display:flex;flex-direction:column;min-height:100vh;}
    .app-layout{display:flex;flex:1;min-height:0;height:100vh;}
    .sidebar{background:linear-gradient(180deg,#0D1626 0%,#070C14 100%);border-right:1px solid var(--border);
      width:240px;flex-shrink:0;display:flex;flex-direction:column;}
    .main-area{flex:1;display:flex;flex-direction:column;overflow:hidden;}
    .header-bar{padding:16px 24px;border-bottom:1px solid var(--border);background:var(--bg-panel);
      display:flex;align-items:center;gap:12px;}
    .header-bar h1{font-size:1.125rem;font-weight:700;color:var(--text-primary);}
    .content-area{flex:1;overflow-y:auto;padding:24px;}
    a.nav-item{display:block;padding:10px 16px;font-size:0.875rem;color:var(--text-secondary);
      cursor:pointer;transition:all 0.15s;border-left:3px solid transparent;text-decoration:none;}
    a.nav-item:hover{background:var(--bg-hover);color:var(--text-primary);}
    a.nav-item.active{background:var(--cyan-dim);color:var(--cyan);border-left-color:var(--cyan);}
    .card{background:var(--bg-panel);border:1px solid var(--border);border-radius:8px;padding:20px;}
    input,select{background:var(--bg-surface);border:1px solid var(--border);border-radius:6px;
      padding:8px 12px;color:var(--text-primary);font-size:0.875rem;width:100%;}
    input:focus,select:focus{outline:none;border-color:var(--cyan);box-shadow:0 0 0 2px rgba(0,212,255,0.15);}
    table{width:100%;border-collapse:collapse;}
    th{background:var(--bg-surface);padding:10px 14px;text-align:left;font-size:0.8rem;
      font-weight:600;color:var(--text-secondary);border-bottom:1px solid var(--border);}
    td{padding:10px 14px;border-bottom:1px solid var(--border);font-size:0.875rem;}
    tr:hover td{background:var(--bg-hover);}
    .btn-primary{background:var(--cyan);color:#000;padding:8px 16px;border-radius:6px;font-weight:600;
      font-size:0.875rem;cursor:pointer;border:none;transition:all 0.2s;}
    .btn-primary:hover{background:#00b8d9;box-shadow:0 0 12px rgba(0,212,255,0.4);}
    .btn-secondary{background:var(--bg-surface);color:var(--text-secondary);padding:8px 16px;
      border-radius:6px;font-size:0.875rem;cursor:pointer;border:1px solid var(--border);transition:all 0.2s;}
    .btn-secondary:hover{border-color:var(--border-bright);color:var(--text-primary);}
    .btn-success{background:var(--green);color:#000;padding:8px 16px;border-radius:6px;font-weight:600;
      font-size:0.875rem;cursor:pointer;border:none;}
    .badge{padding:3px 8px;border-radius:4px;font-size:0.75rem;font-weight:600;font-family:'JetBrains Mono',monospace;}
    .badge-pending{background:var(--amber-dim);color:var(--amber);}
    .badge-done{background:var(--green-dim);color:var(--green);}
    .badge-cancelled{background:var(--red-dim);color:var(--red);}
    ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:var(--bg-base);}
    ::-webkit-scrollbar-thumb{background:var(--border-bright);border-radius:2px;}
    .ab-tabs{display:flex;gap:4px;margin-left:16px;border-left:1px solid var(--border);padding-left:16px;}
    .ab-tab{padding:3px 12px;border-radius:4px;font-size:0.78rem;font-weight:600;cursor:pointer;border:1px solid var(--border);background:var(--bg-surface);color:var(--text-secondary);text-decoration:none;transition:all 0.15s;}
    .ab-tab.active{background:var(--cyan-dim);color:var(--cyan);border-color:var(--cyan);cursor:default;}
    .ab-tab:not(.active):hover{border-color:var(--border-bright);color:var(--text-primary);}
    /* ── 라이트 테마 ── */
    [data-theme="light"] {
      --bg-base:#F0F4F8; --bg-panel:#FFFFFF; --bg-surface:#F1F5F9; --bg-hover:#E2E8F0;
      --border:#CBD5E1; --border-bright:#94A3B8;
      --cyan:#0284C7; --cyan-dim:rgba(2,132,199,0.12); --cyan-glow:0 0 12px rgba(2,132,199,0.3);
      --text-primary:#1E293B; --text-secondary:#64748B; --text-accent:#0284C7;
    }
    [data-theme="light"] body {
      background-color:var(--bg-base);
      background-image:linear-gradient(rgba(0,0,0,0.04) 1px,transparent 1px),
        linear-gradient(90deg,rgba(0,0,0,0.04) 1px,transparent 1px);
      background-size:40px 40px;
    }
    [data-theme="light"] .sidebar {
      background:linear-gradient(180deg,#FFFFFF 0%,#F1F5F9 100%);
    }
    [data-theme="light"] .header-bar { background:var(--bg-panel); }
    [data-theme="light"] a.nav-item.active { background:var(--cyan-dim); color:var(--cyan); border-left-color:var(--cyan); }
    [data-theme="light"] input,[data-theme="light"] select { background:var(--bg-surface); color:var(--text-primary); }
    [data-theme="light"] th { background:var(--bg-surface); }
    [data-theme="light"] tr:hover td { background:var(--bg-hover); }
  `;
}
