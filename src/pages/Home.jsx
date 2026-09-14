import { Link } from "react-router-dom";
import { useDay } from "../context/useDay";
import { useAppData } from "../context/useAppData";
import TimeHeader from "../components/TimeHeader";
import DaySelector from "../components/DaySelector";
import SetupPrompt from "../components/SetupPrompt";
import CompletionRing from "../components/CompletionRing";
import StreakCounter from "../components/StreakCounter";
import { findNextMeals } from "../utils/mealEngine";
import { useTranslation } from "../utils/useTranslation";
import { titleCase } from "../utils/textCase";
import { calculateBodyMetrics } from "../utils/healthCalculator";

export default function Home() {

  const { selectedDay, setSelectedDay } = useDay();
  const { appData, isFirstTime, getDailyCompletion, toggleMealCompletion, toggleWorkoutCompletion } = useAppData();
  const { t, dayName } = useTranslation();

  const dietData = appData.dietPlan[selectedDay];
  const intakeSlots = (appData.intakeSlots || []).filter((slot) => slot.active !== false);
  const workout = appData.workouts[selectedDay] || { focus: "", exercises: [] };
  const workoutExercises = Array.isArray(workout.exercises) ? workout.exercises : [];

  const totalCalories = dietData
    ? intakeSlots.reduce((total, slot) => total + (Number(dietData[slot.key]?.calories) || 0), 0)
    : 0;

  const totalProtein = dietData
    ? intakeSlots.reduce((total, slot) => total + (Number(dietData[slot.key]?.protein) || 0), 0)
    : 0;

  const metrics = calculateBodyMetrics(appData.profile, appData.targets);
  const calorieTarget = metrics.calorieTarget || Number(appData.targets.calories) || 0;
  const deficit = calorieTarget - totalCalories;

  const { nextMeals, nextPrepMeal } = findNextMeals(appData.dietPlan, selectedDay);
  
  // Get today's completion data
  const todayKey = new Date().toISOString().split('T')[0];
  const todayCompletion = getDailyCompletion(todayKey);
  const todayCompletionData = appData.completionTracker[todayKey] || {
    mealsCompleted: [],
    workoutCompleted: false,
    workoutSteps: { warmup: false, mainWorkout: false, afterWorkoutStretches: false }
  };
  
  const streakData = appData.streakData || {
    currentStreak: 0,
    longestStreak: 0
  };

  return (
    <div className="page">

      {/* Header */}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <h1 style={{ color:"var(--app-text)" }}>
          {t("myWellnessPlan")}
        </h1>

        <Link
          to="/menu"
          aria-label="Open menu"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "var(--app-surface)",
            color: "var(--app-text)",
            display: "grid",
            placeItems: "center",
            textDecoration: "none",
            boxShadow: "var(--app-shadow)",
            fontSize: "24px",
            lineHeight: 1
          }}
        >
          =
        </Link>
      </div>

      <TimeHeader />

      {/* Setup Prompt for First-Time Users */}
      {isFirstTime && <SetupPrompt />}

      {/* Day Selector */}

      <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

      {/* Stats */}

      <div style={{
        display:"flex",
        gap:"14px",
        marginBottom:"24px"
      }}>

        <div style={{
          flex:1,
          background:"linear-gradient(145deg, var(--app-primary), #1D4ED8)",
          color:"white",
          padding:"16px",
          borderRadius:"14px",
          textAlign:"center"
        }}>
          <h2 style={{margin:0,fontSize:"20px",fontWeight:"600"}}>{totalCalories}</h2>
          <p style={{margin:0,fontSize:"11px",fontWeight:"500"}}>{t("calories")}</p>
        </div>

        <div style={{
          flex:1,
          background:"linear-gradient(145deg, var(--app-accent), #047857)",
          color:"white",
          padding:"16px",
          borderRadius:"14px",
          textAlign:"center"
        }}>
          <h2 style={{margin:0,fontSize:"20px",fontWeight:"600"}}>{totalProtein}g</h2>
          <p style={{margin:0,fontSize:"11px",fontWeight:"500"}}>{t("protein")}</p>
        </div>

        <div style={{
          flex:1,
          background:"linear-gradient(145deg, #020617, #1E293B)",
          color:"white",
          padding:"16px",
          borderRadius:"14px",
          textAlign:"center"
        }}>
          <h2 style={{margin:0,fontSize:"20px",fontWeight:"600"}}>{deficit > 0 ? `+${deficit}` : deficit}</h2>
          <p style={{margin:0,fontSize:"11px",fontWeight:"500"}}>{t("deficit")}</p>
        </div>

      </div>

      {/* Completion Ring & Streak */}
      
      <div style={{
        display: "flex",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div style={{
          flex: 1,
          background: "var(--app-surface)",
          padding: "20px",
          borderRadius: "14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          border: "1px solid var(--app-border)",
          boxShadow: "var(--app-shadow)"
        }}>
          <h3 style={{ margin: 0, color: "var(--app-text)", fontSize: "14px" }}>
            Today's Progress
          </h3>
          <CompletionRing completion={todayCompletion} size={100} strokeWidth={10} />
        </div>

        <div style={{ flex: 1 }}>
          <StreakCounter 
            currentStreak={streakData.currentStreak} 
            longestStreak={streakData.longestStreak}
          />
        </div>
      </div>

      {/* Daily Checklist */}
      
      <div style={{
        background: "var(--app-surface)",
        color: "var(--app-text)",
        padding: "20px",
        borderRadius: "14px",
        marginBottom: "20px",
        border: "1px solid var(--app-border)",
        boxShadow: "var(--app-shadow)"
      }}>
        <h3 style={{ color: "var(--app-primary)", marginTop: 0, marginBottom: "16px" }}>
          Daily Checklist
        </h3>

        {/* Meals Checklist */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", color: "var(--app-muted)", marginBottom: "8px" }}>
            MEALS
          </div>
          {intakeSlots.map((slot) => {
            const isCompleted = todayCompletionData.mealsCompleted?.includes(slot.key);
            return (
              <button
                key={slot.key}
                onClick={() => toggleMealCompletion(selectedDay, slot.key)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  border: `1px solid ${isCompleted ? "#10B981" : "var(--app-border)"}`,
                  background: isCompleted ? "rgba(16, 185, 129, 0.1)" : "var(--app-surface)",
                  color: "var(--app-text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: `2px solid ${isCompleted ? "#10B981" : "var(--app-muted)"}`,
                  background: isCompleted ? "#10B981" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "white"
                }}>
                  {isCompleted ? "✓" : ""}
                </div>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  {slot.label || titleCase(slot.key)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Workout Checklist */}
        <div>
          <div style={{ fontSize: "12px", color: "var(--app-muted)", marginBottom: "8px" }}>
            WORKOUT
          </div>
          <button
            onClick={() => toggleWorkoutCompletion(selectedDay, 'main')}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: `1px solid ${todayCompletionData.workoutCompleted ? "#10B981" : "var(--app-border)"}`,
              background: todayCompletionData.workoutCompleted ? "rgba(16, 185, 129, 0.1)" : "var(--app-surface)",
              color: "var(--app-text)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: `2px solid ${todayCompletionData.workoutCompleted ? "#10B981" : "var(--app-muted)"}`,
              background: todayCompletionData.workoutCompleted ? "#10B981" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "white"
            }}>
              {todayCompletionData.workoutCompleted ? "✓" : ""}
            </div>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              Complete Workout
            </span>
          </button>
        </div>
      </div>

      {/* Next Intakes */}

      <div style={{
        background:"var(--app-surface)",
        color:"var(--app-text)",
        padding:"20px",
        borderRadius:"14px",
        marginBottom:"20px",
        boxShadow:"var(--app-shadow)",
        border:"1px solid var(--app-border)"
      }}>

        <h3 style={{ color:"var(--app-primary)", marginTop:0 }}>
          {t("nextMeals")}
        </h3>

        {nextMeals.length === 0 ? (
          <div className="empty-state compact">
            <strong>{t("noMealData")}</strong>
          </div>
        ) : nextMeals.map((meal,index)=>(

          <div
            key={index}
            style={{
              padding:"10px 0",
              borderBottom: index === nextMeals.length-1 ? "none" : "1px solid var(--app-border)"
            }}
          >

            <div style={{
              fontSize:"12px",
              color:"var(--app-muted)",
              marginBottom:"4px"
            }}>
              {meal.day ? `${dayName(meal.day)} - ${meal.time}` : meal.time}
            </div>

            <strong>{titleCase(meal.meal || meal.name)}</strong>

          </div>

        ))}

      </div>

      {/* Prep Section */}

      <div style={{
        background:"var(--app-surface)",
        color:"var(--app-text)",
        padding:"20px",
        borderRadius:"14px",
        marginBottom:"20px",
        border:"1px solid var(--app-border)",
        boxShadow:"var(--app-shadow)"
      }}>

        <h3 style={{ color:"var(--app-text)", marginTop:0 }}>
          {t("prepForNextMeal")}
        </h3>

        <p style={{margin:"6px 0"}}>
          {nextPrepMeal ? nextPrepMeal.prep.task || nextPrepMeal.prep : ""}
        </p>

        <p style={{
          color:"var(--app-muted)",
          fontSize:"14px"
        }}>
          {nextPrepMeal?.prep?.start ? `${t("start")}: ${nextPrepMeal.prep.start} - ${nextPrepMeal.prep.ready}` : ""}
        </p>

      </div>

      {/* Workout Focus */}

      <div style={{
        background:"var(--app-surface)",
        color:"var(--app-text)",
        padding:"20px",
        borderRadius:"14px",
        border:"1px solid var(--app-border)",
        boxShadow:"var(--app-shadow)"
      }}>

        <h3 style={{ color:"var(--app-primary)" }}>
          {t("workoutFocus")}
        </h3>

        <p style={{color:"var(--app-muted)"}}>
          {workout.focus || t("noWorkoutData")}
        </p>

        {workoutExercises.length === 0 ? (
          <div className="empty-state compact" style={{ marginTop: "8px" }}>
            <strong>{t("noWorkoutData")}</strong>
          </div>
        ) : (
          <ul>
            {workoutExercises.slice(0, 4).map((exercise) => (
              <li key={exercise.name}>
                {titleCase(exercise.name)} - {exercise.sets} X {titleCase(exercise.reps)}
              </li>
            ))}
          </ul>
        )}

      </div>

    </div>
  );
}
