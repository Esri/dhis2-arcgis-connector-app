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
            <OrgUnitTree />
              <p>Step 1 Content</p>
            </div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem 
        numbered={true}
        heading="Period">
        <CalciteNotice width="full" open>
            <div slot="title">Step 2 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem 
        numbered={true}
        heading="Events">
          <CalciteNotice width="full" open>
            <div slot="title">Step 3 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem 
        numbered={true}
        heading="Aggregation">
          <CalciteNotice width="full" open>
            <div slot="title">Step 4 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem 
        numbered={true}
        heading="Instance Selection">
          <CalciteNotice width="full" open>
            <div slot="title">Step 5 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
        <CalciteStepperItem 
        numbered={true}
        heading="Summary">
          <CalciteNotice width="full" open>
            <div slot="title">Step 6 Content</div>
          </CalciteNotice>
        </CalciteStepperItem>
      </CalciteStepper>
    </div>
  );
};

export default NewConnection;