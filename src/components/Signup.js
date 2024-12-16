import React, { useState } from "react";
import { ScrollView, Alert } from "react-native";
import { XStack, YStack, Text, Input, Button } from "tamagui";
import { useNavigation } from "@react-navigation/native";

const Signup = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    phoneNumber: "",
    city: "",
  });

  const handleSignup = () => {
    if (
      !userInfo.username ||
      !userInfo.password ||
      !userInfo.phoneNumber ||
      !userInfo.city
    ) {
      Alert.alert("Please fill all fields");
      return;
    }
    navigation.navigate("GetStarted", { userInfo });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#1A1A1A" }}>
      <YStack padding="$4" space="$4" width="100%" minHeight="100%">
        <XStack padding="$4">
          <Text
            color="#333"
            fontSize={50}
            onPress={() => navigation.navigate("Login")}
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
                Phone number
              </Text>
              <Input
                backgroundColor="#2A2A2A"
                borderColor="#333"
                borderWidth={1}
                padding="$1"
                color="white"
                placeholderTextColor="gray"
                keyboardType="phone-pad"
                value={userInfo.phoneNumber}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, phoneNumber: text })
                }
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

            <YStack space="$2">
              <Text color="gray" fontSize={14}>
                City
              </Text>
              <Input
                backgroundColor="#2A2A2A"
                borderColor="#333"
                borderWidth={1}
                padding="$1"
                color="white"
                placeholderTextColor="gray"
                value={userInfo.city}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, city: text })
                }
              />
            </YStack>
          </YStack>

          <Button
            backgroundColor="#333"
            color="white"
            size="$4"
            marginTop="$4"
            onPress={() => handleSignup()}
          >
            Sign Up
          </Button>

          <XStack justifyContent="center" marginTop="$4" marginBottom="$4">
            <Text color="gray" fontSize={14}>
              Already have an account?{" "}
            </Text>
            <Text
              color="white"
              fontSize={14}
              fontWeight="bold"
              onPress={() => navigation.navigate("Login")}
            >
              Login
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default Signup;
