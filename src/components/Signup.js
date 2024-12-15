import React from "react";
import { ScrollView } from "react-native";
import { XStack, YStack, Text, Input, Button } from "tamagui";

const Signup = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#1A1A1A" }}>
      <YStack padding="$4" space="$4" width="100%" minHeight="100%">
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
          >
            Register
          </Text>

          <Text color="gray" fontSize={14} textAlign="center" marginBottom="$6">
            Start your earning journey, and we will be with you every step of
            the way.
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
                Phone number
              </Text>
              <Input
                backgroundColor="#2A2A2A"
                borderColor="#333"
                borderWidth={1}
                padding="$4"
                color="white"
                keyboardType="phone-pad"
              />
            </YStack>

            <YStack space="$2">
              <Text color="gray" fontSize={14}>
                New password
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

            <YStack space="$2">
              <Text color="gray" fontSize={14}>
                City
              </Text>
              <Input
                backgroundColor="#2A2A2A"
                borderColor="#333"
                borderWidth={1}
                padding="$4"
                color="white"
              />
            </YStack>
          </YStack>

          <Button backgroundColor="#333" color="white" size="$7" marginTop="$4">
            Register
          </Button>

          <XStack justifyContent="center" marginTop="$4" marginBottom="$4">
            <Text color="gray" fontSize={14}>
              Already have an account?{" "}
            </Text>
            <Text color="white" fontSize={14} fontWeight="bold">
              Login
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default Signup;
