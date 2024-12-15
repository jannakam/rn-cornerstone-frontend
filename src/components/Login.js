import React from "react";
import { XStack, YStack, Text, Input, Button } from "tamagui";

const Login = () => {
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
        <Text color="#333" fontSize={50}>
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
              padding="$4"
              color="white"
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
              padding="$4"
              color="white"
              secureTextEntry
            />
          </YStack>
        </YStack>

        <Button
          backgroundColor="#333"
          color="white"
          size="$7"
          marginTop="$4"
        >
          Login
        </Button>

        <XStack justifyContent="center" marginTop="$4">
          <Text color="gray" fontSize={14}>
            Don't have an account?{" "}
          </Text>
          <Text color="white" fontSize={14} fontWeight="bold">
            Register
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
};

export default Login;
