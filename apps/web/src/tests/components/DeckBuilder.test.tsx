import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeckBuilder } from '../../components/DeckBuilder';
import * as useDeckModule from '../../hooks/useDeck';
import { Card, Faction } from '../../game/types';

// Mock do hook useDeck
vi.mock('../../hooks/useDeck', () => ({
  useDeck: vi.fn()
}));

describe('DeckBuilder Component', () => {
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

  const defaultMockReturn = {
    deck: [],
    selectedFaction: null,
    isLoading: false,
    error: null,
    availableFactions: [
      'roda-de-ginga',
      'motofrete-uniao',
      'crew-do-graffiti',
      'bateria-central',
      'guardioes-do-verde',
      'vaqueiros-do-sertao'
    ],
    selectFaction: vi.fn(),
    clearFaction: vi.fn(),
    addCard: vi.fn(),
    removeCard: vi.fn(),
    generateDeck: vi.fn(),
    clearDeck: vi.fn(),
    reset: vi.fn(),
    validateDeck: vi.fn(() => ({ isValid: false, errors: [] })),
    getDeckStats: vi.fn(() => ({ cardCount: 0, totalPower: 0, totalEnergy: 0, averagePower: 0, averageEnergy: 0 })),
    saveDeck: vi.fn(),
    loadDeck: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDeckModule.useDeck).mockReturnValue(defaultMockReturn);
  });

  describe('Renderização Inicial', () => {
    it('should render deck builder title', () => {
      render(<DeckBuilder />);

      expect(screen.getByText('Construtor de Deck')).toBeInTheDocument();
    });

    it('should render faction selection section', () => {
      render(<DeckBuilder />);

      expect(screen.getByText('Selecione sua Facção')).toBeInTheDocument();
      expect(screen.getByText('Roda de Ginga')).toBeInTheDocument();
      expect(screen.getByText('Motofrete União')).toBeInTheDocument();
      expect(screen.getByText('Crew do Graffiti')).toBeInTheDocument();
      expect(screen.getByText('Bateria Central')).toBeInTheDocument();
      expect(screen.getByText('Guardioes do Verde')).toBeInTheDocument();
      expect(screen.getByText('Vaqueiros do Sertão')).toBeInTheDocument();
    });

    it('should render deck stats section', () => {
      render(<DeckBuilder />);

      expect(screen.getByText('Estatísticas do Deck')).toBeInTheDocument();
      expect(screen.getByText('Cartas')).toBeInTheDocument();
      expect(screen.getByText('Poder Total')).toBeInTheDocument();
      expect(screen.getByText('Energia Total')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<DeckBuilder />);

      expect(screen.getByText('Gerar Deck')).toBeInTheDocument();
      expect(screen.getByText('Limpar Deck')).toBeInTheDocument();
      expect(screen.getByText('Salvar Deck')).toBeInTheDocument();
      expect(screen.getByText('Carregar Deck')).toBeInTheDocument();
    });
  });

  describe('Seleção de Facção', () => {
    it('should call selectFaction when faction is clicked', () => {
      const mockSelectFaction = vi.fn();
      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        selectFaction: mockSelectFaction
      });

      render(<DeckBuilder />);

      const rodaGingaButton = screen.getByText('Roda de Ginga');
      fireEvent.click(rodaGingaButton);

      expect(mockSelectFaction).toHaveBeenCalledWith('roda-de-ginga');
    });

    it('should highlight selected faction', () => {
      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        selectedFaction: 'roda-de-ginga'
      });

      render(<DeckBuilder />);

      const rodaGingaButton = screen.getByText('Roda de Ginga').closest('button');
      expect(rodaGingaButton).toHaveClass('bg-green-600');
    });

    it('should show clear faction button when faction is selected', () => {
      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        selectedFaction: 'roda-de-ginga'
      });

      render(<DeckBuilder />);

      expect(screen.getByText('Limpar Facção')).toBeInTheDocument();
    });

    it('should call clearFaction when clear button is clicked', () => {
      const mockClearFaction = vi.fn();
      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        selectedFaction: 'roda-de-ginga',
        clearFaction: mockClearFaction
      });

      render(<DeckBuilder />);

      const clearButton = screen.getByText('Limpar Facção');
      fireEvent.click(clearButton);

      expect(mockClearFaction).toHaveBeenCalled();
    });
  });

  describe('Gerenciamento de Deck', () => {
    it('should display deck cards when deck has cards', () => {
      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        deck: [mockCard, mockCard2]
      });

      render(<DeckBuilder />);

      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByText('Test Card 2')).toBeInTheDocument();
      expect(screen.getByText(/Poder: 5/)).toBeInTheDocument();
      expect(screen.getByText(/Energia: 3/)).toBeInTheDocument();
    });

    it('should show empty deck message when deck is empty', () => {
      render(<DeckBuilder />);

      expect(screen.getByText('Nenhuma carta no deck')).toBeInTheDocument();
    });

    it('should call removeCard when remove button is clicked', () => {
      const mockRemoveCard = vi.fn();
      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        deck: [mockCard],
        removeCard: mockRemoveCard
      });

      render(<DeckBuilder />);

      const removeButton = screen.getByText('Remover');
      fireEvent.click(removeButton);

      expect(mockRemoveCard).toHaveBeenCalledWith('test-card-1');
    });

    it('should call generateDeck when generate button is clicked', () => {
      const mockGenerateDeck = vi.fn();
      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        selectedFaction: 'roda-de-ginga',
        generateDeck: mockGenerateDeck
      });

      render(<DeckBuilder />);

      const generateButton = screen.getByText('Gerar Deck');
      fireEvent.click(generateButton);

      expect(mockGenerateDeck).toHaveBeenCalled();
    });

    it('should call clearDeck when clear button is clicked', () => {
      const mockClearDeck = vi.fn();
      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        deck: [mockCard], // Adicionar uma carta para habilitar o botão
        clearDeck: mockClearDeck
      });

      render(<DeckBuilder />);

      const clearButton = screen.getByText('Limpar Deck');
      fireEvent.click(clearButton);

      expect(mockClearDeck).toHaveBeenCalled();
    });
  });

  describe('Validação de Deck', () => {
    it('should show validation errors when deck is invalid', () => {
      const mockValidateDeck = vi.fn(() => ({
        isValid: false,
        errors: ['Deck deve ter exatamente 8 cartas', 'Todas as cartas devem ser da mesma facção']
      }));

      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        validateDeck: mockValidateDeck
      });

      render(<DeckBuilder />);

      expect(screen.getByText(/Deck deve ter exatamente 8 cartas/)).toBeInTheDocument();
      expect(screen.getByText(/Todas as cartas devem ser da mesma facção/)).toBeInTheDocument();
    });

    it('should show success message when deck is valid', () => {
      const mockValidateDeck = vi.fn(() => ({
        isValid: true,
        errors: []
      }));

      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        deck: [mockCard, mockCard2],
        validateDeck: mockValidateDeck
      });

      render(<DeckBuilder />);

      expect(screen.getByText('✅ Deck válido!')).toBeInTheDocument();
    });

    it('should update validation when deck changes', () => {
      const mockValidateDeck = vi.fn(() => ({
        isValid: false,
        errors: ['Deck deve ter exatamente 8 cartas']
      }));

      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        validateDeck: mockValidateDeck
      });

      render(<DeckBuilder />);

      expect(mockValidateDeck).toHaveBeenCalled();
    });
  });

  describe('Estatísticas do Deck', () => {
    it('should display correct deck statistics', () => {
      const mockGetDeckStats = vi.fn(() => ({
        cardCount: 5,
        totalPower: 25,
        totalEnergy: 15,
        averagePower: 5,
        averageEnergy: 3
      }));

      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        deck: [mockCard, mockCard2],
        getDeckStats: mockGetDeckStats
      });

      render(<DeckBuilder />);

      expect(screen.getByText(/5\/8/)).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('5.0')).toBeInTheDocument();
      expect(screen.getByText('3.0')).toBeInTheDocument();
    });

    it('should update statistics when deck changes', () => {
      const mockGetDeckStats = vi.fn(() => ({
        cardCount: 0,
        totalPower: 0,
        totalEnergy: 0,
        averagePower: 0,
        averageEnergy: 0
      }));

      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        getDeckStats: mockGetDeckStats
      });

      render(<DeckBuilder />);

      expect(mockGetDeckStats).toHaveBeenCalled();
    });
  });

  describe('Persistência', () => {
    it('should call saveDeck when save button is clicked', () => {
      const mockSaveDeck = vi.fn();
      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        deck: [mockCard], // Adicionar uma carta para habilitar o botão
        saveDeck: mockSaveDeck
      });

      render(<DeckBuilder />);

      const saveButton = screen.getByText('Salvar Deck');
      fireEvent.click(saveButton);

      expect(mockSaveDeck).toHaveBeenCalled();
    });

    it('should call loadDeck when load button is clicked', () => {
      const mockLoadDeck = vi.fn();
      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        loadDeck: mockLoadDeck
      });

      render(<DeckBuilder />);

      const loadButton = screen.getByText('Carregar Deck');
      fireEvent.click(loadButton);

      expect(mockLoadDeck).toHaveBeenCalled();
    });
  });

  describe('Estados de Loading e Erro', () => {
    it('should show loading state when generating deck', () => {
      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true
      });

      render(<DeckBuilder />);

      expect(screen.getByText('Gerando deck...')).toBeInTheDocument();
    });

    it('should show error message when there is an error', () => {
      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        error: 'Erro ao gerar deck'
      });

      render(<DeckBuilder />);

      expect(screen.getByText('Erro ao gerar deck')).toBeInTheDocument();
    });

    it('should disable buttons when loading', () => {
      vi.mocked(useDeckModule.useDeck).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true
      });

      render(<DeckBuilder />);

      const generateButton = screen.getByText('Gerando deck...');
      expect(generateButton).toBeDisabled();
    });
  });

  describe('Responsividade', () => {
    it('should render on mobile devices', () => {
      // Simular viewport móvel
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      render(<DeckBuilder />);

      expect(screen.getByText('Construtor de Deck')).toBeInTheDocument();
      expect(screen.getByText('Selecione sua Facção')).toBeInTheDocument();
    });

    it('should render on desktop devices', () => {
      // Simular viewport desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920
      });

      render(<DeckBuilder />);

      expect(screen.getByText('Construtor de Deck')).toBeInTheDocument();
      expect(screen.getByText('Selecione sua Facção')).toBeInTheDocument();
    });
  });
});
