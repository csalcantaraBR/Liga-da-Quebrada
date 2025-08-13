# FASE 7 — FUNCIONALIDADES DE JOGO - Planejamento

## 🎯 **Objetivos da FASE 7**

Implementar as funcionalidades core do jogo, transformando a UI estática em um sistema de jogo funcional com lógica real de matchmaking, partidas e gerenciamento de deck.

## 📋 **Entregáveis Principais**

### 1. **Sistema de Matchmaking Real** ✅
- [x] **Hook `useMatchmaking`**: Lógica de busca e pareamento
- [x] **Componente `MatchmakingQueue`**: Interface de fila de espera
- [x] **Simulação de Pareamento**: Mock de servidor para testes
- [x] **Estados de Busca**: Procurando, Pareado, Conectando, Pronto

### 2. **Sistema de Partidas Completas** ✅
- [x] **Hook `useGame`**: Gerenciamento de estado da partida
- [x] **Componente `GameBoard`**: Arena de batalha funcional
- [x] **Sistema de Turnos**: 4 rodadas com lógica de jogo
- [x] **Mecânicas de Jogo**: Energia, vida, cartas, efeitos

### 3. **Sistema de Deck Funcional** ✅
- [x] **Hook `useDeck`**: Gerenciamento de deck do jogador
- [x] **Componente `DeckBuilder`**: Interface de construção real
- [x] **Coleção de Cartas**: Sistema de cartas disponíveis
- [x] **Validação de Deck**: Regras de construção (8 cartas, 1 por facção)

### 4. **Sistema de Progressão**
- [ ] **Hook `useProfile`**: Gerenciamento de perfil e estatísticas
- [ ] **Componente `ProfileStats`**: Exibição de progresso
- [ ] **Sistema de Ranking**: Pontuação e classificação
- [ ] **Conquistas**: Sistema de achievements

## 🎮 **Mecânicas de Jogo a Implementar**

### **Estrutura de Partida**
```typescript
interface GameState {
  players: [Player, Player];
  currentRound: number;
  maxRounds: 4;
  currentTurn: 'player1' | 'player2';
  gamePhase: 'setup' | 'playing' | 'finished';
  winner?: 'player1' | 'player2' | 'draw';
}
```

### **Sistema de Cartas**
```typescript
interface Card {
  id: string;
  name: string;
  faction: Faction;
  power: number;
  energy: number;
  effects: Effect[];
  keywords: string[];
}
```

### **Mecânicas de Turno**
- **Energia**: Cada jogador tem 5 energia por turno
- **Jogar Cartas**: Consome energia baseada no custo da carta
- **Efeitos**: Cartas têm efeitos especiais (dano, cura, buffs, debuffs)
- **Vida**: Jogador perde quando vida chega a 0

## 🧪 **Estratégia de Testes**

### **TDD-First Approach**
1. **Testes RED**: Escrever testes para funcionalidades
2. **Implementação GREEN**: Código mínimo para passar
3. **Refatoração**: Melhorar código mantendo testes

### **Cobertura Alvo**
- **Hooks**: 90%+ cobertura
- **Componentes**: 85%+ cobertura
- **Lógica de Jogo**: 95%+ cobertura

## 📁 **Estrutura de Arquivos**

```
src/
├── hooks/
│   ├── useMatchmaking.ts
│   ├── useGame.ts
│   ├── useDeck.ts
│   └── useProfile.ts
├── components/
│   ├── MatchmakingQueue.tsx
│   ├── GameBoard.tsx
│   ├── DeckBuilder.tsx
│   └── ProfileStats.tsx
├── game/
│   ├── types.ts
│   ├── mechanics.ts
│   ├── cards.ts
│   └── matchmaking.ts
└── tests/
    ├── hooks/
    │   ├── useMatchmaking.test.ts
    │   ├── useGame.test.ts
    │   ├── useDeck.test.ts
    │   └── useProfile.test.ts
    ├── components/
    │   ├── MatchmakingQueue.test.tsx
    │   ├── GameBoard.test.tsx
    │   ├── DeckBuilder.test.tsx
    │   └── ProfileStats.test.tsx
    └── game/
        ├── mechanics.test.ts
        ├── cards.test.ts
        └── matchmaking.test.ts
```

## 🚀 **Cronograma de Implementação**

### **Semana 1: Matchmaking**
- [ ] Hook `useMatchmaking` com testes
- [ ] Componente `MatchmakingQueue`
- [ ] Simulação de servidor mock

### **Semana 2: Sistema de Jogo**
- [ ] Hook `useGame` com testes
- [ ] Componente `GameBoard`
- [ ] Lógica de turnos e mecânicas

### **Semana 3: Deck Builder**
- [ ] Hook `useDeck` com testes
- [ ] Componente `DeckBuilder`
- [ ] Sistema de cartas e validação

### **Semana 4: Progressão**
- [ ] Hook `useProfile` com testes
- [ ] Componente `ProfileStats`
- [ ] Sistema de ranking e conquistas

## 🎯 **Critérios de Sucesso**

### **Funcional**
- [ ] Matchmaking funcional com simulação
- [ ] Partidas completas de 4 rodadas
- [ ] Sistema de deck com validação
- [ ] Progressão e estatísticas

### **Técnico**
- [ ] 85%+ cobertura de testes
- [ ] Todos os testes passando
- [ ] Código limpo e documentado
- [ ] Performance otimizada

### **UX**
- [ ] Interface responsiva
- [ ] Feedback visual claro
- [ ] Estados de loading apropriados
- [ ] Acessibilidade mantida

## 🔄 **Integração com Fases Anteriores**

### **FASE 5 (Mocks Transparentes)**
- Aproveitar mocks existentes
- Estender para novos serviços de jogo

### **FASE 6 (UX/UI Completa)**
- Integrar com sistema de navegação
- Manter design system consistente
- Usar tokens de design existentes

## 🎮 **Próximos Passos**

1. **Iniciar com Matchmaking**: Sistema mais simples para começar
2. **Implementar TDD**: Testes primeiro, código depois
3. **Integrar Progressivamente**: Conectar com UI existente
4. **Validar Funcionalidades**: Testes manuais e automatizados

---

**FASE 7**: Transformar UI estática em jogo funcional! 🎯
