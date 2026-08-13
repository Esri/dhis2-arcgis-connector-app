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

import React, { useState, useEffect, useRef, useMemo } from "react";
import i18n from "@dhis2/d2-i18n";

import {
  CalciteButton,
  CalciteStepper,
  CalciteStepperItem,
  CalciteInput,
  CalciteNotice,
} from "@esri/calcite-components-react";

import { DataDimension, PeriodDimension, dataTypeMap } from "@dhis2/analytics";
import OrgUnitDimensionWrapper from "../components/OrgUnitDimensionWrapper";
import PreviewPanel from "../components/PreviewPanel";
import useOrgUnitGeometry from "../hooks/useOrgUnitGeometry";
import useOrgUnitRoots from "../hooks/useOrgUnitRoots";
import { resolveOuDimension } from "../util/orgUnits";
import { useAuth } from "../contexts/AuthContext";
import { useSystemSettings } from "../contexts/SystemSettingsContext";

import { cdfTemplate } from "../template/cdfTemplate";
import { useAppAlert, ALERT_TYPES } from "../hooks/useAppAlert";
import {
  isServiceNameAvailable,
  canPreview,
  createPreview,
  keepPreview,
  deleteConnection,
} from "../util/portal";
import {
  isFinalStep,
  canAdvanceStep,
  WIZARD_STEP_COUNT,
} from "../util/wizardSteps";
import {
  suggestConnectionName,
  suggestDescription,
  applyNameSuffix,
} from "../util/suggestions";

import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ReactJsonView from "@microlink/react-json-view";

