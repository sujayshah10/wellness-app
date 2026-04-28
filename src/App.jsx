import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
import Nutrition from "./pages/Nutrition";

function App() {
  return (
    <div style={{ paddingBottom: "70px" }}>
      <Routes>
        <Route path="/" element={<Home />} />
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
    background: "#111",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "80px",
    color: "white",
    fontSize: "15px",
    zIndex: 1000
  }}
>
  <Link to="/workout" style={{ color: "white", textDecoration: "none" }}>
    🏋 Workout
  </Link>

  <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
    🏠 Home
  </Link>

  <Link to="/nutrition" style={{ color: "white", textDecoration: "none" }}>
    🥗 Nutrition
  </Link>
</nav>
    </div>
  );
}

export default App;