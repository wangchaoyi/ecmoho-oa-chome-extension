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
  },

  /**
   * 指定范围内的整数值，可以等于边界值
   * 特别注意： 因为需要传入最小和最大值，所以需要执行一次函数将验证函数返回才能生效
   * @param min {Number} 最小值
   * @param max {Number} 最大值
   */
  rangeNumber(min: number, max: number) {
    return (rule: any, value: any, callback: ErrorCallback) => {
      if (value === "" || value === null || !value) {
        callback();
      }
      value = parseFloat(value);
      if (parseInt(value) !== value) {
        callback(new Error("不合法的整数"));
      } else if (value > max || value < min) {
        callback(new Error(`整数范围不合法。范围: ${min}~${max}`));
      } else {
        callback();
      }
    };
  },

  /**
   * 指定范围内的浮点数值（兼容整数），可以等于边界值
   * 特别注意： 因为需要传入最小和最大值，所以需要执行一次函数将验证函数返回才能生效
   * @param min {Number} 最小值
   * @param max {Number} 最大值
   */
  rangeFloat(min: number, max: number) {
    return (rule: any, value: any, callback: ErrorCallback) => {
      if (value === "" || value === null || !value) {
        return callback();
      }
      value = parseFloat(value);
      if (value > max || value < min) {
        callback(new Error(`数字范围不合法。范围: ${min}~${max}`));
      } else {
        callback();
      }
    };
  }
};
