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

import { WIZARD_STEP_COUNT, isFinalStep, canAdvanceStep } from "./wizardSteps";

describe("isFinalStep", () => {
  it("is true only on the last step", () => {
    expect(isFinalStep(WIZARD_STEP_COUNT)).toBe(true);
    expect(isFinalStep(WIZARD_STEP_COUNT - 1)).toBe(false);
    expect(isFinalStep(1)).toBe(false);
  });
});

describe("canAdvanceStep", () => {
  it("gates the organisation-unit step on the single geometry-type flag", () => {
    expect(canAdvanceStep(1, { canLeaveOrgUnitStep: false })).toBe(false);
    expect(canAdvanceStep(1, { canLeaveOrgUnitStep: true })).toBe(true);
  });

  it("gates the data step on at least one data item", () => {
    expect(canAdvanceStep(2, { hasDataItems: false })).toBe(false);
    expect(canAdvanceStep(2, { hasDataItems: true })).toBe(true);
  });

  it("leaves later steps ungated", () => {
    expect(canAdvanceStep(3, {})).toBe(true);
  });

  it("defaults every gate to blocked when no flags are supplied", () => {
    expect(canAdvanceStep(1)).toBe(false);
    expect(canAdvanceStep(2)).toBe(false);
  });
});
