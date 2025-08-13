import { useState, useCallback, useEffect } from 'react';
import { Profile, Achievement, GameResult, Faction, FactionStats, AchievementProgress, RankRequirements } from '../game/types';

export interface UseProfileReturn {
  // Estado
  profile: Profile;
  isLoading: boolean;
  error: string | null;

  // Gerenciamento de Perfil
  updateUsername: (username: string) => void;
  updateFavoriteFaction: (faction: Faction) => void;
  saveProfile: () => void;

  // Sistema de XP e Nível
  addXP: (xp: number) => void;
  getXPNeededForNextLevel: () => number;
  getLevelProgress: () => number;

  // Sistema de Ranking
  getRankRequirements: () => RankRequirements;

  // Estatísticas de Jogo
  recordGameResult: (result: GameResult) => void;

  // Sistema de Conquistas
  unlockAchievement: (id: string, name: string, description: string, icon: string, category: Achievement['category']) => void;
  getAchievementsByCategory: (category: Achievement['category']) => Achievement[];
  getAchievementProgress: () => AchievementProgress;

  // Estatísticas Detalhadas
  getFactionStatistics: () => Record<Faction, FactionStats>;
  getRecentGames: (limit?: number) => GameResult[];

  // Limpeza e Reset
  resetProfile: () => void;
}

const STORAGE_KEY = 'liga-da-quebrada-profile';
const XP_PER_LEVEL = 1000; // XP necessário para cada nível

const RANK_LEVELS = {
  'Bronze': 1,
  'Prata': 3,
  'Ouro': 5,
  'Platina': 8,
  'Diamante': 12,
  'Mestre': 15
};

const RANK_NAMES = ['Bronze', 'Prata', 'Ouro', 'Platina', 'Diamante', 'Mestre'];

function createDefaultProfile(): Profile {
  return {
    id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    createdAt: new Date(),
    lastActive: new Date()
  };
}

function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function calculateRank(level: number): string {
  if (level >= 15) return 'Mestre';
  if (level >= 12) return 'Diamante';
  if (level >= 8) return 'Platina';
  if (level >= 5) return 'Ouro';
  if (level >= 3) return 'Prata';
  return 'Bronze';
}

