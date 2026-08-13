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

// Number of steps in the New Connection wizard. The last step swaps the Next
// control for the Create Connection action.
export const WIZARD_STEP_COUNT = 4;

export const isFinalStep = (step) => step >= WIZARD_STEP_COUNT;

// Whether the author may advance past the given (1-based) wizard step. Mirrors
// the per-step gates already enforced on the stepper items:
// - step 1 (organisation units) consumes #42's single geometry-type flag,
// - step 2 (data) needs at least one data item,
// - later steps have no gate.
export const canAdvanceStep = (
  step,
  { canLeaveOrgUnitStep = false, hasDataItems = false } = {}
) => {
  switch (step) {
    case 1:
      return Boolean(canLeaveOrgUnitStep);
    case 2:
      return Boolean(hasDataItems);
    default:
      return true;
  }
};
