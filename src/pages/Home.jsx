import { Link } from "react-router-dom";
import { useDay } from "../context/useDay";
import { useAppData } from "../context/useAppData";
import TimeHeader from "../components/TimeHeader";
import DaySelector from "../components/DaySelector";
import { findNextMeals } from "../utils/mealEngine";
import { useTranslation } from "../utils/useTranslation";
import { titleCase } from "../utils/textCase";
import { calculateBodyMetrics } from "../utils/healthCalculator";

export default function Home() {

  const { selectedDay, setSelectedDay } = useDay();
  const { appData } = useAppData();
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
          padding:"18px",
          borderRadius:"14px",
          textAlign:"center"
        }}>
          <h2 style={{margin:0}}>{totalCalories}</h2>
          <p style={{margin:0,fontSize:"13px"}}>{t("calories")}</p>
        </div>

        <div style={{
          flex:1,
          background:"linear-gradient(145deg, var(--app-accent), #047857)",
          color:"white",
          padding:"18px",
          borderRadius:"14px",
          textAlign:"center"
        }}>
          <h2 style={{margin:0}}>{totalProtein}g</h2>
          <p style={{margin:0,fontSize:"13px"}}>{t("protein")}</p>
        </div>

        <div style={{
          flex:1,
          background:"linear-gradient(145deg, #020617, #1E293B)",
          color:"white",
          padding:"18px",
          borderRadius:"14px",
          textAlign:"center"
        }}>
          <h2 style={{margin:0}}>~{deficit}</h2>
          <p style={{margin:0,fontSize:"13px"}}>{t("deficit")}</p>
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
            <span>Open Menu → Intakes to add your next meals.</span>
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
