import { createTamagui, createFont, createTokens } from "tamagui";
import { config } from "@tamagui/config/v2";
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'

const interFont = createFont({
  family: "Inter",
  ...config.fonts.body,
});

// Custom color scales
const customColors = {
  magenta: {
    1: '#FAF2FB',
    2: '#F5E5F7',
    3: '#EED4F2',
    4: '#E6C2ED',
    5: '#DFB1E8',
    6: '#D894E3',
    7: '#D27CE0', // Your provided color
    8: '#C65ADB',
    9: '#B840D2',
    10: '#A428C3',
    11: '#8B1BA6',
    12: '#6F1485'
  },
  lime: {
    1: '#F8FDF4',
    2: '#F1FCE9',
    3: '#E8F9DD',
    4: '#DFF6D1',
    5: '#D5F3C4',
    6: '#CCF0B7',
    7: '#C8ED8C', // Your provided color
    8: '#B9E97A',
    9: '#A9E468',
    10: '#98DE55',
    11: '#82D438',
    12: '#6BC21E'
  },
  cyan: {
    1: '#EDFAFA',
    2: '#DBF5F5',
    3: '#C7EFEF',
    4: '#B2E9E9',
    5: '#9CE3E3',
    6: '#85DDDD',
    7: '#37C8C3', // Your provided color
    8: '#2BB4AF',
    9: '#1F9E99',
    10: '#148783',
    11: '#0A706C',
    12: '#005753'
  }
};

const customTokens = createTokens({
  ...tokens,
  color: {
    ...tokens.color,
    ...customColors,
  }
});

// Create theme colors
const lightTheme = {
  ...themes.light,
  magenta1: customColors.magenta[1],
  magenta2: customColors.magenta[2],
  magenta3: customColors.magenta[3],
  magenta4: customColors.magenta[4],
  magenta5: customColors.magenta[5],
  magenta6: customColors.magenta[6],
  magenta7: customColors.magenta[7],
  magenta8: customColors.magenta[8],
  magenta9: customColors.magenta[9],
  magenta10: customColors.magenta[10],
  magenta11: customColors.magenta[11],
  magenta12: customColors.magenta[12],
  lime1: customColors.lime[1],
  lime2: customColors.lime[2],
  lime3: customColors.lime[3],
  lime4: customColors.lime[4],
  lime5: customColors.lime[5],
  lime6: customColors.lime[6],
  lime7: customColors.lime[7],
  lime8: customColors.lime[8],
  lime9: customColors.lime[9],
  lime10: customColors.lime[10],
  lime11: customColors.lime[11],
  lime12: customColors.lime[12],
  cyan1: customColors.cyan[1],
  cyan2: customColors.cyan[2],
  cyan3: customColors.cyan[3],
  cyan4: customColors.cyan[4],
  cyan5: customColors.cyan[5],
  cyan6: customColors.cyan[6],
  cyan7: customColors.cyan[7],
  cyan8: customColors.cyan[8],
  cyan9: customColors.cyan[9],
  cyan10: customColors.cyan[10],
  cyan11: customColors.cyan[11],
  cyan12: customColors.cyan[12],
};

const darkTheme = {
  ...themes.dark,
  magenta1: customColors.magenta[1],
  magenta2: customColors.magenta[2],
  magenta3: customColors.magenta[3],
  magenta4: customColors.magenta[4],
  magenta5: customColors.magenta[5],
  magenta6: customColors.magenta[6],
  magenta7: customColors.magenta[7],
  magenta8: customColors.magenta[8],
  magenta9: customColors.magenta[9],
  magenta10: customColors.magenta[10],
  magenta11: customColors.magenta[11],
  magenta12: customColors.magenta[12],
  lime1: customColors.lime[1],
  lime2: customColors.lime[2],
  lime3: customColors.lime[3],
  lime4: customColors.lime[4],
  lime5: customColors.lime[5],
  lime6: customColors.lime[6],
  lime7: customColors.lime[7],
  lime8: customColors.lime[8],
  lime9: customColors.lime[9],
  lime10: customColors.lime[10],
  lime11: customColors.lime[11],
  lime12: customColors.lime[12],
  cyan1: customColors.cyan[1],
  cyan2: customColors.cyan[2],
  cyan3: customColors.cyan[3],
  cyan4: customColors.cyan[4],
  cyan5: customColors.cyan[5],
  cyan6: customColors.cyan[6],
  cyan7: customColors.cyan[7],
  cyan8: customColors.cyan[8],
  cyan9: customColors.cyan[9],
  cyan10: customColors.cyan[10],
  cyan11: customColors.cyan[11],
  cyan12: customColors.cyan[12],
};

const tamaguiConfig = {
  ...config,
  fonts: {
    ...config.fonts,
    body: interFont,
    heading: interFont,
  },
  tokens: customTokens,
  themes: {
    ...themes,
    light: lightTheme,
    dark: darkTheme,
  },
  shorthands,
};

export default createTamagui(tamaguiConfig);
