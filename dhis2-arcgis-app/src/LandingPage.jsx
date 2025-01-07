import React from 'react';
import { useHistory } from 'react-router-dom';
import { CalciteButton, CalciteCard, CalciteLabel } from '@esri/calcite-components-react';
import './LandingPage.css';

const LandingPage = () => {
  const history = useHistory();

  const handleSignInOnline = () => {
    history.push('/signin'); // Redirect to the sign in page
  };

  const handleSignInEnterprise = () => {
    history.push('/signin-enterprise'); // Redirect to the ArcGIS Enterprise sign in page
  };

  return (
    <div className="pre-sign-in-screen-no-image">
      <img className="image1" src="https://via.placeholder.com/1440x48" alt="Header" />
      <div className="rectangle1"></div>
      <div className="dhis2-to-arcgis-connector-app">DHIS2 to ArcGIS Connector App</div>
      <div className="rectangle2"></div>
      <CalciteCard className="frame1">
        <CalciteLabel className="dhis2-to-arcgis-connector">
          DHIS2 to ArcGIS Connector
        </CalciteLabel>
        <CalciteLabel className="integrate-your-dhis2-data">
          Integrate your DHIS2 data into your ArcGIS Online or ArcGIS Enterprise organization to enable seamless data sharing, analysis, and visualization.
        </CalciteLabel>
        <div className="sign-in-buttons">
          <CalciteButton className="button" onClick={handleSignInOnline}>
            Sign In with ArcGIS Online
          </CalciteButton>
          <CalciteButton className="button" onClick={handleSignInEnterprise} appearance="outline">
            Sign In with ArcGIS Enterprise
          </CalciteButton>
        </div>
        <div className="arcgis-online">
          <div className="logo"></div>
        </div>
      </CalciteCard>
    </div>
  );
};

export default LandingPage;