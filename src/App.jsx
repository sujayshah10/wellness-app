import { Routes, Route, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Workout from "./pages/Workout";
import Nutrition from "./pages/Nutrition";
import { useAppData } from "./context/useAppData";
import { useTranslation } from "./utils/useTranslation";

function NavIcon({ name, active }) {
  const paths = {
    home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1z",
    workout: "M5 13.5 8 10l3 3 5-6 3 3",
    nutrition: "M8 4h8l1 4-1 4H8L7 8zM7 12h10v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ stroke: active ? "white" : "currentColor", fill: "none", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" }}>
      <path d={paths[name]} />
    </svg>
  );
}

function App() {
  const { t } = useTranslation();
  const { appData } = useAppData();
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(() => navigator.onLine !== false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateStatus = () => setOnline(window.navigator.onLine !== false);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  return (
    <div className="app-shell">
      {loading && (
        <div className="splash-screen">
          <div className="splash-mark">W</div>
          <div className="splash-title">Wellness</div>
          <div className="splash-subtitle">{t("loadingYourPlan")}</div>
          <div className="loading-bar"><span /></div>
        </div>
      )}

      {!online && <div className="offline-pill">{t("offlineReady")}</div>}

      <div style={{ paddingBottom: "82px" }}>
        <div style={{ padding: "18px 18px 0" }}>
          <div className="app-version-pill">v{appData.about.version}</div>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/nutrition" element={<Nutrition />} />
        </Routes>
      </div>

      <nav className="bottom-nav">
        <NavLink to="/workout" className={({ isActive }) => `bottom-nav__item${isActive ? " active" : ""}`}>
          {({ isActive }) => (
            <>
              <NavIcon name="workout" active={isActive} />
              <span>{t("workout")}</span>
            </>
          )}
        </NavLink>

        <NavLink to="/" end className={({ isActive }) => `bottom-nav__item${isActive ? " active" : ""}`}>
          {({ isActive }) => (
            <>
              <NavIcon name="home" active={isActive} />
              <span>{t("home")}</span>
            </>
          )}
        </NavLink>

        <NavLink to="/nutrition" className={({ isActive }) => `bottom-nav__item${isActive ? " active" : ""}`}>
          {({ isActive }) => (
            <>
              <NavIcon name="nutrition" active={isActive} />
              <span>{t("nutrition")}</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
}

export default App;
