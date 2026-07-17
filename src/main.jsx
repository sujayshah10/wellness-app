import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import { AppDataProvider } from "./context/AppDataContext.jsx";
import { DayProvider } from "./context/DayContext.jsx";
import { MealProvider } from "./context/MealContext.jsx";

const rootElement = document.getElementById("root");

function showStartupError(error) {
  const message = error?.message || "The app could not start.";
  if (!rootElement) return;

  rootElement.innerHTML = `
    <div style="min-height:100vh;display:grid;place-items:center;padding:24px;font-family:Inter,system-ui,sans-serif;background:#030712;color:white;">
      <div style="max-width:360px;border:1px solid #223049;border-radius:16px;padding:18px;background:#0B1020;">
        <h1 style="font-size:22px;margin:0 0 10px;">Wellness could not load</h1>
        <p style="color:#A7B4C8;line-height:1.5;">Please refresh once. If this keeps happening, clear the site data for this app and reopen it.</p>
        <pre style="white-space:pre-wrap;color:#93C5FD;font-size:12px;">${message}</pre>
      </div>
    </div>
  `;
}

window.addEventListener("error", (event) => showStartupError(event.error || event.message));
window.addEventListener("unhandledrejection", (event) => showStartupError(event.reason));

try {
  ReactDOM.createRoot(rootElement).render(
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
} catch (error) {
  showStartupError(error);
}
