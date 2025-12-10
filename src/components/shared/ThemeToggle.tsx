/**
 * Theme Toggle Component
 * Switches between light and dark themes with smooth transitions
 */

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  return (localStorage.getItem('theme') as Theme) || 'system'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme

  // Remove existing theme classes
  root.classList.remove('light', 'dark')

  // Add new theme class
  root.classList.add(effectiveTheme)

  // Store preference
  localStorage.setItem('theme', theme)

  // Update meta theme-color for mobile browsers
  const metaTheme = document.querySelector('meta[name="theme-color"]')
  if (metaTheme) {
    metaTheme.setAttribute('content', effectiveTheme === 'dark' ? '#0a0a0a' : '#ffffff')
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme)

  useEffect(() => {
    // Apply initial theme
    applyTheme(theme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme
  const isDark = effectiveTheme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-all hover:bg-muted hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Current theme: ${theme}${theme === 'system' ? ` (${effectiveTheme})` : ''}`}
    >
      {/* Sun icon for light mode */}
      <Sun
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
      />

      {/* Moon icon for dark mode */}
      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`}
      />
    </button>
  )
}
