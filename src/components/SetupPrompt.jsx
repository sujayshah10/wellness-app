import { Link } from "react-router-dom";
import { useTranslation } from "../utils/useTranslation";

export default function SetupPrompt() {
  const { t } = useTranslation();

  return (
    <div style={{
      background: "linear-gradient(135deg, #2F80FF 0%, #1D4ED8 100%)",
      color: "white",
      padding: "20px",
      borderRadius: "16px",
      marginBottom: "20px",
      boxShadow: "0 4px 12px rgba(47, 128, 255, 0.3)"
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div style={{
          fontSize: "32px",
          lineHeight: 1,
          minWidth: "40px",
          textAlign: "center"
        }}>
          🚀
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "600" }}>
            Welcome to Your Wellness Journey!
          </h3>
          <p style={{ margin: "0 0 16px", fontSize: "14px", lineHeight: "1.5", opacity: 0.95 }}>
            Let's set up your personalized plan in just 2 minutes. We'll customize your meals, workouts, and targets based on your goals.
          </p>
          
          <Link
            to="/menu"
            style={{
              display: "inline-block",
              background: "white",
              color: "#2F80FF",
              padding: "10px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
            }}
          >
            Get Started →
          </Link>
        </div>
      </div>
    </div>
  );
}