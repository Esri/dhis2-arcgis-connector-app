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

import esriRequest from "@arcgis/core/request.js";

export async function queryForServices(server, token) {
  const url = `${server}/sharing/rest/search`;
  const query = {
    f: "json",
    token: token,
    q: "typekeywords:'providerCustomData'",
    sortField: "created",
    sortOrder: "desc",
    num: 100,
  };

  const response = await esriRequest(url, { query });
  return response.data?.results;
}

// Bounded poll that re-pulls the Connections list until `predicate` matches a
// result (covering ArcGIS search-index lag after a create) or attempts run out.
// Returns the most recent results either way. `query` and `wait` are injectable
// for testing.
export async function pollForServices({
  server,
  token,
  predicate,
  attempts = 5,
  delayMs = 1500,
  query = queryForServices,
  wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
}) {
  let results = [];
  for (let attempt = 0; attempt < attempts; attempt++) {
    results = (await query(server, token)) || [];
    if (results.some(predicate)) {
      return results;
    }
    if (attempt < attempts - 1) {
      await wait(delayMs);
    }
  }
  return results;
}

export async function getUserInfo(portalUrl, userId, token) {
  const userInfoUrl = `${portalUrl}/sharing/rest/community/users/${userId}?f=json&token=${token}`;
  const userInfoResponse = await fetch(userInfoUrl);
  const userInfo = await userInfoResponse.json();

  return userInfo;
}

export async function getPortalHostingServer(portalUrl, token) {
  const portalPropertiesUrl = `${portalUrl}/sharing/rest/portals/self/servers?f=json&token=${token}`;
  const portalPropertiesResponse = await fetch(portalPropertiesUrl);
  const portalProperties = await portalPropertiesResponse.json();
  const hostingServer = portalProperties.servers.find(
    (server) => server.serverRole === "HOSTING_SERVER"
  );
  return hostingServer;
}

export async function createService(hostingServerUrl, body) {
  const url = `${hostingServerUrl}/admin/services/createService`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  });
  const data = await response.json();
  return data;
}

export async function isServiceNameAvailable(server, serviceName, token) {
  const url = `${server}/sharing/rest/search`;
  const query = {
    f: "json",
    token: token,
    filter: `type: "Feature Service" AND title:"${serviceName}"`,
    // q: `title:'${serviceName}'`,
    sortField: "title",
    sortOrder: "desc",
  };

  const response = await esriRequest(url, { query });
  return response.data?.results && response.data.results.length > 0
    ? false
    : true;
}

async function postForm(url, token) {
  const body = new URLSearchParams({ f: "json", token }).toString();
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return response.json();
}

export async function deleteCdfService(
  hostingServerUrl,
  serviceName,
  token,
  serviceType = "FeatureServer"
) {
  const url = `${hostingServerUrl}/admin/services/${serviceName}.${serviceType}/delete`;
  const data = await postForm(url, token);
  if (data?.status === "error") {
    throw new Error(
      data.messages?.join("; ") || "Failed to delete the CDF service."
    );
  }
  return data;
}

export async function deletePortalItem(portalUrl, owner, itemId, token) {
  const url = `${portalUrl}/sharing/rest/content/users/${owner}/items/${itemId}/delete`;
  const data = await postForm(url, token);
  if (data?.error) {
    throw new Error(data.error.message || "Failed to delete the portal item.");
  }
  return data;
}

// Removes both ArcGIS artifacts behind a Connection: the CDF service (admin) is
// deleted first so the portal item delete can't race a cascade. Reused by both
// Remove-a-Connection and Preview's Discard.
export async function deleteConnection({
  portalUrl,
  hostingServerUrl,
  owner,
  itemId,
  serviceName,
  token,
  serviceType = "FeatureServer",
}) {
  const service = await deleteCdfService(
    hostingServerUrl,
    serviceName,
    token,
    serviceType
  );
  const item = await deletePortalItem(portalUrl, owner, itemId, token);
  return { service, item };
}
