import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

const { width, height } = Dimensions.get("window");

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

  const animationValue = useRef(
    new Animated.Value(initialConsumedValue)
  ).current;
  const [chartData, setChartData] = useState<ChartData[]>([
    {
      name: "Protein Consumed",
      protein: initialConsumedValue,
      color: "#ffffff",
      legendFontColor: "#ffffff",
      legendFontSize: 12,
    },
    {
      name: "Remaining Goal",
      protein: goalValue - initialConsumedValue,
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
      const consumed = Math.min(value, goalValue);
      const remaining = Math.max(goalValue - value, 0);

      setChartData([
        {
          name: "Protein Consumed",
          protein: consumed,
          color: "#ffffff",
          legendFontColor: "#ffffff",
          legendFontSize: 12,
        },
        {
          name: "Remaining Goal",
          protein: remaining,
          color: "rgba(0, 0, 0, 1)",
          legendFontColor: "#FFFFFF",
          legendFontSize: 12,
        },
      ]);
    });

    return () => animationValue.removeListener(listenerId);
  }, [proteinConsumed, goalValue]);

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
          width={width * 0.90}
          height={height * 0.26}
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
    width: '100%',
    height: height * 0.31,
    borderRadius: 20,
    marginTop: height * 0.01,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    padding: width * 0.02,
  },
  containerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.045,
    alignSelf: "flex-start",
  },
  noEntriesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noGoal: {
    color: "#fff",
    fontSize: width * 0.04,
  },
});

export default ProteinConsumed;
