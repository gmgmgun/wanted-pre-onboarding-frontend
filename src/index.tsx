import React from "react";
import {createRoot} from "react-dom/client";
import {ThemeProvider} from "styled-components";
import Router from "./Router";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/theme";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Router />
  </ThemeProvider>
);
