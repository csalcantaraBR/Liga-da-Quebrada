import { Card, Faction } from '@lq/shared';
import { shuffleDeck } from './deck';

/**
 * Sistema de combates por hora contra NPC para Liga da Quebrada
 * Implementa NPCs com diferentes níveis de dificuldade e estratégias
 */

export interface NPC {
  id: string;
  name: string;
  faction: Faction;
  difficulty: 'easy' | 'medium' | 'hard' | 'boss';
  level: number;
  deck: Card[];
  strategy: NPCStrategy;
  rewards: NPCRewards;
  availableHours: number[]; // Horas do dia em que está disponível (0-23)
  cooldownHours: number; // Cooldown em horas após derrota
  lastDefeated?: Date;
}

export interface NPCStrategy {
  type: 'aggressive' | 'defensive' | 'balanced' | 'combo';
  preferredEnergy: number; // Energia preferida para jogar cartas
  riskTolerance: number; // 0-1, quanto risco está disposto a tomar
  comboThreshold: number; // Número de cartas para tentar combo
}

export interface NPCRewards {
  experience: number;
  respect: number;
  cards?: Card[];
  specialRewards?: string[];
}

export interface HourlyBattleResult {
  npc: NPC;
  playerDeck: Card[];
  npcDeck: Card[];
  winner: 'player' | 'npc' | 'draw';
  rounds: number;
  rewards?: NPCRewards;
  battleLog: string[];
  timestamp: Date;
}

/**
 * NPCs disponíveis para combate por hora
 */
export const AVAILABLE_NPCS: NPC[] = [
  {
    id: 'npc_ze_pequeno',
    name: 'Zé Pequeno',
    faction: 'RODA_DE_GINGA',
    difficulty: 'easy',
    level: 1,
    deck: [], // Será gerado dinamicamente
    strategy: {
      type: 'aggressive',
      preferredEnergy: 3,
      riskTolerance: 0.7,
      comboThreshold: 2
    },
    rewards: {
      experience: 50,
      respect: 10
    },
    availableHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    cooldownHours: 1
  },
  {
    id: 'npc_maria_graffiti',
    name: 'Maria Graffiti',
    faction: 'CREW_DO_GRAFFITI',
    difficulty: 'medium',
    level: 3,
    deck: [],
    strategy: {
      type: 'combo',
      preferredEnergy: 4,
      riskTolerance: 0.5,
      comboThreshold: 3
    },
    rewards: {
      experience: 100,
      respect: 20,
      cards: [] // Cartas especiais podem ser adicionadas
    },
    availableHours: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    cooldownHours: 2
  },
  {
    id: 'npc_capitao_moto',
    name: 'Capitão Moto',
    faction: 'MOTOFRETE_UNIAO',
    difficulty: 'hard',
    level: 5,
    deck: [],
    strategy: {
      type: 'defensive',
      preferredEnergy: 5,
      riskTolerance: 0.3,
      comboThreshold: 4
    },
    rewards: {
      experience: 200,
      respect: 40,
      specialRewards: ['emblema_moto']
    },
    availableHours: [18, 19, 20, 21, 22, 23, 0, 1, 2],
    cooldownHours: 4
  },
  {
    id: 'npc_rainha_verde',
    name: 'Rainha Verde',
    faction: 'GUARDIOES_DO_VERDE',
    difficulty: 'boss',
    level: 10,
    deck: [],
    strategy: {
      type: 'balanced',
      preferredEnergy: 6,
      riskTolerance: 0.8,
      comboThreshold: 5
    },
    rewards: {
      experience: 500,
      respect: 100,
      specialRewards: ['coroa_verde', 'titulo_guardiao']
    },
    availableHours: [20, 21, 22, 23, 0, 1, 2, 3, 4],
    cooldownHours: 24
  }
];

/**
 * Gera deck para um NPC baseado em sua dificuldade e facção
 * @param npc - NPC para gerar deck
 * @returns Deck gerado
 */
export function generateNPCDeck(npc: NPC): Card[] {
  // Mock de cartas - em produção viria do banco de dados
  const mockCards: Card[] = [
    {
      id: 'card_1',
      name: 'Ataque Básico',
      faction: npc.faction,
      power: 3,
      damage: 2,
      text: 'Ataque básico da facção',
      keywords: ['ataque']
    },
    {
      id: 'card_2',
      name: 'Defesa Básica',
      faction: npc.faction,
      power: 2,
      damage: 1,
      text: 'Defesa básica da facção',
      keywords: ['defesa']
    },
    {
      id: 'card_3',
      name: 'Combo Especial',
      faction: npc.faction,
      power: 5,
      damage: 4,
      text: 'Combo especial da facção',
      keywords: ['combo']
    }
  ];

  // Ajusta cartas baseado na dificuldade
  const deckSize = npc.difficulty === 'easy' ? 6 : 
                   npc.difficulty === 'medium' ? 7 : 
                   npc.difficulty === 'hard' ? 8 : 10;

  // Duplica cartas para atingir o tamanho do deck
  const deck: Card[] = [];
  while (deck.length < deckSize) {
    deck.push(...mockCards);
  }

  // Embaralha e retorna o tamanho correto
  return shuffleDeck(deck).slice(0, deckSize);
}

