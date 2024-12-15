import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { Header } from "../components/Header";
import { CustomInput } from "../components/CustomInput";
import { loginSchema } from "../utils/schemas";

export function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLogin = () => {
    try {
      loginSchema.parse({ username, password, phoneNumber });
      // If validation passes, proceed with login logic
      console.log("Login:", { username, password, phoneNumber });
      // Navigate to the next screen or perform login API call
    } catch (error) {
      if (error.errors) {
        const errorMessages = error.errors.map((err) => err.message).join("\n");
        Alert.alert("Validation Error", errorMessages);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Login" onClose={() => navigation.goBack()} />

      <View style={styles.form}>
        <CustomInput
          label="Username"
          value={username}
          onChangeText={setUsername}
        />

        <CustomInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  form: {
    padding: 20,
  },
  button: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
