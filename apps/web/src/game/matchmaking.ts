import { MatchmakingState, MatchmakingEvent, MatchmakingConfig } from './types';

// Mock do servidor de matchmaking
export class MockMatchmakingServer {
  private searchQueue: string[] = [];
  private activeSearches = new Map<string, NodeJS.Timeout>();
  private eventListeners: ((event: MatchmakingEvent) => void)[] = [];

  constructor(private config: MatchmakingConfig = {
    maxSearchTime: 60,
    retryAttempts: 3,
    matchmakingTimeout: 30
  }) {}

  // Simula início de busca
  async startSearch(playerId: string): Promise<MatchmakingEvent> {
    console.log(`[MockServer] Player ${playerId} iniciou busca`);
    
    // Adiciona à fila
    this.searchQueue.push(playerId);
    
    // Simula delay de rede
    await this.delay(100);
    
    const event: MatchmakingEvent = {
      type: 'search_started',
      timestamp: new Date(),
      data: { playerId }
    };
    
    this.emitEvent(event);
    
    // Inicia timer de busca
    const searchTimeout = setTimeout(() => {
      this.handleSearchTimeout(playerId);
    }, this.config.maxSearchTime * 1000);
    
    this.activeSearches.set(playerId, searchTimeout);
    
    // Simula pareamento após alguns segundos
    setTimeout(() => {
      this.simulateMatchmaking(playerId);
    }, Math.random() * 5000 + 2000); // 2-7 segundos
    
    return event;
  }

  // Simula cancelamento de busca
  async cancelSearch(playerId: string): Promise<MatchmakingEvent> {
    console.log(`[MockServer] Player ${playerId} cancelou busca`);
    
    // Remove da fila
    const index = this.searchQueue.indexOf(playerId);
    if (index > -1) {
      this.searchQueue.splice(index, 1);
    }
    
    // Cancela timer
    const timeout = this.activeSearches.get(playerId);
    if (timeout) {
      clearTimeout(timeout);
      this.activeSearches.delete(playerId);
    }
    
    const event: MatchmakingEvent = {
      type: 'search_started',
      timestamp: new Date(),
      data: { playerId, cancelled: true }
    };
    
    this.emitEvent(event);
    return event;
  }

  // Simula pareamento
  private async simulateMatchmaking(playerId: string) {
    // Verifica se ainda está na fila
    if (!this.searchQueue.includes(playerId)) {
      return;
    }
    
    // Remove da fila
    const index = this.searchQueue.indexOf(playerId);
    this.searchQueue.splice(index, 1);
    
    // Cancela timer
    const timeout = this.activeSearches.get(playerId);
    if (timeout) {
      clearTimeout(timeout);
      this.activeSearches.delete(playerId);
    }
    
    // Gera oponente mock
    const opponent = this.generateMockOpponent();
    const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`[MockServer] Match encontrado: ${matchId} entre ${playerId} e ${opponent.id}`);
    
    // Simula eventos de pareamento
    const matchEvent: MatchmakingEvent = {
      type: 'opponent_found',
      timestamp: new Date(),
      data: { 
        playerId, 
        opponent, 
        matchId 
      }
    };
    
    this.emitEvent(matchEvent);
    
    // Simula conexão
    await this.delay(500);
    
    const connectEvent: MatchmakingEvent = {
      type: 'connection_established',
      timestamp: new Date(),
      data: { matchId }
    };
    
    this.emitEvent(connectEvent);
    
    // Simula jogo pronto
    await this.delay(300);
    
    const readyEvent: MatchmakingEvent = {
      type: 'game_ready',
      timestamp: new Date(),
      data: { matchId, opponent }
    };
    
    this.emitEvent(readyEvent);
  }

  // Simula timeout de busca
  private handleSearchTimeout(playerId: string) {
    console.log(`[MockServer] Timeout de busca para ${playerId}`);
    
    // Remove da fila
    const index = this.searchQueue.indexOf(playerId);
    if (index > -1) {
      this.searchQueue.splice(index, 1);
    }
    
    this.activeSearches.delete(playerId);
    
    // Emite evento de timeout
    const event: MatchmakingEvent = {
      type: 'search_started',
      timestamp: new Date(),
      data: { playerId, timeout: true }
    };
    
    this.emitEvent(event);
  }

  // Gera oponente mock
  private generateMockOpponent() {
    const names = [
      'Capoeirista123', 'MotoboyPro', 'GraffitiMaster', 
      'BateristaElite', 'GuardiãoVerde', 'VaqueiroSertão',
      'QuebradaKing', 'FavelaWarrior', 'StreetFighter',
      'UndergroundHero', 'TerritoryLord', 'BattleMaster'
    ];
    
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    return {
      id: `opponent_${Math.random().toString(36).substr(2, 9)}`,
      name: names[Math.floor(Math.random() * names.length)],
      rank: ranks[Math.floor(Math.random() * ranks.length)]
    };
  }

  // Sistema de eventos
  onEvent(callback: (event: MatchmakingEvent) => void) {
    this.eventListeners.push(callback);
  }

  private emitEvent(event: MatchmakingEvent) {
    this.eventListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('[MockServer] Erro ao emitir evento:', error);
      }
    });
  }

  // Utilitário para delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Limpa recursos
  cleanup() {
    this.searchQueue = [];
    this.activeSearches.forEach(timeout => clearTimeout(timeout));
    this.activeSearches.clear();
    this.eventListeners = [];
  }
}

// Instância singleton do servidor mock
export const mockMatchmakingServer = new MockMatchmakingServer();
