/**
 * Gallery Filters Component
 * Filter and sort controls for animation gallery
 */

import { ArrowUpDown, Grid3x3, LayoutGrid, Play, Rows3, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import type { AnimationCategory } from '../../types/animation'
import type { RegistrySortBy } from '../../types/registry'
import { CategoryFilter } from './CategoryFilter'
import { SearchBar } from './SearchBar'

interface GalleryFiltersProps {
  categories: AnimationCategory[]
  selectedCategory: AnimationCategory | 'all'
  onCategoryChange: (category: AnimationCategory | 'all') => void
  sortBy: RegistrySortBy
  sortOrder: 'asc' | 'desc'
  onSortChange: (sortBy: RegistrySortBy) => void
  onSortOrderToggle: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  gridColumns: 2 | 3 | 4
  onGridColumnsChange: (columns: 2 | 3 | 4) => void
  autoPlayOnHover: boolean
  onAutoPlayToggle: () => void
  hasActiveFilters: boolean
  onClearFilters: () => void
}

const sortOptions: { value: RegistrySortBy; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'category', label: 'Category' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'createdAt', label: 'Date Added' },
]

export function GalleryFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderToggle,
  searchQuery,
  onSearchChange,
  gridColumns,
  onGridColumnsChange,
  autoPlayOnHover,
  onAutoPlayToggle,
  hasActiveFilters,
  onClearFilters,
}: GalleryFiltersProps) {
  const [isSortOpen, setIsSortOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      {/* Top Bar: Search + Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-Play Toggle */}
          <button
            type="button"
            onClick={onAutoPlayToggle}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
              autoPlayOnHover
                ? 'border-primary/50 bg-primary/10 text-primary hover:bg-primary/20'
                : 'border-border bg-background text-muted-foreground hover:bg-muted/50'
            }`}
            aria-label={autoPlayOnHover ? 'Disable hover auto-play' : 'Enable hover auto-play'}
            title={autoPlayOnHover ? 'Disable hover auto-play' : 'Enable hover auto-play'}
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Hover Play</span>
          </button>

          {/* Grid Layout Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            <button
              type="button"
              onClick={() => onGridColumnsChange(2)}
              className={`p-1.5 rounded transition-colors ${
                gridColumns === 2
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label="2 columns"
              title="2 columns"
            >
              <Rows3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onGridColumnsChange(3)}
              className={`p-1.5 rounded transition-colors ${
                gridColumns === 3
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label="3 columns"
              title="3 columns"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onGridColumnsChange(4)}
              className={`p-1.5 rounded transition-colors ${
                gridColumns === 4
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label="4 columns"
              title="4 columns"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Sort:</span>
              <span className="font-medium">
                {sortOptions.find((opt) => opt.value === sortBy)?.label}
              </span>
              <ArrowUpDown
                className={`h-3.5 w-3.5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
              />
            </button>

            {isSortOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSortOpen(false)}
                  aria-label="Close sort menu"
                />
                <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-border bg-background shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onSortChange(option.value)
                          setIsSortOpen(false)
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded-md transition-colors ${
                          sortBy === option.value
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border p-1">
                    <button
                      type="button"
                      onClick={() => {
                        onSortOrderToggle()
                        setIsSortOpen(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded-md transition-colors hover:bg-muted"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                      {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
      />
    </div>
  )
}
