import React from 'react';
import { Navigation } from '../components/Navigation';
import { DeckBuilder } from '../components/DeckBuilder';

export default function DeckPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <DeckBuilder />
    </div>
  );
}
