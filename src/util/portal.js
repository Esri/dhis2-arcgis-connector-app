import esriRequest from "@arcgis/core/request.js";

export async function queryForServices(server, token) {
  const url = `${server}/sharing/rest/search`;
  const query = {
    f: "json",
    token: token,
    q: "typekeywords:'providerCustomData'",
    sortField: "created",
    sortOrder: "desc",
  };

  const response = await esriRequest(url, { query });
  return response.data?.results;
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
