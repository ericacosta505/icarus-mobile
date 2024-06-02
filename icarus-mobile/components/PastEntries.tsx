import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";

interface Entry {
  createdAt: string;
  mealName: string;
  proteinAmount: number;
}

interface PastEntriesProps {
  pastEntries: Entry[];
}

const PastEntries: React.FC<PastEntriesProps> = ({ pastEntries }) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Past Entries</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        current={selectedDate}
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
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noEntry}>No entries on this date.</Text>
          }
          style={styles.entriesList}
        />
        <Text style={styles.pastEntrySum}>{proteinSum}g</Text>
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
    marginLeft: 10,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
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
  },
  entryContent: {
    color: "#fff",
    fontSize: 16,
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
});

export default PastEntries;
