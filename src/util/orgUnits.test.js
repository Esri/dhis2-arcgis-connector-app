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

import { pickUserRoots, resolveOuDimension } from "./orgUnits";

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

describe("resolveOuDimension", () => {
  const roots = [{ id: "ROOT1" }, { id: "ROOT2" }];

  it("returns explicit unit ids unchanged", () => {
    expect(resolveOuDimension([{ id: "aaa" }, { id: "bbb" }], roots)).toEqual([
      "aaa",
      "bbb",
    ]);
  });

  it("injects the user's roots as the boundary for a level with no explicit unit", () => {
    expect(resolveOuDimension([{ id: "LEVEL-lvl1" }], roots)).toEqual([
      "ROOT1",
      "ROOT2",
      "LEVEL-lvl1",
    ]);
  });

  it("injects roots for a group with no explicit boundary", () => {
    expect(resolveOuDimension([{ id: "OU_GROUP-grp1" }], roots)).toEqual([
      "ROOT1",
      "ROOT2",
      "OU_GROUP-grp1",
    ]);
  });

  it("does not inject roots when the author checked an explicit boundary unit", () => {
    expect(
      resolveOuDimension([{ id: "district1" }, { id: "LEVEL-lvl1" }], roots)
    ).toEqual(["district1", "LEVEL-lvl1"]);
  });

  it("treats a dynamic user-org-unit as its own boundary", () => {
    expect(
      resolveOuDimension([{ id: "USER_ORGUNIT" }, { id: "LEVEL-lvl1" }], roots)
    ).toEqual(["USER_ORGUNIT", "LEVEL-lvl1"]);
  });

  it("does not duplicate a root that is also explicitly present", () => {
    expect(
      resolveOuDimension([{ id: "ROOT1" }, { id: "LEVEL-lvl1" }], roots)
    ).toEqual(["ROOT1", "LEVEL-lvl1"]);
  });

  it("returns an empty array for an empty selection", () => {
    expect(resolveOuDimension([], roots)).toEqual([]);
  });
});
