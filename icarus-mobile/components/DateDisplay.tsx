import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DateDisplay() {
  const currentDate = new Date(Date.now());
  const formattedMonth = currentDate.toLocaleDateString(undefined, {
    month: "long",
  });
  const formattedDay = currentDate.toLocaleDateString(undefined, {
    day: "numeric",
  });

  return (
    <View style={styles.dateDisplayContainer}>
      <Text style={styles.dateText}>{formattedMonth}</Text>
      <Text style={styles.dateText}>{formattedDay}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dateDisplayContainer: {
    padding: 10,
    backgroundColor: "#454545",
    height: 200,
    width: 200,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  dateText: {
    fontSize: 60,
    color: "#fff",
    fontWeight: "bold",
  },
});
