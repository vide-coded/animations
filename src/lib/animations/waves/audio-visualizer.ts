/**
 * Audio Visualizer Animation
 * Simulated audio spectrum visualization
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface FrequencyBar {
  value: number
  targetValue: number
  peak: number
  peakDecay: number
}

export class AudioVisualizerAnimation implements Animation {
  name = 'Audio Visualizer'
  private bars: FrequencyBar[] = []
  private readonly barCount = 64
  private beatTimer = 0
  private readonly colors = ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff']

  init(): void {
    this.bars = []
    this.beatTimer = 0

    for (let i = 0; i < this.barCount; i++) {
      this.bars.push({
        value: 0,
        targetValue: 0,
        peak: 0,
        peakDecay: 0,
      })
    }
  }

  update(context: AnimationContext): void {
    const { deltaTime, time } = context
    const dt = deltaTime / 16

    this.beatTimer += deltaTime

    // Generate new target values (simulate audio)
    if (this.beatTimer > 100) {
      this.beatTimer = 0

      const beatStrength = Math.random() * 0.7 + 0.3
      const centerFreq = Math.floor(Math.random() * this.barCount)
      const spread = 5 + Math.random() * 10

      for (let i = 0; i < this.barCount; i++) {
        const distance = Math.abs(i - centerFreq)
        const influence = Math.max(0, 1 - distance / spread)

        // Low frequencies have more energy
        const freqBias = 1 - (i / this.barCount) * 0.5

        this.bars[i].targetValue =
          Math.random() * 0.3 +
          influence * beatStrength * freqBias +
          Math.sin(time * 0.001 * (1 + i * 0.1)) * 0.1
      }
    }

    // Update bars
    for (const bar of this.bars) {
      // Smooth interpolation
      bar.value += (bar.targetValue - bar.value) * 0.3 * dt
      bar.targetValue *= 0.92

      // Update peak
      if (bar.value > bar.peak) {
        bar.peak = bar.value
        bar.peakDecay = 0
      } else {
        bar.peakDecay += deltaTime
        if (bar.peakDecay > 100) {
          bar.peak = Math.max(bar.value, bar.peak - 0.02 * dt)
        }
      }
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    const barWidth = width / this.barCount
    const maxHeight = height * 0.8
    const baseY = height * 0.9

    for (let i = 0; i < this.barCount; i++) {
      const bar = this.bars[i]
      const x = i * barWidth
      const barHeight = bar.value * maxHeight
      const y = baseY - barHeight

      // Color based on frequency
      const colorIndex = Math.floor((i / this.barCount) * this.colors.length)
      const color = this.colors[colorIndex]

      // Draw bar
      ctx.save()

      // Gradient fill
      const gradient = ctx.createLinearGradient(x, baseY, x, y)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, `${color}80`)

      ctx.fillStyle = gradient
      ctx.fillRect(x + 1, y, barWidth - 2, barHeight)

      // Glow effect
      ctx.shadowColor = color
      ctx.shadowBlur = 10
      ctx.globalAlpha = 0.5
      ctx.fillRect(x + 1, y, barWidth - 2, barHeight)

      ctx.restore()

      // Draw peak indicator
      if (bar.peak > 0.1) {
        const peakY = baseY - bar.peak * maxHeight

        ctx.save()
        ctx.fillStyle = '#ffffff'
        ctx.globalAlpha = 0.8
        ctx.fillRect(x + 1, peakY - 2, barWidth - 2, 3)
        ctx.restore()
      }
    }

    // Draw reflection
    ctx.save()
    ctx.globalAlpha = 0.2
    ctx.scale(1, -1)
    ctx.translate(0, -height)

    for (let i = 0; i < this.barCount; i++) {
      const bar = this.bars[i]
      const x = i * barWidth
      const barHeight = bar.value * maxHeight * 0.5
      const y = baseY - barHeight

      const colorIndex = Math.floor((i / this.barCount) * this.colors.length)
      const color = this.colors[colorIndex]

      const gradient = ctx.createLinearGradient(x, baseY, x, y)
      gradient.addColorStop(0, 'transparent')
      gradient.addColorStop(1, `${color}40`)

      ctx.fillStyle = gradient
      ctx.fillRect(x + 1, y, barWidth - 2, barHeight)
    }

    ctx.restore()
  }

  cleanup(): void {
    this.bars = []
  }
}

export default new AudioVisualizerAnimation()
