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
// import i18n from "@dhis2/d2-i18n";
// import { useDataQuery } from "@dhis2/app-runtime";
// import { useConfig } from "@dhis2/app-runtime";

// hooks
// import useSystemInfo from "./hooks/useSystemInfo";

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
import "@esri/calcite-components/dist/components/calcite-input.js";
import "@esri/calcite-components/dist/components/calcite-label.js";
import "@esri/calcite-components/dist/components/calcite-switch.js";
import "@esri/calcite-components/dist/components/calcite-segmented-control.js";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item.js";
import "@esri/calcite-components/dist/components/calcite-alert.js";
import "@esri/calcite-components/dist/components/calcite-icon.js";
import "@esri/calcite-components/dist/components/calcite-stepper.js";
import "@esri/calcite-components/dist/components/calcite-stepper-item.js";
import "@esri/calcite-components/dist/components/calcite-notice.js";

import "@esri/calcite-components/dist/calcite/calcite.css";

// Components
import ShellContainer from "./components/ShellContainer";
import Header from "./components/Header";

// Pages
import LandingPage from "./pages/LandingPage";
import Connections from "./pages/Connections";
import NewConnection from "./pages/NewConnection";
import Configure from "./pages/Configure";

// Set Calcite assets path
import { setAssetPath } from "@esri/calcite-components/dist/components";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CalciteShell } from "@esri/calcite-components-react";
import { AlertProvider } from "./hooks/useAppAlert";
import {
  SystemSettingsProvider,
  useSystemSettings,
} from "./contexts/SystemSettingsContext";

// import the locales initialization to recognize the user's locale
import "./locales/index.js";

setAssetPath("https://unpkg.com/@esri/calcite-components/dist/calcite/assets");
// Local assets -- Does not work when deploying!
// setAssetPath(window.location.href);

// const query = {
//   me: {
//     resource: "me",
//   },
// };

// console.log(clientId, portalUrl);
// Create a separate component for the app content
const AppContent = () => {
  const { settings, isLoadingSettings } = useSystemSettings();
  const {
    userCredential,
    isLoadingAuth,
    oAuthConfig,
    setOAuthConfig,
    checkSignInStatus,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    // console.log("isLoadingSettings", isLoadingSettings);
    // console.log("isLoadingAuth", isLoadingAuth);

    if (!isLoadingSettings) {
      if (settings && settings.arcgisConfig) {
        const oauthConfig = {
          appId: settings.arcgisConfig.clientId,
          popup: false,
          portalUrl: settings.arcgisConfig.portalUrl,
        };
        setOAuthConfig(oauthConfig);
      } else {
        navigate("/configure", { replace: true });
      }

      if (!isLoadingAuth && userCredential) {
        navigate("/connections", { replace: true });
      }
    }
  }, [isLoadingSettings, isLoadingAuth, userCredential]);

  if (isLoadingSettings) {
    return null;
  }

  return (
    <AlertProvider>
      <CalciteShell
        style={{
          position: "relative",
          backgroundColor: "white !important",
          background: "white !important",
          "--calcite-ui-background": "white !important",
          "--calcite-ui-foreground-1": "white !important",
          "--calcite-ui-foreground-2": "white !important",
          "--calcite-ui-foreground-3": "white !important",
        }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/connections"
            element={
              userCredential ? <Connections /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/add-connection"
            element={
              userCredential ? <NewConnection /> : <Navigate to="/" replace />
            }
          />
          <Route path="/configure" element={<Configure />} />
        </Routes>
      </CalciteShell>
    </AlertProvider>
  );
};

// Main App component
const MyApp = () => {
  return (
    <HashRouter>
      <SystemSettingsProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SystemSettingsProvider>
    </HashRouter>
  );
};

export default MyApp;
