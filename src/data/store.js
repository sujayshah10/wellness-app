// Data Access Layer - Single source of truth for all data operations
// This abstraction allows easy swapping of storage backends (localStorage, API, etc.)

import { APP_DATA_VERSION, DEFAULT_APP_DATA, DEFAULT_ABOUT, DEFAULT_INTAKE_SLOTS, DEFAULT_PROFILE, DEFAULT_SETTINGS, DEFAULT_TARGETS, DAYS } from "./defaultAppData";

// Font configuration constants (separated to avoid circular dependency)
const FONT_FAMILIES = [
  { key: "inter", label: "Inter", value: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  { key: "playfair", label: "Playfair Display", value: "'Playfair Display', Georgia, serif" },
  { key: "system", label: "System", value: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }
];

const FONT_SIZES = [
  { key: "small", label: "Small", value: "13px" },
  { key: "medium", label: "Medium", value: "14px" },
  { key: "large", label: "Large", value: "16px" }
];

const STORAGE_KEY = "wellnessAppData";
const DEFAULT_COMPLETION_TRACKER = {};
const DEFAULT_STREAK_DATA = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  streakHistory: []
};

// Utility functions
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

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

// =====================
// CORE DATA OPERATIONS
// =====================

/**
 * Load all app data from storage
 */
export function loadAppData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return normalizeAppData(saved ? JSON.parse(saved) : DEFAULT_APP_DATA);
  } catch {
    return normalizeAppData(DEFAULT_APP_DATA);
  }
}

/**
 * Save all app data to storage
 */
export function saveAppData(data) {
  const normalized = normalizeAppData(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

/**
 * Update app data with a partial update
 */
export function updateAppData(updater) {
  const current = loadAppData();
  const next = typeof updater === "function" ? updater(current) : updater;
  return saveAppData(next);
}

/**
 * Reset all app data to defaults
 */
export function resetAppData() {
  return saveAppData(DEFAULT_APP_DATA);
}

// =====================
// MEAL OPERATIONS
// =====================

/**
 * Get meal plan for a specific day
 */
export function getMeals(day) {
  const data = loadAppData();
  return data.dietPlan[day] || {};
}

/**
 * Get meal for a specific day and slot
 */
export function getMeal(day, slotKey) {
  const data = loadAppData();
  return data.dietPlan[day]?.[slotKey] || null;
}

/**
 * Add or update a meal for a specific day and slot
 */
export function addMeal(day, slotKey, mealData) {
  return updateAppData((current) => ({
    ...current,
    dietPlan: {
      ...current.dietPlan,
      [day]: {
        ...current.dietPlan[day],
        [slotKey]: {
          time: current.intakeSlots.find(s => s.key === slotKey)?.time || "",
          ...mealData
        }
      }
    }
  }));
}

/**
 * Update existing meal for a specific day and slot
 */
export function updateMeal(day, slotKey, changes) {
  return updateAppData((current) => ({
    ...current,
    dietPlan: {
      ...current.dietPlan,
      [day]: {
        ...current.dietPlan[day],
        [slotKey]: {
          ...current.dietPlan[day]?.[slotKey],
          ...changes
        }
      }
    }
  }));
}

/**
 * Remove meal for a specific day and slot
 */
export function removeMeal(day, slotKey) {
  return updateAppData((current) => {
    const newDietPlan = { ...current.dietPlan };
    if (newDietPlan[day]) {
      delete newDietPlan[day][slotKey];
    }
    return {
      ...current,
      dietPlan: newDietPlan
    };
  });
}

/**
 * Get all meal slots configuration
 */
export function getMealSlots() {
  const data = loadAppData();
  return data.intakeSlots;
}

/**
 * Add a new meal slot
 */
export function addMealSlot(slot) {
  return updateAppData((current) => ({
    ...current,
    intakeSlots: normalizeIntakeSlots([...current.intakeSlots, slot])
  }));
}

/**
 * Update meal slot configuration
 */
export function updateMealSlot(slotKey, changes) {
  return updateAppData((current) => ({
    ...current,
    intakeSlots: current.intakeSlots.map(slot =>
      slot.key === slotKey ? { ...slot, ...changes } : slot
    )
  }));
}

/**
 * Remove meal slot
 */
export function removeMealSlot(slotKey) {
  return updateAppData((current) => ({
    ...current,
    intakeSlots: current.intakeSlots.filter(slot => slot.key !== slotKey)
  }));
}

// =====================
// EXERCISE OPERATIONS
// =====================

/**
 * Get workout for a specific day
 */
export function getExercises(day) {
  const data = loadAppData();
  return data.workouts[day] || { focus: "", exercises: [] };
}

/**
 * Add exercise to a day's workout
 */
export function addExercise(day, exercise) {
  return updateAppData((current) => ({
    ...current,
    workouts: {
      ...current.workouts,
      [day]: {
        ...current.workouts[day],
        exercises: [...(current.workouts[day]?.exercises || []), exercise]
      }
    }
  }));
}

/**
 * Update exercise in a day's workout
 */
export function updateExercise(day, exerciseIndex, changes) {
  return updateAppData((current) => {
    const exercises = [...(current.workouts[day]?.exercises || [])];
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], ...changes };
    return {
      ...current,
      workouts: {
        ...current.workouts,
        [day]: {
          ...current.workouts[day],
          exercises
        }
      }
    };
  });
}

