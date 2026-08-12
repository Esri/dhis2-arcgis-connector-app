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

import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { CustomDataProvider } from "@dhis2/app-runtime";

import useOrgUnitGeometry from "./useOrgUnitGeometry";

// Renders the hook against fixture geoFeatures served through the
// CustomDataProvider seam and returns the settled "valid|status|types" string.
const Probe = ({ selected }) => {
  const { loading, valid, status, geometryTypes } =
    useOrgUnitGeometry(selected);
  return (
    <div data-testid="out">
      {loading ? "loading" : `${valid}|${status}|${geometryTypes.join(",")}`}
    </div>
  );
};

const evaluate = async (geoFeatures, selected) => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  await act(async () => {
    ReactDOM.render(
      <CustomDataProvider data={{ geoFeatures }}>
        <Probe selected={selected} />
      </CustomDataProvider>,
      container
    );
  });

  const read = () => container.querySelector('[data-testid="out"]').textContent;
  for (let i = 0; i < 50 && read() === "loading"; i++) {
    // flush the CustomDataProvider promise (micro + macro task) and the
    // resulting state update
    // eslint-disable-next-line no-await-in-loop
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }

  const text = read();
  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
  container.remove();
  return text;
};

const point = (id) => ({ id, ty: 1 });
const polygon = (id) => ({ id, ty: 2 });
const sel = (...ids) => ids.map((id) => ({ id }));

it("blocks a mixed selection through the provider seam", async () => {
  const text = await evaluate(
    [point("a"), polygon("b")],
    sel("a", "b")
  );
  expect(text).toBe("false|mixed|Point,Polygon");
});

it("allows a single-type selection where every unit has geometry", async () => {
  const text = await evaluate([point("a"), point("b")], sel("a", "b"));
  expect(text).toBe("true|ok|Point");
});

it("warns but allows when only some selected units have geometry", async () => {
  const text = await evaluate([point("a")], sel("a", "b", "c"));
  expect(text).toBe("true|partial|Point");
});

it("allows a table-only selection when no unit has geometry", async () => {
  const text = await evaluate([], sel("a", "b"));
  expect(text).toBe("true|none|");
});
