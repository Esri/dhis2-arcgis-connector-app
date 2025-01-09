/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";

import { useDataEngine } from "@dhis2/app-runtime";
const APP_NAMESPACE = "dhis2-arcgis-app-ns";
const SETTINGS_KEY = "settings";

const resource = `dataStore/${APP_NAMESPACE}/${SETTINGS_KEY}`;

const SystemSettingsContext = createContext();

export function SystemSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [error, setError] = useState(null);

  const engine = useDataEngine();

  const getSettings = async () => {
    return await engine.query({ settings: { resource } });
  };

  const createNamespaceKeys = async () => {
    return await engine.mutate({
      resource,
      type: "create",
      data: {},
    });
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { dataStore } = await engine.query({
          dataStore: { resource: "dataStore" },
        });

        if (!dataStore.includes(APP_NAMESPACE)) {
          const createResponse = await createNamespaceKeys(engine);
          if (createResponse.httpStatusCode !== 201) {
            throw new Error("Failed to create namespace keys");
          }
        }

        const initialSettings = await getSettings(engine);
        setSettings(initialSettings.settings);
      } catch (err) {
        setError(err);
        console.log("error", err);
      }
      setIsLoadingSettings(false);
    };
    loadSettings();
  }, []);

  const commmitSettingsUpdate = async (setting, oldSettings, newValues) => {
    return await engine.mutate({
      resource,
      type: "update",
      data: {
        ...oldSettings,
        [setting]: newValues,
      },
    });
  };

  const updateSetting = async (setting, oldSettings, newValues) => {
    try {
      await commmitSettingsUpdate(setting, oldSettings, newValues);
      setSettings((prev) => ({ ...prev, [setting]: newValues }));
    } catch (err) {
      setError(err);
      console.log("error", err);
    }
  };

  const value = {
    settings,
    isLoadingSettings,
    error,
    updateSetting,
  };

  return (
    <SystemSettingsContext.Provider value={value}>
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  return useContext(SystemSettingsContext);
}
