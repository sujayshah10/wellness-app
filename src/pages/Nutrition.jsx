import { useDay } from "../context/useDay";
import { useMeals } from "../context/useMeals";
import { useAppData } from "../context/useAppData";
import TimeHeader from "../components/TimeHeader";
import DaySelector from "../components/DaySelector";
import { useTranslation } from "../utils/useTranslation";

export default function Nutrition() {

  const { selectedDay, setSelectedDay } = useDay();
  const { toggleMealCompletion, isMealCompleted } = useMeals();
  const { appData } = useAppData();
  const { t } = useTranslation();

  const dietData = appData.dietPlan[selectedDay];

  return (
    <div className="page">

      <h1 style={{ color:"var(--app-text)" }}>
        {t("nutrition")}
      </h1>

      <TimeHeader />

      {/* Day selector */}

      <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

      {/* Meal Timeline */}

      {dietData ? (
        <>
          {[
            { key: "meal1", label: t("meal1") },
            { key: "meal2", label: t("meal2") },
            { key: "snack", label: t("snack") },
            { key: "meal3", label: t("meal3") }
          ].map((mealType) => {
            const meal = dietData[mealType.key];
            if (!meal) return null;

            const completed = isMealCompleted(selectedDay, mealType.key);

            return (
              <div
                key={mealType.key}
                style={{
                  background: completed ? "color-mix(in srgb, var(--app-accent) 14%, var(--app-surface))" : "var(--app-surface)",
                  color: "var(--app-text)",
                  padding: "18px",
                  borderRadius: "12px",
                  marginBottom: "14px",
                  boxShadow: "var(--app-shadow)",
                  border: "1px solid var(--app-border)",
                  opacity: completed ? 0.8 : 1,
                  textDecoration: completed ? "line-through" : "none"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--app-muted)",
                        marginBottom: "4px"
                      }}
                    >
                      {mealType.label}
                      {meal.time ? ` - ${meal.time}` : ""}
                    </div>

                    <strong style={{ fontSize: "16px", color: "var(--app-text)", fontWeight: 700 }}>
                      {meal.name}
                    </strong>

                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginTop: "8px",
                        fontSize: "13px",
                        color: "var(--app-muted)"
                      }}
                    >
                      <span>{meal.calories} cal</span>
                      <span>{meal.protein}g protein</span>
                    </div>

                    {meal.prep && (
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "10px",
                          background: "var(--app-surface-soft)",
                          color: "var(--app-text)",
                          borderRadius: "8px",
                          fontSize: "13px"
                        }}
                      >
                        <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                          {t("prep")}:
                        </div>
                        <div style={{ color: "var(--app-muted)" }}>{meal.prep}</div>
                      </div>
                    )}

                    {meal.tip && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "var(--app-accent)",
                          fontStyle: "italic"
                        }}
                      >
                        {t("tip")}: {meal.tip}
                      </div>
                    )}
                  </div>

                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={() => toggleMealCompletion(selectedDay, mealType.key)}
                    style={{
                      width: "24px",
                      height: "24px",
                      marginLeft: "12px",
                      cursor: "pointer"
                    }}
                  />
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <p style={{ color: "var(--app-muted)" }}>{t("noMealData")}</p>
      )}

    </div>
  );
}