const StyledCalciteInputText = styled(CalciteInput)`
  --calcite-input-prefix-size: 140px;
  width: 400px;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
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

  const { roots } = useOrgUnitRoots();

  // Levels/groups resolve against the user's roots; this resolved ou is the
  // single source for both the geometry pre-check and the created service (#58).
  const resolvedOuIds = useMemo(
    () => resolveOuDimension(selectedOrgUnits, roots),
    [selectedOrgUnits, roots]
  );

  // Single geometry-type validity for the org-unit step (issue #42).
  const geometry = useOrgUnitGeometry(resolvedOuIds);
  const canLeaveOrgUnitStep =
    selectedOrgUnits.length > 0 && !geometry.loading && geometry.valid;

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
  const [nameEdited, setNameEdited] = useState(false);
  const [descriptionEdited, setDescriptionEdited] = useState(false);

  // The just-created preview Connection (real service + item), or null while
  // still editing. Its presence swaps the wizard for the preview view.
  const [previewHandle, setPreviewHandle] = useState(null);
  const [isKeeping, setIsKeeping] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const encode = (string) =>
    btoa(string).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

  const debounceRef = useRef();
  const stepperRef = useRef();

  const canAdvanceCurrentStep = canAdvanceStep(currentStep, {
    canLeaveOrgUnitStep,
    hasDataItems: selectedDimensions.length > 0,
  });

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
    const orgUnits = resolvedOuIds;

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
  }, [resolvedOuIds, selectedOrgUnits, selectedDimensions, selectedPeriods]);

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

  // Deep-clones the CDF template (its `service` object is shared module state)
  // and fills in the current selection to form the createService request body.
  const buildCreateServiceBody = () => {
    const service = JSON.parse(JSON.stringify(cdfTemplate.service));
    service.serviceName = layerName;
    service.description = layerDescription;
    service.jsonProperties.customDataProviderInfo.dataProviderHost =
      finalEncodedParams;
    return new URLSearchParams({
      f: "json",
      token: userCredential.token,
      service: JSON.stringify(service),
    }).toString();
  };

  // Preview creates the real feature service (ADR-0001), then the author Keeps
  // or Discards it. Preconditions are enforced by the Preview button's gate.
  const handlePreview = async () => {
    setIsCurrentlyCreatingLayer(true);
    try {
      const handle = await createPreview({
        portalUrl: userCredential.server,
        hostingServerUrl: hostingServerProperties.url,
        token: userCredential.token,
        serviceName: layerName,
        formBody: buildCreateServiceBody(),
      });
      setPreviewHandle({
        ...handle,
        hasGeometry: geometry.status !== "none",
      });
    } catch (err) {
      console.error("Error creating preview", err);
      showAlert({
        title: i18n.t("Error creating preview"),
        autoClose: false,
        message: String(err?.message || err),
        type: ALERT_TYPES.DANGER,
      });
    } finally {
      setIsCurrentlyCreatingLayer(false);
    }
  };

  // Keep commits the previewed Connection: no recreation, just strip the
  // preview tag (best-effort) and go to the Connections list.
  const handleKeep = async () => {
    if (!previewHandle) return;
    setIsKeeping(true);
    try {
      await keepPreview({
        portalUrl: userCredential.server,
        owner: previewHandle.owner,
        itemId: previewHandle.itemId,
        token: userCredential.token,
        typeKeywords: previewHandle.typeKeywords,
      });
    } catch (err) {
      // A failed untag must never block the commit; the tag just lingers.
      console.warn("Could not remove the preview tag on keep", err);
    } finally {
      setIsKeeping(false);
      navigate("/connections", {
        state: { newConnectionTitle: previewHandle.serviceName },
      });
    }
  };

  // Discard deletes both artifacts (portal item + CDF service) and returns to
  // editing the same selection.
  const handleDiscard = async () => {
    if (!previewHandle) return;
    setIsDiscarding(true);
    try {
      await deleteConnection({
        portalUrl: userCredential.server,
        hostingServerUrl: hostingServerProperties.url,
        owner: previewHandle.owner,
        itemId: previewHandle.itemId,
        serviceName: previewHandle.serviceName,
        token: userCredential.token,
      });
      setPreviewHandle(null);
    } catch (err) {
      console.error("Error discarding preview", err);
      showAlert({
        title: i18n.t("Error discarding preview"),
        autoClose: false,
        message: String(err?.message || err),
        type: ALERT_TYPES.DANGER,
      });
    } finally {
      setIsDiscarding(false);
    }
  };

  const handleLayerNameChange = (event) => {
    setIsCheckingName(true);
    setNameEdited(true);
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

  // Finds an available service name, auto-suffixing (_2, _3, ...) on collision
  // via the existing availability check.
  const findAvailableName = async (base) => {
    if (!base || !userCredential?.server || !userCredential?.token) {
      return base;
    }
    let occurrence = 1;
    let candidate = applyNameSuffix(base, occurrence);
    while (occurrence <= 50) {
      const available = await isServiceNameAvailable(
        userCredential.server,
        candidate,
        userCredential.token
      );
      if (available) {
        return candidate;
      }
      occurrence += 1;
      candidate = applyNameSuffix(base, occurrence);
    }
    return candidate;
  };

  // Pre-fill an editable suggested name/description on the Summary step from the
  // current selection. User edits are never overwritten by later suggestions.
  useEffect(() => {
    if (currentStep !== 4) {
      return;
    }

    let cancelled = false;
    const selection = {
      dataItems: selectedDimensions,
      orgUnits: selectedOrgUnits,
      periods: selectedPeriods,
    };

    if (!descriptionEdited) {
      const description = suggestDescription(selection);
      if (description) {
        setLayerDescription(description);
      }
    }

    if (!nameEdited) {
      const base = suggestConnectionName(selection);
      if (base) {
        setIsCheckingName(true);
        findAvailableName(base).then((available) => {
          if (cancelled) {
            return;
          }
          setLayerName(available);
          setIsLayerNameValid(true);
          setIsLayerNameAvailable(true);
          setIsCheckingName(false);
        });
      }
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

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
      {previewHandle ? (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              gap: "1rem",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
              {i18n.t("Preview of {{name}}", {
                name: previewHandle.serviceName,
              })}
            </h2>
            <Description>
              {i18n.t(
                "This preview is the real Connection. Keep it to finish, or Discard to delete it and continue editing."
              )}
            </Description>
            <PreviewPanel
              serviceUrl={previewHandle.serviceUrl}
              hasGeometry={previewHandle.hasGeometry}
            />
          </div>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "100%",
              borderTop: "1px solid var(--calcite-ui-border-3)",
              paddingTop: "1rem",
            }}
          >
            <CalciteButton
              scale="l"
              appearance="outline"
              kind="danger"
              iconStart="trash"
              loading={isDiscarding}
              {...(isKeeping ? { disabled: true } : {})}
              onClick={handleDiscard}
            >
              {i18n.t("Discard")}
            </CalciteButton>
            <StyledCreateCalciteButton
              scale="l"
              iconStart="check"
              loading={isKeeping}
              {...(isDiscarding ? { disabled: true } : {})}
              onClick={handleKeep}
            >
              {i18n.t("Keep")}
            </StyledCreateCalciteButton>
          </div>
        </>
      ) : (
        <>
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <CalciteStepper
        ref={stepperRef}
        numbered
        onCalciteStepperChange={(event) => {
          console.log("stepChange", event);
          setCurrentStep(event.target.selectedItem.selectedPosition + 1);
        }}
      >
        <CalciteStepperItem heading="Organisation units">
          <Description>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {i18n.t(
                "Select the organisation units below to aggregate your data."
              )}
            </div>
            <br />
            <div>
              {i18n.t(
                "Combining organisation units with different geography types is not supported. Please make separate connections for different geography types."
              )}
            </div>
            <br />
          </Description>
          <OrgUnitDimensionWrapper onChange={setSelectedOrgUnits} />
          {selectedOrgUnits.length > 0 && (
            <div
              style={{
                margin: "0.75rem 0",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              {geometry.loading
                ? i18n.t("Checking your selection…")
                : geometry.mappableCount > 0
                ? i18n.t(
                    "Resolves to {{count}} mappable organisation units • geometry: {{types}}",
                    {
                      count: geometry.mappableCount,
                      types: geometry.geometryTypes.join(" and "),
                    }
                  )
                : i18n.t(
                    "Resolves to a table-only Connection (no mapped organisation units)."
                  )}
            </div>
          )}
          {selectedOrgUnits.length > 0 && geometry.status === "mixed" && (
            <CalciteNotice open kind="danger" icon scale="m">
              <div slot="title">{i18n.t("Mixed geometry types")}</div>
              <div slot="message">
                {i18n.t(
                  "The selected organisation units resolve to more than one geometry type ({{types}}). A Connection supports a single geometry type — remove units so only one type remains, or create separate Connections.",
                  { types: geometry.geometryTypes.join(" and ") }
                )}
              </div>
            </CalciteNotice>
          )}
          {selectedOrgUnits.length > 0 && geometry.status === "partial" && (
            <CalciteNotice open kind="warning" icon scale="m">
              <div slot="title">{i18n.t("Some units have no geometry")}</div>
              <div slot="message">
                {i18n.t(
                  "Some selected organisation units have no geometry. They will be included as table-only rows in the Connection."
                )}
              </div>
            </CalciteNotice>
          )}
          {selectedOrgUnits.length > 0 && geometry.status === "none" && (
            <CalciteNotice open kind="info" icon scale="m">
              <div slot="title">{i18n.t("Table-only Connection")}</div>
              <div slot="message">
                {i18n.t(
                  "None of the selected organisation units have geometry. This will create a table-only Connection with no map layer."
                )}
              </div>
            </CalciteNotice>
          )}
        </CalciteStepperItem>
        <CalciteStepperItem
          heading={i18n.t("Data")}
          {...(canLeaveOrgUnitStep ? undefined : { disabled: true })}
        >
          <Description>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {i18n.t("Select data items to include in your ArcGIS Layer. ")}
            </div>
            <br />
            <div>
              {i18n.t(
                "Note: Data elements with conflicting aggregation types will cause the layer creation to fail. If you would like to only connect geographies for organisation units, do not select any data items."
              )}
            </div>
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
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {i18n.t("Select the time period for your selected data.")}
            </div>
            <br />
            <div>
              {i18n.t(
                "Data may be additionally filtered by time in ArcGIS Enterprise applications and maps."
              )}
            </div>
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
              onCalciteInputInput={(event) => {
                setDescriptionEdited(true);
                setLayerDescription(event.target.value);
              }}
              placeholder={i18n.t("Enter a description for your layer")}
            />
          </div>
        </CalciteStepperItem>
      </CalciteStepper>
          </div>
      <div
        style={{
          marginTop: "1rem",
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          width: "100%",
          borderTop: "1px solid var(--calcite-ui-border-3)",
          paddingTop: "1rem",
        }}
      >
        <CalciteButton
          scale="l"
          appearance="outline"
          onClick={() => navigate("/connections")}
        >
          {i18n.t("Cancel")}
        </CalciteButton>
        {isFinalStep(currentStep) ? (
          <CalciteButton
            iconStart="map"
            scale="l"
            loading={isCurrentlyCreatingLayer || isCheckingName}
            onClick={handlePreview}
            {...(canPreview({
              isLayerNameValid,
              isLayerNameAvailable,
              isCheckingName,
              geometryValid: geometry.valid,
            })
              ? {}
              : { disabled: true })}
          >
            {i18n.t("Preview")}
          </CalciteButton>
        ) : (
          <CalciteButton
            iconEnd="chevron-right"
            scale="l"
            onClick={() => {
              stepperRef.current?.nextStep();
              // nextStep() emits no calciteStepperChange, so advance our state too.
              setCurrentStep((step) => Math.min(step + 1, WIZARD_STEP_COUNT));
            }}
            {...(canAdvanceCurrentStep ? {} : { disabled: true })}
          >
            {i18n.t("Next")}
          </CalciteButton>
        )}
      </div>
        </>
      )}
    </div>
  );
};

export default NewConnection;
