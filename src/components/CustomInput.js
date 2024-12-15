import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

export function CustomInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
  placeholder,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor="#666"
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    fontSize: 16,
  },
});
