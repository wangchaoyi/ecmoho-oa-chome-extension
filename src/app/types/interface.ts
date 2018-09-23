import { APPROVE_STATUS, FLOW_TYPE } from "./enum";
import { Moment } from "moment";

export type IWeek = 1 | 2 | 3 | 4 | 5 | 6 | 0;

export interface IOvertime {
  hour: number;
  startTime: Moment;
  endTime: Moment;
}

export interface ICheckInRecord {
  date: string;
  week: IWeek;

  /**
   * 是否为工作日
   */
  isWorkDay: boolean;
  signInAt: Moment | null; // 13位时间戳
  signOutAt: Moment | null;
  status: any;

  /**
   * 是否加班
   */
  overtime: IOvertime | null;

  /**
   * 餐补
   */
  hasFoodSubsidy?: boolean;
}

/**
 * 传送给服务器的分页参数
 */
export interface IPageParams {
  page: number;
  /**
   * 每页数量
   */
  pn: number;
}

export interface IResponse<T> {
  code: number;
  data: T;
  message: string;
  status: true;
}

/**
 * 登录验证码获取
 */
export interface ILoginGetVerify {
  code_id: number;
}

/**
 * 审批
 */
export interface IApprove {
  /**
   * 事件id
   */
  processId: number;

  /**
   * 加班类型
   */
  flowType: FLOW_TYPE;
  flowTypeDesc: string;

  /**
   * 审批状态
   */
  status: APPROVE_STATUS;
  statusDesc: string;

  applicationDatetime: string;

  /**
   * 申请时间
   */
  applicationTime: number;

  meta: {
    /**
     * 公司id
     */
    company_id: string;

    working_day: "0.0";

    /**
     * 申请理由
     */
    reason: string;

    first_id: null;

    approval_id: string;

    flow_type: string;

    leave_days: "0.0";
    total_day: "0.0";
    not_working_day: "0.0";
    already_leave_days: "0.00";
    calculate_rule: "0";

    /**
     * 加班有效开始时间(字符串时间戳)
     */
    start_date: string;

    /**
     * 加班有效结束时间(字符串时间戳)
     */
    end_date: string;

    /**
     * 申请类型描述。 例如： "加班"
     */
    flow_type_desc: string;

    /**
     * 补偿方法
     * 1: 调休
     */
    compensation_way: string;

    time_unit: "0";
    holiday_time_unit: "";
    image_path: "";

    /**
     * 申请的加班时间
     */
    overtime_hour: string;

    holiday_type_desc: "";

    /**
     * 员工id
     */
    employee_id: string;

    holiday_type: "0";
  };

  customField: "[]";
}

/**
 * 申请加班的参数
 */
export interface IApproveParams {
  start_date: string; // 2018-06-02 10:00
  end_date: string;

  /**
   * 申请类型
   */
  flow_type: FLOW_TYPE;

  /**
   * 加班时间
   */
  overtime_hour: number;

  /**
   * 申请理由
   */
  reason: string;

  image_path?: string;

  /**
   * 加班补偿规则
   * 1: 调休
   */
  overtime_compensation_rule: 1;
  custom_field: string; // json的字符串形态
}

export interface IApproveDetail {
  processId: number;
  processStepId: null;
  flowType: FLOW_TYPE;
  flowTypeDesc: string;

  /**
   * 发起人
   */
  ownerName: string;

  /**
   * 部门名称
   */
  departmentName: string;

  /**
   * 手机号码
   */
  mobile: string;

  /**
   * 职位
   */
  title: string;

  /**
   * 审批状态
   */
  status: APPROVE_STATUS;

  remark: null;

  processHistory: IApproveHistory[];

  /**
   * 是否可以结束
   */
  isCancelable: -1;

  customField: "[]";

  /**
   * 性别
   */
  gender: string;

  /**
   * 入职日期
   */
  entryDate: string;

  /**
   * 职位名称
   */
  jobName: "前端开发工程师";

  flowGroupModel: any;
}

export interface IApproveHistory {
  /**
   * 发起时间
   */
  approve_datetime: string;
  transmit_to_name: "";

  /**
   * 申请结果
   */
  approve_results: {
    /**
     * 申请id
     */
    approve_id: string;

    employeeStatus: number;

    /**
     * 操作者姓名
     */
    name: string;

    /**
     * 操作时间
     * 注： 十位数时间戳
     */
    operator_time: number;

    /**
     * 备注
     */
    remark: string;

    /**
     * 处理结果
     */
    result: number;
    result_desc: string;
  }[];

  approver_is_gray: 1;

  step_type_is_gray: 1;

  process_step_brackets: null;

  approver_name: "";

  /**
   * 操作者姓名
   */
  operator_name: string;

  step_type: number;

  remark: string | null;

  /**
   * 步骤描述
   * 例如： 审批
   */
  step_type_desc: "";

  /**
   * 通过类型描述
   */
  pass_type_desc: "最终审批人";

  /**
   * 是否为最后一步
   */
  is_final: 1 | 0;

  employeeStatus: 0;
}

export interface IApplyFoodSubsidy {
  date: number;
  money: number;
}
export interface IApplyCarSubsidy {
  date: number;
  money: number;
}
