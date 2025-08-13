import React from 'react';
import { View, Text } from 'react-native';
import { tokens } from '../../tokens';

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
    <View style={{
      height: 80,
      backgroundColor: tokens.colors.neutral[900],
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Respeito */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ 
          color: tokens.colors.neutral[100],
          fontSize: tokens.typography.caption.fontSize,
          marginRight: tokens.spacing.sm
        }}>
          Respeito
        </Text>
        <View style={{ 
          width: 120, 
          height: 8, 
          backgroundColor: tokens.colors.neutral[700],
          borderRadius: 4,
          overflow: 'hidden'
        }}>
          <View style={{
            width: `${(respect / 12) * 100}%`,
            height: '100%',
            backgroundColor: tokens.colors.brand.verde
          }} />
        </View>
        <Text style={{ 
          color: tokens.colors.neutral[100],
          fontSize: tokens.typography.micro.fontSize,
          marginLeft: tokens.spacing.sm
        }}>
          {respect}/12
        </Text>
      </View>

      {/* Energia */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ 
          color: tokens.colors.neutral[100],
          fontSize: tokens.typography.caption.fontSize,
          marginRight: tokens.spacing.sm
        }}>
          Energia
        </Text>
        <Text style={{ 
          color: tokens.colors.brand.amarelo,
          fontSize: tokens.typography.body.fontSize,
          fontWeight: 'bold'
        }}>
          {energy}
        </Text>
      </View>

      {/* Rodada */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ 
          color: tokens.colors.neutral[100],
          fontSize: tokens.typography.caption.fontSize,
          marginRight: tokens.spacing.sm
        }}>
          Rodada
        </Text>
        <Text style={{ 
          color: tokens.colors.neutral[100],
          fontSize: tokens.typography.body.fontSize,
          fontWeight: 'bold'
        }}>
          {round}/{maxRound}
        </Text>
      </View>
    </View>
  );
};
