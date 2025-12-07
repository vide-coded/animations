/**
 * RGB Split Animation
 * RGB channel separation glitch effect
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface GlitchBlock {
  x: number
  y: number
  width: number
  height: number
  offsetR: { x: number; y: number }
  offsetG: { x: number; y: number }
  offsetB: { x: number; y: number }
  lifetime: number
  maxLifetime: number
}

export class RGBSplitAnimation implements Animation {
  name = 'RGB Split'
  private blocks: GlitchBlock[] = []
  private glitchTimer = 0
  private readonly glitchInterval = 100
  private baseImageData: ImageData | null = null

  init(context: AnimationContext): void {
    const { width, height } = context
    const ctx = context.ctx as CanvasRenderingContext2D

    this.blocks = []
    this.glitchTimer = 0

    // Draw base pattern
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    // Draw some geometric shapes for the glitch effect
    const shapes = 8
    for (let i = 0; i < shapes; i++) {
      const x = (width / shapes) * i
      const y = height / 2 + Math.sin(i) * 100
      const size = 60 + Math.cos(i) * 40

      ctx.fillStyle = `hsl(${i * 40}, 70%, 60%)`
      ctx.fillRect(x, y, size, size)

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, size, size)
    }

    // Draw diagonal lines
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    for (let i = 0; i < 10; i++) {
      ctx.beginPath()
      ctx.moveTo(i * (width / 10), 0)
      ctx.lineTo(width, height - i * (height / 10))
      ctx.stroke()
    }

    // Store base image
    this.baseImageData = ctx.getImageData(0, 0, width, height)
  }

  update(context: AnimationContext): void {
    const { deltaTime, width, height } = context

    this.glitchTimer += deltaTime

    // Update existing blocks
    for (let i = this.blocks.length - 1; i >= 0; i--) {
      const block = this.blocks[i]
      block.lifetime += deltaTime

      if (block.lifetime >= block.maxLifetime) {
        this.blocks.splice(i, 1)
      }
    }

    // Create new glitch blocks
    if (this.glitchTimer >= this.glitchInterval) {
      this.glitchTimer = 0

      const blockCount = 2 + Math.floor(Math.random() * 4)

      for (let i = 0; i < blockCount; i++) {
        const blockWidth = 50 + Math.random() * 200
        const blockHeight = 20 + Math.random() * 100

        this.blocks.push({
          x: Math.random() * (width - blockWidth),
          y: Math.random() * (height - blockHeight),
          width: blockWidth,
          height: blockHeight,
          offsetR: {
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 0.5) * 10,
          },
          offsetG: {
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 0.5) * 10,
          },
          offsetB: {
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 0.5) * 10,
          },
          lifetime: 0,
          maxLifetime: 100 + Math.random() * 200,
        })
      }
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    // Draw base image
    if (this.baseImageData) {
      ctx.putImageData(this.baseImageData, 0, 0)
    }

    // Apply RGB split to glitch blocks
    for (const block of this.blocks) {
      if (!this.baseImageData) continue

      // Extract block from base image
      const sourceData = ctx.getImageData(block.x, block.y, block.width, block.height)

      // Create three copies for RGB channels
      const rData = ctx.createImageData(block.width, block.height)
      const gData = ctx.createImageData(block.width, block.height)
      const bData = ctx.createImageData(block.width, block.height)

      // Split RGB channels
      for (let i = 0; i < sourceData.data.length; i += 4) {
        // Red channel
        rData.data[i] = sourceData.data[i]
        rData.data[i + 1] = 0
        rData.data[i + 2] = 0
        rData.data[i + 3] = sourceData.data[i + 3]

        // Green channel
        gData.data[i] = 0
        gData.data[i + 1] = sourceData.data[i + 1]
        gData.data[i + 2] = 0
        gData.data[i + 3] = sourceData.data[i + 3]

        // Blue channel
        bData.data[i] = 0
        bData.data[i + 1] = 0
        bData.data[i + 2] = sourceData.data[i + 2]
        bData.data[i + 3] = sourceData.data[i + 3]
      }

      // Draw separated channels with offsets
      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      ctx.putImageData(rData, block.x + block.offsetR.x, block.y + block.offsetR.y)
      ctx.putImageData(gData, block.x + block.offsetG.x, block.y + block.offsetG.y)
      ctx.putImageData(bData, block.x + block.offsetB.x, block.y + block.offsetB.y)

      ctx.restore()
    }

    // Random noise overlay
    if (Math.random() < 0.1) {
      const noiseCount = 100
      ctx.fillStyle = '#ffffff'

      for (let i = 0; i < noiseCount; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = Math.random() * 3

        ctx.fillRect(x, y, size, size)
      }
    }
  }

  cleanup(): void {
    this.blocks = []
    this.baseImageData = null
  }
}

export default new RGBSplitAnimation()
