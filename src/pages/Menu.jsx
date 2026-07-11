import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/useAppData";
import { DAYS, LANGUAGES, MEAL_SLOTS, THEMES, TIMEZONE_OPTIONS } from "../data/defaultAppData";
import { useTranslation } from "../utils/useTranslation";

const SECTIONS = [
  { key: "Meals", labelKey: "meals", descriptionKey: "descMeals" },
  { key: "Exercises", labelKey: "exercises", descriptionKey: "descExercises" },
  { key: "Targets", labelKey: "targets", descriptionKey: "descTargets" },
  { key: "Settings", labelKey: "settings", descriptionKey: "descSettings" },
  { key: "App Data", labelKey: "appData", descriptionKey: "descAppData" },
  { key: "About", labelKey: "about", descriptionKey: "descAbout" }
];

const emptyMeal = {
  name: "",
  time: "",
  calories: 0,
  protein: 0,
  prep: "",
  tip: ""
};

const emptyExercise = {
  name: "",
  sets: 3,
  reps: "10-12"
};

function fieldStyle() {
  return {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid var(--app-border)",
    borderRadius: "10px",
    font: "inherit",
    background: "var(--app-surface)",
    color: "var(--app-text)"
  };
}

function cardStyle() {
  return {
    background: "var(--app-surface)",
    color: "var(--app-text)",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "14px",
    boxShadow: "var(--app-shadow)",
    border: "1px solid var(--app-border)"
  };
}

function dayChipStyle(active) {
  return {
    borderRadius: "10px",
    minWidth: 0,
    padding: "9px 6px",
    font: "inherit",
    fontSize: "13px",
    fontWeight: 600,
    background: active ? "var(--app-primary)" : "var(--app-surface-soft)",
    color: active ? "#FFFFFF" : "var(--app-text)",
    border: active ? "1px solid var(--app-primary)" : "1px solid var(--app-border)",
    cursor: "pointer"
  };
}

function buttonStyle(kind = "primary") {
  const colors = {
    primary: { background: "var(--app-primary)", color: "#FFFFFF", border: "var(--app-primary)" },
    soft: { background: "var(--app-surface-soft)", color: "var(--app-text)", border: "var(--app-border)" },
    danger: { background: "#FEE2E2", color: "#991B1B", border: "#FCA5A5" }
  };

  return {
    ...colors[kind],
    border: `1px solid ${colors[kind].border}`,
    borderRadius: "10px",
    padding: "10px 12px",
    font: "inherit",
    fontWeight: 600,
    cursor: "pointer"
  };
}

function Field({ label, value, onChange, type = "text", textarea = false }) {
  return (
    <label style={{ display: "block", marginBottom: "12px", fontSize: "14px", color: "var(--app-text)" }}>
      <span style={{ display: "block", marginBottom: "6px", fontWeight: 550 }}>{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          style={{ ...fieldStyle(), resize: "vertical" }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(type === "number" ? Number(event.target.value) : event.target.value)}
          style={fieldStyle()}
        />
      )}
    </label>
  );
}

function DayPicker({ selectedDay, onSelect }) {
  const { dayName } = useTranslation();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "6px", marginBottom: "14px" }}>
      {DAYS.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onSelect(item)}
          style={dayChipStyle(selectedDay === item)}
        >
          {dayName(item)}
        </button>
      ))}
    </div>
  );
}

