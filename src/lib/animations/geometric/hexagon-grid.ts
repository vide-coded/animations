/**
 * Hexagon Grid Animation
 * Pulsing hexagonal grid pattern
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface Hexagon {
  x: number
  y: number
  size: number
  phase: number
  brightness: number
}

export class HexagonGridAnimation implements Animation {
  name = 'Hexagon Grid'
  private hexagons: Hexagon[] = []
  private readonly hexSize = 25

  init(context: AnimationContext): void {
    const { width, height } = context
    this.hexagons = []

    const hexWidth = this.hexSize * Math.sqrt(3)
    const hexHeight = this.hexSize * 2

    const cols = Math.ceil(width / hexWidth) + 2
    const rows = Math.ceil(height / (hexHeight * 0.75)) + 2

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * hexWidth + (row % 2) * (hexWidth / 2) - hexWidth
        const y = row * hexHeight * 0.75 - hexHeight

        const dx = x - width / 2
        const dy = y - height / 2
        const distance = Math.sqrt(dx * dx + dy * dy)

        this.hexagons.push({
          x,
          y,
          size: this.hexSize,
          phase: distance * 0.01,
          brightness: 0,
        })
      }
    }
  }

  update(context: AnimationContext): void {
    const { time } = context

    for (const hex of this.hexagons) {
      hex.brightness = (Math.sin(time * 0.002 - hex.phase) + 1) / 2
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    for (const hex of this.hexagons) {
      this.drawHexagon(ctx, hex)
    }
  }

  private drawHexagon(ctx: CanvasRenderingContext2D, hex: Hexagon): void {
    const size = hex.size
    const points: Array<{ x: number; y: number }> = []

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i
      points.push({
        x: hex.x + Math.cos(angle) * size,
        y: hex.y + Math.sin(angle) * size,
      })
    }

    // Color based on brightness
    const hue = 180 + hex.brightness * 80
    const saturation = 60 + hex.brightness * 40
    const lightness = 20 + hex.brightness * 40

    ctx.save()

    // Fill
    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    ctx.globalAlpha = 0.3 + hex.brightness * 0.4

    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }

    ctx.closePath()
    ctx.fill()

    // Stroke
    ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness + 20}%)`
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.5 + hex.brightness * 0.5
    ctx.stroke()

    // Glow for bright hexagons
    if (hex.brightness > 0.7) {
      ctx.globalAlpha = (hex.brightness - 0.7) * 0.5
      ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
      ctx.shadowBlur = 15
      ctx.stroke()
    }

    ctx.restore()
  }

  cleanup(): void {
    this.hexagons = []
  }
}

export default new HexagonGridAnimation()
