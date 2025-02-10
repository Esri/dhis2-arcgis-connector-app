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
import "@esri/calcite-components/dist/components/calcite-input-text.js";
import "@esri/calcite-components/dist/components/calcite-label.js";
import "@esri/calcite-components/dist/components/calcite-switch.js";
import "@esri/calcite-components/dist/components/calcite-segmented-control.js";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item.js";
import "@esri/calcite-components/dist/components/calcite-alert.js";
import "@esri/calcite-components/dist/components/calcite-icon.js";
import "@esri/calcite-components/dist/components/calcite-stepper.js";
import "@esri/calcite-components/dist/components/calcite-stepper-item.js";
import "@esri/calcite-components/dist/components/calcite-notice.js";
import "@esri/calcite-components/dist/components/calcite-table.js";
import "@esri/calcite-components/dist/components/calcite-table-header.js";
import "@esri/calcite-components/dist/components/calcite-table-row.js";
import "@esri/calcite-components/dist/components/calcite-table-cell.js";
import "@esri/calcite-components/dist/components/calcite-dialog.js";
import "@esri/calcite-components/dist/calcite/calcite.css";

// Set Calcite assets path
import { setAssetPath } from "@esri/calcite-components/dist/components";

import { AuthProvider } from "./contexts/AuthContext";
import { SystemSettingsProvider } from "./contexts/SystemSettingsContext";
import { AlertProvider } from "./hooks/useAppAlert.jsx";

// import the locales initialization to recognize the user's locale
import "./locales/index.js";

import AppShell from "./components/AppShell.jsx";

// setAssetPath("https://unpkg.com/@esri/calcite-components/dist/calcite/assets");
// Local assets -- Does not work when deploying!
setAssetPath(window.location.href);

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
