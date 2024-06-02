import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
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
      (sum, entry) => sum + entry.proteinAmount,
      0
    );
    setProteinSum(totalProtein);
  }, [filteredEntries]);

  const calendarTheme = {
    backgroundColor: "#333",
    calendarBackground: "#333",
    textSectionTitleColor: "#b6c1cd",
    selectedDayBackgroundColor: "#00adf5",
    selectedDayTextColor: "#ffffff",
    todayTextColor: "#00adf5",
    dayTextColor: "#2d4150",
    textDisabledColor: "#d9e1e8",
    dotColor: "#00adf5",
    selectedDotColor: "#ffffff",
    arrowColor: "orange",
    monthTextColor: "blue",
    textDayFontFamily: "monospace",
    textMonthFontFamily: "monospace",
    textDayHeaderFontFamily: "monospace",
    textDayFontWeight: "300",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "300",
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Past Entries</Text>
      <View style={styles.calendarAndEntries}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          current={selectedDate}
          markingType={"custom"}
        />
        <View style={styles.entriesList}>
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry, index) => (
              <Text key={index} style={styles.entryItem}>
                - {entry.mealName}: {entry.proteinAmount}g
              </Text>
            ))
          ) : (
            <Text>No entries on this date.</Text>
          )}
        </View>
      </View>

      <Text style={styles.pastEntrySum}>{proteinSum}g</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 10,
    backgroundColor: "#454545",
    width: 410,
    height: 100,
    marginTop: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  calendarAndEntries: {
    display: "flex",
    flexDirection: "row",
  },
  entriesList: {
    marginTop: 10,
  },
  entryItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  pastEntrySum: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PastEntries;
