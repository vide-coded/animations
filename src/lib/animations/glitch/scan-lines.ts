/**
 * Scan Lines Animation
 * CRT scanline effect with glitch artifacts
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface ScanLine {
  y: number
  intensity: number
  speed: number
}

interface GlitchBar {
  y: number
  height: number
  offset: number
  lifetime: number
  maxLifetime: number
}

export class ScanLinesAnimation implements Animation {
  name = 'Scan Lines'
  private scanlines: ScanLine[] = []
  private glitchBars: GlitchBar[] = []
  private scanOffset = 0
  private glitchTimer = 0
  private readonly glitchInterval = 500
  private baseImageData: ImageData | null = null

  init(context: AnimationContext): void {
    const { width, height } = context
    const ctx = context.ctx as CanvasRenderingContext2D

    this.scanlines = []
    this.glitchBars = []
    this.scanOffset = 0
    this.glitchTimer = 0

    // Create scanlines
    for (let y = 0; y < height; y += 4) {
      this.scanlines.push({
        y,
        intensity: 0.3 + Math.random() * 0.3,
        speed: 0.5 + Math.random() * 0.5,
      })
    }

    // Draw base content
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    // Draw grid pattern
    ctx.strokeStyle = '#1e40af'
    ctx.lineWidth = 2

    const gridSize = 50
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw text
    ctx.font = 'bold 48px monospace'
    ctx.fillStyle = '#3b82f6'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('SIGNAL LOST', width / 2, height / 2 - 50)

    ctx.font = '24px monospace'
    ctx.fillStyle = '#60a5fa'
    ctx.fillText('ATTEMPTING RECONNECT...', width / 2, height / 2 + 20)

    // Draw circles
    const circles = 5
    for (let i = 0; i < circles; i++) {
      const radius = 30 + i * 40
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.5 - i * 0.08})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2)
      ctx.stroke()
    }

    this.baseImageData = ctx.getImageData(0, 0, width, height)
  }

  update(context: AnimationContext): void {
    const { deltaTime, height } = context
    const dt = deltaTime / 16

    this.scanOffset += 0.5 * dt

    this.glitchTimer += deltaTime

    // Update glitch bars
    for (let i = this.glitchBars.length - 1; i >= 0; i--) {
      const bar = this.glitchBars[i]
      bar.lifetime += deltaTime

      if (bar.lifetime >= bar.maxLifetime) {
        this.glitchBars.splice(i, 1)
      }
    }

    // Create new glitch bars
    if (this.glitchTimer >= this.glitchInterval) {
      this.glitchTimer = 0

      if (Math.random() < 0.7) {
        this.glitchBars.push({
          y: Math.random() * height,
          height: 10 + Math.random() * 50,
          offset: (Math.random() - 0.5) * 30,
          lifetime: 0,
          maxLifetime: 100 + Math.random() * 200,
        })
      }
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    // Draw base image
    if (this.baseImageData) {
      ctx.putImageData(this.baseImageData, 0, 0)
    }

    // Draw scanlines
    ctx.save()
    ctx.globalAlpha = 0.6

    for (const scanline of this.scanlines) {
      const y = (scanline.y + this.scanOffset * scanline.speed) % height

      ctx.fillStyle = `rgba(0, 0, 0, ${scanline.intensity})`
      ctx.fillRect(0, y, width, 2)
    }

    ctx.restore()

    // Draw glitch bars
    for (const bar of this.glitchBars) {
      if (!this.baseImageData) continue

      // Get the bar section
      const barY = Math.max(0, Math.floor(bar.y))
      const barHeight = Math.min(Math.ceil(bar.height), height - barY)

      if (barHeight <= 0) continue

      const imageData = ctx.getImageData(0, barY, width, barHeight)

      // Clear the area
      ctx.fillStyle = '#0a0a14'
      ctx.fillRect(0, barY, width, barHeight)

      // Draw with offset
      ctx.putImageData(imageData, bar.offset, barY)

      // Add RGB split effect
      if (Math.random() < 0.5) {
        const splitData = ctx.createImageData(width, barHeight)

        for (let i = 0; i < imageData.data.length; i += 4) {
          const rand = Math.random()
          if (rand < 0.33) {
            splitData.data[i] = imageData.data[i]
            splitData.data[i + 3] = imageData.data[i + 3]
          } else if (rand < 0.66) {
            splitData.data[i + 1] = imageData.data[i + 1]
            splitData.data[i + 3] = imageData.data[i + 3]
          } else {
            splitData.data[i + 2] = imageData.data[i + 2]
            splitData.data[i + 3] = imageData.data[i + 3]
          }
        }

        ctx.putImageData(splitData, bar.offset * 0.5, barY)
      }
    }

    // Random static
    if (Math.random() < 0.15) {
      const staticY = Math.random() * height
      const staticHeight = 5 + Math.random() * 20

      const imageData = ctx.createImageData(width, staticHeight)

      for (let i = 0; i < imageData.data.length; i += 4) {
        const gray = Math.random() * 255
        imageData.data[i] = gray
        imageData.data[i + 1] = gray
        imageData.data[i + 2] = gray
        imageData.data[i + 3] = 100
      }

      ctx.putImageData(imageData, 0, staticY)
    }

    // Vignette
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) / 2
    )
    gradient.addColorStop(0, 'transparent')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  cleanup(): void {
    this.scanlines = []
    this.glitchBars = []
    this.baseImageData = null
  }
}

export default new ScanLinesAnimation()
