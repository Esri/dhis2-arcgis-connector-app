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

const SubHeader = () => {
  const navigate = useNavigate();

  return (
    <CalciteNavigation
      slot="navigation-secondary"
      style={
        {
          // "--calcite-navigation-background": "green",
        }
      }
    >
      <CalciteMenu slot="content-start">
        <CalciteMenuItem
          text="Manage Connections"
          textEnabled
          onClick={() => navigate("/connections", { replace: true })}
          active={window.location.hash === "#/connections" ? true : undefined}
        ></CalciteMenuItem>
        <CalciteMenuItem
          text="Create New Connection"
          textEnabled
          onClick={() => navigate("/add-connection", { replace: true })}
          active={
            window.location.hash === "#/add-connection" ? true : undefined
          }
        ></CalciteMenuItem>
      </CalciteMenu>
    </CalciteNavigation>
  );
};

export default SubHeader;
