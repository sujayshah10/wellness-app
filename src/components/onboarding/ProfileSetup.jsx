import { useState } from "react";

export default function ProfileSetup({ data, onNext, onBack, isFirstStep, t }) {
  const [formData, setFormData] = useState(data || {
    name: "",
    birthDate: "",
    gender: "male",
    heightCm: 175,
    heightUnit: "cm",
    weightKg: 80,
    weightUnit: "kg"
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
        Tell Us About Yourself
      </h2>
      
      <p style={{
        fontSize: "14px",
        color: "var(--app-muted)",
        marginBottom: "24px"
      }}>
        This helps us calculate your personalized targets
      </p>

      <div style={{ display: "grid", gap: "20px" }}>
        {/* Name */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--app-text)"
          }}>
            Your Name (optional)
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter your name"
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

        {/* Birth Date */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--app-text)"
          }}>
            Birth Date
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
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

        {/* Gender */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--app-text)"
          }}>
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
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
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="nonBinary">Non-Binary</option>
            <option value="preferNotToSay">Prefer Not To Say</option>
          </select>
        </div>

        {/* Height & Weight */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--app-text)"
            }}>
              Height ({formData.heightUnit})
            </label>
            <input
              type="number"
              value={formData.heightCm || ''}
              onChange={(e) => handleChange("heightCm", e.target.value === '' ? 0 : Number(e.target.value))}
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

          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--app-text)"
            }}>
              Weight ({formData.weightUnit})
            </label>
            <input
              type="number"
              value={formData.weightKg || ''}
              onChange={(e) => handleChange("weightKg", e.target.value === '' ? 0 : Number(e.target.value))}
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
        </div>

        {/* Unit Toggle */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--app-text)"
          }}>
            Units
          </label>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={() => {
                handleChange("heightUnit", "cm");
                handleChange("weightUnit", "kg");
              }}
              style={{
                flex: 1,
                padding: "12px",
                background: formData.heightUnit === "cm" ? "var(--app-primary)" : "var(--app-surface)",
                color: formData.heightUnit === "cm" ? "white" : "var(--app-text)",
                border: formData.heightUnit === "cm" ? "var(--app-primary)" : "1px solid var(--app-border)",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Metric (cm, kg)
            </button>
            <button
              type="button"
              onClick={() => {
                handleChange("heightUnit", "ft");
                handleChange("weightUnit", "lbs");
              }}
              style={{
                flex: 1,
                padding: "12px",
                background: formData.heightUnit === "ft" ? "var(--app-primary)" : "var(--app-surface)",
                color: formData.heightUnit === "ft" ? "white" : "var(--app-text)",
                border: formData.heightUnit === "ft" ? "var(--app-primary)" : "1px solid var(--app-border)",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Imperial (ft, lbs)
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
        {!isFirstStep && (
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
        )}
        
        <button
          onClick={handleSubmit}
          style={{
            flex: isFirstStep ? 1 : 2,
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