# FASE 8 — INTEGRAÇÕES - Planejamento

## 🎯 **Objetivos da FASE 8**

Implementar as integrações reais com backend e banco de dados, substituindo os mocks transparentes por sistemas funcionais de autenticação, persistência e comunicação em tempo real.

## 📋 **Entregáveis Principais**

### 1. **Servidor Colyseus Funcional** ✅
- [ ] **GameRoom**: Sala de jogo com lógica de partidas
- [ ] **MatchmakingRoom**: Sala de matchmaking real
- [ ] **WebSocket**: Comunicação em tempo real
- [ ] **Sincronização**: Estado de jogo entre jogadores

### 2. **Banco de Dados Supabase** ✅
- [ ] **Autenticação**: Sistema de login/registro
- [ ] **Perfis**: Persistência de dados de jogador
- [ ] **Decks**: Armazenamento de decks personalizados
- [ **Histórico**: Registro de partidas e estatísticas

### 3. **Integração Frontend-Backend** ✅
- [ ] **Hooks de Integração**: Conectar com APIs reais
- [ ] **Autenticação**: Login/logout funcional
- [ ] **Sincronização**: Estado em tempo real
- [ ] **Error Handling**: Tratamento de erros de rede

### 4. **Telemetria e Analytics** ✅
- [ ] **Eventos de Jogo**: Tracking de ações
- [ ] **Métricas**: Performance e uso
- [ ] **Logs**: Sistema de logging estruturado

## 🏗️ **Arquitetura de Integração**

### **Estrutura do Servidor**
```typescript
// apps/server/src/rooms/
├── GameRoom.ts          # Sala de partida
├── MatchmakingRoom.ts   # Sala de matchmaking
├── LobbyRoom.ts         # Sala de lobby
└── types/
    ├── GameState.ts     # Estado do jogo
    ├── Player.ts        # Dados do jogador
    └── Messages.ts      # Tipos de mensagens
```

### **Estrutura do Banco**
```sql
-- Tabelas principais
users (id, username, email, created_at)
profiles (user_id, level, xp, rank, favorite_faction)
decks (id, user_id, name, cards, created_at)
games (id, player1_id, player2_id, winner_id, duration, created_at)
game_results (game_id, player_id, faction, result, xp_gained)
```

### **Integração Frontend**
```typescript
// apps/web/src/services/
├── api/
│   ├── auth.ts          # Autenticação
│   ├── profile.ts       # Perfil do usuário
│   ├── deck.ts          # Gerenciamento de deck
│   └── game.ts          # Dados de jogo
├── websocket/
│   ├── client.ts        # Cliente WebSocket
│   ├── game.ts          # Eventos de jogo
│   └── matchmaking.ts   # Eventos de matchmaking
└── storage/
    ├── local.ts         # Storage local
    └── session.ts       # Storage de sessão
```

## 🧪 **Estratégia de Testes**

### **TDD-First Approach**
1. **Testes RED**: Escrever testes para integrações
2. **Implementação GREEN**: Código mínimo para passar
3. **Refatoração**: Melhorar código mantendo testes

### **Tipos de Testes**
- **Unit**: Hooks de integração
- **Integration**: API calls e WebSocket
- **E2E**: Fluxos completos de autenticação e jogo

### **Cobertura Alvo**
- **Serviços**: 90%+ cobertura
- **Hooks**: 85%+ cobertura
- **Integração**: 80%+ cobertura

## 📁 **Estrutura de Arquivos**

```
apps/
├── server/
│   ├── src/
│   │   ├── rooms/
│   │   │   ├── GameRoom.ts
│   │   │   ├── MatchmakingRoom.ts
│   │   │   └── LobbyRoom.ts
│   │   ├── services/
│   │   │   ├── database.ts
│   │   │   ├── auth.ts
│   │   │   └── game.ts
│   │   └── types/
│   │       ├── GameState.ts
│   │       ├── Player.ts
│   │       └── Messages.ts
│   └── tests/
│       ├── rooms/
│       ├── services/
│       └── integration/
└── web/
    ├── src/
    │   ├── services/
    │   │   ├── api/
    │   │   ├── websocket/
    │   │   └── storage/
    │   └── hooks/
    │       ├── useAuth.ts
    │       ├── useWebSocket.ts
    │       └── useApi.ts
    └── tests/
        ├── services/
        ├── hooks/
        └── integration/
```

## 🚀 **Cronograma de Implementação**

### **Semana 1: Servidor Colyseus**
- [ ] Configuração do servidor Colyseus
- [ ] GameRoom básica
- [ ] MatchmakingRoom básica
- [ ] Testes de sala

### **Semana 2: Banco de Dados**
- [ ] Configuração Supabase
- [ ] Tabelas e migrations
- [ ] Serviços de banco
- [ ] Testes de persistência

### **Semana 3: Autenticação**
- [ ] Sistema de login/registro
- [ ] JWT tokens
- [ ] Proteção de rotas
- [ ] Testes de auth

### **Semana 4: Integração Frontend**
- [ ] Hooks de integração
- [ ] WebSocket client
- [ ] Error handling
- [ ] Testes E2E

## 🎯 **Critérios de Sucesso**

### **Funcional**
- [ ] Login/logout funcional
- [ ] Matchmaking em tempo real
- [ ] Partidas sincronizadas
- [ ] Persistência de dados

### **Técnico**
- [ ] 85%+ cobertura de testes
- [ ] Todos os testes passando
- [ ] Performance otimizada
- [ ] Error handling robusto

### **UX**
- [ ] Loading states apropriados
- [ ] Feedback de erro claro
- [ ] Reconexão automática
- [ ] Offline handling

## 🔄 **Integração com Fases Anteriores**

### **FASE 5 (Mocks Transparentes)**
- Substituir mocks por implementações reais
- Manter contratos estabelecidos
- Documentar mudanças

### **FASE 7 (Funcionalidades de Jogo)**
- Integrar hooks existentes
- Manter lógica de jogo
- Adicionar persistência

## 🎮 **Próximos Passos**

1. **Iniciar com Servidor**: Configuração básica do Colyseus
2. **Implementar TDD**: Testes primeiro, código depois
3. **Integrar Progressivamente**: Conectar sistemas gradualmente
4. **Validar Funcionalidades**: Testes manuais e automatizados

## 🔧 **Configurações Necessárias**

### **Variáveis de Ambiente**
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Colyseus
COLYSEUS_PORT=2567
COLYSEUS_HOST=localhost

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### **Dependências**
```json
{
  "colyseus": "^0.15.0",
  "@colyseus/core": "^0.15.0",
  "@supabase/supabase-js": "^2.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3"
}
```

---

**FASE 8**: Transformar mocks em sistemas reais! 🚀
