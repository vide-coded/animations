/**
 * Thumbnail Generator
 * Captures static frames from animations and converts to WebP
 */

import type { Animation } from '../../types/animation'
import { CanvasEngine } from '../canvas/engine'

export interface ThumbnailOptions {
  width?: number
  height?: number
  quality?: number
  captureDelay?: number
}

const DEFAULT_WIDTH = 400
const DEFAULT_HEIGHT = 300
const DEFAULT_QUALITY = 0.85
const DEFAULT_CAPTURE_DELAY = 1000

/**
 * Generate a thumbnail from an animation
 */
export async function generateThumbnail(
  animation: Animation,
  options: ThumbnailOptions = {}
): Promise<string> {
  const {
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    quality = DEFAULT_QUALITY,
    captureDelay = DEFAULT_CAPTURE_DELAY,
  } = options

  // Create offscreen canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  // Create engine instance
  const engine = new CanvasEngine(canvas)
  engine.loadAnimation(animation)

  try {
    // Initialize and run animation
    engine.play()

    // Wait for animation to render interesting frame
    await new Promise((resolve) => setTimeout(resolve, captureDelay))

    // Pause to capture frame
    engine.pause()

    // Convert to WebP
    return await canvasToWebP(canvas, quality)
  } finally {
    // Cleanup
    engine.destroy()
  }
}

/**
 * Convert canvas to WebP data URL
 */
async function canvasToWebP(canvas: HTMLCanvasElement, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Try WebP first
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader()
            reader.onloadend = () => {
              resolve(reader.result as string)
            }
            reader.onerror = reject
            reader.readAsDataURL(blob)
          } else {
            // Fallback to PNG
            resolve(canvas.toDataURL('image/png'))
          }
        },
        'image/webp',
        quality
      )
    } catch {
      // Fallback to PNG if WebP not supported
      resolve(canvas.toDataURL('image/png'))
    }
  })
}

/**
 * Batch generate thumbnails for multiple animations
 */
export async function generateBatchThumbnails(
  animations: Array<{ id: string; animation: Animation }>,
  options: ThumbnailOptions = {}
): Promise<Map<string, string>> {
  const thumbnails = new Map<string, string>()

  for (const { id, animation } of animations) {
    try {
      const thumbnail = await generateThumbnail(animation, options)
      thumbnails.set(id, thumbnail)
    } catch (error) {
      console.error(`Failed to generate thumbnail for ${id}:`, error)
    }
  }

  return thumbnails
}

/**
 * Save thumbnail to local storage
 */
export function saveThumbnail(id: string, dataUrl: string): void {
  try {
    localStorage.setItem(`thumbnail_${id}`, dataUrl)
  } catch (error) {
    console.error(`Failed to save thumbnail for ${id}:`, error)
  }
}

/**
 * Load thumbnail from local storage
 */
export function loadThumbnail(id: string): string | null {
  try {
    return localStorage.getItem(`thumbnail_${id}`)
  } catch (error) {
    console.error(`Failed to load thumbnail for ${id}:`, error)
    return null
  }
}

/**
 * Check if thumbnail exists in local storage
 */
export function hasThumbnail(id: string): boolean {
  try {
    return localStorage.getItem(`thumbnail_${id}`) !== null
  } catch {
    return false
  }
}

/**
 * Clear thumbnail from local storage
 */
export function clearThumbnail(id: string): void {
  try {
    localStorage.removeItem(`thumbnail_${id}`)
  } catch (error) {
    console.error(`Failed to clear thumbnail for ${id}:`, error)
  }
}

/**
 * Clear all thumbnails from local storage
 */
export function clearAllThumbnails(): void {
  try {
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.startsWith('thumbnail_')) {
        localStorage.removeItem(key)
      }
    }
  } catch (error) {
    console.error('Failed to clear thumbnails:', error)
  }
}
