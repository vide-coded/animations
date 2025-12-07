/**
 * Core Canvas Animation Engine
 * Provides requestAnimationFrame loop, lifecycle management, and performance monitoring
 */

export interface AnimationContext {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | WebGLRenderingContext
  width: number
  height: number
  time: number
  deltaTime: number
  fps: number
  isPlaying: boolean
  speed: number
  params?: Record<string, number | string | boolean>
}

export interface Animation {
  name: string
  init: (context: AnimationContext) => void
  update: (context: AnimationContext) => void
  render: (context: AnimationContext) => void
  cleanup?: (context: AnimationContext) => void
}

// Canvas Pool for resource reuse
class CanvasPool {
  private pool: HTMLCanvasElement[] = []
  private maxSize = 10

  acquire(width: number, height: number): HTMLCanvasElement {
    let canvas = this.pool.pop()
    if (!canvas) {
      canvas = document.createElement('canvas')
    }
    canvas.width = width
    canvas.height = height
    return canvas
  }

  release(canvas: HTMLCanvasElement): void {
    if (this.pool.length < this.maxSize) {
      // Clear canvas before returning to pool
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      this.pool.push(canvas)
    }
  }

  clear(): void {
    this.pool = []
  }
}

// Singleton canvas pool
export const canvasPool = new CanvasPool()

// FPS Throttling for low-end devices
function detectLowEndDevice(): boolean {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4
  if (cores < 4) return true

  // Check for mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
  if (isMobile) return true

  // Check memory if available (Device Memory API)
  const memory = (navigator as { deviceMemory?: number }).deviceMemory
  if (memory && memory < 4) return true

  return false
}

export class CanvasEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D | WebGLRenderingContext | null
  private animation: Animation | null = null
  private animationFrameId: number | null = null

  private isPlaying = false
  private startTime = 0
  private lastTime = 0
  private deltaTime = 0
  private fps = 0
  private frameCount = 0
  private fpsUpdateTime = 0
  private speed = 1.0
  private params: Record<string, number | string | boolean> = {}

  private resizeObserver: ResizeObserver | null = null

  // Performance optimization flags
  private isLowEndDevice = detectLowEndDevice()
  private targetFPS = 60
  private fpsThrottle = 0
  private lastFrameTime = 0

  constructor(canvas: HTMLCanvasElement, contextType: '2d' | 'webgl' = '2d') {
    this.canvas = canvas

    if (contextType === '2d') {
      this.ctx = canvas.getContext('2d', {
        alpha: false, // Disable alpha for better performance
        desynchronized: true, // Reduce latency
      })
    } else {
      this.ctx =
        (canvas.getContext('webgl', {
          alpha: false,
          antialias: !this.isLowEndDevice, // Disable AA on low-end devices
          powerPreference: 'high-performance',
        }) as WebGLRenderingContext | null) ||
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
    }

    if (!this.ctx) {
      throw new Error(`Failed to get ${contextType} context`)
    }

    // Set target FPS based on device capability
    if (this.isLowEndDevice) {
      this.targetFPS = 30 // Cap at 30 FPS for low-end devices
      this.fpsThrottle = 1000 / this.targetFPS
    } else {
      this.targetFPS = 60
      this.fpsThrottle = 0 // No throttling for high-end devices
    }

    this.setupCanvas()
    this.setupResizeObserver()
  }

  private setupCanvas(): void {
    const dpr = window.devicePixelRatio || 1
    const rect = this.canvas.getBoundingClientRect()

    this.canvas.width = rect.width * dpr
    this.canvas.height = rect.height * dpr

    // Scale context for high DPI displays
    if (this.ctx instanceof CanvasRenderingContext2D) {
      this.ctx.scale(dpr, dpr)
    }
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.setupCanvas()
      if (this.animation) {
        this.animation.init(this.getContext())
      }
    })

    this.resizeObserver.observe(this.canvas)
  }

  private getContext(): AnimationContext {
    if (!this.ctx) {
      throw new Error('Canvas context not initialized')
    }

    return {
      canvas: this.canvas,
      ctx: this.ctx,
      width: this.canvas.width,
      height: this.canvas.height,
      time: (performance.now() - this.startTime) * this.speed,
      deltaTime: this.deltaTime * this.speed,
      fps: this.fps,
      isPlaying: this.isPlaying,
      speed: this.speed,
      params: this.params,
    }
  }

  private animationLoop = (timestamp: number): void => {
    if (!this.isPlaying || !this.animation) return

    // FPS throttling for low-end devices
    if (this.fpsThrottle > 0) {
      const elapsed = timestamp - this.lastFrameTime
      if (elapsed < this.fpsThrottle) {
        this.animationFrameId = requestAnimationFrame(this.animationLoop)
        return
      }
      this.lastFrameTime = timestamp
    }

    // Calculate delta time
    if (this.lastTime === 0) {
      this.lastTime = timestamp
    }
    this.deltaTime = timestamp - this.lastTime
    this.lastTime = timestamp

    // Calculate FPS
    this.frameCount++
    if (timestamp - this.fpsUpdateTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (timestamp - this.fpsUpdateTime))
      this.frameCount = 0
      this.fpsUpdateTime = timestamp
    }

    const context = this.getContext()

    // Update and render
    this.animation.update(context)
    this.animation.render(context)

    this.animationFrameId = requestAnimationFrame(this.animationLoop)
  }

  loadAnimation(animation: Animation): void {
    this.stop()

    // Cleanup previous animation
    if (this.animation?.cleanup) {
      this.animation.cleanup(this.getContext())
    }

    this.animation = animation
    this.animation.init(this.getContext())
  }

  play(): void {
    if (this.isPlaying) return

    this.isPlaying = true
    this.startTime = performance.now()
    this.lastTime = 0
    this.frameCount = 0
    this.fpsUpdateTime = performance.now()

    this.animationFrameId = requestAnimationFrame(this.animationLoop)
  }

  pause(): void {
    this.isPlaying = false

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  stop(): void {
    this.pause()
    this.startTime = 0
    this.lastTime = 0
    this.deltaTime = 0
  }

  restart(): void {
    this.stop()
    if (this.animation) {
      this.animation.init(this.getContext())
      this.play()
    }
  }

  setSpeed(speed: number): void {
    this.speed = Math.max(0.25, Math.min(2.0, speed))
  }

  getSpeed(): number {
    return this.speed
  }

  setParameters(params: Record<string, number | string | boolean>): void {
    this.params = { ...this.params, ...params }
  }

  getParameters(): Record<string, number | string | boolean> {
    return { ...this.params }
  }

  getFPS(): number {
    return this.fps
  }

  getTargetFPS(): number {
    return this.targetFPS
  }

  isLowEndDeviceDetected(): boolean {
    return this.isLowEndDevice
  }

  isAnimationPlaying(): boolean {
    return this.isPlaying
  }

  destroy(): void {
    this.stop()

    if (this.animation?.cleanup) {
      this.animation.cleanup(this.getContext())
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }

    this.animation = null
    this.ctx = null
  }
}
