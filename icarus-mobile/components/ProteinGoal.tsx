import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Loader from "./Loader";

const { width, height } = Dimensions.get("window");

interface ProteinGoalProps {
  proteinGoalValue: string;
  isLoading: boolean;
  onUpdate: (newGoal: string) => void;
}

const ProteinGoal: React.FC<ProteinGoalProps> = ({
  proteinGoalValue,
  isLoading,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [proteinGoal, setProteinGoal] = useState(proteinGoalValue);

  useEffect(() => {
    setProteinGoal(proteinGoalValue);
  }, [proteinGoalValue]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBackClick = () => {
    setIsEditing(false);
  };

  const handleProteinGoalChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setProteinGoal(value);
    }
  };

  const handleUpdateClick = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      fetch(`https://icarus-backend.onrender.com/user/updateProteinGoal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ proteinGoal }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setIsEditing(false);
          onUpdate(data.user.proteinGoal);
        })
        .catch((error) => {
          Alert.alert(
            "Error",
            "There was an error with your goal change. Please try again."
          );
          console.error("Error:", error);
          setIsEditing(false);
        });
    }
  };

  return (
    <View style={styles.proteinGoalContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Protein Goal</Text>
        {!isLoading &&
          (isEditing ? (
            <TouchableOpacity onPress={handleBackClick} style={styles.button}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleEditClick} style={styles.button}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          ))}
      </View>
      <View style={styles.proteinGoalAmountContainer}>
        {isLoading ? (
          <Loader />
        ) : isEditing ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={proteinGoal}
              onChangeText={handleProteinGoalChange}
              keyboardType="numeric"
              autoFocus
            />
            <TouchableOpacity onPress={handleUpdateClick} style={styles.button}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.displayedAmount}>{proteinGoal} g</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  proteinGoalContainer: {
    padding: width * 0.02,
    backgroundColor: "#454545",
    height: height * 0.214,
    width: width * 0.47,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.045,
    color: "#fff",
    fontWeight: "bold",
  },
  proteinGoalAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.025,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.025,
  },
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    padding: height * 0.01,
    marginRight: width * 0.025,
    minWidth: width * 0.1,
    color: "#fff",
    borderRadius: 20,
  },
  button: {
    padding: width * 0.025,
    backgroundColor: "#eee",
    alignItems: "center",
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: "bold",
  },
  displayedAmount: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.15,
  },
});

export default ProteinGoal;
