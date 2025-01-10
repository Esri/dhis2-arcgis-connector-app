import React, { useState } from "react";
import OrgUnitTree from "../components/OrgUnitTree";
import {
  CalciteButton,
  CalciteCard,
  CalciteLabel,
  CalcitePanel,
  CalciteStepper,
  CalciteStepperItem,
  CalciteNotice,
  CalciteFilter,
} from "@esri/calcite-components-react";

// Move some styling up here similar to LandingPage?

const NewConnection = () => {

  return (
    <div style={{ padding: "1rem", height: "100vh" }}>
      <CalciteStepper>
        <CalciteStepperItem 
        numbered={true}
        heading="Organisation units">
          <CalciteNotice width="full" open>
            <div slot="title">
              <CalciteFilter placeholder="Search by name"></CalciteFilter>
              <OrgUnitTree />
              <p>Step 1 Content</p>
              <CalciteButton 
              appearance="outline" 
              color="#00619b">Back</CalciteButton>
              <CalciteButton 
              appearance="outline" 
              display="flex"
              justify-content="right"
              color="#00619b">Back</CalciteButton>
            </div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem 
        numbered={true}
        heading="Data">
          <CalciteNotice width="full" open>
            <div slot="title">Step 2 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem 
        numbered={true}
        heading="Filter">
          <CalciteNotice width="full" open>
            <div slot="title">Step 3 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem 
        numbered={true}
        heading="Summary">
          <CalciteNotice width="full" open>
            <div slot="title">Step 4 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
      </CalciteStepper>
    </div>
  );
};

export default NewConnection;