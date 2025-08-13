import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMatchmaking } from '../../hooks/useMatchmaking';
import { mockMatchmakingServer } from '../../game/matchmaking';
import { MatchmakingStatus } from '../../game/types';

// Mock do servidor
vi.mock('../../game/matchmaking', () => ({
  mockMatchmakingServer: {
    startSearch: vi.fn(),
    cancelSearch: vi.fn(),
    onEvent: vi.fn(),
    cleanup: vi.fn()
  }
}));

describe('useMatchmaking Hook', () => {
  const mockServer = vi.mocked(mockMatchmakingServer);

  beforeEach(() => {
    vi.clearAllMocks();
    mockServer.onEvent.mockImplementation(() => {});
  });

  afterEach(() => {
    mockServer.cleanup();
  });

  describe('Estado Inicial', () => {
    it('should start with idle status', () => {
      const { result } = renderHook(() => useMatchmaking());
      
      expect(result.current.status).toBe('idle');
      expect(result.current.searchDuration).toBeUndefined();
      expect(result.current.matchId).toBeUndefined();
      expect(result.current.opponent).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });

    it('should provide startSearch function', () => {
      const { result } = renderHook(() => useMatchmaking());
      
      expect(typeof result.current.startSearch).toBe('function');
    });

    it('should provide cancelSearch function', () => {
      const { result } = renderHook(() => useMatchmaking());
      
      expect(typeof result.current.cancelSearch).toBe('function');
    });
  });

  describe('Iniciar Busca', () => {
    it('should change status to searching when starting search', async () => {
      mockServer.startSearch.mockResolvedValue({
        type: 'search_started',
        timestamp: new Date(),
        data: { playerId: 'test-player' }
      });

      const { result } = renderHook(() => useMatchmaking());
      
      await act(async () => {
        await result.current.startSearch('test-player');
      });

      expect(result.current.status).toBe('searching');
      expect(result.current.searchStartTime).toBeDefined();
      expect(mockServer.startSearch).toHaveBeenCalledWith('test-player');
    });

    it('should handle search start error', async () => {
      mockServer.startSearch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useMatchmaking());
      
      await act(async () => {
        await result.current.startSearch('test-player');
      });

      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('Erro ao iniciar busca: Network error');
    });

    it('should not start search if already searching', async () => {
      mockServer.startSearch.mockResolvedValue({
        type: 'search_started',
        timestamp: new Date(),
        data: { playerId: 'test-player' }
      });

      const { result } = renderHook(() => useMatchmaking());
      
      // Primeira busca
      await act(async () => {
        await result.current.startSearch('test-player');
      });

      expect(result.current.status).toBe('searching');

      // Segunda busca (deve ser ignorada)
      await act(async () => {
        await result.current.startSearch('test-player');
      });

      expect(mockServer.startSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cancelar Busca', () => {
    it('should change status to idle when cancelling search', async () => {
      mockServer.startSearch.mockResolvedValue({
        type: 'search_started',
        timestamp: new Date(),
        data: { playerId: 'test-player' }
      });

      mockServer.cancelSearch.mockResolvedValue({
        type: 'search_started',
        timestamp: new Date(),
        data: { playerId: 'test-player', cancelled: true }
      });

      const { result } = renderHook(() => useMatchmaking());
      
      // Inicia busca
      await act(async () => {
        await result.current.startSearch('test-player');
      });

      expect(result.current.status).toBe('searching');

      // Cancela busca
      await act(async () => {
        await result.current.cancelSearch();
      });

      expect(result.current.status).toBe('idle');
      expect(result.current.searchStartTime).toBeUndefined();
      expect(mockServer.cancelSearch).toHaveBeenCalledWith('test-player');
    });

    it('should handle cancel error', async () => {
      // Primeiro inicia uma busca
      mockServer.startSearch.mockResolvedValue({
        type: 'search_started',
        timestamp: new Date(),
        data: { playerId: 'test-player' }
      });

      mockServer.cancelSearch.mockRejectedValue(new Error('Cancel error'));

      const { result } = renderHook(() => useMatchmaking());
      
      // Inicia busca primeiro
      await act(async () => {
        await result.current.startSearch('test-player');
      });

      expect(result.current.status).toBe('searching');

      // Agora tenta cancelar
      await act(async () => {
        await result.current.cancelSearch();
      });

      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('Erro ao cancelar busca: Cancel error');
    });

    it('should not cancel if not searching', async () => {
      const { result } = renderHook(() => useMatchmaking());
      
      await act(async () => {
        await result.current.cancelSearch();
      });

      expect(mockServer.cancelSearch).not.toHaveBeenCalled();
    });
  });

  describe('Eventos de Matchmaking', () => {
    it('should handle opponent found event', async () => {
      const { result } = renderHook(() => useMatchmaking());
      
      // Simula evento de oponente encontrado
      const mockEvent = {
        type: 'opponent_found' as const,
        timestamp: new Date(),
        data: {
          playerId: 'test-player',
          opponent: {
            id: 'opponent-123',
            name: 'TestOpponent',
            rank: 5
          },
          matchId: 'match-123'
        }
      };

      // Simula callback do servidor
      const eventCallback = mockServer.onEvent.mock.calls[0][0];
      
      act(() => {
        eventCallback(mockEvent);
      });

      expect(result.current.status).toBe('matched');
      expect(result.current.matchId).toBe('match-123');
      expect(result.current.opponent).toEqual({
        id: 'opponent-123',
        name: 'TestOpponent',
        rank: 5
      });
    });

    it('should handle connection established event', async () => {
      const { result } = renderHook(() => useMatchmaking());
      
      // Simula evento de conexão estabelecida
      const mockEvent = {
        type: 'connection_established' as const,
        timestamp: new Date(),
        data: { matchId: 'match-123' }
      };

      const eventCallback = mockServer.onEvent.mock.calls[0][0];
      
      act(() => {
        eventCallback(mockEvent);
      });

      expect(result.current.status).toBe('connecting');
    });

    it('should handle game ready event', async () => {
      const { result } = renderHook(() => useMatchmaking());
      
      // Simula evento de jogo pronto
      const mockEvent = {
        type: 'game_ready' as const,
        timestamp: new Date(),
        data: { 
          matchId: 'match-123',
          opponent: {
            id: 'opponent-123',
            name: 'TestOpponent',
            rank: 5
          }
        }
      };

      const eventCallback = mockServer.onEvent.mock.calls[0][0];
      
      act(() => {
        eventCallback(mockEvent);
      });

      expect(result.current.status).toBe('ready');
    });

    it('should handle timeout event', async () => {
      const { result } = renderHook(() => useMatchmaking());
      
      // Simula evento de timeout
      const mockEvent = {
        type: 'search_started' as const,
        timestamp: new Date(),
        data: { playerId: 'test-player', timeout: true }
      };

      const eventCallback = mockServer.onEvent.mock.calls[0][0];
      
      act(() => {
        eventCallback(mockEvent);
      });

      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('Tempo limite de busca excedido');
    });
  });

  describe('Cálculo de Duração', () => {
    it('should calculate search duration correctly', async () => {
      const { result } = renderHook(() => useMatchmaking());
      
      mockServer.startSearch.mockResolvedValue({
        type: 'search_started',
        timestamp: new Date(),
        data: { playerId: 'test-player' }
      });
      
      // Inicia busca
      await act(async () => {
        await result.current.startSearch('test-player');
      });

      // Aguarda um pouco para o cálculo de duração
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      expect(result.current.searchDuration).toBeGreaterThanOrEqual(0);
    });

    it('should update search duration in real time', async () => {
      const { result } = renderHook(() => useMatchmaking());
      
      mockServer.startSearch.mockResolvedValue({
        type: 'search_started',
        timestamp: new Date(),
        data: { playerId: 'test-player' }
      });
      
      // Inicia busca
      await act(async () => {
        await result.current.startSearch('test-player');
      });

      // Aguarda para o intervalo atualizar
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1100));
      });
      
      expect(result.current.searchDuration).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Limpeza de Recursos', () => {
    it('should cleanup server resources on unmount', () => {
      const { unmount } = renderHook(() => useMatchmaking());
      
      unmount();
      
      expect(mockServer.cleanup).toHaveBeenCalled();
    });
  });

  describe('Estados de Erro', () => {
    it('should handle network errors gracefully', async () => {
      mockServer.startSearch.mockRejectedValue(new Error('Connection failed'));

      const { result } = renderHook(() => useMatchmaking());
      
      await act(async () => {
        await result.current.startSearch('test-player');
      });

      expect(result.current.status).toBe('error');
      expect(result.current.error).toContain('Connection failed');
    });

    it('should allow retry after error', async () => {
      mockServer.startSearch
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce({
          type: 'search_started',
          timestamp: new Date(),
          data: { playerId: 'test-player' }
        });

      const { result } = renderHook(() => useMatchmaking());
      
      // Primeira tentativa (falha)
      await act(async () => {
        await result.current.startSearch('test-player');
      });

      expect(result.current.status).toBe('error');

      // Segunda tentativa (sucesso)
      await act(async () => {
        await result.current.startSearch('test-player');
      });

      expect(result.current.status).toBe('searching');
      expect(result.current.error).toBeUndefined();
    });
  });
});
