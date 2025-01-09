import React from "react";
import styled from "styled-components";

import { CalciteShell } from "@esri/calcite-components-react";

const ShellContainer = styled(CalciteShell)`
  position: relative;
  background-color: white !important;
  --calcite-ui-background: white !important;
  --calcite-ui-foreground-1: white !important;
  --calcite-ui-foreground-2: white !important;
  --calcite-ui-foreground-3: white !important;
`;

export default ShellContainer;
