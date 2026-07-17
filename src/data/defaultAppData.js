import { DIET_PLAN } from "./diet";
import { foodDatabase } from "./foodDatabase";
import { foodLibrary } from "./foodLibrary";
import { WORKOUT_SPLIT } from "./workouts";

export const APP_DATA_VERSION = "polished-configurable-wellness-v4";

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const DEFAULT_INTAKE_SLOTS = [
  { key: "intake1", label: "Intake 1", time: "4:30 PM", active: true },
  { key: "intake2", label: "Intake 2", time: "6:30 PM", active: true },
  { key: "intake3", label: "Intake 3", time: "4:00 AM", active: true }
];

export const DEFAULT_TARGETS = {
  calories: 2350,
  protein: 120,
  deficitMode: "auto",
  deficitOverride: 0
};

export const DEFAULT_PROFILE = {
  name: "",
  age: 30,
  gender: "male",
  heightCm: 175,
  heightUnit: "cm",
  weightKg: 80,
  weightUnit: "kg",
  activityLevel: "light",
  goal: "fatLoss",
  deficitTarget: 400,
  sugar: false,
  bloodPressure: false,
  foodAvoidances: "",
  workoutLimitations: ""
};

export const DEFAULT_ABOUT = {
  version: "0.4.0",
  ownerName: "Sujay Shah",
  tagline: "Three daily intakes, seasonal food, and full-body training."
};

export const DEFAULT_SETTINGS = {
  language: "en",
  timezoneDisplay: "both",
  theme: "light"
};

export const DEFAULT_WORKOUT_TRACKER = DAYS.reduce((tracker, day) => {
  tracker[day] = {
    warmup: false,
    mainWorkout: false,
    afterWorkoutStretches: false
  };
  return tracker;
}, {});

export const LANGUAGES = [
  { key: "en", label: "English" },
  { key: "gu", label: "Gujarati" },
  { key: "hi", label: "Hindi" }
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

function withIntakeTimes(dietPlan, intakeSlots = DEFAULT_INTAKE_SLOTS) {
  return DAYS.reduce((plan, day) => {
    plan[day] = { ...(dietPlan[day] || {}) };

    intakeSlots.forEach((slot) => {
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
  dataVersion: APP_DATA_VERSION,
  intakeSlots: DEFAULT_INTAKE_SLOTS,
  dietPlan: withIntakeTimes(DIET_PLAN),
  foodDatabase,
  foodLibrary,
  workouts: WORKOUT_SPLIT,
  targets: DEFAULT_TARGETS,
  profile: DEFAULT_PROFILE,
  about: DEFAULT_ABOUT,
  settings: DEFAULT_SETTINGS,
  workoutTracker: DEFAULT_WORKOUT_TRACKER
};
