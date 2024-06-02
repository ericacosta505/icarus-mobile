import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

interface ProteinConsumedProps {
  proteinGoalValue: string;
  proteinConsumed: string;
}

// const screenWidth = Dimensions.get("window").width;

const ProteinConsumed: React.FC<ProteinConsumedProps> = ({
  proteinGoalValue,
  proteinConsumed,
}) => {
  const goalValue = Number(proteinGoalValue);
  const consumedValue = Number(proteinConsumed);

  const chartConfig = {
    backgroundGradientFrom: "transparent",
    backgroundGradientTo: "transparent",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
  };

  const data = [
    {
      name: "Protein Consumed",
      protein: consumedValue,
      color: "rgba(255, 99, 132, 0.6)",
      legendFontColor: "#FFFFFF",
      legendFontSize: 15,
    },
    {
      name: "Remaining Goal",
      protein: goalValue - consumedValue > 0 ? goalValue - consumedValue : 0,
      color: "rgba(54, 162, 235, 0.6)",
      legendFontColor: "#FFFFFF",
      legendFontSize: 15,
    },
  ];

  return (
    <View style={styles.chartContainer}>
      {goalValue === 0 ? (
        <Text>No goal set</Text>
      ) : (
        <PieChart
          data={data}
          width={400}
          height={200}
          chartConfig={chartConfig}
          accessor={"protein"}
          backgroundColor={"transparent"}
          paddingLeft={"0"}
          avoidFalseZero={true}
          style={{ alignItems: "center", justifyContent: "center" }}
          absolute
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
    width: 400,
    height: 200,
    paddingRight: 20,
    borderRadius: 20,
  },
});

export default ProteinConsumed;
