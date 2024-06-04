import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Loader from "./Loader"; // Ensure this is a React Native compatible loader

interface EntryListProps {
  todaysEntries: Array<{
    _id: string;
    mealName: string;
    proteinAmount: number;
  }>;
  isEntryLoading: boolean;
  onEntryDelete: () => void;
  handleEntryDelete: () => void;
}

const EntryList: React.FC<EntryListProps> = ({
  todaysEntries,
  isEntryLoading,
  onEntryDelete,
  handleEntryDelete,
}) => {
  const handleDeleteEntry = async (entryId: string) => {
    const token = await SecureStore.getItemAsync("token");

    if (!token) {
      Alert.alert("Authentication error", "No token found");
      return;
    }

    try {
      const response = await fetch(
        `https://icarus-backend.onrender.com/user/deleteEntry/${entryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Entry deleted successfully.");
        onEntryDelete();
        handleEntryDelete();
      } else {
        console.error("Failed to delete entry.");
        Alert.alert("Deletion failed", "Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      Alert.alert("Error", "An error occurred while deleting the entry");
    }
  };

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>Today's Entries</Text>
      {isEntryLoading ? (
        <Loader />
      ) : todaysEntries.length === 0 ? (
        <Text style={styles.noEntries}>No Entries Found</Text>
      ) : (
        <FlatList
          data={todaysEntries}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.entryItem}>
              <Text style={styles.entryContent}>
                {item.mealName} - {item.proteinAmount}g
              </Text>
              <TouchableOpacity
                onPress={() => handleDeleteEntry(item._id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>🗑</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#454545",
    padding: 10,
    borderRadius: 20,
    width: 410,
    height: 250,
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  noEntries: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 170,
  },
  entryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  entryContent: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EntryList;
