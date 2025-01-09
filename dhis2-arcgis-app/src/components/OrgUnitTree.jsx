// Brought in existing code to start this off. 
// TODO: Need to update the code to work for the Create New Connection page.
import { useNavigate } from "react-router-dom";
import { OrganisationUnitTree } from "@dhis2/ui";
import exploreStore from "../../store/exploreStore";
import useOrgUnitRoots from "../../hooks/useOrgUnitRoots";

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
  const { orgUnit } = exploreStore();
  const { roots } = useOrgUnitRoots();
  const navigate = useNavigate();
  const path = orgUnit?.path.split("/");

  // TODO: Sort out where/why initiallyExpanded ought be used
  const initiallyExpanded =
    path?.length > 2
      ? [path.slice(0, -1).join("/")]
      : roots?.map((r) => r.path);

  const selected = orgUnit?.path ? [orgUnit.path] : [];

  const onChange = (orgUnit) => navigate(`/explore/${orgUnit.id}`);

  return roots ? (
    <div style={styles.container}>
      <div style={styles.orgUnitTree}>
        <OrganisationUnitTree
          roots={roots.map((r) => r.id)}
          selected={selected}
          onChange={onChange}
          singleSelection={true}
        />
      </div>
    </div>
  ) : null;
};

export default OrgUnitTree;