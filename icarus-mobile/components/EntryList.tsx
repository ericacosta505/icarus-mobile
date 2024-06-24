import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Loader from "./Loader";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const { width, height } = Dimensions.get("window");

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
    <View style={styles.container}>
      <Text style={styles.title}>Today's Entries</Text>
      {isEntryLoading ? (
        <Loader />
      ) : todaysEntries.length === 0 ? (
        <View style={styles.noEntriesContainer}>
          <Text style={styles.noEntries}>No Entries Found</Text>
        </View>
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
                <FontAwesomeIcon icon={faTrash} size={20} color="#fff" />
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
    padding: width * 0.02,
    borderRadius: 20,
    width: "100%",
    height: height * 0.21,
    marginTop: height * 0.01,
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
    fontSize: width * 0.045,
    marginBottom: height * 0.01,
  },
  noEntriesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noEntries: {
    fontSize: width * 0.04,
    color: "#fff",
  },
  entryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
    padding: height * 0.02,
    height: height * 0.072,
    borderRadius: 10,
    marginBottom: height * 0.005,
  },
  entryContent: {
    color: "#fff",
    fontSize: width * 0.04,
  },
  deleteButton: {
    padding: height * 0.015,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
});

export default EntryList;
