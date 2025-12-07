/**
 * DNA Helix Animation
 * Double helix structure made of particles
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface HelixParticle {
  angle: number
  height: number
  size: number
  color: string
  strand: number // 0 or 1
}

export class DNAHelixAnimation implements Animation {
  name = 'DNA Helix'
  private particles: HelixParticle[] = []
  private rotation = 0
  private readonly particlesPerStrand = 100
  private readonly helixRadius = 80
  private readonly helixHeight = 600

  init(): void {
    this.particles = []
    this.rotation = 0

    // Create two strands
    for (let strand = 0; strand < 2; strand++) {
      const offset = strand * Math.PI
      const color = strand === 0 ? '#3b82f6' : '#8b5cf6'

      for (let i = 0; i < this.particlesPerStrand; i++) {
        const t = i / this.particlesPerStrand

        this.particles.push({
          angle: t * Math.PI * 4 + offset,
          height: t,
          size: 3,
          color,
          strand,
        })
      }
    }
  }

  update(context: AnimationContext): void {
    const { deltaTime } = context
    this.rotation += deltaTime * 0.0005
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    const centerX = width / 2
    const startY = (height - this.helixHeight) / 2

    // Draw connecting lines
    ctx.save()
    ctx.strokeStyle = '#4b5563'
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.3

    for (let i = 0; i < this.particlesPerStrand; i++) {
      const p1 = this.particles[i]
      const p2 = this.particles[i + this.particlesPerStrand]

      const x1 = centerX + Math.cos(p1.angle + this.rotation) * this.helixRadius
      const y1 = startY + p1.height * this.helixHeight
      const x2 = centerX + Math.cos(p2.angle + this.rotation) * this.helixRadius
      const y2 = startY + p2.height * this.helixHeight

      // Only draw connection if particles are roughly aligned
      if (Math.abs(y1 - y2) < 10) {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    }
    ctx.restore()

    // Sort particles by depth for proper rendering
    const sortedParticles = [...this.particles].sort((a, b) => {
      const zA = Math.sin(a.angle + this.rotation)
      const zB = Math.sin(b.angle + this.rotation)
      return zA - zB
    })

    // Draw particles
    for (const p of sortedParticles) {
      const x = centerX + Math.cos(p.angle + this.rotation) * this.helixRadius
      const y = startY + p.height * this.helixHeight
      const z = Math.sin(p.angle + this.rotation)
      const depth = (z + 1) / 2 // 0 to 1

      ctx.save()
      ctx.globalAlpha = 0.5 + depth * 0.5

      // Particle
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(x, y, p.size * (0.7 + depth * 0.3), 0, Math.PI * 2)
      ctx.fill()

      // Glow
      ctx.globalAlpha = (0.3 + depth * 0.3) * 0.5
      ctx.shadowColor = p.color
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(x, y, p.size * (0.7 + depth * 0.3) + 2, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }
  }

  cleanup(): void {
    this.particles = []
  }
}

export default new DNAHelixAnimation()
