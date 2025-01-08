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
  const { user, loading } = useAuth();

  const handleNavigation = (path) => {
    if (!loading && user) {
      console.log("Navigating to:", path);
      navigate(path, { replace: true });
    }
  };

  return (
    <CalciteNavigation slot="navigation-secondary" style={{}}>
      <CalciteMenu slot="content-start">
        <CalciteMenuItem
          text="Manage Connections"
          textEnabled
          onClick={() => handleNavigation("/connections")}
        ></CalciteMenuItem>
        <CalciteMenuItem
          text="Create New Connection"
          textEnabled
          onClick={() => handleNavigation("/add-connection")}
        ></CalciteMenuItem>
      </CalciteMenu>
    </CalciteNavigation>
  );
};

export default SubHeader;
