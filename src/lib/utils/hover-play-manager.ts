/**
 * Hover Play Manager
 * Limits concurrent hover animations for performance optimization
 */

type CleanupFunction = () => void

class HoverPlayManager {
  private activeAnimations: Set<string> = new Set()
  private cleanupFunctions: Map<string, CleanupFunction> = new Map()
  private maxConcurrent = 3 // Maximum concurrent hover animations

  /**
   * Register a new hover animation
   * Returns true if animation can start, false if limit reached
   */
  register(animationId: string, cleanup: CleanupFunction): boolean {
    // If this animation is already playing, don't start again
    if (this.activeAnimations.has(animationId)) {
      return false
    }

    // If we've reached the limit, stop the oldest animation
    if (this.activeAnimations.size >= this.maxConcurrent) {
      const oldestId = this.activeAnimations.values().next().value
      if (oldestId) {
        this.unregister(oldestId)
      }
    }

    // Register the new animation
    this.activeAnimations.add(animationId)
    this.cleanupFunctions.set(animationId, cleanup)
    return true
  }

  /**
   * Unregister an animation (called when hover ends or animation is stopped)
   */
  unregister(animationId: string): void {
    const cleanup = this.cleanupFunctions.get(animationId)
    if (cleanup) {
      cleanup()
      this.cleanupFunctions.delete(animationId)
    }
    this.activeAnimations.delete(animationId)
  }

  /**
   * Check if an animation is currently active
   */
  isActive(animationId: string): boolean {
    return this.activeAnimations.has(animationId)
  }

  /**
   * Get count of active animations
   */
  getActiveCount(): number {
    return this.activeAnimations.size
  }

  /**
   * Stop all active animations
   */
  stopAll(): void {
    for (const cleanup of this.cleanupFunctions.values()) {
      cleanup()
    }
    this.activeAnimations.clear()
    this.cleanupFunctions.clear()
  }

  /**
   * Update the maximum concurrent animations limit
   */
  setMaxConcurrent(max: number): void {
    this.maxConcurrent = Math.max(1, max)

    // If current active count exceeds new limit, stop excess animations
    while (this.activeAnimations.size > this.maxConcurrent) {
      const oldestId = this.activeAnimations.values().next().value
      if (oldestId) {
        this.unregister(oldestId)
      }
    }
  }
}

// Singleton instance
export const hoverPlayManager = new HoverPlayManager()
