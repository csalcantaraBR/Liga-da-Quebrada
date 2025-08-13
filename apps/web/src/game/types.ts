// Tipos compartilhados do jogo
export type Faction = 'roda-de-ginga' | 'motofrete-uniao' | 'crew-do-graffiti' | 'bateria-central' | 'guardioes-do-verde' | 'vaqueiros-do-sertao';

export interface Effect {
  name: string;
  params?: Record<string, any>;
}

export interface Card {
  id: string;
  name: string;
  faction: Faction;
  power: number;
  energy: number;
  effects: Effect[];
  keywords: string[];
  image?: string;
}

export interface Player {
  id: string;
  name: string;
  deck: Card[];
  life: number;
  energy: number;
  hand: Card[];
  field: Card[];
}

export interface GameState {
  id: string;
  players: [Player, Player];
  currentRound: number;
  maxRounds: 4;
  currentTurn: 'player1' | 'player2';
  gamePhase: 'setup' | 'playing' | 'finished';
  winner?: 'player1' | 'player2' | 'draw';
  startTime: Date;
  lastActionTime: Date;
}

// Tipos de Matchmaking
export type MatchmakingStatus = 'idle' | 'searching' | 'matched' | 'connecting' | 'ready' | 'error';

export interface MatchmakingState {
  status: MatchmakingStatus;
  searchStartTime?: Date;
  searchDuration?: number;
  matchId?: string;
  opponent?: {
    id: string;
    name: string;
    rank: number;
  };
  error?: string;
}

export interface MatchmakingConfig {
  maxSearchTime: number; // em segundos
  retryAttempts: number;
  matchmakingTimeout: number; // em segundos
}

// Tipos de Deck
export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  faction: Faction;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeckValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Tipos de Perfil e Progressão
export interface Profile {
  id: string;
  username: string;
  level: number;
  xp: number;
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  rank: string;
  achievements: Achievement[];
  favoriteFaction: Faction | null;
  createdAt: Date;
  lastActive: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'combat' | 'progression' | 'collection' | 'social';
}

export interface GameResult {
  id: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  faction: Faction;
  opponentFaction: Faction;
  duration: number; // em segundos
  date: Date;
}

export interface FactionStats {
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface AchievementProgress {
  total: number;
  unlocked: number;
  percentage: number;
}

export interface RankRequirements {
  current: string;
  next: string;
  levelNeeded: number;
}

// Tipos legados para compatibilidade
export interface PlayerStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  rank: number;
  rankTitle: string;
  territoriesConquered: number;
  playTime: number; // em minutos
}

export interface PlayerProfile {
  id: string;
  name: string;
  level: number;
  title: string;
  stats: PlayerStats;
  achievements: Achievement[];
  currentDeck?: Deck;
  favoriteFaction?: Faction;
}

// Tipos de Eventos
export interface GameEvent {
  type: 'card_played' | 'turn_ended' | 'game_finished' | 'player_disconnected';
  playerId: string;
  timestamp: Date;
  data?: any;
}

export interface MatchmakingEvent {
  type: 'search_started' | 'opponent_found' | 'connection_established' | 'game_ready';
  timestamp: Date;
  data?: any;
}
