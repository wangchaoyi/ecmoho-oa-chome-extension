import { action, computed, observable, observe } from "mobx";
import * as moment from "moment";
import { history } from "../router";

export class UserStore {
  /* 服务器返回的数据 */
  @observable
  public user = {
    account: "", // 手机
    userName: "", // 用户名
  };

}

export default new UserStore();
