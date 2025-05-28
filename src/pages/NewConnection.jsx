import React, { useState, useEffect, useRef } from "react";
import i18n from "@dhis2/d2-i18n";

import {
  CalciteButton,
  CalciteStepper,
  CalciteStepperItem,
  CalciteInput,
} from "@esri/calcite-components-react";

import { DataDimension, PeriodDimension, dataTypeMap } from "@dhis2/analytics";
import OrgUnitDimensionWrapper from "../components/OrgUnitDimensionWrapper";
import { useAuth } from "../contexts/AuthContext";
import { useSystemSettings } from "../contexts/SystemSettingsContext";

import { cdfTemplate } from "../template/cdfTemplate";
import { useAppAlert, ALERT_TYPES } from "../hooks/useAppAlert";
import { createService, isServiceNameAvailable } from "../util/portal";

import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ReactJsonView from "@microlink/react-json-view";

const StyledCalciteInputText = styled(CalciteInput)`
  --calcite-input-prefix-size: 140px;
  width: 400px;
`;

const Description = styled.div`
  display: flex;
  justify-content: left;
  text-align: left;
  color: dark grey;
  font-size: 16px;
  font-weight: 400;
  word-wrap: break-word;
  margin-bottom: 1.5rem;
  margin-top: 1rem;
`;

const StyledCreateCalciteButton = styled(CalciteButton)`
  --calcite-color-brand: green !important;
`;

