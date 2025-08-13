import { describe, it, expect, beforeEach } from 'vitest';
import {
  initializeGame,
  playCard,
  endTurn,
  checkWinCondition,
  canPlayCard,
  applyEffect,
  shuffleDeck,
  drawCard,
  parseEffect,
  calculateFieldPower,
  canGameContinue,
  getCurrentPlayer,
  getOpponentPlayer,
  GAME_CONSTANTS
} from '../../game/mechanics';
import { generateBalancedDeck } from '../../game/cards';
import { GameState, Player, Card } from '../../game/types';

describe('Game Mechanics', () => {
  let gameState: GameState;
  let player1Deck: Card[];
  let player2Deck: Card[];

  beforeEach(() => {
    player1Deck = generateBalancedDeck('roda-de-ginga');
    player2Deck = generateBalancedDeck('motofrete-uniao');
    gameState = initializeGame(player1Deck, player2Deck, 'Player 1', 'Player 2');
  });

  describe('Game Initialization', () => {
    it('should initialize game with correct structure', () => {
      expect(gameState.id).toBeDefined();
      expect(gameState.players).toHaveLength(2);
      expect(gameState.currentRound).toBe(1);
      expect(gameState.maxRounds).toBe(GAME_CONSTANTS.MAX_ROUNDS);
      expect(gameState.currentTurn).toBe('player1');
      expect(gameState.gamePhase).toBe('playing');
    });

    it('should set up players correctly', () => {
      const [player1, player2] = gameState.players;
      
      expect(player1.name).toBe('Player 1');
      expect(player1.life).toBe(GAME_CONSTANTS.STARTING_LIFE);
      expect(player1.energy).toBe(GAME_CONSTANTS.ENERGY_PER_TURN);
      expect(player1.hand).toHaveLength(4);
      expect(player1.field).toHaveLength(0);
      
      expect(player2.name).toBe('Player 2');
      expect(player2.life).toBe(GAME_CONSTANTS.STARTING_LIFE);
      expect(player2.energy).toBe(0); // Player 2 starts without energy
      expect(player2.hand).toHaveLength(4);
      expect(player2.field).toHaveLength(0);
    });

    it('should shuffle decks properly', () => {
      const originalDeck = [...player1Deck];
      const shuffledDeck = shuffleDeck([...player1Deck]);
      
      expect(shuffledDeck).toHaveLength(originalDeck.length);
      
      // All cards should still be present
      const originalIds = originalDeck.map(card => card.id).sort();
      const shuffledIds = shuffledDeck.map(card => card.id).sort();
      expect(shuffledIds).toEqual(originalIds);
      
      // For small decks, order might be the same, but that's acceptable
      // The important thing is that all cards are present
    });
  });

  describe('Card Playing', () => {
    it('should validate if card can be played', () => {
      const player = gameState.players[0];
      const card = player.hand[0];
      
      expect(canPlayCard(card, player)).toBe(true);
    });

    it('should not allow playing card with insufficient energy', () => {
      const player = { ...gameState.players[0], energy: 0 };
      const card = player.hand[0];
      
      expect(canPlayCard(card, player)).toBe(false);
    });

    it('should play card successfully', () => {
      const player = gameState.players[0];
      const opponent = gameState.players[1];
      const card = player.hand[0];
      const initialEnergy = player.energy;
      const initialHandSize = player.hand.length;
      
      const result = playCard(card, player, opponent);
      
      expect(result.player.energy).toBe(initialEnergy - card.energy);
      expect(result.player.field).toContain(card);
      expect(result.player.hand).not.toContain(card);
      expect(result.player.hand.length).toBeLessThan(initialHandSize);
    });

    it('should throw error when playing invalid card', () => {
      const player = { ...gameState.players[0], energy: 0 };
      const opponent = gameState.players[1];
      const card = player.hand[0];
      
      expect(() => playCard(card, player, opponent)).toThrow('Não é possível jogar esta carta');
    });
  });

  describe('Turn Management', () => {
    it('should end turn correctly', () => {
      const initialTurn = gameState.currentTurn;
      const initialRound = gameState.currentRound;
      
      const updatedState = endTurn(gameState);
      
      expect(updatedState.currentTurn).not.toBe(initialTurn);
      expect(updatedState.lastActionTime).toBeDefined();
    });

    it('should advance round when player1 turn starts', () => {
      // End player1's turn (player2's turn starts)
      let updatedState = endTurn(gameState);
      expect(updatedState.currentRound).toBe(1);
      
      // End player2's turn (player1's turn starts, new round)
      updatedState = endTurn(updatedState);
      expect(updatedState.currentRound).toBe(2);
    });

    it('should reset energy for next player', () => {
      const updatedState = endTurn(gameState);
      const nextPlayer = getCurrentPlayer(updatedState);
      
      expect(nextPlayer.energy).toBe(GAME_CONSTANTS.ENERGY_PER_TURN);
    });
  });

  describe('Win Conditions', () => {
    it('should detect player1 win by life', () => {
      const modifiedState = {
        ...gameState,
        players: [
          { ...gameState.players[0], life: 5 },
          { ...gameState.players[1], life: 0 }
        ] as [Player, Player]
      };
      
      expect(checkWinCondition(modifiedState)).toBe('player1');
    });

    it('should detect player2 win by life', () => {
      const modifiedState = {
        ...gameState,
        players: [
          { ...gameState.players[0], life: 0 },
          { ...gameState.players[1], life: 5 }
        ] as [Player, Player]
      };
      
      expect(checkWinCondition(modifiedState)).toBe('player2');
    });

    it('should detect draw when both players have 0 life', () => {
      const modifiedState = {
        ...gameState,
        players: [
          { ...gameState.players[0], life: 0 },
          { ...gameState.players[1], life: 0 }
        ] as [Player, Player]
      };
      
      expect(checkWinCondition(modifiedState)).toBe('draw');
    });

    it('should detect win by rounds with higher life', () => {
      const modifiedState = {
        ...gameState,
        currentRound: GAME_CONSTANTS.MAX_ROUNDS + 1,
        players: [
          { ...gameState.players[0], life: 10 },
          { ...gameState.players[1], life: 5 }
        ] as [Player, Player]
      };
      
      expect(checkWinCondition(modifiedState)).toBe('player1');
    });

    it('should return null when no win condition is met', () => {
      expect(checkWinCondition(gameState)).toBe(null);
    });
  });

  describe('Effect System', () => {
    it('should apply damage effect correctly', () => {
      const player1 = { ...gameState.players[0], life: 10 };
      const player2 = { ...gameState.players[1], life: 10 };
      
      const effect = { type: 'damage' as const, target: 'opponent' as const, value: 3 };
      const result = applyEffect(effect, player2, player1);
      
      expect(result.targetPlayer.life).toBe(7);
      expect(result.sourcePlayer.life).toBe(10);
    });

    it('should apply heal effect correctly', () => {
      const player1 = { ...gameState.players[0], life: 15 };
      const player2 = { ...gameState.players[1], life: 10 };
      
      const effect = { type: 'heal' as const, target: 'self' as const, value: 3 };
      const result = applyEffect(effect, player2, player1);
      
      expect(result.sourcePlayer.life).toBe(18);
      expect(result.targetPlayer.life).toBe(10);
    });

    it('should apply energy effect correctly', () => {
      const player1 = { ...gameState.players[0], energy: 2 };
      const player2 = { ...gameState.players[1], energy: 1 };
      
      const effect = { type: 'energy' as const, target: 'self' as const, value: 2 };
      const result = applyEffect(effect, player2, player1);
      
      expect(result.sourcePlayer.energy).toBe(4);
      expect(result.targetPlayer.energy).toBe(1);
    });

    it('should not allow life below 0', () => {
      const player1 = { ...gameState.players[0], life: 2 };
      const player2 = { ...gameState.players[1], life: 10 };
      
      const effect = { type: 'damage' as const, target: 'opponent' as const, value: 5 };
      const result = applyEffect(effect, player1, player2);
      
      expect(result.targetPlayer.life).toBe(0);
    });

    it('should not allow life above starting life', () => {
      const player1 = { ...gameState.players[0], life: 18 };
      const player2 = { ...gameState.players[1], life: 10 };
      
      const effect = { type: 'heal' as const, target: 'self' as const, value: 5 };
      const result = applyEffect(effect, player2, player1);
      
      expect(result.sourcePlayer.life).toBe(GAME_CONSTANTS.STARTING_LIFE);
    });
  });

  describe('Card Drawing', () => {
    it('should draw cards correctly', () => {
      const player = { ...gameState.players[0] };
      const initialHandSize = player.hand.length;
      const initialDeckSize = player.deck.length;
      
      const updatedPlayer = drawCard(player, 2);
      
      expect(updatedPlayer.hand).toHaveLength(initialHandSize + 2);
      expect(updatedPlayer.deck).toHaveLength(initialDeckSize - 2);
    });

    it('should not draw more cards than available', () => {
      const player = { ...gameState.players[0], deck: [] };
      const initialHandSize = player.hand.length;
      
      const updatedPlayer = drawCard(player, 5);
      
      expect(updatedPlayer.hand).toHaveLength(initialHandSize);
    });
  });

  describe('Effect Parsing', () => {
    it('should parse damage effect correctly', () => {
      const effect = { name: 'damage', params: { target: 'opponent', value: 3 } };
      const parsed = parseEffect(effect);
      
      expect(parsed).toEqual({
        type: 'damage',
        target: 'opponent',
        value: 3
      });
    });

    it('should parse heal effect correctly', () => {
      const effect = { name: 'heal', params: { target: 'self', value: 2 } };
      const parsed = parseEffect(effect);
      
      expect(parsed).toEqual({
        type: 'heal',
        target: 'self',
        value: 2
      });
    });

    it('should return null for unknown effect', () => {
      const effect = { name: 'unknown', params: {} };
      const parsed = parseEffect(effect);
      
      expect(parsed).toBe(null);
    });
  });

  describe('Field Power Calculation', () => {
    it('should calculate field power correctly', () => {
      const player = {
        ...gameState.players[0],
        field: [
          { id: '1', name: 'Card 1', faction: 'roda-de-ginga' as const, power: 3, energy: 2, effects: [], keywords: [] },
          { id: '2', name: 'Card 2', faction: 'roda-de-ginga' as const, power: 5, energy: 3, effects: [], keywords: [] }
        ]
      };
      
      expect(calculateFieldPower(player)).toBe(8);
    });

    it('should return 0 for empty field', () => {
      const player = { ...gameState.players[0], field: [] };
      expect(calculateFieldPower(player)).toBe(0);
    });
  });

  describe('Game State Utilities', () => {
    it('should get current player correctly', () => {
      const currentPlayer = getCurrentPlayer(gameState);
      expect(currentPlayer.id).toBe('player1');
    });

    it('should get opponent player correctly', () => {
      const opponent = getOpponentPlayer(gameState);
      expect(opponent.id).toBe('player2');
    });

    it('should check if game can continue', () => {
      expect(canGameContinue(gameState)).toBe(true);
      
      const finishedState = {
        ...gameState,
        gamePhase: 'finished' as const,
        winner: 'player1' as const
      };
      expect(canGameContinue(finishedState)).toBe(false);
    });
  });

  describe('Game Flow Integration', () => {
    it('should handle complete turn cycle', () => {
      // Player 1 plays a card
      const player1 = gameState.players[0];
      const player2 = gameState.players[1];
      const card = player1.hand[0];
      
      const playResult = playCard(card, player1, player2);
      
      // Update game state
      const updatedState = {
        ...gameState,
        players: [playResult.player, playResult.opponent] as [Player, Player]
      };
      
      // End turn
      const finalState = endTurn(updatedState);
      
      expect(finalState.currentTurn).toBe('player2');
      expect(finalState.players[1].energy).toBe(GAME_CONSTANTS.ENERGY_PER_TURN);
      expect(finalState.gamePhase).toBe('playing');
    });

    it('should end game when win condition is met', () => {
      const modifiedState = {
        ...gameState,
        players: [
          { ...gameState.players[0], life: 5 },
          { ...gameState.players[1], life: 0 }
        ] as [Player, Player]
      };
      
      const finalState = endTurn(modifiedState);
      
      expect(finalState.gamePhase).toBe('finished');
      expect(finalState.winner).toBe('player1');
    });
  });
});
