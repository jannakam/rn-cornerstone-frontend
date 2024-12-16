import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, Theme } from 'tamagui';
import { useFonts } from 'expo-font';
import config from './tamagui.config';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './src/navigation/DrawerNav/DrawerNavigation';
import Navigation from './src/navigation/DrawerNav/index';
import { Platform, useColorScheme } from 'react-native';
import React, { createContext, useEffect } from 'react';

export const ThemeContext = createContext({
  isDark: true,
  setIsDark: () => {},
});

export default function App() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const [isDark, setIsDark] = React.useState(true);
  const systemTheme = useColorScheme();

  useEffect(() => {
    setIsDark(systemTheme);
  }, [systemTheme]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <ThemeContext.Provider value={{ isDark, setIsDark }}>
        <Theme name={isDark ? "dark" : "light"}>
          <SafeAreaProvider backgroundColor={isDark ? "$color_dark" : "$color"}>
            <Navigation />
            <StatusBar 
              style={isDark ? "light" : "dark"}
              backgroundColor="transparent"
              translucent={Platform.OS === 'android'}
            />
          </SafeAreaProvider>
        </Theme>
      </ThemeContext.Provider>
    </TamaguiProvider>
  );
}

