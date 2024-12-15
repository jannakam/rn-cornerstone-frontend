import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './DrawerNavigation';
import { Theme } from 'tamagui';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

const Navigation = () => {
  const { isDark } = useTheme();

  return (
    <Theme name={isDark ? "dark" : "light"}>
      <SafeAreaProvider backgroundColor={isDark ? "black" : "white"}>
        <NavigationContainer>
          <DrawerNavigation />
          <StatusBar
            style={isDark ? "light" : "dark"}
            backgroundColor="transparent"
            translucent={Platform.OS === "android"}
          />
        </NavigationContainer>
      </SafeAreaProvider>
    </Theme>
  );
};

export default Navigation;