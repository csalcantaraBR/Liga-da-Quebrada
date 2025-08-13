import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGame } from '../../hooks/useGame';
import { Card } from '../../game/types';

// Mock simples das funções do jogo
vi.mock('../../game/cards', () => ({
  generateBalancedDeck: vi.fn(() => [])
}));

vi.mock('../../game/mechanics', () => ({
  initializeGame: vi.fn(() => ({
    id: 'test-game',
    players: [
      {
        id: 'player1',
        name: 'Player 1',
        deck: [],
        life: 20,
        energy: 5,
        hand: [],
        field: []
      },
      {
        id: 'player2',
        name: 'Player 2',
        deck: [],
        life: 20,
        energy: 0,
        hand: [],
        field: []
      }
    ],
    currentRound: 1,
    maxRounds: 4,
    currentTurn: 'player1',
    gamePhase: 'playing',
    startTime: new Date(),
    lastActionTime: new Date()
  })),
  playCard: vi.fn(),
  endTurn: vi.fn(),
  canPlayCard: vi.fn(() => true),
  getCurrentPlayer: vi.fn(),
  getOpponentPlayer: vi.fn(),
  canGameContinue: vi.fn(() => true),
  GAME_CONSTANTS: {
    MAX_ROUNDS: 4,
    STARTING_LIFE: 20,
    ENERGY_PER_TURN: 5
  }
}));

describe('useGame Hook', () => {

  const mockCard: Card = {
    id: 'test-card',
    name: 'Test Card',
    faction: 'roda-de-ginga',
    power: 3,
    energy: 2,
    effects: [],
    keywords: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Estado Inicial', () => {
    it('should provide all required functions', () => {
      const { result } = renderHook(() => useGame('test-match'));
      
      expect(typeof result.current.playCard).toBe('function');
      expect(typeof result.current.endTurn).toBe('function');
      expect(typeof result.current.canPlayCard).toBe('function');
    });
  });

  describe('Inicialização do Jogo', () => {
    it('should initialize game when matchId is provided', async () => {
      const { result } = renderHook(() => useGame('test-match'));
      
      await act(async () => {
        // Aguarda a inicialização
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.gameState).toBeDefined();
    });

    it('should not initialize without matchId', () => {
      const { result } = renderHook(() => useGame());
      
      expect(result.current.gameState).toBe(null);
    });
  });

  describe('Funcionalidades Básicas', () => {
    it('should provide game state after initialization', async () => {
      const { result } = renderHook(() => useGame('test-match'));
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.gameState).toBeDefined();
      expect(result.current.gamePhase).toBe('playing');
    });

    it('should calculate turn correctly', async () => {
      const { result } = renderHook(() => useGame('test-match', 'player1'));
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isMyTurn).toBe(true);
    });

    it('should check if card can be played', async () => {
      const { result } = renderHook(() => useGame('test-match'));
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const canPlay = result.current.canPlayCard(mockCard);
      expect(typeof canPlay).toBe('boolean');
    });
  });
});
