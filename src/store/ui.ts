import { create } from "zustand";

// UI state saja (sidebar, modal) — data server tetap di TanStack Query
interface UiState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  activeModal: null,
  setActiveModal: (activeModal) => set({ activeModal }),
}));