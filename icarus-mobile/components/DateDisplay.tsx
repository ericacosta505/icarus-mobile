import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function DateDisplay() {
  const currentDate = new Date(Date.now());
  const formattedMonth = currentDate.toLocaleDateString(undefined, {
    month: "short",
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
    padding: width * 0.02,
    backgroundColor: "#454545",
    height: height * 0.21,
    width: width * 0.47,
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
    fontSize: width * 0.15,
    color: "#fff",
    fontWeight: "bold",
  },
});
