import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

const OFFSETS = [0, 48, 76, 52, 0, -52, -76, -48];

export default function LessonNode({ step, index, completed, unlocked, current, onPress, color }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!current) return undefined;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.07, duration: 850, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 850, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [current, pulse]);

  const offset = OFFSETS[index % OFFSETS.length];
  const icon = completed ? 'checkmark' : unlocked ? step.icon || 'leaf' : 'lock-closed';

  return (
    <View style={styles.nodeRow}>
      {index > 0 ? <View style={[styles.pathLine, completed && { backgroundColor: color }]} /> : null}
      <Animated.View style={{ transform: [{ translateX: offset }, { scale: pulse }] }}>
        <Pressable
          accessibilityRole={'button'}
          accessibilityLabel={`Nível ${step.globalLevel}: ${step.title}`}
          accessibilityState={{ disabled: !unlocked, selected: current }}
          onPress={onPress}
          style={({ pressed }) => [
            styles.lessonNode,
            completed && { backgroundColor: color, borderColor: color },
            unlocked && !completed && { borderColor: color, backgroundColor: '#FFFFFF' },
            !unlocked && styles.lessonNodeLocked,
            pressed && unlocked && styles.pressed,
          ]}
        >
          <Ionicons name={icon} size={28} color={completed ? '#FFFFFF' : unlocked ? color : '#97A19B'} />
          <View style={[styles.levelBadge, completed && { backgroundColor: '#FFFFFF' }]}>
            <Text style={[styles.levelBadgeText, completed && { color }]}>{step.globalLevel}</Text>
          </View>
        </Pressable>
      </Animated.View>
      <View style={[styles.nodeLabel, { transform: [{ translateX: offset > 20 ? -62 : offset < -20 ? 62 : 0 }] }]}>
        <Text style={styles.nodeTitle} numberOfLines={1}>{step.title}</Text>
        <Text style={styles.nodeSubtitle} numberOfLines={1}>
          {completed ? 'Concluído' : current ? 'Continue daqui' : unlocked ? step.subtitle : 'Bloqueado'}
        </Text>
      </View>
    </View>
  );
}
