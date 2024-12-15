import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { Text, YStack, XStack, Switch, Theme } from "tamagui";
import {
  Home as HomeIcon,
  MapPinned,
  Footprints,
  User,
  Store as StoreIcon,
  Moon,
  Sun,
} from "@tamagui/lucide-icons";
import { SideMenu } from "../../components/SideMenu";
import Home from "../../screens/Home";
import Events from "../../screens/Events";
import Steps from "../../screens/Steps";
import Profile from "../../screens/Profile";
import Store from "../../screens/Store";
import EventDetail from "../../screens/EventDetail";
import { useTheme } from "../../context/ThemeContext";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const CustomDrawerContent = (props) => {
  const { isDark, setIsDark } = useTheme();

  return (
    <Theme name={isDark ? "dark" : "light"}>
      <YStack f={1} pt={Platform.OS === "ios" ? "$8" : "$6"}>
        {/* Navigation Items */}
        <YStack f={1} space="$3" pt="$4">
          <XStack
            pressStyle={{ opacity: 0.7 }}
            px="$8"
            py="$2"
            ai="center"
            jc="space-between"
            space="$2"
            hoverStyle={{ bg: "$backgroundHover" }}
            onPress={() => props.navigation.navigate("Home")}
          >
            <Text color="$color">Home</Text>
            <HomeIcon size={18} color="$color" />
          </XStack>

          <XStack
            pressStyle={{ opacity: 0.7 }}
            px="$8"
            py="$2"
            ai="center"
            jc="space-between"
            space="$2"
            hoverStyle={{ bg: "$backgroundHover" }}
            onPress={() => props.navigation.navigate("Events")}
          >
            <Text color="$color">Events</Text>
            <MapPinned size={18} color="$color" />
          </XStack>

          <XStack
            pressStyle={{ opacity: 0.7 }}
            px="$8"
            py="$2"
            ai="center"
            jc="space-between"
            space="$2"
            hoverStyle={{ bg: "$backgroundHover" }}
            onPress={() => props.navigation.navigate("Steps")}
          >
            <Text color="$color">Steps</Text>
            <Footprints size={18} color="$color" />
          </XStack>

          <XStack
            pressStyle={{ opacity: 0.7 }}
            px="$8"
            py="$2"
            ai="center"
            jc="space-between"
            space="$2"
            hoverStyle={{ bg: "$backgroundHover" }}
            onPress={() => props.navigation.navigate("Profile")}
          >
            <Text color="$color">Profile</Text>
            <User size={18} color="$color" />
          </XStack>

          <XStack
            pressStyle={{ opacity: 0.7 }}
            px="$8"
            py="$2"
            ai="center"
            jc="space-between"
            space="$2"
            hoverStyle={{ bg: "$backgroundHover" }}
            onPress={() => props.navigation.navigate("Store")}
          >
            <Text color="$color">Store</Text>
            <StoreIcon size={18} color="$color" />
          </XStack>

          {/* Theme Toggle */}
          <XStack py="$4" ai="center" jc="space-between" px="$8">
            <XStack space="$2" ai="center">
              {isDark ? (
                <Moon size={16} color="$color" />
              ) : (
                <Sun size={16} color="$color" />
              )}
            </XStack>
            <Switch
              id="dark-mode"
              size="$3"
              checked={isDark}
              onCheckedChange={(checked) => setIsDark(checked)}
            >
              <Switch.Thumb animation="quick" />
            </Switch>
          </XStack>
        </YStack>
      </YStack>
    </Theme>
  );
};

const EventsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventsScreen" component={Events} />
      <Stack.Screen name="EventDetail" component={EventDetail} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="EventDetail" component={EventDetail} />
    </Stack.Navigator>
  );
};

const StepsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StepsScreen" component={Steps} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={Profile} />
    </Stack.Navigator>
  );
};

const StoreStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StoreScreen" component={Store} />
    </Stack.Navigator>
  );
};

const DrawerNavigation = () => {
  const { isDark } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerType="slide"
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "transparent",
        drawerInactiveBackgroundColor: "transparent",
        drawerActiveTintColor: isDark ? "#fff" : "#000",
        drawerInactiveTintColor: isDark ? "#eee" : "#666",
        overlayColor: "transparent",
        drawerStyle: {
          backgroundColor: isDark ? "$background" : "$color",
          width: "60%",
        },
        sceneContainerStyle: {
          backgroundColor: isDark ? "$background" : "$color",
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          drawerIcon: ({ color }) => <HomeIcon size={18} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Events"
        component={EventsStack}
        options={{
          drawerIcon: ({ color }) => <MapPinned size={18} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Steps"
        component={StepsStack}
        options={{
          drawerIcon: ({ color }) => <Footprints size={18} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          drawerIcon: ({ color }) => <User size={18} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Store"
        component={StoreStack}
        options={{
          drawerIcon: ({ color }) => <StoreIcon size={18} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
