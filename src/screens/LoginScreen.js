import { StyleSheet, View } from "react-native";
import React from "react";
import Login from "../components/Login";

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
