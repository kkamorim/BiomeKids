import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  alpha,
  gradients,
  layout,
  palette,
  radius,
} from '../../theme/designSystem';

export function AppBackground({
  children,
  colors: customColors,
  gradientColors,
  locations,
  safeArea = true,
  safeAreaEdges = ['top', 'left', 'right'],
  maxWidth = layout.maxContentWidth,
  decorations = true,
  decorationColors = [palette.primary, palette.secondary, palette.warning],
  style,
  contentStyle,
  ...gradientProps
}) {
  const resolvedColors = customColors || gradientColors || gradients.app;
  const content = (
    <View
      style={[
        styles.content,
        maxWidth !== false && maxWidth != null ? { maxWidth } : null,
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <LinearGradient
      colors={resolvedColors}
      locations={locations}
      style={[styles.container, style]}
      {...gradientProps}
    >
      {decorations ? (
        <View
          pointerEvents={'none'}
          accessibilityElementsHidden
          importantForAccessibility={'no-hide-descendants'}
          style={StyleSheet.absoluteFill}
        >
          <View
            style={[
              styles.orb,
              styles.orbTop,
              { backgroundColor: alpha(decorationColors[0] || palette.primary, 0.1) },
            ]}
          />
          <View
            style={[
              styles.orb,
              styles.orbRight,
              { backgroundColor: alpha(decorationColors[1] || palette.secondary, 0.09) },
            ]}
          />
          <View
            style={[
              styles.orb,
              styles.orbBottom,
              { backgroundColor: alpha(decorationColors[2] || palette.warning, 0.08) },
            ]}
          />
          <View style={[styles.sprout, styles.sproutLeft]}>
            <View
              style={[
                styles.leaf,
                styles.leafLeft,
                { backgroundColor: alpha(decorationColors[0] || palette.primary, 0.12) },
              ]}
            />
            <View
              style={[
                styles.leaf,
                styles.leafRight,
                { backgroundColor: alpha(decorationColors[1] || palette.secondary, 0.1) },
              ]}
            />
          </View>
        </View>
      ) : null}

      {safeArea ? (
        <SafeAreaView style={styles.viewport} edges={safeAreaEdges}>
          {content}
        </SafeAreaView>
      ) : (
        <View style={styles.viewport}>{content}</View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  viewport: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  orb: {
    position: 'absolute',
    borderRadius: radius.round,
  },
  orbTop: {
    width: 280,
    height: 280,
    top: -150,
    right: -80,
  },
  orbRight: {
    width: 180,
    height: 180,
    top: '36%',
    right: -105,
  },
  orbBottom: {
    width: 240,
    height: 240,
    bottom: -145,
    left: -90,
  },
  sprout: {
    position: 'absolute',
    width: 94,
    height: 86,
  },
  sproutLeft: {
    left: -24,
    top: '18%',
    transform: [{ rotate: '-12deg' }],
  },
  leaf: {
    position: 'absolute',
    width: 58,
    height: 34,
    borderTopLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  leafLeft: {
    left: 0,
    bottom: 8,
    transform: [{ rotate: '25deg' }],
  },
  leafRight: {
    right: 0,
    top: 8,
    transform: [{ rotate: '-145deg' }],
  },
});

export default AppBackground;
