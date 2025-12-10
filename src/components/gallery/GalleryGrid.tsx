/**
 * Gallery Grid Component
 * Responsive grid layout for animation cards
 */

import { Film } from 'lucide-react'
import type { AnimationMetadata } from '../../types/animation'
import { EmptyState } from '../shared/EmptyState'
import { SkeletonGrid } from '../shared/SkeletonCard'
import { AnimationCard } from './AnimationCard'

interface GalleryGridProps {
  animations: AnimationMetadata[]
  isLoading?: boolean
  emptyMessage?: string
  gridColumns?: 1 | 2 | 3 | 4
}

const gridColumnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

export function GalleryGrid({
  animations,
  isLoading = false,
  emptyMessage = 'No animations found',
  gridColumns = 1,
}: GalleryGridProps) {
  const gridClass = gridColumnClasses[gridColumns]

  if (isLoading) {
    return <SkeletonGrid count={8} className={gridClass} />
  }

  if (animations.length === 0) {
    return <EmptyState icon={Film} title="No animations found" description={emptyMessage} />
  }

  return (
    <div
      className={`grid gap-4 sm:gap-6 ${gridClass} w-full px-2 sm:px-4 md:px-6 animate-in fade-in duration-300`}
      data-testid="gallery-grid-responsive"
    >
      {animations.map((animation) => (
        <AnimationCard key={animation.id} animation={animation} />
      ))}
    </div>
  )
}
