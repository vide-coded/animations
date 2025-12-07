/**
 * Gallery Grid Component
 * Responsive grid layout for animation cards
 */

import type { AnimationMetadata } from '../../types/animation'
import { AnimationCard } from './AnimationCard'

interface GalleryGridProps {
  animations: AnimationMetadata[]
  isLoading?: boolean
  emptyMessage?: string
  gridColumns?: 2 | 3 | 4
}

const gridColumnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

export function GalleryGrid({
  animations,
  isLoading = false,
  emptyMessage = 'No animations found',
  gridColumns = 3,
}: GalleryGridProps) {
  const gridClass = gridColumnClasses[gridColumns]

  if (isLoading) {
    return (
      <div className={`grid gap-6 ${gridClass}`}>
        {Array.from({ length: 8 }, (_, i) => `loading-${i}`).map((key) => (
          <div
            key={key}
            className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
          >
            {/* Thumbnail skeleton */}
            <div className="aspect-video w-full animate-pulse bg-muted" />

            {/* Content skeleton */}
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="mt-auto flex gap-2">
                <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                <div className="h-6 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (animations.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-label="No animations"
          >
            <title>No animations</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-foreground">{emptyMessage}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`grid gap-6 ${gridClass} animate-in fade-in duration-300`}>
      {animations.map((animation) => (
        <AnimationCard key={animation.id} animation={animation} />
      ))}
    </div>
  )
}
