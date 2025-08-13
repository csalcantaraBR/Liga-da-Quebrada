import React from 'react';
import { useNavigation, Screen } from '../hooks/useNavigation';

// Temporary tokens for web app
const tokens = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },
  colors: {
    brand: {
      verde: '#00923F',
      amarelo: '#FFC400',
      azul: '#0A2A66',
      vermelho: '#C0392B',
      cinza: '#2E2E2E',
      offWhite: '#F4F4F4'
    }
  },
  typography: {
    h2: { fontSize: 20 },
    body: { fontSize: 16 }
  },
  radius: {
    sm: 8
  },
  elevation: {
    card: {
      idle: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }
  },
  motion: {
    duration: {
      base: 220
    },
    standard: [0.2, 0, 0, 1]
  }
};

interface NavigationItem {
  screen: Screen;
  label: string;
  icon: string;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { screen: 'home', label: 'Início', icon: '🏠', path: '/' },
  { screen: 'matchmaking', label: 'Jogar', icon: '⚔️', path: '/matchmaking' },
  { screen: 'deck', label: 'Deck', icon: '🃏', path: '/deck' },
  { screen: 'profile', label: 'Perfil', icon: '👤', path: '/profile' }
];

interface NavigationProps {
  className?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function Navigation({ className = '', showBackButton = false, onBackClick }: NavigationProps) {
  const { currentScreen, navigate, canGoBack, goBack } = useNavigation();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (canGoBack()) {
      goBack();
    }
  };

  return (
    <nav 
      className={`navigation ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${tokens.spacing.md}px`,
        backgroundColor: tokens.colors.brand.azul,
        color: tokens.colors.brand.offWhite,
        boxShadow: tokens.elevation.card.idle
      }}
    >
      {/* Back Button */}
      {showBackButton && (
        <button
          onClick={handleBackClick}
          disabled={!canGoBack()}
          style={{
            background: 'none',
            border: 'none',
            color: tokens.colors.brand.offWhite,
            fontSize: tokens.typography.h2.fontSize,
            cursor: canGoBack() ? 'pointer' : 'not-allowed',
            opacity: canGoBack() ? 1 : 0.5,
            padding: tokens.spacing.sm
          }}
          aria-label="Voltar"
        >
          ←
        </button>
      )}

      {/* Navigation Items */}
      <div style={{ display: 'flex', gap: tokens.spacing.lg }}>
        {navigationItems.map((item) => {
          const isActive = currentScreen === item.screen;
          
          return (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? tokens.colors.brand.amarelo : tokens.colors.brand.offWhite,
                fontSize: tokens.typography.body.fontSize,
                cursor: 'pointer',
                padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                borderRadius: tokens.radius.sm,
                transition: `all ${tokens.motion.duration.base}ms ${tokens.motion.standard.join(', ')}`,
                borderBottom: isActive ? `2px solid ${tokens.colors.brand.amarelo}` : 'none'
              }}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span style={{ marginRight: tokens.spacing.xs }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Spacer for back button alignment */}
      {showBackButton && <div style={{ width: '40px' }} />}
    </nav>
  );
}
