import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
type LogCardProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad"; // Optional keyboard type
};

const LogCard: React.FC<LogCardProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
}) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
  },
});

export default LogCard;