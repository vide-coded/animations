/**
 * Matrix Rain Animation
 * Falling matrix-style characters with trails
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface Drop {
  x: number
  y: number
  speed: number
  chars: string[]
  opacity: number[]
}

export class MatrixRainAnimation implements Animation {
  name = 'Matrix Rain'
  private drops: Drop[] = []
  private readonly fontSize = 16
  private readonly characters =
    'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  init(context: AnimationContext): void {
    const { width, height } = context
    this.drops = []

    const columns = Math.floor(width / this.fontSize)

    for (let i = 0; i < columns; i++) {
      const trailLength = 15 + Math.floor(Math.random() * 20)

      this.drops.push({
        x: i * this.fontSize,
        y: -Math.random() * height,
        speed: 0.5 + Math.random() * 1.5,
        chars: Array(trailLength)
          .fill('')
          .map(() => this.characters[Math.floor(Math.random() * this.characters.length)]),
        opacity: Array(trailLength)
          .fill(0)
          .map((_, idx) => 1 - idx / trailLength),
      })
    }
  }

  update(context: AnimationContext): void {
    const { deltaTime, height } = context
    const dt = deltaTime / 16

    for (const drop of this.drops) {
      drop.y += drop.speed * dt

      // Randomly change characters
      if (Math.random() < 0.05) {
        const idx = Math.floor(Math.random() * drop.chars.length)
        drop.chars[idx] = this.characters[Math.floor(Math.random() * this.characters.length)]
      }

      // Reset when off screen
      if (drop.y > height + drop.chars.length * this.fontSize) {
        drop.y = -drop.chars.length * this.fontSize
        drop.speed = 0.5 + Math.random() * 1.5
      }
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    // Fade effect
    ctx.fillStyle = 'rgba(10, 10, 20, 0.08)'
    ctx.fillRect(0, 0, width, height)

    ctx.font = `${this.fontSize}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    for (const drop of this.drops) {
      for (let i = 0; i < drop.chars.length; i++) {
        const charY = drop.y - i * this.fontSize

        // Skip if not visible
        if (charY < -this.fontSize || charY > height) continue

        const opacity = drop.opacity[i]

        // Bright head
        if (i === 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
          ctx.shadowColor = '#00ff00'
          ctx.shadowBlur = 10
        } else {
          // Green trail
          const greenIntensity = Math.floor(255 * opacity)
          ctx.fillStyle = `rgba(0, ${greenIntensity}, 0, ${opacity})`
          ctx.shadowBlur = 0
        }

        ctx.fillText(drop.chars[i], drop.x + this.fontSize / 2, charY)
      }
    }
  }

  cleanup(): void {
    this.drops = []
  }
}

export default new MatrixRainAnimation()
