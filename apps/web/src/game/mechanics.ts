import { GameState, Player, Card, Effect } from './types';

// Constantes do jogo
export const GAME_CONSTANTS = {
  MAX_ROUNDS: 4,
  STARTING_LIFE: 20,
  ENERGY_PER_TURN: 5,
  MAX_HAND_SIZE: 7,
  MAX_FIELD_SIZE: 4
} as const;

// Tipos de efeitos
export type EffectType = 'damage' | 'heal' | 'buff' | 'debuff' | 'draw' | 'energy';

export interface GameEffect {
  type: EffectType;
  target: 'self' | 'opponent' | 'both';
  value: number;
  duration?: number; // Para efeitos temporários
}

// Aplicador de efeitos
export function applyEffect(
  effect: GameEffect,
  targetPlayer: Player,
  sourcePlayer: Player
): { targetPlayer: Player; sourcePlayer: Player } {
  const updatedTarget = { ...targetPlayer };
  const updatedSource = { ...sourcePlayer };

  switch (effect.type) {
    case 'damage':
      if (effect.target === 'opponent' || effect.target === 'both') {
        updatedTarget.life = Math.max(0, updatedTarget.life - effect.value);
      }
      if (effect.target === 'self' || effect.target === 'both') {
        updatedSource.life = Math.max(0, updatedSource.life - effect.value);
      }
      break;

    case 'heal':
      if (effect.target === 'self' || effect.target === 'both') {
        updatedSource.life = Math.min(GAME_CONSTANTS.STARTING_LIFE, updatedSource.life + effect.value);
      }
      if (effect.target === 'opponent' || effect.target === 'both') {
        updatedTarget.life = Math.min(GAME_CONSTANTS.STARTING_LIFE, updatedTarget.life + effect.value);
      }
      break;

    case 'energy':
      if (effect.target === 'self' || effect.target === 'both') {
        updatedSource.energy = Math.max(0, updatedSource.energy + effect.value);
      }
      if (effect.target === 'opponent' || effect.target === 'both') {
        updatedTarget.energy = Math.max(0, updatedTarget.energy + effect.value);
      }
      break;

    case 'draw':
      if (effect.target === 'self' || effect.target === 'both') {
        // Simula compra de cartas
        const cardsToDraw = Math.min(effect.value, updatedSource.deck.length);
        const drawnCards = updatedSource.deck.slice(0, cardsToDraw);
        updatedSource.hand = [...updatedSource.hand, ...drawnCards];
        updatedSource.deck = updatedSource.deck.slice(cardsToDraw);
      }
      break;
  }

  return { targetPlayer: updatedTarget, sourcePlayer: updatedSource };
}

// Validador de jogada
export function canPlayCard(card: Card, player: Player): boolean {
  return player.energy >= card.energy && player.hand.length < GAME_CONSTANTS.MAX_HAND_SIZE;
}

// Jogar carta
export function playCard(
  card: Card,
  player: Player,
  opponent: Player
): { player: Player; opponent: Player; effects: GameEffect[] } {
  if (!canPlayCard(card, player)) {
    throw new Error('Não é possível jogar esta carta');
  }

  const updatedPlayer = { ...player };
  const updatedOpponent = { ...opponent };

  // Remove carta da mão
  updatedPlayer.hand = updatedPlayer.hand.filter(c => c.id !== card.id);
  
  // Consome energia
  updatedPlayer.energy -= card.energy;

  // Adiciona ao campo se houver espaço
  if (updatedPlayer.field.length < GAME_CONSTANTS.MAX_FIELD_SIZE) {
    updatedPlayer.field.push(card);
  }

  // Processa efeitos da carta
  const effects: GameEffect[] = [];
  
  card.effects.forEach(effect => {
    const gameEffect = parseEffect(effect);
    if (gameEffect) {
      effects.push(gameEffect);
      const result = applyEffect(gameEffect, updatedOpponent, updatedPlayer);
      Object.assign(updatedOpponent, result.targetPlayer);
      Object.assign(updatedPlayer, result.sourcePlayer);
    }
  });

  return { player: updatedPlayer, opponent: updatedOpponent, effects };
}

