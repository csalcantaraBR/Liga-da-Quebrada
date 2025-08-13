import React from 'react';
import { Navigation } from '../components/Navigation';
import { ProfileStats } from '../components/ProfileStats';
import { ClientOnly } from '../components/ClientOnly';

export default function ProfilePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F4F4' }}>
      <Navigation showBackButton />
      
      <main style={{ 
        padding: '24px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <header style={{ marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '36px',
            color: '#0A2A66',
            marginBottom: '16px'
          }}>
            Perfil do Jogador
          </h1>
          <p style={{ 
            fontSize: '18px',
            color: '#6B6B6B'
          }}>
            Veja suas estatísticas e progresso no jogo
          </p>
        </header>

        <ClientOnly fallback={
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>👤</div>
            <h2 style={{ 
              fontSize: '24px',
              color: '#0A2A66',
              marginBottom: '8px'
            }}>
              Carregando perfil...
            </h2>
          </div>
        }>
          <ProfileStats />
        </ClientOnly>
      </main>
    </div>
  );
}
