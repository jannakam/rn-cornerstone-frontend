import React, { useState } from "react";
import { Alert } from "react-native";
import { XStack, YStack, Text, Input, Button } from "tamagui";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { login } from "../api/Auth";
const Login = () => {
  const { loggedIn } = useUser();
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
  });
  const { mutate } = useMutation({
    mutationFn: () => login(userInfo),
    onSuccess: () => {
      Alert.alert("LogIn successful");
      loggedIn(userInfo);
    },
    onError: (error) => {
      console.log(error);
      Alert.alert("LogIn failed");
    },
  });

  const handleLogin = () => {
    mutate();
  };

  return (
    <YStack
      flex={1}
      backgroundColor="#1A1A1A"
      padding="$4"
      space="$4"
      width="100%"
      height="100%"
    >
      <XStack padding="$4">
        <Text
          color="#333"
          fontSize={50}
          onPress={() => navigation.navigate("Register")}
          pressStyle={{ opacity: 0.7 }}
        >
          ×
        </Text>
      </XStack>

      <YStack space="$6" marginTop="$8">
        <Text
          color="white"
          fontSize={32}
          fontWeight="bold"
          textAlign="center"
          marginBottom="$10"
        >
          Login
        </Text>

        <YStack space="$4" marginTop="$4">
          <YStack space="$2">
            <Text color="gray" fontSize={14}>
              Username
            </Text>
            <Input
              backgroundColor="#2A2A2A"
              borderColor="#333"
              borderWidth={1}
              padding="$1"
              color="white"
              placeholderTextColor="gray"
              value={userInfo.username}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, username: text })
              }
            />
          </YStack>

          <YStack space="$2">
            <Text color="gray" fontSize={14}>
              Password
            </Text>
            <Input
              backgroundColor="#2A2A2A"
              borderColor="#333"
              borderWidth={1}
              padding="$1"
              color="white"
              placeholderTextColor="gray"
              secureTextEntry
              value={userInfo.password}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, password: text })
              }
            />
          </YStack>
        </YStack>

        <Button
          backgroundColor="#333"
          color="white"
          size="$4"
          marginTop="$4"
          onPress={() => handleLogin()}
        >
          Login
        </Button>

        <XStack justifyContent="center" marginTop="$4">
          <Text color="gray" fontSize={14}>
            Don't have an account?{" "}
          </Text>
          <Text
            color="white"
            fontSize={14}
            fontWeight="bold"
            onPress={() => navigation.navigate("Register")}
          >
            Register
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
};

export default Login;
