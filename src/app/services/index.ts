import axios from "../utils/axios-xinrenxinshi";
import { IResponse, ILoginGetVerify, IPageParams, IApprove } from "../interface";
import { extend } from "dayjs";

/**
 * 获取登录验证码
 * @param params :mobile 手机号码，不需要传+86
 */
export function getVerify(params: {
  mobile: string;
}): Promise<IResponse<ILoginGetVerify>> {
  return axios.post(
    "/site/ajax-send-sms-code/login",
    { mobile: `+86-${params.mobile}` }
  ) as any;
}

/**
 * 手机验证码登录
 * @param params
 * @returns {Promise<IResponse<{}>>}
 */
export function login(params: {
  mobile: string;
  verify_code: string | number;
  verify_code_id: string | number;
  type: 1;
}): Promise<IResponse<{}>> {
  return axios.post(
    "/site/ajax-login",
    params
  ) as any;
}

/**
 * 获取月份签到列表
 * @param {string} date 示例： 201806
 * @returns {AxiosPromise<any>}
 */
export function getCheckIn(date: string) {
  return axios.post(
    "/attendance/ajax-get-attendance-record-list",
    {
      yearmo: date
    }
  );
}

export function getApproveList(
  params: {
    yearmo: string;
  } & IPageParams
): Promise<IResponse<IApprove[]>> {
  return axios.get(
    "/flow/ajax-get-my-apply-list",
    {
      data: params
    }
  ) as any;
}
