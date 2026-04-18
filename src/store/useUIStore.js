import { create } from 'zustand';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

const initialTheme = localStorage.getItem('wms_theme') || 'light';
applyTheme(initialTheme);

export const useUIStore = create((set) => ({
  theme: initialTheme,
  warehouseType: localStorage.getItem('wms_warehouse_type') || 'b',
  sidebarSlim: localStorage.getItem('wms_sidebar_slim') === 'true',

  setTheme(theme) {
    localStorage.setItem('wms_theme', theme);
    applyTheme(theme);
    set({ theme });
  },

  setWarehouseType(type) {
    localStorage.setItem('wms_warehouse_type', type);
    set({ warehouseType: type });
  },

  toggleSidebar() {
    set((s) => {
      const slim = !s.sidebarSlim;
      localStorage.setItem('wms_sidebar_slim', String(slim));
      return { sidebarSlim: slim };
    });
  },
}));
