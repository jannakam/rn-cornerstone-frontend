import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, Theme } from 'tamagui';
import { useFonts } from 'expo-font';
import config from './tamagui.config';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './src/navigation/DrawerNav/DrawerNavigation';
import Navigation from './src/navigation/DrawerNav/index';

export default function App() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name="dark">
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
        <StatusBar style="auto" />
      </Theme>
    </TamaguiProvider>
  );
}