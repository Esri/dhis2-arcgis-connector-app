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

import React, { useEffect, useState } from "react";
import { useSystemSettings } from "../contexts/SystemSettingsContext";
import {
  CalciteShell,
  CalciteDialog,
  CalciteButton,
  CalciteSheet,
  CalcitePanel,
} from "@esri/calcite-components-react";
import Header from "./Header";
import LandingPage from "../pages/LandingPage";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import NewConnection from "../pages/NewConnection";
import Configure from "../pages/Configure";
import { useAuth } from "../contexts/AuthContext";
import Connections from "../pages/Connections";
import CreatingLayerDialog from "./CreatingLayerDialog";

import ReactJsonView from "@microlink/react-json-view";
import i18n from "../locales";

import styled from "styled-components";

const StyledCalciteButtonCopyToClipboard = styled(CalciteButton)`
  --calcite-icon-color: ${(props) =>
    props.redirectUrlIcon === "check" ? "green" : "brand"};
`;

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

  const [debugInfo, setDebugInfo] = useState({});
  const [isShowingDebugInfo, setIsShowingDebugInfo] = useState(false);

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

  const updateDebugInfo = (debugInfo) => {
    setDebugInfo(debugInfo);
  };

  const [redirectUrlIcon, setRedirectUrlIcon] = useState("copy-to-clipboard");

  return (
    <CalciteShell
      style={{
        position: "relative",
      }}
    >
      <Header
        isShowingDebugInfo={isShowingDebugInfo}
        setIsShowingDebugInfo={setIsShowingDebugInfo}
      />
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
                // isShowingDebugInfo={isShowingDebugInfo}
                updateDebugInfo={updateDebugInfo}
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
        {/* <CalciteDialog
          id="debug-dialog"
          open={isShowingDebugInfo}
          onCalciteDialogClose={() => {
            setIsShowingDebugInfo(false);
          }}
          heading="Debug Information"
          // width="m"
          // scale="m"
          // placement="cover"
          dragEnabled
          resizable
        >
          <p>
            API Testing Url:{" "}
            <a
              href={`https://dhis2.esrigcazure.com/dhis/api/40/analytics?${debugInfo.finalStringParams}`}
              target="_blank"
            >
              {`https://dhis2.esrigcazure.com/dhis/api/40/analytics?${debugInfo.finalStringParams}`}
            </a>
          </p>
          <ReactJsonView
            displayDataTypes={false}
            displayObjectSize={false}
            name="debugInfo"
            src={debugInfo}
          /> 
      </CalciteDialog> */}
        <div slot="sheets">
          <CalciteSheet
            onCalciteSheetClose={() => setIsShowingDebugInfo(false)}
            {...(isShowingDebugInfo
              ? {
                  open: true,
                }
              : {})}
            resizable
            label={i18n.t("Debug Information")}
            position="inline-end"
            style={{
              // calculate the width based on the viewport
              "--calcite-sheet-min-width": "calc(75vw - 1rem)",
            }}
          >
            <CalcitePanel
              heading={i18n.t("Debug Information")}
              onCalcitePanelClose={() => setIsShowingDebugInfo(false)}
              // closable
              // closed={!isShowingDebugInfo}
              {...(!isShowingDebugInfo
                ? {
                    open: false,
                  }
                : {})}
              style={{
                height: "100%",
                width: "100%",
                // overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1rem",
                  // border: "1px solid red",
                  // overflowY: "scroll",
                }}
              >
                {debugInfo.finalStringParams && (
                  <>
                    API Testing Url:{" "}
                    <a
                      href={`https://dhis2.esrigcazure.com/dhis/api/40/analytics?${debugInfo.finalStringParams}`}
                      target="_blank"
                    >
                      {`https://dhis2.esrigcazure.com/dhis/api/40/analytics?${debugInfo.finalStringParams}`}
                    </a>
                    <br />
                    <br />
                  </>
                )}
                <StyledCalciteButtonCopyToClipboard
                  slot="action"
                  style={{ marginBottom: "1rem", width: "275px" }}
                  iconStart={redirectUrlIcon}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(debugInfo, null, 2)
                    );
                    setRedirectUrlIcon("check");
                    setTimeout(() => {
                      setRedirectUrlIcon("copy-to-clipboard");
                    }, 2000);
                  }}
                  appearance={redirectUrlIcon === "check" ? "outline" : "solid"}
                >
                  {redirectUrlIcon === "check"
                    ? i18n.t("Copied")
                    : i18n.t("Copy Debug Info to Clipboard")}
                </StyledCalciteButtonCopyToClipboard>
                <ReactJsonView
                  displayDataTypes={false}
                  displayObjectSize={false}
                  name="debugInfo"
                  src={debugInfo}
                />
              </div>
            </CalcitePanel>
          </CalciteSheet>
        </div>
      </div>
    </CalciteShell>
  );
};

export default AppShell;
