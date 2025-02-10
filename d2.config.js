const config = {
  type: "app",
  title: "DHIS2 ArcGIS Connector",
  name: "DHIS2 ArcGIS Connector",
  description: "Connect your DHIS2 to ArcGIS",
  author: "Esri",
  dataStoreNamespace: "dhis2-arcgis-app-ns",
  minDHIS2Version: "2.40.0",
  entryPoints: {
    app: "./src/App.jsx",
  },
};

module.exports = config;
