import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useHealthContext } from "../context/Context";
import { formatDate } from "../services/FormatDate";
import LogCard from "../components/LogCard";
import { ProgressChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const DailyLogScreen: React.FC = () => {
  const { addDailyEntry, goals, dailyEntries } = useHealthContext();
  const [steps, setSteps] = useState<string>("");
  const [sleep, setSleep] = useState<string>("");
  const [water, setWater] = useState<string>("");

  // Calculate progress for each metric as a decimal
  const stepsProgress =
    goals.dailyStepGoal > 0
      ? Math.min((dailyEntries[0]?.steps || 0) / goals.dailyStepGoal, 1)
      : 0;

  const sleepProgress =
    goals.dailySleepGoal > 0
      ? Math.min((dailyEntries[0]?.sleep || 0) / goals.dailySleepGoal, 1)
      : 0;

  const waterProgress =
    goals.dailyWaterGoal > 0
      ? Math.min((dailyEntries[0]?.water || 0) / goals.dailyWaterGoal, 1)
      : 0;
  console.log(sleepProgress);

  const handleSubmit = () => {
    const numSteps = parseInt(steps, 10);
    const numSleep = parseFloat(sleep);
    const numWater = parseInt(water, 10);

    addDailyEntry({
      date: new Date().toISOString().split("T")[0],
      steps: numSteps,
      sleep: numSleep,
      water: numWater,
    });

    setSteps("");
    setSleep("");
    setWater("");
    alert("Log saved successfully!");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Log for {formatDate()}</Text>

      {/* Progress Rings */}
      <View style={styles.chartContainer}>
        <ProgressChart
          data={{
            labels: ["Steps", "Sleep", "Water"], // Labels for progress
            data: [stepsProgress, sleepProgress, waterProgress],
          }}
          width={screenWidth - 40}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#f4f4f4",
            backgroundGradientTo: "#f4f4f4",
            color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          hideLegend={false}
        />
      </View>

      {/* Log Inputs */}
      <LogCard
        label={`Steps: ${dailyEntries[0]?.steps}`}
        value={steps}
        onChangeText={setSteps}
        placeholder={`Goal: ${goals.dailyStepGoal} steps`}
        keyboardType="numeric"
      />
      <LogCard
        label={`Water: ${dailyEntries[0]?.water}`}
        value={water}
        onChangeText={setWater}
        placeholder={`Goal: ${goals.dailyWaterGoal} L`}
        keyboardType="numeric"
      />
      <LogCard
        label={`Sleep: ${dailyEntries[0]?.sleep}`}
        value={sleep}
        onChangeText={setSleep}
        placeholder={`Goal: ${goals.dailySleepGoal} hours`}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Log Today's Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DailyLogScreen;
