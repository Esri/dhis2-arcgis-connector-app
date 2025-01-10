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
  CalciteInput,
} from "@esri/calcite-components-react";

import {
  DataDimension,
  FixedPeriodSelect,
  OrgUnitDimension,
  PeriodDimension,
} from "@dhis2/analytics";
import OrgUnitDimensionWrapper from "../components/OrgUnitDimensionWrapper";

const NewConnection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOrgUnits, setSelectedOrgUnits] = useState([]);
  const [selectedDimensions, setSelectedDimensions] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleNext = () => {
    setCurrentStep((previousStep) => Math.min(previousStep + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((previousStep) => Math.max(previousStep - 1, 0));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
// TODO: Add stepper logic below

  return (
    <div style={{ padding: "1rem", height: "100vh" }}>
      <CalciteStepper activeStep={currentStep}>
        <CalciteStepperItem numbered={true} heading="Organisation units" active={currentStep === 0}>
          {/* <OrgUnitTree onChange={setSelectedOrgUnits} /> */}
          <OrgUnitDimensionWrapper onChange={setSelectedOrgUnits} />
        </CalciteStepperItem>
        <CalciteStepperItem numbered={true} heading={i18n.t("Data")} active={currentStep === 1}>
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
        <CalciteStepperItem numbered={true} heading="Filter by Time" active={currentStep === 2}>
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
        <CalciteStepperItem numbered={true} heading="Publish" active={currentStep === 3}>
          <CalciteNotice width="full" open>
            <div slot="title">Publish Content</div>
          </CalciteNotice>
          <form className="publish-form">
            <CalciteLabel>Title</CalciteLabel>
            <CalciteInput
              name="name"
              value={formData.name}
              placeholder="Please name your ArcGIS Item"
              onInput={handleInputChange}
              />
            <CalciteLabel>Description</CalciteLabel>
            <CalciteInput 
            name="description"
            value={formData.description}
            onInput={handleInputChange}
            />
          </form>
        </CalciteStepperItem>
      </CalciteStepper>
      <div>
        <p>Selected Org Units: {JSON.stringify(selectedOrgUnits)}</p>
        <p>Selected Dimensions: {JSON.stringify(selectedDimensions)}</p>
        <p>Selected Periods: {JSON.stringify(selectedPeriods)}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <CalciteButton
        appearance="outline"
        scale="l"
        onClick={handleBack}
        // disable could be useful in controlling for min req's met each step before advancing.
        // disabled={currentStep === 0}
        >Back</CalciteButton>
        <CalciteButton
        appearance="solid"
        scale="l"
        onClick={handleNext}
        // disabled={currentStep === 3} 
        // OU & Periods are required, Dimensions are optional.
        >Next</CalciteButton>
      </div>
    </div>
  );
};

export default NewConnection;
