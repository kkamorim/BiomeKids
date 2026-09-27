import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

const LABELS = {
  producer: ['PRODUTORES', 'leaf', '#4DAA5B'],
  consumer: ['CONSUMIDORES', 'paw', '#E08A32'],
  discovery: ['DESCOBERTAS', 'bulb', '#477FBA'],
};

export default function TreeBranch({ category, nodes, progress, localLevel, onNode }) {
  const [label, icon, color] = LABELS[category];
  return (
    <View style={styles.branch}>
      <View style={[styles.branchHeader, { backgroundColor: color }]}>
        <Ionicons name={icon} size={15} color={'#FFFFFF'} />
        <Text style={styles.branchTitle}>{label}</Text>
      </View>
      {nodes.map((node, index) => {
        const unlocked = progress.unlockedNodes.includes(node.id);
        const parentReady = !node.requiredNodeId || progress.unlockedNodes.includes(node.requiredNodeId);
        const available = parentReady && localLevel >= node.requiredLocalLevel;
        return (
          <View key={node.id} style={styles.nodeSlot}>
            {index > 0 ? <View style={[styles.connector, unlocked && { backgroundColor: color }]} /> : null}
            <Pressable onPress={() => onNode(node)} style={[styles.treeNode, unlocked && { backgroundColor: color, borderColor: color }, available && !unlocked && { borderColor: color }]}>
              <Text style={styles.nodeEmoji}>{unlocked || available ? node.icon : '🔒'}</Text>
              <Text style={[styles.nodeName, unlocked && styles.nodeNameUnlocked]} numberOfLines={2}>{node.name}</Text>
              <Text style={[styles.nodeCost, unlocked && styles.nodeNameUnlocked]}>{unlocked ? '+' + node.pps + '/s' : node.cost + ' eco'}</Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
