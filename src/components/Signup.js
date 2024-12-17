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
    <ScrollView 
      style={{ flex: 1 , backgroundColor: "#1A1A1A" }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <YStack 
        padding="$4" 
        space="$4" 
        width="100%" 
        height="100%" 
        justifyContent="space-between"
        
      >
        <XStack padding="$4">
          <Text
            color="#333"
            fontSize={50}
            onPress={() => navigation.navigate("Login")}
          >
            ×
          </Text>
        </XStack>

        <YStack 
          space="$6" 
          flex={1}
          justifyContent="center"
        >
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
            {[
              { label: "Username", key: "username" },
              { label: "Phone number", key: "phoneNumber", keyboardType: "phone-pad" },
              { label: "New password", key: "password", secureTextEntry: true },
              { label: "City", key: "city" }
            ].map((field) => (
              <YStack key={field.key} space="$2">
                <Text color="gray" fontSize={14}>
                  {field.label}
                </Text>
                <Input
                  backgroundColor="#2A2A2A"
                  borderColor="#333"
                  borderWidth={1}
                  padding="$3"
                  color="white"
                  placeholderTextColor="gray"
                  value={userInfo[field.key]}
                  secureTextEntry={field.secureTextEntry}
                  keyboardType={field.keyboardType}
                  onChangeText={(text) =>
                    setUserInfo({ ...userInfo, [field.key]: text })
                  }
                />
              </YStack>
            ))}
          </YStack>

          <Button
            backgroundColor="#333"
            color="white"
            size="$4"
            marginTop="$4"
            onPress={handleSignup}
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
