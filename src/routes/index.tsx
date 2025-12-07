import { createFileRoute, Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GalleryFilters } from '../components/gallery/GalleryFilters'
import { GalleryGrid } from '../components/gallery/GalleryGrid'
import { animationRegistry, initializeRegistry } from '../lib/animations'
import { cn } from '../lib/utils/cn'
import { galleryActions, gallerySelectors, galleryStore } from '../stores/gallery-store'
import type { AnimationMetadata } from '../types/animation'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  const [animations, setAnimations] = useState<AnimationMetadata[]>([])
  const [filteredAnimations, setFilteredAnimations] = useState<AnimationMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Subscribe to store state
  const selectedCategory = useStore(galleryStore, gallerySelectors.getCategory)
  const searchQuery = useStore(galleryStore, gallerySelectors.getSearchQuery)
  const sortBy = useStore(galleryStore, gallerySelectors.getSortBy)
  const sortOrder = useStore(galleryStore, gallerySelectors.getSortOrder)
  const gridColumns = useStore(galleryStore, gallerySelectors.getGridColumns)
  const autoPlayOnHover = useStore(galleryStore, gallerySelectors.getAutoPlayOnHover)
  const hasActiveFilters = useStore(galleryStore, gallerySelectors.hasActiveFilters)

  useEffect(() => {
    // Initialize registry
    initializeRegistry()

    // Load all animations
    const allAnimations = animationRegistry.getAll()
    setAnimations(allAnimations)
    setFilteredAnimations(allAnimations)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = animations

    if (selectedCategory !== 'all') {
      filtered = animationRegistry.getByCategory(selectedCategory)
    }

    if (searchQuery.trim()) {
      filtered = animationRegistry.filter({
        search: searchQuery,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
      })
    }

    // Apply sorting
    filtered = animationRegistry.sort(filtered, { by: sortBy, order: sortOrder })

    setFilteredAnimations(filtered)
  }, [animations, selectedCategory, searchQuery, sortBy, sortOrder])

  const categories = animationRegistry.getCategories()
  const favoriteCount = useStore(galleryStore, gallerySelectors.getFavorites).length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Navigation */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Brain-Rot
          </h1>
          <p className="text-lg text-muted-foreground">
            Canvas Animation Gallery - Explore {animations.length} mesmerizing animations
          </p>
        </div>

        {/* Favorites Link */}
        <Link
          to="/favorites"
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-background border border-border',
            'hover:bg-muted hover:border-red-500/50',
            'transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
        >
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <span className="font-medium">Favorites</span>
          {favoriteCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold">
              {favoriteCount}
            </span>
          )}
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <GalleryFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={galleryActions.setCategory}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={galleryActions.setSortBy}
          onSortOrderToggle={galleryActions.toggleSortOrder}
          searchQuery={searchQuery}
          onSearchChange={galleryActions.setSearchQuery}
          gridColumns={gridColumns}
          onGridColumnsChange={galleryActions.setGridColumns}
          autoPlayOnHover={autoPlayOnHover}
          onAutoPlayToggle={galleryActions.toggleAutoPlayOnHover}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={galleryActions.clearFilters}
        />
      </div>

      {/* Results Count */}
      {hasActiveFilters && (
        <div className="mb-4 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-200">
          Found <span className="font-semibold text-foreground">{filteredAnimations.length}</span>{' '}
          {filteredAnimations.length === 1 ? 'animation' : 'animations'}
        </div>
      )}

      {/* Gallery Grid */}
      <GalleryGrid
        animations={filteredAnimations}
        isLoading={isLoading}
        gridColumns={gridColumns}
        emptyMessage={
          searchQuery.trim()
            ? `No animations found for "${searchQuery}"`
            : selectedCategory !== 'all'
              ? `No ${selectedCategory} animations found`
              : 'No animations available'
        }
      />
    </div>
  )
}
