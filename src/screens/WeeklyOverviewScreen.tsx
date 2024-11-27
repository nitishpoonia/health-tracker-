import React from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { useHealthContext } from "../context/Context";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#f4f4f4",
  backgroundGradientTo: "#f4f4f4",
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const WeeklyProgressCharts = () => {
  const { getWeeklySummary, goals } = useHealthContext();
  const { stepsData, sleepData, waterData, labels, missingDates } =
    getWeeklySummary();

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Steps Bar Chart */}
      <View>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Steps
        </Text>
        <BarChart
          data={{
            labels,
            datasets: [{ data: stepsData }],
          }}
          width={Dimensions.get("window").width - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            barPercentage: 0.5,
          }}
          style={{
            borderRadius: 8,
            paddingHorizontal: 5,
          }}
        />
      </View>

      {/* Sleep Bar Chart */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Sleep (Hours)
        </Text>
        <BarChart
          data={{
            labels,
            datasets: [{ data: sleepData }],
          }}
          width={Dimensions.get("window").width - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" hrs"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
            barPercentage: 0.5,
          }}
          style={{
            borderRadius: 8,
            paddingHorizontal: 5,
          }}
        />
      </View>

      {/* Water Bar Chart */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Water (ml)
        </Text>
        <BarChart
          data={{
            labels,
            datasets: [{ data: waterData }],
          }}
          width={Dimensions.get("window").width - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" ml"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
            barPercentage: 0.5,
          }}
          style={{
            borderRadius: 8,
            paddingHorizontal: 5,
          }}
        />
      </View>
    </ScrollView>
  );
};

export default WeeklyProgressCharts;
