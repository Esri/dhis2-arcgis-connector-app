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

import React from "react";
import i18n from "@dhis2/d2-i18n";

import {
  CalciteButton,
  CalciteCard,
  CalciteLabel,
  CalcitePanel,
} from "@esri/calcite-components-react";

import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";

//import logo from "./public/dhis2-app-icon.png";

const StyledLandingPage = styled(CalcitePanel)`
  height: 100vh;
  width: 100vw;
  padding: 2.5rem;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  color: black;
  font-size: 60px;
  font-weight: 400;
  word-wrap: break-word;
  margin-bottom: 1rem;
`;

const SubHeader = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  color: dark grey;
  font-size: 20px;
  font-weight: 400;
  word-wrap: break-word;
  margin-bottom: 1rem;
`;

const DocContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  color: #00619b;
  font-size: 12px;
  margin-top: 1rem;
  a {
    color: #007ac2;
  }

  a:hover {
    color: #005293;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
`;

const Button = styled(CalciteButton)`
  margin-right: 2rem;
`;

const LandingPage = () => {
  const { signIn } = useAuth();

  return (
    <StyledLandingPage>
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <img
          src="dhis2-app-icon.png"
          alt="DHIS2 ArcGIS Connector App"
          style={{
            display: "block",
            width: "100px",
            margin: "0 auto 1rem auto",
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            justifyContent: "center",
          }}
        />
        <Header>
          {i18n.t("Welcome to the")} <br />
          {i18n.t("DHIS2 to ArcGIS Connector App")}
          <br />
        </Header>
        <SubHeader>
          <p>
            {i18n.t(
              "Connect your DHIS2 data directly to your ArcGIS Enterprise organization"
            )}
            <br />
            {i18n.t(
              "to enable seamless data sharing, analysis, and visualization."
            )}
            <br />
            <br />
            {i18n.t(
              "To get started, you will need to configure the connection between your"
            )}
            <br />
            {i18n.t("ArcGIS and DHIS2 instance through a few short steps.")}
          </p>
        </SubHeader>

        <ButtonContainer>
          {/* <Button onClick={signIn} scale="l">
              {i18n.t("Sign In with ArcGIS Online")}
            </Button> */}
          <CalciteButton iconStart="arcgis-online" onClick={signIn} scale="l">
            {i18n.t("Sign In with ArcGIS Enterprise")}
          </CalciteButton>
        </ButtonContainer>

        <DocContainer>
          <CalciteLabel>
            <p>
              <a
                href="https://www.esri.com/en-us/arcgis/products/arcgis-online/overview"
                target="_blank"
              >
                {i18n.t("View the documentation here")}
              </a>
            </p>
          </CalciteLabel>
        </DocContainer>
      </div>
    </StyledLandingPage>
  );
};

export default LandingPage;
