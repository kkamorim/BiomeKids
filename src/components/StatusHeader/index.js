import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGame } from '../../contexts/GameContext';
import {
  alpha,
  layout,
  palette,
  radius,
  spacing,
} from '../../theme/designSystem';

const ROUTE_METRICS = Object.freeze({
  Journey: ['streak', 'hearts', 'fuel'],
  Lesson: ['hearts', 'fuel'],
  Evolution: ['ecoPoints', 'coins'],
  Expedition: ['ecoPoints', 'coins', 'diamonds'],
  Missoes: ['streak', 'fuel'],
  Colecao: ['collection', 'coins'],
  Loja: ['coins', 'diamonds'],
  Biomas: ['streak', 'collection'],
});

const VARIANT_METRICS = Object.freeze({
  study: ['streak', 'hearts', 'fuel'],
  expedition: ['ecoPoints', 'coins', 'diamonds'],
  economy: ['coins', 'diamonds'],
  collection: ['collection', 'coins'],
});

const DEFAULT_METRICS = ['streak', 'coins', 'diamonds'];

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

function MetricContent({ icon, color, value }) {
  return (
    <>
      <Ionicons name={icon} size={17} color={color} />
      <Text style={styles.metricValue} numberOfLines={1}>
        {formatMetric(value)}
      </Text>
    </>
  );
}

function MetricChip({ icon, color, value, label, onPress }) {
  const accessibilityLabel = label + ': ' + formatMetric(value);

  if (onPress) {
    return (
      <Pressable
        accessibilityRole={'button'}
        accessibilityLabel={accessibilityLabel + '. Abrir loja'}
        hitSlop={4}
        onPress={onPress}
        style={({ pressed }) => [
          styles.metricChip,
          { borderBottomColor: alpha(color, 0.48) },
          pressed && styles.metricChipPressed,
        ]}
      >
        <MetricContent icon={icon} color={color} value={value} />
      </Pressable>
    );
  }

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.metricChip, { borderBottomColor: alpha(color, 0.48) }]}
    >
      <MetricContent icon={icon} color={color} value={value} />
    </View>
  );
}

function HeaderButton({ icon, color, label, onPress, emphasis = false }) {
  return (
    <Pressable
      accessibilityRole={'button'}
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.headerButton,
        emphasis && styles.headerButtonEmphasis,
        pressed && styles.headerButtonPressed,
      ]}
    >
      <Ionicons name={icon} size={21} color={color} />
    </Pressable>
  );
}

export function StatusHeader({
  showProfile = true,
  showBiomes = false,
  showShop = true,
  onProfilePress,
  onBiomesPress,
  onShopPress,
  profileRoute = 'Perfil',
  biomesRoute = 'Biomas',
  shopRoute = 'Loja',
  profileAccessibilityLabel = 'Abrir perfil',
  biomesAccessibilityLabel = 'Escolher bioma',
  shopAccessibilityLabel = 'Abrir posto de suprimentos',
  variant,
  metrics: requestedMetrics,
  streak,
  coins,
  diamonds,
  hearts,
  fuel,
  style,
}) {
  const navigation = useNavigation();
  const route = useRoute();
  const game = useGame();
  const state = game?.gameState || game || {};
  const routeName = route?.name;

  const openProfile = onProfilePress || (() => navigation.navigate(profileRoute));
  const openBiomes = onBiomesPress || (() => navigation.navigate(biomesRoute));
  const openShop = onShopPress || (() => navigation.navigate(shopRoute));

  const metricDefinitions = {
    streak: {
      key: 'streak',
      label: 'Sequência',
      icon: 'flame',
      color: palette.streak,
      value: firstDefined(streak, state.dailyStreak, state.streak, 0),
    },
    coins: {
      key: 'coins',
      label: 'Moedas',
      icon: 'cash',
      color: palette.coin,
      value: firstDefined(coins, game?.coins, state.coins, 0),
      onPress: openShop,
    },
    diamonds: {
      key: 'diamonds',
      label: 'Diamantes',
      icon: 'diamond',
      color: palette.diamond,
      value: firstDefined(diamonds, state.diamonds, state.gems, state.crystals, 0),
      onPress: openShop,
    },
    hearts: {
      key: 'hearts',
      label: 'Corações',
      icon: 'heart',
      color: palette.heart,
      value: firstDefined(hearts, state.hearts, state.lives, 5),
    },
    fuel: {
      key: 'fuel',
      label: 'Combustível',
      icon: 'flash',
      color: palette.fuel,
      value: firstDefined(fuel, state.fuel, state.energy, 5),
    },
    ecoPoints: {
      key: 'ecoPoints',
      label: 'Pontos ecológicos',
      icon: 'leaf',
      color: palette.moss,
      value: firstDefined(
        game?.activeBiomeProgress?.ecoPoints,
        state.biomeProgress?.[state.activeBiomeId]?.ecoPoints,
        0
      ),
    },
    collection: {
      key: 'collection',
      label: 'Registros no caderno',
      icon: 'library',
      color: palette.bark,
      value: Array.isArray(state.collection) ? state.collection.length : 0,
    },
  };

  const resolvedMetricRequest = Array.isArray(requestedMetrics)
    ? requestedMetrics
    : VARIANT_METRICS[variant] || ROUTE_METRICS[routeName] || DEFAULT_METRICS;
  const visibleMetrics = resolvedMetricRequest
    .map((metric) => {
      if (typeof metric === 'string') return metricDefinitions[metric];
      if (!metric || typeof metric !== 'object') return null;
      return {
        ...(metricDefinitions[metric.key] || {}),
        ...metric,
      };
    })
    .filter((metric) => metric?.key);

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
          {visibleMetrics.map((metric) => (
            <MetricChip key={metric.key} {...metric} />
          ))}
        </ScrollView>

        {showShop && routeName !== shopRoute ? (
          <HeaderButton
            icon={'storefront-outline'}
            color={palette.bark}
            label={shopAccessibilityLabel}
            onPress={openShop}
            emphasis
          />
        ) : null}

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
    paddingTop: spacing.xxs,
    paddingBottom: spacing.sm,
  },
  container: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderBottomWidth: 1,
    borderBottomColor: alpha(palette.borderStrong, 0.82),
    backgroundColor: alpha(palette.paperLight, 0.68),
  },
  metricsScroll: {
    flex: 1,
  },
  metrics: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.xxs,
  },
  metricChip: {
    minWidth: 44,
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 2,
    borderRadius: radius.xs,
    backgroundColor: alpha(palette.surface, 0.54),
  },
  metricChipPressed: {
    backgroundColor: palette.surfaceMuted,
  },
  metricValue: {
    maxWidth: 54,
    color: palette.text,
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  headerButton: {
    width: 36,
    height: 36,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: alpha(palette.surface, 0.58),
  },
  headerButtonEmphasis: {
    borderColor: alpha(palette.bark, 0.34),
    backgroundColor: alpha(palette.backgroundWarm, 0.78),
  },
  headerButtonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.96 }],
  },
});

export default StatusHeader;
