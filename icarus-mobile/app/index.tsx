import React from "react";
import { Text, View, StyleSheet, StatusBar, Image } from "react-native";
import { Link } from "expo-router";
import logov2 from "../assets/images/logov2-removebg-preview.png";

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.overlay}>
        <Image style={styles.logo} source={logov2}></Image>
        <Text style={styles.introText}>
          Welcome to Icarus, your personal protein tracking assistant. Keep
          track of your daily protein intake easily and effectively.
        </Text>
        <View style={styles.buttonContainer}>
          <Link style={styles.button} href="/login">
            <Text style={styles.buttonText}>Login</Text>
          </Link>
          <Link style={styles.button} href="/signup">
            <Text style={styles.buttonText}>Signup</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "#333",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
  },
  introText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginHorizontal: 40,
    marginBottom: 40,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    width: "100%",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderColor: "white",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
