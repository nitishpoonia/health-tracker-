import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  HealthEntry,
  UserGoals,
  HealthContextType,
} from "../types/HealthTypes";
import { formatDate } from "../services/FormatDate";

const ENTRIES_STORAGE_KEY = "health_entries";
const GOALS_STORAGE_KEY = "user_goals";

const DEFAULT_GOALS: UserGoals = {
  dailyStepGoal: 10000,
  dailySleepGoal: 8,
  dailyWaterGoal: 4000,
};

export const HealthContext = createContext<HealthContextType>({
  dailyEntries: [],
  addDailyEntry: () => {},
  goals: DEFAULT_GOALS,
  updateGoals: () => {},
  getWeeklySummary: () => ({
    stepsData: [0, 0, 0, 0, 0, 0, 0], // Weekly steps
    sleepData: [0, 0, 0, 0, 0, 0, 0], // Weekly sleep
    waterData: [0, 0, 0, 0, 0, 0, 0], // Weekly water
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // Weekdays
  }),
  getDailyProgress: () => [0, 0, 0],
});

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dailyEntries, setDailyEntries] = useState<HealthEntry[]>([]);
  const [goals, setGoals] = useState<UserGoals>(DEFAULT_GOALS);
  const [stats, setStats] = useState<HealthEntry[]>([]);

  const getFormattedDate = (date: Date) => date.toISOString().split("T")[0];

  const generateDummyData = async () => {
    const today = new Date();
    const dummyEntries = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      dummyEntries.push({
        date: getFormattedDate(date),
        steps: Math.floor(Math.random() * (6000 - 5000) + 100), // Random steps between 5000 and 12000
        sleep: parseFloat((Math.random() * (8 - 4) + 4).toFixed(1)), // Random sleep between 4-8 hours
        water: Math.floor(Math.random() * (1400 - 700) + 100), // Random water intake between 1400-3500 ml
      });
    }

    try {
      await AsyncStorage.setItem(
        ENTRIES_STORAGE_KEY,
        JSON.stringify(dummyEntries)
      );
      console.log("Dummy data added successfully!");
    } catch (error) {
      console.error("Error storing dummy data", error);
    }
  };
  useEffect(() => {
    const loadStoredData = async () => {
      generateDummyData();
      try {
        // Load entries
        const storedEntriesJson = await AsyncStorage.getItem(
          ENTRIES_STORAGE_KEY
        );

        if (storedEntriesJson) {
          const storedEntries = JSON.parse(storedEntriesJson);
          setDailyEntries(storedEntries);
        }

        // Load settings
        const storedGoals = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
        if (storedGoals) {
          const storedSettings = JSON.parse(storedGoals);
          setGoals(storedSettings);
        }
      } catch (error) {
        console.error("Failed to load stored data", error);
      }
    };

    loadStoredData();
  }, []);

  const addDailyEntry = async (entry: HealthEntry) => {
    // Check if the entry for the current day exists
    const currentDate = new Date().toISOString().split("T")[0];
    const existingEntries = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY);
    const parsedEntries = existingEntries ? JSON.parse(existingEntries) : [];

    // // If there's an existing entry for today, update it
    const updatedEntries = parsedEntries.map((e: HealthEntry) =>
      e.date === currentDate
        ? {
            ...e,
            steps: e.steps + (entry.steps || 0),
            sleep: e.sleep + (entry.sleep || 0),
            water: e.water + (entry.water || 0),
          }
        : e
    );
    setDailyEntries(updatedEntries);
    // // If no entry exists, add it
    if (!updatedEntries.some((e: HealthEntry) => e.date === currentDate)) {
      updatedEntries.push(entry);
    }
    await AsyncStorage.setItem(
      ENTRIES_STORAGE_KEY,
      JSON.stringify(updatedEntries)
    );
  };
  useEffect(() => {
    getDailyProgress();
  }, [addDailyEntry]);
  const updateGoals = async (newGoals: Partial<UserGoals>) => {
    const updateGoals = { ...goals, ...newGoals };
    setGoals(updateGoals);

    // Save to AsyncStorage
    await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(updateGoals));
  };

 const getWeeklySummary = () => {
   const sevenDaysAgo = new Date();
   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Include the last 7 days

   // Create a map for past 7 days
   const dateMap = Array.from({ length: 7 }, (_, i) => {
     const date = new Date(sevenDaysAgo);
     date.setDate(sevenDaysAgo.getDate() + i);
     return date.toISOString().split("T")[0];
   });

   // Find weekly entries from existing data
   const weeklyEntries = dateMap.map(
     (date) => dailyEntries.find((entry) => entry.date === date) || null
   );

   // Process data for the chart
   const stepsData = weeklyEntries.map((entry) => (entry ? entry.steps : null));
   const sleepData = weeklyEntries.map((entry) => (entry ? entry.sleep : null));
   const waterData = weeklyEntries.map((entry) => (entry ? entry.water : null));

   const labels = dateMap.map((date) =>
     new Date(date).toLocaleDateString("en-IN", {
       weekday: "short",
     })
   );

   // Identify missing days
   const missingDates = weeklyEntries
     .map((entry, index) => (entry === null ? dateMap[index] : null))
     .filter((date) => date !== null);

   return {
     stepsData,
     sleepData,
     waterData,
     labels,
     missingDates, // Add missing dates to prompt user
   };
 };


  const getDailyProgress = () => {
    const todayDate = new Date().toISOString().split("T")[0];
    const todayEntry = dailyEntries.find((entry) =>
      entry.date.startsWith(todayDate)
    );

    if (!todayEntry) {
      return [0, 0, 0]; // No entries for today, return 0 progress for all goals
    }

    const stepProgress = Math.min(todayEntry.steps / goals.dailyStepGoal, 1);
    const waterProgress = Math.min(todayEntry.water / goals.dailyWaterGoal, 1);
    const sleepProgress = Math.min(todayEntry.sleep / goals.dailySleepGoal, 1);

    return [stepProgress, waterProgress, sleepProgress];
  };
  const progressData = getDailyProgress();
  const data = {
    labels: ["Steps", "Water", "Sleep"],
    data: progressData,
  };

  return (
    <HealthContext.Provider
      value={{
        dailyEntries,
        addDailyEntry,
        goals,
        updateGoals,
        getWeeklySummary,
        getDailyProgress,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealthContext = () => useContext(HealthContext);
