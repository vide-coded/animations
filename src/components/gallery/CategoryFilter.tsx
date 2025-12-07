/**
 * Category Filter Component
 * Visual category filter with tags and clear button
 */

import { X } from 'lucide-react'
import type { AnimationCategory } from '../../types/animation'

interface CategoryFilterProps {
  categories: AnimationCategory[]
  selectedCategory: AnimationCategory | 'all'
  onCategoryChange: (category: AnimationCategory | 'all') => void
  hasActiveFilters?: boolean
  onClearFilters?: () => void
}

const categoryIcons: Record<AnimationCategory, string> = {
  particles: '✨',
  waves: '〰️',
  geometric: '▲',
  text: '📝',
  glitch: '⚡',
}

const categoryColors: Record<AnimationCategory, string> = {
  particles:
    'from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400',
  waves: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
  geometric:
    'from-violet-500/20 to-pink-500/20 border-violet-500/30 text-violet-600 dark:text-violet-400',
  text: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-600 dark:text-green-400',
  glitch: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-600 dark:text-red-400',
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  hasActiveFilters = false,
  onClearFilters,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Categories</h3>
        {hasActiveFilters && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear all filters"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {/* All Categories */}
        <button
          type="button"
          onClick={() => onCategoryChange('all')}
          className={`group relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary text-primary shadow-sm scale-105'
              : 'bg-muted/50 border border-border text-muted-foreground hover:bg-muted hover:border-border/80 hover:scale-105'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-base">🎨</span>
            <span>All</span>
          </span>
        </button>

        {/* Category Pills */}
        {categories.map((category) => {
          const isSelected = selectedCategory === category
          const icon = categoryIcons[category]
          const colorClass = categoryColors[category]

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`group relative rounded-lg px-3.5 py-2 text-sm font-medium capitalize transition-all duration-200 ${
                isSelected
                  ? `bg-gradient-to-r ${colorClass} border-2 shadow-sm scale-105`
                  : 'bg-muted/50 border border-border text-muted-foreground hover:bg-muted hover:border-border/80 hover:scale-105'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{icon}</span>
                <span>{category}</span>
              </span>

              {/* Hover glow effect */}
              {!isSelected && (
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none" />
              )}
            </button>
          )
        })}
      </div>

      {/* Active Filter Indicator */}
      {selectedCategory !== 'all' && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span>
            Showing{' '}
            <span className="font-medium capitalize text-foreground">{selectedCategory}</span>{' '}
            animations
          </span>
        </div>
      )}
    </div>
  )
}
