/**
 * Parameter Editor Component
 * Dynamic parameter input generation with real-time updates
 */

import { useCallback, useEffect, useState } from 'react'
import type { AnimationParameter } from '../../types/animation'
import { ColorPicker } from '../ui/ColorPicker'

export interface ParameterValues {
  [key: string]: number | string | boolean
}

interface ParameterEditorProps {
  parameters: AnimationParameter[]
  values: ParameterValues
  onChange: (paramName: string, value: number | string | boolean) => void
  onReset?: () => void
  className?: string
}

export function ParameterEditor({
  parameters,
  values,
  onChange,
  onReset,
  className = '',
}: ParameterEditorProps) {
  const [localValues, setLocalValues] = useState<ParameterValues>(values)

  // Sync with external values
  useEffect(() => {
    setLocalValues(values)
  }, [values])

  const handleChange = useCallback(
    (paramName: string, value: number | string | boolean) => {
      setLocalValues((prev) => ({ ...prev, [paramName]: value }))
      onChange(paramName, value)
    },
    [onChange]
  )

  const handleReset = useCallback(() => {
    const defaults: ParameterValues = {}
    for (const param of parameters) {
      defaults[param.name] = param.defaultValue
    }
    setLocalValues(defaults)
    onReset?.()
  }, [parameters, onReset])

  if (parameters.length === 0) {
    return (
      <div className={`rounded-lg border border-border bg-card p-4 ${className}`}>
        <p className="text-sm text-muted-foreground">No parameters available</p>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border border-border bg-card p-4 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Parameters</h3>
        {onReset && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded bg-secondary px-3 py-1 text-sm text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-4">
        {parameters.map((param) => (
          <div key={param.name} className="space-y-2">
            {param.type === 'number' && (
              <NumberParameter
                param={param}
                value={localValues[param.name] as number}
                onChange={(value) => handleChange(param.name, value)}
              />
            )}

            {param.type === 'color' && (
              <ColorParameter
                param={param}
                value={localValues[param.name] as string}
                onChange={(value) => handleChange(param.name, value)}
              />
            )}

            {param.type === 'boolean' && (
              <BooleanParameter
                param={param}
                value={localValues[param.name] as boolean}
                onChange={(value) => handleChange(param.name, value)}
              />
            )}

            {param.type === 'select' && (
              <SelectParameter
                param={param}
                value={localValues[param.name] as string | number}
                onChange={(value) => handleChange(param.name, value)}
              />
            )}

            {param.description && (
              <p className="text-xs text-muted-foreground">{param.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Number Parameter Component
interface NumberParameterProps {
  param: AnimationParameter
  value: number
  onChange: (value: number) => void
}

function NumberParameter({ param, value, onChange }: NumberParameterProps) {
  const min = param.min ?? 0
  const max = param.max ?? 100
  const step = param.step ?? 1

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={`param-${param.name}`} className="text-sm font-medium text-foreground">
          {param.label}
        </label>
        <span className="text-sm text-muted-foreground">{value}</span>
      </div>
      <input
        id={`param-${param.name}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

// Color Parameter Component
interface ColorParameterProps {
  param: AnimationParameter
  value: string
  onChange: (value: string) => void
}

function ColorParameter({ param, value, onChange }: ColorParameterProps) {
  return <ColorPicker label={param.label} value={value} onChange={onChange} />
}

// Boolean Parameter Component
interface BooleanParameterProps {
  param: AnimationParameter
  value: boolean
  onChange: (value: boolean) => void
}

function BooleanParameter({ param, value, onChange }: BooleanParameterProps) {
  return (
    <label
      htmlFor={`param-${param.name}`}
      className="flex cursor-pointer items-center justify-between"
    >
      <span className="text-sm font-medium text-foreground">{param.label}</span>
      <input
        id={`param-${param.name}`}
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 cursor-pointer accent-primary"
      />
    </label>
  )
}

// Select Parameter Component
interface SelectParameterProps {
  param: AnimationParameter
  value: string | number
  onChange: (value: string | number) => void
}

function SelectParameter({ param, value, onChange }: SelectParameterProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={`param-${param.name}`} className="text-sm font-medium text-foreground">
        {param.label}
      </label>
      <select
        id={`param-${param.name}`}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value
          // Try to parse as number if original value was number
          const parsed = Number(newValue)
          onChange(Number.isNaN(parsed) ? newValue : parsed)
        }}
        className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {param.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
