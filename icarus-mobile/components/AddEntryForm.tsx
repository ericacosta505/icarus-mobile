import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

interface AddEntryFormProps {
  onEntryAdded: () => void;
}

const AddEntryForm: React.FC<AddEntryFormProps> = ({ onEntryAdded }) => {
  const [mealName, setMealName] = useState("");
  const [proteinAmount, setProteinAmount] = useState("");

  const handleProteinChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setProteinAmount(value);
    }
  };

  const handleAddEntry = async () => {
    if (!mealName || !proteinAmount) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    const token = await SecureStore.getItemAsync("token");

    let time = new Date().toLocaleString().replace(/,/g, "");

    try {
      const response = await fetch(
        `https://icarus-backend.onrender.com/user/addEntry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mealName,
            proteinAmount: Number(proteinAmount),
            time: time,
          }),
        }
      );

      if (response.ok) {
        setMealName("");
        setProteinAmount("");
        onEntryAdded();
      } else {
        console.error("Failed to add entry");
      }
    } catch (error) {
      console.error("There was an error adding the entry", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.containerTitle}>Add Entry</Text>
      <View style={styles.entryContainer}>
        <TextInput
          style={styles.input}
          placeholder="Meal Name"
          placeholderTextColor="#fff"
          onChangeText={setMealName}
          value={mealName}
        />
        <TextInput
          style={styles.input}
          placeholder="Protein Amount"
          placeholderTextColor="#fff"
          onChangeText={handleProteinChange}
          value={proteinAmount}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleAddEntry(), Keyboard.dismiss();
          }}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#454545",
    width: '100%',
    height: height * 0.105,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: width * 0.02,
    marginTop: height * 0.01,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  containerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
  entryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.01,
  },
  input: {
    flex: 1,
    marginHorizontal: width * 0.01,
    borderWidth: 2,
    borderColor: "#fff",
    color: "#fff",
    borderRadius: 20,
    padding: height * 0.01,
  },
  button: {
    padding: height * 0.01,
    backgroundColor: "#eee",
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: width * 0.01,
  },
  buttonText: {
    fontWeight: "bold",
  },
});

export default AddEntryForm;
