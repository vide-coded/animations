# 🎨 Brain-Rot Canvas Animation Gallery

A curated gallery of trendy canvas animations inspired by viral social media effects (Instagram, TikTok). Browse, customize, and export code for stunning particle systems, waves, glitches, and geometric patterns.

## ✨ Features (Planned)

- 🎭 **20+ Animations**: Particles, waves, geometric shapes, text effects, glitches
- 🎮 **Live Preview**: Full-screen player with real-time parameter controls
- 🎨 **Customization**: Adjust colors, speed, size, and more
- 📦 **Code Export**: Generate standalone HTML, React components, or vanilla JS
- ⭐ **Favorites**: Save your favorite animations
- 🔍 **Filters**: Browse by category (Particles, Waves, Geometric, Text, Glitch)
- 🤖 **AI Generator** (Future): Create animations from text descriptions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm/yarn/pnpm/bun

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
```

### Lint & Format

```bash
npm run lint        # Check code quality
npm run lint:fix    # Auto-fix issues
npm run format      # Format with Biome
```

## 🏗️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite (Rolldown)
- **Routing**: TanStack Router
- **State**: TanStack Store
- **Styling**: Tailwind CSS + shadcn/ui
- **Linting**: Biome
- **Canvas**: Custom Canvas2D/WebGL engine

## 📁 Project Structure

```
src/
├── routes/              # TanStack Router pages
│   ├── __root.tsx      # Root layout
│   └── index.tsx       # Gallery view
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── gallery/        # Gallery components
│   ├── player/         # Animation player
│   └── shared/         # Reusable components
├── lib/
│   ├── canvas/         # Canvas engine
│   ├── animations/     # Animation library
│   │   ├── particles/  # Particle animations
│   │   ├── waves/      # Wave animations
│   │   ├── geometric/  # Geometric animations
│   │   ├── text/       # Text effects
│   │   └── glitch/     # Glitch effects
│   └── utils/          # Utilities
├── stores/             # TanStack Store state
└── types/              # TypeScript types
```

## 🎯 Development Roadmap

### ✅ Phase 1: Foundation (In Progress)
- [x] Project scaffolding
- [ ] Canvas engine architecture
- [ ] Sample animations (3)
- [ ] Basic gallery view

### 📋 Phase 2: Animation Library
- [ ] Implement 24 animations across categories
- [ ] Animation registry system
- [ ] Thumbnail generation

### 📋 Phase 3: Interactive Features
- [ ] Full-screen animation player
- [ ] Parameter editor
- [ ] Code export functionality
- [ ] Filters and search
- [ ] Favorites system

### 📋 Phase 4: Polish & Deploy
- [ ] Performance optimization
- [ ] Mobile responsive design
- [ ] Dark/light theme
- [ ] SEO optimization
- [ ] Deploy to Vercel

### 🔮 Phase 5: AI Animation Generator (Future)
- [ ] AI agent for animation generation
- [ ] Text-to-animation feature
- [ ] Community submissions

## 🤝 Contributing

This is a solo project with AI assistance. Contributions welcome after MVP launch!

## 📄 License

MIT

---

**Status**: 🟡 In Development (Phase 1 - 6% Complete)  
**Next Task**: Canvas Engine Architecture