function calculateWinRate(wins: number, totalGames: number): number {
  if (totalGames === 0) return 0;
  return Math.round((wins / totalGames) * 100);
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile>(createDefaultProfile());
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Verificar se estamos no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Carregar perfil do localStorage na inicialização
  useEffect(() => {
    if (!isClient) return;
    
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedProfile = localStorage.getItem(STORAGE_KEY);
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          // Converter strings de data de volta para objetos Date
          parsedProfile.createdAt = new Date(parsedProfile.createdAt);
          parsedProfile.lastActive = new Date(parsedProfile.lastActive);
          parsedProfile.achievements = parsedProfile.achievements.map((achievement: any) => ({
            ...achievement,
            unlockedAt: new Date(achievement.unlockedAt)
          }));
          setProfile(parsedProfile);
        }
      }
    } catch (err) {
      setError('Erro ao carregar perfil');
    }
  }, [isClient]);

  // Limpar erro após 3 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const saveProfile = useCallback(() => {
    if (!isClient) return;
    
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const profileToSave = {
          ...profile,
          lastActive: new Date()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profileToSave));
        setError(null);
      }
    } catch (err) {
      setError('Erro ao salvar perfil');
    }
  }, [profile, isClient]);

  const updateUsername = useCallback((username: string) => {
    if (!username.trim()) {
      setError('Nome de usuário não pode estar vazio');
      return;
    }

    setProfile(prev => ({
      ...prev,
      username: username.trim()
    }));
  }, []);

  const updateFavoriteFaction = useCallback((faction: Faction) => {
    setProfile(prev => ({
      ...prev,
      favoriteFaction: faction
    }));
  }, []);

  const addXP = useCallback((xp: number) => {
    if (xp <= 0) return;

    setProfile(prev => {
      const newXP = prev.xp + xp;
      const newLevel = calculateLevel(newXP);
      const newRank = calculateRank(newLevel);

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        rank: newRank
      };
    });
  }, []);

  const getXPNeededForNextLevel = useCallback(() => {
    const nextLevelXP = profile.level * XP_PER_LEVEL;
    return nextLevelXP - profile.xp;
  }, [profile.level, profile.xp]);

  const getLevelProgress = useCallback(() => {
    const currentLevelXP = (profile.level - 1) * XP_PER_LEVEL;
    const nextLevelXP = profile.level * XP_PER_LEVEL;
    const currentLevelProgress = profile.xp - currentLevelXP;
    const levelRange = nextLevelXP - currentLevelXP;
    
    return Math.round((currentLevelProgress / levelRange) * 100);
  }, [profile.level, profile.xp]);

  const getRankRequirements = useCallback((): RankRequirements => {
    const currentRankIndex = RANK_NAMES.indexOf(profile.rank);
    const nextRank = currentRankIndex < RANK_NAMES.length - 1 ? RANK_NAMES[currentRankIndex + 1] : profile.rank;
    const levelNeeded = RANK_LEVELS[nextRank as keyof typeof RANK_LEVELS] || profile.level;

    return {
      current: profile.rank,
      next: nextRank,
      levelNeeded
    };
  }, [profile.rank, profile.level]);

  const recordGameResult = useCallback((result: GameResult) => {
    setGameHistory(prev => [...prev, result]);
    
    setProfile(prev => {
      const newTotalGames = prev.totalGames + 1;
      const newWins = prev.wins + (result.result === 'win' ? 1 : 0);
      const newLosses = prev.losses + (result.result === 'loss' ? 1 : 0);
      const newDraws = prev.draws + (result.result === 'draw' ? 1 : 0);
      const newWinRate = calculateWinRate(newWins, newTotalGames);

      // Adicionar XP baseado no resultado
      let xpGained = 0;
      switch (result.result) {
        case 'win':
          xpGained = 100;
          break;
        case 'loss':
          xpGained = 25;
          break;
        case 'draw':
          xpGained = 50;
          break;
      }

      const newXP = prev.xp + xpGained;
      const newLevel = calculateLevel(newXP);
      const newRank = calculateRank(newLevel);

      return {
        ...prev,
        totalGames: newTotalGames,
        wins: newWins,
        losses: newLosses,
        draws: newDraws,
        winRate: newWinRate,
        xp: newXP,
        level: newLevel,
        rank: newRank
      };
    });
  }, []);

  const unlockAchievement = useCallback((
    id: string,
    name: string,
    description: string,
    icon: string,
    category: Achievement['category']
  ) => {
    setProfile(prev => {
      // Verificar se a conquista já foi desbloqueada
      if (prev.achievements.some(achievement => achievement.id === id)) {
        return prev;
      }

      const newAchievement: Achievement = {
        id,
        name,
        description,
        icon,
        unlockedAt: new Date(),
        category
      };

      return {
        ...prev,
        achievements: [...prev.achievements, newAchievement]
      };
    });
  }, []);

  const getAchievementsByCategory = useCallback((category: Achievement['category']) => {
    return profile.achievements.filter(achievement => achievement.category === category);
  }, [profile.achievements]);

  const getAchievementProgress = useCallback((): AchievementProgress => {
    // Por enquanto, vamos usar um número fixo de conquistas disponíveis
    const totalAchievements = 20; // Número total de conquistas no jogo
    const unlockedCount = profile.achievements.length;
    const percentage = Math.round((unlockedCount / totalAchievements) * 100);

    return {
      total: totalAchievements,
      unlocked: unlockedCount,
      percentage
    };
  }, [profile.achievements]);

  const getFactionStatistics = useCallback((): Record<Faction, FactionStats> => {
    const factions: Faction[] = [
      'roda-de-ginga',
      'motofrete-uniao',
      'crew-do-graffiti',
      'bateria-central',
      'guardioes-do-verde',
      'vaqueiros-do-sertao'
    ];

    return factions.reduce((acc, faction) => {
      const factionGames = gameHistory.filter(game => game.faction === faction);
      const wins = factionGames.filter(game => game.result === 'win').length;
      const losses = factionGames.filter(game => game.result === 'loss').length;
      const draws = factionGames.filter(game => game.result === 'draw').length;
      const games = factionGames.length;
      const winRate = games > 0 ? Math.round((wins / games) * 100) : 0;

      acc[faction] = {
        games,
        wins,
        losses,
        draws,
        winRate
      };
      return acc;
    }, {} as Record<Faction, FactionStats>);
  }, [gameHistory]);

  const getRecentGames = useCallback((limit: number = 10): GameResult[] => {
    return gameHistory
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [gameHistory]);

  const resetProfile = useCallback(() => {
    const defaultProfile = createDefaultProfile();
    setProfile(defaultProfile);
    setError(null);
    
    if (!isClient) return;
    
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      setError('Erro ao resetar perfil');
    }
  }, [isClient]);

  return {
    // Estado
    profile,
    isLoading,
    error,

    // Gerenciamento de Perfil
    updateUsername,
    updateFavoriteFaction,
    saveProfile,

    // Sistema de XP e Nível
    addXP,
    getXPNeededForNextLevel,
    getLevelProgress,

    // Sistema de Ranking
    getRankRequirements,

    // Estatísticas de Jogo
    recordGameResult,

    // Sistema de Conquistas
    unlockAchievement,
    getAchievementsByCategory,
    getAchievementProgress,

    // Estatísticas Detalhadas
    getFactionStatistics,
    getRecentGames,

    // Limpeza e Reset
    resetProfile
  };
}
