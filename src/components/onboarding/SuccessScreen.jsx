import { calculateBodyMetrics } from "../../utils/healthCalculator";

export default function SuccessScreen({ data, onComplete, t }) {
  const metrics = calculateBodyMetrics(
    {
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      activityLevel: data.activityLevel,
      goal: data.goal
    },
    {}
  );

  return (
    <div style={{ padding: "20px 0", textAlign: "center" }}>
      <div style={{
        fontSize: "64px",
        marginBottom: "20px"
      }}>
        🎉
      </div>
      
      <h1 style={{
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "16px",
        color: "var(--app-text)"
      }}>
        You're All Set!
      </h1>
      
      <p style={{
        fontSize: "16px",
        lineHeight: "1.6",
        color: "var(--app-muted)",
        marginBottom: "32px"
      }}>
        Your personalized wellness plan is ready
      </p>

      {/* Personalized Summary */}
      <div style={{
        background: "var(--app-surface)",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
        border: "1px solid var(--app-border)"
      }}>
        <h3 style={{
          marginTop: 0,
          marginBottom: "20px",
          fontSize: "18px",
          color: "var(--app-text)"
        }}>
          Your Daily Targets
        </h3>

        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            background: "linear-gradient(135deg, var(--app-primary), #1D4ED8)",
            borderRadius: "12px",
            color: "white"
          }}>
            <div>
              <div style={{ fontSize: "14px", marginBottom: "4px", opacity: 0.9 }}>
                Daily Calories
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700" }}>
                {Math.round(metrics.calorieTarget || 2000)}
              </div>
            </div>
            <div style={{ fontSize: "32px" }}>
              🔥
            </div>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            background: "linear-gradient(135deg, var(--app-accent), #047857)",
            borderRadius: "12px",
            color: "white"
          }}>
            <div>
              <div style={{ fontSize: "14px", marginBottom: "4px", opacity: 0.9 }}>
                Daily Protein
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700" }}>
                {Math.round(metrics.proteinTarget || 120)}g
              </div>
            </div>
            <div style={{ fontSize: "32px" }}>
              💪
            </div>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            background: "linear-gradient(135deg, #020617, #1E293B)",
            borderRadius: "12px",
            color: "white"
          }}>
            <div>
              <div style={{ fontSize: "14px", marginBottom: "4px", opacity: 0.9 }}>
                Calorie Deficit
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700" }}>
                {Math.round(metrics.deficitTarget || 400)}
              </div>
            </div>
            <div style={{ fontSize: "32px" }}>
              📊
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Summary */}
      <div style={{
        background: "var(--app-surface)",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
        border: "1px solid var(--app-border)"
      }}>
        <h3 style={{
          marginTop: 0,
          marginBottom: "16px",
          fontSize: "18px",
          color: "var(--app-text)"
        }}>
          Your Schedule
        </h3>

        <div style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "12px" }}>
            <strong style={{ color: "var(--app-primary)" }}>🍽️ Meals:</strong>
            <div style={{ fontSize: "14px", color: "var(--app-muted)", marginTop: "4px" }}>
              {data.mealTimes.map((time, index) => (
                <div key={index}>Meal {index + 1}: {time}</div>
              ))}
            </div>
          </div>

          <div>
            <strong style={{ color: "var(--app-primary)" }}>💪 Workout:</strong>
            <div style={{ fontSize: "14px", color: "var(--app-muted)", marginTop: "4px" }}>
              {data.workoutTime}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <button
        onClick={onComplete}
        style={{
          width: "100%",
          padding: "18px",
          background: "linear-gradient(135deg, var(--app-primary), #1D4ED8)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "18px",
          fontWeight: "700",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(47, 128, 255, 0.3)",
          transition: "transform 0.2s, box-shadow 0.2s"
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 16px rgba(47, 128, 255, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 12px rgba(47, 128, 255, 0.3)";
        }}
      >
        Start Your Wellness Journey 🚀
      </button>

      <p style={{
        marginTop: "16px",
        fontSize: "13px",
        color: "var(--app-muted)"
      }}>
        You can always adjust these settings in Menu
      </p>
    </div>
  );
}