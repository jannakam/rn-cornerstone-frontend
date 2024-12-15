import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import { Header } from "../components/Header";
import { CustomInput } from "../components/CustomInput";
import { registerSchema } from "../utils/schemas";

export function Register({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [city, setCity] = useState("");

  const handleRegister = () => {
    try {
      registerSchema.parse({
        username,
        password,
        phoneNumber,
        age: parseInt(age, 10),
        weight: parseFloat(weight),
        height: parseFloat(height),
        city,
      });
      // If validation passes, proceed with registration logic
      console.log("Register:", {
        username,
        password,
        phoneNumber,
        age,
        weight,
        height,
        city,
      });
      // Navigate to the next screen or perform registration API call
    } catch (error) {
      if (error.errors) {
        const errorMessages = error.errors.map((err) => err.message).join("\n");
        Alert.alert("Validation Error", errorMessages);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Register" onClose={() => navigation.goBack()} />

      <Text style={styles.subtitle}>
        Please fill in your details to create an account.
      </Text>

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

        <CustomInput
          label="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <CustomInput
          label="Weight (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        <CustomInput
          label="Height (cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />

        <CustomInput label="City" value={city} onChangeText={setCity} />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  subtitle: {
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 40,
    marginTop: 10,
    marginBottom: 20,
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
