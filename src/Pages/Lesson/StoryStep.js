import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function StoryStep({ step, biome, page, onContinue }) {
  const isLast = page + 1 === step.story.length;
  return (
    <View style={styles.storyWrap}>
      <View style={[styles.storyScene, { backgroundColor: biome.theme.dark }]}>
        <View style={styles.sceneOrb} />
        <Text style={styles.sceneEmoji}>{step.collectionItem?.emoji || biome.emoji}</Text>
        <View style={styles.sceneTag}>
          <Ionicons name={page === 0 ? 'book-outline' : 'search-outline'} size={15} color={'#FFFFFF'} />
          <Text style={styles.sceneTagText}>{page === 0 ? 'HISTÓRIA' : 'PISTA CIENTÍFICA'}</Text>
        </View>
      </View>
      <View style={styles.storyCard}>
        <Text style={styles.storyText}>{step.story[page]}</Text>
        <Text style={styles.pageText}>Pista {page + 1} de {step.story.length}</Text>
      </View>
      <Pressable style={[styles.actionButton, { backgroundColor: biome.theme.primary }]} onPress={onContinue}>
        <Text style={styles.actionButtonText}>{isLast ? 'Responder ao desafio' : 'Próxima pista'}</Text>
        <Ionicons name={'arrow-forward'} size={20} color={'#FFFFFF'} />
      </Pressable>
    </View>
  );
}
