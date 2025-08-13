import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDeck } from '../../hooks/useDeck';
import { Card, Faction } from '../../game/types';
import * as cardsModule from '../../game/cards';

// Mock das funções do jogo
vi.mock('../../game/cards', () => ({
  generateBalancedDeck: vi.fn(),
  getCardsByFaction: vi.fn(),
  validateDeck: vi.fn(),
  calculateDeckStats: vi.fn()
}));

describe('useDeck Hook', () => {
  const mockCard: Card = {
    id: 'test-card-1',
    name: 'Test Card',
    faction: 'roda-de-ginga',
    power: 5,
    energy: 3,
    effects: [],
    keywords: []
  };

  const mockCard2: Card = {
    id: 'test-card-2',
    name: 'Test Card 2',
    faction: 'roda-de-ginga',
    power: 4,
    energy: 2,
    effects: [],
    keywords: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Configurar mocks padrão
    const mockCards = [
      { id: 'card-1', name: 'Card 1', faction: 'roda-de-ginga', power: 5, energy: 3, effects: [], keywords: [] },
      { id: 'card-2', name: 'Card 2', faction: 'roda-de-ginga', power: 4, energy: 2, effects: [], keywords: [] },
      { id: 'card-3', name: 'Card 3', faction: 'roda-de-ginga', power: 6, energy: 4, effects: [], keywords: [] },
      { id: 'card-4', name: 'Card 4', faction: 'roda-de-ginga', power: 3, energy: 1, effects: [], keywords: [] },
      { id: 'card-5', name: 'Card 5', faction: 'roda-de-ginga', power: 7, energy: 5, effects: [], keywords: [] },
      { id: 'card-6', name: 'Card 6', faction: 'roda-de-ginga', power: 4, energy: 2, effects: [], keywords: [] },
      { id: 'card-7', name: 'Card 7', faction: 'roda-de-ginga', power: 5, energy: 3, effects: [], keywords: [] },
      { id: 'card-8', name: 'Card 8', faction: 'roda-de-ginga', power: 6, energy: 4, effects: [], keywords: [] }
    ];
    
    vi.mocked(cardsModule.generateBalancedDeck).mockReturnValue(mockCards);
  });

  describe('Estado Inicial', () => {
    it('should start with empty deck', () => {
      const { result } = renderHook(() => useDeck());

      expect(result.current.deck).toEqual([]);
      expect(result.current.selectedFaction).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should start with default faction options', () => {
      const { result } = renderHook(() => useDeck());

      expect(result.current.availableFactions).toEqual([
        'roda-de-ginga',
        'motofrete-uniao',
        'crew-do-graffiti',
        'bateria-central',
        'guardioes-do-verde',
        'vaqueiros-do-sertao'
      ]);
    });
  });

  describe('Seleção de Facção', () => {
    it('should select faction successfully', () => {
      const { result } = renderHook(() => useDeck());

      act(() => {
        result.current.selectFaction('roda-de-ginga');
      });

      expect(result.current.selectedFaction).toBe('roda-de-ginga');
      expect(result.current.error).toBeNull();
    });

    it('should handle invalid faction selection', () => {
      const { result } = renderHook(() => useDeck());

      act(() => {
        result.current.selectFaction('invalid-faction' as Faction);
      });

      expect(result.current.selectedFaction).toBeNull();
      expect(result.current.error).toBe('Facção inválida');
    });

    it('should clear faction selection', () => {
      const { result } = renderHook(() => useDeck());

      act(() => {
        result.current.selectFaction('roda-de-ginga');
      });

      expect(result.current.selectedFaction).toBe('roda-de-ginga');

      act(() => {
        result.current.clearFaction();
      });

      expect(result.current.selectedFaction).toBeNull();
      expect(result.current.deck).toEqual([]);
    });
  });

  describe('Gerenciamento de Cartas', () => {
    it('should add card to deck', () => {
      const { result } = renderHook(() => useDeck());

      act(() => {
        result.current.addCard(mockCard);
      });

      expect(result.current.deck).toContain(mockCard);
      expect(result.current.deck.length).toBe(1);
    });

    it('should remove card from deck', () => {
      const { result } = renderHook(() => useDeck());

      act(() => {
        result.current.addCard(mockCard);
        result.current.addCard(mockCard2);
      });

      expect(result.current.deck.length).toBe(2);

      act(() => {
        result.current.removeCard(mockCard.id);
      });

      expect(result.current.deck).not.toContain(mockCard);
      expect(result.current.deck).toContain(mockCard2);
      expect(result.current.deck.length).toBe(1);
    });

    it('should not add duplicate cards', () => {
      const { result } = renderHook(() => useDeck());

      act(() => {
        result.current.addCard(mockCard);
        result.current.addCard(mockCard);
      });

      expect(result.current.deck).toHaveLength(1);
      expect(result.current.error).toBe('Carta já está no deck');
    });

    it('should limit deck size to 8 cards', () => {
      const { result } = renderHook(() => useDeck());

      const cards = Array.from({ length: 10 }, (_, i) => ({
        ...mockCard,
        id: `card-${i}`,
        name: `Card ${i}`
      }));

      act(() => {
        cards.forEach(card => result.current.addCard(card));
      });

      expect(result.current.deck).toHaveLength(8);
      expect(result.current.error).toBe('Deck já está cheio (máximo 8 cartas)');
    });
  });

  describe('Geração de Deck', () => {
    it('should generate balanced deck for selected faction', () => {
      const { result } = renderHook(() => useDeck());

      act(() => {
        result.current.selectFaction('roda-de-ginga');
      });

      act(() => {
        result.current.generateDeck();
      });

      expect(vi.mocked(cardsModule.generateBalancedDeck)).toHaveBeenCalledWith('roda-de-ginga', 8);
      expect(result.current.deck).toHaveLength(8);
      expect(result.current.deck.every(card => card.faction === 'roda-de-ginga')).toBe(true);
    });

    it('should not generate deck without faction selection', () => {
      const { result } = renderHook(() => useDeck());

      act(() => {
        result.current.generateDeck();
      });

      expect(result.current.deck).toHaveLength(0);
      expect(result.current.error).toBe('Selecione uma facção primeiro');
    });
  });

  describe('Validação de Deck', () => {
    it('should validate deck successfully', () => {
      const { result } = renderHook(() => useDeck());

      // Adicionar 8 cartas para ter um deck válido
      const cards = Array.from({ length: 8 }, (_, i) => ({
        ...mockCard,
        id: `card-${i}`,
        name: `Card ${i}`
      }));

      act(() => {
        cards.forEach(card => result.current.addCard(card));
      });

      const validation = result.current.validateDeck();

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid deck size', () => {
      const { result } = renderHook(() => useDeck());

      const validation = result.current.validateDeck();

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Deck deve ter exatamente 8 cartas');
    });

    it('should detect mixed factions', () => {
      const { result } = renderHook(() => useDeck());

      const mixedCard: Card = {
        ...mockCard,
        faction: 'motofrete-uniao'
      };

      // Adicionar 8 cartas (7 da mesma facção + 1 diferente)
      const sameFactionCards = Array.from({ length: 7 }, (_, i) => ({
        ...mockCard,
        id: `card-${i}`,
        name: `Card ${i}`
      }));

      act(() => {
        sameFactionCards.forEach(card => result.current.addCard(card));
        result.current.addCard(mixedCard);
      });

      const validation = result.current.validateDeck();

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Todas as cartas devem ser da mesma facção');
    });
  });

  describe('Persistência', () => {
    it('should save deck to localStorage', () => {
      const { result } = renderHook(() => useDeck());
      const mockLocalStorage = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn()
      };
      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

      act(() => {
        result.current.addCard(mockCard);
      });

      act(() => {
        result.current.saveDeck();
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'liga-da-quebrada-deck',
        JSON.stringify([mockCard])
      );
    });

    it('should load deck from localStorage', () => {
      const savedDeck = [mockCard, mockCard2];
      const mockLocalStorage = {
        getItem: vi.fn(() => JSON.stringify(savedDeck)),
        setItem: vi.fn(),
        removeItem: vi.fn()
      };
      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

      const { result } = renderHook(() => useDeck());

      act(() => {
        result.current.loadDeck();
      });

      expect(result.current.deck).toEqual(savedDeck);
    });

    it('should handle empty localStorage', () => {
      const mockLocalStorage = {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn()
      };
      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

      const { result } = renderHook(() => useDeck());

      act(() => {
        result.current.loadDeck();
      });

      expect(result.current.deck).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Estatísticas do Deck', () => {
    it('should calculate deck statistics', () => {
      const { result } = renderHook(() => useDeck());

      act(() => {
        result.current.addCard(mockCard);
        result.current.addCard(mockCard2);
      });

      const stats = result.current.getDeckStats();

      expect(stats.cardCount).toBe(2);
      expect(stats.totalPower).toBe(9); // 5 + 4
      expect(stats.totalEnergy).toBe(5); // 3 + 2
      expect(stats.averagePower).toBe(4.5);
      expect(stats.averageEnergy).toBe(2.5);
    });

    it('should return zero stats for empty deck', () => {
      const { result } = renderHook(() => useDeck());

      const stats = result.current.getDeckStats();

      expect(stats.cardCount).toBe(0);
      expect(stats.totalPower).toBe(0);
      expect(stats.totalEnergy).toBe(0);
      expect(stats.averagePower).toBe(0);
      expect(stats.averageEnergy).toBe(0);
    });
  });

  describe('Limpeza e Reset', () => {
    it('should clear deck completely', () => {
      const { result } = renderHook(() => useDeck());

      act(() => {
        result.current.addCard(mockCard);
        result.current.addCard(mockCard2);
      });

      expect(result.current.deck).toHaveLength(2);

      act(() => {
        result.current.clearDeck();
      });

      expect(result.current.deck).toHaveLength(0);
    });

    it('should reset all state', () => {
      const { result } = renderHook(() => useDeck());

      act(() => {
        result.current.selectFaction('roda-de-ginga');
        result.current.addCard(mockCard);
      });

      expect(result.current.selectedFaction).toBe('roda-de-ginga');
      expect(result.current.deck).toHaveLength(1);

      act(() => {
        result.current.reset();
      });

      expect(result.current.selectedFaction).toBeNull();
      expect(result.current.deck).toHaveLength(0);
      expect(result.current.error).toBeNull();
    });
  });
});
