import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";

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

    try {
      const response = await fetch(`http://localhost:4000/user/addEntry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mealName,
          proteinAmount: Number(proteinAmount),
        }),
      });

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
        <TouchableOpacity style={styles.button} onPress={handleAddEntry}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#454545",
    width: 410,
    height: 100,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
  },
  containerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  entryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#fff",
    color: "#fff",
    borderRadius: 20,
    padding: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#eee",
    alignItems: "center",
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: "bold",
  },
});

export default AddEntryForm;
