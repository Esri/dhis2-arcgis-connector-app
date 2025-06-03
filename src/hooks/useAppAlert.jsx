/*Copyright 2025 Esri
Licensed under the Apache License Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

import { CalciteAlert } from "@esri/calcite-components-react";
import { createContext, useContext, useState, useCallback } from "react";

const AlertContext = createContext(null);

export const ALERT_TYPES = {
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
  INFO: "info",
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const showAlert = useCallback(
    ({
      message,
      type = ALERT_TYPES.INFO,
      title = null,
      autoClose = true,
      duration = "fast",
    }) => {
      setAlert({ message, type, title, autoClose, duration });
      setIsOpen(true);
    },
    []
  );

  const hideAlert = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alert }}>
      {children}

      {alert && (
        <CalciteAlert
          open={isOpen}
          autoClose={alert.autoClose}
          autoCloseDuration="fast"
          kind={alert.type}
          icon={
            alert.type === ALERT_TYPES.SUCCESS
              ? "check-circle"
              : alert.type === ALERT_TYPES.WARNING
              ? "exclamation-mark-triangle"
              : alert.type === ALERT_TYPES.DANGER
              ? "exclamation-mark-triangle-f"
              : "information"
          }
          onCalciteAlertClose={hideAlert}
        >
          {alert.title && <div slot="title">{alert.title}</div>}
          <div slot="message">{alert.message}</div>
        </CalciteAlert>
      )}
    </AlertContext.Provider>
  );
};

export const useAppAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAppAlert must be used within an AlertProvider");
  }
  return context;
};
