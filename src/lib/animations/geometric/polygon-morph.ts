/**
 * Polygon Morph Animation
 * Morphing between different polygon shapes
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface Polygon {
  points: Array<{ x: number; y: number }>
  targetPoints: Array<{ x: number; y: number }>
  color: string
  morphProgress: number
}

export class PolygonMorphAnimation implements Animation {
  name = 'Polygon Morph'
  private polygons: Polygon[] = []
  private readonly polygonCount = 5
  private morphTimer = 0
  private readonly morphDuration = 3000

  init(context: AnimationContext): void {
    const { width, height } = context
    this.polygons = []
    this.morphTimer = 0

    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6']
    const centerX = width / 2
    const centerY = height / 2

    for (let i = 0; i < this.polygonCount; i++) {
      const angle = (Math.PI * 2 * i) / this.polygonCount
      const distance = 150 + i * 30
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      const sides = 3 + Math.floor(Math.random() * 5)

      this.polygons.push({
        points: this.generatePolygon(x, y, 40 + i * 10, sides),
        targetPoints: this.generatePolygon(x, y, 40 + i * 10, sides),
        color: colors[i],
        morphProgress: 0,
      })
    }
  }

  update(context: AnimationContext): void {
    const { deltaTime, width, height } = context

    this.morphTimer += deltaTime

    if (this.morphTimer >= this.morphDuration) {
      this.morphTimer = 0

      // Generate new targets
      const centerX = width / 2
      const centerY = height / 2

      for (let i = 0; i < this.polygons.length; i++) {
        const polygon = this.polygons[i]
        const angle = (Math.PI * 2 * i) / this.polygonCount
        const distance = 150 + i * 30
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance

        polygon.points = polygon.targetPoints

        const newSides = 3 + Math.floor(Math.random() * 5)
        polygon.targetPoints = this.generatePolygon(x, y, 40 + i * 10, newSides)
        polygon.morphProgress = 0
      }
    }

    // Update morph progress
    const progress = this.morphTimer / this.morphDuration

    for (const polygon of this.polygons) {
      polygon.morphProgress = this.easeInOutCubic(progress)
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    for (const polygon of this.polygons) {
      const currentPoints = this.interpolatePoints(
        polygon.points,
        polygon.targetPoints,
        polygon.morphProgress
      )

      // Draw filled polygon
      ctx.save()
      ctx.fillStyle = `${polygon.color}40`
      ctx.strokeStyle = polygon.color
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.moveTo(currentPoints[0].x, currentPoints[0].y)

      for (let i = 1; i < currentPoints.length; i++) {
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y)
      }

      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Glow effect
      ctx.globalAlpha = 0.3
      ctx.shadowColor = polygon.color
      ctx.shadowBlur = 15
      ctx.stroke()

      ctx.restore()

      // Draw vertices
      for (const point of currentPoints) {
        ctx.save()
        ctx.fillStyle = polygon.color
        ctx.globalAlpha = 0.8
        ctx.beginPath()
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }
  }

  private generatePolygon(
    cx: number,
    cy: number,
    radius: number,
    sides: number
  ): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = []

    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2
      const r = radius + (Math.random() - 0.5) * radius * 0.2

      points.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
      })
    }

    return points
  }

  private interpolatePoints(
    from: Array<{ x: number; y: number }>,
    to: Array<{ x: number; y: number }>,
    progress: number
  ): Array<{ x: number; y: number }> {
    const maxLength = Math.max(from.length, to.length)
    const result: Array<{ x: number; y: number }> = []

    for (let i = 0; i < maxLength; i++) {
      const fromPoint = from[i % from.length]
      const toPoint = to[i % to.length]

      result.push({
        x: fromPoint.x + (toPoint.x - fromPoint.x) * progress,
        y: fromPoint.y + (toPoint.y - fromPoint.y) * progress,
      })
    }

    return result
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
  }

  cleanup(): void {
    this.polygons = []
  }
}

export default new PolygonMorphAnimation()
