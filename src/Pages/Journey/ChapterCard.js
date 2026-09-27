import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function ChapterCard({ biome, completed, onBiomes, onEvolution }) {
  const theme = biome.theme;
  const percent = Math.round((completed / 25) * 100);
  return (
    <View style={[styles.chapterCard, { backgroundColor: theme.dark }]}>
      <View style={styles.chapterTopRow}>
        <View style={styles.chapterCopy}>
          <Text style={styles.eyebrow}>CAPÍTULO {biome.order}</Text>
          <Text style={styles.chapterTitle}>{biome.emoji} {biome.name}</Text>
          <Text style={styles.chapterDescription}>{biome.description}</Text>
        </View>
        <Pressable style={styles.mapButton} onPress={onBiomes}>
          <Ionicons name={'earth-outline'} size={21} color={'#FFFFFF'} />
        </Pressable>
      </View>
      <View style={styles.progressMeta}>
        <Text style={styles.progressLabel}>{completed} de 25 níveis</Text>
        <Text style={styles.progressLabel}>{percent}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: String(percent) + '%', backgroundColor: theme.secondary }]} />
      </View>
      <View style={styles.modeRow}>
        <View style={styles.modeActive}>
          <Ionicons name={'trail-sign'} size={18} color={theme.dark} />
          <Text style={[styles.modeActiveText, { color: theme.dark }]}>Trilha</Text>
        </View>
        <Pressable style={styles.modeButton} onPress={onEvolution}>
          <Ionicons name={'git-network-outline'} size={18} color={'#FFFFFF'} />
          <Text style={styles.modeButtonText}>Árvore de evolução</Text>
        </Pressable>
      </View>
    </View>
  );
}
