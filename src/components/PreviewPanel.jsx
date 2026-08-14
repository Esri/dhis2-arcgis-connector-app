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

import React, { useEffect, useRef } from "react";
import i18n from "@dhis2/d2-i18n";
import styled from "styled-components";
import { CalciteNotice } from "@esri/calcite-components-react";

import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";
import "@arcgis/core/assets/esri/themes/light/main.css";

const Container = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.$horizontal ? "row" : "column")};
  gap: 1rem;
  flex: 1;
  min-height: 0;
`;

const MapSurface = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 260px;
  border: 1px solid var(--calcite-ui-border-3);
`;

const TableSurface = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 220px;
  border: 1px solid var(--calcite-ui-border-3);
`;

// Renders the real, just-created feature service: a map of the layer plus its
// attribute table. Geometry-less Connections show the table only, with a note.
const PreviewPanel = ({ serviceUrl, hasGeometry }) => {
  const mapRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    if (!serviceUrl || !tableRef.current) {
      return undefined;
    }

    const layer = new FeatureLayer({ url: `${serviceUrl}/0` });

    let view;
    if (hasGeometry && mapRef.current) {
      view = new MapView({
        container: mapRef.current,
        map: new Map({ basemap: "gray-vector", layers: [layer] }),
      });
      view
        .when(() => layer.when())
        .then(() => {
          if (layer.fullExtent) {
            return view.goTo(layer.fullExtent);
          }
          return undefined;
        })
        .catch(() => {});
    }

    const table = new FeatureTable({
      layer,
      view,
      container: tableRef.current,
    });

    return () => {
      table.destroy();
      view?.destroy();
      layer.destroy();
    };
  }, [serviceUrl, hasGeometry]);

  return (
    <Container $horizontal={hasGeometry}>
      {hasGeometry ? (
        <MapSurface ref={mapRef} />
      ) : (
        <CalciteNotice open kind="info" icon scale="m">
          <div slot="title">{i18n.t("Table-only preview")}</div>
          <div slot="message">
            {i18n.t(
              "The selected organisation units have no geometry, so this preview shows the attribute table only with no map."
            )}
          </div>
        </CalciteNotice>
      )}
      <TableSurface ref={tableRef} />
    </Container>
  );
};

export default PreviewPanel;
