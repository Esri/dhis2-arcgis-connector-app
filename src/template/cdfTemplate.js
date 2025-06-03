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

export const cdfTemplate = {
  token: null,
  f: "json",
  service: {
    serviceName: null,
    type: "FeatureServer",
    description: "here is a sample description",
    capabilities: "Query",
    provider: "CUSTOMDATA",
    clusterName: "default",
    minInstancesPerNode: 0,
    maxInstancesPerNode: 0,
    instancesPerContainer: 1,
    maxWaitTime: 60,
    maxStartupTime: 300,
    maxIdleTime: 1800,
    maxUsageTime: 600,
    loadBalancing: "ROUND_ROBIN",
    isolationLevel: "HIGH",
    configuredState: "STARTED",
    recycleInterval: 24,
    recycleStartTime: "00:00",
    keepAliveInterval: 1800,
    private: false,
    isDefault: false,
    maxUploadFileSize: 0,
    allowedUploadFileTypes: "",
    properties: { disableCaching: "true" },
    jsonProperties: {
      customDataProviderInfo: {
        dataProviderName: "analytics",
        dataProviderHost: "",
        dataProviderId: "",
      },
    },
    extensions: [],
    frameworkProperties: {},
    datasets: [],
  },
};
