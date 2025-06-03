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
