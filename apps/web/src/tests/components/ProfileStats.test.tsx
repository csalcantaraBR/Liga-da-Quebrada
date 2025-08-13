import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileStats } from '../../components/ProfileStats';
import * as useProfileModule from '../../hooks/useProfile';
import { Profile, Achievement } from '../../game/types';

// Mock do hook useProfile
vi.mock('../../hooks/useProfile', () => ({
  useProfile: vi.fn()
}));

describe('ProfileStats Component', () => {
  const mockProfile: Profile = {
    id: 'player-1',
    username: 'TestPlayer',
    level: 5,
    xp: 1250,
    totalGames: 25,
    wins: 15,
    losses: 8,
    draws: 2,
    winRate: 60,
    rank: 'Prata',
    achievements: [],
    favoriteFaction: 'roda-de-ginga',
    createdAt: new Date('2024-01-01'),
    lastActive: new Date()
  };

  const mockAchievement: Achievement = {
    id: 'first-win',
    name: 'Primeira Vitória',
    description: 'Ganhe sua primeira partida',
    icon: '🏆',
    unlockedAt: new Date(),
    category: 'combat'
  };

  const defaultMockReturn = {
    profile: mockProfile,
    isLoading: false,
    error: null,
    updateUsername: vi.fn(),
    updateFavoriteFaction: vi.fn(),
    saveProfile: vi.fn(),
    addXP: vi.fn(),
    getXPNeededForNextLevel: vi.fn(() => 750),
    getLevelProgress: vi.fn(() => 25),
    getRankRequirements: vi.fn(() => ({
      current: 'Prata',
      next: 'Ouro',
      levelNeeded: 5
    })),
    recordGameResult: vi.fn(),
    unlockAchievement: vi.fn(),
    getAchievementsByCategory: vi.fn(() => []),
    getAchievementProgress: vi.fn(() => ({
      total: 20,
      unlocked: 5,
      percentage: 25
    })),
    getFactionStatistics: vi.fn(() => ({
      'roda-de-ginga': { games: 10, wins: 7, losses: 2, draws: 1, winRate: 70 },
      'motofrete-uniao': { games: 5, wins: 3, losses: 2, draws: 0, winRate: 60 },
      'crew-do-graffiti': { games: 0, wins: 0, losses: 0, draws: 0, winRate: 0 },
      'bateria-central': { games: 0, wins: 0, losses: 0, draws: 0, winRate: 0 },
      'guardioes-do-verde': { games: 0, wins: 0, losses: 0, draws: 0, winRate: 0 },
      'vaqueiros-do-sertao': { games: 0, wins: 0, losses: 0, draws: 0, winRate: 0 }
    })),
    getRecentGames: vi.fn(() => []),
    resetProfile: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useProfileModule.useProfile).mockReturnValue(defaultMockReturn);
  });

  describe('Renderização Inicial', () => {
    it('should render profile stats title', () => {
      render(<ProfileStats />);

      expect(screen.getByText('Perfil do Jogador')).toBeInTheDocument();
    });

    it('should display username', () => {
      render(<ProfileStats />);

      expect(screen.getByText('TestPlayer')).toBeInTheDocument();
    });

    it('should display level and rank', () => {
      render(<ProfileStats />);

      expect(screen.getByText('Nível 5')).toBeInTheDocument();
      expect(screen.getByText('Prata')).toBeInTheDocument();
    });

    it('should display XP progress', () => {
      render(<ProfileStats />);

      expect(screen.getByText('1.250 XP')).toBeInTheDocument();
      expect(screen.getByText('25%')).toBeInTheDocument();
    });

    it('should display game statistics', () => {
      render(<ProfileStats />);

      expect(screen.getByText('25')).toBeInTheDocument(); // Total games
      expect(screen.getByText('15')).toBeInTheDocument(); // Wins
      expect(screen.getByText('8')).toBeInTheDocument(); // Losses
      expect(screen.getByText('2')).toBeInTheDocument(); // Draws
      expect(screen.getByText('60%')).toBeInTheDocument(); // Win rate
    });
  });

  describe('Edição de Perfil', () => {
    it('should show edit mode when edit button is clicked', () => {
      render(<ProfileStats />);

      const editButton = screen.getByText('Editar Perfil');
      fireEvent.click(editButton);

      expect(screen.getByDisplayValue('TestPlayer')).toBeInTheDocument();
      expect(screen.getByText('Salvar')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('should update username when saved', () => {
      const mockUpdateUsername = vi.fn();
      vi.mocked(useProfileModule.useProfile).mockReturnValue({
        ...defaultMockReturn,
        updateUsername: mockUpdateUsername
      });

      render(<ProfileStats />);

      const editButton = screen.getByText('Editar Perfil');
      fireEvent.click(editButton);

      const usernameInput = screen.getByDisplayValue('TestPlayer');
      fireEvent.change(usernameInput, { target: { value: 'NovoJogador' } });

      const saveButton = screen.getByText('Salvar');
      fireEvent.click(saveButton);

      expect(mockUpdateUsername).toHaveBeenCalledWith('NovoJogador');
    });

    it('should cancel edit mode when cancel button is clicked', () => {
      render(<ProfileStats />);

      const editButton = screen.getByText('Editar Perfil');
      fireEvent.click(editButton);

      expect(screen.getByDisplayValue('TestPlayer')).toBeInTheDocument();

      const cancelButton = screen.getByText('Cancelar');
      fireEvent.click(cancelButton);

      expect(screen.queryByDisplayValue('TestPlayer')).not.toBeInTheDocument();
      expect(screen.getByText('Editar Perfil')).toBeInTheDocument();
    });
  });

  describe('Seleção de Facção Favorita', () => {
    it('should display current favorite faction', () => {
      render(<ProfileStats />);

      expect(screen.getAllByText(/Roda de Ginga/).length).toBeGreaterThan(0);
    });

    it('should show faction selection when edit mode is active', () => {
      render(<ProfileStats />);

      const editButton = screen.getByText('Editar Perfil');
      fireEvent.click(editButton);

      // Verificar se as opções de facção estão disponíveis
      expect(screen.getAllByText(/Motofrete União/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Crew do Graffiti/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Roda de Ginga/).length).toBeGreaterThan(0);
    });

    it('should update favorite faction when selected', () => {
      const mockUpdateFavoriteFaction = vi.fn();
      vi.mocked(useProfileModule.useProfile).mockReturnValue({
        ...defaultMockReturn,
        updateFavoriteFaction: mockUpdateFavoriteFaction
      });

      render(<ProfileStats />);

      const editButton = screen.getByText('Editar Perfil');
      fireEvent.click(editButton);

      // Usar getAllByText e pegar o primeiro elemento que contém "Motofrete União"
      const motofreteButtons = screen.getAllByText(/Motofrete União/);
      const motofreteButton = motofreteButtons[0];
      fireEvent.click(motofreteButton);

      expect(mockUpdateFavoriteFaction).toHaveBeenCalledWith('motofrete-uniao');
    });
  });

  describe('Sistema de Ranking', () => {
    it('should display rank requirements', () => {
      render(<ProfileStats />);

      expect(screen.getByText('Próximo Rank: Ouro')).toBeInTheDocument();
      expect(screen.getByText('Nível Necessário: 5')).toBeInTheDocument();
    });

    it('should show rank progress', () => {
      render(<ProfileStats />);

      expect(screen.getByText('750 XP restantes')).toBeInTheDocument();
    });
  });

  describe('Sistema de Conquistas', () => {
    it('should display achievement progress', () => {
      render(<ProfileStats />);

      expect(screen.getByText('Conquistas')).toBeInTheDocument();
      expect(screen.getByText('5/20')).toBeInTheDocument();
      expect(screen.getByText('25%')).toBeInTheDocument();
    });

    it('should show achievements by category', () => {
      const mockGetAchievementsByCategory = vi.fn(() => [mockAchievement]);
      vi.mocked(useProfileModule.useProfile).mockReturnValue({
        ...defaultMockReturn,
        getAchievementsByCategory: mockGetAchievementsByCategory
      });

      render(<ProfileStats />);

      const combatTab = screen.getByText('Combate');
      fireEvent.click(combatTab);

      expect(mockGetAchievementsByCategory).toHaveBeenCalledWith('combat');
      expect(screen.getByText('Primeira Vitória')).toBeInTheDocument();
      expect(screen.getByText('Ganhe sua primeira partida')).toBeInTheDocument();
    });

    it('should display achievement categories', () => {
      render(<ProfileStats />);

      expect(screen.getByText('Combate')).toBeInTheDocument();
      expect(screen.getByText('Progressão')).toBeInTheDocument();
      expect(screen.getByText('Coleção')).toBeInTheDocument();
      expect(screen.getByText('Social')).toBeInTheDocument();
    });
  });

  describe('Estatísticas por Facção', () => {
    it('should display faction statistics', () => {
      render(<ProfileStats />);

      expect(screen.getByText('Estatísticas por Facção')).toBeInTheDocument();
      expect(screen.getAllByText(/Roda de Ginga/).length).toBeGreaterThan(0);
      expect(screen.getByText('10 jogos')).toBeInTheDocument();
      expect(screen.getByText('70% vitórias')).toBeInTheDocument();
    });

    it('should show faction details when clicked', () => {
      render(<ProfileStats />);

      // Verificar se as estatísticas das facções estão sendo exibidas corretamente
      // Usar getAllByText para lidar com múltiplos elementos
      const winsElements = screen.getAllByText(/vitórias/);
      const lossesElements = screen.getAllByText(/derrotas/);
      const drawsElements = screen.getAllByText(/empates/);
      
      expect(winsElements.length).toBeGreaterThan(0);
      expect(lossesElements.length).toBeGreaterThan(0);
      expect(drawsElements.length).toBeGreaterThan(0);
      
      // Verificar se os valores específicos estão presentes
      expect(screen.getByText('70% vitórias')).toBeInTheDocument();
      expect(screen.getByText('60% vitórias')).toBeInTheDocument();
    });
  });

  describe('Histórico de Jogos', () => {
    it('should display recent games section', () => {
      render(<ProfileStats />);

      expect(screen.getByText('Jogos Recentes')).toBeInTheDocument();
    });

    it('should show empty state when no recent games', () => {
      render(<ProfileStats />);

      expect(screen.getByText('Nenhum jogo recente')).toBeInTheDocument();
    });

    it('should display recent games when available', () => {
      const mockRecentGames = [
        {
          id: 'game-1',
          opponent: 'Player2',
          result: 'win' as const,
          faction: 'roda-de-ginga' as const,
          opponentFaction: 'motofrete-uniao' as const,
          duration: 300,
          date: new Date('2024-01-01')
        }
      ];

      const mockGetRecentGames = vi.fn(() => mockRecentGames);
      vi.mocked(useProfileModule.useProfile).mockReturnValue({
        ...defaultMockReturn,
        getRecentGames: mockGetRecentGames
      });

      render(<ProfileStats />);

      expect(screen.getByText('Player2')).toBeInTheDocument();
      expect(screen.getByText('Vitória')).toBeInTheDocument();
      // Verificar se há pelo menos uma ocorrência de "Roda de Ginga" no documento
      expect(screen.getAllByText(/Roda de Ginga/).length).toBeGreaterThan(0);
    });
  });

  describe('Estados de Loading e Erro', () => {
    it('should show loading state', () => {
      vi.mocked(useProfileModule.useProfile).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true
      });

      render(<ProfileStats />);

      expect(screen.getByText('Carregando perfil...')).toBeInTheDocument();
    });

    it('should show error message', () => {
      vi.mocked(useProfileModule.useProfile).mockReturnValue({
        ...defaultMockReturn,
        error: 'Erro ao carregar perfil'
      });

      render(<ProfileStats />);

      expect(screen.getByText('Erro ao carregar perfil')).toBeInTheDocument();
    });
  });

  describe('Ações do Perfil', () => {
    it('should call reset profile when reset button is clicked', () => {
      const mockResetProfile = vi.fn();
      vi.mocked(useProfileModule.useProfile).mockReturnValue({
        ...defaultMockReturn,
        resetProfile: mockResetProfile
      });

      render(<ProfileStats />);

      const resetButton = screen.getByText('Resetar Perfil');
      fireEvent.click(resetButton);

      // O botão abre o modal, então precisamos clicar no botão de confirmação
      const confirmButton = screen.getByText('Confirmar Reset');
      fireEvent.click(confirmButton);

      expect(mockResetProfile).toHaveBeenCalled();
    });

    it('should show confirmation dialog for reset', () => {
      render(<ProfileStats />);

      const resetButton = screen.getByText('Resetar Perfil');
      fireEvent.click(resetButton);

      expect(screen.getByText('Tem certeza?')).toBeInTheDocument();
      expect(screen.getByText(/Esta ação não pode ser desfeita/)).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('should render on mobile devices', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      render(<ProfileStats />);

      expect(screen.getByText('Perfil do Jogador')).toBeInTheDocument();
      expect(screen.getByText('TestPlayer')).toBeInTheDocument();
    });

    it('should render on desktop devices', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920
      });

      render(<ProfileStats />);

      expect(screen.getByText('Perfil do Jogador')).toBeInTheDocument();
      expect(screen.getByText('TestPlayer')).toBeInTheDocument();
    });
  });
});
