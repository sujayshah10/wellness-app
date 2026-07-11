import { useDay } from "../context/useDay";
import { useAppData } from "../context/useAppData";
import TimeHeader from "../components/TimeHeader";
import DaySelector from "../components/DaySelector";
import { useTranslation } from "../utils/useTranslation";

export default function Workout() {

  const { selectedDay, setSelectedDay } = useDay();
  const { appData } = useAppData();
  const { t } = useTranslation();

  const workout =
    appData.workouts[selectedDay] || { focus: "", exercises: [] };

  const mediaUrlFor = (exercise) =>
    exercise.mediaUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${exercise.name} proper form`)}`;

  return (
    <div className="page">

      <h1 style={{ color: "var(--app-text)" }}>
        {t("workout")}
      </h1>

      <TimeHeader />

      {/* Day Selector */}

      <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

      {/* Focus */}

      <h3 style={{ color: "var(--app-primary)" }}>
        {workout.focus}
      </h3>

      {/* Exercises */}

      {workout.exercises.length === 0 && (
        <div className="empty-state">
          <strong>{t("restDay")}</strong>
          <span>{t("noWorkoutData")}</span>
        </div>
      )}

      {workout.exercises.map((ex, index) => (

        <div
          key={index}
          style={{
            background: "var(--app-surface)",
            color: "var(--app-text)",
            padding: "18px",
            borderRadius: "12px",
            marginBottom: "14px",
            boxShadow: "var(--app-shadow)",
            border: "1px solid var(--app-border)"
          }}
        >
          <strong>{ex.name}</strong>

          <p style={{ color: "var(--app-muted)", marginTop: "6px" }}>
            {ex.sets} {t("sets")} x {ex.reps}
          </p>

          <a
            href={mediaUrlFor(ex)}
            target="_blank"
            rel="noreferrer"
            className="media-link"
          >
            ▶ {t("watchForm")}
          </a>

        </div>

      ))}

    </div>
  );
}
