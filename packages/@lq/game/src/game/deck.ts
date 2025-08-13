import { Card } from '@lq/shared';

/**
 * Sistema de embaralhamento de deck para Liga da Quebrada
 * Implementa algoritmos de embaralhamento testáveis e verificáveis
 */

export interface DeckShuffleResult {
  originalDeck: Card[];
  shuffledDeck: Card[];
  shuffleSeed?: number;
  shuffleAlgorithm: 'fisher-yates' | 'knuth' | 'custom';
}

/**
 * Embaralha um deck usando o algoritmo Fisher-Yates
 * @param deck - Deck original
 * @param seed - Semente opcional para embaralhamento determinístico
 * @returns Deck embaralhado
 */
export function shuffleDeck(deck: Card[], seed?: number): Card[] {
  const shuffled = [...deck];
  
  // Se uma semente foi fornecida, usa um gerador determinístico
  const random = seed !== undefined ? createSeededRandom(seed) : Math.random;
  
  // Algoritmo Fisher-Yates
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Embaralha um deck com resultado detalhado para testes
 * @param deck - Deck original
 * @param algorithm - Algoritmo de embaralhamento
 * @param seed - Semente opcional
 * @returns Resultado detalhado do embaralhamento
 */
export function shuffleDeckWithDetails(
  deck: Card[], 
  algorithm: 'fisher-yates' | 'knuth' | 'custom' = 'fisher-yates',
  seed?: number
): DeckShuffleResult {
  const originalDeck = [...deck];
  let shuffledDeck: Card[];
  
  switch (algorithm) {
    case 'fisher-yates':
      shuffledDeck = shuffleDeck(deck, seed);
      break;
    case 'knuth':
      shuffledDeck = shuffleDeckKnuth(deck, seed);
      break;
    case 'custom':
      shuffledDeck = shuffleDeckCustom(deck, seed);
      break;
    default:
      shuffledDeck = shuffleDeck(deck, seed);
  }
  
  return {
    originalDeck,
    shuffledDeck,
    shuffleSeed: seed,
    shuffleAlgorithm: algorithm
  };
}

/**
 * Algoritmo de embaralhamento Knuth
 * @param deck - Deck original
 * @param seed - Semente opcional
 * @returns Deck embaralhado
 */
function shuffleDeckKnuth(deck: Card[], seed?: number): Card[] {
  const shuffled = [...deck];
  const random = seed !== undefined ? createSeededRandom(seed) : Math.random;
  
  for (let i = 0; i < shuffled.length - 1; i++) {
    const j = i + Math.floor(random() * (shuffled.length - i));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Algoritmo de embaralhamento customizado para Liga da Quebrada
 * Considera o poder das cartas para balanceamento
 * @param deck - Deck original
 * @param seed - Semente opcional
 * @returns Deck embaralhado
 */
function shuffleDeckCustom(deck: Card[], seed?: number): Card[] {
  const shuffled = [...deck];
  
  // Separa cartas por poder
  const lowPower = shuffled.filter(card => card.power <= 3);
  const highPower = shuffled.filter(card => card.power > 3);
  
  // Embaralha cada grupo separadamente
  const shuffledLow = shuffleDeck(lowPower, seed);
  const shuffledHigh = shuffleDeck(highPower, seed ? seed + 1 : undefined);
  
  // Intercala os grupos para distribuição balanceada
  const result: Card[] = [];
  const maxLength = Math.max(shuffledLow.length, shuffledHigh.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < shuffledLow.length) {
      result.push(shuffledLow[i]);
    }
    if (i < shuffledHigh.length) {
      result.push(shuffledHigh[i]);
    }
  }
  
  return result;
}

/**
 * Cria um gerador de números aleatórios com semente
 * @param seed - Semente para o gerador
 * @returns Função de random com semente
 */
function createSeededRandom(seed: number): () => number {
  // Converte seed negativo para positivo
  let currentSeed = Math.abs(seed);
  
  return () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
}

/**
 * Verifica se um deck foi embaralhado corretamente
 * @param original - Deck original
 * @param shuffled - Deck embaralhado
 * @returns true se o embaralhamento é válido
 */
export function validateShuffle(original: Card[], shuffled: Card[]): boolean {
  // Verifica se tem o mesmo número de cartas
  if (original.length !== shuffled.length) {
    return false;
  }
  
  // Verifica se todas as cartas estão presentes
  const originalIds = original.map(card => card.id).sort();
  const shuffledIds = shuffled.map(card => card.id).sort();
  
  return JSON.stringify(originalIds) === JSON.stringify(shuffledIds);
}

/**
 * Calcula a entropia do embaralhamento (quão "aleatório" está)
 * @param original - Deck original
 * @param shuffled - Deck embaralhado
 * @returns Valor entre 0 e 1 (1 = totalmente aleatório)
 */
export function calculateShuffleEntropy(original: Card[], shuffled: Card[]): number {
  if (original.length !== shuffled.length) {
    return 0;
  }
  
  let inversions = 0;
  const totalPossibleInversions = (original.length * (original.length - 1)) / 2;
  
  // Conta inversões (cartas que mudaram de posição relativa)
  for (let i = 0; i < original.length; i++) {
    const originalIndex = original.findIndex(card => card.id === shuffled[i].id);
    for (let j = i + 1; j < shuffled.length; j++) {
      const shuffledIndex = original.findIndex(card => card.id === shuffled[j].id);
      if (originalIndex > shuffledIndex) {
        inversions++;
      }
    }
  }
  
  return inversions / totalPossibleInversions;
}
