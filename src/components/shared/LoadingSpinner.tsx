/**
 * Loading Spinner Component
 * Reusable loading indicator
 */

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  )
}

/**
 * Full Page Loading
 * Centered loading spinner for full page loading states
 */
interface FullPageLoadingProps {
  text?: string
}

export function FullPageLoading({ text = 'Loading...' }: FullPageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}
