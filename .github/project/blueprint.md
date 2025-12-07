# Brain-Rot Canvas Animation Gallery - System Blueprint

## 🎯 Project Vision

A curated gallery of trendy canvas animations (particles, waves, morphing shapes, glitch effects) inspired by viral social media content. Users can browse, preview with live controls, customize parameters, and export code for their own projects.

---

## 🏛️ Architecture Overview

### System Type
**Client-Only SPA** (No backend/auth required for MVP)

### Core Technologies
- **Framework**: React 18 + TypeScript
- **Routing**: TanStack Router
- **State**: TanStack Store (filters, favorites, settings)
- **Canvas Engine**: Hybrid Canvas2D/WebGL renderer
- **Styling**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite
- **Linting**: Biome

---

## 📐 Component Architecture

### 1. Core Animation Engine
```typescript
// src/lib/canvas/engine.ts
interface AnimationConfig {
  id: string
  name: string
  category: 'particles' | 'waves' | 'geometric' | 'text' | 'glitch'
  renderer: 'canvas2d' | 'webgl'
  params: Record<string, AnimationParam>
  init: (ctx: CanvasContext, config: AnimationConfig) => AnimationState
  update: (state: AnimationState, deltaTime: number) => void
  render: (ctx: CanvasContext, state: AnimationState) => void
}

interface AnimationParam {
  type: 'number' | 'color' | 'select'
  label: string
  default: any
  min?: number
  max?: number
  step?: number
  options?: string[]
}
```

### 2. Animation Registry
Centralized registry of all available animations:
```typescript
// src/lib/animations/registry.ts
export const ANIMATION_REGISTRY = {
  'particle-burst': particleBurstAnimation,
  'wave-morph': waveMorphAnimation,
  'dot-matrix': dotMatrixAnimation,
  'glitch-text': glitchTextAnimation,
  // ... 20+ animations
}
```

### 3. Component Structure
```
src/
├── app/
│   ├── routes/
│   │   ├── __root.tsx              # Root layout
│   │   ├── index.tsx               # Gallery grid view
│   │   └── animation.$id.tsx       # Full-screen preview
│   └── router.tsx
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── gallery/
│   │   ├── AnimationCard.tsx       # Thumbnail with play on hover
│   │   ├── GalleryGrid.tsx         # Masonry/grid layout
│   │   └── CategoryFilter.tsx      # Filter sidebar
│   ├── player/
│   │   ├── CanvasPlayer.tsx        # Main canvas renderer
│   │   ├── ControlPanel.tsx        # Play/pause/speed controls
│   │   ├── ParameterEditor.tsx     # Live param sliders
│   │   └── CodeExporter.tsx        # Export modal
│   └── shared/
│       ├── FavoriteButton.tsx
│       └── ShareButton.tsx
├── lib/
│   ├── canvas/
│   │   ├── engine.ts               # Core animation loop
│   │   ├── canvas2d-renderer.ts
│   │   └── webgl-renderer.ts
│   ├── animations/
│   │   ├── registry.ts
│   │   ├── particles/              # Particle animations
│   │   ├── waves/                  # Wave animations
│   │   ├── geometric/              # Shape morphing
│   │   ├── text/                   # Text effects
│   │   └── glitch/                 # Glitch effects
│   └── utils/
│       ├── color.ts                # Color manipulation
│       ├── easing.ts               # Easing functions
│       └── code-generator.ts       # Export standalone code
├── stores/
│   ├── gallery-store.ts            # Filters, favorites, settings
│   └── player-store.ts             # Active animation state
└── types/
    └── animation.ts                # Shared type definitions
```

---

## 🎨 Animation Categories & Examples

### 1. Particles (8 animations)
- **Particle Burst**: Expanding circle of colored dots
- **Particle Wave**: Flowing particle streams
- **Constellation**: Connected dots forming network
- **Fireflies**: Organic floating particles
- **Explosion**: Radial particle explosion
- **Gravity Field**: Particles affected by mouse gravity
- **DNA Helix**: Rotating double helix particles
- **Starfield**: 3D depth-effect starfield

### 2. Waves (5 animations)
- **Sine Wave**: Animated sine wave with phase
- **Wave Interference**: Multiple overlapping waves
- **Audio Visualizer**: Frequency bar simulation
- **Liquid Morph**: Organic blob morphing
- **Line Waves**: Layered wave lines

### 3. Geometric (5 animations)
- **Rotating Cubes**: 3D cube rotation effect
- **Polygon Morph**: Shape-shifting polygons
- **Grid Distortion**: Mouse-reactive grid
- **Hexagon Grid**: Animated hexagonal tiles
- **Sacred Geometry**: Flower of life animation

### 4. Text (3 animations)
- **Glitch Text**: Digital glitch effect
- **Matrix Rain**: Falling character rain
- **Type Effect**: Animated typing with particles

### 5. Glitch (3 animations)
- **RGB Split**: Color channel separation
- **Scan Lines**: CRT monitor effect
- **Pixel Sort**: Glitch pixel sorting

---

## 🗂️ Data Models

