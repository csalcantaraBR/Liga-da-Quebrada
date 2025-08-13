import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { tokens } from '../../tokens';

interface TopBarProps {
  currentPage: 'home' | 'matchmaking' | 'deck' | 'profile';
  onNavigate: (page: string) => void;
  username?: string;
  elo?: number;
  hasNotifications?: boolean;
  isMobile?: boolean;
  breadcrumbs?: string[];
}

export const TopBar: React.FC<TopBarProps> = ({ 
  currentPage, 
  onNavigate,
  username,
  elo = 1200,
  hasNotifications = false,
  isMobile = false,
  breadcrumbs = []
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Início' },
    { id: 'matchmaking', label: 'Partidas' },
    { id: 'deck', label: 'Deck' },
    { id: 'profile', label: 'Perfil' }
  ];

  const isActive = (pageId: string) => currentPage === pageId;

  const getMenuItemStyles = (pageId: string) => {
    const baseStyles = {
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.md,
      marginHorizontal: tokens.spacing.xs,
      borderRadius: tokens.radius.sm
    };

    if (isActive(pageId)) {
      return {
        ...baseStyles,
        borderBottomWidth: 2,
        borderBottomColor: tokens.colors.brand.verde,
        color: tokens.colors.brand.verde
      };
    }

    return {
      ...baseStyles,
      color: tokens.colors.neutral[700]
    };
  };

  const renderDesktopMenu = () => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onNavigate(item.id)}
          accessible={true}
          accessibilityLabel={`Navegar para ${item.label}`}
          accessibilityRole="link"
          accessibilityState={{ selected: isActive(item.id) }}
          style={getMenuItemStyles(item.id)}
        >
          <Text style={{
            fontSize: tokens.typography.body.fontSize,
            fontWeight: isActive(item.id) ? 'bold' : 'normal',
            color: isActive(item.id) ? tokens.colors.brand.verde : tokens.colors.neutral[700]
          }}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMobileMenu = () => (
    <View>
      <TouchableOpacity
        data-testid="hamburger-menu"
        onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          padding: tokens.spacing.sm
        }}
      >
        <Text style={{ fontSize: 24 }}>☰</Text>
      </TouchableOpacity>

      {isMobileMenuOpen && (
        <View data-testid="mobile-menu" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: tokens.colors.neutral[100],
          borderBottomWidth: 1,
          borderBottomColor: tokens.colors.neutral[300],
          shadowColor: tokens.colors.neutral[900],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4
        }}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              style={{
                paddingVertical: tokens.spacing.md,
                paddingHorizontal: tokens.spacing.lg,
                borderBottomWidth: 1,
                borderBottomColor: tokens.colors.neutral[300]
              }}
            >
              <Text style={{
                fontSize: tokens.typography.body.fontSize,
                fontWeight: isActive(item.id) ? 'bold' as const : 'normal' as const,
                color: isActive(item.id) ? tokens.colors.brand.verde : tokens.colors.neutral[700]
              }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0) return null;

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: tokens.spacing.lg
      }}>
        {breadcrumbs.map((crumb, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                if (index === 0) onNavigate('home');
                // Para outros breadcrumbs, navegar para a página correspondente
              }}
            >
              <Text style={{
                fontSize: tokens.typography.caption.fontSize,
                color: tokens.colors.neutral[500],
                textDecorationLine: index < breadcrumbs.length - 1 ? 'underline' : 'none'
              }}>
                {crumb}
              </Text>
            </TouchableOpacity>
            {index < breadcrumbs.length - 1 && (
              <Text style={{
                fontSize: tokens.typography.caption.fontSize,
                color: tokens.colors.neutral[500],
                marginHorizontal: tokens.spacing.xs
              }}>
                {'>'}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderUserSection = () => {
    if (username) {
      return (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: tokens.typography.body.fontSize,
            fontWeight: 'bold' as const,
            color: tokens.colors.neutral[700],
            marginRight: tokens.spacing.sm
          }}>
            {username}
          </Text>
          <Text style={{
            fontSize: tokens.typography.caption.fontSize,
            color: tokens.colors.neutral[500]
          }}>
            Elo: {elo}
          </Text>
          {hasNotifications && (
            <View data-testid="notification-indicator" style={{
              backgroundColor: tokens.colors.brand.vermelho,
              borderRadius: 8,
              width: 16,
              height: 16,
              marginLeft: tokens.spacing.sm,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{
                color: tokens.colors.neutral[100],
                fontSize: 10,
                fontWeight: 'bold'
              }}>
                !
              </Text>
            </View>
          )}
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => onNavigate('login')}
        style={{
          backgroundColor: tokens.colors.brand.verde,
          paddingVertical: tokens.spacing.sm,
          paddingHorizontal: tokens.spacing.md,
          borderRadius: tokens.radius.sm
        }}
      >
        <Text style={{
          color: tokens.colors.neutral[100],
          fontSize: tokens.typography.body.fontSize,
          fontWeight: 'bold'
        }}>
          Entrar
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: tokens.colors.neutral[100],
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.neutral[300],
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      shadowColor: tokens.colors.neutral[900],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
      }}>
        <Text style={{
          fontSize: tokens.typography.h1.fontSize,
          fontWeight: 'bold',
          color: tokens.colors.brand.verde,
          marginRight: tokens.spacing.lg
        }}>
          Liga da Quebrada
        </Text>
        
        {!isMobile && renderDesktopMenu()}
        {renderBreadcrumbs()}
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        {isMobile ? renderMobileMenu() : renderUserSection()}
      </View>
    </View>
  );
};
