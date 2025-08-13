import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card as CardType } from '@lq/shared';
import { tokens } from '../../tokens';
import { useAnimation, SlideDirection } from '../../hooks/useAnimation';

interface AnimatedCardProps {
  card: CardType;
  selected?: boolean;
  disabled?: boolean;
  state?: 'idle' | 'winning' | 'losing' | 'locked';
  onPress?: () => void;
  entranceAnimation?: 'fadeIn' | 'slideIn' | 'scaleIn';
  animationDuration?: number;
  animationDelay?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  disableAnimations?: boolean;
  onAnimationStart?: (type: string) => void;
  onAnimationEnd?: (type: string) => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  card,
  selected = false,
  disabled = false,
  state = 'idle',
  onPress,
  entranceAnimation = 'fadeIn',
  animationDuration = 300,
  animationDelay = 0,
  easing = 'ease-out',
  disableAnimations = false,
  onAnimationStart,
  onAnimationEnd
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const renderCountRef = useRef(0);
  
  const animation = useAnimation({
    duration: animationDuration,
    easing,
    delay: animationDelay,
    onAnimationStart,
    onAnimationEnd
  });

  // Contador de renders para testes
  renderCountRef.current++;

  useEffect(() => {
    if (!disableAnimations) {
      switch (entranceAnimation) {
        case 'fadeIn':
          animation.fadeIn();
          break;
        case 'slideIn':
          animation.slideIn('bottom');
          break;
        case 'scaleIn':
          animation.scaleIn();
          break;
      }
    }
  }, [entranceAnimation, disableAnimations]);

  const getCardStyles = () => {
    const baseStyles = {
      width: 120,
      height: 160,
      backgroundColor: tokens.colors.neutral[100],
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.md,
      shadowColor: tokens.colors.neutral[900],
      shadowOffset: { width: 0, height: selected ? 6 : 2 },
      shadowOpacity: selected ? 0.25 : 0.15,
      shadowRadius: selected ? 18 : 6,
      elevation: selected ? 6 : 2,
      opacity: animation.opacity,
      // Animações de hover e press
      transform: [
        { scale: selected ? 1.04 : (isHovering ? 1.02 : 1) },
        { translateY: animation.translateY + (isPressing ? 2 : 0) },
        { translateX: animation.translateX }
      ]
    };

    // Aplicar estilos específicos do estado
    switch (state) {
      case 'winning':
        return {
          ...baseStyles,
          shadowColor: tokens.colors.brand.verde,
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8
        };
      case 'losing':
        return {
          ...baseStyles,
          shadowColor: tokens.colors.brand.vermelho,
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8
        };
      default:
        return baseStyles;
    }
  };

  const getAccessibilityLabel = () => {
    const factionNames = {
      'RODA_DE_GINGA': 'Roda de Ginga',
      'MOTOFRETE_UNIAO': 'Motofrete União',
      'CREW_DO_GRAFFITI': 'Crew do Graffiti',
      'BATERIA_CENTRAL': 'Bateria Central',
      'GUARDIOES_DO_VERDE': 'Guardiões do Verde',
      'VAQUEIROS_DO_SERTAO': 'Vaqueiros do Sertão'
    };

    let label = `${card.name}, ${factionNames[card.faction] || card.faction}, Poder ${card.power}, Dano ${card.damage}`;
    
    if (selected) label += ', selecionada';
    if (state === 'winning') label += ', vencedora';
    if (state === 'losing') label += ', perdedora';
    if (state === 'locked') label += ', usada';
    
    return label;
  };

