import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { TamaguiProvider, Theme } from "tamagui";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DrawerNavigation from "./src/navigation/DrawerNav/DrawerNavigation";
import Navigation from "./src/navigation/DrawerNav/index";
import AuthNavigation from "./src/navigation/AuthNav/AuthNavigation";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import GetStartedScreen from "./src/screens/GetStartedScreen";
import { Platform, useColorScheme } from 'react-native';
import React, { createContext, useEffect } from 'react';
import tamaguiConfig from "./tamagui.config";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";



// Create a client
const queryClient = new QueryClient();


export const ThemeContext = createContext({
  isDark: true,
  setIsDark: () => {},
});


const ThemedApp = () => {
  const { isDark } = useTheme();
  
  return (
    <Theme name={isDark ? "dark" : "light"}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Navigation />
    </Theme>
  );
};

export default function App() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </TamaguiProvider>
  );
}
