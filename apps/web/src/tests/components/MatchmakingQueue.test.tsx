import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MatchmakingQueue } from '../../components/MatchmakingQueue';
import * as useMatchmakingModule from '../../hooks/useMatchmaking';

// Mock do hook useMatchmaking
vi.mock('../../hooks/useMatchmaking');

describe('MatchmakingQueue Component', () => {
  const mockStartSearch = vi.fn();
  const mockCancelSearch = vi.fn();

  const mockUseMatchmaking = {
    status: 'idle' as const,
    searchDuration: undefined,
    matchId: undefined,
    opponent: undefined,
    error: undefined,
    startSearch: mockStartSearch,
    cancelSearch: mockCancelSearch
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue(mockUseMatchmaking);
  });

  describe('Estado Inicial', () => {
    it('should render initial state correctly', () => {
      render(<MatchmakingQueue />);
      
      expect(screen.getByText('Pronto para Jogar?')).toBeInTheDocument();
      expect(screen.getByText('Clique no botão abaixo para começar a procurar um oponente')).toBeInTheDocument();
      expect(screen.getByText('Procurar Oponente')).toBeInTheDocument();
    });

    it('should show start search button when idle', () => {
      render(<MatchmakingQueue />);
      
      const startButton = screen.getByText('Procurar Oponente');
      expect(startButton).toBeInTheDocument();
      expect(startButton).toBeEnabled();
    });
  });

  describe('Estado de Busca', () => {
    it('should show searching state', () => {
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'searching',
        searchDuration: 15
      });

      render(<MatchmakingQueue />);
      
      expect(screen.getByText('Procurando Oponente...')).toBeInTheDocument();
      expect(screen.getByText('00:15')).toBeInTheDocument();
      expect(screen.getByText('Aguarde enquanto encontramos um oponente adequado')).toBeInTheDocument();
      expect(screen.getByText('Cancelar Busca')).toBeInTheDocument();
    });

    it('should format search duration correctly', () => {
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'searching',
        searchDuration: 65 // 1 minuto e 5 segundos
      });

      render(<MatchmakingQueue />);
      
      expect(screen.getByText('01:05')).toBeInTheDocument();
    });

    it('should handle start search button click', async () => {
      render(<MatchmakingQueue />);
      
      const startButton = screen.getByText('Procurar Oponente');
      fireEvent.click(startButton);
      
      expect(mockStartSearch).toHaveBeenCalledWith('player-1');
    });

    it('should handle cancel search button click', async () => {
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'searching'
      });

      render(<MatchmakingQueue />);
      
      const cancelButton = screen.getByText('Cancelar Busca');
      fireEvent.click(cancelButton);
      
      expect(mockCancelSearch).toHaveBeenCalled();
    });
  });

  describe('Estado de Pareamento', () => {
    it('should show matched state', () => {
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'matched',
        opponent: {
          id: 'opponent-123',
          name: 'TestOpponent',
          rank: 5
        }
      });

      render(<MatchmakingQueue />);
      
      expect(screen.getByText('Oponente Encontrado!')).toBeInTheDocument();
      expect(screen.getByText('TestOpponent')).toBeInTheDocument();
      expect(screen.getByText('Rank: 5')).toBeInTheDocument();
      expect(screen.getByText('Conectando...')).toBeInTheDocument();
    });

    it('should show connecting state', () => {
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'connecting'
      });

      render(<MatchmakingQueue />);
      
      expect(screen.getByText('Conectando...')).toBeInTheDocument();
      expect(screen.getByText('Estabelecendo conexão com o oponente')).toBeInTheDocument();
    });

    it('should show ready state', () => {
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'ready',
        matchId: 'match-123'
      });

      render(<MatchmakingQueue />);
      
      expect(screen.getByText('Pronto para Jogar!')).toBeInTheDocument();
      expect(screen.getByText('Iniciando partida...')).toBeInTheDocument();
    });
  });

  describe('Estados de Erro', () => {
    it('should show error state', () => {
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'error',
        error: 'Tempo limite de busca excedido'
      });

      render(<MatchmakingQueue />);
      
      expect(screen.getByText('Erro na Busca')).toBeInTheDocument();
      expect(screen.getByText('Tempo limite de busca excedido')).toBeInTheDocument();
      expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
    });

    it('should handle retry button click', () => {
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'error',
        error: 'Erro de conexão'
      });

      render(<MatchmakingQueue />);
      
      const retryButton = screen.getByText('Tentar Novamente');
      fireEvent.click(retryButton);
      
      expect(mockStartSearch).toHaveBeenCalledWith('player-1');
    });
  });

  describe('Interface e Acessibilidade', () => {
    it('should have proper ARIA labels', () => {
      render(<MatchmakingQueue />);
      
      const startButton = screen.getByText('Procurar Oponente');
      expect(startButton).toHaveAttribute('aria-label', 'Iniciar busca por oponente');
    });

    it('should have proper button roles', () => {
      render(<MatchmakingQueue />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should show loading state during search', () => {
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'searching'
      });

      render(<MatchmakingQueue />);
      
      const cancelButton = screen.getByText('Cancelar Busca');
      expect(cancelButton).toBeEnabled();
    });

    it('should disable start button when searching', () => {
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'searching'
      });

      render(<MatchmakingQueue />);
      
      // O botão de iniciar não deve estar visível durante a busca
      expect(screen.queryByText('Procurar Oponente')).not.toBeInTheDocument();
    });
  });

  describe('Animações e Estados Visuais', () => {
    it('should show different icons for different states', () => {
      // Estado inicial
      const { rerender } = render(<MatchmakingQueue />);
      expect(screen.getByText('⚔️')).toBeInTheDocument();

      // Estado de busca
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'searching'
      });
      rerender(<MatchmakingQueue />);
      expect(screen.getByText('🔍')).toBeInTheDocument();

      // Estado de pareamento
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'matched'
      });
      rerender(<MatchmakingQueue />);
      expect(screen.getByText('🎯')).toBeInTheDocument();
    });

    it('should show progress indicator during search', () => {
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'searching',
        searchDuration: 30
      });

      render(<MatchmakingQueue />);
      
      expect(screen.getByText('00:30')).toBeInTheDocument();
    });
  });

  describe('Integração com Navegação', () => {
    it('should navigate to game when ready', async () => {
      const mockNavigate = vi.fn();
      vi.spyOn(useMatchmakingModule, 'useMatchmaking').mockReturnValue({
        ...mockUseMatchmaking,
        status: 'ready',
        matchId: 'match-123'
      });

      // Mock do useNavigation
      vi.doMock('../../hooks/useNavigation', () => ({
        useNavigation: () => ({
          navigate: mockNavigate
        })
      }));

      render(<MatchmakingQueue />);
      
      await waitFor(() => {
        expect(screen.getByText('Pronto para Jogar!')).toBeInTheDocument();
      });
    });
  });
});
