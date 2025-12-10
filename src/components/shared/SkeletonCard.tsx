/**
 * Skeleton Card Component
 * Loading placeholder for animation cards
 */

import { cn } from '@/lib/utils/cn'

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card overflow-hidden',
        'animate-pulse',
        className
      )}
    >
      {/* Thumbnail skeleton */}
      <div className="aspect-video bg-muted" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-5 bg-muted rounded w-3/4" />

        {/* Category badge skeleton */}
        <div className="h-4 bg-muted rounded w-20" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-5/6" />
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-8 bg-muted rounded w-16" />
          <div className="h-8 w-8 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton Grid
 * Grid of skeleton cards for loading state
 */
interface SkeletonGridProps {
  count?: number
  className?: string
}

export function SkeletonGrid({ count = 8, className }: SkeletonGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
        className
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={`skeleton-card-${i}`} />
      ))}
    </div>
  )
}
