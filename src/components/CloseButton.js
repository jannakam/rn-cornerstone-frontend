import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { X } from "lucide-react-native";

export function Header({ title, onClose }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <X color="#fff" size={24} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
});
