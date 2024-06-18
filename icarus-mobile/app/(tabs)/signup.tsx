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
} from "react-native";
import { Link, useRouter } from "expo-router";
import logov2 from "../../assets/images/logov2-removebg-preview.png";

interface SignupCredentials {
  email: string;
  password: string;
  username: string;
}

interface DismissKeyboardProps {
  children: ReactNode;
}

const DismissKeyboard: React.FC<DismissKeyboardProps> = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default function Signup() {
  const [inputValue, setInputValue] = useState<SignupCredentials>({
    email: "",
    password: "",
    username: "",
  });
  const router = useRouter();

  const handleOnChange = (name: keyof SignupCredentials, value: string) => {
    setInputValue((prevState) => ({ ...prevState, [name]: value }));
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      const response = await fetch(
        "https://icarus-backend.onrender.com/signup",
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
        Alert.alert("Signup Successful", "Please login to continue.");
        setTimeout(() => router.push("login"), 1000);
      } else {
        Alert.alert("Signup Failed", data.message || "Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Something went wrong", "Unable to connect to the server");
    }
  };

  const handleSubmit = async () => {
    await signup(inputValue);
    setInputValue({ email: "", password: "", username: "" });
  };

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.overlay}>
          <Image style={styles.logo} source={logov2}></Image>
          <View style={styles.formContainer}>
            <Text style={styles.header}>Signup</Text>
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
              />
            </View>
            <View style={styles.inputBlock}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={inputValue.username}
                placeholder="Enter your username"
                placeholderTextColor="#ccc"
                onChangeText={(value) => handleOnChange("username", value)}
                autoCapitalize="none"
                textContentType="oneTimeCode"
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
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Signup</Text>
              </TouchableOpacity>
            </View>
            <Link href="/login" style={styles.signupLink}>
              <Text style={styles.signupText}>
                Already have an account? Login
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
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
  },
  formContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#454545",
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
