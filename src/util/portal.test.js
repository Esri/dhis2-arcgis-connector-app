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

// @arcgis/core ships ESM that jest doesn't transform; portal.js only imports it
// at module load, so stub it out to keep this seam test focused on the poll.
jest.mock("@arcgis/core/request.js", () => ({ default: jest.fn() }));

import { pollForServices } from "./portal";

const byTitle = (title) => (service) => service.title === title;
const noWait = jest.fn().mockResolvedValue(undefined);

describe("pollForServices", () => {
  it("returns immediately when the predicate matches on the first pull", async () => {
    const query = jest.fn().mockResolvedValue([{ title: "existing" }]);

    const results = await pollForServices({
      server: "s",
      token: "t",
      predicate: byTitle("existing"),
      query,
      wait: noWait,
    });

    expect(query).toHaveBeenCalledTimes(1);
    expect(noWait).not.toHaveBeenCalled();
    expect(results).toEqual([{ title: "existing" }]);
  });

  it("keeps polling (with a wait between attempts) until the row appears", async () => {
    const wait = jest.fn().mockResolvedValue(undefined);
    const query = jest
      .fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ title: "other" }])
      .mockResolvedValueOnce([{ title: "other" }, { title: "new_layer" }]);

    const results = await pollForServices({
      server: "s",
      token: "t",
      predicate: byTitle("new_layer"),
      attempts: 5,
      query,
      wait,
    });

    expect(query).toHaveBeenCalledTimes(3);
    expect(wait).toHaveBeenCalledTimes(2);
    expect(results.some(byTitle("new_layer"))).toBe(true);
  });

  it("gives up after the bounded number of attempts and returns the last results", async () => {
    const wait = jest.fn().mockResolvedValue(undefined);
    const query = jest.fn().mockResolvedValue([{ title: "other" }]);

    const results = await pollForServices({
      server: "s",
      token: "t",
      predicate: byTitle("never"),
      attempts: 3,
      query,
      wait,
    });

    expect(query).toHaveBeenCalledTimes(3);
    expect(wait).toHaveBeenCalledTimes(2);
    expect(results).toEqual([{ title: "other" }]);
  });

  it("tolerates a query that resolves to null/undefined", async () => {
    const query = jest.fn().mockResolvedValue(undefined);

    const results = await pollForServices({
      server: "s",
      token: "t",
      predicate: byTitle("anything"),
      attempts: 2,
      query,
      wait: noWait,
    });

    expect(results).toEqual([]);
  });
});
