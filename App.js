import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { TamaguiProvider, Theme } from "tamagui";
import { useFonts } from "expo-font";
import config from "./tamagui.config";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigation from "./src/navigation/DrawerNav/DrawerNavigation";
import Navigation from "./src/navigation/DrawerNav/index";
import AuthNavigation from "./src/navigation/AuthNav/AuthNavigation";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import GetStartedScreen from "./src/screens/GetStartedScreen";

export default function App() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <SafeAreaProvider>
          {/* <Navigation /> */}
          {/* <AuthNavigation /> */}
          {/* <RegisterScreen /> */}
          <GetStartedScreen />
        </SafeAreaProvider>
        <StatusBar style="auto" />
      </Theme>
    </TamaguiProvider>
  );
}
