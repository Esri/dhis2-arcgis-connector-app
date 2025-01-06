import React from 'react';
import { useHistory } from 'react-router-dom';
import './ArcGISPreSignInPage.css';

const ArcGISPreSignIn = () => {
  const history = useHistory();

  const handleClick = () => {
    history.push('/signin'); // Redirect to the sign in page
  };

  return (
    <div className="pre-sign-in-screen-no-image">
      <img className="image1" src="https://via.placeholder.com/1440x48" alt="Header" />
      <div className="rectangle1"></div>
      <div className="dhis2-to-arcgis-connector-app">DHIS2 to ArcGIS Connector App</div>
      <div className="rectangle2"></div>
      <div className="frame1">
        <div className="dhis2-to-arcgis-connector">DHIS2 to ArcGIS Connector</div>
        <div className="integrate-your-dhis2-data">
          Integrate your DHIS2 data into your ArcGIS Online or ArcGIS Enterprise organization to enable seamless data sharing, analysis, and visualization.
        </div>
        <div className="sign-in-button">
          <div className="button-container">
            <div className="button" onClick={handleClick}>Sign In</div>
          </div>
        </div>
        <div className="arcgis-online">
          <div className="logo">
            <div className="path"></div>
            <div className="clipped">
              <div className="vector"></div>
              <div className="path"></div>
            </div>
            <div className="clipped">
              <div className="vector"></div>
              <div className="path"></div>
              <div className="vector"></div>
            </div>
            <div className="vector"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArcGISPreSignIn;