export interface Player {
  sessionId: string;
  userId: string;
  username: string;
  faction: string;
  status: 'waiting' | 'ready' | 'in-game';
  joinedAt: Date;
}

export interface MatchmakingState {
  players: Player[];
  status: 'waiting' | 'matching' | 'matched' | 'cancelled';
  gameRoomId?: string;
  createdAt: Date;
  maxPlayers: number;
}

export interface GameState {
  round: number;
  maxRounds: number;
  status: 'preparing' | 'playing' | 'finished';
  players: GamePlayer[];
  currentTurn: string;
  roundHistory: RoundResult[];
  winner?: string;
  createdAt: Date;
}

export interface GamePlayer {
  sessionId: string;
  userId: string;
  username: string;
  faction: string;
  respect: number;
  energy: number;
  hand: string[];
  effects: string[];
  isReady: boolean;
}

export interface RoundResult {
  round: number;
  player1Action: string;
  player2Action: string;
  player1Damage: number;
  player2Damage: number;
  winner?: string;
}

export interface GameMessage {
  type: 'ready' | 'cancel' | 'play-card' | 'end-turn' | 'concede';
  data?: any;
}

export interface MatchmakingMessage {
  type: 'ready' | 'cancel' | 'find-match';
  data?: any;
}
