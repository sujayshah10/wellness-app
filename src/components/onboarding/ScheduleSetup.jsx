import { useState } from "react";

export default function ScheduleSetup({ data, onNext, onBack, t }) {
  const [formData, setFormData] = useState(data || {
    mealTimes: ["4:30 PM", "6:30 PM", "4:00 AM"],
    workoutTime: "6:00 PM"
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMealTimeChange = (index, value) => {
    setFormData(prev => {
      const newMealTimes = [...prev.mealTimes];
      newMealTimes[index] = value;
      return { ...prev, mealTimes: newMealTimes };
    });
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
        Set Your Schedule
      </h2>
      
      <p style={{
        fontSize: "14px",
        color: "var(--app-muted)",
        marginBottom: "24px"
      }}>
        Customize when you eat and exercise
      </p>

      <div style={{ display: "grid", gap: "24px" }}>
        {/* Meal Times */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "12px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--app-text)"
          }}>
            🍽️ Meal Times
          </label>
          <div style={{ display: "grid", gap: "12px" }}>
            {formData.mealTimes.map((time, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  minWidth: "80px",
                  fontSize: "14px",
                  color: "var(--app-muted)"
                }}>
                  Meal {index + 1}
                </span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => handleMealTimeChange(index, e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "1px solid var(--app-border)",
                    borderRadius: "8px",
                    background: "var(--app-surface)",
                    color: "var(--app-text)",
                    fontSize: "16px"
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Workout Time */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--app-text)"
          }}>
            💪 Preferred Workout Time
          </label>
          <input
            type="time"
            value={formData.workoutTime}
            onChange={(e) => handleChange("workoutTime", e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid var(--app-border)",
              borderRadius: "8px",
              background: "var(--app-surface)",
              color: "var(--app-text)",
              fontSize: "16px"
            }}
          />
        </div>

        {/* Quick Schedule Options */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "12px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--app-text)"
          }}>
            Quick Schedule Templates
          </label>
          <div style={{ display: "grid", gap: "8px" }}>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ 
                ...prev, 
                mealTimes: ["7:00 AM", "12:30 PM", "7:00 PM"],
                workoutTime: "6:00 PM"
              }))}
              style={{
                padding: "12px",
                background: "var(--app-surface)",
                color: "var(--app-text)",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              ☀️ Early Bird (Breakfast, Lunch, Dinner)
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ 
                ...prev, 
                mealTimes: ["10:00 AM", "2:00 PM", "8:00 PM"],
                workoutTime: "7:00 PM"
              }))}
              style={{
                padding: "12px",
                background: "var(--app-surface)",
                color: "var(--app-text)",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              🌙 Night Owl (Brunch, Lunch, Dinner)
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ 
                ...prev, 
                mealTimes: ["4:30 PM", "6:30 PM", "4:00 AM"],
                workoutTime: "6:00 PM"
              }))}
              style={{
                padding: "12px",
                background: "var(--app-surface)",
                color: "var(--app-text)",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              🔄 Intermittent Fasting (2 main meals + 1 late meal)
            </button>
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