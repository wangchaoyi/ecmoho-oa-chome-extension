/// <reference path="./types.ts" />

import * as React from "react";
import * as ReactDom from "react-dom";
import App from "./app";

ReactDom.render(<App />, document.getElementById("app"));

// Hot Module Replacement
const module1: any = module;
if (module1["hot"]) {
  module1["hot"].accept();
}
