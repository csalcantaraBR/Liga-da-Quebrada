import { Card, Faction } from './types';

// Cartas mock para teste
export const MOCK_CARDS: Card[] = [
  // Roda de Ginga
  {
    id: 'ginga-1',
    name: 'Capoeirista',
    faction: 'roda-de-ginga',
    power: 3,
    energy: 2,
    effects: [
      { name: 'damage', params: { target: 'opponent', value: 2 } }
    ],
    keywords: ['esquiva', 'contra-ataque']
  },
  {
    id: 'ginga-2',
    name: 'Mestre Bimba',
    faction: 'roda-de-ginga',
    power: 5,
    energy: 3,
    effects: [
      { name: 'damage', params: { target: 'opponent', value: 3 } },
      { name: 'heal', params: { target: 'self', value: 1 } }
    ],
    keywords: ['esquiva', 'contra-ataque', 'mestre']
  },

  // Motofrete União
  {
    id: 'moto-1',
    name: 'Motoboy',
    faction: 'motofrete-uniao',
    power: 2,
    energy: 1,
    effects: [
      { name: 'energy', params: { target: 'self', value: 1 } }
    ],
    keywords: ['velocidade', 'entrega']
  },
  {
    id: 'moto-2',
    name: 'Piloto Elite',
    faction: 'motofrete-uniao',
    power: 4,
    energy: 2,
    effects: [
      { name: 'damage', params: { target: 'opponent', value: 2 } },
      { name: 'energy', params: { target: 'self', value: 2 } }
    ],
    keywords: ['velocidade', 'piloto']
  },

  // Crew do Graffiti
  {
    id: 'graffiti-1',
    name: 'Artista de Rua',
    faction: 'crew-do-graffiti',
    power: 2,
    energy: 2,
    effects: [
      { name: 'draw', params: { target: 'self', value: 1 } }
    ],
    keywords: ['arte', 'criatividade']
  },
  {
    id: 'graffiti-2',
    name: 'Tag Master',
    faction: 'crew-do-graffiti',
    power: 3,
    energy: 3,
    effects: [
      { name: 'damage', params: { target: 'opponent', value: 2 } },
      { name: 'draw', params: { target: 'self', value: 1 } }
    ],
    keywords: ['arte', 'tag', 'master']
  },

  // Bateria Central
  {
    id: 'bateria-1',
    name: 'Baterista',
    faction: 'bateria-central',
    power: 3,
    energy: 2,
    effects: [
      { name: 'damage', params: { target: 'opponent', value: 1 } },
      { name: 'energy', params: { target: 'self', value: 1 } }
    ],
    keywords: ['ritmo', 'bateria']
  },
  {
    id: 'bateria-2',
    name: 'Mestre de Bateria',
    faction: 'bateria-central',
    power: 5,
    energy: 4,
    effects: [
      { name: 'damage', params: { target: 'opponent', value: 3 } },
      { name: 'energy', params: { target: 'self', value: 2 } }
    ],
    keywords: ['ritmo', 'mestre', 'combo']
  },

  // Guardiões do Verde
  {
    id: 'verde-1',
    name: 'Guardião',
    faction: 'guardioes-do-verde',
    power: 2,
    energy: 2,
    effects: [
      { name: 'heal', params: { target: 'self', value: 2 } }
    ],
    keywords: ['proteção', 'cura']
  },
  {
    id: 'verde-2',
    name: 'Mestre Verde',
    faction: 'guardioes-do-verde',
    power: 4,
    energy: 3,
    effects: [
      { name: 'heal', params: { target: 'self', value: 3 } },
      { name: 'damage', params: { target: 'opponent', value: 1 } }
    ],
    keywords: ['proteção', 'cura', 'mestre']
  },

  // Vaqueiros do Sertão
  {
    id: 'sertao-1',
    name: 'Vaqueiro',
    faction: 'vaqueiros-do-sertao',
    power: 3,
    energy: 2,
    effects: [
      { name: 'damage', params: { target: 'opponent', value: 2 } }
    ],
    keywords: ['resistência', 'imunidade']
  },
  {
    id: 'sertao-2',
    name: 'Mestre Vaqueiro',
    faction: 'vaqueiros-do-sertao',
    power: 6,
    energy: 4,
    effects: [
      { name: 'damage', params: { target: 'opponent', value: 4 } },
      { name: 'heal', params: { target: 'self', value: 2 } }
    ],
    keywords: ['resistência', 'imunidade', 'mestre']
  }
];

