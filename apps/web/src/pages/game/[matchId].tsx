import React from 'react';
import { useRouter } from 'next/router';
import { Navigation } from '../../components/Navigation';

export default function GamePage() {
  const router = useRouter();
  const { matchId } = router.query;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212' }}>
      <Navigation showBackButton />
      
      <main style={{ 
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        color: '#F4F4F4'
      }}>
        <header style={{ 
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{ 
            fontSize: '32px',
            color: '#F4F4F4',
            marginBottom: '8px'
          }}>
            Partida em Andamento
          </h1>
          <p style={{ 
            fontSize: '16px',
            color: '#BDBDBD'
          }}>
            Match ID: {matchId || 'Carregando...'}
          </p>
        </header>

        <div style={{
          backgroundColor: '#2E2E2E',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          marginBottom: '32px'
        }}>
          <h2 style={{ 
            fontSize: '24px',
            color: '#F4F4F4',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            Arena de Batalha
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginBottom: '32px'
          }}>
            {/* Player 1 */}
            <div style={{
              backgroundColor: '#1E1E1E',
              padding: '24px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                fontSize: '20px',
                color: '#00923F',
                marginBottom: '16px'
              }}>
                Você
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '16px'
              }}>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} style={{
                    backgroundColor: '#3E3E3E',
                    border: '2px solid #00923F',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ fontSize: '24px' }}>🃏</div>
                  </div>
                ))}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: '#BDBDBD'
              }}>
                <span>Vida: 20</span>
                <span>Energia: 5</span>
              </div>
            </div>

            {/* Player 2 */}
            <div style={{
              backgroundColor: '#1E1E1E',
              padding: '24px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                fontSize: '20px',
                color: '#C0392B',
                marginBottom: '16px'
              }}>
                Oponente
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '16px'
              }}>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} style={{
                    backgroundColor: '#3E3E3E',
                    border: '2px solid #C0392B',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ fontSize: '24px' }}>🃏</div>
                  </div>
                ))}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: '#BDBDBD'
              }}>
                <span>Vida: 20</span>
                <span>Energia: 5</span>
              </div>
            </div>
          </div>

          {/* Game Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px'
          }}>
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
              Jogar Carta
            </button>
            <button style={{
              backgroundColor: '#FFC400',
              color: '#2E2E2E',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Passar Turno
            </button>
            <button style={{
              backgroundColor: '#C0392B',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              Desistir
            </button>
          </div>
        </div>

        {/* Game Info */}
        <div style={{
          backgroundColor: '#2E2E2E',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{ 
            fontSize: '20px',
            color: '#F4F4F4',
            marginBottom: '16px'
          }}>
            Informações da Partida
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <span style={{ color: '#BDBDBD' }}>Rodada: </span>
              <span style={{ color: '#F4F4F4', fontWeight: 'bold' }}>1/4</span>
            </div>
            <div>
              <span style={{ color: '#BDBDBD' }}>Tempo: </span>
              <span style={{ color: '#F4F4F4', fontWeight: 'bold' }}>02:45</span>
            </div>
            <div>
              <span style={{ color: '#BDBDBD' }}>Status: </span>
              <span style={{ color: '#00923F', fontWeight: 'bold' }}>Seu Turno</span>
            </div>
            <div>
              <span style={{ color: '#BDBDBD' }}>Modo: </span>
              <span style={{ color: '#F4F4F4', fontWeight: 'bold' }}>Ranked</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
