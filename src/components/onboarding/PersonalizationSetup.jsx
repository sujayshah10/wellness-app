import { useState } from "react";

export default function PersonalizationSetup({ data, onNext, onBack, t }) {
  const [formData, setFormData] = useState(data || {
    foodAvoidanceTags: [],
    workoutLimitationTags: [],
    otherFoodAvoidances: "",
    otherWorkoutLimitations: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const FOOD_OPTIONS = [
    "Dairy", "Gluten", "Peanuts", "Tree Nuts", "Soy", "Eggs", 
    "High Sugar", "Fried Food", "Spicy Food", "Late Caffeine"
  ];

  const WORKOUT_OPTIONS = [
    "Back Issue", "Cervical Issue", "Knee Pain", "Shoulder Pain", 
    "Wrist Pain", "High Impact", "Heavy Lifting", "Overhead Press", 
    "Deep Squats", "Jumping"
  ];

  const toggleFoodAvoidance = (item) => {
    setFormData(prev => ({
      ...prev,
      foodAvoidanceTags: prev.foodAvoidanceTags.includes(item)
        ? prev.foodAvoidanceTags.filter(i => i !== item)
        : [...prev.foodAvoidanceTags, item]
    }));
  };

  const toggleWorkoutLimitation = (item) => {
    setFormData(prev => ({
      ...prev,
      workoutLimitationTags: prev.workoutLimitationTags.includes(item)
        ? prev.workoutLimitationTags.filter(i => i !== item)
        : [...prev.workoutLimitationTags, item]
    }));
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
        Personalize Your Plan
      </h2>
      
      <p style={{
        fontSize: "14px",
        color: "var(--app-muted)",
        marginBottom: "24px"
      }}>
        Optional: Tell us about any restrictions or limitations
      </p>

      <div style={{ display: "grid", gap: "24px" }}>
        {/* Food Avoidances */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "12px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--app-text)"
          }}>
            🍽️ Food Avoidances (optional)
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
            {FOOD_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => toggleFoodAvoidance(option)}
                style={{
                  padding: "10px",
                  background: formData.foodAvoidanceTags.includes(option) 
                    ? "var(--app-primary)" 
                    : "var(--app-surface)",
                  color: formData.foodAvoidanceTags.includes(option) 
                    ? "white" 
                    : "var(--app-text)",
                  border: formData.foodAvoidanceTags.includes(option) 
                    ? "var(--app-primary)" 
                    : "1px solid var(--app-border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                {formData.foodAvoidanceTags.includes(option) ? "✓ " : ""}{option}
              </button>
            ))}
          </div>
        </div>

        {/* Workout Limitations */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "12px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--app-text)"
          }}>
            💪 Workout Limitations (optional)
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
            {WORKOUT_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => toggleWorkoutLimitation(option)}
                style={{
                  padding: "10px",
                  background: formData.workoutLimitationTags.includes(option) 
                    ? "var(--app-primary)" 
                    : "var(--app-surface)",
                  color: formData.workoutLimitationTags.includes(option) 
                    ? "white" 
                    : "var(--app-text)",
                  border: formData.workoutLimitationTags.includes(option) 
                    ? "var(--app-primary)" 
                    : "1px solid var(--app-border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                {formData.workoutLimitationTags.includes(option) ? "✓ " : ""}{option}
              </button>
            ))}
          </div>
        </div>

        {/* Other Notes */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--app-text)"
          }}>
            Other Notes (optional)
          </label>
          <textarea
            value={formData.otherFoodAvoidances}
            onChange={(e) => handleChange("otherFoodAvoidances", e.target.value)}
            placeholder="Any other food allergies or preferences..."
            rows={2}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid var(--app-border)",
              borderRadius: "8px",
              background: "var(--app-surface)",
              color: "var(--app-text)",
              fontSize: "14px",
              resize: "none",
              marginBottom: "12px"
            }}
          />
          <textarea
            value={formData.otherWorkoutLimitations}
            onChange={(e) => handleChange("otherWorkoutLimitations", e.target.value)}
            placeholder="Any other workout limitations or injuries..."
            rows={2}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid var(--app-border)",
              borderRadius: "8px",
              background: "var(--app-surface)",
              color: "var(--app-text)",
              fontSize: "14px",
              resize: "none"
            }}
          />
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