// Gerar deck aleatório
export function generateRandomDeck(faction: Faction, size: number = 8): Card[] {
  const factionCards = MOCK_CARDS.filter(card => card.faction === faction);
  const shuffled = [...factionCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(size, shuffled.length));
}

// Gerar deck balanceado
export function generateBalancedDeck(faction: Faction): Card[] {
  const factionCards = MOCK_CARDS.filter(card => card.faction === faction);
  
  // Se não há cartas suficientes, duplica as existentes
  if (factionCards.length < 8) {
    const deck: Card[] = [];
    while (deck.length < 8) {
      deck.push(...factionCards);
    }
    return deck.slice(0, 8);
  }
  
  // Seleciona cartas de diferentes custos
  const lowCost = factionCards.filter(card => card.energy <= 2);
  const highCost = factionCards.filter(card => card.energy > 2);
  
  const deck: Card[] = [];
  
  // Adiciona 4 cartas de baixo custo
  for (let i = 0; i < 4 && i < lowCost.length; i++) {
    deck.push(lowCost[i]);
  }
  
  // Adiciona 4 cartas de alto custo
  for (let i = 0; i < 4 && i < highCost.length; i++) {
    deck.push(highCost[i]);
  }
  
  // Se ainda não tem 8 cartas, adiciona mais cartas aleatórias
  while (deck.length < 8 && factionCards.length > 0) {
    const randomCard = factionCards[Math.floor(Math.random() * factionCards.length)];
    if (!deck.find(card => card.id === randomCard.id)) {
      deck.push(randomCard);
    }
  }
  
  // Embaralha o deck
  return deck.sort(() => Math.random() - 0.5);
}

// Obter cartas por facção
export function getCardsByFaction(faction: Faction): Card[] {
  return MOCK_CARDS.filter(card => card.faction === faction);
}

// Obter carta por ID
export function getCardById(id: string): Card | undefined {
  return MOCK_CARDS.find(card => card.id === id);
}

// Obter todas as facções disponíveis
export function getAvailableFactions(): Faction[] {
  return Array.from(new Set(MOCK_CARDS.map(card => card.faction)));
}

// Validar deck
export function validateDeck(deck: Card[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Verifica tamanho
  if (deck.length !== 8) {
    errors.push('O deck deve ter exatamente 8 cartas');
  }
  
  // Verifica facções únicas
  const factions = deck.map(card => card.faction);
  const uniqueFactions = new Set(factions);
  if (uniqueFactions.size !== 1) {
    errors.push('Todas as cartas devem ser da mesma facção');
  }
  
  // Verifica cartas duplicadas
  const cardIds = deck.map(card => card.id);
  const uniqueIds = new Set(cardIds);
  if (uniqueIds.size !== deck.length) {
    errors.push('Não são permitidas cartas duplicadas');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Calcular estatísticas do deck
export function calculateDeckStats(deck: Card[]): {
  totalPower: number;
  totalEnergy: number;
  averagePower: number;
  averageEnergy: number;
  faction: Faction | null;
} {
  if (deck.length === 0) {
    return {
      totalPower: 0,
      totalEnergy: 0,
      averagePower: 0,
      averageEnergy: 0,
      faction: null
    };
  }
  
  const totalPower = deck.reduce((sum, card) => sum + card.power, 0);
  const totalEnergy = deck.reduce((sum, card) => sum + card.energy, 0);
  const faction = deck[0]?.faction || null;
  
  return {
    totalPower,
    totalEnergy,
    averagePower: totalPower / deck.length,
    averageEnergy: totalEnergy / deck.length,
    faction
  };
}
