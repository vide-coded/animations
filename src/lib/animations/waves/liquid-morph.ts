/**
 * Liquid Morph Animation
 * Organic morphing blob using metaballs
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface Metaball {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  angle: number
  speed: number
}

export class LiquidMorphAnimation implements Animation {
  name = 'Liquid Morph'
  private metaballs: Metaball[] = []
  private readonly ballCount = 8
  private gridSize = 4

  init(context: AnimationContext): void {
    const { width, height } = context
    this.metaballs = []

    const centerX = width / 2
    const centerY = height / 2

    for (let i = 0; i < this.ballCount; i++) {
      const angle = (Math.PI * 2 * i) / this.ballCount

      this.metaballs.push({
        x: centerX + Math.cos(angle) * 100,
        y: centerY + Math.sin(angle) * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 40 + Math.random() * 40,
        angle: angle,
        speed: 0.5 + Math.random() * 1,
      })
    }
  }

  update(context: AnimationContext): void {
    const { width, height, deltaTime, time } = context
    const dt = deltaTime / 16

    const centerX = width / 2
    const centerY = height / 2

    for (const ball of this.metaballs) {
      // Orbital motion
      ball.angle += 0.01 * ball.speed * dt

      const targetX =
        centerX + Math.cos(ball.angle) * 150 + Math.sin(time * 0.001 * ball.speed) * 50
      const targetY =
        centerY + Math.sin(ball.angle) * 150 + Math.cos(time * 0.001 * ball.speed) * 50

      // Move towards target
      ball.vx += (targetX - ball.x) * 0.002
      ball.vy += (targetY - ball.y) * 0.002

      // Damping
      ball.vx *= 0.95
      ball.vy *= 0.95

      ball.x += ball.vx * dt
      ball.y += ball.vy * dt

      // Pulsing radius
      ball.radius = 40 + Math.sin(time * 0.002 * ball.speed + ball.angle) * 20
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    // Calculate metaball field
    const threshold = 1.0

    for (let x = 0; x < width; x += this.gridSize) {
      for (let y = 0; y < height; y += this.gridSize) {
        let sum = 0

        for (const ball of this.metaballs) {
          const dx = x - ball.x
          const dy = y - ball.y
          const distSq = dx * dx + dy * dy

          if (distSq > 0) {
            sum += (ball.radius * ball.radius) / distSq
          }
        }

        if (sum > threshold) {
          // Color based on intensity
          const intensity = Math.min(1, sum / 3)
          const hue = 280 + intensity * 60
          const saturation = 60 + intensity * 40
          const lightness = 40 + intensity * 30

          ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
          ctx.fillRect(x, y, this.gridSize, this.gridSize)

          // Add glow to high intensity areas
          if (sum > threshold * 2) {
            ctx.save()
            ctx.globalAlpha = 0.3
            ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
            ctx.shadowBlur = 15
            ctx.fillRect(x, y, this.gridSize, this.gridSize)
            ctx.restore()
          }
        }
      }
    }
  }

  cleanup(): void {
    this.metaballs = []
  }
}

export default new LiquidMorphAnimation()
