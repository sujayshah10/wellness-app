import { useEffect, useMemo, useState } from "react";
import { AppDataContext } from "./app-data-context";
import { APP_DATA_VERSION, DEFAULT_APP_DATA, DEFAULT_ABOUT, DEFAULT_INTAKE_SLOTS, DEFAULT_PROFILE, DEFAULT_SETTINGS, DEFAULT_TARGETS, DAYS, FONT_FAMILIES, FONT_SIZES } from "../data/defaultAppData";

const DEFAULT_COMPLETION_TRACKER = {};
const DEFAULT_STREAK_DATA = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  streakHistory: []
};

const STORAGE_KEY = "wellnessAppData";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeIntakeSlots(slots = DEFAULT_INTAKE_SLOTS) {
  const normalized = slots
    .filter((slot) => slot?.key)
    .map((slot, index) => ({
      key: slot.key,
      label: slot.label || `Meal ${index + 1}`,
      time: slot.time || "",
      active: slot.active !== false
    }));

  return normalized.length ? normalized : DEFAULT_INTAKE_SLOTS;
}

function normalizeDietPlan(dietPlan = {}, intakeSlots = DEFAULT_INTAKE_SLOTS) {
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

function normalizeExercises(exercises) {
  return Array.isArray(exercises)
    ? exercises
        .filter(Boolean)
        .map((exercise) => ({
          name: exercise.name || "",
          sets: exercise.sets ?? 0,
          reps: exercise.reps || "",
          mediaUrl: exercise.mediaUrl || ""
        }))
    : [];
}

function normalizeSections(sections) {
  return Array.isArray(sections)
    ? sections
        .filter(Boolean)
        .map((section) => ({
          title: section.title || "",
          exercises: normalizeExercises(section.exercises)
        }))
    : [];
}

function normalizeWorkout(workout = {}, defaultWorkout = {}) {
  workout = workout || {};
  defaultWorkout = defaultWorkout || {};
  const sourceWorkout = Object.keys(workout).length ? workout : defaultWorkout;
  const sections = normalizeSections(sourceWorkout.sections);
  const flatExercises = normalizeExercises(sourceWorkout.exercises);
  const exercises = flatExercises.length
    ? flatExercises
    : sections.flatMap((section) => section.exercises);

  return {
    focus: sourceWorkout.focus || defaultWorkout.focus || "",
    sections,
    exercises
  };
}

function normalizeWorkouts(workouts = DEFAULT_APP_DATA.workouts) {
  return DAYS.reduce((plan, day) => {
    plan[day] = normalizeWorkout(workouts?.[day], DEFAULT_APP_DATA.workouts[day]);
    return plan;
  }, {});
}

function normalizeAppData(data) {
  const previousVersion = data?.dataVersion;
  const shouldRefreshSeedData = !previousVersion
    || previousVersion === "vadodara-seasonal-eating-v1"
    || previousVersion === "vadodara-intake-full-body-v1";
  const rawWorkouts = previousVersion !== APP_DATA_VERSION
    ? DEFAULT_APP_DATA.workouts
    : data?.workouts || DEFAULT_APP_DATA.workouts;
  const intakeSlots = normalizeIntakeSlots(shouldRefreshSeedData ? DEFAULT_APP_DATA.intakeSlots : data?.intakeSlots || DEFAULT_APP_DATA.intakeSlots);

  return {
    ...clone(DEFAULT_APP_DATA),
    ...(data || {}),
    dataVersion: APP_DATA_VERSION,
    intakeSlots,
    dietPlan: normalizeDietPlan(shouldRefreshSeedData ? DEFAULT_APP_DATA.dietPlan : data?.dietPlan || DEFAULT_APP_DATA.dietPlan, intakeSlots),
    foodDatabase: shouldRefreshSeedData ? DEFAULT_APP_DATA.foodDatabase : data?.foodDatabase || DEFAULT_APP_DATA.foodDatabase,
    foodLibrary: shouldRefreshSeedData ? DEFAULT_APP_DATA.foodLibrary : data?.foodLibrary || DEFAULT_APP_DATA.foodLibrary,
    workouts: normalizeWorkouts(rawWorkouts),
    targets: {
      ...DEFAULT_TARGETS,
      ...(data?.targets || {})
    },
    profile: {
      ...DEFAULT_PROFILE,
      ...(data?.profile || {})
    },
    about: {
      ...DEFAULT_ABOUT,
      ...(data?.about || {})
    },
    settings: {
      ...DEFAULT_SETTINGS,
      ...(data?.settings || {}),
      timezoneDisplay: data?.settings?.timezoneDisplay || data?.about?.timezoneDisplay || DEFAULT_SETTINGS.timezoneDisplay
    },
    completionTracker: data?.completionTracker || DEFAULT_COMPLETION_TRACKER,
    streakData: data?.streakData || DEFAULT_STREAK_DATA
  };
}

function isFirstTimeUser(profile) {
  return !profile || 
    !profile.name || 
    (profile.heightCm === DEFAULT_PROFILE.heightCm && 
     profile.weightKg === DEFAULT_PROFILE.weightKg &&
     profile.activityLevel === DEFAULT_PROFILE.activityLevel);
}

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function calculateDailyCompletion(completionData, intakeSlots, hasWorkout) {
  if (!completionData) return 0;
  
  const mealsCompleted = completionData.mealsCompleted?.length || 0;
  const totalMeals = intakeSlots.filter(slot => slot.active !== false).length;
  const mealCompletion = totalMeals > 0 ? mealsCompleted / totalMeals : 0;
  
  const workoutCompletion = completionData.workoutCompleted ? 1 : 0;
  const workoutStepsCompletion = completionData.workoutSteps ? 
    Object.values(completionData.workoutSteps).filter(Boolean).length / 3 : 0;
  
  // Weight: Meals 60%, Workout 40%
  const overallCompletion = (mealCompletion * 0.6) + (workoutCompletion * 0.4);
  
  return Math.min(overallCompletion, 1);
}

function updateStreakData(currentStreakData, todayKey, completionPercentage) {
  const newStreakData = { ...currentStreakData };
  const today = new Date(todayKey);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];
  
  // Check if streak should continue
  const isSuccessfulDay = completionPercentage >= 0.8;
  const wasYesterdayCompleted = currentStreakData.lastCompletedDate === yesterdayKey;
  
  if (isSuccessfulDay) {
    if (currentStreakData.lastCompletedDate === yesterdayKey) {
      // Continue streak
      newStreakData.currentStreak = currentStreakData.currentStreak + 1;
    } else if (currentStreakData.lastCompletedDate !== todayKey) {
      // Start new streak (not same day already completed)
      newStreakData.currentStreak = 1;
    }
    newStreakData.lastCompletedDate = todayKey;
    
    // Update longest streak
    if (newStreakData.currentStreak > newStreakData.longestStreak) {
      newStreakData.longestStreak = newStreakData.currentStreak;
    }
  } else if (completionPercentage < 0.3 && currentStreakData.lastCompletedDate !== todayKey) {
    // Reset streak if completely missed and not today
    if (currentStreakData.lastCompletedDate !== yesterdayKey) {
      newStreakData.currentStreak = 0;
    }
  }
  
  newStreakData.streakHistory = [...newStreakData.streakHistory, newStreakData.currentStreak].slice(-30);
  
  return newStreakData;
}

