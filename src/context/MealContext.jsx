import { useState } from "react";
import { MealContext } from "./meal-context";

export function MealProvider({ children }) {
  const [completedMeals, setCompletedMeals] = useState(() => {
    const saved = localStorage.getItem("completedMeals");
    return saved ? JSON.parse(saved) : {};
  });

  const toggleMealCompletion = (day, mealType) => {
    setCompletedMeals((prev) => {
      const key = `${day}-${mealType}`;
      const updated = {
        ...prev,
        [key]: !prev[key]
      };
      localStorage.setItem("completedMeals", JSON.stringify(updated));
      return updated;
    });
  };

  const isMealCompleted = (day, mealType) => {
    const key = `${day}-${mealType}`;
    return completedMeals[key] || false;
  };

  return (
    <MealContext.Provider value={{ toggleMealCompletion, isMealCompleted }}>
      {children}
    </MealContext.Provider>
  );
}
