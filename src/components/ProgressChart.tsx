import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { useHealthContext } from "../context/Context";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#f4f4f4",
  backgroundGradientTo: "#f4f4f4",
  color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const ProgressChartComponent = () => {
  const { getDailyProgress } = useHealthContext();

  const progressData = getDailyProgress();

  const data = {
    labels: ["Steps", "Water", "Sleep"],
    data: progressData,
  };

  return (
    <View style={styles.container}>
      <ProgressChart
        data={data}
        width={screenWidth - 40}
        height={220}
        strokeWidth={16}
        radius={32}
        chartConfig={chartConfig}
        hideLegend={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProgressChartComponent;
