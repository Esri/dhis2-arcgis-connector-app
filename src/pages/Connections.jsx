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

import React, { useEffect, useState, useMemo } from "react";

import styled from "styled-components";

import i18n from "@dhis2/d2-i18n";

import { useAuth } from "../contexts/AuthContext";
import { useAppAlert, ALERT_TYPES } from "../hooks/useAppAlert";
import {
  CalciteTable,
  CalciteTableHeader,
  CalciteTableRow,
  CalciteTableCell,
  CalciteButton,
  CalciteDialog,
  CalcitePagination,
} from "@esri/calcite-components-react";

import { useNavigate } from "react-router-dom";
import { queryForServices, deleteConnection } from "../util/portal";
import { getSortIndicator } from "../util/sort";

const StyledContainer = styled.div`
  padding: 1rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledPageHeader = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

const Connections = () => {
  const navigate = useNavigate();

  const { userCredential, userInformation, hostingServerProperties } =
    useAuth();
  const { showAlert } = useAppAlert();

  const [services, setServices] = useState([]);

  const [sortConfig, setSortConfig] = useState({
    key: "created",
    direction: "desc",
  });

  // The Connection awaiting delete confirmation, and the id being deleted.
  const [connectionToDelete, setConnectionToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function fetchServices() {
    const response = await queryForServices(
      userCredential.server,
      userCredential.token
    );
    console.log(response);
    setServices(response);
  }

  useEffect(() => {
    if (userCredential) {
      fetchServices();
    }
  }, [userCredential]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return [...services];

    const { key, direction } = sortConfig;
    return [...services].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      // Handle null or undefined
      if (aVal == null) aVal = "";
      if (bVal == null) bVal = "";

      // Date comparison
      if (key === "created" || key === "modified") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      // Number comparison
      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      // String comparison
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      const cmp = aVal.localeCompare(bVal);
      return direction === "asc" ? cmp : -cmp;
    });
  }, [services, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortGlyph = (key) => getSortIndicator(key, sortConfig).glyph;

  // The CDF service name lives in the item URL (.../rest/services/<name>/FeatureServer).
  const getServiceName = (service) => {
    const afterServices = service.url?.split("/rest/services/")[1];
    return afterServices ? afterServices.split("/")[0] : service.name;
  };

  const isOwnedByCurrentUser = (service) =>
    userInformation?.username != null &&
    userInformation.username === service.owner;

  const handleConfirmDelete = async () => {
    const service = connectionToDelete;
    if (!service) return;

    setDeletingId(service.id);
    try {
      await deleteConnection({
        portalUrl: userCredential.server,
        hostingServerUrl: hostingServerProperties.url,
        owner: service.owner,
        itemId: service.id,
        serviceName: getServiceName(service),
        token: userCredential.token,
      });
      setServices((prev) => prev.filter((s) => s.id !== service.id));
      setConnectionToDelete(null);
      showAlert({
        title: i18n.t("Connection removed"),
        message: i18n.t(
          "The Connection and its ArcGIS artifacts were permanently deleted."
        ),
        type: ALERT_TYPES.SUCCESS,
      });
    } catch (err) {
      console.error("Error removing connection", err);
      showAlert({
        title: i18n.t("Error removing Connection"),
        autoClose: false,
        message: err?.message || String(err),
        type: ALERT_TYPES.DANGER,
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <StyledContainer>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <StyledPageHeader>{i18n.t("Connections")}</StyledPageHeader>
        <CalciteButton
          style={{ marginLeft: "1rem" }}
          scale="l"
          iconStart="add-layer-service"
          onClick={() => {
            navigate("/add-connection");
          }}
        >
          {i18n.t("Add New Connection")}
        </CalciteButton>
      </div>
      <div
        style={{
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        {i18n.t("View all existing connections")}
      </div>
      <div>
        {i18n.t(
          "Connections are live feeds to your DHIS2 data. The data remains in DHIS2. You can remove Connections you own directly from this page."
        )}
      </div>

      {services.length > 0 && (
        <CalciteTable
          style={{
            maxHeight: "calc(75vh - 200px)",
          }}
          numbered
          interactionMode="static"
          striped
        >
          <CalciteTableRow
            slot="table-header"
            alignment="center"
            // sticky header
            style={{ position: "sticky", top: 0, zIndex: 1 }}
          >
            <CalciteTableHeader
              heading="Title"
              style={{ cursor: "pointer" }}
              onClick={() => requestSort("title")}
              description={getSortGlyph("title")}
            ></CalciteTableHeader>
            <CalciteTableHeader
              heading="Description"
              onClick={() => requestSort("description")}
              style={{ cursor: "pointer" }}
              description={getSortGlyph("description")}
            ></CalciteTableHeader>
            {/* <CalciteTableHeader heading="URL"></CalciteTableHeader> */}
            <CalciteTableHeader
              heading="Created By"
              onClick={() => requestSort("owner")}
              style={{ cursor: "pointer" }}
              description={getSortGlyph("owner")}
            ></CalciteTableHeader>
            <CalciteTableHeader
              style={{ cursor: "pointer" }}
              onClick={() => requestSort("created")}
              description={getSortGlyph("created")}
              heading="Created On"
            ></CalciteTableHeader>
            <CalciteTableHeader
              heading="View in ArcGIS"
              alignment="center"
            ></CalciteTableHeader>
            <CalciteTableHeader
              heading="Remove"
              alignment="center"
            ></CalciteTableHeader>
          </CalciteTableRow>

          {sortedData.map((service) => (
            <CalciteTableRow key={service.id}>
              <CalciteTableCell>{service.title}</CalciteTableCell>
              <CalciteTableCell>{service.description}</CalciteTableCell>
              {/* <CalciteTableCell>{service.url}</CalciteTableCell> */}
              <CalciteTableCell>{service.owner}</CalciteTableCell>
              <CalciteTableCell>
                {new Date(service.created).toLocaleString()}
              </CalciteTableCell>
              <CalciteTableCell alignment="center">
                <CalciteButton
                  // style={{ display: "flex", alignItems: "center" }}
                  target="_blank"
                  href={`${userCredential.server}/home/item.html?id=${service.id}`}
                  iconEnd="launch"
                  scale="m"
                  appearance="transparent"
                >
                  {i18n.t("Open")}
                </CalciteButton>
              </CalciteTableCell>
              <CalciteTableCell alignment="center">
                {isOwnedByCurrentUser(service) && (
                  <CalciteButton
                    scale="m"
                    appearance="transparent"
                    kind="danger"
                    iconStart="trash"
                    loading={deletingId === service.id}
                    disabled={deletingId !== null}
                    onClick={() => setConnectionToDelete(service)}
                  >
                    {i18n.t("Remove")}
                  </CalciteButton>
                )}
              </CalciteTableCell>
            </CalciteTableRow>
          ))}
        </CalciteTable>
      )}

      <CalciteDialog
        modal
        kind="danger"
        open={connectionToDelete !== null}
        heading={i18n.t("Remove Connection")}
        escapeDisabled={deletingId !== null}
        outsideCloseDisabled={deletingId !== null}
        onCalciteDialogClose={() => {
          if (deletingId === null) setConnectionToDelete(null);
        }}
      >
        <div>
          {i18n.t(
            'This permanently deletes the feature layer "{{title}}" and will break anything using it in ArcGIS Enterprise. This action cannot be undone.',
            { title: connectionToDelete?.title }
          )}
        </div>
        <CalciteButton
          slot="secondary"
          appearance="outline"
          disabled={deletingId !== null}
          onClick={() => setConnectionToDelete(null)}
        >
          {i18n.t("Cancel")}
        </CalciteButton>
        <CalciteButton
          slot="primary"
          kind="danger"
          iconStart="trash"
          loading={deletingId !== null}
          onClick={handleConfirmDelete}
        >
          {i18n.t("Remove")}
        </CalciteButton>
      </CalciteDialog>
        pageSize={10}
        startItem={0}
        totalItems={sortedData.length}
        style={{
          justifyContent: "center",
        }}
        onCalcitePaginationChange={(event) => {
          console.log("Page changed to:", event.target.startItem);
          // Handle pagination logic here if needed
        }}
      ></CalcitePagination> */}
    </StyledContainer>
  );
};

export default Connections;