// Passar turno
export function endTurn(gameState: GameState): GameState {
  const updatedState = { ...gameState };
  
  // Alterna o turno
  updatedState.currentTurn = updatedState.currentTurn === 'player1' ? 'player2' : 'player1';
  
  // Verifica se é fim de rodada
  if (updatedState.currentTurn === 'player1') {
    updatedState.currentRound++;
  }

  // Reseta energia para o próximo jogador
  const currentPlayer = updatedState.currentTurn === 'player1' ? 0 : 1;
  updatedState.players[currentPlayer].energy = GAME_CONSTANTS.ENERGY_PER_TURN;

  // Verifica condições de vitória
  const winner = checkWinCondition(updatedState);
  if (winner) {
    updatedState.gamePhase = 'finished';
    updatedState.winner = winner;
  }

  updatedState.lastActionTime = new Date();
  return updatedState;
}

// Verificar condição de vitória
export function checkWinCondition(gameState: GameState): 'player1' | 'player2' | 'draw' | null {
  const [player1, player2] = gameState.players;
  
  // Vitória por vida
  if (player1.life <= 0 && player2.life <= 0) {
    return 'draw';
  }
  if (player1.life <= 0) {
    return 'player2';
  }
  if (player2.life <= 0) {
    return 'player1';
  }

  // Vitória por rodadas
  if (gameState.currentRound > GAME_CONSTANTS.MAX_ROUNDS) {
    if (player1.life > player2.life) {
      return 'player1';
    } else if (player2.life > player1.life) {
      return 'player2';
    } else {
      return 'draw';
    }
  }

  return null;
}

// Inicializar jogo
export function initializeGame(
  player1Deck: Card[],
  player2Deck: Card[],
  player1Name: string = 'Player 1',
  player2Name: string = 'Player 2'
): GameState {
  // Embaralha os decks
  const shuffledDeck1 = shuffleDeck([...player1Deck]);
  const shuffledDeck2 = shuffleDeck([...player2Deck]);

  // Compra cartas iniciais
  const initialHand1 = shuffledDeck1.slice(0, 4);
  const initialHand2 = shuffledDeck2.slice(0, 4);

  const player1: Player = {
    id: 'player1',
    name: player1Name,
    deck: shuffledDeck1.slice(4),
    life: GAME_CONSTANTS.STARTING_LIFE,
    energy: GAME_CONSTANTS.ENERGY_PER_TURN,
    hand: initialHand1,
    field: []
  };

  const player2: Player = {
    id: 'player2',
    name: player2Name,
    deck: shuffledDeck2.slice(4),
    life: GAME_CONSTANTS.STARTING_LIFE,
    energy: 0, // Player 2 começa sem energia
    hand: initialHand2,
    field: []
  };

  return {
    id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    players: [player1, player2],
    currentRound: 1,
    maxRounds: GAME_CONSTANTS.MAX_ROUNDS,
    currentTurn: 'player1',
    gamePhase: 'playing',
    startTime: new Date(),
    lastActionTime: new Date()
  };
}

// Embaralhar deck
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Comprar carta
export function drawCard(player: Player, count: number = 1): Player {
  const updatedPlayer = { ...player };
  const cardsToDraw = Math.min(count, updatedPlayer.deck.length);
  
  if (cardsToDraw > 0) {
    const drawnCards = updatedPlayer.deck.slice(0, cardsToDraw);
    updatedPlayer.hand = [...updatedPlayer.hand, ...drawnCards];
    updatedPlayer.deck = updatedPlayer.deck.slice(cardsToDraw);
  }
  
  return updatedPlayer;
}

// Parsear efeito da carta
export function parseEffect(effect: Effect): GameEffect | null {
  switch (effect.name) {
    case 'damage':
      return {
        type: 'damage',
        target: effect.params?.target || 'opponent',
        value: effect.params?.value || 0
      };
    
    case 'heal':
      return {
        type: 'heal',
        target: effect.params?.target || 'self',
        value: effect.params?.value || 0
      };
    
    case 'energy':
      return {
        type: 'energy',
        target: effect.params?.target || 'self',
        value: effect.params?.value || 0
      };
    
    case 'draw':
      return {
        type: 'draw',
        target: effect.params?.target || 'self',
        value: effect.params?.value || 1
      };
    
    default:
      return null;
  }
}

// Calcular poder total do campo
export function calculateFieldPower(player: Player): number {
  return player.field.reduce((total, card) => total + card.power, 0);
}

// Verificar se o jogo pode continuar
export function canGameContinue(gameState: GameState): boolean {
  return gameState.gamePhase === 'playing' && !checkWinCondition(gameState);
}

// Obter jogador atual
export function getCurrentPlayer(gameState: GameState): Player {
  return gameState.currentTurn === 'player1' ? gameState.players[0] : gameState.players[1];
}

// Obter oponente atual
export function getOpponentPlayer(gameState: GameState): Player {
  return gameState.currentTurn === 'player1' ? gameState.players[1] : gameState.players[0];
}
