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

import { pickUserRoots } from "./orgUnits";

describe("pickUserRoots", () => {
  const dataView = [{ id: "dv1" }, { id: "dv2" }];
  const dataCapture = [{ id: "dc1" }];

  it("prefers the user's analytics data-view org units", () => {
    expect(
      pickUserRoots({
        dataViewOrganisationUnits: dataView,
        organisationUnits: dataCapture,
      })
    ).toEqual(dataView);
  });

  it("falls back to data-capture org units when the data view is empty", () => {
    expect(
      pickUserRoots({
        dataViewOrganisationUnits: [],
        organisationUnits: dataCapture,
      })
    ).toEqual(dataCapture);
  });

  it("returns an empty array when the user has neither", () => {
    expect(pickUserRoots({})).toEqual([]);
    expect(pickUserRoots()).toEqual([]);
  });
});