function MealsSection({ appData, setAppData, t }) {
  const [day, setDay] = useState("Mon");
  const [slot, setSlot] = useState("meal1");
  const [draft, setDraft] = useState(() => ({
    ...emptyMeal,
    ...(appData.dietPlan.Mon?.meal1 || {})
  }));
  const [addDays, setAddDays] = useState(["Mon"]);

  const getMealDraft = (nextDay, nextSlot) => {
    const slotDefault = MEAL_SLOTS.find((item) => item.key === nextSlot);
    return {
      ...emptyMeal,
      time: slotDefault?.time || "",
      ...(appData.dietPlan[nextDay]?.[nextSlot] || {})
    };
  };

  const selectDay = (nextDay) => {
    setDay(nextDay);
    setAddDays([nextDay]);
    setDraft(getMealDraft(nextDay, slot));
  };

  const selectSlot = (nextSlot) => {
    setSlot(nextSlot);
    setDraft(getMealDraft(day, nextSlot));
  };

  const loadMeal = (nextDay, nextSlot) => {
    setDay(nextDay);
    setSlot(nextSlot);
    setDraft(getMealDraft(nextDay, nextSlot));
  };

  const clearDraft = () => {
    const slotDefault = MEAL_SLOTS.find((item) => item.key === slot);
    setDraft({
      ...emptyMeal,
      time: slotDefault?.time || ""
    });
  };

  const visibleMeals = useMemo(() =>
    MEAL_SLOTS.map((mealSlot) => ({
      day,
      slot: mealSlot.key,
      label: mealSlot.label,
      meal: appData.dietPlan[day]?.[mealSlot.key]
    })).filter((item) => item.meal),
  [appData.dietPlan, day]);

  const updateDraft = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveMeal = () => {
    setAppData((current) => ({
      ...current,
      dietPlan: {
        ...current.dietPlan,
        [day]: {
          ...current.dietPlan[day],
          [slot]: draft
        }
      }
    }));
  };

  const addMeal = () => {
    setAppData((current) => {
      const nextDietPlan = { ...current.dietPlan };
      addDays.forEach((selectedDay) => {
        nextDietPlan[selectedDay] = {
          ...nextDietPlan[selectedDay],
          [slot]: draft
        };
      });
      return { ...current, dietPlan: nextDietPlan };
    });
  };

  const deleteMeal = () => {
    setAppData((current) => {
      const dayMeals = { ...current.dietPlan[day] };
      delete dayMeals[slot];

      return {
        ...current,
        dietPlan: {
          ...current.dietPlan,
          [day]: dayMeals
        }
      };
    });
  };

  return (
    <>
      <div style={cardStyle()}>
        <h3 style={{ marginTop: 0 }}>{t("addEditDish")}</h3>

        <DayPicker selectedDay={day} onSelect={selectDay} />

        <div style={{ marginBottom: "12px" }}>
          <select value={slot} onChange={(event) => selectSlot(event.target.value)} style={fieldStyle()}>
            {MEAL_SLOTS.map((item) => <option key={item.key} value={item.key}>{t(item.key)}</option>)}
          </select>
        </div>

        <Field label={t("dishName")} value={draft.name} onChange={(value) => updateDraft("name", value)} />
        <Field label={t("time")} value={draft.time} onChange={(value) => updateDraft("time", value)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <Field label={t("calories")} type="number" value={draft.calories} onChange={(value) => updateDraft("calories", value)} />
          <Field label={t("protein")} type="number" value={draft.protein} onChange={(value) => updateDraft("protein", value)} />
        </div>
        <Field label={t("prepInstructions")} textarea value={draft.prep} onChange={(value) => updateDraft("prep", value)} />
        <Field label={t("tip")} textarea value={draft.tip} onChange={(value) => updateDraft("tip", value)} />

        <div style={{ marginBottom: "12px" }}>
          <strong style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>{t("assignToDays")}</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {DAYS.map((item) => (
              <label key={item} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <input
                  type="checkbox"
                  checked={addDays.includes(item)}
                  onChange={() => setAddDays((current) =>
                    current.includes(item) ? current.filter((dayItem) => dayItem !== item) : [...current, item]
                  )}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button type="button" onClick={saveMeal} style={buttonStyle()}>{t("save")}</button>
          <button type="button" onClick={addMeal} style={buttonStyle("soft")}>{t("saveToSelectedDays")}</button>
          <button type="button" onClick={clearDraft} style={buttonStyle("soft")}>{t("clear")}</button>
          <button type="button" onClick={deleteMeal} style={buttonStyle("danger")}>{t("delete")}</button>
        </div>
      </div>

      <div style={cardStyle()}>
        <h3 style={{ marginTop: 0 }}>{day} {t("meals")}</h3>
        {visibleMeals.map((item) => (
          <button
            type="button"
            key={`${item.day}-${item.slot}`}
            onClick={() => loadMeal(item.day, item.slot)}
            style={{
              width: "100%",
              textAlign: "left",
              border: 0,
              borderBottom: "1px solid var(--app-border)",
              background: "transparent",
              padding: "10px 0",
              font: "inherit",
              cursor: "pointer"
            }}
          >
            <strong>{item.meal.name}</strong>
            <div style={{ color: "var(--app-muted)", fontSize: "13px" }}>
              {item.day} - {t(item.slot)} - {item.meal.time} - {item.meal.calories} cal - {item.meal.protein}g {t("protein")}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function ExercisesSection({ appData, setAppData, t }) {
  const [day, setDay] = useState("Mon");
  const [newExercise, setNewExercise] = useState(emptyExercise);
  const workout = appData.workouts[day] || { focus: "", exercises: [] };

  const updateWorkout = (nextWorkout) => {
    setAppData((current) => ({
      ...current,
      workouts: {
        ...current.workouts,
        [day]: nextWorkout
      }
    }));
  };

  const updateExercise = (index, key, value) => {
    const exercises = workout.exercises.map((exercise, exerciseIndex) =>
      exerciseIndex === index ? { ...exercise, [key]: value } : exercise
    );
    updateWorkout({ ...workout, exercises });
  };

  const moveExercise = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= workout.exercises.length) return;

    const exercises = [...workout.exercises];
    const [item] = exercises.splice(index, 1);
    exercises.splice(nextIndex, 0, item);
    updateWorkout({ ...workout, exercises });
  };

  return (
    <div style={cardStyle()}>
      <h3 style={{ marginTop: 0 }}>{t("exercises")}</h3>

      <DayPicker selectedDay={day} onSelect={setDay} />

      <Field label={t("workoutFocus")} value={workout.focus} onChange={(value) => updateWorkout({ ...workout, focus: value })} />

      {workout.exercises.map((exercise, index) => (
        <div key={`${exercise.name}-${index}`} style={{ borderTop: "1px solid var(--app-border)", paddingTop: "12px", marginTop: "12px" }}>
          <Field label={t("exercise")} value={exercise.name} onChange={(value) => updateExercise(index, "name", value)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Field label={t("sets")} type="number" value={exercise.sets} onChange={(value) => updateExercise(index, "sets", value)} />
            <Field label={t("reps")} value={exercise.reps} onChange={(value) => updateExercise(index, "reps", value)} />
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button type="button" onClick={() => moveExercise(index, -1)} style={buttonStyle("soft")}>{t("up")}</button>
            <button type="button" onClick={() => moveExercise(index, 1)} style={buttonStyle("soft")}>{t("down")}</button>
            <button
              type="button"
              onClick={() => updateWorkout({
                ...workout,
                exercises: workout.exercises.filter((_, exerciseIndex) => exerciseIndex !== index)
              })}
              style={buttonStyle("danger")}
            >
              {t("delete")}
            </button>
          </div>
        </div>
      ))}

      <div style={{ borderTop: "1px solid var(--app-border)", paddingTop: "12px", marginTop: "12px" }}>
        <h4>{t("addExercise")}</h4>
        <Field label={t("exercise")} value={newExercise.name} onChange={(value) => setNewExercise((current) => ({ ...current, name: value }))} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <Field label={t("sets")} type="number" value={newExercise.sets} onChange={(value) => setNewExercise((current) => ({ ...current, sets: value }))} />
          <Field label={t("reps")} value={newExercise.reps} onChange={(value) => setNewExercise((current) => ({ ...current, reps: value }))} />
        </div>
        <button
          type="button"
          onClick={() => {
            if (!newExercise.name.trim()) return;
            updateWorkout({ ...workout, exercises: [...workout.exercises, newExercise] });
            setNewExercise(emptyExercise);
          }}
          style={buttonStyle()}
        >
          {t("add")}
        </button>
      </div>
    </div>
  );
}

function TargetsSection({ appData, setAppData, t }) {
  const updateTargets = (key, value) => {
    setAppData((current) => ({
      ...current,
      targets: {
        ...current.targets,
        [key]: value
      }
    }));
  };

  return (
    <div style={cardStyle()}>
      <h3 style={{ marginTop: 0 }}>{t("targets")}</h3>
      <Field label={t("dailyCalorieGoal")} type="number" value={appData.targets.calories} onChange={(value) => updateTargets("calories", value)} />
      <Field label={t("dailyProteinGoal")} type="number" value={appData.targets.protein} onChange={(value) => updateTargets("protein", value)} />

      <label style={{ display: "block", marginBottom: "12px", fontWeight: 600 }}>
        {t("deficitTarget")}
        <select
          value={appData.targets.deficitMode}
          onChange={(event) => updateTargets("deficitMode", event.target.value)}
          style={{ ...fieldStyle(), marginTop: "6px" }}
        >
          <option value="auto">{t("autoCalculated")}</option>
          <option value="manual">{t("manualOverride")}</option>
        </select>
      </label>

      {appData.targets.deficitMode === "manual" && (
        <Field label={t("manualDeficit")} type="number" value={appData.targets.deficitOverride} onChange={(value) => updateTargets("deficitOverride", value)} />
      )}
    </div>
  );
}

function SettingsSection({ appData, setAppData, t }) {
  const updateSettings = (key, value) => {
    setAppData((current) => ({
      ...current,
      settings: {
        ...current.settings,
        [key]: value
      }
    }));
  };

  return (
    <div style={cardStyle()}>
      <h3 style={{ marginTop: 0 }}>{t("settings")}</h3>

      <label style={{ display: "block", marginBottom: "12px", fontWeight: 600 }}>
        {t("language")}
        <select
          value={appData.settings.language}
          onChange={(event) => updateSettings("language", event.target.value)}
          style={{ ...fieldStyle(), marginTop: "6px" }}
        >
          {LANGUAGES.map((item) => (
            <option key={item.key} value={item.key}>{item.label}</option>
          ))}
        </select>
      </label>

      <label style={{ display: "block", marginBottom: "12px", fontWeight: 600 }}>
        {t("timeDisplay")}
        <select
          value={appData.settings.timezoneDisplay}
          onChange={(event) => updateSettings("timezoneDisplay", event.target.value)}
          style={{ ...fieldStyle(), marginTop: "6px" }}
        >
          {TIMEZONE_OPTIONS.map((item) => (
            <option key={item.key} value={item.key}>{item.label}</option>
          ))}
        </select>
      </label>

      <label style={{ display: "block", marginBottom: "12px", fontWeight: 600 }}>
        {t("theme")}
        <select
          value={appData.settings.theme}
          onChange={(event) => updateSettings("theme", event.target.value)}
          style={{ ...fieldStyle(), marginTop: "6px" }}
        >
          {THEMES.map((item) => (
            <option key={item.key} value={item.key}>{t(item.key)}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

function AppDataSection({ appData, setAppData, resetAppData, t }) {
  const exportData = () => {
    const blob = new Blob([JSON.stringify(appData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wellness-app-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file) => {
    if (!file) return;
    const text = await file.text();
    setAppData(JSON.parse(text));
  };

  return (
    <div style={cardStyle()}>
      <h3 style={{ marginTop: 0 }}>{t("appData")}</h3>
      <div style={{ display: "grid", gap: "10px" }}>
        <button type="button" onClick={exportData} style={buttonStyle()}>{t("exportBackup")}</button>
        <label style={{
          ...buttonStyle("soft"),
          display: "block",
          textAlign: "center"
        }}>
          {t("importBackup")}
          <input
            type="file"
            accept="application/json"
            onChange={(event) => importData(event.target.files?.[0])}
            style={{ display: "none" }}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset all app data to defaults?")) resetAppData();
          }}
          style={buttonStyle("danger")}
        >
          {t("resetToDefault")}
        </button>
      </div>
    </div>
  );
}

function AboutSection({ appData, setAppData, t }) {
  const updateAbout = (key, value) => {
    setAppData((current) => ({
      ...current,
      about: {
        ...current.about,
        [key]: value
      }
    }));
  };

  return (
    <div style={cardStyle()}>
      <h3 style={{ marginTop: 0 }}>{t("about")}</h3>
      <Field label={t("appVersion")} value={appData.about.version} onChange={(value) => updateAbout("version", value)} />
      <Field label={t("yourName")} value={appData.about.ownerName} onChange={(value) => updateAbout("ownerName", value)} />
      <Field label={t("tagline")} value={appData.about.tagline} onChange={(value) => updateAbout("tagline", value)} />
    </div>
  );
}

function MenuList({ onOpen, t }) {
  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {SECTIONS.map((item) => (
        <button
          type="button"
          key={item.key}
          onClick={() => onOpen(item.key)}
          style={{
            ...cardStyle(),
            width: "100%",
            border: 0,
            textAlign: "left",
            cursor: "pointer",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span>
            <strong style={{ display: "block", fontSize: "17px", marginBottom: "4px", fontWeight: 650 }}>{t(item.labelKey)}</strong>
            <span style={{ color: "var(--app-muted)", fontSize: "13px" }}>{t(item.descriptionKey)}</span>
          </span>
          <span style={{ color: "var(--app-primary)", fontWeight: 800, fontSize: "20px" }}>{">"}</span>
        </button>
      ))}
    </div>
  );
}

export default function Menu() {
  const [section, setSection] = useState(null);
  const { appData, setAppData, resetAppData } = useAppData();
  const { t } = useTranslation();
  const currentSection = SECTIONS.find((item) => item.key === section);

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <h1 style={{ color: "var(--app-text)" }}>{currentSection ? t(currentSection.labelKey) : t("menu")}</h1>
        {section ? (
          <button
            type="button"
            onClick={() => setSection(null)}
            style={{ ...buttonStyle("soft"), padding: "8px 12px" }}
          >
            {t("back")}
          </button>
        ) : (
          <Link to="/" style={{ color: "var(--app-primary)", fontWeight: 650, textDecoration: "none" }}>{t("done")}</Link>
        )}
      </div>

      {!section && <MenuList onOpen={setSection} t={t} />}
      {section === "Meals" && <MealsSection appData={appData} setAppData={setAppData} t={t} />}
      {section === "Exercises" && <ExercisesSection appData={appData} setAppData={setAppData} t={t} />}
      {section === "Targets" && <TargetsSection appData={appData} setAppData={setAppData} t={t} />}
      {section === "Settings" && <SettingsSection appData={appData} setAppData={setAppData} t={t} />}
      {section === "App Data" && <AppDataSection appData={appData} setAppData={setAppData} resetAppData={resetAppData} t={t} />}
      {section === "About" && <AboutSection appData={appData} setAppData={setAppData} t={t} />}
    </div>
  );
}
