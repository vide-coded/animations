# 🎨 Brain-Rot: Canvas Animation Gallery

## 📋 Project Summary

**Vision**: A curated gallery of trendy canvas animations (like viral social media effects) where users can browse, customize, and export code. Future capability: AI agent generates new animations from descriptions.

**Type**: Client-only SPA (no backend/auth for MVP)

**Timeline**: 4 weeks to MVP + Future AI agent expansion

---

## 🎯 Core Features (MVP)

1. **Gallery View**: 20+ pre-built animations in responsive grid
2. **Live Preview**: Full-screen player with play/pause/speed controls
3. **Parameter Editor**: Real-time customization (colors, speed, count, etc.)
4. **Code Export**: Generate standalone HTML, React component, or vanilla JS
5. **Favorites System**: Save animations to localStorage
6. **Category Filters**: Particles, Waves, Geometric, Text, Glitch
7. **Hover Auto-Play**: Preview animations on hover in gallery

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 + TypeScript |
| Routing | TanStack Router |
| State | TanStack Store |
| Canvas | Custom Canvas2D/WebGL engine |
| UI | shadcn/ui + Tailwind CSS |
| Build | Vite |
| Linting | Biome |
| Deploy | Vercel |

---

## 📦 Animation Categories

### Particles (8 animations)
Particle Burst, Wave, Constellation, Fireflies, Explosion, Gravity Field, DNA Helix, Starfield

### Waves (5 animations)
Sine Wave, Interference, Audio Visualizer, Liquid Morph, Line Waves

### Geometric (5 animations)
Rotating Cubes, Polygon Morph, Grid Distortion, Hexagon Grid, Sacred Geometry

### Text (3 animations)
Glitch Text, Matrix Rain, Type Effect

### Glitch (3 animations)
RGB Split, Scan Lines, Pixel Sort

---

## 🗂️ File Structure

```
src/
├── app/
│   ├── routes/
│   │   ├── index.tsx                    # Gallery grid
│   │   └── animation.$id.tsx            # Full-screen player
│   └── router.tsx
├── components/
│   ├── ui/                              # shadcn/ui
│   ├── gallery/                         # AnimationCard, GalleryGrid, Filters
│   ├── player/                          # CanvasPlayer, Controls, ParamEditor
│   └── shared/                          # FavoriteButton, ThemeToggle
├── lib/
│   ├── canvas/
│   │   ├── engine.ts                    # Core animation loop
│   │   ├── canvas2d-renderer.ts
│   │   └── webgl-renderer.ts
│   ├── animations/
│   │   ├── registry.ts                  # Central animation registry
│   │   ├── particles/                   # 8 particle animations
│   │   ├── waves/                       # 5 wave animations
│   │   ├── geometric/                   # 5 geometric animations
│   │   ├── text/                        # 3 text animations
│   │   └── glitch/                      # 3 glitch animations
│   └── utils/
│       ├── color.ts
│       ├── easing.ts
│       └── code-generator.ts            # Export functionality
├── stores/
│   ├── gallery-store.ts                 # Filters, favorites
│   └── player-store.ts                  # Active animation state
└── types/
    └── animation.ts                     # Shared interfaces
```

---

## 🤖 Specialized Agents

### 1. Frontend Engineer
- **Role**: React components, routing, state management
- **Stack**: React, TanStack Router/Store, Tailwind, shadcn/ui
- **Responsibilities**: Build gallery, player, controls, filters, export feature

### 2. Animation Specialist
- **Role**: Canvas animation development
- **Expertise**: Canvas2D, WebGL, particle systems, math/physics
- **Responsibilities**: Create all 24 animations, optimize performance (60 FPS)

### 3. DevOps Engineer
- **Role**: Build configuration & deployment
- **Stack**: Vite, Biome, Vercel, Git
- **Responsibilities**: Setup project, optimize builds, deploy to production

