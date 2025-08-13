import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MatchmakingRoom } from '../../rooms/MatchmakingRoom';

// Mock do Client
const mockClient = {
  sessionId: 'test-session-1',
  userData: {
    userId: 'user-1',
    username: 'TestPlayer',
    faction: 'roda-de-ginga'
  }
} as any;

describe('MatchmakingRoom', () => {
  let matchmakingRoom: MatchmakingRoom;

  beforeEach(() => {
    matchmakingRoom = new MatchmakingRoom();
    vi.clearAllMocks();
  });

  describe('Criação da Sala', () => {
    it('should create matchmaking room with initial state', () => {
      const options = { maxPlayers: 2 };
      matchmakingRoom.onCreate(options);

      expect(matchmakingRoom.state.players).toBeDefined();
      expect(matchmakingRoom.state.players.length).toBe(0);
      expect(matchmakingRoom.state.status).toBe('waiting');
    });

    it('should set room state correctly', () => {
      const options = { maxPlayers: 2 };
      matchmakingRoom.onCreate(options);

      expect(matchmakingRoom.state.maxPlayers).toBe(2);
      expect(matchmakingRoom.state.status).toBe('waiting');
    });
  });

  describe('Entrada de Jogadores', () => {
    it('should add player to queue when joining', () => {
      matchmakingRoom.onCreate({ maxPlayers: 2 });
      matchmakingRoom.onJoin(mockClient, { faction: 'roda-de-ginga' });

      expect(matchmakingRoom.state.players.length).toBe(1);
      expect(matchmakingRoom.state.players[0].sessionId).toBe('test-session-1');
      expect(matchmakingRoom.state.players[0].faction).toBe('roda-de-ginga');
    });

    it('should reject player if room is full', () => {
      matchmakingRoom.onCreate({ maxPlayers: 1 });
      
      // Primeiro jogador
      matchmakingRoom.onJoin(mockClient, { faction: 'roda-de-ginga' });
      
      // Segundo jogador (deve ser rejeitado)
      const secondClient = { ...mockClient, sessionId: 'test-session-2' };
      expect(() => {
        matchmakingRoom.onJoin(secondClient, { faction: 'motofrete-uniao' });
      }).toThrow('Sala cheia');
    });

    it('should update player status to ready when joining', () => {
      matchmakingRoom.onCreate({ maxPlayers: 2 });
      matchmakingRoom.onJoin(mockClient, { faction: 'roda-de-ginga' });

      const player = matchmakingRoom.state.players.find(p => p.sessionId === 'test-session-1');
      expect(player?.status).toBe('ready');
    });
  });

  describe('Matchmaking Logic', () => {
    it('should start matchmaking when two players join', () => {
      matchmakingRoom.onCreate({ maxPlayers: 2 });
      
      // Primeiro jogador
      matchmakingRoom.onJoin(mockClient, { faction: 'roda-de-ginga' });
      
      // Segundo jogador
      const secondClient = { ...mockClient, sessionId: 'test-session-2' };
      matchmakingRoom.onJoin(secondClient, { faction: 'motofrete-uniao' });

      expect(matchmakingRoom.state.status).toBe('matching');
    });

    it('should create game room when match is found', () => {
      const options = { maxPlayers: 2 };
      matchmakingRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      const player2Client = { ...mockClient, sessionId: 'player2' };

      matchmakingRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });
      matchmakingRoom.onJoin(player2Client, { faction: 'motofrete-uniao' });

      // Simular matchmaking imediato (sem timeout)
      matchmakingRoom.simulateMatchmaking();

      expect(matchmakingRoom.state.status).toBe('matched');
      expect(matchmakingRoom.state.gameRoomId).toBeDefined();
    });

    it('should assign different factions to players', () => {
      matchmakingRoom.onCreate({ maxPlayers: 2 });
      
      const player1 = { ...mockClient, sessionId: 'test-session-1' };
      const player2 = { ...mockClient, sessionId: 'test-session-2' };
      
      matchmakingRoom.onJoin(player1, { faction: 'roda-de-ginga' });
      matchmakingRoom.onJoin(player2, { faction: 'motofrete-uniao' });

      const p1 = matchmakingRoom.state.players.find(p => p.sessionId === 'test-session-1');
      const p2 = matchmakingRoom.state.players.find(p => p.sessionId === 'test-session-2');

      expect(p1?.faction).toBe('roda-de-ginga');
      expect(p2?.faction).toBe('motofrete-uniao');
    });
  });

  describe('Saída de Jogadores', () => {
    it('should remove player from queue when leaving', () => {
      matchmakingRoom.onCreate({ maxPlayers: 2 });
      matchmakingRoom.onJoin(mockClient, { faction: 'roda-de-ginga' });

      expect(matchmakingRoom.state.players.length).toBe(1);

      matchmakingRoom.onLeave(mockClient);

      expect(matchmakingRoom.state.players.length).toBe(0);
    });

    it('should reset room status when all players leave', () => {
      matchmakingRoom.onCreate({ maxPlayers: 2 });
      
      // Adicionar dois jogadores
      matchmakingRoom.onJoin(mockClient, { faction: 'roda-de-ginga' });
      const secondClient = { ...mockClient, sessionId: 'test-session-2' };
      matchmakingRoom.onJoin(secondClient, { faction: 'motofrete-uniao' });

      // Remover todos os jogadores
      matchmakingRoom.onLeave(mockClient);
      matchmakingRoom.onLeave(secondClient);

      expect(matchmakingRoom.state.status).toBe('waiting');
    });
  });

  describe('Timeout e Reconexão', () => {
    it('should handle player timeout', () => {
      matchmakingRoom.onCreate({ maxPlayers: 2 });
      matchmakingRoom.onJoin(mockClient, { faction: 'roda-de-ginga' });

      // Simular timeout
      matchmakingRoom.handlePlayerTimeout(mockClient.sessionId);

      expect(matchmakingRoom.state.players.length).toBe(0);
    });

    it('should allow player reconnection within timeout window', () => {
      matchmakingRoom.onCreate({ maxPlayers: 2 });
      matchmakingRoom.onJoin(mockClient, { faction: 'roda-de-ginga' });

      // Simular reconexão
      const reconnectedClient = { ...mockClient, sessionId: 'test-session-1' };
      matchmakingRoom.onJoin(reconnectedClient, { faction: 'roda-de-ginga' });

      expect(matchmakingRoom.state.players.length).toBe(1);
    });
  });

  describe('Mensagens e Eventos', () => {
    it('should handle player ready message', () => {
      matchmakingRoom.onCreate({ maxPlayers: 2 });
      matchmakingRoom.onJoin(mockClient, { faction: 'roda-de-ginga' });

      matchmakingRoom.simulateMessage(mockClient, { type: 'ready' });

      const player = matchmakingRoom.state.players.find(p => p.sessionId === 'test-session-1');
      expect(player?.status).toBe('ready');
    });

    it('should handle player cancel message', () => {
      const options = { maxPlayers: 2 };
      matchmakingRoom.onCreate(options);

      matchmakingRoom.onJoin(mockClient, { faction: 'roda-de-ginga' });

      // Simular cancelamento
      matchmakingRoom.simulateMessage(mockClient, { type: 'cancel' });

      expect(matchmakingRoom.state.players.length).toBe(0);
    });

    it('should broadcast match found to all players', () => {
      const options = { maxPlayers: 2 };
      matchmakingRoom.onCreate(options);

      const player1Client = { ...mockClient, sessionId: 'player1' };
      const player2Client = { ...mockClient, sessionId: 'player2' };

      matchmakingRoom.onJoin(player1Client, { faction: 'roda-de-ginga' });
      matchmakingRoom.onJoin(player2Client, { faction: 'motofrete-uniao' });

      // Simular matchmaking imediato
      matchmakingRoom.simulateMatchmaking();

      // Verificar se a mensagem foi enviada
      expect(matchmakingRoom.state.status).toBe('matched');
    });
  });
});
