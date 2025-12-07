/**
 * Animation registry type definitions
 */

import type { Animation, AnimationCategory, AnimationMetadata } from './animation'

/**
 * Registry filter options
 */
export interface RegistryFilter {
  category?: AnimationCategory
  tags?: string[]
  search?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

/**
 * Registry sort options
 */
export type RegistrySortBy = 'name' | 'category' | 'difficulty' | 'createdAt' | 'updatedAt'
export type RegistrySortOrder = 'asc' | 'desc'

export interface RegistrySortOptions {
  by: RegistrySortBy
  order: RegistrySortOrder
}

/**
 * Animation registry interface
 */
export interface IAnimationRegistry {
  /**
   * Register a new animation
   */
  register(metadata: AnimationMetadata, loader: () => Promise<Animation>): void

  /**
   * Get all registered animation metadata
   */
  getAll(): AnimationMetadata[]

  /**
   * Get filtered animations
   */
  filter(filter: RegistryFilter): AnimationMetadata[]

  /**
   * Get sorted animations
   */
  sort(animations: AnimationMetadata[], options: RegistrySortOptions): AnimationMetadata[]

  /**
   * Get animation by ID
   */
  getById(id: string): Promise<Animation | null>

  /**
   * Get metadata by ID
   */
  getMetadataById(id: string): AnimationMetadata | null

  /**
   * Get animations by category
   */
  getByCategory(category: AnimationCategory): AnimationMetadata[]

  /**
   * Get animations by tags
   */
  getByTags(tags: string[]): AnimationMetadata[]

  /**
   * Search animations
   */
  search(query: string): AnimationMetadata[]

  /**
   * Get all categories
   */
  getCategories(): AnimationCategory[]

  /**
   * Get all tags
   */
  getAllTags(): string[]

  /**
   * Check if animation exists
   */
  has(id: string): boolean

  /**
   * Get total count
   */
  count(): number
}
