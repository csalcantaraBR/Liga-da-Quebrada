# Liga da Quebrada - Documentação

## Visão Geral

Liga da Quebrada é um card battler tático 1v1 com partidas de 3-4 minutos, desenvolvido seguindo metodologia TDD-primeiro.

## 🎯 **Status do Projeto**

### ✅ **FASES CONCLUÍDAS**
- **FASE 1-4**: Lógica de jogo pura (100% concluída)
- **FASE 5**: Mocks transparentes (100% concluída)
- **FASE 6.1**: Componente Card avançado (100% concluída)
- **FASE 6.2**: Sistema de navegação (100% concluída)

### 🔄 **PRÓXIMAS FASES**
- **FASE 6.3**: Animações e micro-interações
- **FASE 6.4**: Componentes avançados (HUD, EnergySlider)
- **FASE 7**: Funcionalidades de jogo
- **FASE 8**: Integrações
- **FASE 9**: Aplicações completas

## Estrutura do Projeto

```
Liga da Quebrada/
├── packages/
│   ├── @lq/shared/     # Tipos e schemas compartilhados
│   ├── @lq/ui/         # Componentes UI (React + React Native) - 73.45% cobertura
│   │   ├── Card/       # Componente de carta avançado (97.37% cobertura)
│   │   ├── BottomBar/  # Navegação mobile (100% cobertura)
│   │   ├── TopBar/     # Navegação web (83.81% cobertura)
│   │   └── tokens/     # Design system
│   └── @lq/game/       # Lógica de jogo pura (100% cobertura)
├── docs/
│   ├── README.md       # Documentação principal
│   ├── mocks/          # Documentação de mocks
│   └── adr/            # Architecture Decision Records
└── apps/               # Aplicações (futuro)
```

## 📊 **Métricas Atuais**

| Pacote | Cobertura | Status |
|--------|-----------|--------|
| **@lq/game** | **100%** | ✅ Concluído |
| **@lq/ui** | **73.45%** | ✅ Concluído |
| **@lq/shared** | **100%** | ✅ Concluído |

## 🎮 **Funcionalidades Implementadas**

### **FASE 6.2 — Sistema de Navegação**
- ✅ **BottomBar**: Navegação mobile com 4 tabs
- ✅ **TopBar**: Navegação web responsiva
- ✅ **Acessibilidade**: Labels completos em português
- ✅ **Responsividade**: Mobile e desktop
- ✅ **Breadcrumbs**: Navegação hierárquica
- ✅ **Notificações**: Sistema de badges

### **FASE 6.1 — Componente Card Avançado**
- ✅ **Estados Visuais**: 6 estados diferentes
- ✅ **Acessibilidade**: Labels automáticos
- ✅ **Badges**: Sistema dinâmico de efeitos
- ✅ **Tooltip**: Hover com descrição
- ✅ **Design System**: Uso completo dos tokens

### **FASE 5 — Mocks Transparentes**
- ✅ **Mocks Estruturados**: Sistema de mocks organizado
- ✅ **Documentação**: ADR e guias de uso
- ✅ **Integração**: Mocks integrados ao sistema

### **FASE 1-4 — Lógica de Jogo**
- ✅ **Engine de Jogo**: Sistema completo de partidas
- ✅ **Cartas**: Sistema de cartas com efeitos
- ✅ **Facções**: 6 facções únicas
- ✅ **Testes**: 100% de cobertura

## 🚀 **Próximos Passos**

### **FASE 6.3 — Animações e Micro-interações**
1. **React Native Reanimated**: Animações nativas
2. **Framer Motion**: Animações web
3. **Transições**: Estados de navegação
4. **Micro-interações**: Feedback visual

### **FASE 6.4 — Componentes Avançados**
1. **HUD**: Interface de jogo
2. **EnergySlider**: Controle de energia
3. **Tooltips**: Sistema global

### **FASE 7 — Funcionalidades de Jogo**
1. **Matchmaking**: Sistema de partidas
2. **Deck Builder**: Construção de decks
3. **Game Board**: Tabuleiro de jogo

## 🛠 **Tecnologias**

- **TypeScript**: Tipagem estática
- **React Native**: Desenvolvimento mobile
- **React Native Web**: Compatibilidade web
- **Vitest**: Testes unitários
- **TDD**: Metodologia Test-Driven Development
- **Monorepo**: Gerenciamento com pnpm workspaces

## 📚 **Documentação**

- [FASE 6.2 — Sistema de Navegação](packages/@lq/ui/FASE6.2_SUMMARY.md)
- [FASE 6.1 — Componente Card](packages/@lq/ui/FASE6.1_SUMMARY.md)
- [FASE 5 — Mocks Transparentes](packages/@lq/game/FASE5_SUMMARY.md)
- [Mocks Documentation](docs/mocks/mocks.md)
- [Architecture Decision Records](docs/adr/)

## 🎯 **Objetivos**

O projeto visa criar um card battler tático completo com:
- **Experiência Mobile**: Otimizado para dispositivos móveis
- **Compatibilidade Web**: Funciona em navegadores
- **Acessibilidade**: Inclusivo para todos os usuários
- **Performance**: Animações fluidas e responsivas
- **Qualidade**: Testes abrangentes e código limpo
