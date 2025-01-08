import React from "react";
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white !important;
  // padding-top: 5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  color: black;
  font-size: 64px;
  font-family: "Avenir Next World, Arial, sans-serif";
  font-weight: 400;
  word-wrap: break-word;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  color: black;
  font-size: 24px;
  font-family: "Avenir Next World, Arial, sans-serif";
  font-weight: 400;
  word-wrap: break-word;
`;

const DocContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  color: #00619B;
  font-size: 12px;
  font-family: "Avenir Next World, Arial, sans-serif";
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

  const handleSignInOnline = () => {
    console.log("Online");
  };

  const handleSignInEnterprise = () => {
    // history.push("/signin-enterprise"); // Redirect to the ArcGIS Enterprise sign in page
  };

  return (
    <StyledLandingPage>
      <div style={{ backgroundColor: "white", height: "100vh", padding: "1.5rem" }}>
        <Header>
          Welcome to the <br />DHIS2 to ArcGIS Connector App
        </Header>
        <Container>
          <CalciteLabel>
            <p>Integrate your DHIS2 data into your ArcGIS Online or ArcGIS Enterprise<br />organization to enable seamless data sharing, analysis, and visualization.</p>
            <p>To get started, you will need to configure the connection between your<br />ArcGIS and DHIS2 instance through a few short steps.</p>
          </CalciteLabel>
        </Container>
        <CalciteCard>
          <ButtonContainer>
            <Button onClick={signIn}>
              Sign In with ArcGIS Online
            </Button>
            <CalciteButton onClick={handleSignInEnterprise} appearance="outline">
              Sign In with ArcGIS Enterprise
            </CalciteButton>
          </ButtonContainer>
          <div className="arcgis-online">
            <div className="logo"></div>
          </div>
        </CalciteCard>
        <DocContainer>
          <CalciteLabel>
            <p><a href="https://www.esri.com/en-us/arcgis/products/arcgis-online/overview" target="_blank">Not sure? View the documentation here.</a></p>
          </CalciteLabel>
        </DocContainer>
      </div>
    </StyledLandingPage>
  );
};

export default LandingPage;