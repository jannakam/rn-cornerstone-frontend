import { createTamagui } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'

const appConfig = createTamagui({
  fonts: {
    body: createInterFont(),
    heading: createInterFont(),
  },
  themes,
  tokens,
  shorthands,
})

export default appConfig