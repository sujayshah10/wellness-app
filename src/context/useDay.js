import { useContext } from "react";
import { DayContext } from "./day-context";

export function useDay() {
  return useContext(DayContext);
}
