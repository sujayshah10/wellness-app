import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/useAppData";
import { DAYS, DEFAULT_INTAKE_SLOTS, LANGUAGES, THEMES, TIMEZONE_OPTIONS } from "../data/defaultAppData";
import { useTranslation } from "../utils/useTranslation";

const SECTIONS = [
  { key: "Intakes", labelKey: "intakes", descriptionKey: "descIntakes", icon: "utensils" },
  { key: "Exercises", labelKey: "exercises", descriptionKey: "descExercises", icon: "activity" },
  { key: "Targets", labelKey: "targets", descriptionKey: "descTargets", icon: "target" },
  { key: "Settings", labelKey: "settings", descriptionKey: "descSettings", icon: "settings" },
  { key: "App Data", labelKey: "appData", descriptionKey: "descAppData", icon: "database" },
  { key: "About", labelKey: "about", descriptionKey: "descAbout", icon: "info" }
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
  reps: "10-12",
  mediaUrl: ""
};

function mediaSearchUrl(name) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} proper form`)}`;
}

function Icon({ name }) {
  const paths = {
    utensils: "M7 3v8M4 3v8M10 3v8M4 7h6M7 11v10M16 3v18M16 3c3 2 4 6 0 9",
    activity: "M3 12h4l3-7 4 14 3-7h4",
    target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
    settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 12h2M18 12h2M12 4v2M12 18v2M6.6 6.6l1.4 1.4M16 16l1.4 1.4M17.4 6.6 16 8M8 16l-1.4 1.4",
    database: "M5 6c0-2 14-2 14 0v12c0 2-14 2-14 0V6ZM5 6c0 2 14 2 14 0M5 12c0 2 14 2 14 0",
    info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7h.01",
    chevron: "M9 6l6 6-6 6"
  };

  return (
    <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

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

function IntakesSection({ appData, setAppData, t }) {
  const [day, setDay] = useState("Mon");
  const intakeSlots = appData.intakeSlots || DEFAULT_INTAKE_SLOTS;
  const activeIntakeSlots = intakeSlots.filter((item) => item.active !== false);
  const [slot, setSlot] = useState(activeIntakeSlots[0]?.key || "intake1");
  const [draft, setDraft] = useState(() => ({
    ...emptyMeal,
    ...(appData.dietPlan.Mon?.[activeIntakeSlots[0]?.key || "intake1"] || {})
  }));
  const [addDays, setAddDays] = useState(["Mon"]);
  const [validationMessage, setValidationMessage] = useState("");

  const getIntakeDraft = (nextDay, nextSlot) => {
    const slotDefault = intakeSlots.find((item) => item.key === nextSlot);
    return {
      ...emptyMeal,
      time: slotDefault?.time || "",
      ...(appData.dietPlan[nextDay]?.[nextSlot] || {})
    };
  };

  const selectDay = (nextDay) => {
    setDay(nextDay);
    setAddDays([nextDay]);
    setDraft(getIntakeDraft(nextDay, slot));
  };

  const selectSlot = (nextSlot) => {
    setSlot(nextSlot);
    setDraft(getIntakeDraft(day, nextSlot));
  };

  const loadIntake = (nextDay, nextSlot) => {
    setDay(nextDay);
    setSlot(nextSlot);
    setDraft(getIntakeDraft(nextDay, nextSlot));
  };

  const clearDraft = () => {
    const slotDefault = intakeSlots.find((item) => item.key === slot);
    setDraft({
      ...emptyMeal,
      time: slotDefault?.time || ""
    });
  };

  const visibleIntakes = useMemo(() =>
    activeIntakeSlots.map((mealSlot) => ({
      day,
      slot: mealSlot.key,
      label: mealSlot.label,
      meal: appData.dietPlan[day]?.[mealSlot.key]
    })).filter((item) => item.meal),
  [appData.dietPlan, day, activeIntakeSlots]);

  const updateDraft = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveIntake = () => {
    if (!draft.name.trim()) {
      setValidationMessage(t("nameRequired"));
      return;
    }

    const cleanDraft = {
      ...draft,
      name: draft.name.trim(),
      calories: Math.max(0, Number(draft.calories) || 0),
      protein: Math.max(0, Number(draft.protein) || 0)
    };
    setValidationMessage("");

    setAppData((current) => ({
      ...current,
      dietPlan: {
        ...current.dietPlan,
        [day]: {
          ...current.dietPlan[day],
          [slot]: cleanDraft
        }
      }
    }));
  };

  const updateIntakeSlot = (key, value) => {
    setAppData((current) => ({
      ...current,
      intakeSlots: (current.intakeSlots || DEFAULT_INTAKE_SLOTS).map((item) =>
        item.key === slot ? { ...item, [key]: value } : item
      )
    }));
  };

  const addIntakeSlot = () => {
    let createdKey = "";
    let createdLabel = "";

    setAppData((current) => {
      const currentSlots = current.intakeSlots || DEFAULT_INTAKE_SLOTS;
      const nextNumber = currentSlots.length + 1;
      const nextKey = `intake${Date.now()}${nextNumber}`;
      createdKey = nextKey;
      createdLabel = `${t("intake")} ${nextNumber}`;
      const nextSlot = {
        key: nextKey,
        label: createdLabel,
        time: "",
        active: true
      };

      const nextDietPlan = { ...current.dietPlan };
      DAYS.forEach((item) => {
        nextDietPlan[item] = {
          ...(nextDietPlan[item] || {}),
          [nextKey]: {
            ...emptyMeal,
            name: `${t("intake")} ${nextNumber}`,
            time: ""
          }
        };
      });

      return {
        ...current,
        intakeSlots: [...currentSlots, nextSlot],
        dietPlan: nextDietPlan
      };
    });

    if (createdKey) {
      setSlot(createdKey);
      setDraft({
        ...emptyMeal,
        name: createdLabel,
        time: ""
      });
    }
  };

  const removeCurrentIntakeSlot = () => {
    if (intakeSlots.length <= 1) return;
    if (!window.confirm(t("confirmDeleteIntakeSlot"))) return;
    const nextSlot = activeIntakeSlots.find((item) => item.key !== slot)?.key || intakeSlots[0].key;

    setAppData((current) => {
      const nextDietPlan = { ...current.dietPlan };
      DAYS.forEach((item) => {
        const dayIntakes = { ...(nextDietPlan[item] || {}) };
        delete dayIntakes[slot];
        nextDietPlan[item] = dayIntakes;
      });

      return {
        ...current,
        intakeSlots: (current.intakeSlots || DEFAULT_INTAKE_SLOTS).filter((item) => item.key !== slot),
        dietPlan: nextDietPlan
      };
    });

    setSlot(nextSlot);
    setDraft(getIntakeDraft(day, nextSlot));
  };

  const addIntake = () => {
    if (!draft.name.trim()) {
      setValidationMessage(t("nameRequired"));
      return;
    }

    const cleanDraft = {
      ...draft,
      name: draft.name.trim(),
      calories: Math.max(0, Number(draft.calories) || 0),
      protein: Math.max(0, Number(draft.protein) || 0)
    };
    setValidationMessage("");

    setAppData((current) => {
      const nextDietPlan = { ...current.dietPlan };
      addDays.forEach((selectedDay) => {
        nextDietPlan[selectedDay] = {
          ...nextDietPlan[selectedDay],
          [slot]: cleanDraft
        };
      });
      return { ...current, dietPlan: nextDietPlan };
    });
  };

  const deleteIntake = () => {
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
        <h3 style={{ marginTop: 0 }}>{t("intakeStructure")}</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "8px", alignItems: "end" }}>
          <Field label={t("numberOfIntakeSlots")} type="number" value={activeIntakeSlots.length} onChange={(value) => {
            const targetCount = Math.max(1, Math.min(12, Number(value) || 1));
            if (targetCount > activeIntakeSlots.length) {
              setAppData((current) => {
                const currentSlots = current.intakeSlots || DEFAULT_INTAKE_SLOTS;
                const nextSlots = currentSlots.map((item) => ({ ...item }));
                const nextDietPlan = { ...current.dietPlan };

                for (const item of nextSlots) {
                  if (nextSlots.filter((slotItem) => slotItem.active !== false).length >= targetCount) break;
                  item.active = true;
                }

                while (nextSlots.filter((item) => item.active !== false).length < targetCount) {
                  const nextNumber = nextSlots.length + 1;
                  const nextKey = `intake${Date.now()}${nextNumber}`;
                  nextSlots.push({
                    key: nextKey,
                    label: `${t("intake")} ${nextNumber}`,
                    time: "",
                    active: true
                  });

                  DAYS.forEach((item) => {
                    nextDietPlan[item] = {
                      ...(nextDietPlan[item] || {}),
                      [nextKey]: {
                        ...emptyMeal,
                        name: `${t("intake")} ${nextNumber}`,
                        time: ""
                      }
                    };
                  });
                }

                return { ...current, intakeSlots: nextSlots, dietPlan: nextDietPlan };
              });
            } else if (targetCount < activeIntakeSlots.length) {
              if (!window.confirm(t("confirmDeleteIntakeSlot"))) return;
              setAppData((current) => {
                const nextSlots = (current.intakeSlots || DEFAULT_INTAKE_SLOTS).map((item) => ({ ...item }));
                let activeSeen = 0;
                nextSlots.forEach((item) => {
                  if (item.active === false) return;
                  activeSeen += 1;
                  item.active = activeSeen <= targetCount;
                });
                return { ...current, intakeSlots: nextSlots };
              });
              setSlot(activeIntakeSlots[0]?.key || "intake1");
            }
          }} />
          <button type="button" onClick={addIntakeSlot} style={{ ...buttonStyle("soft"), marginBottom: "12px" }}>{t("add")}</button>
          <button type="button" onClick={removeCurrentIntakeSlot} style={{ ...buttonStyle("danger"), marginBottom: "12px" }}>{t("delete")}</button>
          <button type="button" onClick={() => {
            if (!window.confirm(t("confirmRestoreDefaultIntakes"))) return;
            setAppData((current) => {
              const nextDietPlan = {};
              DAYS.forEach((item) => {
                const dayPlan = current.dietPlan[item] || {};
                nextDietPlan[item] = {};
                DEFAULT_INTAKE_SLOTS.forEach((slotDef) => {
                  nextDietPlan[item][slotDef.key] = {
                    ...emptyMeal,
                    ...(dayPlan[slotDef.key] || {}),
                    name: dayPlan[slotDef.key]?.name || slotDef.label,
                    time: slotDef.time || dayPlan[slotDef.key]?.time || ""
                  };
                });
              });
              return {
                ...current,
                intakeSlots: DEFAULT_INTAKE_SLOTS,
                dietPlan: nextDietPlan
              };
            });
            setSlot(DEFAULT_INTAKE_SLOTS[0].key);
          }} style={{ ...buttonStyle("primary"), marginBottom: "12px" }}>{t("restoreDefaultIntakes")}</button>
        </div>

        <Field
          label={t("intakeSlotName")}
          value={intakeSlots.find((item) => item.key === slot)?.label || ""}
          onChange={(value) => updateIntakeSlot("label", value)}
        />
        <p style={{ margin: 0, color: "var(--app-muted)", fontSize: "12px" }}>{t("inactiveIntakesSaved")}</p>
      </div>

      <div style={cardStyle()}>
        <h3 style={{ marginTop: 0 }}>{t("addEditIntake")}</h3>

        <DayPicker selectedDay={day} onSelect={selectDay} />

        <div style={{ marginBottom: "12px" }}>
          <select value={slot} onChange={(event) => selectSlot(event.target.value)} style={fieldStyle()}>
            {activeIntakeSlots.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select>
        </div>

        {validationMessage && <div className="inline-error">{validationMessage}</div>}

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
          <button type="button" onClick={saveIntake} style={buttonStyle()}>{t("save")}</button>
          <button type="button" onClick={addIntake} style={buttonStyle("soft")}>{t("saveToSelectedDays")}</button>
          <button type="button" onClick={clearDraft} style={buttonStyle("soft")}>{t("clear")}</button>
          <button type="button" onClick={deleteIntake} style={buttonStyle("danger")}>{t("delete")}</button>
        </div>
      </div>

      <div style={cardStyle()}>
        <h3 style={{ marginTop: 0 }}>{day} {t("intakes")}</h3>
        {visibleIntakes.length === 0 && <div className="empty-state compact"><strong>{t("noActiveIntakes")}</strong><span>{t("addIntakesFromMenu")}</span></div>}
        {visibleIntakes.map((item) => (
          <button
            type="button"
            key={`${item.day}-${item.slot}`}
            onClick={() => loadIntake(item.day, item.slot)}
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
              {item.day} - {item.label} - {item.meal.time} - {item.meal.calories} cal - {item.meal.protein}g {t("protein")}
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

  const setExerciseCount = (value) => {
    const targetCount = Math.max(0, Math.min(30, Number(value) || 0));
    const exercises = [...workout.exercises];

    while (exercises.length < targetCount) {
      exercises.push({
        ...emptyExercise,
        name: `${t("exercise")} ${exercises.length + 1}`
      });
    }

    updateWorkout({ ...workout, exercises: exercises.slice(0, targetCount) });
  };

  return (
    <div style={cardStyle()}>
      <h3 style={{ marginTop: 0 }}>{t("exercises")}</h3>

      <DayPicker selectedDay={day} onSelect={setDay} />

      <Field label={t("workoutFocus")} value={workout.focus} onChange={(value) => updateWorkout({ ...workout, focus: value })} />
      <Field label={t("numberOfExercises")} type="number" value={workout.exercises.length} onChange={setExerciseCount} />

      {workout.exercises.map((exercise, index) => (
        <div key={`${exercise.name}-${index}`} style={{ borderTop: "1px solid var(--app-border)", paddingTop: "12px", marginTop: "12px" }}>
          <Field label={t("exercise")} value={exercise.name} onChange={(value) => updateExercise(index, "name", value)} />
          <Field label={t("mediaLink")} value={exercise.mediaUrl || ""} onChange={(value) => updateExercise(index, "mediaUrl", value)} />
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
        <Field label={t("mediaLink")} value={newExercise.mediaUrl} onChange={(value) => setNewExercise((current) => ({ ...current, mediaUrl: value }))} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <Field label={t("sets")} type="number" value={newExercise.sets} onChange={(value) => setNewExercise((current) => ({ ...current, sets: value }))} />
          <Field label={t("reps")} value={newExercise.reps} onChange={(value) => setNewExercise((current) => ({ ...current, reps: value }))} />
        </div>
        <button
          type="button"
          onClick={() => {
            if (!newExercise.name.trim()) return;
            updateWorkout({
              ...workout,
              exercises: [
                ...workout.exercises,
                {
                  ...newExercise,
                  mediaUrl: newExercise.mediaUrl || mediaSearchUrl(newExercise.name)
                }
              ]
            });
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

      <div className="empty-state compact" style={{ marginBottom: "12px" }}>
        <strong>Smart defaults</strong>
        <span>Theme, language, and time display all update instantly and stay saved offline.</span>
      </div>

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
            gridTemplateColumns: "40px 1fr auto",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span className="menu-icon-shell"><Icon name={item.icon} /></span>
          <span>
            <strong style={{ display: "block", fontSize: "17px", marginBottom: "4px", fontWeight: 650 }}>{t(item.labelKey)}</strong>
            <span style={{ color: "var(--app-muted)", fontSize: "13px" }}>{t(item.descriptionKey)}</span>
          </span>
          <span style={{ color: "var(--app-primary)", width: "24px", height: "24px" }}><Icon name="chevron" /></span>
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
      {section === "Intakes" && <IntakesSection appData={appData} setAppData={setAppData} t={t} />}
      {section === "Exercises" && <ExercisesSection appData={appData} setAppData={setAppData} t={t} />}
      {section === "Targets" && <TargetsSection appData={appData} setAppData={setAppData} t={t} />}
      {section === "Settings" && <SettingsSection appData={appData} setAppData={setAppData} t={t} />}
      {section === "App Data" && <AppDataSection appData={appData} setAppData={setAppData} resetAppData={resetAppData} t={t} />}
      {section === "About" && <AboutSection appData={appData} setAppData={setAppData} t={t} />}
    </div>
  );
}
