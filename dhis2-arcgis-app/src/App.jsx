import { useDataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import React from "react";
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import classes from "./App.module.css";
import { setAssetPath } from "@esri/calcite-components/dist/components";

// Calcite components
import "@esri/calcite-components/dist/components/calcite-button.js";
import "@esri/calcite-components/dist/components/calcite-icon.js";
import "@esri/calcite-components/dist/components/calcite-slider.js";
import "@esri/calcite-components/dist/components/calcite-shell.js";
import "@esri/calcite-components/dist/components/calcite-shell-panel.js";
import "@esri/calcite-components/dist/components/calcite-panel.js";

import "@esri/calcite-components/dist/calcite/calcite.css";
import {
  CalciteButton,
  CalciteIcon,
  CalcitePanel,
  CalciteShell,
  CalciteSlider,
} from "@esri/calcite-components-react";
import LandingPage from "./LandingPage";

// Local assets
// setAssetPath(window.location.href);

setAssetPath("https://unpkg.com/@esri/calcite-components/dist/calcite/assets");

const query = {
  me: {
    resource: "me",
  },
};

// Create a separate component for the app content
const AppContent = () => {
  const { error, loading, data } = useDataQuery(query);
  const navigate = useNavigate();

  if (error) {
    return <span>{i18n.t("ERROR")}</span>;
  }

  if (loading) {
    return <span>{i18n.t("Loading...")}</span>;
  }

  return (
    <CalciteShell>
      <div slot="header" style={{ height: "75px", border: "1px solid red" }}>
        app Header goes here
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div
              style={{
                height: "100vh",
                border: "3px solid green",
                padding: "1.5rem",
              }}
            >
              Landing Page goes here!
              <CalciteButton
                onClick={() => navigate("/connections")}
                style={{ marginRight: "1rem" }}
              >
                Go to Connections
              </CalciteButton>
              <CalciteButton
                onClick={() => navigate("/add-connection")}
                style={{ marginRight: "1rem" }}
              >
                Go to Add Connection
              </CalciteButton>
            </div>
          }
        />
        <Route
          path="/connections"
          element={
            <div style={{ padding: "1.5rem" }}>
              hello connections route
              <CalciteButton onClick={() => navigate("/")}>
                Back to Landing
              </CalciteButton>
            </div>
          }
        />
        <Route
          path="/add-connection"
          element={
            <div style={{ padding: "1.5rem" }}>
              hello add connection route
              <CalciteButton onClick={() => navigate("/")}>
                Back to Landing
              </CalciteButton>
            </div>
          }
        />
      </Routes>
    </CalciteShell>
  );
};

// Main App component
const MyApp = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default MyApp;
