import axios from "../utils/axios-xinrenxinshi";
import {
  IResponse,
  ILoginGetVerify,
  IPageParams,
  IApprove,
  IApproveParams
} from "../types/interface";
import { FLOW_TYPE } from "../types/enum";

/**
 * 获取登录验证码
 * @param params :mobile 手机号码，不需要传+86
 */
export function getVerify(params: {
  mobile: string;
}): Promise<IResponse<ILoginGetVerify>> {
  return axios.post("/site/ajax-send-sms-code/login", {
    mobile: `+86-${params.mobile}`
  }) as any;
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
  return axios.post("/site/ajax-login", params) as any;
}

/**
 * 获取月份签到列表
 * @param {string} date 示例： 201806
 * @returns {AxiosPromise<any>}
 */
export function getCheckIn(date: string) {
  return axios.post("/attendance/ajax-get-attendance-record-list", {
    yearmo: date
  });
}

/**
 * 获取审批列表
 * @param params
 * @returns {Promise<IResponse<IApprove[]>>}
 */
export function getApproveList(
  params: {
    yearmo?: string;
  } & IPageParams
): Promise<IResponse<IApprove[]>> {
  return axios.get("/flow/ajax-get-my-apply-list", {
    params
  }) as any;
}

/**
 * 获取第一审批人
 */
export function getFirstApprover(
  flowType: FLOW_TYPE,
  params: IApproveParams
): Promise<IResponse<string[]>> {
  return axios.post("/flow/ajax-get-first-approver", {
    flowType,
    customField: JSON.stringify(params)
  }) as any;
}

/**
 * 发起审批
 * @param {IApproveParams} params
 * @returns {Promise<IResponse<{}>>}
 */
export function addApproval(params: IApproveParams): Promise<IResponse<{}>> {
  return axios.post(
    "/attendance/ajax-start-attendance-approval",
    params
  ) as any;
}

export function getApprovalDetail(process_id: string) {
  return axios.post(
    `/apply/ajax-get-apply-detail?process_id=${process_id}`
  ) as any;
}
