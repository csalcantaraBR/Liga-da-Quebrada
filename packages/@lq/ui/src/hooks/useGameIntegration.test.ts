import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameIntegration } from './useGameIntegration';

// Mock do Colyseus
vi.mock('colyseus.js', () => ({
  Client: vi.fn().mockImplementation(() => ({
    joinOrCreate: vi.fn(),
    onStateChange: vi.fn(),
    onMessage: vi.fn(),
    send: vi.fn(),
    leave: vi.fn()
  }))
}));

describe('useGameIntegration Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Estado Inicial', () => {
    it('should initialize with default game state', () => {
      const { result } = renderHook(() => useGameIntegration('test-room-id'));

      expect(result.current.gameState).toEqual({
        respect: 12,
        energy: 8,
        round: 1,
        maxRound: 4,
        status: 'preparing'
      });
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Conexão com Servidor', () => {
    it('should connect to game room successfully', async () => {
      const { result } = renderHook(() => useGameIntegration('test-room-id'));

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.isConnected).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle connection error', async () => {
      const { result } = renderHook(() => useGameIntegration('invalid-room-id'));

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.isConnected).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('Atualização de Estado', () => {
    it('should update game state when receiving server updates', async () => {
      const { result } = renderHook(() => useGameIntegration('test-room-id'));

      await act(async () => {
        await result.current.connect();
        // Simular atualização do servidor
        result.current.updateGameState({
          respect: 10,
          energy: 6,
          round: 2,
          maxRound: 4,
          status: 'playing'
        });
      });

      expect(result.current.gameState).toEqual({
        respect: 10,
        energy: 6,
        round: 2,
        maxRound: 4,
        status: 'playing'
      });
    });
  });

  describe('Controle de Energia', () => {
    it('should send energy change to server', async () => {
      const { result } = renderHook(() => useGameIntegration('test-room-id'));

      await act(async () => {
        await result.current.connect();
        result.current.setEnergy(5);
      });

      expect(result.current.gameState.energy).toBe(5);
    });

    it('should not allow energy below 0', async () => {
      const { result } = renderHook(() => useGameIntegration('test-room-id'));

      await act(async () => {
        await result.current.connect();
        result.current.setEnergy(-1);
      });

      expect(result.current.gameState.energy).toBe(0);
    });

    it('should not allow energy above max', async () => {
      const { result } = renderHook(() => useGameIntegration('test-room-id'));

      await act(async () => {
        await result.current.connect();
        result.current.setEnergy(15);
      });

      expect(result.current.gameState.energy).toBe(12);
    });
  });

  describe('Ações de Jogo', () => {
    it('should send play card action', async () => {
      const { result } = renderHook(() => useGameIntegration('test-room-id'));

      await act(async () => {
        await result.current.connect();
      });

      // Aguardar conexão ser estabelecida
      expect(result.current.isConnected).toBe(true);

      await act(async () => {
        await result.current.playCard('test-card-id');
      });

      // Aguardar um pouco para garantir que o estado seja atualizado
      await new Promise(resolve => setTimeout(resolve, 10));

      // Verificar se a ação foi enviada
      expect(result.current.lastAction).toBe('play-card');
    });

    it('should send end turn action', async () => {
      const { result } = renderHook(() => useGameIntegration('test-room-id'));

      await act(async () => {
        await result.current.connect();
      });

      // Aguardar conexão ser estabelecida
      expect(result.current.isConnected).toBe(true);

      await act(async () => {
        await result.current.endTurn();
      });

      // Aguardar um pouco para garantir que o estado seja atualizado
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(result.current.lastAction).toBe('end-turn');
    });

    it('should handle ready action', async () => {
      const { result } = renderHook(() => useGameIntegration('test-room-id'));

      await act(async () => {
        await result.current.connect();
      });

      // Aguardar conexão ser estabelecida
      expect(result.current.isConnected).toBe(true);

      await act(async () => {
        await result.current.setReady(true);
      });

      // Aguardar um pouco para garantir que o estado seja atualizado
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(result.current.isReady).toBe(true);
    });
  });

  describe('Desconexão', () => {
    it('should disconnect from server', async () => {
      const { result } = renderHook(() => useGameIntegration('test-room-id'));

      await act(async () => {
        await result.current.connect();
        await result.current.disconnect();
      });

      expect(result.current.isConnected).toBe(false);
    });
  });

  describe('Estados de Loading', () => {
    it('should show loading during connection', async () => {
      const { result } = renderHook(() => useGameIntegration('test-room-id'));

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should show loading during actions', async () => {
      const { result } = renderHook(() => useGameIntegration('test-room-id'));

      await act(async () => {
        await result.current.connect();
        result.current.setActionLoading(true);
      });

      expect(result.current.isActionLoading).toBe(true);
    });
  });

  describe('Tratamento de Erros', () => {
    it('should handle server errors gracefully', async () => {
      const { result } = renderHook(() => useGameIntegration('invalid-room-id'));

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.error).toBe('Server connection failed');
      expect(result.current.isConnected).toBe(false);
    });

    it('should clear error when reconnecting', async () => {
      const { result } = renderHook(() => useGameIntegration('test-room-id'));

      await act(async () => {
        await result.current.connect();
        result.current.setError('Previous error');
        await result.current.connect();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
