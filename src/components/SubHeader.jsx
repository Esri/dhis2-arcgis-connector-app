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
