import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../../contexts/GameContext';

export default function CurrencyHeader({ coins: customCoins, diamonds: customDiamonds = 5 }) {
  const { coins: contextCoins, gameState } = useGame();
  const currentCoins = customCoins ?? contextCoins ?? gameState?.coins ?? 10;
  const currentDiamonds = customDiamonds;

  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <Text style={styles.icon}>🪙</Text>
        <Text style={styles.value}>{currentCoins}</Text>
      </View>
      <View style={styles.pill}>
        <Text style={styles.icon}>💎</Text>
        <Text style={styles.value}>{currentDiamonds}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderWidth: 1.5,
    borderColor: '#E8D8A0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
  },
  value: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3E2723',
  },
});