/**
 * Verifica se um NPC está disponível para combate
 * @param npc - NPC para verificar
 * @param currentHour - Hora atual (0-23)
 * @returns true se disponível
 */
export function isNPCAvailable(npc: NPC, currentHour: number): boolean {
  // Verifica se está na hora disponível
  if (!npc.availableHours.includes(currentHour)) {
    return false;
  }

  // Verifica cooldown
  if (npc.lastDefeated) {
    const hoursSinceDefeat = (Date.now() - npc.lastDefeated.getTime()) / (1000 * 60 * 60);
    if (hoursSinceDefeat < npc.cooldownHours) {
      return false;
    }
  }

  return true;
}

/**
 * Obtém NPCs disponíveis para combate na hora atual
 * @param currentHour - Hora atual (0-23)
 * @returns Lista de NPCs disponíveis
 */
export function getAvailableNPCs(currentHour: number): NPC[] {
  return AVAILABLE_NPCS.filter(npc => isNPCAvailable(npc, currentHour));
}

/**
 * Simula uma batalha contra NPC
 * @param npc - NPC para enfrentar
 * @param playerDeck - Deck do jogador
 * @returns Resultado da batalha
 */
export function simulateHourlyBattle(npc: NPC, playerDeck: Card[]): HourlyBattleResult {
  // Gera deck do NPC se não existir
  const npcDeck = npc.deck.length > 0 ? npc.deck : generateNPCDeck(npc);
  
  // Simula batalha (implementação simplificada)
  const battleLog: string[] = [];
  battleLog.push(`Iniciando batalha contra ${npc.name}`);
  
  // Lógica de batalha simplificada
  const playerPower = playerDeck.reduce((sum, card) => sum + card.power, 0);
  const npcPower = npcDeck.reduce((sum, card) => sum + card.power, 0);
  
  let winner: 'player' | 'npc' | 'draw';
  let rounds = 4;
  
  if (playerPower > npcPower) {
    winner = 'player';
    battleLog.push('Jogador venceu por poder superior!');
  } else if (npcPower > playerPower) {
    winner = 'npc';
    battleLog.push(`${npc.name} venceu por poder superior!`);
  } else {
    winner = 'draw';
    battleLog.push('Empate! Ambos têm poder igual.');
  }
  
  // Aplica estratégia do NPC
  battleLog.push(`NPC usou estratégia: ${npc.strategy.type}`);
  
  const result: HourlyBattleResult = {
    npc,
    playerDeck,
    npcDeck,
    winner,
    rounds,
    rewards: winner === 'player' ? npc.rewards : undefined,
    battleLog,
    timestamp: new Date()
  };
  
  return result;
}

/**
 * Processa resultado da batalha e atualiza estado do NPC
 * @param result - Resultado da batalha
 * @returns NPC atualizado
 */
export function processBattleResult(result: HourlyBattleResult): NPC {
  const updatedNPC = { ...result.npc };
  
  if (result.winner === 'player') {
    // Jogador venceu, NPC entra em cooldown
    updatedNPC.lastDefeated = new Date();
  }
  
  return updatedNPC;
}

/**
 * Calcula recompensas baseadas na dificuldade e performance
 * @param npc - NPC derrotado
 * @param rounds - Número de rodadas da batalha
 * @param playerHealth - Vida restante do jogador
 * @returns Recompensas calculadas
 */
export function calculateBattleRewards(
  npc: NPC, 
  rounds: number, 
  playerHealth: number
): NPCRewards {
  const baseRewards = npc.rewards;
  const healthBonus = Math.floor(playerHealth / 10); // Bônus por vida restante
  const speedBonus = rounds < 3 ? 20 : rounds < 4 ? 10 : 0; // Bônus por velocidade
  
  return {
    experience: baseRewards.experience + healthBonus + speedBonus,
    respect: baseRewards.respect + Math.floor(healthBonus / 2),
    cards: baseRewards.cards,
    specialRewards: baseRewards.specialRewards
  };
}
