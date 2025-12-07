/**
 * Color Picker Component
 * Custom color picker with hex input and visual selector
 */

import { useCallback, useEffect, useRef, useState } from 'react'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  disabled?: boolean
}

export function ColorPicker({ value, onChange, label, disabled = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleHexChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value
      setLocalValue(hex)

      // Validate hex color
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        onChange(hex)
      }
    },
    [onChange]
  )

  const handleColorInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value
      setLocalValue(color)
      onChange(color)
    },
    [onChange]
  )

  return (
    <div className="space-y-2">
      <div className="flex gap-2" ref={pickerRef}>
        <div className="flex flex-1 flex-col gap-2">
          {label && (
            <label htmlFor={`color-input-${label}`} className="text-sm font-medium text-foreground">
              {label}
            </label>
          )}

          <div className="flex gap-2">
            {/* Color Preview Button */}
            <button
              type="button"
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
              className="h-10 w-10 rounded border-2 border-border transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: localValue }}
              title="Pick color"
            />

            {/* Hex Input */}
            <input
              id={`color-input-${label}`}
              type="text"
              value={localValue}
              onChange={handleHexChange}
              disabled={disabled}
              placeholder="#000000"
              className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Color Picker Popover */}
      {isOpen && (
        <div className="absolute z-50 mt-2 rounded-lg border border-border bg-background p-4 shadow-lg">
          <div className="space-y-3">
            <div className="text-sm font-medium text-foreground">Select Color</div>

            {/* Native Color Input */}
            <input
              type="color"
              value={localValue}
              onChange={handleColorInputChange}
              className="h-32 w-full cursor-pointer rounded border border-border"
            />

            {/* Quick Color Presets */}
            <div className="grid grid-cols-8 gap-2">
              {[
                '#ff0000',
                '#ff7f00',
                '#ffff00',
                '#00ff00',
                '#0000ff',
                '#4b0082',
                '#9400d3',
                '#ffffff',
                '#ff6b6b',
                '#4ecdc4',
                '#45b7d1',
                '#f9ca24',
                '#6c5ce7',
                '#a29bfe',
                '#fd79a8',
                '#636e72',
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setLocalValue(color)
                    onChange(color)
                  }}
                  className="h-8 w-8 rounded border border-border transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
