import React, { useState } from "react";
import OrgUnitTree from "../components/OrgUnitTree";
import {
  CalciteButton,
  CalciteCard,
  CalciteLabel,
  CalciteStepper,
  CalciteStepperItem,
  CalciteNotice,
} from "@esri/calcite-components-react";

const NewConnection = () => {
  // const [currentStep, setCurrentStep] = useState(0);

  return (
    <div style={{ padding: "1rem", height: "100vh" }}>
      <CalciteStepper numbered>
        <CalciteStepperItem 
        heading="Organisation units"
        >
          <CalciteNotice 
          width="full" 
          open
          >
            <div slot="title">Step 1 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem heading="Period">
        <CalciteNotice width="full" open>
            <div slot="title">Step 2 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem heading="Events">
          <CalciteNotice width="full" open>
            <div slot="title">Step 3 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem heading="Aggregation">
          <CalciteNotice width="full" open>
            <div slot="title">Step 4 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem heading="Instance Selection">
          <CalciteNotice width="full" open>
            <div slot="title">Step 5 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem heading="Summary">
          <CalciteNotice width="full" open>
            <div slot="title">Step 6 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
      </CalciteStepper>
      <OrgUnitTree />
    </div>
  );
};

export default NewConnection;