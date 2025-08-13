import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameRoom } from '../../rooms/GameRoom';

// Mock do Client
const mockClient = {
  sessionId: 'test-session-1',
  userData: {
    userId: 'user-1',
    username: 'TestPlayer',
    faction: 'roda-de-ginga'
  }
} as any;

describe('GameRoom', () => {
  let gameRoom: GameRoom;

  beforeEach(() => {
    gameRoom = new GameRoom();
    vi.clearAllMocks();
  });

  describe('Criação da Sala', () => {
    it('should create game room with initial state', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      expect(gameRoom.state.round).toBe(1);
      expect(gameRoom.state.maxRounds).toBe(4);
      expect(gameRoom.state.status).toBe('preparing');
      expect(gameRoom.state.players.length).toBe(2);
    });

    it('should initialize players with correct stats', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      const player1 = gameRoom.state.players.find(p => p.sessionId === 'player1');
      const player2 = gameRoom.state.players.find(p => p.sessionId === 'player2');

      expect(player1?.respect).toBe(12);
      expect(player1?.energy).toBe(8);
      expect(player1?.faction).toBe('roda-de-ginga');
      expect(player2?.respect).toBe(12);
      expect(player2?.energy).toBe(8);
      expect(player2?.faction).toBe('motofrete-uniao');
    });
  });

  describe('Entrada de Jogadores', () => {
    it('should allow players to join the game', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      const player2Client = { ...mockClient, sessionId: 'player2' };

      gameRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });
      gameRoom.onJoin(player2Client, { faction: 'motofrete-uniao' });

      expect(gameRoom.state.players.length).toBe(2);
    });

    it('should start game when both players are ready', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      const player2Client = { ...mockClient, sessionId: 'player2' };

      gameRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });
      gameRoom.onJoin(player2Client, { faction: 'motofrete-uniao' });

      // Simular jogadores prontos
      gameRoom.simulateMessage(player1Client, { type: 'ready' });
      gameRoom.simulateMessage(player2Client, { type: 'ready' });

      expect(gameRoom.state.status).toBe('playing');
    });
  });

  describe('Mecânicas de Jogo', () => {
    it('should handle card play correctly', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      gameRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });

      // Simular jogada de carta
      gameRoom.simulateMessage(player1Client, { 
        type: 'play-card', 
        data: { cardId: 'card-1', target: 'player2' } 
      });

      // Verificar se a carta foi jogada
      const player1 = gameRoom.state.players.find(p => p.sessionId === 'player1');
      expect(player1?.hand).toBeDefined();
    });

    it('should handle turn end correctly', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      const player2Client = { ...mockClient, sessionId: 'player2' };

      gameRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });
      gameRoom.onJoin(player2Client, { faction: 'motofrete-uniao' });

      // Simular fim do turno do jogador 1
      gameRoom.simulateMessage(player1Client, { type: 'end-turn' });

      expect(gameRoom.state.currentTurn).toBe('player2');
    });

    it('should advance round when both players end turn', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      const player2Client = { ...mockClient, sessionId: 'player2' };

      gameRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });
      gameRoom.onJoin(player2Client, { faction: 'motofrete-uniao' });

      // Simular fim dos turnos
      gameRoom.simulateMessage(player1Client, { type: 'end-turn' });
      gameRoom.simulateMessage(player2Client, { type: 'end-turn' });

      expect(gameRoom.state.round).toBe(2);
    });
  });

  describe('Fim de Jogo', () => {
    it('should end game after 4 rounds', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      const player2Client = { ...mockClient, sessionId: 'player2' };

      gameRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });
      gameRoom.onJoin(player2Client, { faction: 'motofrete-uniao' });

      // Simular 4 rodadas completas
      for (let i = 0; i < 4; i++) {
        gameRoom.simulateMessage(player1Client, { type: 'end-turn' });
        gameRoom.simulateMessage(player2Client, { type: 'end-turn' });
        
        // Parar se o jogo terminou
        if (gameRoom.state.status === 'finished') {
          break;
        }
      }

      expect(gameRoom.state.status).toBe('finished');
      expect(gameRoom.state.round).toBe(4);
    });

    it('should determine winner based on respect points', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      const player2Client = { ...mockClient, sessionId: 'player2' };

      gameRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });
      gameRoom.onJoin(player2Client, { faction: 'motofrete-uniao' });

      // Simular jogo completo
      gameRoom.simulateCompleteGame();

      // Verificar se há um vencedor válido (pode ser player1 ou player2)
      expect(['player1', 'player2']).toContain(gameRoom.state.winner);
      expect(gameRoom.state.status).toBe('finished');
    });

    it('should handle player concession', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      const player2Client = { ...mockClient, sessionId: 'player2' };

      gameRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });
      gameRoom.onJoin(player2Client, { faction: 'motofrete-uniao' });

      // Simular concessão do jogador 1
      gameRoom.simulateMessage(player1Client, { type: 'concede' });

      expect(gameRoom.state.winner).toBe('player2');
      expect(gameRoom.state.status).toBe('finished');
    });
  });

  describe('Saída de Jogadores', () => {
    it('should handle player disconnect gracefully', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      const player2Client = { ...mockClient, sessionId: 'player2' };

      gameRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });
      gameRoom.onJoin(player2Client, { faction: 'motofrete-uniao' });

      // Simular desconexão do player1
      gameRoom.onLeave(player1Client);

      expect(gameRoom.state.status).toBe('finished');
      expect(gameRoom.state.winner).toBe('player2');
    });

    it('should handle reconnection within timeout', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      const player2Client = { ...mockClient, sessionId: 'player2' };

      gameRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });
      gameRoom.onJoin(player2Client, { faction: 'motofrete-uniao' });

      // Simular reconexão
      const reconnectedClient = { ...player1Client, sessionId: 'player1' };
      gameRoom.onJoin(reconnectedClient, { faction: 'roda-de-ginga' });

      expect(gameRoom.state.players.length).toBe(2);
    });
  });

  describe('Histórico de Rodadas', () => {
    it('should record round results correctly', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      const player2Client = { ...mockClient, sessionId: 'player2' };

      gameRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });
      gameRoom.onJoin(player2Client, { faction: 'motofrete-uniao' });

      // Simular uma rodada
      gameRoom.simulateMessage(player1Client, { type: 'end-turn' });
      gameRoom.simulateMessage(player2Client, { type: 'end-turn' });

      expect(gameRoom.state.roundHistory.length).toBe(1);
      expect(gameRoom.state.roundHistory[0].round).toBe(1);
    });

    it('should calculate damage correctly', () => {
      const options = { 
        player1: { sessionId: 'player1', faction: 'roda-de-ginga' },
        player2: { sessionId: 'player2', faction: 'motofrete-uniao' }
      };
      gameRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      const player2Client = { ...mockClient, sessionId: 'player2' };

      gameRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });
      gameRoom.onJoin(player2Client, { faction: 'motofrete-uniao' });

      // Iniciar o jogo primeiro
      gameRoom.simulateMessage(player1Client, { type: 'ready' });
      gameRoom.simulateMessage(player2Client, { type: 'ready' });

      // Simular jogada com dano
      gameRoom.simulateMessage(player1Client, { 
        type: 'play-card', 
        data: { cardId: 'attack-card', target: 'player2', damage: 5 } 
      });

      const player2 = gameRoom.state.players.find(p => p.sessionId === 'player2');
      expect(player2?.respect).toBeLessThan(12);
    });
  });
});
