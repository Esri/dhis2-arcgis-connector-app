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
import {
  CalciteTable,
  CalciteTableHeader,
  CalciteTableRow,
  CalciteTableCell,
  CalciteButton,
  CalcitePagination,
} from "@esri/calcite-components-react";

import { useNavigate, useLocation } from "react-router-dom";
import { queryForServices, pollForServices } from "../util/portal";

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
  const location = useLocation();

  const { userCredential } = useAuth();

  const [services, setServices] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    key: "created",
    direction: "desc",
  });

  const fetchServices = async () => {
    setIsRefreshing(true);
    try {
      const response = await queryForServices(
        userCredential.server,
        userCredential.token
      );
      setServices(response || []);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!userCredential) return;

    // A freshly created Connection may lag the ArcGIS search index, so poll for
    // it instead of a single fetch. The title is handed over via nav state.
    const newConnectionTitle = location.state?.newConnectionTitle;
    if (newConnectionTitle) {
      // Clear nav state so a later manual refresh doesn't re-trigger the poll.
      navigate(location.pathname, { replace: true, state: {} });
      setIsRefreshing(true);
      pollForServices({
        server: userCredential.server,
        token: userCredential.token,
        predicate: (service) =>
          service.title === newConnectionTitle ||
          service.name === newConnectionTitle,
      })
        .then((results) => setServices(results || []))
        .finally(() => setIsRefreshing(false));
    } else {
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

  const getArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "sorted asc" : "sorted desc";
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
        <CalciteButton
          style={{ marginLeft: "0.5rem" }}
          scale="l"
          appearance="outline"
          iconStart="refresh"
          loading={isRefreshing}
          disabled={isRefreshing}
          onClick={fetchServices}
        >
          {i18n.t("Refresh")}
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
          "Connections are live feeds to your DHIS2 data. The data remains in DHIS2. To delete connections, you can do so from the ArcGIS Enterprise portal."
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
              description={getArrow("title")}
            ></CalciteTableHeader>
            <CalciteTableHeader
              heading="Description"
              onClick={() => requestSort("description")}
              style={{ cursor: "pointer" }}
              description={getArrow("description")}
            ></CalciteTableHeader>
            {/* <CalciteTableHeader heading="URL"></CalciteTableHeader> */}
            <CalciteTableHeader
              heading="Created By"
              onClick={() => requestSort("owner")}
              style={{ cursor: "pointer" }}
              description={getArrow("owner")}
            ></CalciteTableHeader>
            <CalciteTableHeader
              style={{ cursor: "pointer" }}
              onClick={() => requestSort("created")}
              description={getArrow("created")}
              heading="Created On"
            ></CalciteTableHeader>
            <CalciteTableHeader
              heading="View in ArcGIS"
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
            </CalciteTableRow>
          ))}
        </CalciteTable>
      )}
      {/* <CalcitePagination
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
