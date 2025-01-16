import React from "react";
import { CalciteDialog, CalciteLoader } from "@esri/calcite-components-react";

const CreatingLayerDialog = ({ isCurrentlyCreatingLayer }) => {
  return (
    <CalciteDialog
      modal
      outsideCloseDisabled
      closeDisabled
      open={isCurrentlyCreatingLayer}
      heading="Creating layer"
    >
      <CalciteLoader text="Your layer is being created. Please do not close this window or navigate away from this page." />
    </CalciteDialog>
  );
};

export default CreatingLayerDialog;
