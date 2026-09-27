import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function QuestionStep({ step, biome, selected, feedback, onSelect, onConfirm, onFinish }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.questionContent}>
      <View style={styles.questionCard}>
        <View style={[styles.questionIcon, { backgroundColor: biome.theme.soft }]}>
          <Ionicons name={'help'} size={24} color={biome.theme.dark} />
        </View>
        <Text style={styles.questionText}>{step.question.prompt}</Text>
      </View>
      <View style={styles.optionsWrap}>
        {step.question.options.map((option, index) => {
          const chosen = selected === index;
          const correct = feedback && index === step.question.correctIndex;
          const wrong = feedback === 'wrong' && chosen && !correct;
          return (
            <Pressable
              key={option}
              disabled={Boolean(feedback)}
              onPress={() => onSelect(index)}
              style={[
                styles.option,
                chosen && { borderColor: biome.theme.primary, backgroundColor: biome.theme.soft },
                correct && styles.optionCorrect,
                wrong && styles.optionWrong,
              ]}
            >
              <Text style={styles.optionLetter}>{String.fromCharCode(65 + index)}</Text>
              <Text style={styles.optionText}>{option}</Text>
              {correct ? <Ionicons name={'checkmark-circle'} size={22} color={'#3DA75A'} /> : null}
              {wrong ? <Ionicons name={'close-circle'} size={22} color={'#D95656'} /> : null}
            </Pressable>
          );
        })}
      </View>
      {feedback ? (
        <View style={[styles.feedback, feedback === 'correct' ? styles.feedbackGood : styles.feedbackBad]}>
          <Text style={styles.feedbackTitle}>{feedback === 'correct' ? 'Boa investigação!' : 'Quase! Guarde esta pista.'}</Text>
          <Text style={styles.feedbackText}>{step.question.explanation}</Text>
        </View>
      ) : null}
      <Pressable
        disabled={selected === null}
        style={[styles.actionButton, { backgroundColor: selected === null ? '#C8D1CB' : biome.theme.primary }]}
        onPress={feedback ? onFinish : onConfirm}
      >
        <Text style={styles.actionButtonText}>{feedback ? 'Ver resultado' : 'Confirmar resposta'}</Text>
      </Pressable>
    </ScrollView>
  );
}
