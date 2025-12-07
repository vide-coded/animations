/**
 * Explosion Animation
 * Continuous explosions with particle debris
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface ExplosionParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  alpha: number
}

export class ExplosionAnimation implements Animation {
  name = 'Explosion'
  private particles: ExplosionParticle[] = []
  private explosionTimer = 0
  private explosionInterval = 800
  private readonly colors = ['#ff6b6b', '#ff8c42', '#ffd93d', '#fcf6bd']

  init(context: AnimationContext): void {
    this.particles = []
    this.explosionTimer = 0

    // Initial explosion
    this.createExplosion(context.width / 2, context.height / 2)
  }

  update(context: AnimationContext): void {
    const { deltaTime, width, height } = context

    // Spawn new explosions
    this.explosionTimer += deltaTime
    if (this.explosionTimer >= this.explosionInterval) {
      this.explosionTimer = 0
      const x = 100 + Math.random() * (width - 200)
      const y = 100 + Math.random() * (height - 200)
      this.createExplosion(x, y)
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]

      p.x += p.vx * (deltaTime / 16)
      p.y += p.vy * (deltaTime / 16)

      // Gravity
      p.vy += 0.2

      // Air resistance
      p.vx *= 0.99
      p.vy *= 0.99

      p.life -= deltaTime
      p.alpha = Math.max(0, p.life / p.maxLife)

      if (p.life <= 0) {
        this.particles.splice(i, 1)
      }
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = 'rgba(10, 10, 20, 0.15)'
    ctx.fillRect(0, 0, width, height)

    for (const p of this.particles) {
      ctx.save()
      ctx.globalAlpha = p.alpha

      // Particle
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()

      // Glow
      ctx.globalAlpha = p.alpha * 0.5
      ctx.shadowColor = p.color
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size + 2, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }
  }

  cleanup(): void {
    this.particles = []
  }

  private createExplosion(x: number, y: number): void {
    const particleCount = 50 + Math.random() * 30

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5
      const speed = 3 + Math.random() * 6

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 800 + Math.random() * 1200,
        maxLife: 1500,
        size: 2 + Math.random() * 4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: 1,
      })
    }
  }
}

export default new ExplosionAnimation()
