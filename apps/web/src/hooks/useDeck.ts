import { useState, useCallback, useEffect } from 'react';
import { Card, Faction } from '../game/types';
import { generateBalancedDeck, getCardsByFaction, validateDeck, calculateDeckStats } from '../game/cards';

export interface DeckStats {
  cardCount: number;
  totalPower: number;
  totalEnergy: number;
  averagePower: number;
  averageEnergy: number;
}

export interface DeckValidation {
  isValid: boolean;
  errors: string[];
}

export interface UseDeckReturn {
  // Estado
  deck: Card[];
  selectedFaction: Faction | null;
  isLoading: boolean;
  error: string | null;
  availableFactions: Faction[];

  // Ações
  selectFaction: (faction: Faction) => void;
  clearFaction: () => void;
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;
  generateDeck: () => void;
  clearDeck: () => void;
  reset: () => void;

  // Validação e Estatísticas
  validateDeck: () => DeckValidation;
  getDeckStats: () => DeckStats;

  // Persistência
  saveDeck: () => void;
  loadDeck: () => void;
}

const VALID_FACTIONS: Faction[] = [
  'roda-de-ginga',
  'motofrete-uniao',
  'crew-do-graffiti',
  'bateria-central',
  'guardioes-do-verde',
  'vaqueiros-do-sertao'
];

const MAX_DECK_SIZE = 8;
const STORAGE_KEY = 'liga-da-quebrada-deck';

export function useDeck(): UseDeckReturn {
  const [deck, setDeck] = useState<Card[]>([]);
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableFactions = VALID_FACTIONS;

  // Limpar erro após 3 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const selectFaction = useCallback((faction: Faction) => {
    if (!VALID_FACTIONS.includes(faction)) {
      setError('Facção inválida');
      return;
    }

    setSelectedFaction(faction);
    setError(null);
  }, []);

  const clearFaction = useCallback(() => {
    setSelectedFaction(null);
    setDeck([]);
    setError(null);
  }, []);

  const addCard = useCallback((card: Card) => {
    setDeck(currentDeck => {
      // Verificar se a carta já está no deck
      if (currentDeck.some(c => c.id === card.id)) {
        setError('Carta já está no deck');
        return currentDeck;
      }

      // Verificar limite do deck
      if (currentDeck.length >= MAX_DECK_SIZE) {
        setError('Deck já está cheio (máximo 8 cartas)');
        return currentDeck;
      }

      setError(null);
      return [...currentDeck, card];
    });
  }, []);

  const removeCard = useCallback((cardId: string) => {
    setDeck(currentDeck => currentDeck.filter(card => card.id !== cardId));
    setError(null);
  }, []);

  const generateDeck = useCallback(() => {
    if (!selectedFaction) {
      setError('Selecione uma facção primeiro');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generatedDeck = generateBalancedDeck(selectedFaction);
      setDeck(generatedDeck);
    } catch (err) {
      setError('Erro ao gerar deck');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFaction]);

  const clearDeck = useCallback(() => {
    setDeck([]);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setDeck([]);
    setSelectedFaction(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const validateDeck = useCallback((): DeckValidation => {
    const errors: string[] = [];

    // Verificar tamanho do deck
    if (deck.length !== MAX_DECK_SIZE) {
      errors.push('Deck deve ter exatamente 8 cartas');
    }

    // Verificar se todas as cartas são da mesma facção
    if (deck.length > 0) {
      const firstFaction = deck[0].faction;
      const hasMixedFactions = deck.some(card => card.faction !== firstFaction);
      
      if (hasMixedFactions) {
        errors.push('Todas as cartas devem ser da mesma facção');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [deck]);

  const getDeckStats = useCallback((): DeckStats => {
    if (deck.length === 0) {
      return {
        cardCount: 0,
        totalPower: 0,
        totalEnergy: 0,
        averagePower: 0,
        averageEnergy: 0
      };
    }

    const totalPower = deck.reduce((sum, card) => sum + card.power, 0);
    const totalEnergy = deck.reduce((sum, card) => sum + card.energy, 0);

    return {
      cardCount: deck.length,
      totalPower,
      totalEnergy,
      averagePower: totalPower / deck.length,
      averageEnergy: totalEnergy / deck.length
    };
  }, [deck]);

  const saveDeck = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
        setError(null);
      }
    } catch (err) {
      setError('Erro ao salvar deck');
    }
  }, [deck]);

  const loadDeck = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedDeck = localStorage.getItem(STORAGE_KEY);
        if (savedDeck) {
          const parsedDeck = JSON.parse(savedDeck) as Card[];
          setDeck(parsedDeck);
          
          // Detectar facção do deck carregado
          if (parsedDeck.length > 0) {
            setSelectedFaction(parsedDeck[0].faction);
          }
        }
        setError(null);
      }
    } catch (err) {
      setError('Erro ao carregar deck');
    }
  }, []);

  return {
    // Estado
    deck,
    selectedFaction,
    isLoading,
    error,
    availableFactions,

    // Ações
    selectFaction,
    clearFaction,
    addCard,
    removeCard,
    generateDeck,
    clearDeck,
    reset,

    // Validação e Estatísticas
    validateDeck,
    getDeckStats,

    // Persistência
    saveDeck,
    loadDeck
  };
}
