import React from "react";
import OrgUnitTree from "../components/OrgUnitTree";
import Breadcrumb from "../components/NewConnectBreadcrumb";

const steps = [
  "Organisation units",
  "Period",
  "Events",
  "Aggregation",
  "Instance Selection",
  "Summary",
];

const NewConnection = () => {
  return (
  <div style={{ padding: "1rem", height: "100vh" }}>
    <Breadcrumb steps={steps} currentStep={currentStep} />
    <OrgUnitTree />
    </div>
  );
};

export default NewConnection;
