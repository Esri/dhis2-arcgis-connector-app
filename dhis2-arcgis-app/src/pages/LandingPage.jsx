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

const StyledLandingPage = styled(CalcitePanel)`
  height: 100vh;
  width: 100vw;
  padding: 1.5rem;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  color: black;
  font-size: 64px;
  font-weight: 400;
  word-wrap: break-word;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  color: black;
  font-size: 34px;
  font-weight: 400;
  word-wrap: break-word;
`;

const DocContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  color: #00619b;
  font-size: 12px;
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
        <Header>
          {i18n.t("Welcome to the")} <br />
          {i18n.t("DHIS2 to ArcGIS Connector App")}
        </Header>
        <Container>
          <CalciteLabel>
            <p>
              {i18n.t(
                "Connect your DHIS2 data directly to your ArcGIS Enterprise"
              )}
              <br />
              {i18n.t(
                "organization to enable seamless data sharing, analysis, and visualization."
              )}
            </p>
            <p>
              {i18n.t(
                "To get started, you will need to configure the connection between your"
              )}
              <br />
              {i18n.t("ArcGIS and DHIS2 instance through a few short steps.")}
            </p>
          </CalciteLabel>
        </Container>
        <CalciteCard>
          <ButtonContainer>
            {/* <Button onClick={signIn} scale="l">
              {i18n.t("Sign In with ArcGIS Online")}
            </Button> */}
            <CalciteButton iconStart="arcgis-online" onClick={signIn} scale="l">
              {i18n.t("Sign In with ArcGIS Enterprise")}
            </CalciteButton>
          </ButtonContainer>
        </CalciteCard>
        <DocContainer>
          <CalciteLabel>
            <p>
              <a
                href="https://www.esri.com/en-us/arcgis/products/arcgis-online/overview"
                target="_blank"
              >
                {i18n.t("View the documentation here.")}
              </a>
            </p>
          </CalciteLabel>
        </DocContainer>
      </div>
    </StyledLandingPage>
  );
};

export default LandingPage;
