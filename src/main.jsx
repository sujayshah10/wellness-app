import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AppDataProvider } from "./context/AppDataContext.jsx";
import { DayProvider } from "./context/DayContext.jsx";
import { MealProvider } from "./context/MealContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AppDataProvider>
        <DayProvider>
          <MealProvider>
            <App />
          </MealProvider>
        </DayProvider>
      </AppDataProvider>
    </HashRouter>
  </React.StrictMode>
);
