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

import {
  deriveGeometryTypes,
  isMixedGeometry,
  evaluateGeometrySelection,
} from "./geometry";

// DHIS2 geoFeatures `ty`: 1 = Point, 2 = Polygon.
const point = (id) => ({ id, ty: 1 });
const polygon = (id) => ({ id, ty: 2 });

describe("deriveGeometryTypes", () => {
  it("returns an empty list when there are no features", () => {
    expect(deriveGeometryTypes([])).toEqual([]);
  });

  it("resolves Point and Polygon from the geoFeatures `ty` code", () => {
    expect(deriveGeometryTypes([point("a"), point("b")])).toEqual(["Point"]);
    expect(deriveGeometryTypes([polygon("a")])).toEqual(["Polygon"]);
  });

  it("returns each distinct type once, deterministically ordered", () => {
    expect(
      deriveGeometryTypes([polygon("a"), point("b"), point("c"), polygon("d")])
    ).toEqual(["Point", "Polygon"]);
  });

  it("ignores features that carry no geometry type", () => {
    expect(
      deriveGeometryTypes([point("a"), { id: "b" }, { id: "c", ty: 0 }])
    ).toEqual(["Point"]);
  });
});

describe("isMixedGeometry", () => {
  it("is true when more than one geometry type is present", () => {
    expect(isMixedGeometry([point("a"), polygon("b")])).toBe(true);
  });

  it("is false for a single geometry type", () => {
    expect(isMixedGeometry([point("a"), point("b")])).toBe(false);
  });

  it("is false when no feature has geometry", () => {
    expect(isMixedGeometry([{ id: "a" }, { id: "b" }])).toBe(false);
  });
});

describe("evaluateGeometrySelection", () => {
  it("blocks a mixed selection and names the conflicting types", () => {
    const result = evaluateGeometrySelection({
      geoFeatures: [point("a"), polygon("b")],
      selectedCount: 2,
    });
    expect(result.valid).toBe(false);
    expect(result.status).toBe("mixed");
    expect(result.geometryTypes).toEqual(["Point", "Polygon"]);
  });

  it("allows a single-type selection where every unit has geometry", () => {
    const result = evaluateGeometrySelection({
      geoFeatures: [point("a"), point("b")],
      selectedCount: 2,
    });
    expect(result.valid).toBe(true);
    expect(result.status).toBe("ok");
    expect(result.geometryTypes).toEqual(["Point"]);
  });

  it("warns but allows when only some selected units have geometry", () => {
    const result = evaluateGeometrySelection({
      geoFeatures: [point("a")],
      selectedCount: 3,
    });
    expect(result.valid).toBe(true);
    expect(result.status).toBe("partial");
    expect(result.geometryTypes).toEqual(["Point"]);
  });

  it("allows a table-only selection when no unit has geometry", () => {
    const result = evaluateGeometrySelection({
      geoFeatures: [],
      selectedCount: 2,
    });
    expect(result.valid).toBe(true);
    expect(result.status).toBe("none");
    expect(result.geometryTypes).toEqual([]);
  });
});
