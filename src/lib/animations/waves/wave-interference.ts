/**
 * Wave Interference Animation
 * Multiple wave sources creating interference patterns
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface WaveSource {
  x: number
  y: number
  frequency: number
  amplitude: number
  phase: number
}

export class WaveInterferenceAnimation implements Animation {
  name = 'Wave Interference'
  private sources: WaveSource[] = []
  private gridSize = 8

  init(context: AnimationContext): void {
    const { width, height } = context

    this.sources = [
      {
        x: width * 0.3,
        y: height * 0.5,
        frequency: 0.05,
        amplitude: 40,
        phase: 0,
      },
      {
        x: width * 0.7,
        y: height * 0.5,
        frequency: 0.055,
        amplitude: 40,
        phase: Math.PI,
      },
      {
        x: width * 0.5,
        y: height * 0.3,
        frequency: 0.048,
        amplitude: 35,
        phase: Math.PI / 2,
      },
    ]
  }

  update(context: AnimationContext): void {
    const { time } = context

    for (const source of this.sources) {
      source.phase = time * 0.002
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    // Draw interference pattern
    for (let x = 0; x < width; x += this.gridSize) {
      for (let y = 0; y < height; y += this.gridSize) {
        let amplitude = 0

        // Sum contributions from all sources
        for (const source of this.sources) {
          const dx = x - source.x
          const dy = y - source.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          const wave = Math.sin(distance * source.frequency - source.phase)
          amplitude += (wave * source.amplitude) / (1 + distance * 0.001)
        }

        // Map amplitude to color
        const normalized = (amplitude + 100) / 200 // Normalize to 0-1
        const hue = 200 + normalized * 80 // Blue to cyan
        const saturation = 70 + normalized * 30
        const lightness = 30 + normalized * 40

        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        ctx.fillRect(x, y, this.gridSize, this.gridSize)
      }
    }

    // Draw source points
    for (const source of this.sources) {
      ctx.save()
      ctx.fillStyle = '#ffffff'
      ctx.globalAlpha = 0.8
      ctx.beginPath()
      ctx.arc(source.x, source.y, 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalAlpha = 0.4
      ctx.shadowColor = '#ffffff'
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(source.x, source.y, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  cleanup(): void {
    this.sources = []
  }
}

export default new WaveInterferenceAnimation()
