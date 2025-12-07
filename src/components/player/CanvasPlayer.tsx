/**
 * Canvas Player Component
 * Full-screen animation player with controls
 */

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { CanvasEngine } from '../../lib/canvas/engine'
import { performanceMonitor } from '../../lib/utils/performance-monitor'
import type { Animation } from '../../types/animation'

export interface CanvasPlayerProps {
  animation: Animation
  autoPlay?: boolean
  showFPS?: boolean
  className?: string
  initialParams?: Record<string, number | string | boolean>
  onStateChange?: (state: PlayerState) => void
}

export interface PlayerState {
  isPlaying: boolean
  speed: number
  fps: number
}

export interface CanvasPlayerHandle {
  updateParameters: (params: Record<string, number | string | boolean>) => void
  getEngine: () => CanvasEngine | null
}

export const CanvasPlayer = forwardRef<CanvasPlayerHandle, CanvasPlayerProps>(function CanvasPlayer(
  {
    animation,
    autoPlay = true,
    showFPS = false,
    className = '',
    initialParams = {},
    onStateChange,
  }: CanvasPlayerProps,
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<CanvasEngine | null>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [speed, setSpeed] = useState(1.0)
  const [fps, setFps] = useState(0)

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    updateParameters: (params: Record<string, number | string | boolean>) => {
      const engine = engineRef.current
      if (engine) {
        engine.setParameters(params)
      }
    },
    getEngine: () => engineRef.current,
  }))

  // Initialize engine
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new CanvasEngine(canvas)
    engineRef.current = engine

    // Set initial parameters
    if (Object.keys(initialParams).length > 0) {
      engine.setParameters(initialParams)
    }

    engine.loadAnimation(animation)

    if (autoPlay) {
      engine.play()
    }

    // FPS monitoring
    let fpsInterval: number
    if (showFPS) {
      fpsInterval = window.setInterval(() => {
        const currentFps = engine.getFPS()
        setFps(currentFps)
        // Track FPS in performance monitor
        performanceMonitor.recordFPS(currentFps)
      }, 100)
    }

    return () => {
      if (fpsInterval) clearInterval(fpsInterval)
      engine.destroy()
      engineRef.current = null
    }
  }, [animation, autoPlay, showFPS, initialParams])

  // Update state callback
  useEffect(() => {
    if (onStateChange) {
      onStateChange({ isPlaying, speed, fps })
    }
  }, [isPlaying, speed, fps, onStateChange])

  // Play/Pause control
  const togglePlayPause = () => {
    const engine = engineRef.current
    if (!engine) return

    if (isPlaying) {
      engine.pause()
    } else {
      engine.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Restart control
  const restart = () => {
    const engine = engineRef.current
    if (!engine) return

    engine.restart()
    setIsPlaying(true)
  }

  // Speed control
  const changeSpeed = (newSpeed: number) => {
    const engine = engineRef.current
    if (!engine) return

    engine.setSpeed(newSpeed)
    setSpeed(newSpeed)
  }

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" style={{ display: 'block' }} />

      {/* FPS Counter */}
      {showFPS && (
        <div className="absolute right-4 top-4 rounded bg-black/60 px-3 py-1.5 font-mono text-sm text-white backdrop-blur">
          {fps} FPS
        </div>
      )}

      {/* Control Panel Overlay - Hidden by default, controlled by parent */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6">
        <div className="pointer-events-auto mx-auto flex max-w-4xl items-center justify-center gap-4">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlayPause}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black transition-all hover:scale-110 hover:bg-white"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <title>Pause</title>
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <title>Play</title>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Restart Button */}
          <button
            type="button"
            onClick={restart}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30"
            aria-label="Restart"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Restart</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          {/* Speed Controls */}
          <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur">
            <span className="text-sm font-medium text-white">Speed:</span>
            {[0.25, 0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => changeSpeed(s)}
                className={`min-w-[3rem] rounded px-2 py-1 text-sm font-medium transition-colors ${
                  speed === s ? 'bg-white text-black' : 'text-white hover:bg-white/20'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})
