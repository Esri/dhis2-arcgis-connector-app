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

import { NEUTRAL_GLYPH, ASC_GLYPH, DESC_GLYPH, getSortIndicator } from "./sort";

describe("getSortIndicator", () => {
  it("shows a neutral glyph on a sortable column that isn't the active sort", () => {
    const indicator = getSortIndicator("title", {
      key: "created",
      direction: "desc",
    });

    expect(indicator.glyph).toBe(NEUTRAL_GLYPH);
    expect(indicator.direction).toBeNull();
  });

  it("shows an ascending glyph on the active column sorted ascending", () => {
    const indicator = getSortIndicator("owner", {
      key: "owner",
      direction: "asc",
    });

    expect(indicator.glyph).toBe(ASC_GLYPH);
    expect(indicator.direction).toBe("asc");
  });

  it("shows a descending glyph on the active column sorted descending", () => {
    const indicator = getSortIndicator("owner", {
      key: "owner",
      direction: "desc",
    });

    expect(indicator.glyph).toBe(DESC_GLYPH);
    expect(indicator.direction).toBe("desc");
  });

  it("falls back to the neutral glyph when there is no sort config", () => {
    expect(getSortIndicator("title", undefined).glyph).toBe(NEUTRAL_GLYPH);
    expect(getSortIndicator("title", {}).glyph).toBe(NEUTRAL_GLYPH);
  });
});
