import React from 'react';
import { Card as CardType } from '@lq/shared';

interface CardProps {
  card: CardType;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  selected = false, 
  disabled = false, 
  onPress 
}) => {
  return (
    <div
      onClick={onPress}
      style={{
        width: 120,
        height: 160,
        backgroundColor: '#F4F4F4',
        borderRadius: 12,
        padding: 12,
        boxShadow: selected 
          ? '0 6px 18px rgba(0, 0, 0, 0.25)' 
          : '0 2px 6px rgba(0, 0, 0, 0.15)',
        transform: selected ? 'scale(1.04)' : 'scale(1)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
    >
      <div style={{ 
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2E2E2E'
      }}>
        {card.faction}
      </div>
      
      <div style={{ 
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8
      }}>
        {card.name}
      </div>
      
      <div style={{ 
        position: 'absolute', 
        top: 8, 
        right: 8 
      }}>
        <div style={{ fontSize: 16, fontWeight: 'bold' }}>
          {card.power}
        </div>
      </div>
      
      <div style={{ 
        position: 'absolute', 
        bottom: 8, 
        right: 8 
      }}>
        <div style={{ fontSize: 16, fontWeight: 'bold' }}>
          {card.damage}
        </div>
      </div>
    </div>
  );
};