const NewConnection = ({
  isCurrentlyCreatingLayer,
  setIsCurrentlyCreatingLayer,
  updateDebugInfo,
}) => {
  const navigate = useNavigate();
  const { userCredential, hostingServerProperties } = useAuth();
  const { showAlert } = useAppAlert();

  const { settings } = useSystemSettings();

  const [currentStep, setCurrentStep] = useState(1);

  const [debug, setDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  // const [isCreatingLayer, setIsCreatingLayer] = useState(false);
  const [selectedOrgUnits, setSelectedOrgUnits] = useState([]);
  const [selectedDimensions, setSelectedDimensions] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);

  const [cdfParams, setCdfParams] = useState({
    tableLayout: "true",
    columns: "dx",
    rows: "ou;pe",
  });

  const [finalStringParams, setFinalStringParams] = useState("");
  const [finalEncodedParams, setFinalEncodedParams] = useState("");
  const [layerName, setLayerName] = useState("");
  const [isLayerNameValid, setIsLayerNameValid] = useState(true);
  const [isLayerNameAvailable, setIsLayerNameAvailable] = useState(true);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [layerDescription, setLayerDescription] = useState("");

  const encode = (string) =>
    btoa(string).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

  const debounceRef = useRef();

  // useEffect(() => {
  //   console.log("hello render!");
  // }, []);

  // useEffect(() => {
  //   const finalStringParams = `dimension=${cdfParams.dimension},${cdfParams.ou},${cdfParams.pe}&tableLayout=${cdfParams.tableLayout}&columns=${cdfParams.columns}&rows=${cdfParams.rows}`;

  //   setFinalStringParams(finalStringParams);
  //   setFinalEncodedParams(encode(finalStringParams));
  // }, [cdfParams]);

  useEffect(() => {
    const dimensions = selectedDimensions.map((dimension) => dimension.id);
    const periods = selectedPeriods.map((period) => period.id);
    const orgUnits = selectedOrgUnits.map((orgUnit) => orgUnit.id);

    const finalStringParams = `dimension=dx:${dimensions.join(
      ";"
    )},ou:${orgUnits.join(";")},pe:${periods.join(
      ";"
    )}&tableLayout=true&columns=dx&rows=ou;pe`;
    const encodedFinalStringParams = encode(finalStringParams);

    setFinalStringParams(finalStringParams);
    setFinalEncodedParams(encodedFinalStringParams);

    // const updatedCdfParams = {
    //   dimension: `dx:${dimensions.join(";")}`,
    //   ou: `ou:${orgUnits.join(";")}`,
    //   pe: `pe:${periods.join(";")}`,
    // };

    // setCdfParams({
    //   ...cdfParams,
    //   ...updatedCdfParams,
    // });

    const newDebugInfo = {
      selectedOrgUnits,
      selectedDimensions,
      selectedPeriods,
      // cdfParams: updatedCdfParams,
      finalStringParams,
      finalEncodedParams: encodedFinalStringParams,
      finalApiUrl: `https://dhis2.esrigcazure.com/dhis/api/40/analytics?${finalStringParams}`,
    };

    setDebugInfo(newDebugInfo);

    updateDebugInfo(newDebugInfo);
  }, [selectedOrgUnits, selectedDimensions, selectedPeriods]);

  // <div>
  //         <p>Selected Org Units: {JSON.stringify(selectedOrgUnits)}</p>
  //         <p>Selected Dimensions: {JSON.stringify(selectedDimensions)}</p>
  //         <p>Selected Periods: {JSON.stringify(selectedPeriods)}</p>
  //         <p>CDF Params: {JSON.stringify(cdfParams)}</p>
  //         <p>Final String Params: {finalStringParams}</p>
  //         <p>
  //           API Testing Url:{" "}
  //           <a
  //             href={`https://dhis2.esrigcazure.com/dhis/api/40/analytics?${finalStringParams}`}
  //             target="_blank"
  //           >
  //             {`https://dhis2.esrigcazure.com/dhis/api/40/analytics?${finalStringParams}`}
  //           </a>
  //         </p>
  //         <p>Final Encoded Params: {finalEncodedParams}</p>
  //       </div>

  const handleCreateLayer = async () => {
    setIsCurrentlyCreatingLayer(true);

    const url = `${hostingServerProperties.url}/admin/services/createService`;

    // make a copy of cdfTemplate
    const body = { ...cdfTemplate };
    body.f = "json";
    body.token = userCredential.token;
    body.service.serviceName = layerName;
    body.service.description = layerDescription;
    body.service.jsonProperties.customDataProviderInfo.dataProviderHost =
      finalEncodedParams;

    body.service = JSON.stringify(body.service);

    const formBody = new URLSearchParams(body).toString();

    try {
      const response = await createService(
        hostingServerProperties.url,
        formBody
      );
      console.log(response);
      if (response.status === "success") {
        showAlert({
          title: i18n.t("Layer created successfully"),
          autoClose: false,
          message: i18n.t(
            "Your layer has been created successfully. You can now use it in ArcGIS."
          ),
          type: ALERT_TYPES.SUCCESS,
        });
        navigate("/connections");
      } else {
        showAlert({
          title: i18n.t("Error creating layer"),
          autoClose: false,
          message: JSON.stringify(response),
          type: ALERT_TYPES.DANGER,
        });
      }
    } catch (err) {
      console.error("Error creating layer", err);
      showAlert({
        title: i18n.t("Error creating layer"),
        autoClose: false,
        message: JSON.stringify(err),
        type: ALERT_TYPES.DANGER,
      });
    } finally {
      setIsCurrentlyCreatingLayer(false);
    }
  };

  const handleLayerNameChange = (event) => {
    setIsCheckingName(true);
    const newLayerName = event.target.value;
    setLayerName(newLayerName);

    if (newLayerName === "") {
      setIsLayerNameValid(false);
      return;
    }

    // `newLayerName` should not contain any spaces or special characters except underscores
    const isValidLayerName = /^[a-zA-Z0-9_]+$/.test(newLayerName);
    if (!isValidLayerName) {
      showAlert({
        title: i18n.t(`Invalid layer name: ${newLayerName}`),
        autoClose: true,
        message: i18n.t(
          "Layer names cannot contain spaces or any special characters except underscores. Please remove them to continue."
        ),
        type: ALERT_TYPES.DANGER,
      });
      setIsLayerNameValid(false);
      setIsCheckingName(false);
      return;
    }

    setIsLayerNameValid(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(async () => {
      // user has stopped typing for 500ms — fire your request
      const isAvailable = await isServiceNameAvailable(
        userCredential.server,
        newLayerName,
        userCredential.token
      );

      if (!isAvailable) {
        showAlert({
          title: i18n.t(`Layer name: ${newLayerName} already exists`),
          autoClose: true,
          message: i18n.t(
            "The layer name you have entered already exists. Please choose a different name."
          ),
          type: ALERT_TYPES.DANGER,
        });

        setIsLayerNameAvailable(false);
      } else {
        setIsLayerNameAvailable(true);
      }

      setIsCheckingName(false);
    }, 500);
  };

  return (
    <div
      style={{
        padding: "1rem",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CalciteStepper
        // ref={stepperRef}
        numbered
        onCalciteStepperChange={(event) => {
          console.log("stepChange", event);
          setCurrentStep(event.target.selectedItem.selectedPosition + 1);
        }}
      >
        <CalciteStepperItem heading="Organisation units">
          <Description>
            {i18n.t(
              "Select the organisation units below to aggregate your data."
            )}
          </Description>
          <OrgUnitDimensionWrapper onChange={setSelectedOrgUnits} />
        </CalciteStepperItem>
        <CalciteStepperItem
          heading={i18n.t("Data")}
          {...(selectedOrgUnits.length === 0 ? { disabled: true } : undefined)}
        >
          <Description>
            {i18n.t(
              "Select data items to include in your ArcGIS Layer. Note: Data elements with conflicting aggregation types will cause the layer creation to fail."
            )}
            <br />
            {i18n.t(
              "If you would like to only connect geographies for organisation units, do not select any data items."
            )}
          </Description>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            <DataDimension
              displayNameProp="displayName"
              selectedDimensions={selectedDimensions}
              // enabledDataTypes={[
              //   dataTypeMap.INDICATOR,
              //   dataTypeMap.PROGRAM_INDICATOR,
              // ]}
              onSelect={(response) => {
                console.log(response);
                setSelectedDimensions(response.items);
              }}
              onCalculationSave={(response) => {
                console.log(response);
              }}
            />
          </div>
        </CalciteStepperItem>
        <CalciteStepperItem
          heading="Filter by Time"
          {...(selectedDimensions.length === 0
            ? { disabled: true }
            : undefined)}
        >
          <Description>
            {i18n.t(
              "Select the time period for your selected data. Data may be additionally filtered by time in ArcGIS Enterprise applications and maps."
            )}
            <br />
          </Description>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              padding: "1rem",
              width: "100%",
            }}
          >
            <div style={{ margin: "0 auto", width: "fit-content" }}>
              <PeriodDimension
                selectedPeriods={selectedPeriods}
                onSelect={(response) => {
                  console.log(response);
                  setSelectedPeriods(response.items);
                }}
              />
            </div>
          </div>
        </CalciteStepperItem>
        <CalciteStepperItem heading="Summary">
          <Description>
            {i18n.t(
              "Create a title and description for your new ArcGIS Enterprise Layer. Both fields may be changed later in ArcGIS Enterprise."
            )}
            <br />
          </Description>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <StyledCalciteInputText
              prefixText={i18n.t("Layer Name")}
              value={layerName}
              // onCalciteInputInput={(event) => setLayerName(event.target.value)}
              onCalciteInputInput={(event) => handleLayerNameChange(event)}
              placeholder={i18n.t("Enter a unique layer name")}
            />
            <StyledCalciteInputText
              prefixText={i18n.t("Layer Description")}
              value={layerDescription}
              style={{
                width: "65%",
              }}
              onCalciteInputInput={(event) =>
                setLayerDescription(event.target.value)
              }
              placeholder={i18n.t("Enter a description for your layer")}
            />
          </div>
        </CalciteStepperItem>
      </CalciteStepper>
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          borderTop: "1px solid var(--calcite-ui-border-3)",
          paddingTop: "1rem",
        }}
      >
        {currentStep === 4 ? (
          <CalciteButton
            iconStart="add-layer-service"
            scale="l"
            loading={isCurrentlyCreatingLayer || isCheckingName}
            onClick={handleCreateLayer}
            {...(isLayerNameAvailable && isLayerNameValid && !isCheckingName
              ? {}
              : { disabled: true })}
          >
            Create Connection
          </CalciteButton>
        ) : (
          <CalciteButton scale="l" onClick={() => navigate("/connections")}>
            Cancel
          </CalciteButton>
        )}
        {/* <div style={{ display: "flex", gap: "1rem" }}>
          <CalciteButton
            {...(currentStep === 1 ? { disabled: true } : undefined)}
            appearance="outline"
            scale="l"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Previous
          </CalciteButton>

          <CalciteButton
            iconStart={
              currentStep === 4 ? "add-layer-service" : "chevron-right"
            }
            scale="l"
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            {currentStep === 4 ? "Create" : "Next"}
          </CalciteButton>
        </div> */}
      </div>
      {/* {settings?.arcgisConfig?.showDebugInfo && (
        <div style={{ margin: "1rem", paddingBottom: "2rem" }}>
          <h2>Debug Information</h2>
          <p>
            API Testing Url:{" "}
            <a
              href={`https://dhis2.esrigcazure.com/dhis/api/40/analytics?${finalStringParams}`}
              target="_blank"
            >
              {`https://dhis2.esrigcazure.com/dhis/api/40/analytics?${finalStringParams}`}
            </a>
          </p>
          <ReactJsonView
            displayDataTypes={false}
            displayObjectSize={false}
            name="debugInfo"
            src={debugInfo}
          />
         
        </div>
      )} */}
    </div>
  );
};

export default NewConnection;
