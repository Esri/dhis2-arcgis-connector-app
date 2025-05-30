import React, { useState, useEffect } from "react";

import styled from "styled-components";

import i18n from "@dhis2/d2-i18n";

import {
  CalciteButton,
  CalciteCheckbox,
  CalciteInput,
  CalciteLabel,
} from "@esri/calcite-components-react";
import { useAppAlert, ALERT_TYPES } from "../hooks/useAppAlert";
import { useSystemSettings } from "../contexts/SystemSettingsContext";
import { useAuth } from "../contexts/AuthContext";

const StyledContainer = styled.div`
  padding: 1rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  //gap: 2rem;
  font-size: 1rem;

  a {
    color: #007ac2;
  }

  a:hover {
    color: #005293;
  }
`;

const StyledDescription = styled.div`
  // padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 700px;
`;

const StyledCalciteInputText = styled(CalciteInput)`
  --calcite-input-prefix-size: 110px;
  width: 600px;
`;

const StyledPageHeader = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

const StyledSeparator = styled.div`
  height: 1px;
  background-color: var(--calcite-ui-border-3);
  margin: 1rem 0;
`;

const StyledCalciteButtonCopyToClipboard = styled(CalciteButton)`
  --calcite-icon-color: ${(props) =>
    props.redirectUrlIcon === "check" ? "green" : "brand"};
`;

const Configure = () => {
  const { settings, updateSetting, isLoadingSettings } = useSystemSettings();
  const { showAlert } = useAppAlert();
  const { setOAuthConfig, setUserCredential, signOut } = useAuth();

  const [clientId, setClientId] = useState(settings?.arcgisConfig?.clientId);
  const [portalUrl, setPortalUrl] = useState(settings?.arcgisConfig?.portalUrl);
  const [portalType, setPortalType] = useState(
    settings?.arcgisConfig?.portalType
  );

  const [showDebugInfo, setShowDebugInfo] = useState(
    settings?.arcgisConfig?.showDebugInfo || false
  );

  const [redirectUrlIcon, setRedirectUrlIcon] = useState("copy-to-clipboard");

  const updateSettings = async () => {
    let newSettings = {
      portalType: portalType,
      clientId: clientId,
      portalUrl: portalUrl,
      showDebugInfo: showDebugInfo,
    };

    await updateSetting("arcgisConfig", settings, newSettings);

    setUserCredential(null);
    signOut();

    setOAuthConfig({
      appId: clientId,
      popup: false,
      portalUrl: portalUrl,
    });

    showAlert({
      title: i18n.t("Settings updated"),
      autoClose: false,
      message: i18n.t(
        "Your ArcGIS configuration has been updated. Please sign in again."
      ),
      type: ALERT_TYPES.SUCCESS,
    });
  };

  useEffect(() => {
    if (!isLoadingSettings && settings?.arcgisConfig) {
      setPortalType(settings.arcgisConfig.portalType);
      setClientId(settings.arcgisConfig.clientId);
      setPortalUrl(settings.arcgisConfig.portalUrl);
      setShowDebugInfo(settings.arcgisConfig.showDebugInfo || false);
    }
  }, [settings, isLoadingSettings]);

  if (isLoadingSettings) {
    return null;
  }

  return (
    <StyledContainer>
      <StyledPageHeader>{i18n.t("Configure")}</StyledPageHeader>
      <StyledDescription>
        {i18n.t(
          "To configure the connection between your ArcGIS Enterprise Organization and DHIS2 instance, you will need to create an application in your ArcGIS Enterprise Organization. The configuration will require the Client ID and Portal URL of the application."
        )}
      </StyledDescription>

      <StyledCalciteInputText
        prefixText={i18n.t("Redirect URL")}
        readOnly
        value={window.location.origin}
      >
        <StyledCalciteButtonCopyToClipboard
          slot="action"
          iconStart={redirectUrlIcon}
          onClick={() => {
            navigator.clipboard.writeText(window.location.origin);
            setRedirectUrlIcon("check");
            setTimeout(() => {
              setRedirectUrlIcon("copy-to-clipboard");
            }, 2000);
          }}
          appearance={redirectUrlIcon === "check" ? "outline" : "solid"}
        ></StyledCalciteButtonCopyToClipboard>
      </StyledCalciteInputText>

      <StyledInputContainer style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: 0 }}>{i18n.t("Show Debug Information")}</h2>

        <CalciteLabel layout="inline">
          <CalciteCheckbox
            iconStart="save"
            checked={showDebugInfo}
            onCalciteCheckboxChange={() => setShowDebugInfo(!showDebugInfo)}
          ></CalciteCheckbox>
          {i18n.t("Show Debug Information")}
        </CalciteLabel>
      </StyledInputContainer>

      <StyledInputContainer>
        <h2>{i18n.t("ArcGIS Configuration")}</h2>
        <StyledCalciteInputText
          prefixText={i18n.t("Client ID")}
          value={clientId}
          onCalciteInputChange={(event) => {
            setClientId(event.target.value);
          }}
        />

        <StyledCalciteInputText
          prefixText={i18n.t("Portal URL")}
          value={portalUrl}
          onCalciteInputInput={(event) => {
            setPortalUrl(event.target.value);
          }}
        />

        <div style={{ marginTop: "1rem" }}>
          <CalciteButton iconStart="save" onClick={() => updateSettings()}>
            {i18n.t("Save Configuration")}
          </CalciteButton>
        </div>
      </StyledInputContainer>
    </StyledContainer>
  );
};

export default Configure;
