import { Routes, Route, NavLink } from "react-router-dom";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Workout from "./pages/Workout";
import Nutrition from "./pages/Nutrition";
import { useTranslation } from "./utils/useTranslation";

function App() {
  const { t } = useTranslation();

  return (
    <div style={{ paddingBottom: "70px" }}>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/nutrition" element={<Nutrition />} />
      </Routes>

      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "60px",
          background: "var(--app-nav)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "80px",
          color: "white",
          fontSize: "15px",
          zIndex: 1000
        }}
      >

        <NavLink
          to="/workout"
          style={({ isActive }) => ({
            color: isActive ? "var(--app-primary)" : "white",
            textDecoration: "none",
            fontWeight: isActive ? "650" : "500"
          })}
        >
          {t("workout")}
        </NavLink>

        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            color: isActive ? "var(--app-primary)" : "white",
            textDecoration: "none",
            fontWeight: isActive ? "650" : "500"
          })}
        >
          {t("home")}
        </NavLink>

        <NavLink
          to="/nutrition"
          style={({ isActive }) => ({
            color: isActive ? "var(--app-primary)" : "white",
            textDecoration: "none",
            fontWeight: isActive ? "650" : "500"
          })}
        >
          {t("nutrition")}
        </NavLink>

      </nav>

    </div>
  );
}

export default App;
