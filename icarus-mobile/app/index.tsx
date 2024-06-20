import React from "react";
import { Text, View, StyleSheet, StatusBar, Image, Dimensions } from "react-native";
import { Link } from "expo-router";
import logov2 from "../assets/images/logov2-removebg-preview.png";

const { width, height } = Dimensions.get("window");

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
  overlay: {
    flex: 1,
    backgroundColor: "#333",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  logo: {
    width: width * 0.4, 
    height: width * 0.4,
    marginBottom: height * 0.01, 
  },
  introText: {
    fontSize: width * 0.05,
    color: "white",
    textAlign: "center",
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.05,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: width * 0.05,
    width: "100%",
  },
  button: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderRadius: 20,
    borderColor: "white",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.05,
    fontWeight: "600",
  },
});
