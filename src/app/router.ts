// import { userStore } from "../store";
import createHashHistory from "history/createHashHistory";

export const history = createHashHistory();

/**
 * 未登录重定向到登录
 */
export function redirectToLogin() {
  if (history.location.pathname.includes("login")) {
    return;
  }
  history.replace({
    pathname: "/login",
    search: `?redirect=${encodeURIComponent(history.location.pathname)}`
  });
}

export function redirectToOrigin() {
  let urlParams = new URLSearchParams(history.location.search.replace("?", ""));
  let redirect = urlParams.get("redirect");
  if (redirect && !redirect.includes("login")) {
    history.push(decodeURIComponent(redirect));
  } else {
    history.replace("/");
  }
}
