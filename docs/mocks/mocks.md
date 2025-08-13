# Mocks Transparentes - Liga da Quebrada

## 📋 **Visão Geral**

Este documento registra todos os mocks e integrações transparentes utilizados no desenvolvimento do MVP, seguindo a metodologia TDD-primeiro.

## 🎯 **Princípios dos Mocks Transparentes**

1. **Transparência**: Todo mock deve ser documentado com seu contrato real
2. **Temporariedade**: Mocks são temporários até implementação real
3. **Contratos**: Definir contratos claros para validação futura
4. **Testes**: Criar testes de contrato para validar integrações reais

---

## 🔄 **Estado Atual: FASE 5**

### ✅ **Implementado (Sem Mocks)**
- **Lógica de jogo pura** (`@lq/game`): Não requer mocks
- **Componentes UI básicos** (`@lq/ui`): Não requer mocks
- **Tipos e schemas** (`@lq/shared`): Não requer mocks

### 🔄 **Próximas Integrações (Fases 6-9)**

---

## 📱 **FASE 6 — UX/UI COMPLETA**

### 6.1 **Sistema de Navegação**
**Mock Atual**: Navegação básica em apps
**Contrato Real**: 
```typescript
interface NavigationState {
  currentScreen: 'home' | 'matchmaking' | 'game' | 'deck' | 'profile';
  params?: Record<string, any>;
  history: NavigationEntry[];
}
```

**Plano de Remoção**: Implementar React Navigation (mobile) e Next.js Router (web)

### 6.2 **Sistema de Animações**
**Mock Atual**: Transições básicas
**Contrato Real**:
```typescript
interface AnimationConfig {
  duration: number;
  easing: 'standard' | 'decelerate' | 'anticipate';
  delay?: number;
  onComplete?: () => void;
}
```

**Plano de Remoção**: Implementar React Native Reanimated e Framer Motion

### 6.3 **Sistema de Acessibilidade**
**Mock Atual**: Labels básicos
**Contrato Real**:
```typescript
interface AccessibilityProps {
  accessible: boolean;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
}
```

**Plano de Remoção**: Implementar sistema completo de acessibilidade

---

## 🎮 **FASE 7 — FUNCIONALIDADES DE JOGO**

### 7.1 **Sistema de Matchmaking**
**Mock Atual**: Não implementado
**Contrato Real**:
```typescript
interface MatchmakingService {
  joinQueue(playerId: string, elo: number): Promise<MatchResult>;
  cancelQueue(playerId: string): Promise<void>;
  getQueueStatus(playerId: string): Promise<QueueStatus>;
}

interface MatchResult {
  matchId: string;
  opponent: PlayerInfo;
  estimatedWaitTime: number;
}
```

**Dados de Exemplo**:
```json
{
  "matchId": "match_123",
  "opponent": {
    "id": "player_456",
    "name": "JogadorTeste",
    "elo": 1200,
    "faction": "RODA_DE_GINGA"
  },
  "estimatedWaitTime": 5
}
```

**Plano de Remoção**: Implementar serviço real com Redis + Colyseus

### 7.2 **Sistema de Partidas**
**Mock Atual**: Apenas lógica de rodada
**Contrato Real**:
```typescript
interface GameSession {
  matchId: string;
  players: [PlayerState, PlayerState];
  currentRound: number;
  roundHistory: RoundResult[];
  gameState: 'waiting' | 'playing' | 'finished';
  winner?: string;
}
```

**Plano de Remoção**: Implementar sala Colyseus completa

### 7.3 **Sistema de Deck**
**Mock Atual**: Deck fixo
**Contrato Real**:
```typescript
interface DeckService {
  getPlayerDeck(playerId: string): Promise<Deck>;
  updateDeck(playerId: string, deck: Deck): Promise<void>;
  getAvailableCards(playerId: string): Promise<Card[]>;
}

interface Deck {
  id: string;
  name: string;
  cards: string[]; // card IDs
  isActive: boolean;
}
```

**Plano de Remoção**: Implementar com Supabase

---

## 🔌 **FASE 8 — INTEGRAÇÕES**

### 8.1 **Servidor Colyseus**
**Mock Atual**: Stub básico
**Contrato Real**:
```typescript
interface GameRoom {
  onCreate(options: RoomOptions): void;
  onJoin(client: Client, options: JoinOptions): void;
  onLeave(client: Client, consented: boolean): void;
  onMessage(client: Client, message: GameMessage): void;
  onDispose(): void;
}
```

