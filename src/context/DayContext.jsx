import { useState, useEffect } from "react";
import { getESTTime } from "../utils/timeEngine";
import { DayContext } from "./day-context";

const dayMap = {
  Mon: "Mon",
  Tue: "Tue",
  Wed: "Wed",
  Thu: "Thu",
  Fri: "Fri",
  Sat: "Sat",
  Sun: "Sun"
};

function getESTDay() {
  const est = getESTTime();
  return dayMap[est.day] || "Mon";
}

export function DayProvider({ children }) {
  const [selectedDay, setSelectedDay] = useState(() => {
    const saved = localStorage.getItem("selectedDay");
    return saved || getESTDay();
  });

  const handleSetSelectedDay = (day) => {
    setSelectedDay(day);
    localStorage.setItem("selectedDay", day);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newDay = getESTDay();
      setSelectedDay(newDay);
    }, 60000); // check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <DayContext.Provider value={{ selectedDay, setSelectedDay: handleSetSelectedDay }}>
      {children}
    </DayContext.Provider>
  );
}
