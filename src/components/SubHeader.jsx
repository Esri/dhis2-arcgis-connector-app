import React from "react";
import { useNavigate } from "react-router-dom";

import i18n from "@dhis2/d2-i18n";

import {
  CalciteMenu,
  CalciteNavigation,
  CalciteMenuItem,
} from "@esri/calcite-components-react";

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
          text={i18n.t("Manage Connections")}
          textEnabled
          onClick={() => navigate("/connections", { replace: true })}
          active={window.location.hash === "#/connections" ? true : undefined}
        ></CalciteMenuItem>
        <CalciteMenuItem
          text={i18n.t("Create New Connection")}
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
