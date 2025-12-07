/**
 * Fireflies Animation
 * Glowing particles floating with random movement
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface Firefly {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  brightness: number
  brightnessSpeed: number
  color: string
}

export class FirefliesAnimation implements Animation {
  name = 'Fireflies'
  private fireflies: Firefly[] = []
  private readonly count = 80
  private readonly colors = ['#ffd700', '#ffed4e', '#fff8dc', '#fffacd']

  init(context: AnimationContext): void {
    const { width, height } = context
    this.fireflies = []

    for (let i = 0; i < this.count; i++) {
      this.fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 2 + Math.random() * 2,
        brightness: Math.random(),
        brightnessSpeed: 0.01 + Math.random() * 0.02,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
      })
    }
  }

  update(context: AnimationContext): void {
    const { width, height, deltaTime } = context
    const dt = deltaTime / 16

    for (const fly of this.fireflies) {
      // Update position
      fly.x += fly.vx * dt
      fly.y += fly.vy * dt

      // Random direction changes
      if (Math.random() < 0.02) {
        fly.vx += (Math.random() - 0.5) * 0.1
        fly.vy += (Math.random() - 0.5) * 0.1
      }

      // Limit velocity
      const speed = Math.sqrt(fly.vx * fly.vx + fly.vy * fly.vy)
      if (speed > 0.5) {
        fly.vx = (fly.vx / speed) * 0.5
        fly.vy = (fly.vy / speed) * 0.5
      }

      // Wrap around edges
      if (fly.x < 0) fly.x = width
      if (fly.x > width) fly.x = 0
      if (fly.y < 0) fly.y = height
      if (fly.y > height) fly.y = 0

      // Pulsing brightness
      fly.brightness += fly.brightnessSpeed * dt
      if (fly.brightness > 1 || fly.brightness < 0) {
        fly.brightnessSpeed *= -1
      }
      fly.brightness = Math.max(0, Math.min(1, fly.brightness))
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    // Dark background with fade trail
    ctx.fillStyle = 'rgba(10, 10, 20, 0.1)'
    ctx.fillRect(0, 0, width, height)

    for (const fly of this.fireflies) {
      const alpha = fly.brightness * 0.8

      ctx.save()
      ctx.globalAlpha = alpha

      // Core
      ctx.fillStyle = fly.color
      ctx.beginPath()
      ctx.arc(fly.x, fly.y, fly.size, 0, Math.PI * 2)
      ctx.fill()

      // Glow
      ctx.globalAlpha = alpha * 0.5
      ctx.shadowColor = fly.color
      ctx.shadowBlur = 20 * fly.brightness
      ctx.beginPath()
      ctx.arc(fly.x, fly.y, fly.size * 2, 0, Math.PI * 2)
      ctx.fill()

      // Outer glow
      ctx.globalAlpha = alpha * 0.2
      ctx.shadowBlur = 30 * fly.brightness
      ctx.beginPath()
      ctx.arc(fly.x, fly.y, fly.size * 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }
  }

  cleanup(): void {
    this.fireflies = []
  }
}

export default new FirefliesAnimation()
