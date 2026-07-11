import { useDay } from "../context/useDay";
import { useAppData } from "../context/useAppData";
import TimeHeader from "../components/TimeHeader";
import DaySelector from "../components/DaySelector";
import { useTranslation } from "../utils/useTranslation";

export default function Workout() {

  const { selectedDay, setSelectedDay } = useDay();
  const { appData, setAppData } = useAppData();
  const { t } = useTranslation();

  const workout =
    appData.workouts[selectedDay] || { focus: "", sections: [], exercises: [] };

  const equipmentList = [
    "Pushup Board",
    "Skipping Rope",
    "60 kg Grip Trainer",
    "2 kg Dumbbells × 4",
    "3 kg Dumbbells × 4",
    "Weighted squat bag plates"
  ];

  const currentTracker = appData.workoutTracker?.[selectedDay] || {
    warmup: false,
    mainWorkout: false,
    afterWorkoutStretches: false
  };

  const trackerSteps = [
    { key: "warmup", label: t("warmup") },
    { key: "mainWorkout", label: t("mainWorkout") },
    { key: "afterWorkoutStretches", label: t("afterWorkoutStretches") }
  ];

  const completedCount = trackerSteps.filter(({ key }) => currentTracker[key]).length;

  const toggleTrackerStep = (step) => {
    setAppData((current) => {
      const tracker = current.workoutTracker || {};
      const dayTracker = { ...(tracker[selectedDay] || {}) };
      dayTracker[step] = !dayTracker[step];

      return {
        ...current,
        workoutTracker: {
          ...tracker,
          [selectedDay]: dayTracker
        }
      };
    });
  };

  const resetTracker = () => {
    setAppData((current) => ({
      ...current,
      workoutTracker: {
        ...(current.workoutTracker || {}),
        [selectedDay]: {
          warmup: false,
          mainWorkout: false,
          afterWorkoutStretches: false
        }
      }
    }));
  };

  const mediaUrlFor = (exercise) =>
    exercise.mediaUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${exercise.name} proper form`)}`;

  const renderExercise = (ex, index) => (
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
  );

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

      <div style={{ marginBottom: "18px" }}>
        <h4 style={{ color: "var(--app-primary)", marginBottom: "8px" }}>{t("strengthRecoveryTracker")}</h4>
        <div style={{ color: "var(--app-muted)", marginBottom: "10px" }}>
          {completedCount} / {trackerSteps.length} {t("stepsComplete")}
        </div>
        <div style={{ display: "grid", gap: "10px" }}>
          {trackerSteps.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleTrackerStep(key)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "14px",
                borderRadius: "12px",
                border: `1px solid ${currentTracker[key] ? "var(--app-primary)" : "var(--app-border)"}`,
                background: currentTracker[key] ? "rgba(59, 130, 246, 0.13)" : "var(--app-surface)",
                color: "var(--app-text)",
                cursor: "pointer"
              }}
            >
              <strong>{label}</strong>
              <div style={{ marginTop: "6px", color: "var(--app-muted)" }}>
                {currentTracker[key] ? t("completed") : t("markComplete")}
              </div>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={resetTracker}
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid var(--app-border)",
            background: "transparent",
            color: "var(--app-text)",
            cursor: "pointer"
          }}
        >
          {t("resetTracker")}
        </button>
      </div>

      {workout.sections && workout.sections.length > 0 && (
        <div style={{ marginBottom: "18px" }}>
          <h4 style={{ color: "var(--app-primary)", marginBottom: "8px" }}>{t("equipment")}</h4>
          <div style={{ color: "var(--app-muted)", lineHeight: 1.6 }}>
            {equipmentList.join(", ")}
          </div>
        </div>
      )}

      {workout.sections && workout.sections.length > 0 ? (
        workout.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} style={{ marginBottom: "22px" }}>
            <h4 style={{ color: "var(--app-primary)", marginBottom: "10px" }}>
              {t(section.title)}
            </h4>
            {section.exercises.map(renderExercise)}
          </div>
        ))
      ) : workout.exercises.length === 0 ? (
        <div className="empty-state">
          <strong>{t("restDay")}</strong>
          <span>{t("noWorkoutData")}</span>
        </div>
      ) : (
        workout.exercises.map(renderExercise)
      )}

    </div>
  );
}
