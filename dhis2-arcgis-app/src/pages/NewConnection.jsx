import React, { useState } from "react";

import i18n from "@dhis2/d2-i18n";

import OrgUnitTree from "../components/OrgUnitTree";
import {
  CalciteButton,
  CalciteCard,
  CalciteLabel,
  CalciteStepper,
  CalciteStepperItem,
  CalciteNotice,
} from "@esri/calcite-components-react";

import {
  DataDimension,
  FixedPeriodSelect,
  OrgUnitDimension,
  PeriodDimension,
} from "@dhis2/analytics";
import OrgUnitDimensionWrapper from "../components/OrgUnitDimensionWrapper";

const NewConnection = () => {
  const [selectedOrgUnits, setSelectedOrgUnits] = useState([]);
  const [selectedDimensions, setSelectedDimensions] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);

  return (
    <div style={{ padding: "1rem", height: "100vh" }}>
      <CalciteStepper>
        <CalciteStepperItem numbered={true} heading="Organisation units">
          {/* <OrgUnitTree onChange={setSelectedOrgUnits} /> */}
          <OrgUnitDimensionWrapper onChange={setSelectedOrgUnits} />
        </CalciteStepperItem>
        <CalciteStepperItem numbered={true} heading={i18n.t("Data")}>
          {/* <InfiniteScrollTransfer /> */}
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
              onSelect={(response) => setSelectedDimensions(response.items)}
              onCalculationSave={(response) => {
                console.log(response);
              }}
            />
          </div>
        </CalciteStepperItem>
        <CalciteStepperItem numbered={true} heading="Filter by Time">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            <PeriodDimension
              selectedPeriods={selectedPeriods}
              onSelect={(response) => {
                console.log(response);
                setSelectedPeriods(response.items);
              }}
            />
          </div>
        </CalciteStepperItem>
        {/* <CalciteStepperItem numbered={true} heading="Aggregation">
          <CalciteNotice width="full" open>
            <div slot="title">Step 4 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem numbered={true} heading="Instance Selection">
          <CalciteNotice width="full" open>
            <div slot="title">Step 5 Content</div>
          </CalciteNotice>
        </CalciteStepperItem> */}
        <CalciteStepperItem numbered={true} heading="Summary">
          <CalciteNotice width="full" open>
            <div slot="title">Step 6 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
      </CalciteStepper>
      <div>
        <p>Selected Org Units: {JSON.stringify(selectedOrgUnits)}</p>
        <p>Selected Dimensions: {JSON.stringify(selectedDimensions)}</p>
        <p>Selected Periods: {JSON.stringify(selectedPeriods)}</p>
      </div>
    </div>
  );
};

export default NewConnection;
