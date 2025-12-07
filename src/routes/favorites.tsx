import { createFileRoute, Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { ArrowLeft, Clock, Heart, Sparkles } from 'lucide-react'
import { AnimationCard } from '@/components/gallery/AnimationCard'
import { getAnimationsByIds } from '@/lib/animations/registry'
import { cn } from '@/lib/utils/cn'
import { gallerySelectors, galleryStore } from '@/stores/gallery-store'
import type { AnimationMetadata } from '@/types/animation'

export const Route = createFileRoute('/favorites')({
  component: FavoritesPage,
})

function FavoritesPage() {
  const favorites = useStore(galleryStore, gallerySelectors.getFavorites)
  const recentlyViewed = useStore(galleryStore, gallerySelectors.getRecentlyViewed)

  const favoriteAnimations = getAnimationsByIds(favorites)
  const recentAnimations = getAnimationsByIds(
    recentlyViewed.slice(0, 6) // Limit to 6 most recent
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                'text-sm font-medium text-muted-foreground',
                'hover:text-foreground hover:bg-muted',
                'transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              <ArrowLeft size={16} />
              Back to Gallery
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Favorites Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Favorite Animations</h1>
              <p className="text-muted-foreground mt-1">
                {favorites.length === 0
                  ? 'No favorites yet'
                  : `${favorites.length} animation${favorites.length === 1 ? '' : 's'} saved`}
              </p>
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Start exploring animations and click the heart icon to save your favorites for easy
                access.
              </p>
              <Link
                to="/"
                className={cn(
                  'inline-flex items-center gap-2 px-6 py-3 rounded-lg',
                  'bg-primary text-primary-foreground font-medium',
                  'hover:bg-primary/90 transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
              >
                <Sparkles size={18} />
                Explore Gallery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteAnimations.map((animation: AnimationMetadata) => (
                <AnimationCard key={animation.id} animation={animation} />
              ))}
            </div>
          )}
        </section>

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Recently Viewed</h2>
                <p className="text-muted-foreground mt-1">Your viewing history</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentAnimations.map((animation: AnimationMetadata) => (
                <AnimationCard key={`recent-${animation.id}`} animation={animation} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
