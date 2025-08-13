import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@lq/ui/components/Card';
import { HUD } from '@lq/ui/components/HUD';
import { EnergySlider } from '@lq/ui/components/EnergySlider';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <Text style={styles.title}>Liga da Quebrada</Text>
      
      <HUD respect={12} energy={8} round={1} />
      
      <View style={styles.cardContainer}>
        <Card 
          card={{
            id: 'test-card',
            name: 'Test Card',
            faction: 'RODA_DE_GINGA',
            power: 7,
            damage: 3,
            text: 'Test card description',
            keywords: ['Test']
          }}
          selected={false}
          onPress={() => console.log('Card pressed')}
        />
      </View>
      
      <EnergySlider 
        value={3}
        max={8}
        onValueChange={(value) => console.log('Energy changed:', value)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F4F4F4',
    textAlign: 'center',
    marginBottom: 40,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
