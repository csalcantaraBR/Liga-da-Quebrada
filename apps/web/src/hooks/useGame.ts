import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Player, Card } from '../game/types';
import {
  initializeGame,
  playCard,
  endTurn,
  canPlayCard,
  getCurrentPlayer,
  getOpponentPlayer,
  canGameContinue
} from '../game/mechanics';
import { generateBalancedDeck } from '../game/cards';

export interface UseGameReturn {
  gameState: GameState | null;
  currentPlayer: Player | null;
  opponentPlayer: Player | null;
  isLoading: boolean;
  error: string | null;
  playCard: (card: Card) => Promise<void>;
  endTurn: () => Promise<void>;
  canPlayCard: (card: Card) => boolean;
  isMyTurn: boolean;
  gamePhase: 'setup' | 'playing' | 'finished';
  winner: 'player1' | 'player2' | 'draw' | null;
}

export function useGame(
  matchId?: string,
  playerId: string = 'player1'
): UseGameReturn {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const playerIdRef = useRef(playerId);

  // Inicializa o jogo
  const initializeGameState = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Gera decks para ambos os jogadores
      const player1Deck = generateBalancedDeck('roda-de-ginga');
      const player2Deck = generateBalancedDeck('motofrete-uniao');

      // Inicializa o jogo
      const newGameState = initializeGame(
        player1Deck,
        player2Deck,
        'Player 1',
        'Player 2'
      );

      setGameState(newGameState);
    } catch (err) {
      setError(`Erro ao inicializar jogo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Inicializa o jogo quando o hook é montado
  useEffect(() => {
    if (matchId && !gameState) {
      initializeGameState();
    }
  }, [matchId, gameState, initializeGameState]);

  // Jogar carta
  const handlePlayCard = useCallback(async (card: Card) => {
    if (!gameState || !canGameContinue(gameState)) {
      throw new Error('Jogo não está em estado válido para jogar');
    }

    try {
      const currentPlayer = getCurrentPlayer(gameState);
      const opponentPlayer = getOpponentPlayer(gameState);

      // Verifica se é o turno do jogador
      if (gameState.currentTurn !== playerIdRef.current) {
        throw new Error('Não é seu turno');
      }

      // Verifica se pode jogar a carta
      if (!canPlayCard(card, currentPlayer)) {
        throw new Error('Não é possível jogar esta carta');
      }

      // Joga a carta
      const result = playCard(card, currentPlayer, opponentPlayer);

      // Atualiza o estado do jogo
      const updatedGameState: GameState = {
        ...gameState,
        players: [result.player, result.opponent] as [Player, Player],
        lastActionTime: new Date()
      };

      // Verifica se o jogo terminou
      if (!canGameContinue(updatedGameState)) {
        updatedGameState.gamePhase = 'finished';
        // Determina o vencedor baseado na vida
        const [p1, p2] = updatedGameState.players;
        if (p1.life <= 0 && p2.life <= 0) {
          updatedGameState.winner = 'draw';
        } else if (p1.life <= 0) {
          updatedGameState.winner = 'player2';
        } else if (p2.life <= 0) {
          updatedGameState.winner = 'player1';
        }
      }

      setGameState(updatedGameState);
    } catch (err) {
      setError(`Erro ao jogar carta: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      throw err;
    }
  }, [gameState]);

  // Passar turno
  const handleEndTurn = useCallback(async () => {
    if (!gameState || !canGameContinue(gameState)) {
      throw new Error('Jogo não está em estado válido para passar turno');
    }

    try {
      // Verifica se é o turno do jogador
      if (gameState.currentTurn !== playerIdRef.current) {
        throw new Error('Não é seu turno');
      }

      // Passa o turno
      const updatedGameState = endTurn(gameState);
      setGameState(updatedGameState);
    } catch (err) {
      setError(`Erro ao passar turno: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      throw err;
    }
  }, [gameState]);

  // Verifica se pode jogar uma carta
  const canPlayCardCheck = useCallback((card: Card) => {
    if (!gameState || !canGameContinue(gameState)) {
      return false;
    }

    const currentPlayer = getCurrentPlayer(gameState);
    return canPlayCard(card, currentPlayer);
  }, [gameState]);

  // Calcula valores derivados
  const currentPlayer = gameState ? getCurrentPlayer(gameState) : null;
  const opponentPlayer = gameState ? getOpponentPlayer(gameState) : null;
  const isMyTurn = gameState ? gameState.currentTurn === playerIdRef.current : false;
  const gamePhase = gameState?.gamePhase || 'setup';
  const winner = gameState?.winner || null;

  return {
    gameState,
    currentPlayer,
    opponentPlayer,
    isLoading,
    error,
    playCard: handlePlayCard,
    endTurn: handleEndTurn,
    canPlayCard: canPlayCardCheck,
    isMyTurn,
    gamePhase,
    winner
  };
}
