import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AppBackground from '../../components/AppBackground';
import StatusHeader from '../../components/StatusHeader';
import { useGame } from '../../contexts/GameContext';
import { BIOME_CHAPTERS, JOURNEY_STEPS } from '../../data/biomeJourney';
import styles from './styles';

export default function Biomas() {
  const navigation = useNavigation();
  const game = useGame();

  const openBiome = (biome) => {
    if (!game.isBiomeUnlocked(biome.id)) {
      Alert.alert('Capítulo bloqueado', 'Conclua os 25 níveis e a árvore de evolução do bioma anterior.');
      return;
    }
    game.selectBiome(biome.id);
    navigation.navigate('Journey');
  };

  return (
    <AppBackground colors={['#EFF8EB', '#F9FBF2']}>
      <StatusHeader showProfile />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>EXPEDIÇÃO GLOBAL</Text>
          <Text style={styles.title}>9 biomas, uma única jornada</Text>
          <Text style={styles.subtitle}>Cada ambiente tem 25 níveis e sua própria árvore de evolução.</Text>
        </View>
        <View style={styles.timeline}>
          {BIOME_CHAPTERS.map((biome, index) => {
            const unlocked = game.isBiomeUnlocked(biome.id);
            const active = game.activeBiomeId === biome.id;
            const progress = game.getBiomeProgress(biome.id);
            const lessons = JOURNEY_STEPS.filter((step) => step.type === 'lesson' && step.biomeId === biome.id);
            const done = lessons.filter((step) => game.completedSteps.includes(step.id)).length;
            return (
              <View key={biome.id} style={styles.timelineRow}>
                {index < BIOME_CHAPTERS.length - 1 ? <View style={styles.timelineLine} /> : null}
                <View style={[styles.orderBubble, { backgroundColor: unlocked ? biome.theme.primary : '#C8D0CB' }]}>
                  <Text style={styles.orderText}>{biome.order}</Text>
                </View>
                <Pressable onPress={() => openBiome(biome)} style={[styles.card, active && { borderColor: biome.theme.primary, borderWidth: 2 }]}>
                  <View style={[styles.cover, { backgroundColor: biome.theme.dark }]}>
                    <Text style={styles.biomeEmoji}>{unlocked ? biome.emoji : '🔒'}</Text>
                    <View style={styles.levelPill}><Text style={styles.levelText}>{biome.startLevel}–{biome.endLevel}</Text></View>
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.biomeName}>{biome.name}</Text>
                      {active ? <View style={[styles.activePill, { backgroundColor: biome.theme.soft }]}><Text style={[styles.activeText, { color: biome.theme.dark }]}>ATUAL</Text></View> : null}
                    </View>
                    <Text style={styles.description} numberOfLines={2}>{biome.description}</Text>
                    <View style={styles.progressRow}>
                      <Text style={styles.progressText}>📚 {done}/25</Text>
                      <Text style={styles.progressText}>🌿 {progress.unlockedNodes.length}/{biome.treeNodes.length}</Text>
                      <Ionicons name={unlocked ? 'arrow-forward-circle' : 'lock-closed'} size={22} color={unlocked ? biome.theme.primary : '#9CA7A0'} />
                    </View>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>
        <View style={styles.footerSpace} />
      </ScrollView>
    </AppBackground>
  );
}
