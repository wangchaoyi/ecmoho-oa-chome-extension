import { E_DOMAIN } from "../enums";
import Cookie = chrome.cookies.Cookie;
import axios from "axios";

/**
 * 查询指定域名下面的cookie，注意需要给予对应的cookies和url权限
 * @param {E_DOMAIN} domain
 * @returns {Promise<string>} 返回拼接的字符串cookie
 */
export function getCookies(
  domain: E_DOMAIN = E_DOMAIN.XINRENXINREN
): Promise<string> {
  return new Promise(resolve => {
    chrome.cookies.getAll({ domain }, (cookies: Cookie[]) => {
      resolve(
        cookies
          .map(cookie => {
            return `${cookie.name}=${cookie.value}`;
          })
          .join("; ")
      );
    });
  });
}

/**
 * 调试专用。监听来自本地标签页转发的代理请求，获取数据后进行返回
 */
export function proxyPass(url: string) {}
