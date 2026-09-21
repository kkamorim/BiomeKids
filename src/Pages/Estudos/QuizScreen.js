import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGame } from '../../contexts/GameContext';
import { QUIZZES, ANIMALS } from '../../data/gameData';

const { width } = Dimensions.get('window');

export default function QuizScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { completeQuiz } = useGame();

  const { animalId, quizId } = route.params;

  // Encontra o quiz
  const animalQuizzes = QUIZZES[animalId] || [];
  const quiz = animalQuizzes.find((q) => q.id === quizId);

  // Encontra dados do animal para exibição
  const biomeId = Object.keys(ANIMALS).find((key) =>
    ANIMALS[key].some((a) => a.id === animalId)
  );
  const animalData = biomeId ? ANIMALS[biomeId].find((a) => a.id === animalId) : null;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Animações
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  // Timer de 30 segundos por pergunta
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Atualiza barra de progresso
  useEffect(() => {
    if (quiz) {
      Animated.timing(progressAnim, {
        toValue: (currentQuestion + 1) / quiz.perguntas.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentQuestion, quiz]);

  // Timer countdown
  useEffect(() => {
    if (quizFinished || showResult) return;

    setTimeLeft(30);
    timerAnim.setValue(1);

    Animated.timing(timerAnim, {
      toValue: 0,
      duration: 30000,
      useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(-1); // Tempo esgotado
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion, quizFinished]);

  if (!quiz) {
    return (
      <View style={s.container}>
        <Text style={s.errorText}>Quiz não encontrado!</Text>
        <Pressable style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backBtnText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const question = quiz.perguntas[currentQuestion];

  const handleAnswer = (answerIndex) => {
    if (showResult) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === question.correta;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      // Animação de sucesso (scale bounce)
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.15, duration: 150, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
      ]).start();
    } else {
      // Animação de erro (shake)
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    shakeAnim.setValue(0);
    scaleAnim.setValue(0);

    if (currentQuestion + 1 >= quiz.perguntas.length) {
      // Quiz finalizado!
      const finalScore = score + (selectedAnswer === question.correta ? 0 : 0); // score já foi atualizado
      completeQuiz(animalId, quizId, score, quiz.perguntas.length);
      setQuizFinished(true);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const getOptionStyle = (index) => {
    if (!showResult) return s.optionDefault;
    if (index === question.correta) return s.optionCorrect;
    if (index === selectedAnswer && index !== question.correta) return s.optionWrong;
    return s.optionDefault;
  };

  const getOptionTextStyle = (index) => {
    if (!showResult) return s.optionText;
    if (index === question.correta) return s.optionTextCorrect;
    if (index === selectedAnswer && index !== question.correta) return s.optionTextWrong;
    return s.optionText;
  };

  // ─── TELA DE RESULTADO FINAL ───
  if (quizFinished) {
    const percentage = Math.round((score / quiz.perguntas.length) * 100);
    let emoji, message;
    if (percentage >= 80) {
      emoji = '🏆';
      message = 'Incrível! Você é um expert!';
    } else if (percentage >= 60) {
      emoji = '🌟';
      message = 'Muito bom! Continue estudando!';
    } else if (percentage >= 30) {
      emoji = '💪';
      message = 'Bom esforço! Tente novamente!';
    } else {
      emoji = '📚';
      message = 'Vamos estudar mais um pouco!';
    }

    return (
      <ImageBackground
        source={require('../../../assets/fundo-ceu.png')}
        style={s.container}
        resizeMode="cover"
      >
        <SafeAreaView style={s.safeArea}>
          <View style={s.resultContainer}>
            <Text style={s.resultEmoji}>{emoji}</Text>
            <Text style={s.resultTitle}>Quiz Concluído!</Text>
            <Text style={s.resultMessage}>{message}</Text>

            <View style={s.scoreCard}>
              <Text style={s.scoreLabel}>Pontuação</Text>
              <Text style={s.scoreValue}>
                {score}/{quiz.perguntas.length}
              </Text>
              <Text style={s.scorePercent}>{percentage}%</Text>
            </View>

            <View style={s.rewardCard}>
              <Ionicons name="star" size={20} color="#FFD54F" />
              <Text style={s.rewardText}>
                +{Math.round(quiz.recompensaXP * (score / quiz.perguntas.length))} XP de Pesquisa
              </Text>
            </View>

            {animalData && (
              <Text style={s.resultAnimalName}>
                O {animalData.nome} ficou mais forte com seu conhecimento!
              </Text>
            )}

            <Pressable style={s.resultButton} onPress={() => navigation.goBack()}>
              <Text style={s.resultButtonText}>Voltar aos Estudos</Text>
            </Pressable>

            <Pressable
              style={s.resultButtonSecondary}
              onPress={() => {
                const biome = biomeId ? parseInt(biomeId) : 1;
                const biomeRoute = `Territorio${biome}`;
                navigation.navigate(biomeRoute);
              }}
            >
              <Ionicons name="map" size={16} color="#2E7D32" />
              <Text style={s.resultButtonSecondaryText}> Ver no Mapa</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // ─── TELA DO QUIZ ───
  const timerColor = timerAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: ['#E53935', '#FF9800', '#66BB6A'],
  });

  return (
    <ImageBackground
      source={require('../../../assets/fundo-ceu.png')}
      style={s.container}
      resizeMode="cover"
    >
      <SafeAreaView style={s.safeArea}>
        <Animated.View style={[s.quizContainer, { opacity: fadeIn }]}>
          {/* Header com timer e progresso */}
          <View style={s.quizHeader}>
            <Pressable style={s.closeBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={22} color="#fff" />
            </Pressable>

            <View style={s.progressBarContainer}>
              <Animated.View
                style={[
                  s.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>

            <View style={s.timerContainer}>
              <Animated.View style={[s.timerCircle, { borderColor: timerColor }]}>
                <Text style={s.timerText}>{timeLeft}</Text>
              </Animated.View>
            </View>
          </View>

          <Text style={s.questionCounter}>
            Pergunta {currentQuestion + 1} de {quiz.perguntas.length}
          </Text>

          {/* Pergunta */}
          <Animated.View
            style={[
              s.questionCard,
              { transform: [{ translateX: shakeAnim }] },
            ]}
          >
            <Text style={s.questionText}>{question.pergunta}</Text>
          </Animated.View>

          {/* Opções */}
          <View style={s.optionsContainer}>
            {question.opcoes.map((opcao, index) => (
              <Pressable
                key={index}
                style={[s.optionButton, getOptionStyle(index)]}
                onPress={() => handleAnswer(index)}
                disabled={showResult}
              >
                <View style={s.optionLetterCircle}>
                  <Text style={s.optionLetter}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[s.optionText, getOptionTextStyle(index)]}>{opcao}</Text>
                {showResult && index === question.correta && (
                  <Ionicons name="checkmark-circle" size={22} color="#2E7D32" />
                )}
                {showResult && index === selectedAnswer && index !== question.correta && (
                  <Ionicons name="close-circle" size={22} color="#C62828" />
                )}
              </Pressable>
            ))}
          </View>

          {/* Explicação */}
          {showExplanation && (
            <View style={s.explanationCard}>
              <Ionicons name="bulb" size={18} color="#F57F17" />
              <Text style={s.explanationText}>{question.explicacao}</Text>
            </View>
          )}

          {/* Botão próximo */}
          {showResult && (
            <Pressable style={s.nextButton} onPress={nextQuestion}>
              <Text style={s.nextButtonText}>
                {currentQuestion + 1 >= quiz.perguntas.length ? 'Ver Resultado' : 'Próxima'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
          )}
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ==============================================================================
// STYLES
// ==============================================================================
const s = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  errorText: { textAlign: 'center', color: '#fff', fontSize: 18, marginTop: 100 },
  backBtn: { alignSelf: 'center', marginTop: 20, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10 },
  backBtnText: { fontWeight: 'bold', color: '#2E7D32' },

  quizContainer: { flex: 1, paddingHorizontal: 16 },

  // Header
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  progressBarContainer: {
    flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 4, marginHorizontal: 12, overflow: 'hidden',
  },
  progressBar: {
    height: '100%', backgroundColor: '#66BB6A', borderRadius: 4,
  },
  timerContainer: { marginLeft: 4 },
  timerCircle: {
    width: 42, height: 42, borderRadius: 21,
    borderWidth: 3, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  timerText: { fontWeight: 'bold', fontSize: 14, color: '#2E3A59' },

  questionCounter: {
    color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600',
    textAlign: 'center', marginBottom: 8,
  },

  // Pergunta
  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 18,
    padding: 22, marginBottom: 16,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, shadowRadius: 5,
  },
  questionText: {
    fontSize: 17, fontWeight: '700', color: '#2E3A59',
    lineHeight: 24, textAlign: 'center',
  },

  // Opções
  optionsContainer: { marginBottom: 10 },
  optionButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 14,
    padding: 14, marginBottom: 8, borderWidth: 2, borderColor: 'transparent',
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 2,
  },
  optionDefault: { borderColor: 'rgba(0,0,0,0.08)' },
  optionCorrect: { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' },
  optionWrong: { borderColor: '#C62828', backgroundColor: '#FFEBEE' },
  optionLetterCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#E3F2FD', alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  optionLetter: { fontWeight: 'bold', fontSize: 14, color: '#1565C0' },
  optionText: { flex: 1, fontSize: 14, color: '#2E3A59', fontWeight: '500' },
  optionTextCorrect: { flex: 1, fontSize: 14, color: '#1B5E20', fontWeight: '700' },
  optionTextWrong: { flex: 1, fontSize: 14, color: '#B71C1C', fontWeight: '600' },

  // Explicação
  explanationCard: {
    flexDirection: 'row', backgroundColor: '#FFF8E1', borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: '#FFD54F',
  },
  explanationText: { flex: 1, fontSize: 13, color: '#4E342E', marginLeft: 8, lineHeight: 18 },

  // Próximo
  nextButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2E7D32', borderRadius: 14, paddingVertical: 14,
    marginTop: 12, elevation: 3,
  },
  nextButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginRight: 6 },

  // Resultado
  resultContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30,
  },
  resultEmoji: { fontSize: 64, marginBottom: 10 },
  resultTitle: { fontSize: 28, fontWeight: 'bold', color: '#2E3A59', marginBottom: 4 },
  resultMessage: { fontSize: 16, color: '#546E7A', textAlign: 'center' },
  scoreCard: {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 20, padding: 24,
    alignItems: 'center', marginTop: 24, width: '100%',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, shadowRadius: 5,
  },
  scoreLabel: { fontSize: 14, color: '#90A4AE', fontWeight: '600' },
  scoreValue: { fontSize: 48, fontWeight: 'bold', color: '#2E7D32', marginVertical: 4 },
  scorePercent: { fontSize: 16, color: '#66BB6A', fontWeight: '700' },
  rewardCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, marginTop: 16,
    borderWidth: 1, borderColor: '#FFD54F',
  },
  rewardText: { fontSize: 14, fontWeight: '600', color: '#F57F17', marginLeft: 6 },
  resultAnimalName: {
    fontSize: 14, color: '#78909C', textAlign: 'center', marginTop: 12, fontStyle: 'italic',
  },
  resultButton: {
    backgroundColor: '#2E7D32', borderRadius: 14, paddingVertical: 14,
    paddingHorizontal: 32, marginTop: 24, elevation: 3,
  },
  resultButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultButtonSecondary: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, paddingVertical: 12,
    paddingHorizontal: 24, marginTop: 10, borderWidth: 2, borderColor: '#2E7D32',
  },
  resultButtonSecondaryText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 14 },
});
