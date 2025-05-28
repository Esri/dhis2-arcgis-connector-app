// React

// React Router
import { HashRouter } from "react-router-dom";

// DHIS2
// import i18n from "@dhis2/d2-i18n";
// import { useDataQuery } from "@dhis2/app-runtime";
// import { useConfig } from "@dhis2/app-runtime";

// hooks
// import useSystemInfo from "./hooks/useSystemInfo";

// Calcite components
import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-checkbox";
import "@esri/calcite-components/dist/components/calcite-button";
import "@esri/calcite-components/dist/components/calcite-icon";
import "@esri/calcite-components/dist/components/calcite-slider";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-navigation";
import "@esri/calcite-components/dist/components/calcite-navigation-logo";
import "@esri/calcite-components/dist/components/calcite-menu";
import "@esri/calcite-components/dist/components/calcite-menu-item";
import "@esri/calcite-components/dist/components/calcite-navigation-user";
import "@esri/calcite-components/dist/components/calcite-popover";
import "@esri/calcite-components/dist/components/calcite-link";
import "@esri/calcite-components/dist/components/calcite-input";
import "@esri/calcite-components/dist/components/calcite-input-text";
import "@esri/calcite-components/dist/components/calcite-text-area";
import "@esri/calcite-components/dist/components/calcite-label";
import "@esri/calcite-components/dist/components/calcite-switch";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";
import "@esri/calcite-components/dist/components/calcite-alert";
import "@esri/calcite-components/dist/components/calcite-icon";
import "@esri/calcite-components/dist/components/calcite-stepper";
import "@esri/calcite-components/dist/components/calcite-stepper-item";
import "@esri/calcite-components/dist/components/calcite-notice";
import "@esri/calcite-components/dist/components/calcite-table";
import "@esri/calcite-components/dist/components/calcite-table-header";
import "@esri/calcite-components/dist/components/calcite-table-row";
import "@esri/calcite-components/dist/components/calcite-table-cell";
import "@esri/calcite-components/dist/components/calcite-dialog";
import "@esri/calcite-components/dist/components/calcite-icon";
import "@esri/calcite-components/dist/components/calcite-sheet";
import "@esri/calcite-components/dist/components/calcite-pagination";
import "@esri/calcite-components/dist/calcite/calcite.css";

// Set Calcite assets path
import { setAssetPath } from "@esri/calcite-components/dist/components";

import { AuthProvider } from "./contexts/AuthContext";
import { SystemSettingsProvider } from "./contexts/SystemSettingsContext";
import { AlertProvider } from "./hooks/useAppAlert.jsx";

// import the locales initialization to recognize the user's locale
import "./locales/index.js";

import AppShell from "./components/AppShell.jsx";

setAssetPath("https://unpkg.com/@esri/calcite-components/dist/calcite/assets");

// Local assets -- Does not work when deploying!
// setAssetPath(window.location.href);

const App = () => {
  return (
    <HashRouter>
      <SystemSettingsProvider>
        <AuthProvider>
          <AlertProvider>
            <AppShell />
          </AlertProvider>
        </AuthProvider>
      </SystemSettingsProvider>
    </HashRouter>
  );
};

export default App;
