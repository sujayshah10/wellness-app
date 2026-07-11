import { useContext } from "react";
import { MealContext } from "./meal-context";

export function useMeals() {
  return useContext(MealContext);
}
