/// <reference path="./types.ts" />

import * as React from "react";
import * as ReactDom from "react-dom";
import App from "./views/app";
import "ant-design-pro/dist/ant-design-pro.min.css";
import "antd/dist/antd.min.css";
import "./assets/scss/app.scss";
import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";

ReactDom.render(
  <LocaleProvider locale={zh_CN}>
    <App />
  </LocaleProvider>,
  document.getElementById("app")
);

// Hot Module Replacement
const module1: any = module;
if (module1["hot"]) {
  module1["hot"].accept();
}
