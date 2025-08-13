import React from 'react';
import { Navigation } from '../components/Navigation';
import { DeckBuilder } from '../components/DeckBuilder';
import { ClientOnly } from '../components/ClientOnly';

export default function DeckPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <ClientOnly fallback={
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Construtor de Deck</h1>
            <p className="text-gray-300">Carregando...</p>
          </div>
        </div>
      }>
        <DeckBuilder />
      </ClientOnly>
    </div>
  );
}
