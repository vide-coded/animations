import { useStore } from '@tanstack/react-store'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { galleryActions, gallerySelectors, galleryStore } from '@/stores/gallery-store'

interface FavoriteButtonProps {
  animationId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
}

export function FavoriteButton({
  animationId,
  className,
  size = 'md',
  showLabel = false,
}: FavoriteButtonProps) {
  const isFavorited = useStore(galleryStore, (state) =>
    gallerySelectors.isFavorite(state, animationId)
  )

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    galleryActions.toggleFavorite(animationId)
  }

  return (
    <button
      type="button"
      onClick={handleToggleFavorite}
      className={cn(
        'group relative flex items-center justify-center gap-2 rounded-lg',
        'bg-background/80 backdrop-blur-sm border border-border',
        'hover:bg-background hover:border-primary/50',
        'transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'active:scale-95',
        sizeClasses[size],
        className
      )}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorited}
    >
      <Heart
        size={iconSizes[size]}
        className={cn(
          'transition-all duration-300',
          isFavorited
            ? 'fill-red-500 stroke-red-500 scale-110'
            : 'stroke-foreground/70 group-hover:stroke-red-500 group-hover:scale-110'
        )}
        strokeWidth={isFavorited ? 2 : 1.5}
      />
      {showLabel && (
        <span className="text-sm font-medium">{isFavorited ? 'Favorited' : 'Favorite'}</span>
      )}

      {/* Ripple effect on click */}
      <span
        className={cn(
          'absolute inset-0 rounded-lg',
          'bg-red-500/20 scale-0 opacity-0',
          'group-active:scale-100 group-active:opacity-100',
          'transition-all duration-300'
        )}
      />
    </button>
  )
}
