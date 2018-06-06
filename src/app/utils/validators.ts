type ErrorCallback = (error?: Error) => void;

const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * 通用的表单验证方法。
 * 备注：1. 所有方法均只校验值存在的时候的格式，不参数required的属性判断
 *      2. 返回一个闭包是某些验证方式需要传入参数。
 */
export default {
  /**
   * 验证电子邮箱格式
   */
  isEmail() {
    return (rule: any, value: any, callback: ErrorCallback) => {
      if (!value) {
        return callback();
      }
      if (emailReg.test(value)) {
        callback();
      } else {
        callback(new Error("电子邮箱格式不正确"));
      }
    };
  },

  isMobile() {
    return (rule: any, value: any, callback: ErrorCallback) => {
      if (!value) {
        return callback();
      }
      if (/^1\d{10}$/.test(value)) {
        callback();
      } else {
        callback(new Error("手机号格式不正确"));
      }
    };
  },

  /**
   * 验证密码格式
   */
  isPassword() {
    const passwordRe = /^\w{6,32}$/;
    return (rule: any, value: any, callback: ErrorCallback) => {
      if (!value) {
        return callback();
      }
      if (passwordRe.test(value)) {
        callback();
      } else {
        callback(new Error("密码格式不正确"));
      }
    };
  }
};
