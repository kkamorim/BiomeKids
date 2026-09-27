import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../../contexts/GameContext';
import {
  alpha,
  layout,
  palette,
  radius,
  shadows,
  spacing,
} from '../../theme/designSystem';

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function formatMetric(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return String(value ?? 0);
  }

  if (Math.abs(value) >= 1000000) {
    return ((value / 1000000).toFixed(value >= 10000000 ? 0 : 1).replace('.0', '')) + 'M';
  }
  if (Math.abs(value) >= 1000) {
    return ((value / 1000).toFixed(value >= 10000 ? 0 : 1).replace('.0', '')) + 'k';
  }
  return String(Math.floor(value));
}

function MetricChip({ icon, color, value, label }) {
  return (
    <View
      accessible
      accessibilityLabel={label + ': ' + value}
      style={[styles.metricChip, { backgroundColor: alpha(color, 0.1) }]}
    >
      <Ionicons name={icon} size={17} color={color} />
      <Text style={styles.metricValue} numberOfLines={1}>
        {formatMetric(value)}
      </Text>
    </View>
  );
}

function HeaderButton({ icon, color, label, onPress }) {
  return (
    <Pressable
      accessibilityRole={'button'}
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
    >
      <Ionicons name={icon} size={21} color={color} />
    </Pressable>
  );
}

export function StatusHeader({
  showProfile = true,
  showBiomes = false,
  onProfilePress,
  onBiomesPress,
  profileRoute = 'Perfil',
  biomesRoute = 'Biomas',
  profileAccessibilityLabel = 'Abrir perfil',
  biomesAccessibilityLabel = 'Escolher bioma',
  streak,
  coins,
  diamonds,
  hearts,
  fuel,
  style,
}) {
  const navigation = useNavigation();
  const game = useGame();
  const state = game?.gameState || game || {};

  const metrics = [
    {
      key: 'streak',
      label: 'Sequência',
      icon: 'flame',
      color: palette.streak,
      value: firstDefined(streak, state.dailyStreak, state.streak, 0),
    },
    {
      key: 'coins',
      label: 'Moedas',
      icon: 'cash',
      color: palette.coin,
      value: firstDefined(coins, game?.coins, state.coins, 0),
    },
    {
      key: 'diamonds',
      label: 'Diamantes',
      icon: 'diamond',
      color: palette.diamond,
      value: firstDefined(diamonds, state.diamonds, state.gems, state.crystals, 0),
    },
    {
      key: 'hearts',
      label: 'Corações',
      icon: 'heart',
      color: palette.heart,
      value: firstDefined(hearts, state.hearts, state.lives, 5),
    },
    {
      key: 'fuel',
      label: 'Combustível',
      icon: 'flash',
      color: palette.fuel,
      value: firstDefined(fuel, state.fuel, state.energy, 5),
    },
  ];

  const openProfile = onProfilePress || (() => navigation.navigate(profileRoute));
  const openBiomes = onBiomesPress || (() => navigation.navigate(biomesRoute));

  return (
    <View style={[styles.outer, style]}>
      <View style={styles.container}>
        {showBiomes ? (
          <HeaderButton
            icon={'earth'}
            color={palette.primaryDark}
            label={biomesAccessibilityLabel}
            onPress={openBiomes}
          />
        ) : null}

        <ScrollView
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metrics}
          style={styles.metricsScroll}
        >
          {metrics.map((metric) => (
            <MetricChip key={metric.key} {...metric} />
          ))}
        </ScrollView>

        {showProfile ? (
          <HeaderButton
            icon={'person'}
            color={palette.primaryDark}
            label={profileAccessibilityLabel}
            onPress={openProfile}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  container: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xs,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: alpha(palette.borderStrong, 0.9),
    backgroundColor: alpha(palette.surface, 0.94),
    ...shadows.sm,
  },
  metricsScroll: {
    flex: 1,
  },
  metrics: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xxs,
  },
  metricChip: {
    minWidth: 45,
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  metricValue: {
    maxWidth: 54,
    color: palette.text,
    fontSize: 12,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  headerButton: {
    width: 38,
    height: 38,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  headerButtonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.96 }],
  },
});

export default StatusHeader;
