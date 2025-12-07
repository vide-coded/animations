/**
 * Animation Registry Initialization
 * Registers all animations with their metadata
 */

import type { Animation } from '../../types/animation'
import { animationMetadata } from './metadata'
import { animationRegistry } from './registry'

/**
 * Register all animations
 */
export function initializeRegistry(): void {
  // Helper to safely get metadata
  const getMetadata = (id: string) => {
    const metadata = animationMetadata.find((m) => m.id === id)
    if (!metadata) {
      throw new Error(`Metadata not found for animation: ${id}`)
    }
    return metadata
  }

  // Particle animations
  animationRegistry.register(getMetadata('particle-burst'), () =>
    import('./particles/particle-burst').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('particle-wave'), () =>
    import('./particles/particle-wave').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('constellation'), () =>
    import('./particles/constellation').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('fireflies'), () =>
    import('./particles/fireflies').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('explosion'), () =>
    import('./particles/explosion').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('gravity-field'), () =>
    import('./particles/gravity-field').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('dna-helix'), () =>
    import('./particles/dna-helix').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('starfield'), () =>
    import('./particles/starfield').then((m) => m.default)
  )

  // Wave animations
  animationRegistry.register(getMetadata('sine-wave'), () =>
    import('./waves/sine-wave').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('wave-interference'), () =>
    import('./waves/wave-interference').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('audio-visualizer'), () =>
    import('./waves/audio-visualizer').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('liquid-morph'), () =>
    import('./waves/liquid-morph').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('line-waves'), () =>
    import('./waves/line-waves').then((m) => m.default)
  )

  // Geometric animations
  animationRegistry.register(getMetadata('glitch-text'), () =>
    import('./glitch/glitch-text').then((m) => m.default)
  )

  // Geometric animations
  animationRegistry.register(getMetadata('rotating-cubes'), () =>
    import('./geometric/rotating-cubes').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('polygon-morph'), () =>
    import('./geometric/polygon-morph').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('grid-distortion'), () =>
    import('./geometric/grid-distortion').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('hexagon-grid'), () =>
    import('./geometric/hexagon-grid').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('sacred-geometry'), () =>
    import('./geometric/sacred-geometry').then((m) => m.default)
  )

  // Text animations
  animationRegistry.register(getMetadata('matrix-rain'), () =>
    import('./text/matrix-rain').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('type-effect'), () =>
    import('./text/type-effect').then((m) => m.default)
  )

  // Geometric animations
  animationRegistry.register(getMetadata('rotating-cubes'), () =>
    import('./geometric/rotating-cubes').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('rgb-split'), () =>
    import('./glitch/rgb-split').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('scan-lines'), () =>
    import('./glitch/scan-lines').then((m) => m.default)
  )
  animationRegistry.register(getMetadata('pixel-sort'), () =>
    import('./glitch/pixel-sort').then((m) => m.default)
  )
}

/**
 * Get animation by ID (convenience function)
 */
export async function getAnimation(id: string): Promise<Animation | null> {
  return animationRegistry.getById(id)
}

export { animationMetadata } from './metadata'
/**
 * Export registry for direct access
 */
export { animationRegistry } from './registry'
