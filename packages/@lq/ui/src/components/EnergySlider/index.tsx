import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { tokens } from '../../tokens';

interface EnergySliderProps {
  value: number;
  max: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

export const EnergySlider: React.FC<EnergySliderProps> = ({ 
  value, 
  max, 
  onValueChange, 
  disabled = false 
}) => {
  const handleIncrement = () => {
    if (!disabled && value < max) {
      onValueChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (!disabled && value > 0) {
      onValueChange(value - 1);
    }
  };

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.lg
    }}>
      <TouchableOpacity
        onPress={handleDecrement}
        disabled={disabled || value === 0}
        style={{
          width: 44,
          height: 44,
          borderRadius: tokens.radius.md,
          backgroundColor: tokens.colors.neutral[300],
          justifyContent: 'center',
          alignItems: 'center',
          opacity: (disabled || value === 0) ? 0.5 : 1
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>-</Text>
      </TouchableOpacity>

      <View style={{
        flex: 1,
        height: 8,
        backgroundColor: tokens.colors.neutral[300],
        borderRadius: 4,
        marginHorizontal: tokens.spacing.md,
        overflow: 'hidden'
      }}>
        <View style={{
          width: `${(value / max) * 100}%`,
          height: '100%',
          backgroundColor: tokens.colors.brand.amarelo
        }} />
      </View>

      <Text style={{
        fontSize: tokens.typography.body.fontSize,
        fontWeight: 'bold',
        marginHorizontal: tokens.spacing.md,
        minWidth: 30,
        textAlign: 'center'
      }}>
        {value}
      </Text>

      <TouchableOpacity
        onPress={handleIncrement}
        disabled={disabled || value === max}
        style={{
          width: 44,
          height: 44,
          borderRadius: tokens.radius.md,
          backgroundColor: tokens.colors.neutral[300],
          justifyContent: 'center',
          alignItems: 'center',
          opacity: (disabled || value === max) ? 0.5 : 1
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};
