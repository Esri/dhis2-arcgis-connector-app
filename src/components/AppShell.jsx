import React, { useEffect, useState } from "react";
import { useSystemSettings } from "../contexts/SystemSettingsContext";
import { CalciteShell } from "@esri/calcite-components-react";
import Header from "./Header";
import LandingPage from "../pages/LandingPage";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import NewConnection from "../pages/NewConnection";
import Configure from "../pages/Configure";
import { useAuth } from "../contexts/AuthContext";
import Connections from "../pages/Connections";
import CreatingLayerDialog from "./CreatingLayerDialog";

const AppShell = () => {
  const { settings, isLoadingSettings } = useSystemSettings();
  const {
    userCredential,
    isLoadingAuth,
    oAuthConfig,
    setOAuthConfig,
    checkSignInStatus,
  } = useAuth();

  const navigate = useNavigate();

  const [isCurrentlyCreatingLayer, setIsCurrentlyCreatingLayer] =
    useState(false);

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

  return (
    <CalciteShell
      style={{
        position: "relative",
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
            userCredential ? (
              <NewConnection
                isCurrentlyCreatingLayer={isCurrentlyCreatingLayer}
                setIsCurrentlyCreatingLayer={setIsCurrentlyCreatingLayer}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/configure" element={<Configure />} />
      </Routes>
      <div slot="modals">
        <CreatingLayerDialog
          isCurrentlyCreatingLayer={isCurrentlyCreatingLayer}
          setIsCurrentlyCreatingLayer={setIsCurrentlyCreatingLayer}
        />
      </div>
    </CalciteShell>
  );
};

export default AppShell;
