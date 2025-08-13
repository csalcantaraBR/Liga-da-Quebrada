import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProfile } from '../../hooks/useProfile';
import { Profile, GameResult } from '../../game/types';

// Mock do localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('useProfile Hook', () => {
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



  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Estado Inicial', () => {
    it('should start with default profile', () => {
      const { result } = renderHook(() => useProfile());

      expect(result.current.profile).toEqual({
        id: expect.any(String),
        username: 'Jogador',
        level: 1,
        xp: 0,
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        rank: 'Bronze',
        achievements: [],
        favoriteFaction: null,
        createdAt: expect.any(Date),
        lastActive: expect.any(Date)
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should load profile from localStorage if exists', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockProfile));

      const { result } = renderHook(() => useProfile());

      expect(result.current.profile).toEqual(mockProfile);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('liga-da-quebrada-profile');
    });
  });

  describe('Gerenciamento de Perfil', () => {
    it('should update username', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.updateUsername('NovoJogador');
      });

      expect(result.current.profile.username).toBe('NovoJogador');
    });

    it('should update favorite faction', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.updateFavoriteFaction('motofrete-uniao');
      });

      expect(result.current.profile.favoriteFaction).toBe('motofrete-uniao');
    });

    it('should save profile to localStorage', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.updateUsername('TestPlayer');
      });

      act(() => {
        result.current.saveProfile();
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'liga-da-quebrada-profile',
        expect.stringContaining('TestPlayer')
      );
    });
  });

  describe('Sistema de XP e Nível', () => {
    it('should add XP and level up', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.addXP(1000);
      });

      expect(result.current.profile.xp).toBe(1000);
      expect(result.current.profile.level).toBe(2);
    });

    it('should calculate correct level based on XP', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.addXP(5000);
      });

      expect(result.current.profile.level).toBe(6); // 5000 XP = nível 6 (5000/1000 + 1)
    });

    it('should calculate XP needed for next level', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.addXP(500);
      });

      const xpNeeded = result.current.getXPNeededForNextLevel();
      expect(xpNeeded).toBe(500); // 1000 - 500 = 500
    });

    it('should calculate level progress percentage', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.addXP(500);
      });

      const progress = result.current.getLevelProgress();
      expect(progress).toBe(50); // 500/1000 = 50%
    });
  });

  describe('Sistema de Ranking', () => {
    it('should calculate rank based on level', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.addXP(3000);
      });

      expect(result.current.profile.rank).toBe('Prata');
    });

    it('should update rank when level changes', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.addXP(1000); // Level 2
      });

      expect(result.current.profile.rank).toBe('Bronze');

      act(() => {
        result.current.addXP(2000); // Level 3
      });

      expect(result.current.profile.rank).toBe('Prata');
    });

    it('should get rank requirements', () => {
      const { result } = renderHook(() => useProfile());

      const requirements = result.current.getRankRequirements();
      expect(requirements).toEqual({
        current: 'Bronze',
        next: 'Prata',
        levelNeeded: 3
      });
    });
  });

  describe('Estatísticas de Jogo', () => {
    it('should record game result (win)', () => {
      const { result } = renderHook(() => useProfile());

      const gameResult: GameResult = {
        id: 'game-1',
        opponent: 'Player2',
        result: 'win',
        faction: 'roda-de-ginga',
        opponentFaction: 'motofrete-uniao',
        duration: 300,
        date: new Date()
      };

      act(() => {
        result.current.recordGameResult(gameResult);
      });

      expect(result.current.profile.totalGames).toBe(1);
      expect(result.current.profile.wins).toBe(1);
      expect(result.current.profile.winRate).toBe(100);
    });

    it('should record game result (loss)', () => {
      const { result } = renderHook(() => useProfile());

      const gameResult: GameResult = {
        id: 'game-1',
        opponent: 'Player2',
        result: 'loss',
        faction: 'roda-de-ginga',
        opponentFaction: 'motofrete-uniao',
        duration: 300,
        date: new Date()
      };

      act(() => {
        result.current.recordGameResult(gameResult);
      });

      expect(result.current.profile.totalGames).toBe(1);
      expect(result.current.profile.losses).toBe(1);
      expect(result.current.profile.winRate).toBe(0);
    });

    it('should calculate win rate correctly', () => {
      const { result } = renderHook(() => useProfile());

      // Simular 10 jogos: 6 vitórias, 3 derrotas, 1 empate
      const results: GameResult[] = [
        ...Array(6).fill({ result: 'win' }),
        ...Array(3).fill({ result: 'loss' }),
        ...Array(1).fill({ result: 'draw' })
      ].map((r, i) => ({
        id: `game-${i}`,
        opponent: `Player${i}`,
        result: r.result as 'win' | 'loss' | 'draw',
        faction: 'roda-de-ginga',
        opponentFaction: 'motofrete-uniao',
        duration: 300,
        date: new Date()
      }));

      act(() => {
        results.forEach(gameResult => {
          result.current.recordGameResult(gameResult);
        });
      });

      expect(result.current.profile.totalGames).toBe(10);
      expect(result.current.profile.wins).toBe(6);
      expect(result.current.profile.losses).toBe(3);
      expect(result.current.profile.draws).toBe(1);
      expect(result.current.profile.winRate).toBe(60);
    });
  });

  describe('Sistema de Conquistas', () => {
    it('should unlock achievement', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.unlockAchievement('first-win', 'Primeira Vitória', 'Ganhe sua primeira partida', '🏆', 'combat');
      });

      expect(result.current.profile.achievements).toHaveLength(1);
      expect(result.current.profile.achievements[0].id).toBe('first-win');
      expect(result.current.profile.achievements[0].name).toBe('Primeira Vitória');
    });

    it('should not unlock duplicate achievement', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.unlockAchievement('first-win', 'Primeira Vitória', 'Ganhe sua primeira partida', '🏆', 'combat');
        result.current.unlockAchievement('first-win', 'Primeira Vitória', 'Ganhe sua primeira partida', '🏆', 'combat');
      });

      expect(result.current.profile.achievements).toHaveLength(1);
    });

    it('should get achievements by category', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.unlockAchievement('first-win', 'Primeira Vitória', 'Ganhe sua primeira partida', '🏆', 'combat');
        result.current.unlockAchievement('level-5', 'Nível 5', 'Alcance o nível 5', '⭐', 'progression');
      });

      const combatAchievements = result.current.getAchievementsByCategory('combat');
      expect(combatAchievements).toHaveLength(1);
      expect(combatAchievements[0].id).toBe('first-win');
    });

    it('should calculate achievement progress', () => {
      const { result } = renderHook(() => useProfile());

      const progress = result.current.getAchievementProgress();
      expect(progress).toEqual({
        total: 20,
        unlocked: 0,
        percentage: 0
      });

      act(() => {
        result.current.unlockAchievement('first-win', 'Primeira Vitória', 'Ganhe sua primeira partida', '🏆', 'combat');
      });

      const newProgress = result.current.getAchievementProgress();
      expect(newProgress.unlocked).toBe(1);
    });
  });

  describe('Estatísticas Detalhadas', () => {
    it('should get faction statistics', () => {
      const { result } = renderHook(() => useProfile());

      const gameResults: GameResult[] = [
        { id: 'game-1', opponent: 'Player2', result: 'win', faction: 'roda-de-ginga', opponentFaction: 'motofrete-uniao', duration: 300, date: new Date() },
        { id: 'game-2', opponent: 'Player3', result: 'win', faction: 'roda-de-ginga', opponentFaction: 'crew-do-graffiti', duration: 400, date: new Date() },
        { id: 'game-3', opponent: 'Player4', result: 'loss', faction: 'motofrete-uniao', opponentFaction: 'roda-de-ginga', duration: 350, date: new Date() }
      ];

      act(() => {
        gameResults.forEach(gameResult => {
          result.current.recordGameResult(gameResult);
        });
      });

      const factionStats = result.current.getFactionStatistics();
      expect(factionStats['roda-de-ginga'].games).toBe(2);
      expect(factionStats['roda-de-ginga'].wins).toBe(2);
      expect(factionStats['roda-de-ginga'].winRate).toBe(100);
      expect(factionStats['motofrete-uniao'].games).toBe(1);
      expect(factionStats['motofrete-uniao'].wins).toBe(0);
    });

    it('should get recent games', () => {
      const { result } = renderHook(() => useProfile());

      const gameResults: GameResult[] = [
        { id: 'game-1', opponent: 'Player2', result: 'win', faction: 'roda-de-ginga', opponentFaction: 'motofrete-uniao', duration: 300, date: new Date('2024-01-01') },
        { id: 'game-2', opponent: 'Player3', result: 'loss', faction: 'roda-de-ginga', opponentFaction: 'crew-do-graffiti', duration: 400, date: new Date('2024-01-02') },
        { id: 'game-3', opponent: 'Player4', result: 'win', faction: 'motofrete-uniao', opponentFaction: 'roda-de-ginga', duration: 350, date: new Date('2024-01-03') }
      ];

      act(() => {
        gameResults.forEach(gameResult => {
          result.current.recordGameResult(gameResult);
        });
      });

      const recentGames = result.current.getRecentGames(2);
      expect(recentGames).toHaveLength(2);
      expect(recentGames[0].id).toBe('game-3'); // Mais recente primeiro
      expect(recentGames[1].id).toBe('game-2');
    });
  });

  describe('Limpeza e Reset', () => {
    it('should reset profile to default', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.updateUsername('TestPlayer');
        result.current.addXP(1000);
      });

      expect(result.current.profile.username).toBe('TestPlayer');
      expect(result.current.profile.level).toBe(2);

      act(() => {
        result.current.resetProfile();
      });

      expect(result.current.profile.username).toBe('Jogador');
      expect(result.current.profile.level).toBe(1);
      expect(result.current.profile.xp).toBe(0);
    });

    it('should clear localStorage on reset', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.resetProfile();
      });

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('liga-da-quebrada-profile');
    });
  });
});
