/**
 * Line Waves Animation
 * Flowing lines creating wave patterns
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface WaveLine {
  points: Array<{ x: number; y: number }>
  baseY: number
  amplitude: number
  frequency: number
  phase: number
  speed: number
  color: string
  width: number
}

export class LineWavesAnimation implements Animation {
  name = 'Line Waves'
  private lines: WaveLine[] = []
  private readonly lineCount = 20
  private readonly pointCount = 100

  init(context: AnimationContext): void {
    const { width, height } = context
    this.lines = []

    const colors = [
      '#06b6d4',
      '#0ea5e9',
      '#3b82f6',
      '#6366f1',
      '#8b5cf6',
      '#a855f7',
      '#d946ef',
      '#ec4899',
      '#f43f5e',
      '#ef4444',
    ]

    for (let i = 0; i < this.lineCount; i++) {
      const baseY = (height / (this.lineCount + 1)) * (i + 1)
      const points: Array<{ x: number; y: number }> = []

      for (let j = 0; j < this.pointCount; j++) {
        points.push({
          x: (width / (this.pointCount - 1)) * j,
          y: baseY,
        })
      }

      this.lines.push({
        points,
        baseY,
        amplitude: 20 + Math.random() * 30,
        frequency: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
        color: colors[i % colors.length],
        width: 2 + Math.random(),
      })
    }
  }

  update(context: AnimationContext): void {
    const { time } = context

    for (const line of this.lines) {
      line.phase = time * line.speed * 0.001

      for (let i = 0; i < line.points.length; i++) {
        const point = line.points[i]

        // Multiple wave frequencies
        const wave1 = Math.sin(i * line.frequency + line.phase) * line.amplitude
        const wave2 = Math.sin(i * line.frequency * 2 - line.phase * 1.5) * (line.amplitude * 0.5)
        const wave3 = Math.sin(i * line.frequency * 0.5 + line.phase * 0.8) * (line.amplitude * 0.3)

        point.y = line.baseY + wave1 + wave2 + wave3
      }
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    for (const line of this.lines) {
      // Draw main line
      ctx.save()
      ctx.strokeStyle = line.color
      ctx.lineWidth = line.width
      ctx.globalAlpha = 0.7
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(line.points[0].x, line.points[0].y)

      // Smooth curve using quadratic curves
      for (let i = 1; i < line.points.length - 1; i++) {
        const current = line.points[i]
        const next = line.points[i + 1]
        const midX = (current.x + next.x) / 2
        const midY = (current.y + next.y) / 2

        ctx.quadraticCurveTo(current.x, current.y, midX, midY)
      }

      const last = line.points[line.points.length - 1]
      ctx.lineTo(last.x, last.y)
      ctx.stroke()

      // Draw glow
      ctx.globalAlpha = 0.3
      ctx.lineWidth = line.width + 3
      ctx.shadowColor = line.color
      ctx.shadowBlur = 10
      ctx.stroke()

      ctx.restore()

      // Draw gradient fill below line
      ctx.save()
      ctx.globalAlpha = 0.1

      const gradient = ctx.createLinearGradient(0, line.baseY - 50, 0, line.baseY + 50)
      gradient.addColorStop(0, 'transparent')
      gradient.addColorStop(0.5, `${line.color}40`)
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.moveTo(line.points[0].x, line.points[0].y)

      for (let i = 1; i < line.points.length - 1; i++) {
        const current = line.points[i]
        const next = line.points[i + 1]
        const midX = (current.x + next.x) / 2
        const midY = (current.y + next.y) / 2
        ctx.quadraticCurveTo(current.x, current.y, midX, midY)
      }

      ctx.lineTo(last.x, last.y)
      ctx.lineTo(last.x, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fill()

      ctx.restore()
    }
  }

  cleanup(): void {
    this.lines = []
  }
}

export default new LineWavesAnimation()
