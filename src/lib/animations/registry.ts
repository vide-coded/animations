/**
 * Animation Registry
 * Centralized registry for managing all animations
 */

import type { Animation, AnimationCategory, AnimationMetadata } from '../../types/animation'
import type { IAnimationRegistry, RegistryFilter, RegistrySortOptions } from '../../types/registry'

class AnimationRegistry implements IAnimationRegistry {
  private entries = new Map<
    string,
    {
      metadata: AnimationMetadata
      loader: () => Promise<Animation>
    }
  >()

  // Cache for loaded animations to avoid redundant imports
  private loadedCache = new Map<string, Animation>()
  private loadingPromises = new Map<string, Promise<Animation>>()

  register(metadata: AnimationMetadata, loader: () => Promise<Animation>): void {
    if (this.entries.has(metadata.id)) {
      console.warn(`Animation with id "${metadata.id}" is already registered. Overwriting.`)
    }

    this.entries.set(metadata.id, { metadata, loader })
  }

  getAll(): AnimationMetadata[] {
    return Array.from(this.entries.values()).map((entry) => entry.metadata)
  }

  filter(filter: RegistryFilter): AnimationMetadata[] {
    let results = this.getAll()

    if (filter.category) {
      results = results.filter((m) => m.category === filter.category)
    }

    if (filter.difficulty) {
      results = results.filter((m) => m.difficulty === filter.difficulty)
    }

    if (filter.tags && filter.tags.length > 0) {
      results = results.filter((m) => filter.tags?.some((tag) => m.tags.includes(tag)))
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      results = results.filter(
        (m) =>
          m.name.toLowerCase().includes(searchLower) ||
          m.description.toLowerCase().includes(searchLower) ||
          m.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }

    return results
  }

  sort(animations: AnimationMetadata[], options: RegistrySortOptions): AnimationMetadata[] {
    const sorted = [...animations]
    const { by, order } = options

    sorted.sort((a, b) => {
      let comparison = 0

      switch (by) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
        case 'difficulty': {
          const difficultyOrder = { easy: 0, medium: 1, hard: 2 }
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
          break
        }
        case 'createdAt':
          if (a.createdAt && b.createdAt) {
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          }
          break
        case 'updatedAt':
          if (a.updatedAt && b.updatedAt) {
            comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          }
          break
      }

      return order === 'asc' ? comparison : -comparison
    })

    return sorted
  }

  async getById(id: string): Promise<Animation | null> {
    const entry = this.entries.get(id)
    if (!entry) return null

    // Return from cache if already loaded
    const cached = this.loadedCache.get(id)
    if (cached) {
      return cached
    }

    // Return existing loading promise to prevent duplicate loads
    const loading = this.loadingPromises.get(id)
    if (loading) {
      return loading
    }

    // Create new loading promise
    const loadingPromise = entry
      .loader()
      .then((animation) => {
        this.loadedCache.set(id, animation)
        this.loadingPromises.delete(id)
        return animation
      })
      .catch((error) => {
        console.error(`Failed to load animation "${id}":`, error)
        this.loadingPromises.delete(id)
        return null
      })

    this.loadingPromises.set(id, loadingPromise as Promise<Animation>)
    return loadingPromise
  }

  getMetadataById(id: string): AnimationMetadata | null {
    const entry = this.entries.get(id)
    return entry ? entry.metadata : null
  }

  getByCategory(category: AnimationCategory): AnimationMetadata[] {
    return this.getAll().filter((m) => m.category === category)
  }

  getByTags(tags: string[]): AnimationMetadata[] {
    return this.getAll().filter((m) => tags.some((tag) => m.tags.includes(tag)))
  }

  search(query: string): AnimationMetadata[] {
    return this.filter({ search: query })
  }

  getCategories(): AnimationCategory[] {
    const categories = new Set<AnimationCategory>()
    for (const metadata of this.getAll()) {
      categories.add(metadata.category)
    }
    return Array.from(categories).sort()
  }

  getAllTags(): string[] {
    const tags = new Set<string>()
    for (const metadata of this.getAll()) {
      for (const tag of metadata.tags) {
        tags.add(tag)
      }
    }
    return Array.from(tags).sort()
  }

  has(id: string): boolean {
    return this.entries.has(id)
  }

  count(): number {
    return this.entries.size
  }

  // Cache management methods
  clearCache(): void {
    this.loadedCache.clear()
    this.loadingPromises.clear()
  }

  getCacheSize(): number {
    return this.loadedCache.size
  }

  isCached(id: string): boolean {
    return this.loadedCache.has(id)
  }

  // Preload animations by category for better UX
  async preloadCategory(category: AnimationCategory): Promise<void> {
    const animations = this.getByCategory(category)
    await Promise.all(animations.map((meta) => this.getById(meta.id)))
  }
}

// Export singleton instance
export const animationRegistry = new AnimationRegistry()

// Export class for testing
export { AnimationRegistry }

// Helper functions
export function getAnimationsByIds(ids: string[]): AnimationMetadata[] {
  return ids
    .map((id) => animationRegistry.getMetadataById(id))
    .filter((metadata): metadata is AnimationMetadata => metadata !== null)
}