### Animation Metadata (JSON)
```typescript
interface AnimationMetadata {
  id: string
  name: string
  description: string
  category: AnimationCategory
  tags: string[]
  renderer: 'canvas2d' | 'webgl'
  thumbnailUrl: string
  author: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  defaultParams: Record<string, any>
  codeSnippet: string  // For export
}
```

### User Preferences (LocalStorage)
```typescript
interface UserPreferences {
  favorites: string[]           // Animation IDs
  recentlyViewed: string[]
  theme: 'light' | 'dark'
  autoPlay: boolean
  defaultSpeed: number
  gridColumns: 2 | 3 | 4
}
```

---

## 🎮 User Flows

### Primary Flow: Browse & Preview
1. User lands on gallery grid (20+ animations)
2. Hover over card → Auto-play thumbnail
3. Click card → Navigate to full-screen player
4. Adjust parameters (color, speed, count) in real-time
5. Click "Export Code" → Copy standalone HTML/Canvas code
6. Click "Favorite" → Save to localStorage

### Secondary Flow: Filter & Search
1. Select category filter (Particles/Waves/etc.)
2. Grid updates with filtered animations
3. Search by tag/name

### Tertiary Flow: Code Export
1. User customizes animation parameters
2. Click "Export Code" button
3. Modal shows:
   - Standalone HTML file (complete)
   - React component (JSX)
   - Vanilla JS module
4. Copy to clipboard or download

---

## 🚀 Performance Considerations

### Optimization Strategies
1. **Lazy Load Animations**: Only load animation logic when viewed
2. **Thumbnail Generation**: Static GIF/MP4 for gallery cards
3. **RequestAnimationFrame**: Proper frame timing with deltaTime
4. **Worker Thread**: Move heavy calculations to Web Workers
5. **Canvas Pooling**: Reuse canvas contexts for thumbnails
6. **Bundle Splitting**: Separate WebGL animations from Canvas2D

### Performance Targets
- Gallery load: < 2s
- Animation start: < 100ms
- 60 FPS on desktop, 30+ FPS on mobile
- Bundle size: < 150KB (initial), lazy-load per animation

---

## 🎨 Design System

### Color Palette (Based on Animation Context)
- **Primary**: Dynamic (based on active animation)
- **Background**: Dark theme default (better for canvas visibility)
- **UI Controls**: Subtle glass-morphism overlays
- **Accents**: Neon highlights (cyan, magenta, yellow)

### Typography
- **Headings**: Inter (clean, modern)
- **Body**: System font stack
- **Code**: JetBrains Mono

### Layout
- **Gallery**: Masonry grid (responsive: 2/3/4 columns)
- **Player**: Full-screen canvas with floating controls
- **Controls**: Bottom-anchored panel (collapsible)

---

## 🔧 Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Setup Vite + React + TypeScript + Biome
- [ ] Install TanStack Router, Store, shadcn/ui
- [ ] Create canvas engine abstraction
- [ ] Implement 3 sample animations (particle burst, sine wave, glitch text)
- [ ] Basic gallery grid with routing

### Phase 2: Animation Library (Week 2)
- [ ] Implement all 24 animations
- [ ] Create animation registry
- [ ] Parameter editor component
- [ ] Live preview with controls

### Phase 3: UX Polish (Week 3)
- [ ] Category filters
- [ ] Favorites system (localStorage)
- [ ] Search functionality
- [ ] Thumbnail auto-play on hover
- [ ] Code export modal

### Phase 4: Optimization & Launch (Week 4)
- [ ] Performance profiling
- [ ] Lazy loading implementation
- [ ] Mobile responsive testing
- [ ] SEO meta tags
- [ ] Deploy to Vercel

---

## 🤖 Future Agent Requirements

### Animation Creator Agent
**Purpose**: Generate new canvas animations from text descriptions

**Capabilities**:
1. Parse user description ("Create a swirling galaxy effect")
2. Analyze existing animation patterns
3. Generate animation config with:
   - init() function
   - update() logic
   - render() implementation
   - Parameter definitions
4. Test animation for performance (FPS check)
5. Create thumbnail preview
6. Add to registry

**Input Format**:
```typescript
interface AnimationRequest {
  description: string
  category: AnimationCategory
  style: 'minimalist' | 'complex' | 'organic' | 'geometric'
  colors?: string[]
  speed?: 'slow' | 'medium' | 'fast'
  interactivity?: 'mouse' | 'scroll' | 'none'
}
```

**Output**:
- Complete animation module file
- Metadata JSON
- Generated thumbnail (static frame or GIF)

---

## 📦 Tech Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@tanstack/react-router": "^1.77.0",
    "@tanstack/react-store": "^0.5.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "typescript": "^5.6.3",
    "vite": "^5.4.11",
    "tailwindcss": "^3.4.15"
  }
}
```

---

## 🎯 Success Metrics

### MVP Launch Criteria
- ✅ 20+ working animations
- ✅ Smooth 60 FPS performance
- ✅ Code export functional
- ✅ Mobile responsive
- ✅ Lighthouse score > 90

### Post-MVP Goals
- User-submitted animations
- Animation remix/fork feature
- AI-powered animation generator agent
- Export to video (MP4/GIF)
- Social sharing with OG previews
