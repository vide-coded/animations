/**
 * Gravity Field Animation
 * Particles attracted to gravity wells
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface GravityParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
}

interface GravityWell {
  x: number
  y: number
  strength: number
  radius: number
  color: string
}

export class GravityFieldAnimation implements Animation {
  name = 'Gravity Field'
  private particles: GravityParticle[] = []
  private wells: GravityWell[] = []
  private readonly particleCount = 200
  private readonly colors = ['#a78bfa', '#c084fc', '#e879f9', '#f0abfc']

  init(context: AnimationContext): void {
    const { width, height } = context
    this.particles = []
    this.wells = []

    // Create gravity wells
    const wellCount = 3
    for (let i = 0; i < wellCount; i++) {
      this.wells.push({
        x: (width / (wellCount + 1)) * (i + 1),
        y: height / 2,
        strength: 0.5,
        radius: 80,
        color: this.colors[i % this.colors.length],
      })
    }

    // Create particles
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 1 + Math.random() * 2,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
      })
    }
  }

  update(context: AnimationContext): void {
    const { width, height, deltaTime, time } = context
    const dt = deltaTime / 16

    // Animate wells
    for (let i = 0; i < this.wells.length; i++) {
      const well = this.wells[i]
      well.y = height / 2 + Math.sin(time * 0.001 + i) * 100
    }

    // Update particles
    for (const p of this.particles) {
      // Apply gravity from wells
      for (const well of this.wells) {
        const dx = well.x - p.x
        const dy = well.y - p.y
        const distSq = dx * dx + dy * dy
        const dist = Math.sqrt(distSq)

        if (dist > 1) {
          const force = (well.strength * 100) / distSq
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
      }

      // Update position
      p.x += p.vx * dt
      p.y += p.vy * dt

      // Damping
      p.vx *= 0.98
      p.vy *= 0.98

      // Wrap around edges
      if (p.x < 0) p.x = width
      if (p.x > width) p.x = 0
      if (p.y < 0) p.y = height
      if (p.y > height) p.y = 0
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = 'rgba(10, 10, 20, 0.2)'
    ctx.fillRect(0, 0, width, height)

    // Draw gravity wells
    for (const well of this.wells) {
      ctx.save()

      // Outer glow
      const gradient = ctx.createRadialGradient(well.x, well.y, 0, well.x, well.y, well.radius)
      gradient.addColorStop(0, `${well.color}40`)
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(well.x, well.y, well.radius, 0, Math.PI * 2)
      ctx.fill()

      // Core
      ctx.fillStyle = well.color
      ctx.globalAlpha = 0.6
      ctx.beginPath()
      ctx.arc(well.x, well.y, 8, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    // Draw particles
    for (const p of this.particles) {
      ctx.save()
      ctx.fillStyle = p.color
      ctx.globalAlpha = 0.7
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  cleanup(): void {
    this.particles = []
    this.wells = []
  }
}

export default new GravityFieldAnimation()
