import { describe, it, expect } from 'vitest';
import { resolveRound } from '../game/resolveRound';
import { Card } from '@lq/shared';
import { RoundInput, RoundContext } from '../types';

describe('resolveRound - Empate e Dano', () => {
  it('should not cause damage on tie', () => {
    // Given: duas cartas com mesmo poder e energia
    const player1Card: Card = {
      id: 'tie-card-1',
      name: 'Tie Card 1',
      faction: 'RODA_DE_GINGA',
      power: 5,
      damage: 3,
      text: 'Tie card',
      keywords: ['Test']
    };

    const player2Card: Card = {
      id: 'tie-card-2',
      name: 'Tie Card 2',
      faction: 'MOTOFRETE_UNIAO',
      power: 5,
      damage: 2,
      text: 'Tie card',
      keywords: ['Test']
    };

    const input: RoundInput = {
      player1Card,
      player1Energy: 2,
      player2Card,
      player2Energy: 2
    };

    const context: RoundContext = {
      round: 1,
      player1State: {
        respect: 12,
        energy: 8,
        hand: [],
        effects: []
      },
      player2State: {
        respect: 12,
        energy: 8,
        hand: [],
        effects: []
      },
      roundHistory: []
    };

    // When: resolver rodada
    const result = resolveRound(input, context);

    // Then: empate não causa dano
    expect(result.result.winner).toBe('tie');
    expect(result.result.damage).toBe(0);
    expect(result.result.player1Attack).toBe(52); // (5 × 10) + 2
    expect(result.result.player2Attack).toBe(52); // (5 × 10) + 2
  });

  it('should not trigger onWin effects on tie', () => {
    // Given: carta com efeito onWin
    const player1Card: Card = {
      id: 'onwin-card',
      name: 'OnWin Card',
      faction: 'MOTOFRETE_UNIAO',
      power: 5,
      damage: 3,
      text: 'OnWin card',
      keywords: ['Test'],
      onWin: [
        {
          name: 'gain_energy',
          params: { amount: 1 }
        }
      ]
    };

    const player2Card: Card = {
      id: 'tie-card-2',
      name: 'Tie Card 2',
      faction: 'RODA_DE_GINGA',
      power: 5,
      damage: 2,
      text: 'Tie card',
      keywords: ['Test']
    };

    const input: RoundInput = {
      player1Card,
      player1Energy: 2,
      player2Card,
      player2Energy: 2
    };

    const context: RoundContext = {
      round: 1,
      player1State: {
        respect: 12,
        energy: 8,
        hand: [],
        effects: []
      },
      player2State: {
        respect: 12,
        energy: 8,
        hand: [],
        effects: []
      },
      roundHistory: []
    };

    // When: resolver rodada
    const result = resolveRound(input, context);

    // Then: empate não deve aplicar efeitos onWin
    expect(result.result.winner).toBe('tie');
    expect(result.result.damage).toBe(0);
    // Player1 não deve ganhar energia (efeito onWin não deve disparar)
    expect(result.newPlayer1State.energy).toBe(7); // 8 - 2 + 1 (regen normal) = 7
  });

  it('should cause damage when there is a winner', () => {
    // Given: player1 com ataque maior
    const player1Card: Card = {
      id: 'winner-card',
      name: 'Winner Card',
      faction: 'MOTOFRETE_UNIAO', // Mudando para não aplicar Roda de Ginga
      power: 6,
      damage: 4,
      text: 'Winner card',
      keywords: ['Test']
    };

    const player2Card: Card = {
      id: 'loser-card',
      name: 'Loser Card',
      faction: 'RODA_DE_GINGA', // Mudando para não aplicar Motofrete
      power: 5,
      damage: 2,
      text: 'Loser card',
      keywords: ['Test']
    };

    const input: RoundInput = {
      player1Card,
      player1Energy: 3,
      player2Card,
      player2Energy: 2
    };

    const context: RoundContext = {
      round: 1,
      player1State: {
        respect: 12,
        energy: 8,
        hand: [],
        effects: []
      },
      player2State: {
        respect: 12,
        energy: 8,
        hand: [],
        effects: []
      },
      roundHistory: []
    };

    // When: resolver rodada
    const result = resolveRound(input, context);

    // Then: player1 vence e causa dano
    expect(result.result.winner).toBe('player1');
    expect(result.result.damage).toBe(4); // dano da carta vencedora (sem redução)
    expect(result.result.player1Attack).toBe(63); // (6 × 10) + 3
    expect(result.result.player2Attack).toBe(52); // (5 × 10) + 2
  });
});
