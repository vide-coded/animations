/**
 * Starfield Animation
 * Moving star field with parallax effect
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface Star {
  x: number
  y: number
  z: number
  size: number
  speed: number
}

export class StarfieldAnimation implements Animation {
  name = 'Starfield'
  private stars: Star[] = []
  private readonly starCount = 300
  private centerX = 0
  private centerY = 0

  init(context: AnimationContext): void {
    const { width, height } = context
    this.centerX = width / 2
    this.centerY = height / 2
    this.stars = []

    for (let i = 0; i < this.starCount; i++) {
      this.stars.push(this.createStar(width, height))
    }
  }

  update(context: AnimationContext): void {
    const { width, height, deltaTime } = context
    const dt = deltaTime / 16

    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i]

      // Move star forward
      star.z -= star.speed * dt

      // Reset star if too close
      if (star.z <= 1) {
        this.stars[i] = this.createStar(width, height)
      }
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    // Clear with black
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    // Draw stars
    for (const star of this.stars) {
      // Project 3D position to 2D
      const scale = 1000 / star.z
      const x = this.centerX + (star.x - this.centerX) * scale
      const y = this.centerY + (star.y - this.centerY) * scale

      // Size based on depth
      const size = star.size * scale

      // Alpha based on depth (closer stars are brighter)
      const alpha = Math.min(1, (1000 - star.z) / 1000)

      // Skip stars outside viewport
      if (x < -10 || x > width + 10 || y < -10 || y > height + 10) {
        continue
      }

      ctx.save()
      ctx.globalAlpha = alpha

      // Draw star
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(x, y, Math.max(0.5, size), 0, Math.PI * 2)
      ctx.fill()

      // Motion blur for closer/faster stars
      if (star.z < 300) {
        const prevX = this.centerX + (star.x - this.centerX) * (1000 / (star.z + star.speed * 2))
        const prevY = this.centerY + (star.y - this.centerY) * (1000 / (star.z + star.speed * 2))

        ctx.globalAlpha = alpha * 0.3
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = size * 0.5
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      // Glow for bright stars
      if (alpha > 0.7) {
        ctx.globalAlpha = alpha * 0.4
        ctx.shadowColor = '#ffffff'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(x, y, size + 1, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }
  }

  cleanup(): void {
    this.stars = []
  }

  private createStar(width: number, height: number): Star {
    return {
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * 1000 + 100,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 3 + 2,
    }
  }
}

export default new StarfieldAnimation()
