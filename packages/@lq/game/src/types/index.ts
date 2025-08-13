import { Card, PlayerState, RoundResult, GameState } from '@lq/shared';

export interface RoundInput {
  player1Card: Card;
  player1Energy: number;
  player2Card: Card;
  player2Energy: number;
}

export interface RoundContext {
  round: number;
  player1State: PlayerState;
  player2State: PlayerState;
  roundHistory: RoundResult[];
}

export interface ResolveRoundResult {
  result: RoundResult;
  newPlayer1State: PlayerState;
  newPlayer2State: PlayerState;
}

export interface FactionPassive {
  name: string;
  apply: (context: RoundContext, playerIndex: 1 | 2) => void;
}

export interface CardEffect {
  name: string;
  apply: (context: RoundContext, playerIndex: 1 | 2, card: Card) => void;
}
