/**
 * Canvas 2D Renderer Utilities
 * Helper functions for common 2D canvas operations
 */

export class Canvas2DRenderer {
  private ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  /**
   * Clear the entire canvas
   */
  clear(): void {
    const canvas = this.ctx.canvas
    this.ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  /**
   * Fill canvas with solid color
   */
  fillBackground(color: string): void {
    const canvas = this.ctx.canvas
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  /**
   * Draw a circle
   */
  drawCircle(x: number, y: number, radius: number, color: string, fill = true): void {
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)

    if (fill) {
      this.ctx.fillStyle = color
      this.ctx.fill()
    } else {
      this.ctx.strokeStyle = color
      this.ctx.stroke()
    }
  }

  /**
   * Draw a line
   */
  drawLine(x1: number, y1: number, x2: number, y2: number, color: string, width = 1): void {
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = width
    this.ctx.stroke()
  }

  /**
   * Draw a rectangle
   */
  drawRect(x: number, y: number, width: number, height: number, color: string, fill = true): void {
    if (fill) {
      this.ctx.fillStyle = color
      this.ctx.fillRect(x, y, width, height)
    } else {
      this.ctx.strokeStyle = color
      this.ctx.strokeRect(x, y, width, height)
    }
  }

  /**
   * Draw text
   */
  drawText(
    text: string,
    x: number,
    y: number,
    color: string,
    font = '16px monospace',
    align: CanvasTextAlign = 'left',
    baseline: CanvasTextBaseline = 'top'
  ): void {
    this.ctx.font = font
    this.ctx.fillStyle = color
    this.ctx.textAlign = align
    this.ctx.textBaseline = baseline
    this.ctx.fillText(text, x, y)
  }

  /**
   * Set global alpha (transparency)
   */
  setAlpha(alpha: number): void {
    this.ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
  }

  /**
   * Reset global alpha to fully opaque
   */
  resetAlpha(): void {
    this.ctx.globalAlpha = 1
  }

  /**
   * Set blend mode
   */
  setBlendMode(mode: GlobalCompositeOperation): void {
    this.ctx.globalCompositeOperation = mode
  }

  /**
   * Reset blend mode to default
   */
  resetBlendMode(): void {
    this.ctx.globalCompositeOperation = 'source-over'
  }

  /**
   * Save canvas state
   */
  save(): void {
    this.ctx.save()
  }

  /**
   * Restore canvas state
   */
  restore(): void {
    this.ctx.restore()
  }

  /**
   * Translate canvas origin
   */
  translate(x: number, y: number): void {
    this.ctx.translate(x, y)
  }

  /**
   * Rotate canvas
   */
  rotate(angle: number): void {
    this.ctx.rotate(angle)
  }

  /**
   * Scale canvas
   */
  scale(x: number, y: number): void {
    this.ctx.scale(x, y)
  }

  /**
   * Create linear gradient
   */
  createLinearGradient(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    colors: Array<{ offset: number; color: string }>
  ): CanvasGradient {
    const gradient = this.ctx.createLinearGradient(x0, y0, x1, y1)

    for (const { offset, color } of colors) {
      gradient.addColorStop(offset, color)
    }

    return gradient
  }

  /**
   * Create radial gradient
   */
  createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number,
    colors: Array<{ offset: number; color: string }>
  ): CanvasGradient {
    const gradient = this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1)

    for (const { offset, color } of colors) {
      gradient.addColorStop(offset, color)
    }

    return gradient
  }

  /**
   * Draw gradient
   */
  drawGradient(gradient: CanvasGradient): void {
    const canvas = this.ctx.canvas
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  /**
   * Apply shadow
   */
  applyShadow(color: string, blur: number, offsetX = 0, offsetY = 0): void {
    this.ctx.shadowColor = color
    this.ctx.shadowBlur = blur
    this.ctx.shadowOffsetX = offsetX
    this.ctx.shadowOffsetY = offsetY
  }

  /**
   * Clear shadow
   */
  clearShadow(): void {
    this.ctx.shadowColor = 'transparent'
    this.ctx.shadowBlur = 0
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0
  }

  /**
   * Get context (for advanced operations)
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx
  }
}
