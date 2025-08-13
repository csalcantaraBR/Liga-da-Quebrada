import React, { useCallback, useMemo } from 'react';
import { Card, Faction } from '@lq/shared';
import { useAnimation } from '../hooks/useAnimation';
import { useHover } from '../../micro-interactions/hooks/useHover';

export type CardState = 'normal' | 'hovered' | 'selected' | 'disabled';

export interface AnimatedCardProps {
  card: Card;
  state?: CardState;
  onCardClick?: (card: Card) => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  animateEntrance?: boolean;
  animateHover?: boolean;
  animateClick?: boolean;
  disabled?: boolean;
  className?: string;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  card,
  state = 'normal',
  onCardClick,
  onHoverStart,
  onHoverEnd,
  animateEntrance = false,
  animateHover = false,
  animateClick = false,
  disabled = false,
  className = '',
}) => {
  const { isAnimating, startAnimation } = useAnimation({
    duration: 300,
    easing: 'easeInOut',
  });

  const { isHovered, hoverProps } = useHover({
    onHoverStart,
    onHoverEnd,
  });

  const handleClick = useCallback(() => {
    if (disabled || !onCardClick) return;
    
    if (animateClick) {
      startAnimation();
    }
    
    onCardClick(card);
  }, [card, onCardClick, disabled, animateClick, startAnimation]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    handleClick();
  }, [handleClick]);

  const cardState = useMemo(() => {
    if (disabled) return 'disabled';
    if (state === 'selected') return 'selected';
    if (isHovered || state === 'hovered') return 'hovered';
    return 'normal';
  }, [state, isHovered, disabled]);

  const cardStyle = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      position: 'relative',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      backgroundColor: '#fff',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease-in-out',
      transform: 'translate3d(0, 0, 0)', // Hardware acceleration
      willChange: 'transform, opacity',
    };

    switch (cardState) {
      case 'hovered':
        return {
          ...baseStyle,
          transform: 'translate3d(0, -4px, 0) scale(1.02)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        };
      case 'selected':
        return {
          ...baseStyle,
          transform: 'translate3d(0, -2px, 0) scale(1.01)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          borderColor: '#007bff',
        };
      case 'disabled':
        return {
          ...baseStyle,
          opacity: 0.5,
          cursor: 'not-allowed',
        };
      default:
        return baseStyle;
    }
  }, [cardState, disabled]);

  const factionColor = useMemo(() => {
    const factionColors: Record<Faction, string> = {
      RODA_DE_GINGA: '#FF6B35',
      MOTOFRETE_UNIAO: '#4ECDC4',
      CREW_DO_GRAFFITI: '#45B7D1',
      BATERIA_CENTRAL: '#96CEB4',
      GUARDIOES_DO_VERDE: '#FFEAA7',
      VAQUEIROS_DO_SERTAO: '#DDA0DD',
    };
    return factionColors[card.faction] || '#666';
  }, [card.faction]);

  return (
    <div
      data-testid="animated-card"
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Carta ${card.name} - Poder ${card.power}, Dano ${card.damage}`}
      aria-disabled={disabled}
      style={cardStyle}
      className={`animated-card ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={hoverProps.onMouseEnter}
      onMouseLeave={hoverProps.onMouseLeave}
      onTouchStart={hoverProps.onTouchStart}
      onFocus={hoverProps.onFocus}
      onBlur={hoverProps.onBlur}
    >
      <div style={{ borderLeft: `4px solid ${factionColor}` }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
          {card.name}
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Poder: {card.power}</span>
          <span>Dano: {card.damage}</span>
        </div>
        
        <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
          {card.text}
        </p>
        
        {card.keywords && card.keywords.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {card.keywords.map((keyword, index) => (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  padding: '2px 6px',
                  margin: '0 4px 4px 0',
                  backgroundColor: factionColor,
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
