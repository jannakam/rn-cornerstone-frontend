import { createMedia } from '@tamagui/react-native-media-driver';
import { createFont, createTamagui } from 'tamagui';
import { createAnimations } from '@tamagui/animations-react-native';
import { tokens, themes, lightColors, darkColors } from '@tamagui/themes';
import { shorthands } from '@tamagui/shorthands';

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
  shouldAddPrefersColorThemes: true, 
  themeClassNameOnRoot: true,
  tokens,
  themes, 
  fonts: {
    body: interFont,
    heading: interFont, 
  },
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 661 },
    gtSm: { minWidth: 801 },
    gtMd: { minWidth: 1021 },
    gtLg: { minWidth: 1281 },
    short: { maxHeight: 820 },
    tall: { minHeight: 821 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
  shorthands, // Adds support for shorthand properties
});

export default config;
