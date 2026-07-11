import { useEffect, useMemo, useState } from "react";
import { AppDataContext } from "./app-data-context";
import { APP_DATA_VERSION, DEFAULT_APP_DATA, DEFAULT_ABOUT, DEFAULT_SETTINGS, DEFAULT_TARGETS, DAYS, MEAL_SLOTS } from "../data/defaultAppData";

const STORAGE_KEY = "wellnessAppData";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeDietPlan(dietPlan = {}) {
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

function normalizeAppData(data) {
  const shouldRefreshSeedData = data?.dataVersion !== APP_DATA_VERSION;

  return {
    ...clone(DEFAULT_APP_DATA),
    ...(data || {}),
    dataVersion: APP_DATA_VERSION,
    dietPlan: normalizeDietPlan(shouldRefreshSeedData ? DEFAULT_APP_DATA.dietPlan : data?.dietPlan || DEFAULT_APP_DATA.dietPlan),
    foodDatabase: shouldRefreshSeedData ? DEFAULT_APP_DATA.foodDatabase : data?.foodDatabase || DEFAULT_APP_DATA.foodDatabase,
    foodLibrary: shouldRefreshSeedData ? DEFAULT_APP_DATA.foodLibrary : data?.foodLibrary || DEFAULT_APP_DATA.foodLibrary,
    workouts: shouldRefreshSeedData ? DEFAULT_APP_DATA.workouts : data?.workouts || DEFAULT_APP_DATA.workouts,
    targets: {
      ...DEFAULT_TARGETS,
      ...(data?.targets || {})
    },
    about: {
      ...DEFAULT_ABOUT,
      ...(data?.about || {})
    },
    settings: {
      ...DEFAULT_SETTINGS,
      ...(data?.settings || {}),
      timezoneDisplay: data?.settings?.timezoneDisplay || data?.about?.timezoneDisplay || DEFAULT_SETTINGS.timezoneDisplay
    }
  };
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

  const value = useMemo(() => ({
    appData,
    setAppData,
    resetAppData
  }), [appData]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}
