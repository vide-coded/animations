import { Store } from '@tanstack/store'
import type { AnimationCategory } from '../types/animation'

export interface GalleryState {
  // Filters
  selectedCategory: AnimationCategory | 'all'
  searchQuery: string
  sortBy: 'name' | 'category' | 'difficulty' | 'createdAt' | 'updatedAt'
  sortOrder: 'asc' | 'desc'

  // Favorites & History
  favoriteIds: string[]
  recentlyViewedIds: string[]

  // Settings
  autoPlayOnHover: boolean
  showThumbnails: boolean
  gridColumns: 2 | 3 | 4

  // UI State
  isFilterSidebarOpen: boolean
}

const STORAGE_KEY = 'brain-rot-gallery-state'

// Load persisted state from localStorage
const loadPersistedState = (): Partial<GalleryState> => {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}

    const parsed = JSON.parse(stored)
    return {
      favoriteIds: parsed.favoriteIds || [],
      recentlyViewedIds: parsed.recentlyViewedIds || [],
      autoPlayOnHover: parsed.autoPlayOnHover ?? true,
      showThumbnails: parsed.showThumbnails ?? true,
      gridColumns: parsed.gridColumns || 3,
      sortBy: parsed.sortBy || 'name',
      sortOrder: parsed.sortOrder || 'asc',
    }
  } catch (error) {
    console.error('Failed to load gallery state from localStorage:', error)
    return {}
  }
}

// Persist state to localStorage
const persistState = (state: GalleryState) => {
  if (typeof window === 'undefined') return

  try {
    const toPersist = {
      favoriteIds: state.favoriteIds,
      recentlyViewedIds: state.recentlyViewedIds,
      autoPlayOnHover: state.autoPlayOnHover,
      showThumbnails: state.showThumbnails,
      gridColumns: state.gridColumns,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist))
  } catch (error) {
    console.error('Failed to persist gallery state to localStorage:', error)
  }
}

// Initial state
const initialState: GalleryState = {
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'name',
  sortOrder: 'asc',
  favoriteIds: [],
  recentlyViewedIds: [],
  autoPlayOnHover: true,
  showThumbnails: true,
  gridColumns: 3,
  isFilterSidebarOpen: false,
  ...loadPersistedState(),
}

// Create store
export const galleryStore = new Store<GalleryState>(initialState)

// Subscribe to changes and persist
galleryStore.subscribe(() => {
  persistState(galleryStore.state)
})

// Actions
export const galleryActions = {
  // Filter Actions
  setCategory: (category: AnimationCategory | 'all') => {
    galleryStore.setState((state) => ({
      ...state,
      selectedCategory: category,
    }))
  },

  setSearchQuery: (query: string) => {
    galleryStore.setState((state) => ({
      ...state,
      searchQuery: query,
    }))
  },

  setSortBy: (sortBy: GalleryState['sortBy']) => {
    galleryStore.setState((state) => ({
      ...state,
      sortBy,
    }))
  },

  toggleSortOrder: () => {
    galleryStore.setState((state) => ({
      ...state,
      sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc',
    }))
  },

  clearFilters: () => {
    galleryStore.setState((state) => ({
      ...state,
      selectedCategory: 'all',
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc',
    }))
  },

  // Favorites Actions
  toggleFavorite: (animationId: string) => {
    galleryStore.setState((state) => {
      const isFavorite = state.favoriteIds.includes(animationId)
      return {
        ...state,
        favoriteIds: isFavorite
          ? state.favoriteIds.filter((id) => id !== animationId)
          : [...state.favoriteIds, animationId],
      }
    })
  },

  addToRecentlyViewed: (animationId: string) => {
    galleryStore.setState((state) => {
      // Remove if already exists to move to front
      const filtered = state.recentlyViewedIds.filter((id) => id !== animationId)
      // Add to front and limit to 20 items
      return {
        ...state,
        recentlyViewedIds: [animationId, ...filtered].slice(0, 20),
      }
    })
  },

  clearRecentlyViewed: () => {
    galleryStore.setState((state) => ({
      ...state,
      recentlyViewedIds: [],
    }))
  },

  // Settings Actions
  setAutoPlayOnHover: (enabled: boolean) => {
    galleryStore.setState((state) => ({
      ...state,
      autoPlayOnHover: enabled,
    }))
  },

  toggleAutoPlayOnHover: () => {
    galleryStore.setState((state) => ({
      ...state,
      autoPlayOnHover: !state.autoPlayOnHover,
    }))
  },

  setShowThumbnails: (enabled: boolean) => {
    galleryStore.setState((state) => ({
      ...state,
      showThumbnails: enabled,
    }))
  },

  setGridColumns: (columns: GalleryState['gridColumns']) => {
    galleryStore.setState((state) => ({
      ...state,
      gridColumns: columns,
    }))
  },

  // UI Actions
  toggleFilterSidebar: () => {
    galleryStore.setState((state) => ({
      ...state,
      isFilterSidebarOpen: !state.isFilterSidebarOpen,
    }))
  },

  setFilterSidebarOpen: (open: boolean) => {
    galleryStore.setState((state) => ({
      ...state,
      isFilterSidebarOpen: open,
    }))
  },
}

// Selectors
export const gallerySelectors = {
  getCategory: (state: GalleryState) => state.selectedCategory,
  getSearchQuery: (state: GalleryState) => state.searchQuery,
  getSortBy: (state: GalleryState) => state.sortBy,
  getSortOrder: (state: GalleryState) => state.sortOrder,
  getFavorites: (state: GalleryState) => state.favoriteIds,
  isFavorite: (state: GalleryState, animationId: string) => state.favoriteIds.includes(animationId),
  getRecentlyViewed: (state: GalleryState) => state.recentlyViewedIds,
  getAutoPlayOnHover: (state: GalleryState) => state.autoPlayOnHover,
  getShowThumbnails: (state: GalleryState) => state.showThumbnails,
  getGridColumns: (state: GalleryState) => state.gridColumns,
  isFilterSidebarOpen: (state: GalleryState) => state.isFilterSidebarOpen,

  // Derived
  hasActiveFilters: (state: GalleryState) =>
    state.selectedCategory !== 'all' || state.searchQuery.trim() !== '',
}
