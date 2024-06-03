import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert, ImageBackground, StatusBar, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import backgroundImage from "../../assets/images/icarus.png";
import * as SecureStore from 'expo-secure-store';

interface Credentials {
  email: string;
  password: string;
}

export default function Login() {
  const [inputValue, setInputValue] = useState<Credentials>({ email: "", password: "" });
  const router = useRouter()

  const handleOnChange = (name: keyof Credentials, value: string) => {
    setInputValue((prevState) => ({ ...prevState, [name]: value }));
  };

  const login = async (credentials: Credentials) => {
    try {
      const response = await fetch("https://icarus-backend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.success) {
        const token = String(data.token)
        await SecureStore.setItemAsync('token', token);
        setTimeout(() => router.push("home"), 1000);
      } else {
        Alert.alert("Login Failed", data.message || "Please check your credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Something went wrong", "Unable to connect to the server");
    }
  };

  const handleSubmit = async () => {
    await login(inputValue);
    setInputValue({ email: "", password: "" });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Icarus: Protein Tracker</Text>
          <View style={styles.formContainer}>
            <Text style={styles.header}>Login</Text>
            <View style={styles.inputBlock}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={inputValue.email}
                placeholder="Enter your email"
                placeholderTextColor="#ccc"
                onChangeText={(value) => handleOnChange("email", value)}
              />
            </View>
            <View style={styles.inputBlock}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={inputValue.password}
                placeholder="Enter your password"
                placeholderTextColor="#ccc"
                secureTextEntry
                onChangeText={(value) => handleOnChange("password", value)}
              />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
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
  formContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  inputBlock: {
    marginBottom: 15,
  },
  label: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
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
  signupLink: {
    marginTop: 15,
    alignItems: "center",
  },
  signupText: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
