import React, { useState } from "react";
import { Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { XStack, YStack, Text, Input, Button, useTheme } from "tamagui";
import { useNavigation } from "@react-navigation/native";

const Signup = () => {
  const navigation = useNavigation();
  const theme = useTheme();
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
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    navigation.navigate("GetStarted", { userInfo });
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
            Create Account
          </Text>
          <Text color="$color" opacity={0.7} fontSize="$4">
            Start stepping. Start earning.
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
            placeholder="Phone number"
            placeholderTextColor="$color8"
            keyboardType="phone-pad"
            value={userInfo.phoneNumber}
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, phoneNumber: text })
            }
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
            placeholder="City"
            placeholderTextColor="$color8"
            value={userInfo.city}
            onChangeText={(text) => setUserInfo({ ...userInfo, city: text })}
          />

          <Button
            size="$4"
            borderRadius="$10"
            backgroundColor="$background"
            borderColor={theme.cyan8.val}
            borderWidth={2}
            color={theme.cyan8.val}
            onPress={handleSignup}
            pressStyle={{ opacity: 0.8 }}
            marginTop="$4"
          >
            Sign Up
          </Button>
        </YStack>

        <XStack space="$2" marginTop="$4">
          <Text color="$color" opacity={0.7}>
            Already have an account?
          </Text>
          <Text
            color={theme.cyan8.val}
            fontWeight="bold"
            onPress={() => navigation.navigate("Login")}
            pressStyle={{ opacity: 0.8 }}
          >
            Login
          </Text>
        </XStack>
      </YStack>
    </TouchableWithoutFeedback>
  );
};

export default Signup;
