/**
 * Particle Burst Animation
 * Particles explode from center and fade out
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface Particle {
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

// Animation parameters with defaults
interface ParticleBurstParams {
  particleCount: number
  particleSpeed: number
  particleSize: number
  gravity: number
  spawnRate: number
  primaryColor: string
  showTrails: boolean
}

export class ParticleBurstAnimation implements Animation {
  name = 'Particle Burst'
  private particles: Particle[] = []
  private colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe']
  private spawnTimer = 0
  private params: ParticleBurstParams = {
    particleCount: 40,
    particleSpeed: 3,
    particleSize: 3,
    gravity: 0.15,
    spawnRate: 50,
    primaryColor: '#ff6b6b',
    showTrails: true,
  }

  init(context: AnimationContext): void {
    this.particles = []
    this.spawnTimer = 0

    // Update params from context if provided
    if (context.params) {
      this.params = { ...this.params, ...context.params }
      // Update colors array to include primary color
      if (this.params.primaryColor) {
        this.colors = [this.params.primaryColor, ...this.colors.slice(1)]
      }
    }

    // Initial burst
    this.createBurst(context.width / 2, context.height / 2)
  }

  update(context: AnimationContext): void {
    const { deltaTime, width, height, params } = context

    // Update params dynamically
    if (params) {
      this.params = { ...this.params, ...params }
      // Update colors array if primary color changed
      if (params.primaryColor) {
        this.colors = [params.primaryColor as string, ...this.colors.slice(1)]
      }
    }

    // Spawn new bursts periodically
    this.spawnTimer += deltaTime
    if (this.spawnTimer >= this.params.spawnRate) {
      this.spawnTimer = 0

      // Random position for new burst
      const x = Math.random() * width
      const y = Math.random() * height
      this.createBurst(x, y)
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]

      // Update position
      p.x += p.vx * (deltaTime / 16)
      p.y += p.vy * (deltaTime / 16)

      // Apply gravity
      p.vy += this.params.gravity

      // Update life
      p.life -= deltaTime
      p.alpha = Math.max(0, p.life / p.maxLife)

      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1)
      }
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D

    // Clear with fade effect (trails)
    if (this.params.showTrails) {
      ctx.fillStyle = 'rgba(10, 10, 20, 0.1)'
    } else {
      ctx.fillStyle = 'rgb(10, 10, 20)'
    }
    ctx.fillRect(0, 0, context.width, context.height)

    // Draw particles
    for (const p of this.particles) {
      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  cleanup(): void {
    this.particles = []
  }

  private createBurst(x: number, y: number): void {
    const count = this.params.particleCount + Math.random() * 20

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const speed = this.params.particleSpeed * (0.5 + Math.random() * 0.5)

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1000 + Math.random() * 1000,
        maxLife: 1500,
        size: this.params.particleSize * (0.7 + Math.random() * 0.6),
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: 1,
      })
    }
  }
}

export default new ParticleBurstAnimation()
