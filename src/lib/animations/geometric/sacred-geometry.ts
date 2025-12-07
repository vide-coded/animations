/**
 * Sacred Geometry Animation
 * Rotating sacred geometry patterns
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface GeometryLayer {
  radius: number
  rotation: number
  rotationSpeed: number
  sides: number
  color: string
  lineWidth: number
}

export class SacredGeometryAnimation implements Animation {
  name = 'Sacred Geometry'
  private layers: GeometryLayer[] = []

  init(): void {
    this.layers = []

    const colors = ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e']

    // Create multiple geometric layers
    this.layers = [
      {
        radius: 60,
        rotation: 0,
        rotationSpeed: 0.01,
        sides: 6,
        color: colors[0],
        lineWidth: 2,
      },
      {
        radius: 100,
        rotation: 0,
        rotationSpeed: -0.008,
        sides: 12,
        color: colors[1],
        lineWidth: 1.5,
      },
      {
        radius: 140,
        rotation: 0,
        rotationSpeed: 0.006,
        sides: 8,
        color: colors[2],
        lineWidth: 2,
      },
      {
        radius: 180,
        rotation: 0,
        rotationSpeed: -0.005,
        sides: 16,
        color: colors[3],
        lineWidth: 1,
      },
      {
        radius: 220,
        rotation: 0,
        rotationSpeed: 0.004,
        sides: 24,
        color: colors[4],
        lineWidth: 1.5,
      },
    ]
  }

  update(context: AnimationContext): void {
    const { deltaTime } = context
    const dt = deltaTime / 16

    for (const layer of this.layers) {
      layer.rotation += layer.rotationSpeed * dt
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    const centerX = width / 2
    const centerY = height / 2

    // Draw each layer
    for (const layer of this.layers) {
      this.drawPolygon(ctx, centerX, centerY, layer)

      // Draw connecting lines to center
      if (layer.sides <= 12) {
        this.drawSpokes(ctx, centerX, centerY, layer)
      }

      // Draw vertices
      this.drawVertices(ctx, centerX, centerY, layer)
    }

    // Draw center point
    ctx.save()
    ctx.fillStyle = '#fbbf24'
    ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.globalAlpha = 0.4
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  private drawPolygon(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    layer: GeometryLayer
  ): void {
    ctx.save()
    ctx.strokeStyle = layer.color
    ctx.lineWidth = layer.lineWidth
    ctx.globalAlpha = 0.6

    ctx.beginPath()

    for (let i = 0; i <= layer.sides; i++) {
      const angle = (Math.PI * 2 * i) / layer.sides + layer.rotation
      const x = centerX + Math.cos(angle) * layer.radius
      const y = centerY + Math.sin(angle) * layer.radius

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()

    // Glow
    ctx.globalAlpha = 0.2
    ctx.shadowColor = layer.color
    ctx.shadowBlur = 10
    ctx.stroke()

    ctx.restore()
  }

  private drawSpokes(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    layer: GeometryLayer
  ): void {
    ctx.save()
    ctx.strokeStyle = layer.color
    ctx.lineWidth = 0.5
    ctx.globalAlpha = 0.3

    for (let i = 0; i < layer.sides; i++) {
      const angle = (Math.PI * 2 * i) / layer.sides + layer.rotation
      const x = centerX + Math.cos(angle) * layer.radius
      const y = centerY + Math.sin(angle) * layer.radius

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()
    }

    ctx.restore()
  }

  private drawVertices(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    layer: GeometryLayer
  ): void {
    ctx.save()
    ctx.fillStyle = layer.color
    ctx.globalAlpha = 0.7

    for (let i = 0; i < layer.sides; i++) {
      const angle = (Math.PI * 2 * i) / layer.sides + layer.rotation
      const x = centerX + Math.cos(angle) * layer.radius
      const y = centerY + Math.sin(angle) * layer.radius

      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  cleanup(): void {
    this.layers = []
  }
}

export default new SacredGeometryAnimation()
