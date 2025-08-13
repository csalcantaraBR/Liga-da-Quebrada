import { RoundInput, RoundContext, ResolveRoundResult } from '../types';
import { RoundResult } from '@lq/shared';
import {
  calculateAttack,
  determineWinner,
  applyFactionEffects,
  calculateFinalDamage,
  calculateNewPlayerState
} from './utils';

/**
 * Resolve uma rodada do jogo seguindo a ordem de operações:
 * 1. Calcular ataques
 * 2. Determinar vencedor
 * 3. Aplicar efeitos de facção
 * 4. Calcular dano final
 * 5. Atualizar estados dos jogadores
 */
export function resolveRound(input: RoundInput, context: RoundContext): ResolveRoundResult {
  // 1. Calcular ataques
  const player1Attack = calculateAttack(input.player1Card, input.player1Energy);
  const player2Attack = calculateAttack(input.player2Card, input.player2Energy);

  // 2. Determinar vencedor
  const winner = determineWinner(player1Attack, player2Attack);

  // 3. Calcular dano base
  let damage = 0;
  if (winner === 'player1') {
    damage = input.player1Card.damage;
  } else if (winner === 'player2') {
    damage = input.player2Card.damage;
  }

  // 4. Aplicar efeitos de facção
  const factionEffects = applyFactionEffects(
    winner,
    input.player1Card,
    input.player2Card,
    context.round
  );

  // 5. Calcular dano final
  const finalDamage = winner === 'tie' ? 0 : calculateFinalDamage(damage, factionEffects.damageModifier);

  // 6. Calcular novos estados dos jogadores
  const newPlayer1State = calculateNewPlayerState(
    context.player1State,
    input.player1Energy,
    winner === 'player1' ? factionEffects.energyBonus : 0,
    winner === 'player2',
    finalDamage
  );

  const newPlayer2State = calculateNewPlayerState(
    context.player2State,
    input.player2Energy,
    winner === 'player2' ? factionEffects.energyBonus : 0,
    winner === 'player1',
    finalDamage
  );

  // 7. Criar resultado da rodada
  const roundResult: RoundResult = {
    player1Attack,
    player2Attack,
    winner,
    damage: finalDamage,
    effects: []
  };

  return {
    result: roundResult,
    newPlayer1State,
    newPlayer2State
  };
}

