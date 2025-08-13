import React from 'react';
import { Navigation } from '../components/Navigation';
import { MatchmakingQueue } from '../components/MatchmakingQueue';

export default function MatchmakingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F4F4' }}>
      <Navigation showBackButton />
      
      <main style={{ 
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <header style={{ marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '36px',
            color: '#0A2A66',
            marginBottom: '16px'
          }}>
            Encontrar Partida
          </h1>
          <p style={{ 
            fontSize: '18px',
            color: '#6B6B6B'
          }}>
            Encontre um oponente para uma partida emocionante
          </p>
        </header>

        <MatchmakingQueue style={{ marginBottom: '32px' }} />

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '20px',
            color: '#0A2A66',
            marginBottom: '16px'
          }}>
            Como Funciona
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            textAlign: 'left'
          }}>
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>1️⃣</div>
              <h4 style={{ fontSize: '16px', color: '#00923F', marginBottom: '4px' }}>
                Clique em "Procurar"
              </h4>
              <p style={{ fontSize: '14px', color: '#6B6B6B' }}>
                Inicie a busca por um oponente
              </p>
            </div>
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>2️⃣</div>
              <h4 style={{ fontSize: '16px', color: '#00923F', marginBottom: '4px' }}>
                Aguarde o Pareamento
              </h4>
              <p style={{ fontSize: '14px', color: '#6B6B6B' }}>
                Sistema encontra oponente adequado
              </p>
            </div>
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>3️⃣</div>
              <h4 style={{ fontSize: '16px', color: '#00923F', marginBottom: '4px' }}>
                Comece a Partida
              </h4>
              <p style={{ fontSize: '14px', color: '#6B6B6B' }}>
                Jogue sua melhor estratégia
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
