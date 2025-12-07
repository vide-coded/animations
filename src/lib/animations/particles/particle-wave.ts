/**
 * Particle Wave Animation
 * Particles arranged in wave formations
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface WaveParticle {
  baseX: number
  baseY: number
  x: number
  y: number
  size: number
  color: string
  phase: number
  speed: number
}

export class ParticleWaveAnimation implements Animation {
  name = 'Particle Wave'
  private particles: WaveParticle[] = []
  private readonly rows = 15
  private readonly cols = 30
  private readonly colors = ['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8']

  init(context: AnimationContext): void {
    const { width, height } = context
    this.particles = []

    const spacingX = width / (this.cols + 1)
    const spacingY = height / (this.rows + 1)

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const baseX = (col + 1) * spacingX
        const baseY = (row + 1) * spacingY

        this.particles.push({
          baseX,
          baseY,
          x: baseX,
          y: baseY,
          size: 2 + Math.random() * 2,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          phase: Math.random() * Math.PI * 2,
          speed: 0.01 + Math.random() * 0.01,
        })
      }
    }
  }

  update(context: AnimationContext): void {
    const { time } = context

    for (const p of this.particles) {
      const waveOffset = Math.sin(p.phase + time * 0.001 * p.speed) * 30
      p.y = p.baseY + waveOffset
      p.x = p.baseX + Math.cos(p.phase * 0.5 + time * 0.0005 * p.speed) * 15
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    for (const p of this.particles) {
      ctx.save()
      ctx.globalAlpha = 0.8
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()

      // Glow effect
      ctx.globalAlpha = 0.3
      ctx.shadowColor = p.color
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size + 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  cleanup(): void {
    this.particles = []
  }
}

export default new ParticleWaveAnimation()
