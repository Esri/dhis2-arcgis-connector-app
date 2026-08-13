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

// The org units the tree is scoped to: prefer the user's analytics data-view
// org units, falling back to their data-capture org units.
export const pickUserRoots = (me = {}) => {
  const dataView = me?.dataViewOrganisationUnits ?? [];
  const dataCapture = me?.organisationUnits ?? [];
  return dataView.length ? dataView : dataCapture;
};

const LEVEL_PREFIX = "LEVEL-";
const OU_GROUP_PREFIX = "OU_GROUP-";

const isLevel = (id) => id.startsWith(LEVEL_PREFIX);
const isGroup = (id) => id.startsWith(OU_GROUP_PREFIX);
// An explicit org unit or dynamic keyword (e.g. USER_ORGUNIT) can serve as the
// boundary a level or group is evaluated under; a level/group id cannot.
const isBoundary = (id) => !isLevel(id) && !isGroup(id);

// Turns the raw org-unit selection into the resolved `ou` dimension ids used by
// both the geoFeatures pre-check and the created service. A level or group only
// resolves against a boundary ancestor, so when the author picked a level/group
// but checked no explicit unit, the user's roots are injected as that boundary.
export const resolveOuDimension = (selection = [], userRoots = []) => {
  const ids = selection.map((item) => item.id).filter(Boolean);

  const hasLevelOrGroup = ids.some((id) => isLevel(id) || isGroup(id));
  const hasBoundary = ids.some((id) => isBoundary(id));

  if (!hasLevelOrGroup || hasBoundary) {
    return ids;
  }

  const rootIds = userRoots.map((root) => root.id).filter(Boolean);
  return [...new Set([...rootIds, ...ids])];
};
