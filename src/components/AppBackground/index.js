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
  const contourOne = decorationColors[0] || palette.moss;
  const contourTwo = decorationColors[1] || palette.river;
  const marginColor = decorationColors[2] || palette.clay;
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
          <View style={[styles.paperWash, { backgroundColor: alpha(palette.paper, 0.18) }]} />
          <View style={[styles.marginLine, { backgroundColor: alpha(marginColor, 0.24) }]} />
          <View style={[styles.marginTick, { backgroundColor: alpha(marginColor, 0.2) }]} />

          <View
            style={[
              styles.contour,
              styles.contourTopOuter,
              { borderColor: alpha(contourOne, 0.11) },
            ]}
          />
          <View
            style={[
              styles.contour,
              styles.contourTopMiddle,
              { borderColor: alpha(contourOne, 0.1) },
            ]}
          />
          <View
            style={[
              styles.contour,
              styles.contourTopInner,
              { borderColor: alpha(contourOne, 0.09) },
            ]}
          />
          <View
            style={[
              styles.contour,
              styles.contourBottomOuter,
              { borderColor: alpha(contourTwo, 0.1) },
            ]}
          />
          <View
            style={[
              styles.contour,
              styles.contourBottomInner,
              { borderColor: alpha(contourTwo, 0.09) },
            ]}
          />
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
  paperWash: {
    ...StyleSheet.absoluteFillObject,
  },
  marginLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 25,
    width: 1,
  },
  marginTick: {
    position: 'absolute',
    top: 92,
    left: 17,
    width: 17,
    height: 1,
  },
  contour: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: radius.round,
    backgroundColor: palette.transparent,
  },
  contourTopOuter: {
    width: 370,
    height: 205,
    top: -91,
    right: -178,
    transform: [{ rotate: '-10deg' }],
  },
  contourTopMiddle: {
    width: 300,
    height: 158,
    top: -66,
    right: -143,
    transform: [{ rotate: '-10deg' }],
  },
  contourTopInner: {
    width: 226,
    height: 112,
    top: -41,
    right: -104,
    transform: [{ rotate: '-10deg' }],
  },
  contourBottomOuter: {
    width: 330,
    height: 190,
    right: -205,
    bottom: 74,
    transform: [{ rotate: '15deg' }],
  },
  contourBottomInner: {
    width: 248,
    height: 136,
    right: -162,
    bottom: 102,
    transform: [{ rotate: '15deg' }],
  },
});

export default AppBackground;
