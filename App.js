import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { TamaguiProvider, Theme } from "tamagui";
import { useFonts } from "expo-font";
import config from "./tamagui.config";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DrawerNavigation from "./src/navigation/DrawerNav/DrawerNavigation";
import Navigation from "./src/navigation/DrawerNav/index";
import AuthNavigation from "./src/navigation/AuthNav/AuthNavigation";
import { Platform, useColorScheme } from "react-native";
import React, { createContext, useEffect } from "react";
import { UserProvider, useUser } from "./src/context/UserContext";

export const ThemeContext = createContext({
  isDark: true,
  setIsDark: () => {},
});

// Create a client
const queryClient = new QueryClient();

const MainApp = () => {
  const { isAuthenticated } = useUser();
  const [isDark, setIsDark] = React.useState(true);
  const systemTheme = useColorScheme();

  useEffect(() => {
    setIsDark(systemTheme);
  }, [systemTheme]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <Theme name={isDark ? "dark" : "light"}>
        <SafeAreaProvider backgroundColor={isDark ? "$color_dark" : "$color"}>
          <NavigationContainer>
            {isAuthenticated ? <DrawerNavigation /> : <AuthNavigation />}
          </NavigationContainer>
        </SafeAreaProvider>
        <StatusBar
          style={isDark ? "light" : "dark"}
          backgroundColor="transparent"
          translucent={Platform.OS === "android"}
        />
      </Theme>
    </ThemeContext.Provider>
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
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config}>
        <UserProvider>
          <MainApp />
        </UserProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
