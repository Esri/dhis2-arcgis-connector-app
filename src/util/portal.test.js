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
// at module load, so stub it out to keep this seam test focused on fetch.
jest.mock("@arcgis/core/request.js", () => ({ default: jest.fn() }));

import { deleteConnection } from "./portal";

function okJson(data) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
}

const baseArgs = {
  portalUrl: "https://example.com/portal",
  hostingServerUrl: "https://example.com/server",
  owner: "jdoe",
  itemId: "abc123",
  serviceName: "my_connection",
  token: "t0ken",
};

describe("deleteConnection", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("deletes the CDF service, then the portal item, and aggregates results", async () => {
    global.fetch
      .mockReturnValueOnce(okJson({ status: "success" }))
      .mockReturnValueOnce(okJson({ success: true, itemId: "abc123" }));

    const result = await deleteConnection(baseArgs);

    expect(global.fetch).toHaveBeenCalledTimes(2);

    const firstUrl = global.fetch.mock.calls[0][0];
    const secondUrl = global.fetch.mock.calls[1][0];

    // CDF service (admin) is deleted first so the portal item delete can't
    // race a cascade.
    expect(firstUrl).toBe(
      "https://example.com/server/admin/services/my_connection.FeatureServer/delete"
    );
    expect(secondUrl).toBe(
      "https://example.com/portal/sharing/rest/content/users/jdoe/items/abc123/delete"
    );

    expect(result).toEqual({
      service: { status: "success" },
      item: { success: true, itemId: "abc123" },
    });
  });

  it("sends f=json and the token in each POST body", async () => {
    global.fetch
      .mockReturnValueOnce(okJson({ status: "success" }))
      .mockReturnValueOnce(okJson({ success: true }));

    await deleteConnection(baseArgs);

    for (const call of global.fetch.mock.calls) {
      const options = call[1];
      expect(options.method).toBe("POST");
      const params = new URLSearchParams(options.body);
      expect(params.get("f")).toBe("json");
      expect(params.get("token")).toBe("t0ken");
    }
  });

  it("throws and skips the item delete when the CDF service delete fails", async () => {
    global.fetch.mockReturnValueOnce(
      okJson({ status: "error", messages: ["boom"] })
    );

    await expect(deleteConnection(baseArgs)).rejects.toThrow("boom");
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("throws when the portal item delete reports an error", async () => {
    global.fetch
      .mockReturnValueOnce(okJson({ status: "success" }))
      .mockReturnValueOnce(okJson({ error: { message: "no permission" } }));

    await expect(deleteConnection(baseArgs)).rejects.toThrow("no permission");
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
