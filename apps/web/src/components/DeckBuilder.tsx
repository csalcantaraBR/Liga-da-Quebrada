import React from 'react';
import { useDeck } from '../hooks/useDeck';
import { Card, Faction } from '../game/types';

interface DeckBuilderProps {
  className?: string;
}

const FACTION_NAMES: Record<Faction, string> = {
  'roda-de-ginga': 'Roda de Ginga',
  'motofrete-uniao': 'Motofrete União',
  'crew-do-graffiti': 'Crew do Graffiti',
  'bateria-central': 'Bateria Central',
  'guardioes-do-verde': 'Guardioes do Verde',
  'vaqueiros-do-sertao': 'Vaqueiros do Sertão'
};

const FACTION_COLORS: Record<Faction, string> = {
  'roda-de-ginga': 'bg-yellow-600 hover:bg-yellow-700',
  'motofrete-uniao': 'bg-blue-600 hover:bg-blue-700',
  'crew-do-graffiti': 'bg-purple-600 hover:bg-purple-700',
  'bateria-central': 'bg-red-600 hover:bg-red-700',
  'guardioes-do-verde': 'bg-green-600 hover:bg-green-700',
  'vaqueiros-do-sertao': 'bg-orange-600 hover:bg-orange-700'
};

export function DeckBuilder({ className = '' }: DeckBuilderProps) {
  const {
    deck,
    selectedFaction,
    isLoading,
    error,
    availableFactions,
    selectFaction,
    clearFaction,
    addCard,
    removeCard,
    generateDeck,
    clearDeck,
    reset,
    validateDeck,
    getDeckStats,
    saveDeck,
    loadDeck
  } = useDeck();

  const validation = validateDeck();
  const stats = getDeckStats();

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      {/* Título */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Construtor de Deck</h1>
        <p className="text-gray-300">Monte seu deck de 8 cartas para dominar a quebrada!</p>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seção da Esquerda - Seleção de Facção e Estatísticas */}
        <div className="space-y-6">
          {/* Seleção de Facção */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Selecione sua Facção</h2>
            <div className="grid grid-cols-2 gap-3">
              {availableFactions.map((faction) => (
                <button
                  key={faction}
                  onClick={() => selectFaction(faction)}
                  disabled={isLoading}
                  className={`
                    p-3 rounded-lg font-semibold text-white transition duration-300
                    ${selectedFaction === faction 
                      ? 'bg-green-600 ring-2 ring-green-400' 
                      : FACTION_COLORS[faction]
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                  `}
                >
                  {FACTION_NAMES[faction]}
                </button>
              ))}
            </div>
            
            {selectedFaction && (
              <button
                onClick={clearFaction}
                disabled={isLoading}
                className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Limpar Facção
              </button>
            )}
          </div>

          {/* Estatísticas do Deck */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Estatísticas do Deck</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-300">Cartas</div>
                <div className="text-white font-bold">{stats.cardCount}/8</div>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-300">Poder Total</div>
                <div className="text-white font-bold">{stats.totalPower}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-300">Energia Total</div>
                <div className="text-white font-bold">{stats.totalEnergy}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-300">Poder Médio</div>
                <div className="text-white font-bold">{stats.averagePower.toFixed(1)}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-300">Energia Média</div>
                <div className="text-white font-bold">{stats.averageEnergy.toFixed(1)}</div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Ações</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={generateDeck}
                disabled={!selectedFaction || isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition duration-300"
              >
                {isLoading ? 'Gerando deck...' : 'Gerar Deck'}
              </button>
              <button
                onClick={clearDeck}
                disabled={deck.length === 0 || isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Limpar Deck
              </button>
              <button
                onClick={saveDeck}
                disabled={deck.length === 0 || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Salvar Deck
              </button>
              <button
                onClick={loadDeck}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Carregar Deck
              </button>
            </div>
          </div>
        </div>

        {/* Seção da Direita - Deck e Validação */}
        <div className="space-y-6">
          {/* Validação do Deck */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Validação do Deck</h2>
            {validation.isValid ? (
              <div className="bg-green-600 text-white p-4 rounded-lg text-center">
                ✅ Deck válido!
              </div>
            ) : (
              <div className="space-y-2">
                {validation.errors.map((error, index) => (
                  <div key={index} className="bg-red-600 text-white p-3 rounded-lg">
                    ❌ {error}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lista de Cartas do Deck */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Cartas do Deck ({deck.length}/8)</h2>
            
            {deck.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-6xl mb-4">🃏</div>
                <p>Nenhuma carta no deck</p>
                <p className="text-sm">Selecione uma facção e gere um deck ou adicione cartas manualmente</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {deck.map((card) => (
                  <div
                    key={card.id}
                    className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-white">{card.name}</div>
                      <div className="text-sm text-gray-300">
                        Poder: {card.power} | Energia: {card.energy}
                      </div>
                      {card.keywords.length > 0 && (
                        <div className="text-xs text-gray-400 mt-1">
                          {card.keywords.join(', ')}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeCard(card.id)}
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm transition duration-300"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botão de Reset */}
      <div className="text-center mt-8">
        <button
          onClick={reset}
          disabled={isLoading}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition duration-300"
        >
          Reset Completo
        </button>
      </div>
    </div>
  );
}
