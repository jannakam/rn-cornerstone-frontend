import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { TamaguiProvider, Theme } from "tamagui";
import { useFonts } from "expo-font";
import tamaguiConfig from "./tamagui.config";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DrawerNavigation from "./src/navigation/DrawerNav/DrawerNavigation";
import Navigation from "./src/navigation/DrawerNav/index";
import AuthNavigation from "./src/navigation/AuthNav/AuthNavigation";
import { Platform } from "react-native";
import React from "react";
import { UserProvider, useUser } from "./src/context/UserContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { ChallengeProvider } from "./src/context/ChallengeContext";

const queryClient = new QueryClient();

const MainApp = () => {
  const { isAuthenticated } = useUser();
  const { isDark } = useTheme();

  return (
    <NavigationContainer>
      <Theme name={isDark ? "dark" : "light"}>
        {isAuthenticated ? <Navigation /> : <AuthNavigation />}
        <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor="transparent"
        translucent={Platform.OS === "android"}
      />
    </Theme>
    </NavigationContainer>
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
      <TamaguiProvider config={tamaguiConfig}>
        <ThemeProvider>
          <UserProvider>
            <ChallengeProvider>
              <MainApp />
            </ChallengeProvider>
          </UserProvider>
        </ThemeProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
