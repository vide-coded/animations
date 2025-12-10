/**
 * Empty State Component
 * Displays when no content is available
 */

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}
    >
      {/* Icon */}
      <div className="p-4 rounded-full bg-muted border border-border mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>

      {/* Optional Action */}
      {action && <div>{action}</div>}
    </div>
  )
}