/**
 * Remove exercise from a day's workout
 */
export function removeExercise(day, exerciseIndex) {
  return updateAppData((current) => {
    const exercises = (current.workouts[day]?.exercises || []).filter((_, i) => i !== exerciseIndex);
    return {
      ...current,
      workouts: {
        ...current.workouts,
        [day]: {
          ...current.workouts[day],
          exercises
        }
      }
    };
  });
}

/**
 * Set exercise count for a day
 */
export function setExerciseCount(day, count) {
  return updateAppData((current) => {
    const currentExercises = current.workouts[day]?.exercises || [];
    const newExercises = Array.from({ length: count }, (_, i) => 
      currentExercises[i] || { name: "", sets: 0, reps: "", mediaUrl: "" }
    );
    return {
      ...current,
      workouts: {
        ...current.workouts,
        [day]: {
          ...current.workouts[day],
          exercises: newExercises
        }
      }
    };
  });
}

/**
 * Update workout focus for a day
 */
export function updateWorkoutFocus(day, focus) {
  return updateAppData((current) => ({
    ...current,
    workouts: {
      ...current.workouts,
      [day]: {
        ...current.workouts[day],
        focus
      }
    }
  }));
}

// =====================
// TARGET OPERATIONS
// =====================

/**
 * Get current targets
 */
export function getTargets() {
  const data = loadAppData();
  return data.targets;
}

/**
 * Update targets
 */
export function updateTargets(changes) {
  return updateAppData((current) => ({
    ...current,
    targets: {
      ...current.targets,
      ...changes
    }
  }));
}

// =====================
// PROFILE OPERATIONS
// =====================

/**
 * Get user profile
 */
export function getProfile() {
  const data = loadAppData();
  return data.profile;
}

/**
 * Update user profile
 */
export function updateProfile(changes) {
  return updateAppData((current) => ({
    ...current,
    profile: {
      ...current.profile,
      ...changes
    }
  }));
}

// =====================
// SETTINGS OPERATIONS
// =====================

/**
 * Get app settings
 */
export function getSettings() {
  const data = loadAppData();
  return data.settings;
}

/**
 * Update app settings
 */
export function updateSettings(changes) {
  return updateAppData((current) => ({
    ...current,
    settings: {
      ...current.settings,
      ...changes
    }
  }));
}

// =====================
// COMPLETION TRACKING
// =====================

/**
 * Get completion data for a specific day
 */
export function getCompletionData(day) {
  const data = loadAppData();
  return data.completionTracker[day] || null;
}

/**
 * Toggle meal completion for a day
 */
