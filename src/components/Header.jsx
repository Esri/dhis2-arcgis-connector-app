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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "@dhis2/d2-i18n";

import {
  CalciteMenu,
  CalciteNavigation,
  CalciteNavigationLogo,
  CalciteMenuItem,
  CalciteButton,
  CalciteNavigationUser,
  CalcitePopover,
  CalciteLink,
} from "@esri/calcite-components-react";
import { useAuth } from "../contexts/AuthContext";
import { useSystemSettings } from "../contexts/SystemSettingsContext";

import SubHeader from "./SubHeader";

const Header = ({ isShowingDebugInfo, setIsShowingDebugInfo }) => {
  const navigate = useNavigate();
  const { userCredential, signIn, signOut, userInformation, isLoadingAuth } =
    useAuth();

  // console.log(userCredential, userInformation, isLoadingAuth);
  const { settings } = useSystemSettings();

  const [userThumbnail, setUserThumbnail] = useState(null);
  const [myContentLink, setMyContentLink] = useState(null);

  useEffect(() => {
    if (userInformation && userCredential) {
      if (userInformation.thumbnail) {
        setUserThumbnail(
          `${userCredential.server}/sharing/rest/community/users/${userCredential.userId}/info/${userInformation.thumbnail}?token=${userCredential.token}`
        );
      } else {
        const noThumbUrl = `${userCredential.server}/home/11.4.0/js/arcgisonline/css/images/no-user-thumb.jpg`;
        setUserThumbnail(noThumbUrl);
      }

      setMyContentLink(`${userInformation.portalUrl}/home/content.html#my`);
    }
  }, [userCredential, userInformation]);

  return (
    <>
      {userCredential && userInformation && (
        <CalcitePopover
          referenceElement="user-avatar-popover"
          pointerDisabled
          autoClose
          placement="bottom"
          offsetSkidding={-5}
          offsetDistance={5}
          overlayPositioning="fixed"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "100%",
              width: "340px",
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{
                  height: "60%",
                  borderRadius: "50%",
                  border: "4px solid var(--calcite-ui-brand)",
                  marginBottom: "1rem",
                }}
                src={userThumbnail}
                alt="User Avatar"
              />
              <span
                style={{
                  color: "#000",
                  fontSize: "18px",
                  lineHeight: "25px",
                  fontWeight: "500",
                  marginBottom: "10px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  wordWrap: "break-word",
                }}
              >
                {userInformation.fullName}
              </span>
              <span
                style={{
                  marginBottom: "5px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  wordWrap: "break-word",
                  color: "#595959",
                }}
              >
                {userInformation.username}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: "1rem",
                marginLeft: "1rem",
                marginTop: "1rem",
              }}
            >
              <CalciteLink target="_blank" href={myContentLink}>
                {i18n.t("My Content")}
              </CalciteLink>
              <CalciteLink
                target="_blank"
                href="https://github.com/ArcGIS/dhis2-arcgis-connector-app/issues"
              >
                {i18n.t("Provide Feedback")}
              </CalciteLink>
              <CalciteLink
                target="_blank"
                href="https://github.com/ArcGIS/dhis2-arcgis-connector-app/blob/main/DHIS2_ArcGIS_Connector_UserManual.pdf"
              >
                {i18n.t("User Guide")}
              </CalciteLink>
              <CalciteLink target="_blank" href="mailto:globalhealth@esri.com">
                {i18n.t("Contact the Esri Team")}
              </CalciteLink>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <CalciteButton
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              {i18n.t("Sign Out")}
            </CalciteButton>
          </div>
        </CalcitePopover>
      )}
      <CalciteNavigation slot="header">
        {/* {userCredential && <SubHeader />} */}

        <CalciteNavigationLogo
          slot="logo"
          heading={i18n.t("DHIS2 to ArcGIS Connector")}
          // onClick={() =>
          //   navigate(userCredential ? "/connections" : "/", { replace: true })
          // }
          active={window.location.hash === "#/" ? true : undefined}
        ></CalciteNavigationLogo>
        <CalciteMenu slot="content-end">
          {settings?.arcgisConfig?.showDebugInfo && (
            <CalciteMenuItem
              onClick={() => setIsShowingDebugInfo(!isShowingDebugInfo)}
              text={i18n.t("Show Debug Information")}
              iconStart="debug"
              textEnabled
            ></CalciteMenuItem>
          )}
          {userCredential && (
            <CalciteMenuItem
              onClick={() =>
                navigate(userCredential ? "/connections" : "/", {
                  replace: true,
                })
              }
              text={i18n.t("Connections")}
              iconStart="layer-connection"
              textEnabled
              active={
                window.location.hash === "#/connections" ? true : undefined
              }
            ></CalciteMenuItem>
          )}
          {/* <CalciteMenuItem
            text={i18n.t("User Guide")}
            iconStart="question"
            textEnabled
          ></CalciteMenuItem>
          <CalciteMenuItem
            text={i18n.t("Provide Feedback")}
            iconStart="envelope"
            textEnabled
          ></CalciteMenuItem> */}

          <CalciteMenuItem
            text={i18n.t("Configure")}
            iconStart="gear"
            textEnabled
            onClick={() => navigate("/configure", { replace: true })}
            active={window.location.hash === "#/configure" ? true : undefined}
          ></CalciteMenuItem>

          {settings?.arcgisConfig && !userCredential && (
            <CalciteMenuItem
              text={i18n.t("Sign In")}
              iconStart="user"
              textEnabled
              onClick={signIn}
            ></CalciteMenuItem>
          )}
          <CalciteMenuItem
            text={i18n.t("User Guide")}
            iconStart="question"
            textEnabled
            onClick={() =>
              window.open(
                "https://github.com/ArcGIS/dhis2-arcgis-connector-app/blob/main/DHIS2_ArcGIS_Connector_UserManual.pdf",
                "_blank"
              )
            }
          ></CalciteMenuItem>
        </CalciteMenu>
        {userCredential && userInformation && (
          <>
            <CalciteNavigationUser
              id="user-avatar-popover"
              // ref={userRef}
              slot="user"
              fullName={userInformation.fullName}
              username={userInformation.username}
              // thumbnail={`${user.server}/sharing/rest/community/users/${user.userId}/info/${userInfo.thumbnail}?token=${user.token}`}
              thumbnail={userThumbnail}
            ></CalciteNavigationUser>
          </>
        )}
      </CalciteNavigation>
    </>
  );
};

export default Header;
