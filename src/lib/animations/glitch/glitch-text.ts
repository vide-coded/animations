/**
 * Glitch Text Animation
 * Cyberpunk-style glitching text effect
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface GlitchLayer {
  text: string
  x: number
  y: number
  offsetX: number
  offsetY: number
  color: string
  alpha: number
}

export class GlitchTextAnimation implements Animation {
  name = 'Glitch Text'
  private text = 'BRAIN ROT'
  private layers: GlitchLayer[] = []
  private glitchTimer = 0
  private glitchInterval = 100
  private isGlitching = false
  private glitchDuration = 0

  init(context: AnimationContext): void {
    const { width, height } = context

    this.layers = [
      {
        text: this.text,
        x: width / 2,
        y: height / 2,
        offsetX: 0,
        offsetY: 0,
        color: '#ff0000',
        alpha: 1,
      },
      {
        text: this.text,
        x: width / 2,
        y: height / 2,
        offsetX: 0,
        offsetY: 0,
        color: '#00ff00',
        alpha: 1,
      },
      {
        text: this.text,
        x: width / 2,
        y: height / 2,
        offsetX: 0,
        offsetY: 0,
        color: '#0000ff',
        alpha: 1,
      },
      {
        text: this.text,
        x: width / 2,
        y: height / 2,
        offsetX: 0,
        offsetY: 0,
        color: '#ffffff',
        alpha: 1,
      },
    ]

    this.glitchTimer = 0
    this.isGlitching = false
  }

  update(context: AnimationContext): void {
    const { deltaTime, width, height } = context

    this.glitchTimer += deltaTime

    // Trigger random glitches
    if (!this.isGlitching && this.glitchTimer >= this.glitchInterval) {
      this.isGlitching = true
      this.glitchDuration = 50 + Math.random() * 150
      this.glitchTimer = 0
      this.glitchInterval = 100 + Math.random() * 400
    }

    if (this.isGlitching) {
      this.glitchDuration -= deltaTime

      if (this.glitchDuration <= 0) {
        this.isGlitching = false

        // Reset layers
        for (const layer of this.layers) {
          layer.offsetX = 0
          layer.offsetY = 0
          layer.x = width / 2
          layer.y = height / 2
        }
      } else {
        // Apply glitch effects
        for (let i = 0; i < this.layers.length; i++) {
          const layer = this.layers[i]

          if (i === 3) {
            // White layer stays mostly centered
            layer.offsetX = (Math.random() - 0.5) * 2
            layer.offsetY = (Math.random() - 0.5) * 2
          } else {
            // RGB layers get more offset
            layer.offsetX = (Math.random() - 0.5) * 15
            layer.offsetY = (Math.random() - 0.5) * 8
          }

          layer.x = width / 2 + layer.offsetX
          layer.y = height / 2 + layer.offsetY
        }
      }
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    // Clear background
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    // Set text properties
    ctx.font = 'bold 72px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Draw RGB layers with blend modes
    for (let i = 0; i < 3; i++) {
      const layer = this.layers[i]
      ctx.save()
      ctx.globalAlpha = this.isGlitching ? 0.8 : 0.4
      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = layer.color
      ctx.fillText(layer.text, layer.x, layer.y)
      ctx.restore()
    }

    // Draw main white layer
    const mainLayer = this.layers[3]
    ctx.save()
    ctx.fillStyle = mainLayer.color
    ctx.globalAlpha = this.isGlitching ? 0.9 : 1
    ctx.fillText(mainLayer.text, mainLayer.x, mainLayer.y)
    ctx.restore()

    // Add scan lines effect
    if (this.isGlitching && Math.random() > 0.5) {
      ctx.save()
      ctx.strokeStyle = '#00ff00'
      ctx.globalAlpha = 0.3
      ctx.lineWidth = 2

      const lineY = Math.random() * height
      ctx.beginPath()
      ctx.moveTo(0, lineY)
      ctx.lineTo(width, lineY)
      ctx.stroke()
      ctx.restore()
    }

    // Add random pixel blocks
    if (this.isGlitching && Math.random() > 0.7) {
      ctx.save()
      const blockX = Math.random() * width
      const blockY = Math.random() * height
      const blockW = 20 + Math.random() * 100
      const blockH = 5 + Math.random() * 20

      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
      ctx.fillRect(blockX, blockY, blockW, blockH)
      ctx.restore()
    }
  }

  cleanup(): void {
    this.layers = []
  }
}

export default new GlitchTextAnimation()
