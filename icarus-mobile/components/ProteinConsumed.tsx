import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { PieChart } from "react-native-chart-kit";

interface ProteinConsumedProps {
  proteinGoalValue: string;
  proteinConsumed: string;
}

interface ChartData {
  name: string;
  protein: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

const ProteinConsumed: React.FC<ProteinConsumedProps> = ({
  proteinGoalValue,
  proteinConsumed,
}) => {
  const goalValue = parseFloat(proteinGoalValue);
  const initialConsumedValue = parseFloat(proteinConsumed);

  const animationValue = useRef(new Animated.Value(0)).current;
  const [chartData, setChartData] = useState<ChartData[]>([
    {
      name: "Protein Consumed",
      protein: 0,
      color: "#fff",
      legendFontColor: "#fff",
      legendFontSize: 12,
    },
    {
      name: "Remaining Goal",
      protein: goalValue,
      color: "rgba(0, 0, 0, 1)",
      legendFontColor: "#FFFFFF",
      legendFontSize: 12,
    },
  ]);

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: initialConsumedValue,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    const listenerId = animationValue.addListener(({ value }) => {
      setChartData([
        {
          name: "Protein Consumed",
          protein: value,
          color: "#fff",
          legendFontColor: "#fff",
          legendFontSize: 12,
        },
        {
          name: "Remaining Goal",
          protein: goalValue - value,
          color: "rgba(0, 0, 0, 1)",
          legendFontColor: "#FFFFFF",
          legendFontSize: 12,
        },
      ]);
    });

    return () => animationValue.removeListener(listenerId);
  }, [initialConsumedValue, goalValue]);

  const chartConfig = {
    backgroundGradientFrom: "transparent",
    backgroundGradientTo: "transparent",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.containerTitle}>Protein Consumed</Text>
      {goalValue === 0 ? (
        <View style={styles.noEntriesContainer}>
        <Text style={styles.noGoal}>No Goal Set</Text>
      </View>
      ) : (
        <PieChart
          data={chartData}
          width={400}
          height={220}
          chartConfig={chartConfig}
          accessor={"protein"}
          backgroundColor={"transparent"}
          paddingLeft={"0"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: "#454545",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 410,
    height: 250,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    paddingHorizontal: 10,
  },
  containerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  noEntriesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noGoal: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ProteinConsumed;
