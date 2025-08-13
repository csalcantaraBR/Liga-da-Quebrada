import { describe, it, expect } from 'vitest';
import { resolveRound } from '../game/resolveRound';
import { Card } from '@lq/shared';
import { RoundInput, RoundContext } from '../types';

describe('resolveRound - Regeneração de Energia', () => {
  it('should regenerate +1 energy for both players after round', () => {
    // Given: qualquer rodada
    const player1Card: Card = {
      id: 'test-card-1',
      name: 'Test Card 1',
      faction: 'RODA_DE_GINGA',
      power: 5,
      damage: 2,
      text: 'Test card',
      keywords: ['Test']
    };

    const player2Card: Card = {
      id: 'test-card-2',
      name: 'Test Card 2',
      faction: 'MOTOFRETE_UNIAO',
      power: 5,
      damage: 2,
      text: 'Test card',
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
        energy: 6,
        hand: [],
        effects: []
      },
      roundHistory: []
    };

    // When: resolver rodada
    const result = resolveRound(input, context);

    // Then: ambos ganham +1 energia (regen normal)
    expect(result.newPlayer1State.energy).toBe(7); // 8 - 2 + 1 = 7
    expect(result.newPlayer2State.energy).toBe(5); // 6 - 2 + 1 = 5
  });

  it('should respect energy cap of 12 for regeneration', () => {
    // Given: player1 com energia máxima
    const player1Card: Card = {
      id: 'test-card-1',
      name: 'Test Card 1',
      faction: 'RODA_DE_GINGA',
      power: 5,
      damage: 2,
      text: 'Test card',
      keywords: ['Test']
    };

    const player2Card: Card = {
      id: 'test-card-2',
      name: 'Test Card 2',
      faction: 'MOTOFRETE_UNIAO',
      power: 5,
      damage: 2,
      text: 'Test card',
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

    // Then: player1 fica no cap, player2 regenera normalmente
    expect(result.newPlayer1State.energy).toBe(11); // 12 - 2 + 1 = 11 (cap de 12)
    expect(result.newPlayer2State.energy).toBe(7); // 8 - 2 + 1 = 7
  });

  it('should consume energy spent during the round', () => {
    // Given: player1 gasta 5 energia, player2 gasta 3
    const player1Card: Card = {
      id: 'test-card-1',
      name: 'Test Card 1',
      faction: 'RODA_DE_GINGA',
      power: 5,
      damage: 2,
      text: 'Test card',
      keywords: ['Test']
    };

    const player2Card: Card = {
      id: 'test-card-2',
      name: 'Test Card 2',
      faction: 'MOTOFRETE_UNIAO',
      power: 5,
      damage: 2,
      text: 'Test card',
      keywords: ['Test']
    };

    const input: RoundInput = {
      player1Card,
      player1Energy: 5, // Gasta 5
      player2Card,
      player2Energy: 3 // Gasta 3
    };

    const context: RoundContext = {
      round: 1,
      player1State: {
        respect: 12,
        energy: 10, // Começa com 10
        hand: [],
        effects: []
      },
      player2State: {
        respect: 12,
        energy: 8, // Começa com 8
        hand: [],
        effects: []
      },
      roundHistory: []
    };

    // When: resolver rodada
    const result = resolveRound(input, context);

    // Then: energia final = inicial - gasta + regen
    expect(result.newPlayer1State.energy).toBe(6); // 10 - 5 + 1 = 6
    expect(result.newPlayer2State.energy).toBe(6); // 8 - 3 + 1 = 6
  });

  it('should handle energy regeneration with faction effects', () => {
    // Given: Motofrete União vence (ganha +1 energia extra)
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

    // Then: player1 ganha +2 energia (regen + efeito facção), player2 +1
    expect(result.newPlayer1State.energy).toBe(7); // 8 - 3 + 1 + 1 (regen + efeito) = 7
    expect(result.newPlayer2State.energy).toBe(7); // 8 - 2 + 1 (regen) = 7
  });
});
