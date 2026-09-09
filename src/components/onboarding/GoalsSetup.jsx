import { useState } from "react";

export default function GoalsSetup({ data, onNext, onBack, t }) {
  const [formData, setFormData] = useState(data || {
    goal: "fatLoss",
    activityLevel: "light",
    timeline: "moderate"
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ padding: "20px 0" }}>
      <h2 style={{
        fontSize: "24px",
        fontWeight: "700",
        marginBottom: "8px",
        color: "var(--app-text)"
      }}>
        What's Your Goal?
      </h2>
      
      <p style={{
        fontSize: "14px",
        color: "var(--app-muted)",
        marginBottom: "24px"
      }}>
        We'll calculate your targets based on your primary goal
      </p>

      <div style={{ display: "grid", gap: "20px" }}>
        {/* Primary Goal */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--app-text)"
          }}>
            Primary Goal
          </label>
          <div style={{ display: "grid", gap: "12px" }}>
            {[
              { key: "fatLoss", label: "🔥 Fat Loss", desc: "Lose weight while maintaining muscle" },
              { key: "muscleGain", label: "💪 Muscle Gain", desc: "Build lean muscle mass" },
              { key: "maintenance", label: "⚖️ Maintenance", desc: "Maintain current body composition" }
            ].map(goal => (
              <button
                key={goal.key}
                type="button"
                onClick={() => handleChange("goal", goal.key)}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: formData.goal === goal.key ? "var(--app-primary)" : "var(--app-surface)",
                  color: formData.goal === goal.key ? "white" : "var(--app-text)",
                  border: formData.goal === goal.key ? "var(--app-primary)" : "1px solid var(--app-border)",
                  borderRadius: "12px",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>{goal.label}</div>
                <div style={{ fontSize: "14px", opacity: formData.goal === goal.key ? 0.9 : 0.7 }}>
                  {goal.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--app-text)"
          }}>
            Activity Level
          </label>
          <select
            value={formData.activityLevel}
            onChange={(e) => handleChange("activityLevel", e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid var(--app-border)",
              borderRadius: "8px",
              background: "var(--app-surface)",
              color: "var(--app-text)",
              fontSize: "16px"
            }}
          >
            <option value="sedentary">🪑 Sedentary (little or no exercise)</option>
            <option value="light">🚶 Light Activity (1-3 days/week)</option>
            <option value="moderate">🏃 Moderate Activity (3-5 days/week)</option>
            <option value="active">💪 Active (6-7 days/week)</option>
            <option value="veryActive">🔥 Very Active (intense daily exercise)</option>
          </select>
        </div>

        {/* Timeline */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--app-text)"
          }}>
            Timeline Preference
          </label>
          <div style={{ display: "grid", gap: "12px" }}>
            {[
              { key: "aggressive", label: "🚀 Aggressive", desc: "Faster results, more challenging" },
              { key: "moderate", label: "⚖️ Moderate", desc: "Balanced approach" },
              { key: "conservative", label: "🐢 Conservative", desc: "Gradual, sustainable changes" }
            ].map(timeline => (
              <button
                key={timeline.key}
                type="button"
                onClick={() => handleChange("timeline", timeline.key)}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: formData.timeline === timeline.key ? "var(--app-primary)" : "var(--app-surface)",
                  color: formData.timeline === timeline.key ? "white" : "var(--app-text)",
                  border: formData.timeline === timeline.key ? "var(--app-primary)" : "1px solid var(--app-border)",
                  borderRadius: "12px",
                  textAlign: "left",
                  cursor: "pointer"
                }}
              >
                <div style={{ fontSize: "16px", marginBottom: "4px" }}>{timeline.label}</div>
                <div style={{ fontSize: "14px", opacity: formData.timeline === timeline.key ? 0.9 : 0.7 }}>
                  {timeline.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginTop: "32px"
      }}>
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: "14px",
            background: "var(--app-surface)",
            color: "var(--app-text)",
            border: "1px solid var(--app-border)",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Back
        </button>
        
        <button
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: "linear-gradient(135deg, var(--app-primary), #1D4ED8)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}