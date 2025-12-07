/**
 * Performance Dashboard
 * Display performance metrics and optimization status
 */

import { useEffect, useState } from 'react'
import { performanceMonitor } from '../../lib/utils/performance-monitor'

interface PerformanceStats {
  avgFPS: number
  targetFPS: number
  isLowEndDevice: boolean
  memoryUsed?: string
  memoryTotal?: string
  isDegraded: boolean
  cacheSize: number
}

export function PerformanceDashboard() {
  const [stats, setStats] = useState<PerformanceStats>({
    avgFPS: 0,
    targetFPS: 60,
    isLowEndDevice: false,
    isDegraded: false,
    cacheSize: 0,
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Only show in development
    if (!import.meta.env.DEV) return

    const updateStats = () => {
      const metrics = performanceMonitor.getMetrics()

      setStats({
        avgFPS: metrics.fps,
        targetFPS: 60,
        isLowEndDevice: false, // Will be set by engine
        isDegraded: performanceMonitor.isPerformanceDegraded(),
        memoryUsed: metrics.memory
          ? performanceMonitor.formatBytes(metrics.memory.usedJSHeapSize)
          : undefined,
        memoryTotal: metrics.memory
          ? performanceMonitor.formatBytes(metrics.memory.totalJSHeapSize)
          : undefined,
        cacheSize: 0, // Will be updated when we add registry cache size
      })
    }

    // Update every second
    const interval = setInterval(updateStats, 1000)
    updateStats()

    return () => clearInterval(interval)
  }, [])

  // Don't render in production
  if (!import.meta.env.DEV) return null

  return (
    <>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-all hover:scale-110 hover:bg-purple-700"
        title="Performance Dashboard"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <title>Performance</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </button>

      {/* Dashboard Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 z-50 w-80 rounded-lg border border-gray-700 bg-gray-900 p-4 text-white shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">Performance Metrics</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-3 text-sm">
            {/* FPS */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">FPS (Average)</span>
              <span
                className={`font-mono font-bold ${
                  stats.isDegraded
                    ? 'text-red-400'
                    : stats.avgFPS >= 55
                      ? 'text-green-400'
                      : 'text-yellow-400'
                }`}
              >
                {stats.avgFPS}
              </span>
            </div>

            {/* Target FPS */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Target FPS</span>
              <span className="font-mono font-bold text-blue-400">{stats.targetFPS}</span>
            </div>

            {/* Device Type */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Device Type</span>
              <span className="font-mono">
                {stats.isLowEndDevice ? '🐢 Low-End' : '🚀 High-End'}
              </span>
            </div>

            {/* Memory */}
            {stats.memoryUsed && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Memory Used</span>
                  <span className="font-mono text-purple-400">{stats.memoryUsed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Memory Total</span>
                  <span className="font-mono text-purple-400">{stats.memoryTotal}</span>
                </div>
              </>
            )}

            {/* Cache Size */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Animation Cache</span>
              <span className="font-mono text-cyan-400">{stats.cacheSize} loaded</span>
            </div>

            {/* Status */}
            <div className="mt-4 rounded bg-gray-800 p-2">
              <div className="text-xs text-gray-400">Status</div>
              <div className="mt-1 text-sm">
                {stats.isDegraded ? (
                  <span className="text-red-400">⚠️ Performance Degraded</span>
                ) : (
                  <span className="text-green-400">✓ Optimal Performance</span>
                )}
              </div>
            </div>

            {/* Optimizations Active */}
            <div className="mt-3 rounded bg-gray-800 p-2">
              <div className="text-xs text-gray-400">Active Optimizations</div>
              <ul className="mt-1 space-y-1 text-xs">
                <li className="text-green-400">✓ Code Splitting Enabled</li>
                <li className="text-green-400">✓ Canvas Pooling Active</li>
                <li className="text-green-400">✓ Animation Caching</li>
                {stats.isLowEndDevice && (
                  <li className="text-yellow-400">⚡ FPS Throttling (30 FPS)</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