export function toggleMealCompletion(day, mealSlotKey) {
  const todayKey = getTodayKey();
  return updateAppData((prev) => {
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
}

/**
 * Toggle workout completion for a day
 */
export function toggleWorkoutCompletion(day, step) {
  const todayKey = getTodayKey();
  return updateAppData((prev) => {
    const completionData = prev.completionTracker[todayKey] || {
      mealsCompleted: [],
      workoutCompleted: false,
      workoutSteps: { warmup: false, mainWorkout: false, afterWorkoutStretches: false },
      overallCompletion: 0,
      timestamp: new Date().toISOString()
    };

    let updatedCompletionData;
    
    if (step === 'main') {
      updatedCompletionData = {
        ...completionData,
        workoutCompleted: !completionData.workoutCompleted
      };
    } else {
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
}

/**
 * Get streak data
 */
export function getStreakData() {
  const data = loadAppData();
  return data.streakData;
}

// Helper functions for completion tracking
function calculateDailyCompletion(completionData, intakeSlots, hasWorkout) {
  if (!completionData) return 0;
  
  const mealsCompleted = completionData.mealsCompleted?.length || 0;
  const totalMeals = intakeSlots.filter(slot => slot.active !== false).length;
  const mealCompletion = totalMeals > 0 ? mealsCompleted / totalMeals : 0;
  
  const workoutCompletion = completionData.workoutCompleted ? 1 : 0;
  
  const overallCompletion = (mealCompletion * 0.6) + (workoutCompletion * 0.4);
  
  return Math.min(overallCompletion, 1);
}

function updateStreakData(currentStreakData, todayKey, completionPercentage) {
  const newStreakData = { ...currentStreakData };
  const today = new Date(todayKey);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];
  
  const isSuccessfulDay = completionPercentage >= 0.8;
  
  if (isSuccessfulDay) {
    if (currentStreakData.lastCompletedDate === yesterdayKey) {
      newStreakData.currentStreak = currentStreakData.currentStreak + 1;
    } else if (currentStreakData.lastCompletedDate !== todayKey) {
      newStreakData.currentStreak = 1;
    }
    newStreakData.lastCompletedDate = todayKey;
    
    if (newStreakData.currentStreak > newStreakData.longestStreak) {
      newStreakData.longestStreak = newStreakData.currentStreak;
    }
  } else if (completionPercentage < 0.3 && currentStreakData.lastCompletedDate !== todayKey) {
    if (currentStreakData.lastCompletedDate !== yesterdayKey) {
      newStreakData.currentStreak = 0;
    }
  }
  
  newStreakData.streakHistory = [...newStreakData.streakHistory, newStreakData.currentStreak].slice(-30);
  
  return newStreakData;
}

// =====================
// IMPORT/EXPORT OPERATIONS
// =====================

/**
 * Export all app data as JSON
 */
export function exportData() {
  const data = loadAppData();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `wellness-app-backup-${timestamp}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return { success: true, filename };
}

/**
 * Import app data from JSON file
 */
export async function importData(file) {
  if (!file) return { success: false, error: "No file provided" };
  
  try {
    const text = await file.text();
    const importedData = JSON.parse(text);
    
    // Basic validation
    if (!importedData || typeof importedData !== 'object') {
      return { success: false, error: "Invalid file format" };
    }
    
    if (!importedData.profile || !importedData.targets || !importedData.dietPlan) {
      return { success: false, error: "Missing required data fields" };
    }
    
    saveAppData(importedData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to import data" };
  }
}

// =====================
// UTILITY OPERATIONS
// =====================

/**
 * Get about/app metadata
 */
export function getAbout() {
  const data = loadAppData();
  return data.about;
}

/**
 * Update about/app metadata
 */
export function updateAbout(changes) {
  return updateAppData((current) => ({
    ...current,
    about: {
      ...current.about,
      ...changes
    }
  }));
}

/**
 * Get food database
 */
export function getFoodDatabase() {
  const data = loadAppData();
  return data.foodDatabase;
}

/**
 * Get food library
 */
export function getFoodLibrary() {
  const data = loadAppData();
  return data.foodLibrary;
}

/**
 * Check if user is first-time user
 */
export function isFirstTimeUser() {
  const profile = getProfile();
  return !profile || 
    !profile.name || 
    (profile.heightCm === DEFAULT_PROFILE.heightCm && 
     profile.weightKg === DEFAULT_PROFILE.weightKg &&
     profile.activityLevel === DEFAULT_PROFILE.activityLevel);
}

// Export configuration constants for UI use
export { FONT_FAMILIES, FONT_SIZES };
