export interface HealthEntry {
  date: string;
  steps: number;
  sleep: number;
  water: number;
}

export interface UserGoals {
  dailyStepGoal: number;
  dailySleepGoal: number;
  dailyWaterGoal: number;
}

export interface HealthContextType {
  // Daily entries
  dailyEntries: HealthEntry[];
  addDailyEntry: (entry: HealthEntry) => void;

  // User Goals
  goals: UserGoals;
  updateGoals: (goals: Partial<UserGoals>) => void;

  getWeeklySummary: () => {
    stepsData: number[]; // Array for weekly steps data (7 days)
    sleepData: number[]; // Array for weekly sleep data (7 days)
    waterData: number[]; // Array for weekly water data (7 days)
    labels: string[]; // Weekday labels (Mon, Tue, ..., Sun)
  };
  getDailyProgress: () => number[];
}
