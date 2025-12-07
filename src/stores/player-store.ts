import { Store } from '@tanstack/store'
import type { Animation, AnimationMetadata, AnimationParameterValues } from '../types/animation'

export interface PlayerState {
  // Active Animation
  activeAnimationId: string | null
  animation: Animation | null
  metadata: AnimationMetadata | null

  // Playback State
  isPlaying: boolean
  speed: number // 0.25, 0.5, 1, 1.5, 2
  fps: number

  // Parameters
  parameters: AnimationParameterValues
  hasUnsavedChanges: boolean

  // UI State
  showControls: boolean
  showParameters: boolean
  isFullscreen: boolean

  // Export
  lastExportFormat: 'html' | 'react' | 'vanilla' | null
}

const STORAGE_KEY_PREFIX = 'brain-rot-player-params-'
const STORAGE_KEY_STATE = 'brain-rot-player-state'

// Load persisted parameters for specific animation
const loadPersistedParameters = (animationId: string): AnimationParameterValues => {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${animationId}`)
    if (!stored) return {}

    return JSON.parse(stored)
  } catch (error) {
    console.error(`Failed to load parameters for ${animationId}:`, error)
    return {}
  }
}

// Persist parameters for specific animation
const persistParameters = (animationId: string, parameters: AnimationParameterValues) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${animationId}`, JSON.stringify(parameters))
  } catch (error) {
    console.error(`Failed to persist parameters for ${animationId}:`, error)
  }
}

// Load persisted player state (settings only)
const loadPersistedState = (): Partial<PlayerState> => {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(STORAGE_KEY_STATE)
    if (!stored) return {}

    const parsed = JSON.parse(stored)
    return {
      speed: parsed.speed || 1,
      showParameters: parsed.showParameters ?? false,
      lastExportFormat: parsed.lastExportFormat || null,
    }
  } catch (error) {
    console.error('Failed to load player state from localStorage:', error)
    return {}
  }
}

// Persist player state (settings only)
const persistState = (state: PlayerState) => {
  if (typeof window === 'undefined') return

  try {
    const toPersist = {
      speed: state.speed,
      showParameters: state.showParameters,
      lastExportFormat: state.lastExportFormat,
    }
    localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(toPersist))
  } catch (error) {
    console.error('Failed to persist player state to localStorage:', error)
  }
}

// Initial state
const initialState: PlayerState = {
  activeAnimationId: null,
  animation: null,
  metadata: null,
  isPlaying: true,
  speed: 1,
  fps: 0,
  parameters: {},
  hasUnsavedChanges: false,
  showControls: true,
  showParameters: false,
  isFullscreen: false,
  lastExportFormat: null,
  ...loadPersistedState(),
}

// Create store
export const playerStore = new Store<PlayerState>(initialState)

// Subscribe to changes and persist
playerStore.subscribe(() => {
  persistState(playerStore.state)
})

// Actions
export const playerActions = {
  // Animation Actions
  setAnimation: (animation: Animation | null, metadata: AnimationMetadata | null) => {
    playerStore.setState((state) => {
      if (!animation || !metadata) {
        return {
          ...state,
          activeAnimationId: null,
          animation: null,
          metadata: null,
          parameters: {},
          hasUnsavedChanges: false,
        }
      }

      // Build default parameters from metadata
      const defaultParams: AnimationParameterValues = {}
      if (metadata.parameters) {
        for (const param of metadata.parameters) {
          defaultParams[param.name] = param.defaultValue
        }
      }

      // Load persisted parameters or use defaults
      const persistedParams = loadPersistedParameters(metadata.id)
      const parameters = { ...defaultParams, ...persistedParams }

      return {
        ...state,
        activeAnimationId: metadata.id,
        animation,
        metadata,
        parameters,
        hasUnsavedChanges: false,
        isPlaying: true, // Auto-play new animation
      }
    })
  },

  // Playback Actions
  togglePlayback: () => {
    playerStore.setState((state) => ({
      ...state,
      isPlaying: !state.isPlaying,
    }))
  },

  setPlaying: (isPlaying: boolean) => {
    playerStore.setState((state) => ({
      ...state,
      isPlaying,
    }))
  },

  setSpeed: (speed: number) => {
    playerStore.setState((state) => ({
      ...state,
      speed: Math.max(0.25, Math.min(2, speed)),
    }))
  },

  setFps: (fps: number) => {
    playerStore.setState((state) => ({
      ...state,
      fps,
    }))
  },

  restart: () => {
    // This will be handled by the CanvasPlayer component
    // Just reset playback state
    playerStore.setState((state) => ({
      ...state,
      isPlaying: true,
    }))
  },

  // Parameter Actions
  updateParameter: (key: string, value: string | number | boolean) => {
    playerStore.setState((state) => ({
      ...state,
      parameters: {
        ...state.parameters,
        [key]: value,
      },
      hasUnsavedChanges: true,
    }))
  },

  updateParameters: (parameters: AnimationParameterValues) => {
    playerStore.setState((state) => ({
      ...state,
      parameters: {
        ...state.parameters,
        ...parameters,
      },
      hasUnsavedChanges: true,
    }))
  },

  resetParameters: () => {
    playerStore.setState((state) => {
      if (!state.metadata) return state

      // Rebuild default parameters from metadata
      const defaultParams: AnimationParameterValues = {}
      if (state.metadata.parameters) {
        for (const param of state.metadata.parameters) {
          defaultParams[param.name] = param.defaultValue
        }
      }

      return {
        ...state,
        parameters: defaultParams,
        hasUnsavedChanges: false,
      }
    })
  },

  saveParameters: () => {
    const state = playerStore.state
    if (!state.activeAnimationId) return

    persistParameters(state.activeAnimationId, state.parameters)
    playerStore.setState((current) => ({
      ...current,
      hasUnsavedChanges: false,
    }))
  },

  // UI Actions
  setShowControls: (show: boolean) => {
    playerStore.setState((state) => ({
      ...state,
      showControls: show,
    }))
  },

  toggleParameters: () => {
    playerStore.setState((state) => ({
      ...state,
      showParameters: !state.showParameters,
    }))
  },

  setShowParameters: (show: boolean) => {
    playerStore.setState((state) => ({
      ...state,
      showParameters: show,
    }))
  },

  setFullscreen: (isFullscreen: boolean) => {
    playerStore.setState((state) => ({
      ...state,
      isFullscreen,
    }))
  },

  // Export Actions
  setLastExportFormat: (format: PlayerState['lastExportFormat']) => {
    playerStore.setState((state) => ({
      ...state,
      lastExportFormat: format,
    }))
  },
}

// Selectors
export const playerSelectors = {
  getAnimation: (state: PlayerState) => state.animation,
  getMetadata: (state: PlayerState) => state.metadata,
  getAnimationId: (state: PlayerState) => state.activeAnimationId,
  isPlaying: (state: PlayerState) => state.isPlaying,
  getSpeed: (state: PlayerState) => state.speed,
  getFps: (state: PlayerState) => state.fps,
  getParameters: (state: PlayerState) => state.parameters,
  hasUnsavedChanges: (state: PlayerState) => state.hasUnsavedChanges,
  showControls: (state: PlayerState) => state.showControls,
  showParameters: (state: PlayerState) => state.showParameters,
  isFullscreen: (state: PlayerState) => state.isFullscreen,
  getLastExportFormat: (state: PlayerState) => state.lastExportFormat,

  // Derived
  hasAnimation: (state: PlayerState) => state.animation !== null,
  getParameter: (state: PlayerState, key: string) => state.parameters[key],
}
