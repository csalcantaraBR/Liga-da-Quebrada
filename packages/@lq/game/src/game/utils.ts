import { Card, PlayerState } from '@lq/shared';
import { GAME_CONSTANTS } from './constants';

// Tipos auxiliares
export type Winner = 'player1' | 'player2' | 'tie';
export type FactionEffect = {
  energyBonus: number;
  damageModifier: number;
};

/**
 * Calcula o ataque de uma carta: Atk = (Poder × 10) + EnergiaGasta
 */
export function calculateAttack(card: Card, energySpent: number): number {
  return (card.power * GAME_CONSTANTS.ATTACK_MULTIPLIER) + energySpent;
}

/**
 * Determina o vencedor da rodada baseado nos ataques
 */
export function determineWinner(player1Attack: number, player2Attack: number): Winner {
  if (player1Attack > player2Attack) return 'player1';
  if (player2Attack > player1Attack) return 'player2';
  return 'tie';
}

/**
 * Aplica efeitos de facção baseado no vencedor e rodada
 */
export function applyFactionEffects(
  winner: Winner,
  player1Card: Card,
  player2Card: Card,
  round: number
): FactionEffect {
  const effect: FactionEffect = {
    energyBonus: 0,
    damageModifier: 0
  };

  // Motofrete União: +1 Energia ao vencer
  if (winner === 'player1' && player1Card.faction === GAME_CONSTANTS.FACTIONS.MOTOFRETE_UNIAO) {
    effect.energyBonus = GAME_CONSTANTS.FACTION_EFFECTS.MOTOFRETE_UNIAO_ENERGY_BONUS;
  }
  if (winner === 'player2' && player2Card.faction === GAME_CONSTANTS.FACTIONS.MOTOFRETE_UNIAO) {
    effect.energyBonus = GAME_CONSTANTS.FACTION_EFFECTS.MOTOFRETE_UNIAO_ENERGY_BONUS;
  }

  // Roda de Ginga: -1 Dano na primeira rodada (apenas para o vencedor)
  if (round === 1) {
    if (winner === 'player1' && player1Card.faction === GAME_CONSTANTS.FACTIONS.RODA_DE_GINGA) {
      effect.damageModifier = GAME_CONSTANTS.FACTION_EFFECTS.RODA_DE_GINGA_DAMAGE_REDUCTION;
    }
    if (winner === 'player2' && player2Card.faction === GAME_CONSTANTS.FACTIONS.RODA_DE_GINGA) {
      effect.damageModifier = GAME_CONSTANTS.FACTION_EFFECTS.RODA_DE_GINGA_DAMAGE_REDUCTION;
    }
  }

  return effect;
}

/**
 * Calcula o dano final aplicando modificadores de facção
 */
export function calculateFinalDamage(baseDamage: number, damageModifier: number): number {
  return Math.max(GAME_CONSTANTS.MIN_DAMAGE, baseDamage + damageModifier);
}

/**
 * Calcula a nova energia de um jogador
 */
export function calculateNewEnergy(
  currentEnergy: number,
  energySpent: number,
  energyBonus: number
): number {
  const newEnergy = currentEnergy - energySpent + GAME_CONSTANTS.ENERGY_REGEN_PER_ROUND + energyBonus;
  return Math.min(GAME_CONSTANTS.ENERGY_CAP, newEnergy);
}

/**
 * Calcula o novo estado de um jogador
 */
export function calculateNewPlayerState(
  currentState: PlayerState,
  energySpent: number,
  energyBonus: number,
  takesDamage: boolean,
  damage: number
): PlayerState {
  return {
    ...currentState,
    energy: calculateNewEnergy(currentState.energy, energySpent, energyBonus),
    respect: takesDamage ? currentState.respect - damage : currentState.respect
  };
}
