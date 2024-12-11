import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, XStack, YStack, Text, Theme, View } from 'tamagui';  // Updated import
import appConfig from './tamagui.config';

export default function App() {
  return (
    <TamaguiProvider config={appConfig}>
      <Theme name="light">
        <Theme name="green">
          <StatusBar style="auto" />
          <View f={1}>
            <YStack f={1} bg="$background" ai="center" jc="center">
              <XStack ai="center">
                <Text fontSize="$5" fontWeight="bold">
                  Welcome to Tamagui + Expo
                </Text>
              </XStack>
            </YStack>
          </View>
        </Theme>
      </Theme>
    </TamaguiProvider>
  );
}