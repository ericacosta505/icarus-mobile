import React, { useState, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions,
} from "react-native";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import logov2 from "../../assets/images/logov2-removebg-preview.png";

const { width, height } = Dimensions.get("window");

interface Credentials {
  email: string;
  password: string;
}

interface DismissKeyboardProps {
  children: ReactNode;
}

const DismissKeyboard: React.FC<DismissKeyboardProps> = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default function Login() {
  const [inputValue, setInputValue] = useState<Credentials>({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleOnChange = (name: keyof Credentials, value: string) => {
    setInputValue((prevState) => ({ ...prevState, [name]: value }));
  };

  const login = async (credentials: Credentials) => {
    try {
      const response = await fetch(
        "https://icarus-backend.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (data.success) {
        const token = String(data.token);
        await SecureStore.setItemAsync("token", token);
        setTimeout(() => router.push("home"), 1000);
      } else {
        Alert.alert(
          "Login Failed",
          data.message || "Please check your credentials"
        );
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
    <DismissKeyboard>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.overlay}>
          <Image style={styles.logo} source={logov2}></Image>
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
                autoCapitalize="none"
                textContentType="oneTimeCode"
                autoCorrect={false}
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
                autoCapitalize="none"
                textContentType="oneTimeCode"
                autoCorrect={false}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
            <Link href="/signup" style={styles.signupLink}>
              <Text style={styles.signupText}>
                Don't have an account? Sign up
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </DismissKeyboard>
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
  formContainer: {
    width: "90%",
    padding: width * 0.05,
    borderRadius: 10,
    backgroundColor: "#454545",
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "white",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  inputBlock: {
    marginBottom: height * 0.02,
  },
  label: {
    color: "white",
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: height * 0.015,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: width * 0.05,
    width: "100%",
  },
  button: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    borderRadius: 20,
    borderColor: "white",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.05,
    fontWeight: "600",
  },
  signupLink: {
    marginTop: height * 0.02,
    alignItems: "center",
  },
  signupText: {
    color: "white",
    fontSize: width * 0.04,
    textDecorationLine: "underline",
  },
});
