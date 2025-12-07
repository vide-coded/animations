/**
 * Pixel Sort Animation
 * Pixel sorting glitch effect with directional sorting
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface SortRegion {
  x: number
  y: number
  width: number
  height: number
  direction: 'horizontal' | 'vertical'
  threshold: number
  lifetime: number
  maxLifetime: number
}

export class PixelSortAnimation implements Animation {
  name = 'Pixel Sort'
  private regions: SortRegion[] = []
  private sortTimer = 0
  private readonly sortInterval = 200
  private baseImageData: ImageData | null = null

  init(context: AnimationContext): void {
    const { width, height } = context
    const ctx = context.ctx as CanvasRenderingContext2D

    this.regions = []
    this.sortTimer = 0

    // Draw base gradient and shapes
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    // Colorful gradient circles
    const circles = 8
    for (let i = 0; i < circles; i++) {
      const x = (width / circles) * i + width / (circles * 2)
      const y = height / 2
      const radius = 60 + Math.sin(i) * 30

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, `hsl(${i * 45}, 80%, 60%)`)
      gradient.addColorStop(1, `hsl(${i * 45 + 30}, 70%, 40%)`)

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Horizontal lines
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    for (let i = 0; i < 6; i++) {
      const y = (height / 6) * i + height / 12
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Vertical lines
    for (let i = 0; i < 8; i++) {
      const x = (width / 8) * i + width / 16
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    this.baseImageData = ctx.getImageData(0, 0, width, height)
  }

  update(context: AnimationContext): void {
    const { deltaTime, width, height } = context

    this.sortTimer += deltaTime

    // Update existing regions
    for (let i = this.regions.length - 1; i >= 0; i--) {
      const region = this.regions[i]
      region.lifetime += deltaTime

      if (region.lifetime >= region.maxLifetime) {
        this.regions.splice(i, 1)
      }
    }

    // Create new sort regions
    if (this.sortTimer >= this.sortInterval) {
      this.sortTimer = 0

      const regionCount = 1 + Math.floor(Math.random() * 3)

      for (let i = 0; i < regionCount; i++) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical'

        this.regions.push({
          x: Math.random() * width * 0.5,
          y: Math.random() * height * 0.5,
          width: 100 + Math.random() * (width * 0.3),
          height: 50 + Math.random() * (height * 0.3),
          direction,
          threshold: 100 + Math.random() * 100,
          lifetime: 0,
          maxLifetime: 300 + Math.random() * 500,
        })
      }
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D

    // Draw base image
    if (this.baseImageData) {
      ctx.putImageData(this.baseImageData, 0, 0)
    }

    // Apply pixel sorting to each region
    for (const region of this.regions) {
      this.sortRegion(ctx, region)
    }
  }

  private sortRegion(ctx: CanvasRenderingContext2D, region: SortRegion): void {
    const x = Math.max(0, Math.floor(region.x))
    const y = Math.max(0, Math.floor(region.y))
    const w = Math.min(Math.ceil(region.width), ctx.canvas.width - x)
    const h = Math.min(Math.ceil(region.height), ctx.canvas.height - y)

    if (w <= 0 || h <= 0) return

    const imageData = ctx.getImageData(x, y, w, h)
    const data = imageData.data

    if (region.direction === 'horizontal') {
      // Sort pixels horizontally
      for (let row = 0; row < h; row++) {
        const pixels: Array<{ r: number; g: number; b: number; a: number; brightness: number }> = []

        // Extract pixels from this row
        for (let col = 0; col < w; col++) {
          const i = (row * w + col) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const a = data[i + 3]
          const brightness = (r + g + b) / 3

          pixels.push({ r, g, b, a, brightness })
        }

        // Sort by brightness if above threshold
        const shouldSort = pixels.some((p) => p.brightness > region.threshold)

        if (shouldSort) {
          pixels.sort((a, b) => a.brightness - b.brightness)
        }

        // Write sorted pixels back
        for (let col = 0; col < w; col++) {
          const i = (row * w + col) * 4
          const pixel = pixels[col]

          data[i] = pixel.r
          data[i + 1] = pixel.g
          data[i + 2] = pixel.b
          data[i + 3] = pixel.a
        }
      }
    } else {
      // Sort pixels vertically
      for (let col = 0; col < w; col++) {
        const pixels: Array<{ r: number; g: number; b: number; a: number; brightness: number }> = []

        // Extract pixels from this column
        for (let row = 0; row < h; row++) {
          const i = (row * w + col) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const a = data[i + 3]
          const brightness = (r + g + b) / 3

          pixels.push({ r, g, b, a, brightness })
        }

        // Sort by brightness if above threshold
        const shouldSort = pixels.some((p) => p.brightness > region.threshold)

        if (shouldSort) {
          pixels.sort((a, b) => a.brightness - b.brightness)
        }

        // Write sorted pixels back
        for (let row = 0; row < h; row++) {
          const i = (row * w + col) * 4
          const pixel = pixels[row]

          data[i] = pixel.r
          data[i + 1] = pixel.g
          data[i + 2] = pixel.b
          data[i + 3] = pixel.a
        }
      }
    }

    ctx.putImageData(imageData, x, y)
  }

  cleanup(): void {
    this.regions = []
    this.baseImageData = null
  }
}

export default new PixelSortAnimation()
