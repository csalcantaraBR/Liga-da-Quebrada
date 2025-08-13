import React from 'react';
import { Navigation } from '../components/Navigation';

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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Profile Card */}
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
              Jogador Anônimo
            </h2>
            <p style={{ 
              color: '#6B6B6B',
              marginBottom: '24px'
            }}>
              Nível 1 • Novato
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '24px', color: '#00923F', fontWeight: 'bold' }}>
                  0
                </div>
                <div style={{ fontSize: '14px', color: '#6B6B6B' }}>Vitórias</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', color: '#C0392B', fontWeight: 'bold' }}>
                  0
                </div>
                <div style={{ fontSize: '14px', color: '#6B6B6B' }}>Derrotas</div>
              </div>
            </div>

            <button style={{
              backgroundColor: '#00923F',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Editar Perfil
            </button>
          </div>

          {/* Statistics */}
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ 
              fontSize: '24px',
              color: '#0A2A66',
              marginBottom: '24px'
            }}>
              Estatísticas
            </h2>
            
            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #E9ECEF'
              }}>
                <span style={{ color: '#6B6B6B' }}>Partidas Jogadas</span>
                <span style={{ fontWeight: 'bold', color: '#0A2A66' }}>0</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #E9ECEF'
              }}>
                <span style={{ color: '#6B6B6B' }}>Taxa de Vitória</span>
                <span style={{ fontWeight: 'bold', color: '#0A2A66' }}>0%</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #E9ECEF'
              }}>
                <span style={{ color: '#6B6B6B' }}>Ranking</span>
                <span style={{ fontWeight: 'bold', color: '#0A2A66' }}>Não Classificado</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #E9ECEF'
              }}>
                <span style={{ color: '#6B6B6B' }}>Territórios Conquistados</span>
                <span style={{ fontWeight: 'bold', color: '#0A2A66' }}>0</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0'
              }}>
                <span style={{ color: '#6B6B6B' }}>Tempo de Jogo</span>
                <span style={{ fontWeight: 'bold', color: '#0A2A66' }}>0h 0m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '32px'
        }}>
          <h2 style={{ 
            fontSize: '24px',
            color: '#0A2A66',
            marginBottom: '24px'
          }}>
            Conquistas
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} style={{
                backgroundColor: '#F8F9FA',
                border: '1px solid #DEE2E6',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                opacity: 0.5
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏆</div>
                <h3 style={{ 
                  fontSize: '16px',
                  color: '#6B6B6B',
                  marginBottom: '8px'
                }}>
                  Conquista {i + 1}
                </h3>
                <p style={{ 
                  fontSize: '14px',
                  color: '#6B6B6B'
                }}>
                  Bloqueada
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Matches */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '24px',
            color: '#0A2A66',
            marginBottom: '24px'
          }}>
            Partidas Recentes
          </h2>
          
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: '#6B6B6B'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>
              Nenhuma partida jogada ainda
            </p>
            <p style={{ fontSize: '14px' }}>
              Jogue sua primeira partida para ver suas estatísticas aqui
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
