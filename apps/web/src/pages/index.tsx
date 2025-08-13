import React from 'react';
import { Navigation } from '../components/Navigation';
import { useNavigation } from '../hooks/useNavigation';

export default function HomePage() {
  const { navigate } = useNavigation();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F4F4' }}>
      <Navigation />
      
      <main style={{ 
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <header style={{ 
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h1 style={{ 
            fontSize: '48px',
            color: '#0A2A66',
            marginBottom: '16px',
            fontWeight: 'bold'
          }}>
            Liga da Quebrada
          </h1>
          <p style={{ 
            fontSize: '20px',
            color: '#6B6B6B',
            marginBottom: '32px'
          }}>
            Card battler tático 1v1 com partidas de 3-4 minutos
          </p>
        </header>

        <section style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }} onClick={() => navigate('matchmaking')}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚔️</div>
            <h3 style={{ fontSize: '24px', color: '#0A2A66', marginBottom: '8px' }}>
              Jogar Agora
            </h3>
            <p style={{ color: '#6B6B6B' }}>
              Encontre um oponente e comece uma partida
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }} onClick={() => navigate('deck')}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🃏</div>
            <h3 style={{ fontSize: '24px', color: '#0A2A66', marginBottom: '8px' }}>
              Construir Deck
            </h3>
            <p style={{ color: '#6B6B6B' }}>
              Monte seu deck com cartas únicas
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }} onClick={() => navigate('profile')}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
            <h3 style={{ fontSize: '24px', color: '#0A2A66', marginBottom: '8px' }}>
              Perfil
            </h3>
            <p style={{ color: '#6B6B6B' }}>
              Veja suas estatísticas e progresso
            </p>
          </div>
        </section>

        <section style={{ 
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '32px',
            color: '#0A2A66',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            Sobre o Jogo
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            <div>
              <h4 style={{ fontSize: '20px', color: '#00923F', marginBottom: '12px' }}>
                🏆 6 Facções Únicas
              </h4>
              <p style={{ color: '#6B6B6B', lineHeight: '1.6' }}>
                Roda de Ginga, Motofrete União, Crew do Graffiti, Bateria Central, 
                Guardiões do Verde e Vaqueiros do Sertão.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontSize: '20px', color: '#00923F', marginBottom: '12px' }}>
                ⚡ Partidas Rápidas
              </h4>
              <p style={{ color: '#6B6B6B', lineHeight: '1.6' }}>
                Cada partida dura apenas 3-4 minutos com 4 rodadas estratégicas.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontSize: '20px', color: '#00923F', marginBottom: '12px' }}>
                🎯 Progressão Justa
              </h4>
              <p style={{ color: '#6B6B6B', lineHeight: '1.6' }}>
                Sistema de ranking equilibrado e Guerra de Território sazonal.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
