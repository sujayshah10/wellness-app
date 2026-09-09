export default function WelcomeScreen({ onNext, t }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "20px 0"
    }}>
      <div style={{
        fontSize: "64px",
        marginBottom: "20px"
      }}>
        🎯
      </div>
      
      <h1 style={{
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "16px",
        color: "var(--app-text)"
      }}>
        Welcome to Your Wellness Journey
      </h1>
      
      <p style={{
        fontSize: "16px",
        lineHeight: "1.6",
        color: "var(--app-muted)",
        marginBottom: "32px",
        maxWidth: "400px",
        margin: "0 auto 32px"
      }}>
        We'll create a personalized plan with meals, workouts, and targets tailored specifically for you in just 5 minutes.
      </p>

      <div style={{
        display: "grid",
        gap: "16px",
        marginBottom: "32px",
        textAlign: "left"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px",
          background: "var(--app-surface)",
          borderRadius: "12px",
          border: "1px solid var(--app-border)"
        }}>
          <div style={{
            fontSize: "24px",
            minWidth: "40px",
            textAlign: "center"
          }}>
            🍽️
          </div>
          <div>
            <strong style={{ display: "block", marginBottom: "4px" }}>Personalized Meals</strong>
            <span style={{ fontSize: "14px", color: "var(--app-muted)" }}>
              Custom meal plans based on your goals
            </span>
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px",
          background: "var(--app-surface)",
          borderRadius: "12px",
          border: "1px solid var(--app-border)"
        }}>
          <div style={{
            fontSize: "24px",
            minWidth: "40px",
            textAlign: "center"
          }}>
            💪
          </div>
          <div>
            <strong style={{ display: "block", marginBottom: "4px" }}>Tailored Workouts</strong>
            <span style={{ fontSize: "14px", color: "var(--app-muted)" }}>
              Exercise plans adapted to your needs
            </span>
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px",
          background: "var(--app-surface)",
          borderRadius: "12px",
          border: "1px solid var(--app-border)"
        }}>
          <div style={{
            fontSize: "24px",
            minWidth: "40px",
            textAlign: "center"
          }}>
            📊
          </div>
          <div>
            <strong style={{ display: "block", marginBottom: "4px" }}>Smart Targets</strong>
            <span style={{ fontSize: "14px", color: "var(--app-muted)" }}>
              Calorie & protein goals calculated for you
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onNext({})}
        style={{
          width: "100%",
          padding: "16px",
          background: "linear-gradient(135deg, var(--app-primary), #1D4ED8)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "18px",
          fontWeight: "600",
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
        Let's Get Started →
      </button>

      <button
        onClick={() => onNext({ skipOnboarding: true })}
        style={{
          width: "100%",
          padding: "12px",
          background: "transparent",
          color: "var(--app-muted)",
          border: "none",
          borderRadius: "12px",
          fontSize: "14px",
          cursor: "pointer",
          marginTop: "12px"
        }}
      >
        Skip for now
      </button>
    </div>
  );
}