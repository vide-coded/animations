/**
 * Control Panel Component
 * Detached control panel for canvas player
 */

export interface ControlPanelProps {
  isPlaying: boolean
  speed: number
  fps?: number
  showFPS?: boolean
  onPlayPause: () => void
  onRestart: () => void
  onSpeedChange: (speed: number) => void
  className?: string
}

export function ControlPanel({
  isPlaying,
  speed,
  fps = 0,
  showFPS = false,
  onPlayPause,
  onRestart,
  onSpeedChange,
  className = '',
}: ControlPanelProps) {
  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 ${className}`}
    >
      {/* Left Section - Playback Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={onPlayPause}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <title>Pause</title>
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <title>Play</title>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Restart Button */}
        <button
          type="button"
          onClick={onRestart}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:bg-accent"
          aria-label="Restart"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>Restart</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Center Section - Speed Controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Speed:</span>
        <div className="flex gap-1 rounded-lg border border-border bg-background p-1">
          {[0.25, 0.5, 1, 1.5, 2].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSpeedChange(s)}
              className={`min-w-[3rem] rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                speed === s
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Right Section - FPS Counter */}
      {showFPS && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <svg
            className="h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Performance</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="font-mono text-sm font-medium">{fps} FPS</span>
        </div>
      )}
    </div>
  )
}
