/**
 * Type Effect Animation
 * Typewriter effect with cursor and text reveal
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface TextLine {
  text: string
  currentIndex: number
  completed: boolean
  x: number
  y: number
  color: string
}

export class TypeEffectAnimation implements Animation {
  name = 'Type Effect'
  private lines: TextLine[] = []
  private currentLineIndex = 0
  private charTimer = 0
  private readonly charDelay = 50
  private cursorVisible = true
  private cursorTimer = 0
  private readonly cursorBlinkSpeed = 500

  private readonly messages = [
    '> Initializing system...',
    '> Loading neural networks...',
    '> Connecting to database...',
    '> Authentication successful',
    '> Ready for input_',
  ]

  init(context: AnimationContext): void {
    const { width, height } = context
    this.lines = []
    this.currentLineIndex = 0
    this.charTimer = 0
    this.cursorVisible = true
    this.cursorTimer = 0

    const startY = height / 2 - (this.messages.length * 30) / 2
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']

    for (let i = 0; i < this.messages.length; i++) {
      this.lines.push({
        text: this.messages[i],
        currentIndex: 0,
        completed: false,
        x: width * 0.1,
        y: startY + i * 35,
        color: colors[i % colors.length],
      })
    }
  }

  update(context: AnimationContext): void {
    const { deltaTime } = context

    this.charTimer += deltaTime
    this.cursorTimer += deltaTime

    // Blink cursor
    if (this.cursorTimer >= this.cursorBlinkSpeed) {
      this.cursorVisible = !this.cursorVisible
      this.cursorTimer = 0
    }

    // Type characters
    if (this.charTimer >= this.charDelay && this.currentLineIndex < this.lines.length) {
      const currentLine = this.lines[this.currentLineIndex]

      if (!currentLine.completed) {
        if (currentLine.currentIndex < currentLine.text.length) {
          currentLine.currentIndex++
          this.charTimer = 0

          // Reset cursor blink on new character
          this.cursorVisible = true
          this.cursorTimer = 0
        } else {
          currentLine.completed = true
          this.currentLineIndex++
          this.charTimer = -300 // Pause between lines
        }
      }
    }

    // Reset animation when complete
    if (this.currentLineIndex >= this.lines.length && this.charTimer > 2000) {
      this.init(context)
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    ctx.font = '20px "Courier New", monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    // Draw all lines
    for (let i = 0; i <= this.currentLineIndex && i < this.lines.length; i++) {
      const line = this.lines[i]
      const displayText = line.text.substring(0, line.currentIndex)

      ctx.save()

      // Text shadow/glow
      ctx.shadowColor = line.color
      ctx.shadowBlur = 5

      ctx.fillStyle = line.color
      ctx.fillText(displayText, line.x, line.y)

      // Draw cursor on current line
      if (i === this.currentLineIndex && !line.completed && this.cursorVisible) {
        const textWidth = ctx.measureText(displayText).width
        const cursorX = line.x + textWidth

        ctx.fillStyle = line.color
        ctx.fillRect(cursorX, line.y, 12, 24)
      }

      ctx.restore()
    }

    // Draw scanline effect
    ctx.save()
    ctx.globalAlpha = 0.05

    for (let y = 0; y < height; y += 4) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, y, width, 2)
    }

    ctx.restore()

    // Vignette effect
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) / 2
    )
    gradient.addColorStop(0, 'transparent')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  cleanup(): void {
    this.lines = []
  }
}

export default new TypeEffectAnimation()
