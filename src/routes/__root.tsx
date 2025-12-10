import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ErrorBoundary } from '../components/shared/ErrorBoundary'
import { PerformanceDashboard } from '../components/shared/PerformanceDashboard'
import { generateStructuredData } from '../lib/utils/seo'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  useEffect(() => {
    // Add structured data for rich search results
    generateStructuredData()
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Outlet />
        <PerformanceDashboard />
      </div>
    </ErrorBoundary>
  )
}
