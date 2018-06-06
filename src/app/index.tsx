/// <reference path="./types.ts" />

import * as React from "react";
import * as ReactDom from "react-dom";
import App from "./views/app";
import "ant-design-pro/dist/ant-design-pro.min.css";
import "antd/dist/antd.min.css";
import "./assets/scss/app.scss";


ReactDom.render(<App />, document.getElementById("app"));

// Hot Module Replacement
const module1: any = module;
if (module1["hot"]) {
  module1["hot"].accept();
}
