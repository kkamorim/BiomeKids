import { Platform } from 'react-native';

export const palette = Object.freeze({
  // Caderno de campo: papel, tinta e pigmentos encontrados na paisagem.
  paper: '#F4EEDC',
  paperLight: '#FBF7EA',
  ink: '#26352F',
  moss: '#5F7849',
  bark: '#75553B',
  river: '#3F7180',
  sun: '#D19A3B',
  clay: '#B85E49',

  primary: '#5F7849',
  primaryDark: '#435C36',
  primaryDeep: '#293D2B',
  primarySoft: '#DEE5CB',
  secondary: '#3F7180',
  secondaryDark: '#2B5662',
  secondarySoft: '#DCE9E9',

  background: '#F4EEDC',
  backgroundMuted: '#EBE3CF',
  backgroundWarm: '#F5E7C8',
  surface: '#FBF7EA',
  surfaceMuted: '#EEE6D2',
  surfaceRaised: '#FFFBEF',

  text: '#26352F',
  textStrong: '#17251F',
  textMuted: '#657067',
  textSubtle: '#898B7C',
  inverseText: '#FFFBEF',

  border: '#D2C7AB',
  borderStrong: '#B7AA88',
  divider: '#DED4BA',
  disabled: '#A6A697',
  disabledSurface: '#E4DDCB',

  success: '#587C46',
  warning: '#D19A3B',
  danger: '#B7564A',
  info: '#3F7180',

  streak: '#D66D3D',
  coin: '#C58C27',
  diamond: '#3F8090',
  heart: '#B9565D',
  fuel: '#68884B',

  forest: '#244235',
  soil: '#75553B',
  white: '#FFFBEF',
  black: '#000000',
  transparent: 'transparent',
});

// colors is kept as a friendly alias for consumers that prefer that name.
export const colors = palette;

export const gradients = Object.freeze({
  app: [palette.paperLight, palette.paper, palette.backgroundMuted],
  forest: ['#F7F2E3', '#E8E5CF', '#DDE5CB'],
  sky: ['#EFF3E9', '#E3ECE8', '#DCE9E9'],
  primary: [palette.moss, palette.primaryDark],
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
  xs: 4,
  sm: 7,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  pill: 999,
  round: 999,
});

export const layout = Object.freeze({
  maxContentWidth: 720,
  pageHorizontalPadding: spacing.lg,
  bottomNavHeight: 80,
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
  color = palette.ink,
  opacity = 0.1,
  y = 3,
  blur = 8,
  elevation = 3,
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
  sm: createShadow({ opacity: 0.06, y: 1, blur: 4, elevation: 1 }),
  md: createShadow({ opacity: 0.09, y: 3, blur: 9, elevation: 3 }),
  lg: createShadow({ opacity: 0.12, y: 6, blur: 16, elevation: 6 }),
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
