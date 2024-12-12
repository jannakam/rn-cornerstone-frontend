import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, Theme, YStack } from 'tamagui';
import appConfig from './tamagui.config';
import Map from './src/components/Map';

export default function App() {
  return (
    <TamaguiProvider config={appConfig}>
      <Theme name="light">
        <YStack f={1} bg="$background">
          <StatusBar style="auto" />
          <Map />
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}