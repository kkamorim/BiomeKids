import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function FinalMissionCard({ biome, completed, nodesDone, ready, onPress }) {
  return (
    <View style={[styles.finalCard, { borderColor: biome.theme.primary }]}>
      <View style={[styles.finalIcon, { backgroundColor: biome.theme.soft }]}>
        <Ionicons name={'trophy'} size={28} color={biome.theme.dark} />
      </View>
      <View style={styles.finalCopy}>
        <Text style={styles.finalEyebrow}>MISSÃO PRINCIPAL</Text>
        <Text style={styles.finalTitle}>{biome.mainMission.title}</Text>
        <Text style={styles.finalDescription}>{completed}/25 níveis · {nodesDone}/{biome.treeNodes.length} atributos</Text>
      </View>
      <Pressable disabled={!ready} style={[styles.transitionButton, { backgroundColor: ready ? biome.theme.primary : '#C9D1CC' }]} onPress={onPress}>
        <Ionicons name={ready ? 'arrow-forward' : 'lock-closed'} size={20} color={'#FFFFFF'} />
      </Pressable>
    </View>
  );
}
