import { useContext } from "react";
import { AppDataContext } from "./app-data-context";

export function useAppData() {
  return useContext(AppDataContext);
}
