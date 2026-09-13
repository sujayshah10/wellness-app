import { useDay } from "../context/useDay";
import { useAppData } from "../context/useAppData";
import CompletionRing from "../components/CompletionRing";
import StreakCounter from "../components/StreakCounter";
import ProgressChart from "../components/ProgressChart";
import { useTranslation } from "../utils/useTranslation";
import { calculateBodyMetrics } from "../utils/healthCalculator";

export default function Progress() {
  const { selectedDay } = useDay();
  const { appData, getDailyCompletion } = useAppData();
  const { t } = useTranslation();

  const completionTracker = appData.completionTracker || {};
  const streakData = appData.streakData || {
    currentStreak: 0,
    longestStreak: 0,
    streakHistory: []
  };

  // Calculate weekly stats
  const getWeekData = () => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const completionData = completionTracker[dateKey];
      const completion = completionData?.overallCompletion || 0;
      
      weekData.push({
        dateKey,
        dayName,
        completion,
        hasData: !!completionData
      });
    }
    
    return weekData;
  };

  const weekData = getWeekData();
  const completedDays = weekData.filter(day => day.completion >= 0.8).length;
  const averageCompletion = weekData.reduce((sum, day) => sum + day.completion, 0) / 7;

  // Calculate calorie/protein adherence
  const getCalorieAdherence = () => {
    const metrics = calculateBodyMetrics(appData.profile, appData.targets);
    const calorieTarget = metrics.calorieTarget || Number(appData.targets.calories) || 0;
    const proteinTarget = Number(appData.targets.protein) || 0;
    
    let calorieAdherenceDays = 0;
    let proteinAdherenceDays = 0;
    let daysWithCalorieData = 0;
    let daysWithProteinData = 0;

    weekData.forEach(day => {
      const dietData = appData.dietPlan[day.dateKey];
      if (dietData) {
        const intakeSlots = appData.intakeSlots.filter(slot => slot.active !== false);
        const totalCalories = intakeSlots.reduce((total, slot) => 
          total + (Number(dietData[slot.key]?.calories) || 0), 0);
        const totalProtein = intakeSlots.reduce((total, slot) => 
          total + (Number(dietData[slot.key]?.protein) || 0), 0);

        if (totalCalories > 0) {
          daysWithCalorieData++;
          const calorieDiff = Math.abs(totalCalories - calorieTarget);
          if (calorieDiff <= calorieTarget * 0.15) { // Within 15% of target
            calorieAdherenceDays++;
          }
        }

        if (totalProtein > 0) {
          daysWithProteinData++;
          if (totalProtein >= proteinTarget * 0.8) { // At least 80% of target
            proteinAdherenceDays++;
          }
        }
      }
    });

    return {
      calorieAdherence: daysWithCalorieData > 0 ? calorieAdherenceDays / daysWithCalorieData : 0,
      proteinAdherence: daysWithProteinData > 0 ? proteinAdherenceDays / daysWithProteinData : 0
    };
  };

  const adherence = getCalorieAdherence();

  // Prepare chart data
  const getWeightData = () => {
    // In a real app, this would come from user weight tracking
    // For now, using sample data based on profile
    const baseWeight = appData.profile.weightKg || 80;
    return weekData.map((day, index) => ({
      label: day.dayName,
      value: baseWeight - (index * 0.1) // Sample trend
    }));
  };

  const getCalorieData = () => {
    const metrics = calculateBodyMetrics(appData.profile, appData.targets);
    const calorieTarget = metrics.calorieTarget || Number(appData.targets.calories) || 0;
    
    return weekData.map(day => {
      const dietData = appData.dietPlan[day.dateKey];
      if (dietData) {
        const intakeSlots = appData.intakeSlots.filter(slot => slot.active !== false);
        const totalCalories = intakeSlots.reduce((total, slot) => 
          total + (Number(dietData[slot.key]?.calories) || 0), 0);
        return { label: day.dayName, value: totalCalories };
      }
      return { label: day.dayName, value: calorieTarget };
    });
  };

  const getProteinData = () => {
    const proteinTarget = Number(appData.targets.protein) || 0;
    
    return weekData.map(day => {
      const dietData = appData.dietPlan[day.dateKey];
      if (dietData) {
        const intakeSlots = appData.intakeSlots.filter(slot => slot.active !== false);
        const totalProtein = intakeSlots.reduce((total, slot) => 
          total + (Number(dietData[slot.key]?.protein) || 0), 0);
        return { label: day.dayName, value: totalProtein };
      }
      return { label: day.dayName, value: proteinTarget };
    });
  };

  const getWorkoutData = () => {
    return weekData.map(day => {
      const completionData = completionTracker[day.dateKey];
      const workout = appData.workouts[day.dateKey];
      const exerciseCount = workout?.exercises?.length || 0;
      const completed = completionData?.workoutCompleted ? 1 : 0;
      return { label: day.dayName, value: completed * exerciseCount };
    });
  };

  const weightData = getWeightData();
  const calorieData = getCalorieData();
  const proteinData = getProteinData();
  const workoutData = getWorkoutData();

  return (
    <div className="page">
      <h1 style={{ color: "var(--app-text)" }}>
        {t("progress")}
      </h1>

      {/* Streak Overview */}
      <div style={{ marginBottom: "24px" }}>
        <StreakCounter 
          currentStreak={streakData.currentStreak} 
          longestStreak={streakData.longestStreak}
        />
      </div>

      {/* Weekly Overview Stats */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "24px"
      }}>
        <div style={{
          flex: 1,
          background: "var(--app-surface)",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid var(--app-border)",
          boxShadow: "var(--app-shadow)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#10B981" }}>
            {completedDays}/7
          </div>
          <div style={{ fontSize: "12px", color: "var(--app-muted)", marginTop: "4px" }}>
            Days Completed
          </div>
        </div>

        <div style={{
          flex: 1,
          background: "var(--app-surface)",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid var(--app-border)",
          boxShadow: "var(--app-shadow)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#3B82F6" }}>
            {Math.round(averageCompletion * 100)}%
          </div>
          <div style={{ fontSize: "12px", color: "var(--app-muted)", marginTop: "4px" }}>
            Avg Completion
          </div>
        </div>

        <div style={{
          flex: 1,
          background: "var(--app-surface)",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid var(--app-border)",
          boxShadow: "var(--app-shadow)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#F59E0B" }}>
            {Math.round(adherence.calorieAdherence * 100)}%
          </div>
          <div style={{ fontSize: "12px", color: "var(--app-muted)", marginTop: "4px" }}>
            Calorie Adherence
          </div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div style={{
        background: "var(--app-surface)",
        padding: "20px",
        borderRadius: "14px",
        marginBottom: "20px",
        border: "1px solid var(--app-border)",
        boxShadow: "var(--app-shadow)"
      }}>
        <h3 style={{ color: "var(--app-primary)", marginTop: 0, marginBottom: "16px" }}>
          This Week
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px"
        }}>
          {weekData.map((day) => {
            const isToday = day.dateKey === new Date().toISOString().split('T')[0];
            const getCompletionColor = (completion) => {
              if (completion >= 0.8) return "#10B981";
              if (completion >= 0.5) return "#F59E0B";
              if (completion > 0) return "#EF4444";
              return "#374151";
            };

            return (
              <div
                key={day.dateKey}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--app-muted)" }}>
                  {day.dayName}
                </div>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: getCompletionColor(day.completion),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "white",
                    border: isToday ? "2px solid #3B82F6" : "none",
                    opacity: day.hasData ? 1 : 0.5
                  }}
                >
                  {day.hasData ? Math.round(day.completion * 100) : "-"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div style={{
        background: "var(--app-surface)",
        padding: "20px",
        borderRadius: "14px",
        marginBottom: "20px",
        border: "1px solid var(--app-border)",
        boxShadow: "var(--app-shadow)"
      }}>
        <h3 style={{ color: "var(--app-primary)", marginTop: 0, marginBottom: "16px" }}>
          Weekly Breakdown
        </h3>

        {weekData.map((day) => {
          const isToday = day.dateKey === new Date().toISOString().split('T')[0];
          const completionData = completionTracker[day.dateKey];
          
          return (
            <div
              key={day.dateKey}
              style={{
                padding: "12px 0",
                borderBottom: isToday ? "none" : "1px solid var(--app-border)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}
            >
              <div style={{
                width: "60px",
                fontSize: "13px",
                color: isToday ? "var(--app-primary)" : "var(--app-text)",
                fontWeight: isToday ? "600" : "400"
              }}>
                {day.dayName}
                {isToday && " (Today)"}
              </div>

              <div style={{ flex: 1 }}>
                <CompletionRing 
                  completion={day.completion} 
                  size={40} 
                  strokeWidth={6} 
                  showLabel={false}
                />
              </div>

              <div style={{ fontSize: "13px", color: "var(--app-muted)" }}>
                {day.hasData ? `${Math.round(day.completion * 100)}% complete` : "No data"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivation Message */}
      <div style={{
        background: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
        padding: "20px",
        borderRadius: "14px",
        border: "1px solid #374151",
        textAlign: "center",
        marginBottom: "20px"
      }}>
        <div style={{ fontSize: "16px", color: "#D1D5DB", fontWeight: "500" }}>
          {streakData.currentStreak >= 7 
            ? "🔥 Amazing consistency! Keep up the great work!" 
            : streakData.currentStreak >= 3 
            ? "⚡ You're building momentum! Stay consistent!" 
            : "✨ Every day counts. Start your streak today!"}
        </div>
      </div>

      {/* Progress Charts */}
      <h3 style={{ color: "var(--app-primary)", marginTop: 0, marginBottom: "16px" }}>
        Progress Trends
      </h3>

      <ProgressChart 
        data={weightData} 
        label="Weight" 
        color="#10B981" 
        unit="kg" 
      />

      <ProgressChart 
        data={calorieData} 
        label="Calories" 
        color="#3B82F6" 
        unit=" kcal" 
      />

      <ProgressChart 
        data={proteinData} 
        label="Protein" 
        color="#F59E0B" 
        unit="g" 
      />

      <ProgressChart 
        data={workoutData} 
        label="Workouts Completed" 
        color="#8B5CF6" 
        unit="" 
      />
    </div>
  );
}
