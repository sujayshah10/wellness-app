import { Routes, Route, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Workout from "./pages/Workout";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";
import OnboardingWizard from "./components/OnboardingWizard";
import { useAppData } from "./context/useAppData";
import { useTranslation } from "./utils/useTranslation";

function NavIcon({ name, active }) {
  const paths = {
    home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1z",
    workout: "M5 13.5 8 10l3 3 5-6 3 3",
    nutrition: "M8 4h8l1 4-1 4H8L7 8zM7 12h10v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z",
    progress: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
  };

  const getIconColor = (active) => {
    if (active) return "white";
    // Use CSS variables for theme-aware colors
    const colors = {
      home: "var(--app-icon-home)",
      workout: "var(--app-icon-workout)",
      nutrition: "var(--app-icon-nutrition)",
      progress: "var(--app-icon-progress)"
    };
    return colors[name] || "currentColor";
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ stroke: getIconColor(active), fill: "none", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" }}>
      <path d={paths[name]} />
    </svg>
  );
}

function App() {
  const { t } = useTranslation();
  const { appData, isFirstTime, FONT_FAMILIES, FONT_SIZES } = useAppData();
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(() => navigator.onLine !== false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const theme = appData.settings.theme;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
  }, [appData.settings.theme]);

  useEffect(() => {
    const root = document.documentElement;
    const fontFamily = FONT_FAMILIES.find(f => f.key === appData.settings.fontFamily)?.value || FONT_FAMILIES[0].value;
    const fontSize = FONT_SIZES.find(s => s.key === appData.settings.fontSize)?.value || FONT_SIZES[1].value;
    
    root.style.setProperty('--app-font-body', fontFamily);
    root.style.setProperty('--app-font-size-base', fontSize);
  }, [appData.settings.fontFamily, appData.settings.fontSize, FONT_FAMILIES, FONT_SIZES]);

  useEffect(() => {
    if (!loading && isFirstTime && !appData.settings?.onboardingCompleted) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [loading, isFirstTime, appData.settings?.onboardingCompleted]);

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

      {showOnboarding ? (
        <OnboardingWizard />
      ) : (
        <div style={{ paddingBottom: "82px" }}>
          <div style={{ padding: "18px 18px 0" }}>
            <div className="app-version-pill">v{appData.about.version}</div>
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </div>
      )}

      {!showOnboarding && (
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

        <NavLink to="/progress" className={({ isActive }) => `bottom-nav__item${isActive ? " active" : ""}`}>
          {({ isActive }) => (
            <>
              <NavIcon name="progress" active={isActive} />
              <span>{t("progress")}</span>
            </>
          )}
        </NavLink>
      </nav>
      )}
    </div>
  );
}

export default App;
