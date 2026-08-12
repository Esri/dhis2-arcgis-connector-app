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

import { useDataQuery } from "@dhis2/app-runtime";

import { evaluateGeometrySelection } from "../util/geometry";

const GEO_FEATURES_QUERY = {
  geoFeatures: {
    resource: "geoFeatures",
    params: ({ ou }) => ({ ou: `ou:${ou}` }),
  },
};

// Resolves the geometry validity of the current org-unit selection from DHIS2
// geoFeatures, exposing the single block/warn/allow flag the wizard consumes.
const useOrgUnitGeometry = (selectedOrgUnits = []) => {
  const ids = selectedOrgUnits.map((orgUnit) => orgUnit.id);
  const enabled = ids.length > 0;

  const { loading, error, data } = useDataQuery(GEO_FEATURES_QUERY, {
    lazy: !enabled,
    variables: { ou: ids.join(";") },
  });

  const geoFeatures = data?.geoFeatures ?? [];

  return {
    loading: enabled && loading,
    error,
    ...evaluateGeometrySelection({ geoFeatures, selectedCount: ids.length }),
  };
};

export default useOrgUnitGeometry;
