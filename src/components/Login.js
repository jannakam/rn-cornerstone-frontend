import React, { useState } from "react";

import { Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { XStack, YStack, Text, Input, Button, useTheme } from "tamagui";

import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { login } from "../api/Auth";

const Login = () => {
  const { loggedIn } = useUser();
  const navigation = useNavigation();
  const theme = useTheme();
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: () => login(userInfo),
    onSuccess: (data) => {
      Alert.alert("Success", "Login successful!");
      loggedIn({
        id: data.id,
        username: data.username,
        role: data.role,
      });
    },
    onError: (error) => {
      console.log(error);
      Alert.alert("Error", "Login failed. Please check your credentials and try again.");
    },
  });

  const handleLogin = () => {
    if (!userInfo.username || !userInfo.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    mutate();
  };

  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <YStack
        f={1}
        bg="$background"
        width="100%"
        ai="center"
        jc="center"
        space="$6"
      >
        <YStack space="$4" ai="center" mb="$4">
          <Text color="$color" fontSize="$9" fontWeight="bold">
            Welcome Back
          </Text>
          <Text color="$color" opacity={0.7} fontSize="$4">
            It's nice to see you again!
          </Text>
        </YStack>

        <YStack space="$4" width="85%" maxWidth={400}>
          <Input
            size="$4"
            borderWidth={2}
            borderRadius="$10"
            backgroundColor="$backgroundTransparent"
            borderColor="$color4"
            color="white"
            focusStyle={{
              borderColor: theme.cyan8.val,
            }}
            placeholder="Username"
            placeholderTextColor="$color8"
            value={userInfo.username}
            onChangeText={(text) => setUserInfo({ ...userInfo, username: text })}
          />

          <Input
            size="$4"
            borderWidth={2}
            borderRadius="$10"
            backgroundColor="$backgroundTransparent"
            borderColor="$color4"
            color="white"
            focusStyle={{
              borderColor: theme.cyan8.val,
            }}
            placeholder="Password"
            placeholderTextColor="$color8"
            secureTextEntry
            value={userInfo.password}
            onChangeText={(text) => setUserInfo({ ...userInfo, password: text })}
          />

          <Button
            size="$4"
            borderRadius="$10"
            backgroundColor="$background"
            borderColor={theme.cyan8.val}
            borderWidth={2}
            color={theme.cyan8.val}
            onPress={handleLogin}
            disabled={isLoading}
            pressStyle={{ opacity: 0.8 }}
            marginTop="$4"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </YStack>

        <XStack space="$2" marginTop="$4">
          <Text color="$color" opacity={0.7}>
            Don't have an account?
          </Text>
          <Text
            color={theme.cyan8.val}
            fontWeight="bold"
            onPress={() => navigation.navigate("Register")}
            pressStyle={{ opacity: 0.8 }}
          >
            Register
          </Text>
        </XStack>
      </YStack>
    </TouchableWithoutFeedback>

  );
};

export default Login;
