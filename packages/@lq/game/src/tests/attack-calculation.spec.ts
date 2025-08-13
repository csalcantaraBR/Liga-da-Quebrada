import { describe, it, expect } from 'vitest';
import { resolveRound } from '../game/resolveRound';
import { Card, PlayerState, RoundResult } from '@lq/shared';
import { RoundInput, RoundContext } from '../types';

describe('resolveRound - Cálculo de Ataque', () => {
  it('should calculate attack correctly: Atk = (Poder × 10) + EnergiaGasta', () => {
    // Given: carta com Poder 7, Energia 3 (sem efeitos de facção)
    const player1Card: Card = {
      id: 'test-card-1',
      name: 'Test Card 1',
      faction: 'MOTOFRETE_UNIAO', // Mudando para não aplicar Roda de Ginga
      power: 7,
      damage: 3,
      text: 'Test card',
      keywords: ['Test']
    };

    const player2Card: Card = {
      id: 'test-card-2',
      name: 'Test Card 2',
      faction: 'RODA_DE_GINGA', // Mudando para não aplicar Motofrete
      power: 5,
      damage: 2,
      text: 'Test card',
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

    // Then: Atk = (7 × 10) + 3 = 73 para player1, (5 × 10) + 2 = 52 para player2
    expect(result.result.player1Attack).toBe(73);
    expect(result.result.player2Attack).toBe(52);
    expect(result.result.winner).toBe('player1');
    expect(result.result.damage).toBe(3); // dano da carta vencedora (sem redução)
  });

  it('should handle minimum attack values', () => {
    // Given: carta com Poder 1, Energia 0
    const player1Card: Card = {
      id: 'min-card',
      name: 'Min Card',
      faction: 'MOTOFRETE_UNIAO', // Mudando para não aplicar Roda de Ginga
      power: 1,
      damage: 1,
      text: 'Min card',
      keywords: ['Test']
    };

    const player2Card: Card = {
      id: 'test-card-2',
      name: 'Test Card 2',
      faction: 'RODA_DE_GINGA', // Mudando para não aplicar Motofrete
      power: 1,
      damage: 1,
      text: 'Test card',
      keywords: ['Test']
    };

    const input: RoundInput = {
      player1Card,
      player1Energy: 0,
      player2Card,
      player2Energy: 0
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

    // Then: Atk = (1 × 10) + 0 = 10 para ambos
    expect(result.result.player1Attack).toBe(10);
    expect(result.result.player2Attack).toBe(10);
    expect(result.result.winner).toBe('tie');
    expect(result.result.damage).toBe(0); // empate não causa dano
  });

  it('should handle maximum attack values', () => {
    // Given: carta com Poder 10, Energia 12 (máximo)
    const player1Card: Card = {
      id: 'max-card',
      name: 'Max Card',
      faction: 'MOTOFRETE_UNIAO', // Mudando para não aplicar Roda de Ginga
      power: 10,
      damage: 10,
      text: 'Max card',
      keywords: ['Test']
    };

    const player2Card: Card = {
      id: 'test-card-2',
      name: 'Test Card 2',
      faction: 'RODA_DE_GINGA', // Mudando para não aplicar Motofrete
      power: 1,
      damage: 1,
      text: 'Test card',
      keywords: ['Test']
    };

    const input: RoundInput = {
      player1Card,
      player1Energy: 12,
      player2Card,
      player2Energy: 1
    };

    const context: RoundContext = {
      round: 1,
      player1State: {
        respect: 12,
        energy: 12,
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

    // Then: Atk = (10 × 10) + 12 = 112 para player1
    expect(result.result.player1Attack).toBe(112);
    expect(result.result.winner).toBe('player1');
    expect(result.result.damage).toBe(10); // dano normal (sem redução)
  });
});
