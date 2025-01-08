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
  padding: 1.5rem;
  display: flex;
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
      <div
        style={{
          // Welcome to the <br/>DHIS2 to ArcGIS Connector
          color: "black",
          fontSize: 64,
          fontFamily: "Inter",
          fontWeight: "400",
          wordWrap: "break-word",
        }}
      >
        DHIS2 to ArcGIS Connector App
      </div>
      <div className="rectangle2"></div>
      <CalciteCard className="frame1">
        <CalciteLabel className="dhis2-to-arcgis-connector">
          DHIS2 to ArcGIS Connector
        </CalciteLabel>
        <CalciteLabel className="integrate-your-dhis2-data">
          Integrate your DHIS2 data into your ArcGIS Online or ArcGIS Enterprise
          organization to enable seamless data sharing, analysis, and
          visualization.
        </CalciteLabel>
        <div className="sign-in-buttons">
          <CalciteButton className="button" onClick={signIn}>
            Sign In with ArcGIS Online
          </CalciteButton>
          <CalciteButton
            className="button"
            onClick={handleSignInEnterprise}
            appearance="outline"
          >
            Sign In with ArcGIS Enterprise
          </CalciteButton>
        </div>
        <div className="arcgis-online">
          <div className="logo"></div>
        </div>
      </CalciteCard>
      {/* <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <CalciteButton onClick={handleSignInOnline}>Online</CalciteButton>
        <CalciteButton>Enterprise</CalciteButton>
      </div> */}
    </StyledLandingPage>
  );
};

export default LandingPage;
