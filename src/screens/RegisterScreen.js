import { StyleSheet } from "react-native";
import React from "react";
import Signup from "../components/Signup";
import { YStack } from "tamagui";

const RegisterScreen = () => {
  return (
    <YStack f={1} jc="center" ai="center">
      <Signup />
    </YStack>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
