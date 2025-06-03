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