### 4. Animation Creator Agent (POST-MVP)
- **Role**: AI-powered animation generator
- **Capability**: Generate new animations from text descriptions
- **Input**: "Create a swirling galaxy with glowing particles"
- **Output**: Complete animation module integrated into gallery

---

## 📈 Implementation Phases

### Phase 1: Foundation Setup (Week 1)
- Project scaffolding (Vite, React, TypeScript, Biome)
- Canvas engine architecture
- 3 sample animations (Particle Burst, Sine Wave, Glitch Text)
- Basic gallery view with routing

### Phase 2: Animation Library (Week 2)
- Implement all 24 animations
- Animation registry system
- Thumbnail generation

### Phase 3: Interactive Player (Week 3)
- Canvas player component
- Parameter editor (real-time updates)
- Code export feature
- Filters, search, favorites
- Hover auto-play

### Phase 4: Polish & Deploy (Week 4)
- Performance optimization (lazy loading, code splitting)
- Responsive design (mobile-first)
- Dark/light theme
- SEO & meta tags
- Deploy to Vercel

### Phase 5: AI Animation Generator (Future)
- Animation Creator Agent implementation
- UI for animation requests
- Validation & testing pipeline
- Community submissions (if backend added)

---

## 🎯 Success Criteria

### MVP Launch
- ✅ 20+ working animations at 60 FPS
- ✅ Full-featured player with parameter controls
- ✅ Code export functional (HTML/React/JS)
- ✅ Mobile responsive
- ✅ Lighthouse score > 90
- ✅ Deployed to production

### Post-MVP Goals
- AI animation generator functional
- User-submitted animations
- Animation remixing/forking
- Export to video (MP4/GIF)
- Community gallery with voting

---

## 🚀 Getting Started

### Next Steps
1. ✅ **Blueprint created** (this file + roadmap.md)
2. ✅ **Agents generated** (Frontend, Animation, DevOps)
3. **Ready for Task 1.1**: Project Scaffolding

### How to Proceed
Say **"Start Task 1.1"** or **"Next task"** to begin implementation.

Use **"Status"** anytime to check progress.

---

## 📊 Current Status

- **Phase**: 3 COMPLETE ✅ → Moving to Phase 4
- **Progress**: 65% (20/31 tasks)
- **Completed**: 
  - ✅ Phase 1: Foundation Setup
  - ✅ Phase 2: Animation Library Expansion  
  - ✅ Phase 3: Interactive Player & Controls
- **Next Up**: Task 4.1 - Performance Optimization (Frontend Engineer)
- **Blockers**: None

---

## 🎉 Phase 3 Achievements

### Interactive Player & Controls (COMPLETE)
1. ✅ **Canvas Player Component** - Full-screen player with controls
2. ✅ **Parameter Editor** - Real-time customization with 7+ parameters
3. ✅ **TanStack Store Integration** - State management with localStorage
4. ✅ **Code Export Feature** - HTML/React/Vanilla JS with syntax highlighting
5. ✅ **Category Filters & Search** - Debounced search, sort, grid layout
6. ✅ **Favorites System** - Heart button, favorites page, recently viewed
7. ✅ **Hover Auto-Play** - Preview on hover with performance limits (max 3)

### Features Delivered
- 24 animations across 5 categories
- Real-time parameter editing
- Code export in 3 formats
- Advanced filtering and search
- Favorites with localStorage persistence
- Hover preview with performance optimization
- Responsive grid layout (2/3/4 columns)
- FPS monitoring and speed control

---

## 🤝 Agent Coordination

The Orchestrator manages task delegation:

1. **DevOps Engineer** → Setup project structure, configs, deployment
2. **Frontend Engineer** → Build React components, routing, state
3. **Animation Specialist** → Create all canvas animations
4. **Animation Creator Agent** → (Future) Generate animations from descriptions

Each agent has specialized knowledge and follows strict code standards. The Orchestrator ensures tasks are executed in dependency order and tracks progress.

---

**Ready to build? Say "Next task" to begin!** 🚀
