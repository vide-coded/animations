/**
 * Parameter utility types and helpers
 */

import type { AnimationParameter, AnimationParameterValues } from './animation'

/**
 * Extract parameter type from AnimationParameter
 */
export type ParameterValue<T extends AnimationParameter['type']> = T extends 'number'
  ? number
  : T extends 'color'
    ? string
    : T extends 'boolean'
      ? boolean
      : T extends 'select'
        ? string | number
        : never

/**
 * Type-safe parameter validation
 */
export interface ParameterValidation {
  isValid: boolean
  errors: string[]
}

/**
 * Parameter change handler
 */
export type ParameterChangeHandler = (paramName: string, value: number | string | boolean) => void

/**
 * Parameter preset for quick configurations
 */
export interface ParameterPreset {
  name: string
  description?: string
  values: AnimationParameterValues
}

/**
 * User preferences for animations
 */
export interface UserPreferences {
  defaultSpeed: number
  autoPlay: boolean
  showFPS: boolean
  preferredQuality: 'low' | 'medium' | 'high'
  darkMode: boolean
  savedPresets: Record<string, ParameterPreset[]>
}
