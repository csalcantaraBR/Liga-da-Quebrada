export type Faction = 
  | 'RODA_DE_GINGA'
  | 'MOTOFRETE_UNIAO'
  | 'CREW_DO_GRAFFITI'
  | 'BATERIA_CENTRAL'
  | 'GUARDIOES_DO_VERDE'
  | 'VAQUEIROS_DO_SERTAO';

export type Card = {
  id: string;
  name: string;
  faction: Faction;
  power: number;
  damage: number;
  text: string;
  keywords: string[];
  onWin?: Effect[];
  onLose?: Effect[];
  onEnter?: Effect[];
};

export type Effect = {
  name: string;
  params?: Record<string, any>;
};

export type PlayerState = {
  respect: number;
  energy: number;
  hand: Card[];
  effects: ActiveEffect[];
};

export type ActiveEffect = {
  id: string;
  name: string;
  duration: number; // rodadas restantes
  params?: Record<string, any>;
};

export type RoundResult = {
  winner: 'player1' | 'player2' | 'tie';
  player1Attack: number;
  player2Attack: number;
  damage: number;
  effects: string[];
};

export type GameState = {
  round: number;
  player1: PlayerState;
  player2: PlayerState;
  roundHistory: RoundResult[];
};
