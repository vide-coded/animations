/**
 * Constellation Animation
 * Connected particle network forming constellation patterns
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface ConstellationNode {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  connections: number[]
}

export class ConstellationAnimation implements Animation {
  name = 'Constellation'
  private nodes: ConstellationNode[] = []
  private readonly nodeCount = 60
  private readonly maxDistance = 150

  init(context: AnimationContext): void {
    const { width, height } = context
    this.nodes = []

    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 2 + Math.random() * 2,
        connections: [],
      })
    }
  }

  update(context: AnimationContext): void {
    const { width, height, deltaTime } = context
    const dt = deltaTime / 16

    for (const node of this.nodes) {
      node.x += node.vx * dt
      node.y += node.vy * dt

      // Bounce off edges
      if (node.x < 0 || node.x > width) node.vx *= -1
      if (node.y < 0 || node.y > height) node.vy *= -1

      // Keep in bounds
      node.x = Math.max(0, Math.min(width, node.x))
      node.y = Math.max(0, Math.min(height, node.y))
    }

    // Calculate connections
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].connections = []

      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[j].x - this.nodes[i].x
        const dy = this.nodes[j].y - this.nodes[i].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < this.maxDistance) {
          this.nodes[i].connections.push(j)
        }
      }
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    // Draw connections
    ctx.strokeStyle = '#4ecdc4'
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i]

      for (const j of node.connections) {
        const target = this.nodes[j]
        const dx = target.x - node.x
        const dy = target.y - node.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const opacity = 1 - distance / this.maxDistance

        ctx.save()
        ctx.globalAlpha = opacity * 0.4
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(node.x, node.y)
        ctx.lineTo(target.x, target.y)
        ctx.stroke()
        ctx.restore()
      }
    }

    // Draw nodes
    for (const node of this.nodes) {
      ctx.save()
      ctx.fillStyle = '#4ecdc4'
      ctx.globalAlpha = 0.8
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
      ctx.fill()

      // Glow
      ctx.globalAlpha = 0.4
      ctx.shadowColor = '#4ecdc4'
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.size + 1, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  cleanup(): void {
    this.nodes = []
  }
}

export default new ConstellationAnimation()
