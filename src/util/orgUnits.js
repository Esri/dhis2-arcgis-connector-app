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
