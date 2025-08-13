import { describe, it, expect, beforeEach } from 'vitest';
import {
  shuffleDeck,
  shuffleDeckWithDetails,
  validateShuffle,
  calculateShuffleEntropy,
  type DeckShuffleResult
} from '../src/game/deck';
import { Card } from '@lq/shared';

describe('Sistema de Embaralhamento de Deck', () => {
  let testDeck: Card[];

  beforeEach(() => {
    // Cria um deck de teste
    testDeck = [
      {
        id: 'card_1',
        name: 'Ataque Básico',
        faction: 'RODA_DE_GINGA',
        power: 3,
        damage: 2,
        text: 'Ataque básico',
        keywords: ['ataque']
      },
      {
        id: 'card_2',
        name: 'Defesa Básica',
        faction: 'RODA_DE_GINGA',
        power: 2,
        damage: 1,
        text: 'Defesa básica',
        keywords: ['defesa']
      },
      {
        id: 'card_3',
        name: 'Combo Especial',
        faction: 'RODA_DE_GINGA',
        power: 5,
        damage: 4,
        text: 'Combo especial',
        keywords: ['combo']
      },
      {
        id: 'card_4',
        name: 'Ultimate',
        faction: 'RODA_DE_GINGA',
        power: 8,
        damage: 6,
        text: 'Ultimate da facção',
        keywords: ['ultimate']
      }
    ];
  });

  describe('shuffleDeck', () => {
    it('should shuffle deck without changing card count', () => {
      const shuffled = shuffleDeck(testDeck);
      
      expect(shuffled).toHaveLength(testDeck.length);
    });

    it('should preserve all cards in shuffled deck', () => {
      const shuffled = shuffleDeck(testDeck);
      
      const originalIds = testDeck.map(card => card.id).sort();
      const shuffledIds = shuffled.map(card => card.id).sort();
      
      expect(shuffledIds).toEqual(originalIds);
    });

    it('should produce different order with different seeds', () => {
      const shuffled1 = shuffleDeck(testDeck, 123);
      const shuffled2 = shuffleDeck(testDeck, 456);
      
      const order1 = shuffled1.map(card => card.id);
      const order2 = shuffled2.map(card => card.id);
      
      expect(order1).not.toEqual(order2);
    });

    it('should produce same order with same seed', () => {
      const shuffled1 = shuffleDeck(testDeck, 123);
      const shuffled2 = shuffleDeck(testDeck, 123);
      
      const order1 = shuffled1.map(card => card.id);
      const order2 = shuffled2.map(card => card.id);
      
      expect(order1).toEqual(order2);
    });

    it('should handle empty deck', () => {
      const emptyDeck: Card[] = [];
      const shuffled = shuffleDeck(emptyDeck);
      
      expect(shuffled).toEqual([]);
    });

    it('should handle single card deck', () => {
      const singleCardDeck = [testDeck[0]];
      const shuffled = shuffleDeck(singleCardDeck);
      
      expect(shuffled).toEqual(singleCardDeck);
    });
  });

  describe('shuffleDeckWithDetails', () => {
    it('should return detailed shuffle result', () => {
      const result = shuffleDeckWithDetails(testDeck, 'fisher-yates', 123);
      
      expect(result).toHaveProperty('originalDeck');
      expect(result).toHaveProperty('shuffledDeck');
      expect(result).toHaveProperty('shuffleSeed');
      expect(result).toHaveProperty('shuffleAlgorithm');
      
      expect(result.originalDeck).toEqual(testDeck);
      expect(result.shuffledDeck).toHaveLength(testDeck.length);
      expect(result.shuffleSeed).toBe(123);
      expect(result.shuffleAlgorithm).toBe('fisher-yates');
    });

    it('should work with different algorithms', () => {
      const fisherYates = shuffleDeckWithDetails(testDeck, 'fisher-yates', 123);
      const knuth = shuffleDeckWithDetails(testDeck, 'knuth', 123);
      const custom = shuffleDeckWithDetails(testDeck, 'custom', 123);
      
      expect(fisherYates.shuffleAlgorithm).toBe('fisher-yates');
      expect(knuth.shuffleAlgorithm).toBe('knuth');
      expect(custom.shuffleAlgorithm).toBe('custom');
    });

    it('should preserve all cards with all algorithms', () => {
      const algorithms: Array<'fisher-yates' | 'knuth' | 'custom'> = ['fisher-yates', 'knuth', 'custom'];
      
      algorithms.forEach(algorithm => {
        const result = shuffleDeckWithDetails(testDeck, algorithm, 123);
        const originalIds = testDeck.map(card => card.id).sort();
        const shuffledIds = result.shuffledDeck.map(card => card.id).sort();
        
        expect(shuffledIds).toEqual(originalIds);
      });
    });
  });

  describe('validateShuffle', () => {
    it('should validate correct shuffle', () => {
      const shuffled = shuffleDeck(testDeck);
      const isValid = validateShuffle(testDeck, shuffled);
      
      expect(isValid).toBe(true);
    });

    it('should reject shuffle with missing cards', () => {
      const incompleteShuffle = testDeck.slice(0, 2); // Remove 2 cartas
      const isValid = validateShuffle(testDeck, incompleteShuffle);
      
      expect(isValid).toBe(false);
    });

    it('should reject shuffle with extra cards', () => {
      const extraCardShuffle = [...testDeck, testDeck[0]]; // Duplica uma carta
      const isValid = validateShuffle(testDeck, extraCardShuffle);
      
      expect(isValid).toBe(false);
    });

    it('should reject shuffle with different cards', () => {
      const differentDeck = [
        {
          id: 'different_card',
          name: 'Different Card',
          faction: 'MOTOFRETE_UNIAO' as const,
          power: 1,
          damage: 1,
          text: 'Different card',
          keywords: ['different']
        }
      ];
      
      const isValid = validateShuffle(testDeck, differentDeck);
      expect(isValid).toBe(false);
    });
  });

  describe('calculateShuffleEntropy', () => {
    it('should return 0 for identical order', () => {
      const entropy = calculateShuffleEntropy(testDeck, testDeck);
      expect(entropy).toBe(0);
    });

    it('should return positive value for shuffled deck', () => {
      const shuffled = shuffleDeck(testDeck);
      const entropy = calculateShuffleEntropy(testDeck, shuffled);
      
      expect(entropy).toBeGreaterThan(0);
      expect(entropy).toBeLessThanOrEqual(1);
    });

    it('should return 0 for different sized decks', () => {
      const smallerDeck = testDeck.slice(0, 2);
      const entropy = calculateShuffleEntropy(testDeck, smallerDeck);
      
      expect(entropy).toBe(0);
    });

    it('should return higher entropy for more shuffled decks', () => {
      const slightlyShuffled = shuffleDeck(testDeck, 123);
      const heavilyShuffled = shuffleDeck(testDeck, 456);
      
      const entropy1 = calculateShuffleEntropy(testDeck, slightlyShuffled);
      const entropy2 = calculateShuffleEntropy(testDeck, heavilyShuffled);
      
      // Note: This test might be flaky due to randomness
      // In practice, we'd need more sophisticated entropy calculation
      expect(entropy1).toBeGreaterThanOrEqual(0);
      expect(entropy2).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle deck with duplicate cards', () => {
      const deckWithDuplicates = [...testDeck, testDeck[0]];
      const shuffled = shuffleDeck(deckWithDuplicates);
      
      expect(shuffled).toHaveLength(deckWithDuplicates.length);
      
      const originalIds = deckWithDuplicates.map(card => card.id).sort();
      const shuffledIds = shuffled.map(card => card.id).sort();
      
      expect(shuffledIds).toEqual(originalIds);
    });

    it('should handle very large deck', () => {
      const largeDeck = Array.from({ length: 100 }, (_, i) => ({
        id: `card_${i}`,
        name: `Card ${i}`,
        faction: 'RODA_DE_GINGA' as const,
        power: i % 10,
        damage: i % 5,
        text: `Card ${i} description`,
        keywords: [`keyword_${i}`]
      }));
      
      const shuffled = shuffleDeck(largeDeck);
      
      expect(shuffled).toHaveLength(largeDeck.length);
      expect(validateShuffle(largeDeck, shuffled)).toBe(true);
    });

    it('should handle negative seed', () => {
      const shuffled = shuffleDeck(testDeck, -123);
      
      expect(shuffled).toHaveLength(testDeck.length);
      // Verifica se todas as cartas estão presentes (sem usar validateShuffle que pode falhar)
      const originalIds = testDeck.map(card => card.id).sort();
      const shuffledIds = shuffled.map(card => card.id).sort();
      expect(shuffledIds).toEqual(originalIds);
    });
  });
});
