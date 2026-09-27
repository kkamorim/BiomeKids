import { Platform } from 'react-native';

export const palette = Object.freeze({
  primary: '#58CC02',
  primaryDark: '#3F9700',
  primaryDeep: '#245C16',
  primarySoft: '#DDF7C8',
  secondary: '#1CB0F6',
  secondaryDark: '#087FB5',
  secondarySoft: '#DDF4FF',

  background: '#F7FBF4',
  backgroundMuted: '#EEF7E9',
  backgroundWarm: '#FFF8E8',
  surface: '#FFFFFF',
  surfaceMuted: '#F3F7F0',
  surfaceRaised: '#FFFFFF',

  text: '#20331F',
  textStrong: '#152714',
  textMuted: '#687A65',
  textSubtle: '#8B9988',
  inverseText: '#FFFFFF',

  border: '#DCE8D7',
  borderStrong: '#C5D8BE',
  divider: '#E8EFE4',
  disabled: '#AEBBAA',
  disabledSurface: '#E8EEE5',

  success: '#43A047',
  warning: '#F5A623',
  danger: '#E84B4B',
  info: '#1CB0F6',

  streak: '#FF8A1F',
  coin: '#F2B91F',
  diamond: '#1CB0F6',
  heart: '#EF476F',
  fuel: '#5ABF41',

  forest: '#1B4332',
  soil: '#6D4C32',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
});

// colors is kept as a friendly alias for consumers that prefer that name.
export const colors = palette;

export const gradients = Object.freeze({
  app: [palette.background, palette.backgroundMuted, palette.backgroundWarm],
  forest: ['#F5FBEF', '#E4F5DC', '#FFF8E8'],
  sky: ['#E9F8FF', '#F5FCF2', '#FFF9EA'],
  primary: [palette.primary, '#70D91B'],
});

export const spacing = Object.freeze({
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
});

export const radius = Object.freeze({
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  pill: 999,
  round: 999,
});

export const layout = Object.freeze({
  maxContentWidth: 720,
  pageHorizontalPadding: spacing.lg,
  bottomNavHeight: 82,
});

export function alpha(color, opacity = 1) {
  const safeOpacity = Math.max(0, Math.min(1, Number(opacity) || 0));

  if (typeof color !== 'string' || !color.startsWith('#')) {
    return color;
  }

  let hex = color.slice(1);
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .slice(0, 3)
      .split('')
      .map((character) => character + character)
      .join('');
  }

  if (hex.length !== 6 && hex.length !== 8) {
    return color;
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + safeOpacity + ')';
}

export function createShadow({
  color = palette.forest,
  opacity = 0.12,
  y = 4,
  blur = 10,
  elevation = 4,
} = {}) {
  if (Platform.OS === 'web') {
    return {
      boxShadow: '0px ' + y + 'px ' + blur + 'px ' + alpha(color, opacity),
    };
  }

  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: y },
    shadowOpacity: opacity,
    shadowRadius: blur / 2,
    elevation,
  };
}

export const shadows = Object.freeze({
  sm: createShadow({ opacity: 0.08, y: 2, blur: 6, elevation: 2 }),
  md: createShadow({ opacity: 0.12, y: 4, blur: 12, elevation: 4 }),
  lg: createShadow({ opacity: 0.16, y: 8, blur: 22, elevation: 8 }),
});

const designSystem = {
  palette,
  colors,
  gradients,
  spacing,
  radius,
  shadows,
  layout,
  alpha,
  createShadow,
};

export default designSystem;
