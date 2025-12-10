/**
 * Animation Card Component
 * Displays animation preview with metadata and hover auto-play
 */

import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { animationRegistry } from '@/lib/animations/registry'
import { CanvasEngine } from '@/lib/canvas/engine'
import { hoverPlayManager } from '@/lib/utils/hover-play-manager'
import { galleryActions, galleryStore } from '@/stores/gallery-store'
import { cn } from '../../lib/utils/cn'
import type { AnimationMetadata } from '../../types/animation'
import { FavoriteButton } from '../shared/FavoriteButton'

interface AnimationCardProps {
  animation: AnimationMetadata
  isHoverPlayEnabled?: boolean
}

const difficultyColors = {
  easy: 'bg-green-500/10 text-green-400 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  hard: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const categoryColors = {
  particles: 'bg-blue-500/10 text-blue-400',
  waves: 'bg-purple-500/10 text-purple-400',
  geometric: 'bg-cyan-500/10 text-cyan-400',
  text: 'bg-pink-500/10 text-pink-400',
  glitch: 'bg-red-500/10 text-red-400',
}

export function AnimationCard({ animation, isHoverPlayEnabled = true }: AnimationCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<CanvasEngine | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const hoverTimeoutRef = useRef<number | null>(null)

  const autoPlayOnHover = galleryStore.state.autoPlayOnHover

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.stop()
        engineRef.current = null
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      // Unregister from hover play manager
      hoverPlayManager.unregister(animation.id)
    }
  }, [animation.id])

  const startAnimation = async () => {
    if (!canvasRef.current || !autoPlayOnHover || !isHoverPlayEnabled) return

    // Register with hover play manager (limits concurrent animations)
    const canStart = hoverPlayManager.register(animation.id, () => {
      if (engineRef.current) {
        engineRef.current.stop()
        engineRef.current = null
      }
      setIsPlaying(false)
      setIsLoading(false)
    })

    if (!canStart) {
      return // Limit reached, don't start
    }

    setIsLoading(true)
    setIsPlaying(true)

    try {
      // Load animation from registry
      const animationInstance = await animationRegistry.getById(animation.id)
      if (!animationInstance || !canvasRef.current) {
        console.warn(`Animation ${animation.id} not found or canvas not ready`)
        hoverPlayManager.unregister(animation.id)
        setIsPlaying(false)
        return
      }

      // Check canvas dimensions
      const rect = canvasRef.current.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        console.warn(`Canvas has zero dimensions for ${animation.id}`)
      }

      // Initialize canvas engine
      const engine = new CanvasEngine(canvasRef.current)
      engineRef.current = engine

      // Load and start animation
      engine.loadAnimation(animationInstance)
      engine.play()
      
      console.log(`Animation ${animation.id} started playing`)
    } catch (error) {
      console.error(`Failed to start hover animation for ${animation.id}:`, error)
      hoverPlayManager.unregister(animation.id)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }

  const stopAnimation = () => {
    // Unregister from hover play manager (calls cleanup automatically)
    hoverPlayManager.unregister(animation.id)
    setIsPlaying(false)
    setIsLoading(false)
  }

  const handleMouseEnter = () => {
    // Delay animation start to avoid triggering on quick mouse movements
    hoverTimeoutRef.current = setTimeout(() => {
      startAnimation()
    }, 200)
  }

  const handleMouseLeave = () => {
    // Cancel pending start
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    // Stop playing animation
    stopAnimation()
  }

  const handleClick = () => {
    // Track in recently viewed when clicked
    galleryActions.addToRecentlyViewed(animation.id)
  }

  return (
    <Link
      to="/"
      search={{ animation: animation.id }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
    >
      {/* Thumbnail with Canvas Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-muted/30 to-muted/50">
        {/* Canvas for animation - always visible with proper sizing */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: 'block' }}
          tabIndex={-1}
          aria-hidden="true"
        />

        {/* Static placeholder with gradient (visible when not loaded or playing) */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 transition-opacity duration-300',
            isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        >
          <div className="text-6xl font-bold text-muted-foreground/10">
            {animation.name.charAt(0)}
          </div>
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton animationId={animation.id} size="sm" />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/5" />

        {/* Play Icon / Loading Indicator */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-opacity',
            isPlaying || isLoading ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground">
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-label="Play animation"
            >
              <title>Play animation</title>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {animation.name}
          </h3>
          <span
            className={cn(
              'shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium',
              difficultyColors[animation.difficulty as keyof typeof difficultyColors]
            )}
          >
            {animation.difficulty}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{animation.description}</p>

        {/* Tags */}
        <div className="mt-auto flex flex-wrap gap-1.5">
          <span
            className={cn(
              'rounded-md px-2 py-0.5 text-xs font-medium',
              categoryColors[animation.category as keyof typeof categoryColors]
            )}
          >
            {animation.category}
          </span>
          {animation.tags.slice(0, 2).map((tag: string) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {animation.tags.length > 2 && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              +{animation.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
