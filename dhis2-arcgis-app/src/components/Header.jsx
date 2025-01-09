import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const Header = () => {
  const navigate = useNavigate();
  const { userCredential, signIn, signOut, userInformation, isLoadingAuth } =
    useAuth();

  // console.log(userCredential, userInformation, isLoadingAuth);
  const { settings } = useSystemSettings();

  const [userThumbnail, setUserThumbnail] = useState(null);
  const [myContentLink, setMyContentLink] = useState(null);

  useEffect(() => {
    if (userInformation && userCredential) {
      // console.log(user, userInfo);
      setUserThumbnail(
        `${userCredential.server}/sharing/rest/community/users/${userCredential.userId}/info/${userInformation.thumbnail}?token=${userCredential.token}`
      );
      setMyContentLink(`${userInformation.portalUrl}/home/content.html#my`);
    }
  }, [userCredential, userInformation]);

  // useEffect(() => {
  //   if (!loading) {
  //     if (userCredential && settings && settings.arcgisConfig) {
  //       // if we are logged in and we have settings for arcgis
  //       // we should go to the connections page
  //       navigate("/connections", { replace: true });
  //     } else {
  //       // if we are not logged in, and we don't have settings,
  //       // we should go to the settings page
  //       navigate("/settings", { replace: true });
  //     }
  //   }
  // }, [userCredential, loading, settings]);

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
                alignItems: "center",
                marginLeft: "1rem",
              }}
            >
              <CalciteLink target="_blank" href={myContentLink}>
                My Content
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
              Sign Out
            </CalciteButton>
          </div>
        </CalcitePopover>
      )}
      <CalciteNavigation slot="header">
        {userCredential && <SubHeader />}

        <CalciteNavigationLogo
          slot="logo"
          heading="DHIS2 to ArcGIS Connector"
          // onClick={() =>
          //   navigate(userCredential ? "/connections" : "/", { replace: true })
          // }
          active={window.location.hash === "#/" ? true : undefined}
        ></CalciteNavigationLogo>
        <CalciteMenu slot="content-end">
          {userCredential && (
            <CalciteMenuItem
              onClick={() =>
                navigate(userCredential ? "/connections" : "/", {
                  replace: true,
                })
              }
              text="Home"
              iconStart="home"
              textEnabled
            ></CalciteMenuItem>
          )}
          <CalciteMenuItem
            text="User Guide"
            iconStart="question"
            textEnabled
          ></CalciteMenuItem>
          <CalciteMenuItem
            text="Provide Feedback"
            iconStart="envelope"
            textEnabled
          ></CalciteMenuItem>
          <CalciteMenuItem
            text="Configure"
            iconStart="gear"
            textEnabled
            onClick={() => navigate("/configure", { replace: true })}
            active={window.location.hash === "#/configure" ? true : undefined}
          ></CalciteMenuItem>

          {settings?.arcgisConfig && !userCredential && (
            <CalciteMenuItem
              text="Sign In"
              iconStart="user"
              textEnabled
              onClick={signIn}
            ></CalciteMenuItem>
          )}
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
