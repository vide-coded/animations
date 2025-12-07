/**
 * Thumbnail Hook
 * React hook for managing animation thumbnails
 */

import { useCallback, useEffect, useState } from 'react'
import {
  clearThumbnail,
  generateBatchThumbnails,
  generateThumbnail,
  loadThumbnail,
  saveThumbnail,
} from '../lib/canvas/thumbnail-generator'
import type { Animation } from '../types/animation'

export interface UseThumbnailOptions {
  animationId: string
  animation?: Animation
  autoGenerate?: boolean
  width?: number
  height?: number
  quality?: number
  captureDelay?: number
}

export interface UseThumbnailReturn {
  thumbnail: string | null
  isGenerating: boolean
  error: Error | null
  generate: () => Promise<void>
  clear: () => void
}

/**
 * Hook for managing animation thumbnails
 */
export function useThumbnail(options: UseThumbnailOptions): UseThumbnailReturn {
  const {
    animationId,
    animation,
    autoGenerate = false,
    width,
    height,
    quality,
    captureDelay,
  } = options

  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Load thumbnail from storage on mount
  useEffect(() => {
    const cached = loadThumbnail(animationId)
    if (cached) {
      setThumbnail(cached)
    }
  }, [animationId])

  const generate = useCallback(async () => {
    if (!animation) {
      setError(new Error('Animation not provided'))
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const dataUrl = await generateThumbnail(animation, {
        width,
        height,
        quality,
        captureDelay,
      })

      setThumbnail(dataUrl)
      saveThumbnail(animationId, dataUrl)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate thumbnail')
      setError(error)
      console.error('Thumbnail generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [animation, animationId, width, height, quality, captureDelay])

  // Auto-generate if enabled and no cached thumbnail
  useEffect(() => {
    if (autoGenerate && !thumbnail && animation && !isGenerating) {
      generate()
    }
  }, [autoGenerate, thumbnail, animation, isGenerating, generate])

  const clear = useCallback(() => {
    setThumbnail(null)
    setError(null)
    clearThumbnail(animationId)
  }, [animationId])

  return {
    thumbnail,
    isGenerating,
    error,
    generate,
    clear,
  }
}

/**
 * Hook for batch thumbnail generation
 */
export function useBatchThumbnails(
  animations: Array<{ id: string; animation: Animation }>,
  options: Omit<UseThumbnailOptions, 'animationId' | 'animation'> = {}
) {
  const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map())
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Load cached thumbnails on mount
  useEffect(() => {
    const cached = new Map<string, string>()
    for (const { id } of animations) {
      const thumbnail = loadThumbnail(id)
      if (thumbnail) {
        cached.set(id, thumbnail)
      }
    }
    if (cached.size > 0) {
      setThumbnails(cached)
    }
  }, [animations])

  const generate = useCallback(async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const generated = await generateBatchThumbnails(animations, {
        width: options.width,
        height: options.height,
        quality: options.quality,
        captureDelay: options.captureDelay,
      })

      // Save to storage
      for (const [id, dataUrl] of generated) {
        saveThumbnail(id, dataUrl)
      }

      setThumbnails(generated)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate thumbnails')
      setError(error)
      console.error('Batch thumbnail generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [animations, options.width, options.height, options.quality, options.captureDelay])

  const clear = useCallback(() => {
    setThumbnails(new Map())
    setError(null)
    for (const { id } of animations) {
      clearThumbnail(id)
    }
  }, [animations])

  return {
    thumbnails,
    isGenerating,
    error,
    generate,
    clear,
  }
}
