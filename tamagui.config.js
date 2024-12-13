import { createMedia } from '@tamagui/react-native-media-driver';
import { createFont, createTamagui } from 'tamagui';
import { createAnimations } from '@tamagui/animations-react-native';

const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
});

const interFont = createFont({
  family: 'Inter',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 20,
    5: 24,
    6: 32,
    true: 16,
  },
  lineHeight: {
    1: 18,
    2: 20,
    3: 24,
    4: 28,
    5: 32,
    6: 40,
    true: 24,
  },
  weight: {
    4: '300',
    5: '400',
    6: '600',
    true: '400',
  },
  letterSpacing: {
    4: 0,
    5: 0,
    6: -1,
    true: 0,
  },
});

const config = createTamagui({
  defaultFont: 'body',
  animations,
  fonts: {
    body: interFont,
    heading: interFont,
  },
  tokens: {
    size: {
      0: 0,
      1: 4,
      2: 8,
      3: 16,
      4: 24,
      5: 32,
      6: 40,
      7: 48,
      8: 56,
      9: 64,
      10: 72,
      11: 80,
      12: 88,
      13: 96,
      14: 104,
      15: 112,
      true: 16,
    },
    space: {
      0: 0,
      1: 4,
      2: 8,
      3: 16,
      4: 24,
      5: 32,
      6: 40,
      7: 48,
      8: 56,
      9: 64,
      10: 72,
      11: 80,
      12: 88,
      13: 96,
      14: 104,
      15: 112,
      true: 16,
    },
    radius: {
      0: 0,
      1: 4,
      2: 8,
      true: 4,
    },
    zIndex: {
      0: 0,
      1: 100,
      2: 200,
      true: 0,
    },
    color: {
      white: '#ffffff',
      black: '#000000',
      gray: '#888888',
      primary: '#1e90ff',
      secondary: '#ff6347',
    },
  },
  themes: {
    light: {
      background: '#ffffff',
      color: '#000000',
    },
    dark: {
      background: '#000000',
      color: '#ffffff',
    },
  },
  media: createMedia({
    sm: { maxWidth: 640 },
    md: { maxWidth: 768 },
    lg: { maxWidth: 1024 },
    xl: { minWidth: 1024 },
  }),
  shorthands: {
    p: 'padding',
    pt: 'paddingTop',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pr: 'paddingRight',
    m: 'margin',
    mt: 'marginTop',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mr: 'marginRight',
    w: 'width',
    h: 'height',
    bg: 'backgroundColor',
    rounded: 'borderRadius',
    jc: 'justifyContent',
    ai: 'alignItems',
    ta: 'textAlign',
  },
});

export default config;
