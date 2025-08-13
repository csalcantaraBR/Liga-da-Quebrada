import { describe, it, expect } from 'vitest';
import { resolveRound } from '../game/resolveRound';
import { Card } from '@lq/shared';
import { RoundInput, RoundContext } from '../types';

describe('resolveRound - Efeitos de Facção', () => {
  it('should apply Motofrete União effect: +1 Energy on win', () => {
    // Given: carta Motofrete União que vence
    const player1Card: Card = {
      id: 'motofrete-card',
      name: 'Motofrete Card',
      faction: 'MOTOFRETE_UNIAO',
      power: 6,
      damage: 3,
      text: 'Motofrete card',
      keywords: ['Test']
    };

    const player2Card: Card = {
      id: 'other-card',
      name: 'Other Card',
      faction: 'RODA_DE_GINGA',
      power: 5,
      damage: 2,
      text: 'Other card',
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

    // Then: player1 vence e ganha +1 energia (Motofrete União)
    expect(result.result.winner).toBe('player1');
    expect(result.newPlayer1State.energy).toBe(7); // 8 - 3 + 1 + 1 (regen + efeito) = 7
  });

  it('should respect energy cap of 12 for Motofrete União', () => {
    // Given: carta Motofrete União com energia máxima
    const player1Card: Card = {
      id: 'motofrete-card',
      name: 'Motofrete Card',
      faction: 'MOTOFRETE_UNIAO',
      power: 6,
      damage: 3,
      text: 'Motofrete card',
      keywords: ['Test']
    };

    const player2Card: Card = {
      id: 'other-card',
      name: 'Other Card',
      faction: 'RODA_DE_GINGA',
      power: 5,
      damage: 2,
      text: 'Other card',
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
        energy: 12, // Máximo
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

    // Then: player1 vence mas energia fica no cap de 12
    expect(result.result.winner).toBe('player1');
    expect(result.newPlayer1State.energy).toBe(11); // 12 - 3 + 1 + 1 = 11 (cap de 12)
  });

  it('should apply Roda de Ginga effect: -1 Damage on first round', () => {
    // Given: carta Roda de Ginga na primeira rodada
    const player1Card: Card = {
      id: 'roda-card',
      name: 'Roda Card',
      faction: 'RODA_DE_GINGA',
      power: 6,
      damage: 3,
      text: 'Roda card',
      keywords: ['Test']
    };

    const player2Card: Card = {
      id: 'other-card',
      name: 'Other Card',
      faction: 'MOTOFRETE_UNIAO',
      power: 5,
      damage: 2,
      text: 'Other card',
      keywords: ['Test']
    };

    const input: RoundInput = {
      player1Card,
      player1Energy: 3,
      player2Card,
      player2Energy: 2
    };

    const context: RoundContext = {
      round: 1, // Primeira rodada
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

    // Then: player1 vence mas dano é reduzido em 1 (mínimo 1)
    expect(result.result.winner).toBe('player1');
    expect(result.result.damage).toBe(2); // 3 - 1 = 2
  });

  it('should not apply Roda de Ginga effect after first round', () => {
    // Given: carta Roda de Ginga na segunda rodada
    const player1Card: Card = {
      id: 'roda-card',
      name: 'Roda Card',
      faction: 'RODA_DE_GINGA',
      power: 6,
      damage: 3,
      text: 'Roda card',
      keywords: ['Test']
    };

    const player2Card: Card = {
      id: 'other-card',
      name: 'Other Card',
      faction: 'MOTOFRETE_UNIAO',
      power: 5,
      damage: 2,
      text: 'Other card',
      keywords: ['Test']
    };

    const input: RoundInput = {
      player1Card,
      player1Energy: 3,
      player2Card,
      player2Energy: 2
    };

    const context: RoundContext = {
      round: 2, // Segunda rodada
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

    // Then: player1 vence com dano normal (sem redução)
    expect(result.result.winner).toBe('player1');
    expect(result.result.damage).toBe(3); // Dano normal, sem redução
  });

  it('should ensure minimum damage of 1 for Roda de Ginga', () => {
    // Given: carta Roda de Ginga com dano 1 na primeira rodada
    const player1Card: Card = {
      id: 'roda-card',
      name: 'Roda Card',
      faction: 'RODA_DE_GINGA',
      power: 6,
      damage: 1, // Dano mínimo
      text: 'Roda card',
      keywords: ['Test']
    };

    const player2Card: Card = {
      id: 'other-card',
      name: 'Other Card',
      faction: 'MOTOFRETE_UNIAO',
      power: 5,
      damage: 2,
      text: 'Other card',
      keywords: ['Test']
    };

    const input: RoundInput = {
      player1Card,
      player1Energy: 3,
      player2Card,
      player2Energy: 2
    };

    const context: RoundContext = {
      round: 1, // Primeira rodada
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

    // Then: player1 vence com dano mínimo de 1
    expect(result.result.winner).toBe('player1');
    expect(result.result.damage).toBe(1); // Mínimo, não pode ser 0
  });
});
