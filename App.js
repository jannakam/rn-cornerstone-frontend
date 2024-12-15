import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { TamaguiProvider, Theme } from "tamagui";
import { useFonts } from "expo-font";
import tamaguiConfig from "./tamagui.config";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation/DrawerNav/index";
import { Platform } from "react-native";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

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
