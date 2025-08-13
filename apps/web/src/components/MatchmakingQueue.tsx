import React, { useEffect } from 'react';
import { useMatchmaking } from '../hooks/useMatchmaking';
import { useNavigation } from '../hooks/useNavigation';

interface MatchmakingQueueProps {
  className?: string;
}

export function MatchmakingQueue({ className = '' }: MatchmakingQueueProps) {
  const { status, searchDuration, opponent, error, startSearch, cancelSearch } = useMatchmaking();
  const { navigate } = useNavigation();

  // Navega para o jogo quando estiver pronto
  useEffect(() => {
    if (status === 'ready') {
      // Pequeno delay para mostrar o estado "pronto"
      const timer = setTimeout(() => {
        navigate('game', { matchId: 'new-match' });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  // Formata duração da busca
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Renderiza estado inicial
  if (status === 'idle') {
    return (
      <div className={`matchmaking-queue ${className}`} style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚔️</div>
        <h2 style={{
          fontSize: '28px',
          color: '#0A2A66',
          marginBottom: '16px'
        }}>
          Pronto para Jogar?
        </h2>
        <p style={{
          color: '#6B6B6B',
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Clique no botão abaixo para começar a procurar um oponente
        </p>
        <button
          onClick={() => startSearch('player-1')}
          style={{
            backgroundColor: '#00923F',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#007A33'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00923F'}
          aria-label="Iniciar busca por oponente"
        >
          Procurar Oponente
        </button>
      </div>
    );
  }

  // Renderiza estado de busca
  if (status === 'searching') {
    return (
      <div className={`matchmaking-queue ${className}`} style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
        <h2 style={{
          fontSize: '28px',
          color: '#0A2A66',
          marginBottom: '16px'
        }}>
          Procurando Oponente...
        </h2>
        <div style={{
          fontSize: '48px',
          color: '#00923F',
          marginBottom: '24px',
          fontFamily: 'monospace'
        }}>
          {formatDuration(searchDuration)}
        </div>
        <p style={{
          color: '#6B6B6B',
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Aguarde enquanto encontramos um oponente adequado
        </p>
        <button
          onClick={cancelSearch}
          style={{
            backgroundColor: '#C0392B',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#A93226'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#C0392B'}
        >
          Cancelar Busca
        </button>
      </div>
    );
  }

  // Renderiza estado de pareamento
  if (status === 'matched') {
    return (
      <div className={`matchmaking-queue ${className}`} style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎯</div>
        <h2 style={{
          fontSize: '28px',
          color: '#00923F',
          marginBottom: '16px'
        }}>
          Oponente Encontrado!
        </h2>
        {opponent && (
          <div style={{
            backgroundColor: '#F8F9FA',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '20px',
              color: '#0A2A66',
              marginBottom: '8px'
            }}>
              {opponent.name}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6B6B6B'
            }}>
              Rank: {opponent.rank}
            </div>
          </div>
        )}
        <p style={{
          color: '#6B6B6B',
          fontSize: '16px'
        }}>
          Conectando...
        </p>
      </div>
    );
  }

  // Renderiza estado de conexão
  if (status === 'connecting') {
    return (
      <div className={`matchmaking-queue ${className}`} style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔗</div>
        <h2 style={{
          fontSize: '28px',
          color: '#0A2A66',
          marginBottom: '16px'
        }}>
          Conectando...
        </h2>
        <p style={{
          color: '#6B6B6B',
          fontSize: '16px'
        }}>
          Estabelecendo conexão com o oponente
        </p>
      </div>
    );
  }

  // Renderiza estado pronto
  if (status === 'ready') {
    return (
      <div className={`matchmaking-queue ${className}`} style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎮</div>
        <h2 style={{
          fontSize: '28px',
          color: '#00923F',
          marginBottom: '16px'
        }}>
          Pronto para Jogar!
        </h2>
        <p style={{
          color: '#6B6B6B',
          fontSize: '16px'
        }}>
          Iniciando partida...
        </p>
      </div>
    );
  }

  // Renderiza estado de erro
  if (status === 'error') {
    return (
      <div className={`matchmaking-queue ${className}`} style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚠️</div>
        <h2 style={{
          fontSize: '28px',
          color: '#C0392B',
          marginBottom: '16px'
        }}>
          Erro na Busca
        </h2>
        <p style={{
          color: '#6B6B6B',
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          {error}
        </p>
        <button
          onClick={() => startSearch('player-1')}
          style={{
            backgroundColor: '#00923F',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#007A33'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00923F'}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  // Estado desconhecido
  return (
    <div className={`matchmaking-queue ${className}`} style={{
      backgroundColor: 'white',
      padding: '48px',
      borderRadius: '16px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>❓</div>
      <h2 style={{
        fontSize: '28px',
        color: '#6B6B6B',
        marginBottom: '16px'
      }}>
        Estado Desconhecido
      </h2>
      <p style={{
        color: '#6B6B6B',
        fontSize: '16px'
      }}>
        Status: {status}
      </p>
    </div>
  );
}
