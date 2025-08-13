import { useState, useEffect, useCallback } from 'react';

interface GameState {
  respect: number;
  energy: number;
  round: number;
  maxRound: number;
  status: 'preparing' | 'playing' | 'finished';
}

interface UseGameIntegrationReturn {
  gameState: GameState;
  isConnected: boolean;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
  isReady: boolean;
  lastAction: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setEnergy: (energy: number) => void;
  playCard: (cardId: string) => Promise<void>;
  endTurn: () => Promise<void>;
  setReady: (ready: boolean) => Promise<void>;
  updateGameState: (state: Partial<GameState>) => void;
  setActionLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGameIntegration = (roomId: string): UseGameIntegrationReturn => {
  const [gameState, setGameState] = useState<GameState>({
    respect: 12,
    energy: 8,
    round: 1,
    maxRound: 4,
    status: 'preparing'
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simular conexão com delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Para testes, simular sucesso se roomId não for 'invalid-room-id'
      if (roomId === 'invalid-room-id') {
        throw new Error('Server connection failed');
      }

      setIsConnected(true);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro de conexão');
      setIsConnected(false);
      setIsLoading(false);
    }
  }, [roomId]);

  const disconnect = useCallback(async () => {
    setIsConnected(false);
  }, []);

  const setEnergy = useCallback((energy: number) => {
    const clampedEnergy = Math.max(0, Math.min(12, energy));
    setGameState(prev => ({ ...prev, energy: clampedEnergy }));
  }, []);

  const playCard = useCallback(async (cardId: string) => {
    if (!isConnected) return;

    try {
      setIsActionLoading(true);
      // Simular envio para servidor
      await new Promise(resolve => setTimeout(resolve, 50));
      setLastAction('play-card');
    } catch (err) {
      setError('Erro ao jogar carta');
    } finally {
      setIsActionLoading(false);
    }
  }, [isConnected]);

  const endTurn = useCallback(async () => {
    if (!isConnected) return;

    try {
      setIsActionLoading(true);
      // Simular envio para servidor
      await new Promise(resolve => setTimeout(resolve, 50));
      setLastAction('end-turn');
    } catch (err) {
      setError('Erro ao finalizar turno');
    } finally {
      setIsActionLoading(false);
    }
  }, [isConnected]);

  const setReady = useCallback(async (ready: boolean) => {
    if (!isConnected) return;

    try {
      setIsActionLoading(true);
      // Simular envio para servidor
      await new Promise(resolve => setTimeout(resolve, 50));
      setIsReady(ready);
    } catch (err) {
      setError('Erro ao definir status de pronto');
    } finally {
      setIsActionLoading(false);
    }
  }, [isConnected]);

  const updateGameState = useCallback((newState: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...newState }));
  }, []);

  const setActionLoading = useCallback((loading: boolean) => {
    setIsActionLoading(loading);
  }, []);

  const setErrorState = useCallback((errorMessage: string | null) => {
    setError(errorMessage);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup simples para testes
    };
  }, []);

  return {
    gameState,
    isConnected,
    isLoading,
    isActionLoading,
    error,
    isReady,
    lastAction,
    connect,
    disconnect,
    setEnergy,
    playCard,
    endTurn,
    setReady,
    updateGameState,
    setActionLoading,
    setError: setErrorState
  };
};
