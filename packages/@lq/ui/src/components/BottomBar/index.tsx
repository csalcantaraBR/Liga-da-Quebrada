import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { tokens } from '../../tokens';

interface BottomBarProps {
  currentTab: 'home' | 'matchmaking' | 'deck' | 'profile';
  onTabPress: (tab: string) => void;
  hasMatchmakingNotification?: boolean;
}

export const BottomBar: React.FC<BottomBarProps> = ({ 
  currentTab, 
  onTabPress,
  hasMatchmakingNotification = false
}) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: '🏠' },
    { id: 'matchmaking', label: 'Partidas', icon: '⚔️' },
    { id: 'deck', label: 'Deck', icon: '🃏' },
    { id: 'profile', label: 'Perfil', icon: '👤' }
  ];

  const isActive = (tabId: string) => currentTab === tabId;

  const getTabStyles = (tabId: string) => {
    const baseStyles = {
      flex: 1,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.xs,
      borderRadius: tokens.radius.sm,
      marginHorizontal: tokens.spacing.xs
    };

    if (isActive(tabId)) {
      return {
        ...baseStyles,
        backgroundColor: tokens.colors.brand.verde
      };
    }

    return {
      ...baseStyles,
      backgroundColor: tokens.colors.neutral[300]
    };
  };

  const getTextStyles = (tabId: string) => {
    if (isActive(tabId)) {
      return {
        color: tokens.colors.neutral[100],
        fontSize: tokens.typography.caption.fontSize,
        fontWeight: 'bold' as const
      };
    }

    return {
      color: tokens.colors.neutral[700],
      fontSize: tokens.typography.caption.fontSize,
      fontWeight: 'normal' as const
    };
  };

  const renderNotificationBadge = () => {
    if (!hasMatchmakingNotification) return null;

    return (
      <View data-testid="notification-badge" style={{
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: tokens.colors.brand.vermelho,
        borderRadius: 8,
        width: 16,
        height: 16,
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
    );
  };

  return (
    <View data-testid="bottom-bar" style={{
      flexDirection: 'row',
      backgroundColor: tokens.colors.neutral[100],
      borderTopWidth: 1,
      borderTopColor: tokens.colors.neutral[300],
      height: 60,
      paddingBottom: 20, // Safe area for iOS
      shadowColor: tokens.colors.neutral[900],
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 8
    }}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onTabPress(tab.id)}
          accessible={true}
          accessibilityLabel={`Navegar para ${tab.label}`}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive(tab.id) }}
          style={getTabStyles(tab.id)}
        >
          <View style={{ position: 'relative' }}>
            <Text style={{ fontSize: 20, marginBottom: 2 }}>
              {tab.icon}
            </Text>
            <Text style={getTextStyles(tab.id)}>
              {tab.label}
            </Text>
            {tab.id === 'matchmaking' && renderNotificationBadge()}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};
