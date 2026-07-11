import { useTranslation } from "../utils/useTranslation";

export default function DaySelector({ selectedDay, setSelectedDay }) {
  const { dayName } = useTranslation();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        gap: "6px",
        marginBottom: "20px"
      }}
    >
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
        <div
          key={day}
          onClick={() => setSelectedDay(day)}
          style={{
            textAlign: "center",
            padding: "8px 0",
            borderRadius: "10px",
            background: selectedDay === day ? "var(--app-primary)" : "var(--app-surface)",
            color: selectedDay === day ? "white" : "var(--app-text)",
            boxShadow: selectedDay === day ? "0 8px 18px rgba(37, 99, 235, 0.28)" : "none",
            border: selectedDay === day ? "1px solid var(--app-primary)" : "1px solid var(--app-border)",
            fontWeight: "600",
            fontSize: "12px",
            minWidth: 0,
            cursor: "pointer"
          }}
        >
          {dayName(day)}
        </div>
      ))}
    </div>
  );
}
