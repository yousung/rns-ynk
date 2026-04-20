(function () {
  document.documentElement.setAttribute('data-theme', localStorage.getItem('wms_theme') || 'dark');
})();

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('wms_user')); } catch { return null; }
}
function requireAuth() {
  if (!getCurrentUser()) window.location.href = '../../login.html';
}
function logout() {
  localStorage.removeItem('wms_user');
  window.location.href = '../../login.html';
}
function getRoleText(role) {
  return { developer: '개발자', super_admin: '슈퍼관리자', admin: '관리자', user: '사용자' }[role] || role;
}
function getTheme() { return localStorage.getItem('wms_theme') || 'dark'; }
function setTheme(theme) {
  localStorage.setItem('wms_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}
function getWarehouseType() { return localStorage.getItem('wms_warehouse_type') || 'd'; }
function setWarehouseType(type) { localStorage.setItem('wms_warehouse_type', type); }

function switchWarehouseType(type, menu) {
  setWarehouseType(type);
  const typedMenus = ['inbound-execute', 'outbound-execute', 'inventory'];
  if (!typedMenus.includes(menu)) {
    renderLayout(menu);
    if (typeof window.__onWhTypeChange === 'function') window.__onWhTypeChange();
    return;
  }
  if (menu === 'inventory' && (type === 'a' || type === 'b')) {
    window.location.href = '../../inventory.html';
  } else {
    window.location.href = `../type-${type}/${menu}.html`;
  }
}

function isSidebarSlim() { return localStorage.getItem('wms_sidebar_slim') === 'true'; }
function toggleSidebar() {
  const slim = !isSidebarSlim();
  localStorage.setItem('wms_sidebar_slim', String(slim));
  document.getElementById('sidebar').classList.toggle('slim', slim);
  const btn = document.getElementById('sidebarToggleBtn');
  if (btn) btn.innerHTML = slim ? _ICON_CHEVRON_R : _ICON_CHEVRON_L;
}

const _ICON_CHEVRON_L = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px"><polyline points="15 18 9 12 15 6"/></svg>`;
const _ICON_CHEVRON_R = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px"><polyline points="9 18 15 12 9 6"/></svg>`;

const _MENU_ICONS = {
  'inbound-schedule':  `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="8 14 12 18 16 14"/></svg>`,
  'inbound-execute':   `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  'outbound-schedule': `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="16 18 12 14 8 18"/></svg>`,
  'outbound-execute':  `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  'inventory':         `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8L6 7h12z"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/></svg>`,
  'products':          `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1" fill="currentColor"/></svg>`,
  'activity-log':      `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  'users':             `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  'settings':          `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
  'logout':            `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
};

function renderLayout(activeMenu) {
  const user = getCurrentUser();
  const slim = isSidebarSlim();
  const menuItems = [
    { key: 'inbound-schedule',  label: '입고 예정',   href: '../../inbound-schedule.html' },
    { key: 'inbound-execute',   label: '입고 처리',   href: 'inbound-execute.html' },
    { key: 'outbound-schedule', label: '출고 예정',   href: '../../outbound-schedule.html' },
    { key: 'outbound-execute',  label: '출고 처리',   href: 'outbound-execute.html' },
    { key: 'inventory',         label: '재고 리스트', href: 'inventory.html' },
    { key: 'products',          label: '상품 리스트', href: '../../products.html' },
    { key: 'activity-log',      label: '활동 로그',   href: '../../activity-log.html' },
    { key: 'users',             label: '사용자 관리', href: '../../users.html' },
  ];

  const nav = menuItems.map(item => `
    <a href="${item.href}" class="nav-item ${item.key === activeMenu ? 'active' : ''}" title="${item.label}">
      ${_MENU_ICONS[item.key] || ''}
      <span class="nav-label">${item.label}</span>
    </a>
  `).join('');

  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <span class="sidebar-brand-title">창고 관리</span>
        <span class="sidebar-brand-user">${user ? user.name : ''}</span>
      </div>
      <button id="sidebarToggleBtn" class="sidebar-toggle-btn" onclick="toggleSidebar()" title="사이드바 접기/펼치기">
        ${slim ? _ICON_CHEVRON_R : _ICON_CHEVRON_L}
      </button>
    </div>
    <nav class="flex-1 overflow-y-auto py-2">
      ${nav}
    </nav>
    <div class="sidebar-wh-type">
      <span class="nav-label" style="font-size:0.72rem;color:var(--text-secondary);padding:0 4px;">창고 타입</span>
      <div class="wh-type-btns">
        ${['a','b','c','d','e'].map(t=>`<button class="wh-type-btn ${getWarehouseType()===t?'active':''}" onclick="switchWarehouseType('${t}','${activeMenu}')">${t.toUpperCase()}</button>`).join('')}
      </div>
    </div>
    <div class="sidebar-footer">
      <a href="../../settings.html" class="nav-item ${activeMenu === 'settings' ? 'active' : ''}" title="계정 설정">
        ${_MENU_ICONS['settings']}
        <span class="nav-label">계정 설정</span>
      </a>
      <button class="sidebar-logout-btn" onclick="logout()" title="로그아웃">
        ${_MENU_ICONS['logout']}
        <span class="nav-label">로그아웃</span>
      </button>
    </div>
  `;
  if (slim) document.getElementById('sidebar').classList.add('slim');
}

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
      width:240px;flex-shrink:0;display:flex;flex-direction:column;transition:width 0.2s ease;overflow:hidden;}
    .sidebar.slim{width:56px;}
    .sidebar-header{display:flex;align-items:center;justify-content:space-between;
      padding:14px 16px;border-bottom:1px solid var(--border);min-height:62px;flex-shrink:0;}
    .sidebar.slim .sidebar-header{justify-content:center;padding:14px 8px;}
    .sidebar-brand{display:flex;flex-direction:column;gap:2px;overflow:hidden;flex:1;min-width:0;}
    .sidebar.slim .sidebar-brand{display:none;}
    .sidebar-brand-title{font-size:1rem;font-weight:700;color:var(--cyan);text-shadow:0 0 8px rgba(0,212,255,0.6);white-space:nowrap;}
    .sidebar-brand-user{font-size:0.75rem;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .sidebar-toggle-btn{display:flex;align-items:center;justify-content:center;
      width:26px;height:26px;border-radius:5px;background:var(--bg-surface);
      border:1px solid var(--border);color:var(--text-secondary);cursor:pointer;
      flex-shrink:0;transition:all 0.15s;padding:0;}
    .sidebar-toggle-btn:hover{border-color:var(--border-bright);color:var(--text-primary);}
    .nav-icon{width:18px;height:18px;flex-shrink:0;}
    a.nav-item{display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:0.875rem;
      color:var(--text-secondary);cursor:pointer;transition:all 0.15s;
      border-left:3px solid transparent;text-decoration:none;white-space:nowrap;overflow:hidden;}
    a.nav-item:hover{background:var(--bg-hover);color:var(--text-primary);}
    a.nav-item.active{background:var(--cyan-dim);color:var(--cyan);border-left-color:var(--cyan);}
    .sidebar.slim a.nav-item{justify-content:center;padding:11px 0;border-left:3px solid transparent;}
    .sidebar.slim a.nav-item.active{background:var(--cyan-dim);color:var(--cyan);border-left-color:var(--cyan) !important;}
    .nav-label{transition:opacity 0.1s;}
    .sidebar.slim .nav-label{display:none;}
    .sidebar-wh-type{padding:8px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);}
    .sidebar.slim .sidebar-wh-type{justify-content:center;}
    .sidebar.slim .sidebar-wh-type .nav-label{display:none;}
    .wh-type-btns{display:flex;gap:3px;}
    .wh-type-btn{padding:2px 7px;border-radius:4px;font-size:0.72rem;font-weight:700;cursor:pointer;border:1px solid var(--border);background:var(--bg-surface);color:var(--text-secondary);transition:all 0.15s;font-family:inherit;}
    .wh-type-btn.active{background:var(--cyan);color:#000;border-color:var(--cyan);}
    .sidebar-footer{border-top:1px solid var(--border);display:flex;flex-direction:column;gap:2px;padding:8px;flex-shrink:0;}
    .sidebar-logout-btn{display:flex;align-items:center;gap:10px;padding:9px 8px;border-radius:6px;
      font-size:0.875rem;color:var(--text-secondary);cursor:pointer;background:transparent;
      border:none;width:100%;transition:all 0.15s;white-space:nowrap;overflow:hidden;font-family:inherit;}
    .sidebar-logout-btn:hover{background:var(--red-dim);color:var(--red);}
    .sidebar.slim .sidebar-logout-btn{justify-content:center;padding:11px 0;}
    .sidebar.slim .sidebar-footer .nav-label{display:none;}
    .main-area{flex:1;display:flex;flex-direction:column;overflow:hidden;}
    .header-bar{padding:16px 24px;border-bottom:1px solid var(--border);background:var(--bg-panel);
      display:flex;align-items:center;gap:12px;}
    .header-bar h1{font-size:1.125rem;font-weight:700;color:var(--text-primary);}
    .content-area{flex:1;overflow-y:auto;padding:24px;}
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
    [data-theme="light"] .sidebar { background:linear-gradient(180deg,#FFFFFF 0%,#F1F5F9 100%); }
    [data-theme="light"] .header-bar { background:var(--bg-panel); }
    [data-theme="light"] a.nav-item.active { background:var(--cyan-dim); color:var(--cyan); border-left-color:var(--cyan); }
    [data-theme="light"] input,[data-theme="light"] select { background:var(--bg-surface); color:var(--text-primary); }
    [data-theme="light"] th { background:var(--bg-surface); }
    [data-theme="light"] tr:hover td { background:var(--bg-hover); }
  `;
}
