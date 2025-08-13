import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock React Native components for web testing
vi.mock('react-native', () => ({
  View: 'div',
  Text: 'span',
  TouchableOpacity: ({ children, onPress, accessible, accessibilityLabel, accessibilityRole, accessibilityState, ...props }: any) => {
    // Convert React Native props to web equivalents
    const webProps = {
      ...props,
      onClick: onPress,
      'aria-label': accessibilityLabel,
      role: accessibilityRole,
      'aria-pressed': accessibilityState?.pressed,
      'aria-disabled': accessibilityState?.disabled,
      'aria-selected': accessibilityState?.selected,
      'aria-checked': accessibilityState?.checked,
      'aria-expanded': accessibilityState?.expanded,
      'aria-busy': accessibilityState?.busy,
      'aria-hidden': accessibilityState?.hidden
    };
    
    // Remove React Native specific props
    delete webProps.accessible;
    delete webProps.accessibilityLabel;
    delete webProps.accessibilityRole;
    delete webProps.accessibilityState;
    delete webProps.onPress;
    
    return React.createElement('button', webProps, children);
  },
  SafeAreaView: 'div',
  StyleSheet: {
    create: (styles: any) => styles
  }
}));

// Mock expo-status-bar
vi.mock('expo-status-bar', () => ({
  StatusBar: 'div'
}));
