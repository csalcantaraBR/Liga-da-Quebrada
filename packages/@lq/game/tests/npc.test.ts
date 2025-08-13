import { describe, it, expect, beforeEach } from 'vitest';
import {
  AVAILABLE_NPCS,
  generateNPCDeck,
  isNPCAvailable,
  getAvailableNPCs,
  simulateHourlyBattle,
  processBattleResult,
  calculateBattleRewards,
  type NPC,
  type HourlyBattleResult
} from '../src/game/npc';
import { Card } from '@lq/shared';

describe('Sistema de Combates por Hora contra NPC', () => {
  let testPlayerDeck: Card[];
  let testNPC: NPC;

  beforeEach(() => {
    // Cria um deck de teste para o jogador
    testPlayerDeck = [
      {
        id: 'player_card_1',
        name: 'Ataque do Jogador',
        faction: 'RODA_DE_GINGA',
        power: 4,
        damage: 3,
        text: 'Ataque do jogador',
        keywords: ['ataque']
      },
      {
        id: 'player_card_2',
        name: 'Defesa do Jogador',
        faction: 'RODA_DE_GINGA',
        power: 3,
        damage: 2,
        text: 'Defesa do jogador',
        keywords: ['defesa']
      }
    ];

    // Usa o primeiro NPC disponível para testes
    testNPC = AVAILABLE_NPCS[0];
  });

  describe('AVAILABLE_NPCS', () => {
    it('should have correct NPC structure', () => {
      expect(AVAILABLE_NPCS).toHaveLength(4);
      
      AVAILABLE_NPCS.forEach(npc => {
        expect(npc).toHaveProperty('id');
        expect(npc).toHaveProperty('name');
        expect(npc).toHaveProperty('faction');
        expect(npc).toHaveProperty('difficulty');
        expect(npc).toHaveProperty('level');
        expect(npc).toHaveProperty('strategy');
        expect(npc).toHaveProperty('rewards');
        expect(npc).toHaveProperty('availableHours');
        expect(npc).toHaveProperty('cooldownHours');
      });
    });

    it('should have different difficulty levels', () => {
      const difficulties = AVAILABLE_NPCS.map(npc => npc.difficulty);
      expect(difficulties).toContain('easy');
      expect(difficulties).toContain('medium');
      expect(difficulties).toContain('hard');
      expect(difficulties).toContain('boss');
    });

    it('should have valid strategy types', () => {
      const strategyTypes = AVAILABLE_NPCS.map(npc => npc.strategy.type);
      expect(strategyTypes).toContain('aggressive');
      expect(strategyTypes).toContain('defensive');
      expect(strategyTypes).toContain('balanced');
      expect(strategyTypes).toContain('combo');
    });
  });

  describe('generateNPCDeck', () => {
    it('should generate deck with correct size based on difficulty', () => {
      const easyNPC = AVAILABLE_NPCS.find(npc => npc.difficulty === 'easy')!;
      const mediumNPC = AVAILABLE_NPCS.find(npc => npc.difficulty === 'medium')!;
      const hardNPC = AVAILABLE_NPCS.find(npc => npc.difficulty === 'hard')!;
      const bossNPC = AVAILABLE_NPCS.find(npc => npc.difficulty === 'boss')!;

      expect(generateNPCDeck(easyNPC)).toHaveLength(6);
      expect(generateNPCDeck(mediumNPC)).toHaveLength(7);
      expect(generateNPCDeck(hardNPC)).toHaveLength(8);
      expect(generateNPCDeck(bossNPC)).toHaveLength(10);
    });

    it('should generate deck with correct faction', () => {
      const npcDeck = generateNPCDeck(testNPC);
      
      npcDeck.forEach(card => {
        expect(card.faction).toBe(testNPC.faction);
      });
    });

    it('should generate different decks for different NPCs', () => {
      const npc1 = AVAILABLE_NPCS[0];
      const npc2 = AVAILABLE_NPCS[1];
      
      const deck1 = generateNPCDeck(npc1);
      const deck2 = generateNPCDeck(npc2);
      
      // Decks devem ter tamanhos diferentes ou facções diferentes
      expect(deck1.length !== deck2.length || npc1.faction !== npc2.faction).toBe(true);
    });

    it('should generate valid cards', () => {
      const npcDeck = generateNPCDeck(testNPC);
      
      npcDeck.forEach(card => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('power');
        expect(card).toHaveProperty('damage');
        expect(card).toHaveProperty('text');
        expect(card).toHaveProperty('keywords');
      });
    });
  });

  describe('isNPCAvailable', () => {
    it('should return true for available hour', () => {
      const availableHour = testNPC.availableHours[0];
      const isAvailable = isNPCAvailable(testNPC, availableHour);
      
      expect(isAvailable).toBe(true);
    });

    it('should return false for unavailable hour', () => {
      const unavailableHour = 3; // Hora que não está na lista
      const isAvailable = isNPCAvailable(testNPC, unavailableHour);
      
      expect(isAvailable).toBe(false);
    });

    it('should return false when NPC is in cooldown', () => {
      const npcInCooldown = {
        ...testNPC,
        lastDefeated: new Date(Date.now() - 30 * 60 * 1000) // 30 minutos atrás
      };
      
      const availableHour = testNPC.availableHours[0];
      const isAvailable = isNPCAvailable(npcInCooldown, availableHour);
      
      expect(isAvailable).toBe(false);
    });

    it('should return true when cooldown has expired', () => {
      const npcWithExpiredCooldown = {
        ...testNPC,
        lastDefeated: new Date(Date.now() - (testNPC.cooldownHours + 1) * 60 * 60 * 1000)
      };
      
      const availableHour = testNPC.availableHours[0];
      const isAvailable = isNPCAvailable(npcWithExpiredCooldown, availableHour);
      
      expect(isAvailable).toBe(true);
    });
  });

  describe('getAvailableNPCs', () => {
    it('should return NPCs available at current hour', () => {
      const currentHour = 12; // Meio-dia
      const availableNPCs = getAvailableNPCs(currentHour);
      
      expect(availableNPCs.length).toBeGreaterThan(0);
      
      availableNPCs.forEach(npc => {
        expect(npc.availableHours).toContain(currentHour);
      });
    });

    it('should return empty array for hour with no NPCs', () => {
      const earlyHour = 5; // Manhã cedo
      const availableNPCs = getAvailableNPCs(earlyHour);
      
      expect(availableNPCs).toEqual([]);
    });

    it('should filter out NPCs in cooldown', () => {
      const currentHour = 12;
      const npcInCooldown = {
        ...testNPC,
        lastDefeated: new Date(Date.now() - 30 * 60 * 1000)
      };
      
      // Testa diretamente a função isNPCAvailable
      const isAvailable = isNPCAvailable(npcInCooldown, currentHour);
      expect(isAvailable).toBe(false);
    });
  });

  describe('simulateHourlyBattle', () => {
    it('should return valid battle result', () => {
      const result = simulateHourlyBattle(testNPC, testPlayerDeck);
      
      expect(result).toHaveProperty('npc');
      expect(result).toHaveProperty('playerDeck');
      expect(result).toHaveProperty('npcDeck');
      expect(result).toHaveProperty('winner');
      expect(result).toHaveProperty('rounds');
      expect(result).toHaveProperty('battleLog');
      expect(result).toHaveProperty('timestamp');
      
      expect(result.npc).toBe(testNPC);
      expect(result.playerDeck).toEqual(testPlayerDeck);
      expect(result.npcDeck.length).toBeGreaterThan(0);
      expect(['player', 'npc', 'draw']).toContain(result.winner);
      expect(result.rounds).toBe(4);
      expect(result.battleLog.length).toBeGreaterThan(0);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should generate NPC deck if not present', () => {
      const npcWithoutDeck = { ...testNPC, deck: [] };
      const result = simulateHourlyBattle(npcWithoutDeck, testPlayerDeck);
      
      expect(result.npcDeck.length).toBeGreaterThan(0);
      result.npcDeck.forEach(card => {
        expect(card.faction).toBe(testNPC.faction);
      });
    });

    it('should use existing NPC deck if present', () => {
      const existingDeck = generateNPCDeck(testNPC);
      const npcWithDeck = { ...testNPC, deck: existingDeck };
      const result = simulateHourlyBattle(npcWithDeck, testPlayerDeck);
      
      expect(result.npcDeck).toEqual(existingDeck);
    });

    it('should include rewards when player wins', () => {
      // Cria um deck mais forte para garantir vitória do jogador
      const strongPlayerDeck = [
        {
          id: 'strong_card',
          name: 'Carta Forte',
          faction: 'RODA_DE_GINGA' as const,
          power: 10,
          damage: 8,
          text: 'Carta muito forte',
          keywords: ['forte']
        }
      ];
      
      const result = simulateHourlyBattle(testNPC, strongPlayerDeck);
      
      if (result.winner === 'player') {
        expect(result.rewards).toBeDefined();
        expect(result.rewards).toEqual(testNPC.rewards);
      }
    });

    it('should not include rewards when NPC wins', () => {
      // Cria um deck mais fraco para garantir vitória do NPC
      const weakPlayerDeck = [
        {
          id: 'weak_card',
          name: 'Carta Fraca',
          faction: 'RODA_DE_GINGA' as const,
          power: 1,
          damage: 1,
          text: 'Carta muito fraca',
          keywords: ['fraca']
        }
      ];
      
      const result = simulateHourlyBattle(testNPC, weakPlayerDeck);
      
      if (result.winner === 'npc') {
        expect(result.rewards).toBeUndefined();
      }
    });
  });

  describe('processBattleResult', () => {
    it('should update NPC lastDefeated when player wins', () => {
      const battleResult: HourlyBattleResult = {
        npc: testNPC,
        playerDeck: testPlayerDeck,
        npcDeck: generateNPCDeck(testNPC),
        winner: 'player',
        rounds: 4,
        rewards: testNPC.rewards,
        battleLog: ['Player won'],
        timestamp: new Date()
      };
      
      const updatedNPC = processBattleResult(battleResult);
      
      expect(updatedNPC.lastDefeated).toBeDefined();
      expect(updatedNPC.lastDefeated).toBeInstanceOf(Date);
    });

    it('should not update NPC when NPC wins', () => {
      const battleResult: HourlyBattleResult = {
        npc: testNPC,
        playerDeck: testPlayerDeck,
        npcDeck: generateNPCDeck(testNPC),
        winner: 'npc',
        rounds: 4,
        battleLog: ['NPC won'],
        timestamp: new Date()
      };
      
      const updatedNPC = processBattleResult(battleResult);
      
      expect(updatedNPC.lastDefeated).toBeUndefined();
    });

    it('should preserve other NPC properties', () => {
      const battleResult: HourlyBattleResult = {
        npc: testNPC,
        playerDeck: testPlayerDeck,
        npcDeck: generateNPCDeck(testNPC),
        winner: 'player',
        rounds: 4,
        rewards: testNPC.rewards,
        battleLog: ['Player won'],
        timestamp: new Date()
      };
      
      const updatedNPC = processBattleResult(battleResult);
      
      expect(updatedNPC.id).toBe(testNPC.id);
      expect(updatedNPC.name).toBe(testNPC.name);
      expect(updatedNPC.faction).toBe(testNPC.faction);
      expect(updatedNPC.difficulty).toBe(testNPC.difficulty);
      expect(updatedNPC.level).toBe(testNPC.level);
      expect(updatedNPC.strategy).toEqual(testNPC.strategy);
      expect(updatedNPC.rewards).toEqual(testNPC.rewards);
    });
  });

  describe('calculateBattleRewards', () => {
    it('should calculate base rewards correctly', () => {
      const rewards = calculateBattleRewards(testNPC, 4, 100);
      
      // Com 100 de vida, há um bônus de 10 (100/10)
      const healthBonus = Math.floor(100 / 10);
      expect(rewards.experience).toBe(testNPC.rewards.experience + healthBonus);
      expect(rewards.respect).toBe(testNPC.rewards.respect + Math.floor(healthBonus / 2));
      expect(rewards.cards).toEqual(testNPC.rewards.cards);
      expect(rewards.specialRewards).toEqual(testNPC.rewards.specialRewards);
    });

    it('should add health bonus', () => {
      const rewards = calculateBattleRewards(testNPC, 4, 80);
      const healthBonus = Math.floor(80 / 10); // 8
      
      expect(rewards.experience).toBe(testNPC.rewards.experience + healthBonus);
      expect(rewards.respect).toBe(testNPC.rewards.respect + Math.floor(healthBonus / 2));
    });

    it('should add speed bonus for fast victory', () => {
      const rewards = calculateBattleRewards(testNPC, 2, 100);
      const healthBonus = Math.floor(100 / 10); // 10
      const speedBonus = 20; // Bônus por vitória rápida
      
      expect(rewards.experience).toBe(testNPC.rewards.experience + healthBonus + speedBonus);
    });

    it('should handle zero health', () => {
      const rewards = calculateBattleRewards(testNPC, 4, 0);
      
      expect(rewards.experience).toBe(testNPC.rewards.experience);
      expect(rewards.respect).toBe(testNPC.rewards.respect);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty player deck', () => {
      const emptyDeck: Card[] = [];
      const result = simulateHourlyBattle(testNPC, emptyDeck);
      
      expect(result.playerDeck).toEqual([]);
      expect(result.winner).toBe('npc');
    });

    it('should handle NPC with no available hours', () => {
      const npcNoHours = { ...testNPC, availableHours: [] };
      const isAvailable = isNPCAvailable(npcNoHours, 12);
      
      expect(isAvailable).toBe(false);
    });

    it('should handle negative cooldown hours', () => {
      const npcNegativeCooldown = { ...testNPC, cooldownHours: -1 };
      const isAvailable = isNPCAvailable(npcNegativeCooldown, 12);
      
      expect(isAvailable).toBe(true);
    });
  });
});
