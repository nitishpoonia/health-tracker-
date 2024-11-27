import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Import Context Provider
import { HealthProvider } from "./src/context/Context";

// Import Screens
import DailyLogScreen from "./src/screens/DailyLogScreen";
import WeeklyOverviewScreen from "./src/screens/WeeklyOverviewScreen";

// Define Navigation Types
export type RootTabParamList = {
  DailyLog: undefined;
  WeeklyOverview: undefined;
};

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <HealthProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap = "alert";

                if (route.name === "DailyLog") {
                  iconName = focused ? "clipboard" : "clipboard-outline";
                } else if (route.name === "WeeklyOverview") {
                  iconName = focused ? "analytics" : "analytics-outline";
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "#4A90E2",
              tabBarInactiveTintColor: "gray",
              headerStyle: {
                backgroundColor: "#f4f4f4",
              },
              headerTintColor: "#333",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            })}
          >
            <Tab.Screen
              name="DailyLog"
              component={DailyLogScreen}
              options={{
                title: "Daily Health Log",
              }}
            />
            <Tab.Screen
              name="WeeklyOverview"
              component={WeeklyOverviewScreen}
              options={{
                title: "Weekly Health Overview",
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </HealthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
