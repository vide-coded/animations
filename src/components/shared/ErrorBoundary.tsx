/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */

import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo)

    this.setState({
      errorInfo,
    })

    // TODO: Send to error tracking service (e.g., Sentry)
    // trackError(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full space-y-6 text-center">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="w-12 h-12 text-destructive" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Oops! Something went wrong</h1>
              <p className="text-muted-foreground">
                An unexpected error occurred. Don't worry, you can try refreshing the page.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Show error details
                </summary>
                <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-mono text-destructive break-all">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/'
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-background text-foreground font-medium hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Go to Home
              </button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-muted-foreground">
              If the problem persists, try clearing your browser cache or{' '}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="underline hover:text-foreground transition-colors"
              >
                hard refresh the page
              </button>
              .
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
