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
  sanitizeName,
  applyNameSuffix,
  suggestConnectionName,
  suggestDescription,
} from "./suggestions";

describe("sanitizeName", () => {
  it("replaces disallowed characters with underscores", () => {
    expect(sanitizeName("Sierra Leone")).toBe("Sierra_Leone");
    expect(sanitizeName("a/b\\c")).toBe("a_b_c");
  });

  it("collapses repeats and trims leading/trailing underscores", () => {
    expect(sanitizeName("Malaria (confirmed)")).toBe("Malaria_confirmed");
    expect(sanitizeName("  _x_  ")).toBe("x");
  });
});

describe("applyNameSuffix", () => {
  it("returns the base unchanged for the first occurrence", () => {
    expect(applyNameSuffix("Malaria_Bo_2020", 1)).toBe("Malaria_Bo_2020");
  });

  it("appends _2, _3 for later occurrences", () => {
    expect(applyNameSuffix("Malaria_Bo_2020", 2)).toBe("Malaria_Bo_2020_2");
    expect(applyNameSuffix("Malaria_Bo_2020", 3)).toBe("Malaria_Bo_2020_3");
  });

  it("keeps the suffixed name within the 50-char cap", () => {
    const base = "x".repeat(49);
    const result = applyNameSuffix(base, 2);
    expect(result.length).toBeLessThanOrEqual(50);
    expect(result.endsWith("_")).toBe(false);
  });
});

describe("suggestConnectionName", () => {
  it("joins first data item, org unit, and period", () => {
    expect(
      suggestConnectionName({
        dataItems: [{ name: "Malaria" }],
        orgUnits: [{ name: "Sierra Leone" }],
        periods: [{ name: "2020" }],
      })
    ).toBe("Malaria_Sierra_Leone_2020");
  });

  it("appends a short count when more than one item is selected", () => {
    expect(
      suggestConnectionName({
        dataItems: [{ name: "Malaria" }, { name: "TB" }],
        orgUnits: [{ name: "Bo" }],
        periods: [{ name: "2020" }, { name: "2021" }],
      })
    ).toBe("Malaria_Bo_2020_plus2");
  });

  it("falls back to displayName", () => {
    expect(
      suggestConnectionName({
        dataItems: [{ displayName: "ANC 1st visit" }],
        orgUnits: [{ displayName: "Bo" }],
        periods: [{ displayName: "2020" }],
      })
    ).toBe("ANC_1st_visit_Bo_2020");
  });

  it("returns an empty string for an empty selection", () => {
    expect(suggestConnectionName({})).toBe("");
  });

  it("caps the name at 50 characters without a trailing underscore", () => {
    const result = suggestConnectionName({
      dataItems: [{ name: "x".repeat(49) }],
      orgUnits: [{ name: "Z" }],
    });
    expect(result.length).toBeLessThanOrEqual(50);
    expect(result.endsWith("_")).toBe(false);
  });
});

describe("suggestDescription", () => {
  it("reads naturally for a single selection", () => {
    expect(
      suggestDescription({
        dataItems: [{ name: "Malaria" }],
        orgUnits: [{ name: "Sierra Leone" }],
        periods: [{ name: "2020" }],
      })
    ).toBe("Malaria in Sierra Leone for 2020.");
  });

  it("summarizes additional items with a count", () => {
    expect(
      suggestDescription({
        dataItems: [{ name: "Malaria" }, { name: "TB" }],
        orgUnits: [{ name: "Sierra Leone" }],
        periods: [{ name: "2020" }],
      })
    ).toBe("Malaria and 1 more in Sierra Leone for 2020.");
  });

  it("describes a geometry/table-only selection with no data items", () => {
    expect(
      suggestDescription({
        orgUnits: [{ name: "Sierra Leone" }],
      })
    ).toBe("Organisation unit data in Sierra Leone.");
  });

  it("returns an empty string for an empty selection", () => {
    expect(suggestDescription({})).toBe("");
  });
});
