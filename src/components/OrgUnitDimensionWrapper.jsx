import React, { useState } from "react";
import useOrgUnitRoots from "../hooks/useOrgUnitRoots";
import { OrgUnitDimension } from "@dhis2/analytics";
const styles = {
  container: {
    overflow: "hidden",
  },
  orgUnitTree: {
    overflowY: "auto",
    paddingLeft: "10px",
    paddingBottom: "10px",
  },
};

const OrgUnitDimensionWrapper = ({ onChange }) => {
  const { roots } = useOrgUnitRoots();

  const [selectedRoots, setSelectedRoots] = useState([]);

  const handleOnSelect = (orgUnit) => {
    console.log(orgUnit);
    setSelectedRoots(orgUnit.items);
    onChange(orgUnit.items);
  };

  return roots ? (
    <div style={styles.container}>
      <div style={styles.orgUnitTree}>
        <OrgUnitDimension
          roots={roots.map((r) => r.id)}
          selected={selectedRoots}
          onSelect={handleOnSelect}
        />
      </div>
    </div>
  ) : null;
};

export default OrgUnitDimensionWrapper;
