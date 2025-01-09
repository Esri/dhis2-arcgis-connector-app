// import { useNavigate } from "react-router-dom";
import { OrganisationUnitTree } from "@dhis2/ui";
// import exploreStore from "../../store/exploreStore";
import useOrgUnitRoots from "../hooks/useOrgUnitRoots";
import { useState } from "react";

const styles = {
  container: {
    overflow: 'hidden',
  },
  orgUnitTree: {
    overflowY: 'auto',
    paddingLeft: '10px',
    paddingBottom: '10px',
  },
};

const OrgUnitTree = () => {
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
  const onChange = (orgUnit) => {
    console.log(orgUnit);
    setSelectedRoots(orgUnit.selected);
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