/**
 * Core animation type definitions
 */

import type { AnimationContext } from '../lib/canvas/engine'

// Re-export AnimationContext for convenience
export type { AnimationContext }

/**
 * Animation category for organizing animations
 */
export type AnimationCategory = 'particles' | 'waves' | 'geometric' | 'text' | 'glitch'

/**
 * Animation difficulty level
 */
export type AnimationDifficulty = 'easy' | 'medium' | 'hard'

/**
 * Animation parameter types
 */
export interface AnimationParameter {
  name: string
  label: string
  type: 'number' | 'color' | 'boolean' | 'select'
  defaultValue: number | string | boolean
  min?: number
  max?: number
  step?: number
  options?: Array<{ value: string | number; label: string }>
  description?: string
}

/**
 * Animation metadata for registry
 */
export interface AnimationMetadata {
  id: string
  name: string
  description: string
  category: AnimationCategory
  difficulty: AnimationDifficulty
  tags: string[]
  author?: string
  thumbnail?: string
  parameters?: AnimationParameter[]
  createdAt?: string
  updatedAt?: string
}

/**
 * Animation interface (matches engine expectations)
 */
export interface Animation {
  name: string
  init: (context: AnimationContext) => void
  update: (context: AnimationContext) => void
  render: (context: AnimationContext) => void
  cleanup?: (context: AnimationContext) => void
}

/**
 * Complete animation with metadata
 */
export interface AnimationWithMetadata {
  metadata: AnimationMetadata
  animation: Animation
}

/**
 * Animation registry entry
 */
export interface AnimationRegistryEntry {
  metadata: AnimationMetadata
  loader: () => Promise<Animation>
}

/**
 * User parameter overrides
 */
export interface AnimationParameterValues {
  [key: string]: number | string | boolean
}
