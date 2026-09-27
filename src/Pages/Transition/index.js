import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGame } from '../../contexts/GameContext';
import { getBiomeById, getJourneyStepById } from '../../data/biomeJourney';

export default function Transition() {
  const navigation = useNavigation();
  const route = useRoute();
  const game = useGame();
  const step = getJourneyStepById(route.params?.stepId);
  const from = getBiomeById(step?.fromBiomeId);
  const to = getBiomeById(step?.toBiomeId);
  if (!step || !from || !to) return null;

  const continueJourney = () => {
    game.setActiveBiomeFromJourney(step.id);
    navigation.reset({ index: 0, routes: [{ name: 'Journey' }] });
  };

  return (
    <LinearGradient colors={[from.theme.dark, to.theme.primary, to.theme.background]} style={styles.container}>
      <View style={styles.orbOne} /><View style={styles.orbTwo} />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>NÍVEL {step.globalLevel} · TRANSIÇÃO</Text>
        <View style={styles.worldRow}>
          <View style={styles.biomeBubble}><Text style={styles.biomeEmoji}>{from.emoji}</Text></View>
          <View style={styles.arrowLine}><Ionicons name={'arrow-forward'} size={30} color={'#FFFFFF'} /></View>
          <View style={[styles.biomeBubble, styles.biomeBubbleNew]}><Text style={styles.biomeEmoji}>{to.emoji}</Text></View>
        </View>
        <Text style={styles.title}>A paisagem está mudando</Text>
        <Text style={styles.description}>Você restaurou {from.name}. Siga a trilha para descobrir os mistérios de {to.name}.</Text>
        <View style={styles.reward}><Text style={styles.rewardText}>🪙 +{step.reward.coins}   💎 +{step.reward.diamonds}   ⚡ +{step.reward.fuel}</Text></View>
        <Pressable style={[styles.button, { backgroundColor: to.theme.dark }]} onPress={continueJourney}>
          <Text style={styles.buttonText}>Entrar em {to.name}</Text>
          <Ionicons name={'arrow-forward'} size={20} color={'#FFFFFF'} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  orbOne: { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(255,255,255,0.08)', top: -150, right: -90 },
  orbTwo: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(255,255,255,0.1)', bottom: -100, left: -80 },
  content: { width: '100%', maxWidth: 560, padding: 26, alignItems: 'center' },
  eyebrow: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '900', letterSpacing: 1.3 },
  worldRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  biomeBubble: { width: 105, height: 105, borderRadius: 53, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.45)' },
  biomeBubbleNew: { backgroundColor: '#FFFFFF', transform: [{ scale: 1.08 }] },
  biomeEmoji: { fontSize: 55 },
  arrowLine: { width: 74, alignItems: 'center' },
  title: { color: '#FFFFFF', fontSize: 29, fontWeight: '900', textAlign: 'center' },
  description: { color: 'rgba(255,255,255,0.84)', fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 10 },
  reward: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 15, paddingHorizontal: 16, paddingVertical: 11, marginTop: 22 },
  rewardText: { color: '#FFFFFF', fontWeight: '900' },
  button: { width: '100%', minHeight: 55, borderRadius: 17, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
});
