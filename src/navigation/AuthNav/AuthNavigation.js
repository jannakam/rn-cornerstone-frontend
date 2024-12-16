import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../../screens/RegisterScreen";
import GetStarted from "../../components/GetStarted";
import LoginScreen from "../../screens/LoginScreen";

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Register"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
