import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppBackground from '../../components/AppBackground';
import StatusHeader from '../../components/StatusHeader';
import BottomNavBar from '../../components/BottomNavBar';
import { useGame } from '../../contexts/GameContext';
import { BIOME_CHAPTERS, JOURNEY_STEPS } from '../../data/biomeJourney';
import ChapterCard from './ChapterCard';
import FinalMissionCard from './FinalMissionCard';
import LessonNode from './LessonNode';
import styles from './styles';

export default function Journey() {
  const navigation = useNavigation();
  const game = useGame();
  const biome = game.activeBiome || BIOME_CHAPTERS[0];
  const lessons = useMemo(
    () => JOURNEY_STEPS.filter((step) => step.type === 'lesson' && step.biomeId === biome.id),
    [biome.id]
  );
  const transition = JOURNEY_STEPS.find((step) => step.type === 'transition' && step.biomeId === biome.id);
  const progress = game.getBiomeProgress(biome.id);
  const completed = lessons.filter((step) => game.completedSteps.includes(step.id)).length;
  const nodesDone = progress.unlockedNodes.length;
  const ready = completed === 25 && nodesDone === biome.treeNodes.length;

  return (
    <AppBackground colors={[biome.theme.background, biome.theme.soft]}>
      <StatusHeader showBiomes onBiomesPress={() => navigation.navigate('Biomas')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ChapterCard
          biome={biome}
          completed={completed}
          onBiomes={() => navigation.navigate('Biomas')}
          onEvolution={() => navigation.navigate('Evolution')}
        />
        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionEyebrow}>SUA EXPEDIÇÃO</Text>
            <Text style={styles.sectionTitle}>Investigue e descubra</Text>
          </View>
          <View style={[styles.ecoPill, { borderColor: biome.theme.primary }]}>
            <Text>🌿</Text>
            <Text style={[styles.ecoPillText, { color: biome.theme.dark }]}>{Math.floor(progress.ecoPoints)} eco</Text>
          </View>
        </View>
        <View style={styles.pathContainer}>
          {lessons.map((step, index) => {
            const done = game.completedSteps.includes(step.id);
            const unlocked = game.isStepUnlocked(step.id);
            return (
              <LessonNode
                key={step.id}
                step={step}
                index={index}
                completed={done}
                unlocked={unlocked}
                current={game.currentStep?.id === step.id}
                color={biome.theme.primary}
                onPress={() => unlocked && navigation.navigate('Lesson', { stepId: step.id })}
              />
            );
          })}
        </View>
        <FinalMissionCard
          biome={biome}
          completed={completed}
          nodesDone={nodesDone}
          ready={ready}
          onPress={() => transition ? navigation.navigate('Transition', { stepId: transition.id }) : navigation.navigate('Perfil')}
        />
      </ScrollView>
      <BottomNavBar activeTab={'Trilha'} />
    </AppBackground>
  );
}
