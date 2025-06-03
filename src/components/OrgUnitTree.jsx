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

// import { useNavigate } from "react-router-dom";
import { OrganisationUnitTree } from "@dhis2/ui";
// import exploreStore from "../../store/exploreStore";
import useOrgUnitRoots from "../hooks/useOrgUnitRoots";
import { useState } from "react";

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

const OrgUnitTree = ({ onChange }) => {
  // const { orgUnit } = exploreStore();
  const { roots } = useOrgUnitRoots();
  // const navigate = useNavigate();
  // const path = orgUnit?.path.split("/");

  // TODO: Sort out where/why initiallyExpanded ought be used
  // const initiallyExpanded =
  //   path?.length > 2
  //     ? [path.slice(0, -1).join("/")]
  //     : roots?.map((r) => r.path);

  // const selected = orgUnit?.path ? [orgUnit.path] : [];

  // TODO: Change this to fit our application (map through them and grab id's)
  const handleOnChange = (orgUnit) => {
    console.log(orgUnit);
    setSelectedRoots(orgUnit.selected);
    onChange(orgUnit.selected);
  };

  const [selectedRoots, setSelectedRoots] = useState([]);

  return roots ? (
    <div style={styles.container}>
      <div style={styles.orgUnitTree}>
        <OrganisationUnitTree
          roots={roots.map((r) => r.id)}
          selected={selectedRoots}
          onChange={onChange}
        />
      </div>
    </div>
  ) : null;
};

export default OrgUnitTree;
