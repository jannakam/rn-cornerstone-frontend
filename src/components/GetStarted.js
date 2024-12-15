import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Switch } from "react-native";
import { Header } from "../components/Header";
import { Ruler, Weight } from "lucide-react-native";

export function GetStarted({ navigation }) {
  const [isMetric, setIsMetric] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const handleGetStarted = () => {
    // Implement get started logic
    console.log("Get Started:", { height, weight, isMetric });
  };

  return (
    <View style={styles.container}>
      <Header title="Get Started" onClose={() => navigation.goBack()} />

      <Text style={styles.subtitle}>
        Input your height and weight to get accurate measurements of calories
        burnt!
      </Text>

      <View style={styles.form}>
        <TouchableOpacity style={styles.input}>
          <View style={styles.inputIcon}>
            <Ruler color="#fff" size={20} />
          </View>
          <Text style={styles.inputText}>Height</Text>
          <Text style={styles.inputValue}>{height || "Select"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.input}>
          <View style={styles.inputIcon}>
            <Weight color="#fff" size={20} />
          </View>
          <Text style={styles.inputText}>Weight</Text>
          <Text style={styles.inputValue}>{weight || "Select"}</Text>
        </TouchableOpacity>

        <View style={styles.unitToggle}>
          <Switch
            value={isMetric}
            onValueChange={setIsMetric}
            trackColor={{ false: "#666", true: "#333" }}
            thumbColor={isMetric ? "#fff" : "#fff"}
          />
          <Text style={styles.unitText}>ft/lb</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Start Earning!</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By confirming you agree to all{" "}
          <Text style={styles.termsLink}>terms</Text>
        </Text>
      </View>
    </View>
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
  },
  form: {
    padding: 20,
    marginTop: 20,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 15,
  },
  inputText: {
    color: "#fff",
    flex: 1,
  },
  inputValue: {
    color: "#666",
  },
  unitToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  unitText: {
    color: "#fff",
    marginLeft: 10,
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
  terms: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  termsLink: {
    color: "#fff",
  },
});
