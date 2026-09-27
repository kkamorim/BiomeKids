import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function Result({ step, biome, mistakes, wasCompleted, onContinue }) {
  const reward = wasCompleted ? { coins: 0, xp: 0, ecoPoints: 0 } : step.reward;
  return (
    <View style={styles.resultWrap}>
      <View style={[styles.resultHalo, { backgroundColor: biome.theme.soft }]}>
        <Text style={styles.resultEmoji}>{wasCompleted ? '🌱' : '🏅'}</Text>
      </View>
      <Text style={styles.resultEyebrow}>{wasCompleted ? 'TREINO CONCLUÍDO' : 'NÍVEL CONCLUÍDO'}</Text>
      <Text style={styles.resultTitle}>{mistakes === 0 ? 'Expedição perfeita!' : 'Ótimo trabalho!'}</Text>
      <Text style={styles.resultSubtitle}>Cada pista aprendida fortalece o ecossistema.</Text>
      <View style={styles.rewardRow}>
        <View style={styles.rewardCard}><Text>🪙</Text><Text style={styles.rewardValue}>+{reward.coins}</Text><Text style={styles.rewardLabel}>moedas</Text></View>
        <View style={styles.rewardCard}><Text>⭐</Text><Text style={styles.rewardValue}>+{reward.xp}</Text><Text style={styles.rewardLabel}>XP</Text></View>
        <View style={styles.rewardCard}><Text>🌿</Text><Text style={styles.rewardValue}>+{reward.ecoPoints}</Text><Text style={styles.rewardLabel}>eco</Text></View>
      </View>
      <Pressable style={[styles.actionButton, { backgroundColor: biome.theme.primary }]} onPress={onContinue}>
        <Text style={styles.actionButtonText}>Continuar na trilha</Text>
        <Ionicons name={'arrow-forward'} size={20} color={'#FFFFFF'} />
      </Pressable>
    </View>
  );
}