function loadAppData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return normalizeAppData(saved ? JSON.parse(saved) : DEFAULT_APP_DATA);
  } catch {
    return normalizeAppData(DEFAULT_APP_DATA);
  }
}

export function AppDataProvider({ children }) {
  const [appData, setAppDataState] = useState(loadAppData);

  useEffect(() => {
    const root = document.documentElement;
    const theme = appData.settings.theme;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
  }, [appData.settings.theme]);

  const setAppData = (updater) => {
    setAppDataState((current) => {
      const next = normalizeAppData(typeof updater === "function" ? updater(current) : updater);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetAppData = () => {
    const next = normalizeAppData(DEFAULT_APP_DATA);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAppDataState(next);
  };

  const toggleMealCompletion = (day, mealSlotKey) => {
    setAppData(prev => {
      const todayKey = getTodayKey();
      const completionData = prev.completionTracker[todayKey] || {
        mealsCompleted: [],
        workoutCompleted: false,
        workoutSteps: { warmup: false, mainWorkout: false, afterWorkoutStretches: false },
        overallCompletion: 0,
        timestamp: new Date().toISOString()
      };

      const mealsCompleted = completionData.mealsCompleted.includes(mealSlotKey)
        ? completionData.mealsCompleted.filter(key => key !== mealSlotKey)
        : [...completionData.mealsCompleted, mealSlotKey];

      const updatedCompletionData = {
        ...completionData,
        mealsCompleted,
        overallCompletion: calculateDailyCompletion(
          { ...completionData, mealsCompleted },
          prev.intakeSlots,
          prev.workouts[day]?.exercises?.length > 0
        )
      };

      const updatedStreakData = updateStreakData(
        prev.streakData,
        todayKey,
        updatedCompletionData.overallCompletion
      );

      return {
        ...prev,
        completionTracker: {
          ...prev.completionTracker,
          [todayKey]: updatedCompletionData
        },
        streakData: updatedStreakData
      };
    });
  };

  const toggleWorkoutCompletion = (day, step) => {
    setAppData(prev => {
      const todayKey = getTodayKey();
      const completionData = prev.completionTracker[todayKey] || {
        mealsCompleted: [],
        workoutCompleted: false,
        workoutSteps: { warmup: false, mainWorkout: false, afterWorkoutStretches: false },
        overallCompletion: 0,
        timestamp: new Date().toISOString()
      };

      let updatedCompletionData;
      
      if (step === 'main') {
        // Toggle overall workout completion
        updatedCompletionData = {
          ...completionData,
          workoutCompleted: !completionData.workoutCompleted
        };
      } else {
        // Toggle specific workout step
        updatedCompletionData = {
          ...completionData,
          workoutSteps: {
            ...completionData.workoutSteps,
            [step]: !completionData.workoutSteps[step]
          }
        };
      }

      updatedCompletionData.overallCompletion = calculateDailyCompletion(
        updatedCompletionData,
        prev.intakeSlots,
        prev.workouts[day]?.exercises?.length > 0
      );

      const updatedStreakData = updateStreakData(
        prev.streakData,
        todayKey,
        updatedCompletionData.overallCompletion
      );

      return {
        ...prev,
        completionTracker: {
          ...prev.completionTracker,
          [todayKey]: updatedCompletionData
        },
        streakData: updatedStreakData
      };
    });
  };

  const getDailyCompletion = (day) => {
    const completionData = appData.completionTracker[day];
    return completionData?.overallCompletion || 0;
  };

  const isFirstTime = isFirstTimeUser(appData.profile);

  const value = useMemo(() => ({
    appData,
    setAppData,
    resetAppData,
    isFirstTime,
    toggleMealCompletion,
    toggleWorkoutCompletion,
    getDailyCompletion,
    FONT_FAMILIES,
    FONT_SIZES
  }), [appData, isFirstTime]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}
