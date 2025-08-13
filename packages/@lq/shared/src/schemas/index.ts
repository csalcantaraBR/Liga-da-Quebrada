import { z } from 'zod';

export const FactionSchema = z.enum([
  'RODA_DE_GINGA',
  'MOTOFRETE_UNIAO', 
  'CREW_DO_GRAFFITI',
  'BATERIA_CENTRAL',
  'GUARDIOES_DO_VERDE',
  'VAQUEIROS_DO_SERTAO'
]);

export const EffectSchema = z.object({
  name: z.string(),
  params: z.record(z.any()).optional()
});

export const CardSchema = z.object({
  id: z.string(),
  name: z.string(),
  faction: FactionSchema,
  power: z.number().int().min(1).max(10),
  damage: z.number().int().min(1).max(10),
  text: z.string(),
  keywords: z.array(z.string()),
  onWin: z.array(EffectSchema).optional(),
  onLose: z.array(EffectSchema).optional(),
  onEnter: z.array(EffectSchema).optional()
});

export const ActiveEffectSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration: z.number().int().min(0),
  params: z.record(z.any()).optional()
});

export const PlayerStateSchema = z.object({
  respect: z.number().int().min(0).max(12),
  energy: z.number().int().min(0).max(12),
  hand: z.array(CardSchema),
  effects: z.array(ActiveEffectSchema)
});

export const RoundResultSchema = z.object({
  winner: z.enum(['player1', 'player2', 'tie']),
  player1Attack: z.number().int().min(0),
  player2Attack: z.number().int().min(0),
  damage: z.number().int().min(0),
  effects: z.array(z.string())
});

export const GameStateSchema = z.object({
  round: z.number().int().min(1).max(4),
  player1: PlayerStateSchema,
  player2: PlayerStateSchema,
  roundHistory: z.array(RoundResultSchema)
});
