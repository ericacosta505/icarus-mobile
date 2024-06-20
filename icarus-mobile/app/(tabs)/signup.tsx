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
import logov2 from "../../assets/images/logov2-removebg-preview.png";

const { width, height } = Dimensions.get("window");

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
