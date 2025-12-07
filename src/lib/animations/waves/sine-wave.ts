/**
 * Sine Wave Animation
 * Flowing sine waves with gradient colors
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface Wave {
  amplitude: number
  frequency: number
  phase: number
  speed: number
  color: string
  width: number
}

export class SineWaveAnimation implements Animation {
  name = 'Sine Wave'
  private waves: Wave[] = []

  init(context: AnimationContext): void {
    const { height } = context

    this.waves = [
      {
        amplitude: height * 0.1,
        frequency: 0.02,
        phase: 0,
        speed: 0.02,
        color: '#ff6b6b',
        width: 3,
      },
      {
        amplitude: height * 0.08,
        frequency: 0.025,
        phase: Math.PI / 3,
        speed: 0.025,
        color: '#4ecdc4',
        width: 2.5,
      },
      {
        amplitude: height * 0.12,
        frequency: 0.015,
        phase: Math.PI / 2,
        speed: 0.018,
        color: '#45b7d1',
        width: 3.5,
      },
      {
        amplitude: height * 0.09,
        frequency: 0.022,
        phase: Math.PI,
        speed: 0.028,
        color: '#f9ca24',
        width: 2,
      },
      {
        amplitude: height * 0.11,
        frequency: 0.018,
        phase: Math.PI * 1.5,
        speed: 0.022,
        color: '#6c5ce7',
        width: 2.8,
      },
    ]
  }

  update(context: AnimationContext): void {
    const { deltaTime } = context

    // Update wave phases
    for (const wave of this.waves) {
      wave.phase += wave.speed * (deltaTime / 16)
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    // Clear background
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    // Draw each wave
    const centerY = height / 2

    for (const wave of this.waves) {
      ctx.save()
      ctx.strokeStyle = wave.color
      ctx.lineWidth = wave.width
      ctx.globalAlpha = 0.6

      ctx.beginPath()

      // Draw wave path
      for (let x = 0; x <= width; x += 2) {
        const y = centerY + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()
      ctx.restore()

      // Draw glow effect
      ctx.save()
      ctx.strokeStyle = wave.color
      ctx.lineWidth = wave.width + 4
      ctx.globalAlpha = 0.2
      ctx.shadowColor = wave.color
      ctx.shadowBlur = 15

      ctx.beginPath()
      for (let x = 0; x <= width; x += 4) {
        const y = centerY + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()
      ctx.restore()
    }
  }

  cleanup(): void {
    this.waves = []
  }
}

export default new SineWaveAnimation()
