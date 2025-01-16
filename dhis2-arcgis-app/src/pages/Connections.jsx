import React, { useEffect, useState } from "react";

import styled from "styled-components";

import i18n from "@dhis2/d2-i18n";

import { useAuth } from "../contexts/AuthContext";
import {
  CalciteTable,
  CalciteTableHeader,
  CalciteTableRow,
  CalciteTableCell,
  CalciteButton,
} from "@esri/calcite-components-react";
import { useNavigate } from "react-router-dom";
import { queryForServices } from "../util/portal";

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

  const { userCredential, portalProperties } = useAuth();

  const [services, setServices] = useState([]);

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

      {services.length > 0 && (
        <CalciteTable interactionMode="static" striped pageSize={10}>
          <CalciteTableRow slot="table-header">
            <CalciteTableHeader heading="Title"></CalciteTableHeader>
            <CalciteTableHeader heading="Description"></CalciteTableHeader>
            {/* <CalciteTableHeader heading="URL"></CalciteTableHeader> */}
            <CalciteTableHeader heading="Created By"></CalciteTableHeader>
            <CalciteTableHeader heading="Created On"></CalciteTableHeader>
            <CalciteTableHeader
              heading="View in ArcGIS"
              alignment="center"
            ></CalciteTableHeader>
          </CalciteTableRow>

          {services.map((service) => (
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
    </StyledContainer>
  );
};

export default Connections;
