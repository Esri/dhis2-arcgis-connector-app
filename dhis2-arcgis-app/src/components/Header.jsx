import React, { useEffect, useState, useRef, createRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  CalciteMenu,
  CalciteNavigation,
  CalciteNavigationLogo,
  CalciteMenuItem,
  CalciteAction,
  CalciteButton,
  CalciteNavigationUser,
  CalcitePopover,
  CalciteLabel,
  CalciteLink,
} from "@esri/calcite-components-react";
import { useAuth } from "../contexts/AuthContext";
import SubHeader from "./SubHeader";

const Header = () => {
  const navigate = useNavigate();
  const { user, signIn, signOut, userInfo } = useAuth();

  const [userThumbnail, setUserThumbnail] = useState(null);
  const [myContentLink, setMyContentLink] = useState(null);
  const [userAvatarPopoverOpen, setUserAvatarPopoverOpen] = useState(false);

  useEffect(() => {
    if (userInfo && user) {
      // console.log(user, userInfo);
      setUserThumbnail(
        `${user.server}/sharing/rest/community/users/${user.userId}/info/${userInfo.thumbnail}?token=${user.token}`
      );
      setMyContentLink(`${userInfo.portalUrl}/home/content.html#my`);
    }
  }, [user, userInfo]);

  return (
    <>
      {user && userInfo && (
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
                {userInfo.fullName}
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
                {userInfo.username}
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
        {user && <SubHeader />}

        <CalciteNavigationLogo
          slot="logo"
          heading="DHIS2 to ArcGIS Connector"
          onClick={() => navigate("/")}
        ></CalciteNavigationLogo>
        <CalciteMenu slot="content-end">
          <CalciteMenuItem
            text="Home"
            iconStart="home"
            textEnabled
            onClick={() => navigate("/")}
          ></CalciteMenuItem>
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
            text="Settings"
            iconStart="gear"
            textEnabled
            onClick={() => navigate("/settings")}
          ></CalciteMenuItem>

          {!user && (
            <CalciteMenuItem
              text="Sign In"
              iconStart="user"
              textEnabled
              onClick={signIn}
            ></CalciteMenuItem>
          )}
        </CalciteMenu>
        {user && userInfo && (
          <>
            <CalciteNavigationUser
              id="user-avatar-popover"
              // ref={userRef}
              slot="user"
              fullName={userInfo.fullName}
              username={userInfo.username}
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
