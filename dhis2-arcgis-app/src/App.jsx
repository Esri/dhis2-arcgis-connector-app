import { useDataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import React from "react";
import classes from "./App.module.css";
import { setAssetPath } from "@esri/calcite-components/dist/components";

// Calcite components
import "@esri/calcite-components/dist/components/calcite-button.js";
import "@esri/calcite-components/dist/components/calcite-icon.js";
import "@esri/calcite-components/dist/components/calcite-slider.js";
import "@esri/calcite-components/dist/components/calcite-shell.js";

import "@esri/calcite-components/dist/calcite/calcite.css";
import {
  CalciteButton,
  CalciteIcon,
  CalciteShell,
  CalciteSlider,
} from "@esri/calcite-components-react";

// Local assets
setAssetPath(window.location.href);

const query = {
  me: {
    resource: "me",
  },
};

const MyApp = () => {
  const { error, loading, data } = useDataQuery(query);

  if (error) {
    return <span>{i18n.t("ERROR")}</span>;
  }

  if (loading) {
    return <span>{i18n.t("Loading...")}</span>;
  }

  return (
    <CalciteShell>
      <div slot="header" style={{ height: "75px", border: "1px solid red" }}>
        app Header goes here
      </div>
      {/* <div className={classes.container}>
        <h1>{i18n.t("Hello {{name}}", { name: data.me.name })}</h1>
        <h3>{i18n.t("Welcome to DHIS2!")}</h3>
        <CalciteButton appearance="solid" color="blue" scale="m">
          <CalciteIcon icon="plus" scale="s" />
          {i18n.t("Add something")}
        </CalciteButton>
      </div> */}
    </CalciteShell>
  );
};

export default MyApp;
