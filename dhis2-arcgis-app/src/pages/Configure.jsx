import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { CalciteButton, CalciteInput } from "@esri/calcite-components-react";
import { useAppAlert, ALERT_TYPES } from "../hooks/useAppAlert";
import { useSystemSettings } from "../contexts/SystemSettingsContext";
import { useAuth } from "../contexts/AuthContext";

const StyledContainer = styled.div`
  padding: 1rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledDescription = styled.div`
  // padding: 1rem;
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
  console.log("configure");
  const { settings, updateSetting, isLoadingSettings } = useSystemSettings();
  const { showAlert } = useAppAlert();
  const { setOAuthConfig, setUserCredential, signOut } = useAuth();

  const [clientId, setClientId] = useState(settings?.arcgisConfig?.clientId);
  const [portalUrl, setPortalUrl] = useState(settings?.arcgisConfig?.portalUrl);
  const [koopUrl, setKoopUrl] = useState(settings?.arcgisConfig?.koopUrl);
  const [portalType, setPortalType] = useState(
    settings?.arcgisConfig?.portalType
  );

  const [redirectUrlIcon, setRedirectUrlIcon] = useState("copy-to-clipboard");

  const validateKoopUrl = async () => {
    const response = await fetch(koopUrl);
    return response.ok;
  };

  const updateSettings = async () => {
    if (portalType === "enterprise") {
      const isKoopUrlValid = await validateKoopUrl();

      if (!isKoopUrlValid) {
        showAlert({
          title: "Koop URL is invalid",
          message:
            "Your Koop URL is invalid. Please make sure it is accessible.",
          type: ALERT_TYPES.DANGER,
        });
        return;
      }
    }

    let newSettings = {
      portalType: portalType,
      clientId: clientId,
      portalUrl: portalUrl,
      koopUrl: koopUrl,
    };

    // if portal url contains *.maps.arcgis.com, set portalType to online
    if (portalUrl.includes(".maps.arcgis.com")) {
      newSettings.portalType = "online";
    } else {
      newSettings.portalType = "enterprise";
    }

    await updateSetting("arcgisConfig", settings, newSettings);

    setUserCredential(null);
    signOut();

    setOAuthConfig({
      appId: clientId,
      popup: false,
      portalUrl: portalUrl,
    });

    showAlert({
      title: "Settings updated",
      autoClose: false,
      message:
        "Your ArcGIS configuration has been updated. Please sign in again.",
      type: ALERT_TYPES.SUCCESS,
    });
  };

  useEffect(() => {
    if (!isLoadingSettings && settings?.arcgisConfig) {
      setPortalType(settings.arcgisConfig.portalType);
      setClientId(settings.arcgisConfig.clientId);
      setPortalUrl(settings.arcgisConfig.portalUrl);
      setKoopUrl(settings.arcgisConfig.koopUrl);
    }
  }, [settings, isLoadingSettings]);

  if (isLoadingSettings) {
    return null;
  }

  return (
    <StyledContainer>
      <StyledPageHeader>Configure</StyledPageHeader>
      <StyledDescription>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </StyledDescription>
      <StyledCalciteInputText
        prefixText="Redirect URL"
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

      <StyledInputContainer>
        <h2>ArcGIS Configuration</h2>
        {/* <CalciteSegmentedControl
          onCalciteSegmentedControlChange={(event) => {
            setPortalType(event.target.value);
          }}
        >
          <CalciteSegmentedControlItem
            {...{
              checked: portalType === "online" ? true : undefined,
            }}
            value="online"
          >
            ArcGIS Online
          </CalciteSegmentedControlItem>
          <CalciteSegmentedControlItem
            {...{
              checked: portalType === "enterprise" ? true : undefined,
            }}
            value="enterprise"
          >
            ArcGIS Enterprise
          </CalciteSegmentedControlItem>
        </CalciteSegmentedControl> */}
        <StyledCalciteInputText
          prefixText="Client ID"
          value={clientId}
          onCalciteInputChange={(event) => {
            setClientId(event.target.value);
          }}
        />
        {/* {portalType === "enterprise" && ( */}
        <StyledCalciteInputText
          prefixText="Portal URL"
          value={portalUrl}
          onCalciteInputInput={(event) => {
            setPortalUrl(event.target.value);
          }}
        />
        {/* )} */}
        <StyledCalciteInputText
          prefixText="Koop URL"
          value={koopUrl}
          onCalciteInputChange={(event) => {
            setKoopUrl(event.target.value);
          }}
        ></StyledCalciteInputText>
        <div style={{ marginTop: "1rem" }}>
          <CalciteButton iconStart="save" onClick={() => updateSettings()}>
            Save Configuration
          </CalciteButton>
        </div>
      </StyledInputContainer>
    </StyledContainer>
  );
};

export default Configure;
