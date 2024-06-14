import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SecureStore from "expo-secure-store";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface Entry {
  _id: string;
  createdAt: string;
  mealName: string;
  proteinAmount: number;
}

interface PastEntriesProps {
  pastEntries: Entry[];
  onEntryDelete: () => void;
  onDateChange: (date: string) => void;
}

const PastEntries: React.FC<PastEntriesProps> = ({
  pastEntries,
  onEntryDelete,
  onDateChange,
}) => {
  const formatDate = (date: Date | string): string => {
    let dateObj = new Date(date);
    return `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dateObj.getDate().toString().padStart(2, "0")}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(
    formatDate(new Date())
  );
  const [proteinSum, setProteinSum] = useState<number>(0);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [mealName, setMealName] = useState<string>("");
  const [proteinAmount, setProteinAmount] = useState<string>("");
  const [entryDate, setEntryDate] = useState<Date>(new Date());
  const [markedDates, setMarkedDates] = useState<any>({
    [formatDate(new Date())]: {
      selected: true,
      selectedColor: "#ffffff",
      selectedTextColor: "#454545",
    },
  });

  const sortedEntries = useMemo(
    () =>
      pastEntries.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [pastEntries]
  );

  const filteredEntries = useMemo(
    () =>
      sortedEntries.filter(
        (entry) => formatDate(entry.createdAt) === selectedDate
      ),
    [sortedEntries, selectedDate]
  );

  useEffect(() => {
    const totalProtein = filteredEntries.reduce(
      (sum, entry) => sum + Number(entry.proteinAmount),
      0
    );
    setProteinSum(totalProtein);
  }, [filteredEntries]);

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
      } else {
        console.error("Failed to delete entry.");
        Alert.alert("Deletion failed", "Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      Alert.alert("Error", "An error occurred while deleting the entry");
    }
  };

  const handleAddEntry = async () => {
    if (!mealName || !proteinAmount || !entryDate) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    const token = await SecureStore.getItemAsync("token");

    try {
      const response = await fetch(
        `https://icarus-backend.onrender.com/user/addPastEntry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mealName,
            proteinAmount: Number(proteinAmount),
            date: formatDate(entryDate),
            time: entryDate.toISOString().split("T")[1].substring(0, 5),
          }),
        }
      );

      if (response.ok) {
        setMealName("");
        setProteinAmount("");
        setIsAdding(false);
        onEntryDelete();
      } else {
        console.error("Failed to add entry");
      }
    } catch (error) {
      console.error("There was an error adding the entry", error);
    }
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    onDateChange(day.dateString);
    setMarkedDates({
      [day.dateString]: {
        selected: true,
        selectedColor: "#ffffff",
        selectedTextColor: "#454545",
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Past Entries</Text>
        {isAdding ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsAdding(false)}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsAdding(true)}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        {isAdding ? (
          <View style={styles.addEntryForm}>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={entryDate}
                mode="date"
                display="spinner"
                textColor="#fff"
                onChange={(event, selectedDate) =>
                  setEntryDate(selectedDate || entryDate)
                }
                style={styles.datePicker}
              />
            </View>
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
                onChangeText={(value) =>
                  /^\d*$/.test(value) ? setProteinAmount(value) : null
                }
                value={proteinAmount}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleAddEntry();
                  Keyboard.dismiss();
                }}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Calendar
              onDayPress={handleDayPress}
              current={selectedDate}
              markedDates={markedDates}
              markingType={"custom"}
              theme={{
                backgroundColor: "#454545",
                calendarBackground: "#454545",
                textSectionTitleColor: "#b6c1cd",
                textSectionTitleDisabledColor: "#d9e1e8",
                selectedDayBackgroundColor: "#00adf5",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#00adf5",
                dayTextColor: "#d9e1e8",
                textDisabledColor: "#d9e1e8",
                dotColor: "#00adf5",
                selectedDotColor: "#ffffff",
                arrowColor: "#ffffff",
                monthTextColor: "#ffffff",
                indicatorColor: "#ffffff",
                textDayFontWeight: "300",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "300",
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 16,
              }}
            />
            <View style={styles.listAndSum}>
              <FlatList
                data={filteredEntries}
                keyExtractor={(item, index) => index.toString()}
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
                ListEmptyComponent={
                  <Text style={styles.noEntry}>No entries on this date.</Text>
                }
                style={styles.entriesList}
              />
              <Text style={styles.pastEntrySum}>{proteinSum}g</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#454545",
    padding: 10,
    borderRadius: 20,
    width: 410,
    height: 520,
    marginTop: 10,
    justifyContent: "center",
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
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
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
  content: {
    marginTop: 20,
  },
  listAndSum: {
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
  },
  entriesList: {
    height: 100,
    marginTop: 10,
  },
  entryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    justifyContent: "space-between",
  },
  entryContent: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 10,
  },
  noEntry: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 40,
  },
  pastEntrySum: {
    marginTop: 10,
    fontSize: 60,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  addEntryForm: {
    marginTop: 20,
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
  datePickerContainer: {
    backgroundColor: "#454545",
    borderRadius: 20,
    marginBottom: 10,
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  datePicker: {},
  entryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
});

export default PastEntries;