**Plano de Remoção**: Implementar sala completa com lógica de jogo

### 8.2 **Banco de Dados (Supabase)**
**Mock Atual**: Não implementado
**Contrato Real**:
```typescript
interface DatabaseService {
  // Players
  createPlayer(player: PlayerData): Promise<Player>;
  getPlayer(playerId: string): Promise<Player>;
  updatePlayer(playerId: string, data: Partial<PlayerData>): Promise<Player>;
  
  // Matches
  createMatch(match: MatchData): Promise<Match>;
  getMatch(matchId: string): Promise<Match>;
  updateMatch(matchId: string, data: Partial<MatchData>): Promise<Match>;
  
  // Decks
  getPlayerDeck(playerId: string): Promise<Deck>;
  savePlayerDeck(playerId: string, deck: DeckData): Promise<Deck>;
}
```

**Plano de Remoção**: Implementar com Supabase real

### 8.3 **Autenticação**
**Mock Atual**: Não implementado
**Contrato Real**:
```typescript
interface AuthService {
  signInAnonymously(): Promise<User>;
  signInWithEmail(email: string, password: string): Promise<User>;
  signUp(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  linkAnonymousAccount(email: string, password: string): Promise<User>;
}
```

**Plano de Remoção**: Implementar com Supabase Auth

### 8.4 **Telemetria**
**Mock Atual**: Console.log
**Contrato Real**:
```typescript
interface TelemetryService {
  trackEvent(event: GameEvent): Promise<void>;
  trackError(error: GameError): Promise<void>;
  trackPerformance(metric: PerformanceMetric): Promise<void>;
}

interface GameEvent {
  eventName: string;
  playerId: string;
  timestamp: number;
  properties: Record<string, any>;
}
```

**Plano de Remoção**: Implementar com serviço de analytics real

---

## 📱 **FASE 9 — APLICAÇÕES COMPLETAS**

### 9.1 **Web PWA**
**Mock Atual**: Apenas tela básica
**Contrato Real**:
```typescript
interface PWAService {
  install(): Promise<void>;
  isInstalled(): boolean;
  showInstallPrompt(): void;
  updateAvailable(): boolean;
  update(): Promise<void>;
}
```

**Plano de Remoção**: Implementar PWA completa

### 9.2 **Mobile App**
**Mock Atual**: Apenas tela básica
**Contrato Real**:
```typescript
interface MobileFeatures {
  hapticFeedback(type: 'light' | 'medium' | 'heavy'): void;
  shareScore(score: number): Promise<void>;
  getDeviceInfo(): DeviceInfo;
  requestPermissions(): Promise<PermissionStatus>;
}
```

**Plano de Remoção**: Implementar funcionalidades nativas

---

## 🧪 **TESTES DE CONTRATO**

### **Estrutura de Testes**
```typescript
// Para cada integração mockada
describe('Contract Tests - [Service Name]', () => {
  it('should match expected interface', () => {
    // Validar que o mock implementa o contrato
  });
  
  it('should handle error cases', () => {
    // Validar tratamento de erros
  });
  
  it('should return expected data format', () => {
    // Validar formato de dados
  });
});
```

### **Plano de Validação**
1. **FASE 6**: Testes de contrato para navegação e animações
2. **FASE 7**: Testes de contrato para matchmaking e partidas
3. **FASE 8**: Testes de contrato para todas as integrações
4. **FASE 9**: Testes E2E completos

---

## 📊 **ROADMAP DE REMOÇÃO DE MOCKS**

| Fase | Mocks | Status | Data Prevista |
|------|-------|--------|---------------|
| 6 | Navegação, Animações, Acessibilidade | 🔄 | Próxima |
| 7 | Matchmaking, Partidas, Deck | ⏳ | Fase 7 |
| 8 | Colyseus, Supabase, Auth, Telemetria | ⏳ | Fase 8 |
| 9 | PWA, Mobile Features | ⏳ | Fase 9 |

---

## ✅ **CHECKLIST DE TRANSPARÊNCIA**

- [x] **Documentação**: Todos os mocks documentados
- [x] **Contratos**: Interfaces definidas para cada integração
- [x] **Dados de Exemplo**: Payloads de exemplo fornecidos
- [x] **Plano de Remoção**: Rota clara para implementação real
- [x] **Testes de Contrato**: Estrutura definida
- [ ] **Implementação**: Mocks serão implementados nas próximas fases

---

**Próximo**: FASE 6 — UX/UI COMPLETA
