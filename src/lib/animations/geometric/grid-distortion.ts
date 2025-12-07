/**
 * Grid Distortion Animation
 * Distorted grid with wave effects
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface GridPoint {
  x: number
  y: number
  baseX: number
  baseY: number
}

export class GridDistortionAnimation implements Animation {
  name = 'Grid Distortion'
  private grid: GridPoint[][] = []
  private readonly cols = 30
  private readonly rows = 20

  init(context: AnimationContext): void {
    const { width, height } = context
    this.grid = []

    const cellWidth = width / (this.cols - 1)
    const cellHeight = height / (this.rows - 1)

    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = []

      for (let col = 0; col < this.cols; col++) {
        const x = col * cellWidth
        const y = row * cellHeight

        this.grid[row][col] = {
          x,
          y,
          baseX: x,
          baseY: y,
        }
      }
    }
  }

  update(context: AnimationContext): void {
    const { time, width, height } = context

    const centerX = width / 2
    const centerY = height / 2

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const point = this.grid[row][col]

        // Multiple wave distortions
        const wave1 = Math.sin(point.baseX * 0.01 + time * 0.001) * 20
        const wave2 = Math.cos(point.baseY * 0.015 + time * 0.0015) * 20

        // Radial distortion
        const dx = point.baseX - centerX
        const dy = point.baseY - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const angle = Math.atan2(dy, dx)

        const radialWave = Math.sin(distance * 0.02 - time * 0.002) * 15

        point.x = point.baseX + wave1 + Math.cos(angle) * radialWave
        point.y = point.baseY + wave2 + Math.sin(angle) * radialWave
      }
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 1.5

    // Draw horizontal lines
    for (let row = 0; row < this.rows; row++) {
      ctx.save()
      ctx.globalAlpha = 0.6

      ctx.beginPath()
      ctx.moveTo(this.grid[row][0].x, this.grid[row][0].y)

      for (let col = 1; col < this.cols; col++) {
        ctx.lineTo(this.grid[row][col].x, this.grid[row][col].y)
      }

      ctx.stroke()

      // Glow
      ctx.globalAlpha = 0.2
      ctx.shadowColor = '#3b82f6'
      ctx.shadowBlur = 8
      ctx.stroke()

      ctx.restore()
    }

    // Draw vertical lines
    for (let col = 0; col < this.cols; col++) {
      ctx.save()
      ctx.globalAlpha = 0.6

      ctx.beginPath()
      ctx.moveTo(this.grid[0][col].x, this.grid[0][col].y)

      for (let row = 1; row < this.rows; row++) {
        ctx.lineTo(this.grid[row][col].x, this.grid[row][col].y)
      }

      ctx.stroke()

      // Glow
      ctx.globalAlpha = 0.2
      ctx.shadowColor = '#3b82f6'
      ctx.shadowBlur = 8
      ctx.stroke()

      ctx.restore()
    }

    // Draw intersection points
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const point = this.grid[row][col]

        ctx.save()
        ctx.fillStyle = '#3b82f6'
        ctx.globalAlpha = 0.4
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }
  }

  cleanup(): void {
    this.grid = []
  }
}

export default new GridDistortionAnimation()
