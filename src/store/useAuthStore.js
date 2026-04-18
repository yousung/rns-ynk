import { create } from 'zustand';

function loadUser() {
  try { return JSON.parse(localStorage.getItem('wms_user')); } catch { return null; }
}

export const useAuthStore = create((set) => ({
  currentUser: loadUser(),

  login(user) {
    localStorage.setItem('wms_user', JSON.stringify(user));
    set({ currentUser: user });
  },

  logout() {
    localStorage.removeItem('wms_user');
    set({ currentUser: null });
  },
}));
