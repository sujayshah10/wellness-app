import { useEffect, useMemo, useState } from "react";
import { AppDataContext } from "./app-data-context";
import * as store from "../data/store";

export function AppDataProvider({ children }) {
  const [appData, setAppDataState] = useState(store.loadAppData);
  const { FONT_FAMILIES, FONT_SIZES } = store;

  useEffect(() => {
    const root = document.documentElement;
    const theme = appData.settings.theme;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
  }, [appData.settings.theme]);

  useEffect(() => {
    const root = document.documentElement;
    const fontFamily = FONT_FAMILIES.find(f => f.key === appData.settings.fontFamily)?.value || FONT_FAMILIES[0].value;
    const fontSize = FONT_SIZES.find(s => s.key === appData.settings.fontSize)?.value || FONT_SIZES[1].value;
    
    root.style.setProperty('--app-font-body', fontFamily);
    root.style.setProperty('--app-font-size-base', fontSize);
  }, [appData.settings.fontFamily, appData.settings.fontSize, FONT_FAMILIES, FONT_SIZES]);

  const setAppData = (updater) => {
    setAppDataState((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      store.saveAppData(next);
      return next;
    });
  };

  const resetAppData = () => {
    const next = store.resetAppData();
    setAppDataState(next);
  };

  const toggleMealCompletion = (day, mealSlotKey) => {
    const next = store.toggleMealCompletion(day, mealSlotKey);
    setAppDataState(next);
  };

  const toggleWorkoutCompletion = (day, step) => {
    const next = store.toggleWorkoutCompletion(day, step);
    setAppDataState(next);
  };

  const getDailyCompletion = (day) => {
    const completionData = appData.completionTracker[day];
    return completionData?.overallCompletion || 0;
  };

  const isFirstTime = store.isFirstTimeUser();

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
