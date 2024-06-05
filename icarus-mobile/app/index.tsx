import React from "react";
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  StatusBar,
} from "react-native";
import backgroundImage from "../assets/images/icarus.png";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Icarus: Protein Tracker</Text>
          <Text style={styles.introText}>
            Welcome to Icarus, your personal protein tracking assistant. Keep
            track of your daily protein intake easily and effectively.
          </Text>
          <View style={styles.buttonContainer}>
            <Link
              style={styles.button}
              onPress={() => console.log("Navigate to Login")}
              href="/login"
            >
              <Text style={styles.buttonText}>Login</Text>
            </Link>
            <Link
              style={styles.button}
              onPress={() => console.log("Navigate to Signup")}
              href="/signup"
            >
              <Text style={styles.buttonText}>Signup</Text>
            </Link>
          </View>
        </View>
      </ImageBackground>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 30,
    textAlign: "center",
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
