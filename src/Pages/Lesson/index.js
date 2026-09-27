import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppBackground from '../../components/AppBackground';
import { useGame } from '../../contexts/GameContext';
import { getBiomeById, getJourneyStepById } from '../../data/biomeJourney';
import StoryStep from './StoryStep';
import QuestionStep from './QuestionStep';
import Result from './Result';
import styles from './styles';

export default function Lesson() {
  const navigation = useNavigation();
  const route = useRoute();
  const game = useGame();
  const step = getJourneyStepById(route.params?.stepId);
  const biome = getBiomeById(step?.biomeId);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);
  const wasCompleted = game.completedSteps.includes(step?.id);

  if (!step || !biome) {
    return <View style={styles.missing}><Text>Lição não encontrada.</Text></View>;
  }

  const questionPage = page >= step.story.length;
  const progress = finished ? 100 : Math.round((page / (step.story.length + 1)) * 100);

  const confirm = () => {
    if (selected === null) return;
    const correct = selected === step.question.correctIndex;
    setFeedback(correct ? 'correct' : 'wrong');
    if (!correct) {
      setMistakes((value) => value + 1);
      game.answerIncorrect();
    }
  };

  const finish = () => {
    if (!wasCompleted && game.fuel < 1) {
      Alert.alert('Sem combustível', 'Visite a Loja ou resgate uma missão para continuar.');
      return;
    }
    if (!wasCompleted && game.hearts < 1) {
      Alert.alert('Sem corações', 'Recupere seus corações na Loja antes de concluir um novo nível.');
      return;
    }
    if (!game.completeLesson(step.id, { correct: mistakes === 0 })) {
      Alert.alert('Lição bloqueada', 'Conclua o nível anterior antes de avançar.');
      return;
    }
    setFinished(true);
  };

  return (
    <AppBackground colors={[biome.theme.background, '#FFFFFF']}>
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name={'close'} size={22} color={'#52635A'} />
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: String(Math.max(7, progress)) + '%', backgroundColor: biome.theme.primary }]} />
        </View>
        <Text style={styles.headerStat}>❤️ {game.hearts}</Text>
        <Text style={styles.headerStat}>⚡ {game.fuel}</Text>
      </View>

      {finished ? (
        <Result step={step} biome={biome} mistakes={mistakes} wasCompleted={wasCompleted} onContinue={() => navigation.navigate('Journey')} />
      ) : (
        <View style={styles.body}>
          <Text style={[styles.level, { color: biome.theme.dark }]}>NÍVEL {step.globalLevel} · {step.unit}</Text>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.subtitle}>{step.subtitle}</Text>
          {questionPage ? (
            <QuestionStep
              step={step}
              biome={biome}
              selected={selected}
              feedback={feedback}
              onSelect={setSelected}
              onConfirm={confirm}
              onFinish={finish}
            />
          ) : (
            <StoryStep step={step} biome={biome} page={page} onContinue={() => setPage((value) => value + 1)} />
          )}
        </View>
      )}
    </AppBackground>
  );
}
