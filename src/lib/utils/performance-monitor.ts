/**
 * Performance Monitoring Utilities
 * Track bundle size, memory usage, and runtime performance
 */

interface PerformanceMetrics {
  fps: number
  memory?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
  timing: {
    domContentLoaded: number
    loadComplete: number
    firstPaint?: number
    firstContentfulPaint?: number
  }
}

class PerformanceMonitor {
  private fpsHistory: number[] = []
  private maxHistoryLength = 60 // Store last 60 fps readings

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      fps: this.getAverageFPS(),
      timing: this.getTimingMetrics(),
    }

    // Add memory metrics if available
    if ('memory' in performance) {
      const memory = (
        performance as {
          memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number }
        }
      ).memory
      if (memory) {
        metrics.memory = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        }
      }
    }

    return metrics
  }

  /**
   * Track FPS reading
   */
  recordFPS(fps: number): void {
    this.fpsHistory.push(fps)
    if (this.fpsHistory.length > this.maxHistoryLength) {
      this.fpsHistory.shift()
    }
  }

  /**
   * Get average FPS over recent history
   */
  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0
    const sum = this.fpsHistory.reduce((acc, fps) => acc + fps, 0)
    return Math.round(sum / this.fpsHistory.length)
  }

  /**
   * Get timing metrics
   */
  private getTimingMetrics(): PerformanceMetrics['timing'] {
    const timing = performance.timing
    const navigationStart = timing.navigationStart

    const metrics: PerformanceMetrics['timing'] = {
      domContentLoaded: timing.domContentLoadedEventEnd - navigationStart,
      loadComplete: timing.loadEventEnd - navigationStart,
    }

    // Get paint timing if available
    const paintEntries = performance.getEntriesByType('paint')
    for (const entry of paintEntries) {
      if (entry.name === 'first-paint') {
        metrics.firstPaint = entry.startTime
      } else if (entry.name === 'first-contentful-paint') {
        metrics.firstContentfulPaint = entry.startTime
      }
    }

    return metrics
  }

  /**
   * Format bytes to human-readable string
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  /**
   * Log performance summary to console
   */
  logSummary(): void {
    const metrics = this.getMetrics()

    console.group('📊 Performance Metrics')
    console.log(`FPS (avg): ${metrics.fps}`)

    if (metrics.memory) {
      console.log(`Memory Used: ${this.formatBytes(metrics.memory.usedJSHeapSize)}`)
      console.log(`Memory Total: ${this.formatBytes(metrics.memory.totalJSHeapSize)}`)
      console.log(`Memory Limit: ${this.formatBytes(metrics.memory.jsHeapSizeLimit)}`)
    }

    console.log(`DOM Content Loaded: ${metrics.timing.domContentLoaded}ms`)
    console.log(`Load Complete: ${metrics.timing.loadComplete}ms`)

    if (metrics.timing.firstContentfulPaint) {
      console.log(`First Contentful Paint: ${metrics.timing.firstContentfulPaint.toFixed(2)}ms`)
    }

    console.groupEnd()
  }

  /**
   * Check if performance is degraded
   */
  isPerformanceDegraded(): boolean {
    const avgFPS = this.getAverageFPS()
    return avgFPS > 0 && avgFPS < 30
  }

  /**
   * Clear history
   */
  reset(): void {
    this.fpsHistory = []
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Development-only performance logging
if (import.meta.env.DEV) {
  // Log performance summary after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.logSummary()
    }, 1000)
  })
}
