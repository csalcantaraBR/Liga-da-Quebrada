/**
 * Constantes do jogo Liga da Quebrada
 */
export const GAME_CONSTANTS = {
  // Energia
  ENERGY_CAP: 12,
  ENERGY_REGEN_PER_ROUND: 1,
  
  // Ataque
  ATTACK_MULTIPLIER: 10,
  
  // Dano
  MIN_DAMAGE: 1,
  
  // Facções
  FACTIONS: {
    RODA_DE_GINGA: 'RODA_DE_GINGA',
    MOTOFRETE_UNIAO: 'MOTOFRETE_UNIAO'
  } as const,
  
  // Efeitos de facção
  FACTION_EFFECTS: {
    MOTOFRETE_UNIAO_ENERGY_BONUS: 1,
    RODA_DE_GINGA_DAMAGE_REDUCTION: -1
  }
} as const;
