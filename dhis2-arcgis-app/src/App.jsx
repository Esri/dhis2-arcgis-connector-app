// React
import React, { useEffect } from "react";

// React Router
import {
  HashRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

// DHIS2
import i18n from "@dhis2/d2-i18n";
import { useDataQuery } from "@dhis2/app-runtime";

// Calcite components
import "@esri/calcite-components/dist/components/calcite-action.js";
import "@esri/calcite-components/dist/components/calcite-button.js";
import "@esri/calcite-components/dist/components/calcite-icon.js";
import "@esri/calcite-components/dist/components/calcite-slider.js";
import "@esri/calcite-components/dist/components/calcite-shell.js";
import "@esri/calcite-components/dist/components/calcite-shell-panel.js";
import "@esri/calcite-components/dist/components/calcite-panel.js";
import "@esri/calcite-components/dist/components/calcite-navigation.js";
import "@esri/calcite-components/dist/components/calcite-navigation-logo.js";
import "@esri/calcite-components/dist/components/calcite-menu.js";
import "@esri/calcite-components/dist/components/calcite-menu-item.js";
import "@esri/calcite-components/dist/components/calcite-navigation-user.js";
import "@esri/calcite-components/dist/components/calcite-popover.js";
import "@esri/calcite-components/dist/components/calcite-link.js";
import "@esri/calcite-components/dist/calcite/calcite.css";

// Components
import ShellContainer from "./components/ShellContainer";
import Header from "./components/Header";

// Pages
import LandingPage from "./pages/LandingPage";
import ManageConnections from "./pages/ManageConnections";
import NewConnection from "./pages/NewConnection";

// Set Calcite assets path
import { setAssetPath } from "@esri/calcite-components/dist/components";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import SubHeader from "./components/SubHeader";
import Settings from "./pages/Settings";
setAssetPath("https://unpkg.com/@esri/calcite-components/dist/calcite/assets");
// Local assets -- Does not work when deploying!
// setAssetPath(window.location.href);

// const query = {
//   me: {
//     resource: "me",
//   },
// };

const clientId = process.env.DHIS2_ARCGIS_CLIENT_ID;
const portalUrl = process.env.DHIS2_ARCGIS_PORTAL_URL;

console.log(clientId, portalUrl);
// Create a separate component for the app content
const AppContent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/connections", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, loading]);

  if (loading) {
    return null;
  }

  return (
    <ShellContainer>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/connections"
          element={user ? <ManageConnections /> : <Navigate to="/" replace />}
        />
        <Route
          path="/add-connection"
          element={user ? <NewConnection /> : <Navigate to="/" replace />}
        />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </ShellContainer>
  );
};

// Main App component
const MyApp = () => {
  return (
    <HashRouter>
      <AuthProvider clientId={clientId} portalUrl={portalUrl}>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default MyApp;
