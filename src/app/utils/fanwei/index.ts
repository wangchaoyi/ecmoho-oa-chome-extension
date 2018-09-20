import { EOA_APPLY_TYPE } from "../../types/enum";
import axios from "../axios-fanwei";
import { message, Button } from "antd";

/**
 * 登录泛微OA
 * @param {string} username
 * @param {string} password
 * @returns {Promise<void>}
 */
export function login(username: string, password: string) {
  return axios
    .post(`/login/VerifyLogin.jsp`, {
      logintype: "1",
      fontName: "微软雅黑",
      message: "",
      gopage: "",
      formmethod: "post",
      rnd: "",
      serial: "",
      username: "",
      isie: "false",
      islanguid: "7",
      loginid: username,
      userpassword: password,
      submit: "登录"
    })
    .then((res: any) => {
      if (res.indexOf(`<span name="errorMessage" id="errorMessage">`) !== -1) {
        throw new Error("no login");
      }
      return checkIsLogin();
    })
    .then(() => {
      message.success("OA登录成功");
    });
}

/**
 * 探测OA是否登录成功
 * 原理： OA网盘中是标准的json返回，如果未登录则返回一个html重定向
 * @returns {Promise<void>}
 */
export function checkIsLogin() {
  return axios
    .post("/rdeploy/chatproject/doc/dsm.jsp", {
      foldertype: "privateAll",
      categoryid: "0",
      orderby: "time"
    })
    .then(res => {
      if (!Array.isArray(res)) {
        throw new Error("no login");
      }
    });
}

/**
 * 打开流程申请OA
 * @param {EOA_APPLY_TYPE} type
 */
export function openOAFlowApply(type: EOA_APPLY_TYPE) {
  window.open(
    `http://oa.ecmoho.com/workflow/request/AddRequest.jsp?workflowid=${type}&isagent=0&beagenter=0&f_weaver_belongto_userid=`
  );
}

export function fillOA() {
  let bodyIFame = document.getElementById("bodyiframe");
}
