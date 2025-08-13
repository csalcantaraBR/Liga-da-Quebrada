import React from 'react';

interface HUDProps {
  respect: number;
  energy: number;
  round: number;
  maxRound?: number;
}

export const HUD: React.FC<HUDProps> = ({ 
  respect, 
  energy, 
  round, 
  maxRound = 4 
}) => {
  return (
    <div style={{
      height: 80,
      backgroundColor: '#121212',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Respeito */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          color: '#F4F4F4',
          fontSize: 14,
          marginRight: 8
        }}>
          Respeito
        </div>
        <div style={{ 
          width: 120, 
          height: 8, 
          backgroundColor: '#2E2E2E',
          borderRadius: 4,
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(respect / 12) * 100}%`,
            height: '100%',
            backgroundColor: '#00923F'
          }} />
        </div>
        <div style={{ 
          color: '#F4F4F4',
          fontSize: 12,
          marginLeft: 8
        }}>
          {respect}/12
        </div>
      </div>

      {/* Energia */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          color: '#F4F4F4',
          fontSize: 14,
          marginRight: 8
        }}>
          Energia
        </div>
        <div style={{ 
          color: '#FFC400',
          fontSize: 16,
          fontWeight: 'bold'
        }}>
          {energy}
        </div>
      </div>

      {/* Rodada */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          color: '#F4F4F4',
          fontSize: 14,
          marginRight: 8
        }}>
          Rodada
        </div>
        <div style={{ 
          color: '#F4F4F4',
          fontSize: 16,
          fontWeight: 'bold'
        }}>
          {round}/{maxRound}
        </div>
      </div>
    </div>
  );
};
