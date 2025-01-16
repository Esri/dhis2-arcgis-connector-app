import React, { useState, useEffect, useRef } from "react";
import i18n from "@dhis2/d2-i18n";

import {
  CalciteButton,
  CalciteStepper,
  CalciteStepperItem,
  CalciteInput,
} from "@esri/calcite-components-react";

import { DataDimension, PeriodDimension } from "@dhis2/analytics";
import OrgUnitDimensionWrapper from "../components/OrgUnitDimensionWrapper";
import { useAuth } from "../contexts/AuthContext";

import { cdfTemplate } from "../template/cdfTemplate";
import { useAppAlert, ALERT_TYPES } from "../hooks/useAppAlert";
import { createService } from "../util/portal";

import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledCalciteInputText = styled(CalciteInput)`
  --calcite-input-prefix-size: 140px;
  width: 400px;
`;

const StyledCreateCalciteButton = styled(CalciteButton)`
  --calcite-color-brand: green !important;
`;

const NewConnection = ({
  isCurrentlyCreatingLayer,
  setIsCurrentlyCreatingLayer,
}) => {
  const navigate = useNavigate();
  const { userCredential, hostingServerProperties } = useAuth();
  const { showAlert } = useAppAlert();

  const [currentStep, setCurrentStep] = useState(1);

  const [debug, setDebug] = useState(false);
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
  const [layerDescription, setLayerDescription] = useState("");

  const encode = (string) =>
    btoa(string).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

  useEffect(() => {
    console.log("hello render!");
  }, []);

  useEffect(() => {
    const finalStringParams = `dimension=${cdfParams.dimension},${cdfParams.ou},${cdfParams.pe}&tableLayout=${cdfParams.tableLayout}&columns=${cdfParams.columns}&rows=${cdfParams.rows}`;

    setFinalStringParams(finalStringParams);
    setFinalEncodedParams(encode(finalStringParams));
  }, [cdfParams]);

  useEffect(() => {
    const dimensions = selectedDimensions.map((dimension) => dimension.id);
    const periods = selectedPeriods.map((period) => period.id);
    const orgUnits = selectedOrgUnits.map((orgUnit) => orgUnit.id);

    const updatedCdfParams = {
      dimension: `dx:${dimensions.join(";")}`,
      ou: `ou:${orgUnits.join(";")}`,
      pe: `pe:${periods.join(";")}`,
    };

    setCdfParams({
      ...cdfParams,
      ...updatedCdfParams,
    });
  }, [selectedOrgUnits, selectedDimensions, selectedPeriods]);

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

    navigate("/connections");
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
          <OrgUnitDimensionWrapper onChange={setSelectedOrgUnits} />
        </CalciteStepperItem>
        <CalciteStepperItem
          heading={i18n.t("Data")}
          {...(selectedOrgUnits.length === 0 ? { disabled: true } : undefined)}
        >
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
              onCalciteInputInput={(event) => setLayerName(event.target.value)}
            />
            <StyledCalciteInputText
              prefixText={i18n.t("Layer Description")}
              value={layerDescription}
              style={{ width: "600px" }}
              onCalciteInputInput={(event) =>
                setLayerDescription(event.target.value)
              }
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
            loading={isCurrentlyCreatingLayer}
            onClick={handleCreateLayer}
            {...(layerName !== "" ? undefined : { disabled: true })}
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
      {debug && (
        <div>
          <p>Selected Org Units: {JSON.stringify(selectedOrgUnits)}</p>
          <p>Selected Dimensions: {JSON.stringify(selectedDimensions)}</p>
          <p>Selected Periods: {JSON.stringify(selectedPeriods)}</p>
          <p>CDF Params: {JSON.stringify(cdfParams)}</p>
          <p>Final String Params: {finalStringParams}</p>
          <p>
            API Testing Url:{" "}
            <a
              href={`https://dhis2.esrigcazure.com/dhis/api/40/analytics?${finalStringParams}`}
              target="_blank"
            >
              {`https://dhis2.esrigcazure.com/dhis/api/40/analytics?${finalStringParams}`}
            </a>
          </p>
          <p>Final Encoded Params: {finalEncodedParams}</p>
        </div>
      )}
    </div>
  );
};

export default NewConnection;
