import axios from "axios";
import { DEBUG } from "../config";
import { IResponse } from "../../extension/interfaces";
import { EMessageEvent } from "../../extension/enums";
import { redirectToLogin } from "../router";

// 自定义一个axios实例
let instance = axios.create({
  baseURL: `http://oa.ecmoho.com/`,
  timeout: 10000,
  headers: {}
});

// 请求拦截
instance.interceptors.request.use(
  originalRequest => {
    if (originalRequest.data) {
      originalRequest.headers["Content-Type"] =
        "application/x-www-form-urlencoded";
      let data = "";
      for (let key in originalRequest.data) {
        if (originalRequest.data.hasOwnProperty(key)) {
          data += `&${key}=${originalRequest.data[key]}`;
        }
      }
      originalRequest.data = data;
    }

    return originalRequest;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截
instance.interceptors.response.use(
  response => {
    // if (response.data.code === 4001) {
    //   redirectToLogin();
    //   return Promise.reject(response.data);
    // }
    // if (!response.data.status) {
    //   return Promise.reject(response.data);
    // }
    return response.data;
  },
  error => {
    if (error.response.status === 500) {
    }
    if (axios.isCancel(error)) {
      console.log("promise cancel:" + error.message);
    } else {
      console.log("error:" + error);
    }
    try {
      if (error.response.status === 401) {
      }
    } catch (e) {
      console.log(e);
    }
    return Promise.reject(error.response);
  }
);

if (DEBUG) {
  // const get = (url: string, ...args: any[]) => {
  //   console.log(url, args);
  //   const listener = (message: IResponse<any>) => {
  //     console.log(`receive type: ${message.type}`);
  //     if (message.type === EMessageEvent.REQUEST_CHECK_IN) {
  //
  //     }
  //     chrome.runtime.onMessage.removeListener(listener);
  //   };
  //   chrome.runtime.onMessage.addListener(listener);
  //   chrome.runtime.sendMessage("obcfhenffidbekbokiibnnjokgjgeagb", {
  //     hello: "world"
  //   });
  // };
  // const post = () => {
  //
  // };
  //
  // get("1", 2,3,4,5,6,7,7,8);
  //
  // instance.get = get as any;
}

export default instance;
