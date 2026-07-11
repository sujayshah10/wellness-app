import { DIET_PLAN } from "./diet";
import { foodDatabase } from "./foodDatabase";
import { WORKOUT_SPLIT } from "./workouts";

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MEAL_SLOTS = [
  { key: "meal1", label: "Meal 1", time: "4:30 PM" },
  { key: "meal2", label: "Meal 2", time: "6:30 PM" },
  { key: "snack", label: "Snack", time: "11:00 PM" },
  { key: "meal3", label: "Meal 3", time: "4:00 AM" }
];

export const DEFAULT_TARGETS = {
  calories: 2350,
  protein: 120,
  deficitMode: "auto",
  deficitOverride: 0
};

export const DEFAULT_ABOUT = {
  version: "0.1.0",
  ownerName: "Sujay Shah",
  tagline: "Daily wellness, built around real life."
};

export const DEFAULT_SETTINGS = {
  language: "en",
  timezoneDisplay: "both",
  theme: "light"
};

export const LANGUAGES = [
  { key: "en", label: "English" },
  { key: "gu", label: "ગુજરાતી" },
  { key: "hi", label: "हिंदी" }
];

export const THEMES = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "black", label: "Black" },
  { key: "system", label: "System" }
];

export const TIMEZONE_OPTIONS = [
  { key: "both", label: "EST + IST" },
  { key: "est", label: "EST only" },
  { key: "ist", label: "IST only" }
];

export const LEGACY_ABOUT = {
  timezoneDisplay: "both"
};

function withMealTimes(dietPlan) {
  return DAYS.reduce((plan, day) => {
    plan[day] = { ...(dietPlan[day] || {}) };

    MEAL_SLOTS.forEach((slot) => {
      if (plan[day][slot.key]) {
        plan[day][slot.key] = {
          time: slot.time,
          ...plan[day][slot.key]
        };
      }
    });

    return plan;
  }, {});
}

export const DEFAULT_APP_DATA = {
  dietPlan: withMealTimes(DIET_PLAN),
  foodDatabase,
  workouts: WORKOUT_SPLIT,
  targets: DEFAULT_TARGETS,
  about: DEFAULT_ABOUT,
  settings: DEFAULT_SETTINGS
};
