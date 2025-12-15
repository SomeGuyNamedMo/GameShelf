import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewMode = 'grid' | 'list' | 'table';
export type SortOption = 'title' | 'rating' | 'lastPlayed' | 'playtime';
export type SortOrder = 'asc' | 'desc';

interface Modal {
  type: string;
  props?: Record<string, unknown>;
}

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Current library context
  currentLibraryId: string | null;
  
  // View preferences
  viewMode: ViewMode;
  sortBy: SortOption;
  sortOrder: SortOrder;
  
  // Search
  searchQuery: string;
  
  // Modal management
  activeModal: Modal | null;
  
  // Mobile
  mobileMenuOpen: boolean;
  
  // Theme (future)
  theme: 'dark' | 'light';

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setCurrentLibrary: (libraryId: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sort: SortOption) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
  setSearchQuery: (query: string) => void;
  openModal: (type: string, props?: Record<string, unknown>) => void;
  closeModal: () => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      sidebarOpen: true,
      sidebarCollapsed: false,
      currentLibraryId: null,
      viewMode: 'grid',
      sortBy: 'title',
      sortOrder: 'asc',
      searchQuery: '',
      activeModal: null,
      mobileMenuOpen: false,
      theme: 'dark',

      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setCurrentLibrary: (libraryId) => set({ currentLibraryId: libraryId }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setSortOrder: (order) => set({ sortOrder: order }),
      toggleSortOrder: () => set((state) => ({ 
        sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' 
      })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      openModal: (type, props) => set({ activeModal: { type, props } }),
      closeModal: () => set({ activeModal: null }),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'gameshelf-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        currentLibraryId: state.currentLibraryId,
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        theme: state.theme,
      }),
    }
  )
);

export default useUIStore;

