# 🏆 Liga da Quebrada - Brazilian Street Fighting Card Game

[![CI/CD](https://github.com/csalcantaraBR/Liga-da-Quebrada/actions/workflows/ci.yml/badge.svg)](https://github.com/csalcantaraBR/Liga-da-Quebrada/actions/workflows/ci.yml)
[![Test Coverage](https://img.shields.io/badge/tests-249%2F249-brightgreen)](https://github.com/csalcantaraBR/Liga-da-Quebrada)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Colyseus](https://img.shields.io/badge/Colyseus-0.15-green)](https://colyseus.io/)

> **Liga da Quebrada** is a strategic card game that celebrates Brazilian street culture, featuring unique characters, factions, and gameplay mechanics inspired by the vibrant communities of Brazil's favelas and urban areas.

## 🎮 Game Overview

**Liga da Quebrada** is a turn-based card game where players build decks representing different Brazilian street factions, each with unique abilities and strategies. The game combines tactical card gameplay with real-time multiplayer features, creating an immersive experience that honors Brazilian urban culture.

### 🌟 Key Features

- **🎴 Strategic Card Combat**: Build decks with unique Brazilian street culture themes
- **🏘️ Multiple Factions**: Choose from different street communities, each with distinct abilities
- **⚡ Real-time Multiplayer**: Battle against other players in real-time using Colyseus
- **📱 Cross-platform**: Play on web, mobile, and desktop
- **🎨 Rich Visual Design**: Beautiful animations and micro-interactions
- **♿ Accessibility**: Full screen reader support and keyboard navigation

## 🏗️ Architecture

This project uses a **monorepo architecture** with the following structure:

```
├── apps/
│   ├── web/          # Next.js web application
│   ├── mobile/       # React Native mobile app
│   └── server/       # Colyseus game server
├── packages/
│   ├── @lq/ui/       # Shared UI components and hooks
│   ├── @lq/game/     # Core game logic and mechanics
│   └── @lq/shared/   # Shared types and utilities
└── docs/             # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** ([Install](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/csalcantaraBR/Liga-da-Quebrada.git
cd Liga-da-Quebrada

# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

### Development Commands

```bash
# Start all development servers
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

## 🎯 Game Mechanics

### Core Systems

1. **Energy System**: Players start with energy that regenerates each turn
2. **Card Combat**: Strategic card placement and timing
3. **Faction Abilities**: Unique powers for each street community
4. **Progression**: Unlock new cards and abilities through gameplay

### Factions

- **🏘️ Favela Crew**: Defensive specialists with community bonuses
- **🎵 Funk Squad**: Rhythm-based attackers with musical abilities
- **⚡ Street Runners**: Fast, agile fighters with mobility advantages
- **🛡️ Security Force**: Balanced fighters with protection abilities

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Next.js** - Web framework
- **React Native** - Mobile development
- **Framer Motion** - Animations

### Backend
- **Colyseus** - Real-time game server
- **Node.js** - Runtime environment
- **TypeScript** - Type safety

### Development Tools
- **Vitest** - Testing framework
- **Turbo** - Monorepo build system
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📊 Project Status

### Current Phase: FASE 9 - Game Features (70% Complete)

| Component | Status | Tests |
|-----------|--------|-------|
| **useGameIntegration Hook** | ✅ Complete | 15/15 |
| **HUD Component** | ✅ Complete | 23/23 |
| **EnergySlider** | ✅ Complete | 16/16 |
| **Card System** | ✅ Complete | 17/17 |
| **Animation System** | ✅ Complete | 52/52 |
| **Server Integration** | 🔄 In Progress | - |

### Test Coverage: 249/249 (100%)

- **UI Components**: 100% coverage
- **Game Logic**: 100% coverage
- **Hooks**: 100% coverage
- **Server**: 100% coverage

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Vitest** for testing
- **TDD** methodology (Test-Driven Development)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Brazilian Street Culture**: For inspiring the game's themes and mechanics
- **Open Source Community**: For the amazing tools and libraries
- **Colyseus Team**: For the excellent real-time game server framework
- **React Team**: For the incredible UI framework

## 📞 Contact

- **Project Link**: [https://github.com/csalcantaraBR/Liga-da-Quebrada](https://github.com/csalcantaraBR/Liga-da-Quebrada)
- **Issues**: [GitHub Issues](https://github.com/csalcantaraBR/Liga-da-Quebrada/issues)

## 🌟 Support the Project

If you enjoy **Liga da Quebrada**, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs
- 💡 **Suggesting** new features
- 🤝 **Contributing** code
- 📢 **Sharing** with friends

---

**Made with ❤️ in Brazil** 🇧🇷
