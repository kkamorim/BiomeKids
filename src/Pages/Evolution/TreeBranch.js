import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../../theme/designSystem';
import styles from './styles';

const LABELS = {
  producer: ['BASE VIVA', 'leaf-outline', palette.moss],
  consumer: ['RELAÇÕES', 'paw-outline', palette.clay],
  discovery: ['CICLOS', 'sync-outline', palette.river],
};

export default function TreeBranch({ category, nodes, progress, localLevel, onNode }) {
  const [label, icon, color] = LABELS[category];
  return (
    <View style={styles.branch}>
      <View style={styles.branchHeader}>
        <View style={[styles.branchIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={15} color={palette.inverseText} />
        </View>
        <Text style={styles.branchTitle}>{label}</Text>
      </View>
      {nodes.map((node, index) => {
        const unlocked = progress.unlockedNodes.includes(node.id);
        const parentReady = !node.requiredNodeId || progress.unlockedNodes.includes(node.requiredNodeId);
        const available = parentReady && localLevel >= node.requiredLocalLevel;
        return (
          <View key={node.id} style={styles.nodeSlot}>
            {index > 0 ? <View style={[styles.connector, unlocked && { backgroundColor: color }]} /> : null}
            <Pressable
              accessibilityRole={'button'}
              accessibilityLabel={`${node.name}, ${unlocked ? 'restaurada' : available ? 'disponível' : 'bloqueada'}`}
              onPress={() => onNode(node)}
              style={({ pressed }) => [
                styles.treeNode,
                unlocked && { backgroundColor: color, borderColor: color },
                available && !unlocked && { borderColor: color },
                pressed && styles.nodePressed,
              ]}
            >
              <Ionicons name={unlocked ? icon : available ? 'add' : 'lock-closed-outline'} size={25} color={unlocked ? palette.inverseText : available ? color : palette.textSubtle} />
              <Text style={[styles.nodeName, unlocked && styles.nodeNameUnlocked]} numberOfLines={2}>{node.name}</Text>
              <Text style={[styles.nodeCost, unlocked && styles.nodeNameUnlocked]}>{unlocked ? `+${node.pps}/s` : `${node.cost} dados`}</Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
