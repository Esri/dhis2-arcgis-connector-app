# DHIS2 to ArcGIS Connector App

This repository contains a DHIS2 webapp that creates a near-real time connection between DHIS2 data and ArcGIS Enterprise using custom data feeds. The connection allows for seamless data sharing, analysis, and visualization.

To use this app, you will need a DHIS2 instance and an ArcGIS named user account in ArcGIS Enterprise. For additional information on ArcGIS access, DHIS2 users can explore Esri’s offerings [here](https://storymaps.arcgis.com/stories/b21a12d056e14186a27424cef67965de).

This app can be accessed through the [DHIS2 App Hub](https://apps.dhis2.org/).

## Documentation and Use

See the documentation about implementing the app [DHIS2 to ArcGIS Connector Documentation](https://github.com/ArcGIS/dhis2-arcgis-connector-app/blob/main/DHIS2_ArcGIS_Connector_UserManual.pdf).

### Prerequisites

Before you can get started with the DHIS2 Connector App, you must have access to the following

1. ArcGIS Enterprise Base Deployment (11.3 or higher)
2. Access to the hosting server of ArcGIS Enterprise Base Deployment as an admin
3. Deployed the [DHIS2 Custom Data Feed](https://github.com/ArcGIS/dhis2-custom-data-feeds/tree/main) to your ArcGIS Enterprise
4. DHIS2 Admin access to add the app from the DHIS2 App Hub

### ArcGIS

ArcGIS is a comprehensive geographic information system (GIS) developed by Esri that enables users to create, manage, analyze, and share spatial data. ArcGIS delivers industry-leading mapping and analytics to your infrastructure and the cloud. It provides powerful tools for mapping and visualizing data, uncovering patterns, and making data-driven decisions across sectors such as health, environment, urban planning, logistics, and more.

ArcGIS includes a suite of products that work across desktop, web, mobile, and enterprise environments—such as ArcGIS Online, ArcGIS Pro, and ArcGIS Enterprise—allowing users to build interactive maps, dashboards, and geospatial applications. Whether used for field data collection, real-time monitoring, or predictive modeling, ArcGIS supports evidence-based planning and collaboration with location intelligence at its core.

### ArcGIS Enterprise

ArcGIS Enterprise is Esri’s comprehensive geospatial platform designed for organizations that need to manage, analyze, and share spatial data securely within their own IT environment. It includes powerful tools for mapping, data visualization, spatial analytics, and collaboration. Built on a scalable architecture, ArcGIS Enterprise supports advanced workflows, real-time data integration, and customizable apps—all while maintaining control over data privacy, infrastructure, and user access.

This app allows DHIS2 users to leverage their data in the ArcGIS system using a direct connection to an ArcGIS Enterprise instance that maintains data hosting in their DHIS2 instance. The app uses a no-code interface to allow for seamless interoperability. The connection is formed through [Custom Data Feeds](https://enterprise.arcgis.com/en/server/11.1/develop/linux/custom-data-feeds.htm). View the GitHub repository for the [DHIS2 Custom Data Feeds](https://github.com/ArcGIS/dhis2-custom-data-feeds) for more information.

### DHIS2 (District Health Information Software 2)

DHIS2 is a free and open-source platform for collecting, reporting, analyzing and disseminating aggregate and individual-level data. Most commonly used for health data, DHIS2 can be implemented for individual health programs or as a national-scale health management information system. Officially recognized as a Digital Public Good, DHIS2 is also used in sectors such as education, logistics, sanitation, and land management, among others.

DHIS2 is widely used globally, particularly in low-resource settings, to strengthen health and other information systems and improve data-driven decision-making. Its open-source nature, flexibility, and scalability make it a valuable tool for managing data and improving outcomes. Looking ahead, the use cases of DHIS2 are expanding to education, land administration, and logistics. For full DHIS API Documentation and use please visit: ([https://docs.dhis2.org/en/home.html](https://docs.dhis2.org/en/home.html))

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing

Copyright 2025 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt](https://github.com/ArcGIS/dhis2-arcgis-connector-app/blob/main/LICENSE.txt) file.