  const renderBadges = () => {
    const badges = [];

    if (card.keywords.includes('Ritmo')) {
      badges.push(
        <View key="ritmo" data-testid="badge-ritmo" style={{
          position: 'absolute',
          top: 4,
          left: 4,
          backgroundColor: tokens.colors.brand.amarelo,
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 4
        }}>
          <Text style={{
            fontSize: 10,
            fontWeight: 'bold',
            color: tokens.colors.neutral[900]
          }}>
            Ritmo
          </Text>
        </View>
      );
    }

    if (card.keywords.includes('Mandinga')) {
      badges.push(
        <View key="mandinga" data-testid="badge-mandinga" style={{
          position: 'absolute',
          top: 4,
          left: card.keywords.includes('Ritmo') ? 40 : 4,
          backgroundColor: tokens.colors.brand.azul,
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 4
        }}>
          <Text style={{
            fontSize: 10,
            fontWeight: 'bold',
            color: tokens.colors.neutral[100]
          }}>
            Mandinga
          </Text>
        </View>
      );
    }

    if (card.onEnter && card.onEnter.length > 0) {
      badges.push(
        <View key="ao-entrar" data-testid="badge-ao-entrar" style={{
          position: 'absolute',
          bottom: 4,
          left: 4,
          backgroundColor: tokens.colors.brand.verde,
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 4
        }}>
          <Text style={{
            fontSize: 10,
            fontWeight: 'bold',
            color: tokens.colors.neutral[100]
          }}>
            Ao entrar
          </Text>
        </View>
      );
    }

    if (card.onWin && card.onWin.length > 0) {
      badges.push(
        <View key="ao-vencer" data-testid="badge-ao-vencer" style={{
          position: 'absolute',
          bottom: 4,
          left: card.onEnter && card.onEnter.length > 0 ? 60 : 4,
          backgroundColor: tokens.colors.brand.vermelho,
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 4
        }}>
          <Text style={{
            fontSize: 10,
            fontWeight: 'bold',
            color: tokens.colors.neutral[100]
          }}>
            Ao vencer
          </Text>
        </View>
      );
    }

    return badges;
  };

  const renderLockIcon = () => {
    if (state === 'locked') {
      return (
        <View data-testid="lock-icon" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{ translateX: -10 }, { translateY: -10 }],
          backgroundColor: tokens.colors.neutral[700],
          borderRadius: 12,
          width: 24,
          height: 24,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{
            color: tokens.colors.neutral[100],
            fontSize: 12,
            fontWeight: 'bold'
          }}>
            🔒
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        accessible={true}
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityRole="button"
        accessibilityState={{ disabled, selected }}
        style={getCardStyles()}
        data-testid="animated-card"
        data-animating={animation.isAnimating.toString()}
        data-entrance={entranceAnimation}
        data-hovering={isHovering.toString()}
        data-pressing={isPressing.toString()}
        data-selected={selected.toString()}
        data-state={state}
        data-disabled={disabled.toString()}
        data-duration={animationDuration.toString()}
        data-easing={easing}
        data-delay={animationDelay.toString()}
        data-animations-disabled={disableAnimations.toString()}
        data-render-count={renderCountRef.current.toString()}
        // Eventos de mouse para web
        {...(typeof window !== 'undefined' && !disableAnimations && {
          onMouseEnter: () => {
            setIsHovering(true);
            onAnimationStart?.('hover');
          },
          onMouseLeave: () => {
            setIsHovering(false);
            onAnimationEnd?.('hover');
          },
          onMouseDown: () => {
            setIsPressing(true);
            onAnimationStart?.('press');
          },
          onMouseUp: () => {
            setIsPressing(false);
            onAnimationEnd?.('press');
          }
        })}
      >
        <Text style={{ 
          fontSize: tokens.typography.caption.fontSize,
          fontWeight: 'bold',
          color: tokens.colors.brand[card.faction.toLowerCase() as keyof typeof tokens.colors.brand] || tokens.colors.neutral[700]
        }}>
          {card.faction}
        </Text>
        
        <Text style={{ 
          fontSize: tokens.typography.h2.fontSize,
          fontWeight: 'bold',
          marginTop: tokens.spacing.sm
        }}>
          {card.name}
        </Text>
        
        <View style={{ 
          position: 'absolute', 
          top: tokens.spacing.sm, 
          right: tokens.spacing.sm 
        }}>
          <Text style={{ fontSize: tokens.typography.body.fontSize, fontWeight: 'bold' }}>
            {card.power}
          </Text>
        </View>
        
        <View style={{ 
          position: 'absolute', 
          bottom: tokens.spacing.sm, 
          right: tokens.spacing.sm 
        }}>
          <Text style={{ fontSize: tokens.typography.body.fontSize, fontWeight: 'bold' }}>
            {card.damage}
          </Text>
        </View>

        {renderBadges()}
        {renderLockIcon()}

        {state === 'locked' && (
          <Text style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transform: [{ translateX: -20 }],
            color: tokens.colors.neutral[700],
            fontSize: tokens.typography.micro.fontSize,
            fontWeight: 'bold'
          }}>
            Usada
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
