import { useState, useEffect, useCallback, useRef } from 'react';
import { mockMatchmakingServer } from '../game/matchmaking';
import { MatchmakingState, MatchmakingEvent } from '../game/types';

export interface UseMatchmakingReturn extends MatchmakingState {
  startSearch: (playerId: string) => Promise<void>;
  cancelSearch: () => Promise<void>;
  searchDuration?: number;
}

export function useMatchmaking(): UseMatchmakingReturn {
  const [state, setState] = useState<MatchmakingState>({
    status: 'idle'
  });

  const playerIdRef = useRef<string>('');
  const durationIntervalRef = useRef<NodeJS.Timeout>();

  // Calcula duração da busca
  const calculateDuration = useCallback(() => {
    if (!state.searchStartTime) return undefined;
    return Math.floor((Date.now() - state.searchStartTime.getTime()) / 1000);
  }, [state.searchStartTime]);

  // Atualiza duração a cada segundo
  useEffect(() => {
    if (state.status === 'searching' && state.searchStartTime) {
      durationIntervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          searchDuration: calculateDuration()
        }));
      }, 1000);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = undefined;
      }
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [state.status, state.searchStartTime, calculateDuration]);

  // Configura listener de eventos do servidor
  useEffect(() => {
    const handleServerEvent = (event: MatchmakingEvent) => {
      switch (event.type) {
        case 'opponent_found':
          setState(prev => ({
            ...prev,
            status: 'matched',
            matchId: event.data?.matchId,
            opponent: event.data?.opponent
          }));
          break;

        case 'connection_established':
          setState(prev => ({
            ...prev,
            status: 'connecting'
          }));
          break;

        case 'game_ready':
          setState(prev => ({
            ...prev,
            status: 'ready'
          }));
          break;

        case 'search_started':
          if (event.data?.timeout) {
            setState(prev => ({
              ...prev,
              status: 'error',
              error: 'Tempo limite de busca excedido'
            }));
          }
          break;
      }
    };

    mockMatchmakingServer.onEvent(handleServerEvent);

    return () => {
      mockMatchmakingServer.cleanup();
    };
  }, []);

  // Inicia busca de oponente
  const startSearch = useCallback(async (playerId: string) => {
    if (state.status === 'searching') {
      return; // Já está buscando
    }

    try {
      playerIdRef.current = playerId;
      
      setState(prev => ({
        ...prev,
        status: 'searching',
        searchStartTime: new Date(),
        error: undefined
      }));

      await mockMatchmakingServer.startSearch(playerId);
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: `Erro ao iniciar busca: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      }));
    }
  }, [state.status]);

  // Cancela busca
  const cancelSearch = useCallback(async () => {
    if (state.status !== 'searching') {
      return; // Não está buscando
    }

    try {
      await mockMatchmakingServer.cancelSearch(playerIdRef.current);
      
      setState(prev => ({
        ...prev,
        status: 'idle',
        searchStartTime: undefined,
        searchDuration: undefined,
        matchId: undefined,
        opponent: undefined,
        error: undefined
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: `Erro ao cancelar busca: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      }));
    }
  }, [state.status]);

  return {
    ...state,
    searchDuration: calculateDuration(),
    startSearch,
    cancelSearch
  };
}
